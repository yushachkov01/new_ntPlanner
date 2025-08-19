/**
 * Хук для работы с drag-and-drop (DnD) бандлов на таймлайне.
 * Подключает сенсоры мыши и тач-экрана, обрабатывает события окончания перетаскивания
 * и обеспечивает корректное смещение, упаковку и перенос блоков между строками исполнителей.
 */
import type { DragEndEvent, DndContextProps } from '@dnd-kit/core';
import { PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useCallback } from 'react';

import { parseOverRowId } from '@/features/ppr/lib/ids';
import { toAbs } from '@/features/ppr/lib/timeMath';
import { parseTimeToMinutes, toTime } from '@/shared/ui/time/toTime';

import type { Executor } from '../types';

/**
 * Хук: сенсоры и обработчик DnD для переносов бандлов.
 * params
 * - timelineContainerRef: ref контейнера таймлайна
 * - windowSpanMin: длительность окна (мин)
 * - windowStartMin: старт окна (мин)
 * - setRowsState: setState(rows) стора
 * - onRowsChanged: (опц.) уведомление UI об изменениях (перенос между исполнителями)
 */
type SetRowsState = (fn: (prev: Executor[]) => Executor[]) => void;

/**
 * Парсит метаинформацию активного drag-элемента.
 *
 * @param activeId — id активного элемента (dragged item)
 * @returns объект { sourceRowId, tplIdx } либо null
 */
function parseActiveMeta(activeId: unknown): { sourceRowId: number; tplIdx: number } | null {
  const stringValue = String(activeId ?? '');
  const matchResult = stringValue.match(/^template-(\d+)$/);
  if (!matchResult) return null;

  const composite = Number(matchResult[1]);
  if (!Number.isFinite(composite)) return null;

  const sourceRowId = Math.floor(composite / 1000);
  const tplIdx = composite % 1000;
  return { sourceRowId, tplIdx };
}

/**
 * Упаковывает список блоков в начало окна (windowStartMin), без зазоров, с сохранением длительности.
 *
 * @param blocks — массив блоков
 * @param windowStartMin — старт окна в минутах
 * @returns новый массив блоков, сдвинутых вплотную к началу окна
 */
function packRowBlocksToStart(blocks: any[], windowStartMin: number): any[] {
  if (!blocks?.length) return blocks;

  const items = blocks
    .map((block) => {
      const startMin = parseTimeToMinutes(block.startTime);
      const endMin = parseTimeToMinutes(block.endTime);
      const [absStart, absEnd] = toAbs(startMin, endMin);
      const duration = absEnd - absStart;
      return { block, duration, absStart };
    })
    .sort((a, b) => a.absStart - b.absStart);

  let cursor = windowStartMin;
  return items.map(({ block, duration }) => {
    const newStart = cursor;
    const newEnd = cursor + duration;
    cursor = newEnd;
    return { ...block, startTime: toTime(newStart), endTime: toTime(newEnd) };
  });
}

/**
 * Находит максимальное значение конца блока в строке (в абсолютных минутах).
 *
 * @param row — строка исполнителя
 * @param fallback — значение по умолчанию, если строка пустая
 * @returns максимальный конец (endTime) в минутах
 */
function calcRowLastEndAbs(row: Executor, fallback: number): number {
  const blocks = row.blocks ?? [];
  if (!blocks.length) return fallback;

  let lastEndAbs = -Infinity;
  for (const block of blocks) {
    const startMin = parseTimeToMinutes(block.startTime);
    const endMin = parseTimeToMinutes(block.endTime);
    const [, absEnd] = toAbs(startMin, endMin);
    if (absEnd > lastEndAbs) lastEndAbs = absEnd;
  }

  return Number.isFinite(lastEndAbs) ? lastEndAbs : fallback;
}

/**
 * Сдвигает все блоки с определённым tplIdx на указанное количество минут.
 *
 * @param blocks — массив блоков
 * @param tplIdx — идентификатор бандла
 * @param deltaMin — смещение в минутах
 * @returns новый массив блоков со сдвигом
 */
function shiftBlocksOfTpl(blocks: any[], tplIdx: number, deltaMin: number): any[] {
  return blocks.map((block) => {
    if (block.tplIdx !== tplIdx) return block;
    const startMin = parseTimeToMinutes(block.startTime);
    const endMin = parseTimeToMinutes(block.endTime);
    const [absStart, absEnd] = toAbs(startMin, endMin);
    return {
      ...block,
      startTime: toTime(absStart + deltaMin),
      endTime: toTime(absEnd + deltaMin),
    };
  });
}

/**
 * Хук для настройки DnD-сенсоров и обработки переноса бандлов на таймлайне.
 *
 * @param windowStartMin — старт окна в минутах
 * @param setRowsState — функция изменения состояния строк
 * @param onRowsChanged — опциональный колбэк уведомления UI о переносе между исполнителями
 * @returns объект { sensors, handleDragEnd }
 */
export const useTimelineDnD = ({
  windowStartMin,
  setRowsState,
  onRowsChanged,
}: {
  windowStartMin: number;
  setRowsState: SetRowsState;
  onRowsChanged?: (params: {
    type: 'move';
    tplIdx: number;
    sourceRowId: number;
    targetRowId: number;
    sourceEmptyAfter: boolean;
  }) => void;
}) => {
  /** Сенсоры dnd-kit */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 8 } }),
  );

  /**
   * Обработчик окончания DnD:
   * - переносит весь «бандл» (tplIdx) в целевую строку
   * - расставляет блоки без наложений, учитывая горизонтальный сдвиг
   * - вызывает onRowsChanged, чтобы редактор обновил список исполнителей шаблона
   */
  const handleDragEnd: DndContextProps['onDragEnd'] = useCallback(
    (event: DragEndEvent) => {
      const meta = parseActiveMeta(event.active?.id);
      if (!meta) return;

      const overRowId = parseOverRowId(event.over?.id);
      if (overRowId == null || overRowId <= 0) return;

      const { sourceRowId, tplIdx } = meta;

      /** Перенос в пределах своей строки запрещаем — возвращаем на место */
      if (sourceRowId === overRowId) return;

      /** Перенос на другую строку */
      setRowsState((prevRows) => {
        const sourceIndex = prevRows.findIndex((row) => row.id === sourceRowId);
        const targetIndex = prevRows.findIndex((row) => row.id === overRowId);
        if (sourceIndex === -1 || targetIndex === -1) return prevRows;

        const sourceRow = prevRows[sourceIndex];
        const targetRow = prevRows[targetIndex];

        const movingBlocks = (sourceRow.blocks ?? []).filter((block) => block.tplIdx === tplIdx);
        if (!movingBlocks.length) return prevRows;

        const sourceRemainingBlocks = (sourceRow.blocks ?? []).filter(
          (block: any) => block.tplIdx !== tplIdx,
        );

        const lastEndAbs = calcRowLastEndAbs(targetRow, windowStartMin);

        let earliestAbs = Infinity;
        for (const block of movingBlocks) {
          const startMin = parseTimeToMinutes(block.startTime);
          const endMin = parseTimeToMinutes(block.endTime);
          const [absStart] = toAbs(startMin, endMin);
          if (absStart < earliestAbs) earliestAbs = absStart;
        }

        const delta = lastEndAbs - earliestAbs;
        const shiftedBlocks = shiftBlocksOfTpl(movingBlocks, tplIdx, delta);

        const targetAfterAppend = [...(targetRow.blocks ?? []), ...shiftedBlocks];

        /** Сразу упаковываем всю строку в начало окна (без зазоров) */
        const targetPacked = packRowBlocksToStart(targetAfterAppend, windowStartMin);

        const nextRows = prevRows.map((row, idx) => {
          if (idx === sourceIndex) return { ...row, blocks: sourceRemainingBlocks };
          if (idx === targetIndex) return { ...row, blocks: targetPacked };
          return row;
        });

        onRowsChanged?.({
          type: 'move',
          tplIdx,
          sourceRowId,
          targetRowId: overRowId,
          sourceEmptyAfter: (sourceRemainingBlocks?.length ?? 0) === 0,
        });

        return nextRows;
      });
    },
    [setRowsState, onRowsChanged, windowStartMin],
  );

  return { sensors, handleDragEnd };
};
