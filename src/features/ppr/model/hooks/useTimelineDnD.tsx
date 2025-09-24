/**
 * Хук для работы с drag-and-drop (DnD) бандлов на таймлайне.
 * Подключает сенсоры мыши и тач-экрана, обрабатывает события окончания перетаскивания
 * и обеспечивает корректное смещение, упаковку и перенос блоков между строками исполнителей.
 */
import type { DragEndEvent, DndContextProps } from '@dnd-kit/core';
import { PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useCallback } from 'react';

import { parseOverRowId, parseOverTplIdx, parseOverTplMeta } from '@/features/ppr/lib/ids';
import { parseTimeToMinutes, toTime } from '@/shared/ui/time/toTime';

import type { Executor } from '../types';
import {toAbs} from "@/shared/time";
import {calcRowLastEndAbs, shiftBlocksOfTpl} from "@/shared/timeline/packing";

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

/** Упаковка БЕЗ сортировки — сохраняем порядок блоков как есть (используем для swap/перемещения в пустую зону) */
function packRowBlocksToStartInOrder(blocks: any[], windowStartMin: number): any[] {
  if (!blocks?.length) return blocks;

  const items = blocks.map((block) => {
    const startMin = parseTimeToMinutes(block.startTime);
    const endMin = parseTimeToMinutes(block.endTime);
    const [absStart, absEnd] = toAbs(startMin, endMin);
    const duration = absEnd - absStart;
    return { block, duration };
  });

  let cursor = windowStartMin;
  return items.map(({ block, duration }) => {
    const newStart = cursor;
    const newEnd = cursor + duration;
    cursor = newEnd;
    return { ...block, startTime: toTime(newStart), endTime: toTime(newEnd) };
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

      /**
       * Вертикальный и горизонтальный сдвиги курсор
       * params
       * - event: DragEndEvent из dnd-kit
       */
      const verticalDeltaPx = event.delta?.y ?? 0;
      const horizontalDeltaPx = event.delta?.x ?? 0;

      /**
       * Разбор цели dnd (что оказалось «под курсором» в момент drop)
       * params
       * - event.over?.id: id droppable-цели
       */
      const overTplMeta = parseOverTplMeta(event.over?.id);
      const normalizedOverTplIdx =
          overTplMeta?.tplIdx ?? parseOverTplIdx(event.over?.id);
      const overRowId =
          parseOverRowId(event.over?.id) ?? overTplMeta?.rowId ?? null;

      const isOverInvalid =
          !event.over || (overRowId == null && normalizedOverTplIdx == null);

      if (isOverInvalid && Math.abs(verticalDeltaPx) >= 1) {
        setRowsState((rowsState) => {
          const { sourceRowId, tplIdx } = meta;

          const sourceIndex = rowsState.findIndex(
              (rowItem) => rowItem.id === sourceRowId,
          );
          if (sourceIndex < 0) return rowsState;

          const verticalDirection = verticalDeltaPx > 0 ? 1 : -1;
          const targetIndex = Math.max(
              0,
              Math.min(rowsState.length - 1, sourceIndex + verticalDirection),
          );
          if (targetIndex === sourceIndex) return rowsState;

          const sourceRow = rowsState[sourceIndex];
          const targetRow = rowsState[targetIndex];

          const movingBlocks =
              (sourceRow.blocks ?? []).filter((blockItem) => blockItem.tplIdx === tplIdx);
          if (!movingBlocks.length) return rowsState;

          const sourceRemainingBlocks = (sourceRow.blocks ?? []).filter(
              (blockItem: any) => blockItem.tplIdx !== tplIdx,
          );

          const targetLastEndAbs = calcRowLastEndAbs(targetRow, windowStartMin);

          let earliestAbsStart = Infinity;
          for (const blockItem of movingBlocks) {
            const [absStart] = toAbs(
                parseTimeToMinutes(blockItem.startTime),
                parseTimeToMinutes(blockItem.endTime),
            );
            if (absStart < earliestAbsStart) earliestAbsStart = absStart;
          }

          const shiftDeltaMin = targetLastEndAbs - earliestAbsStart;
          const shiftedBlocks = shiftBlocksOfTpl(movingBlocks, tplIdx, shiftDeltaMin);
          const targetPackedBlocks = packRowBlocksToStart(
              [...(targetRow.blocks ?? []), ...shiftedBlocks],
              windowStartMin,
          );

          const nextRows = rowsState.map((rowItem, rowIndex) => {
            if (rowIndex === sourceIndex)
              return { ...rowItem, blocks: sourceRemainingBlocks };
            if (rowIndex === targetIndex)
              return { ...rowItem, blocks: targetPackedBlocks };
            return rowItem;
          });

          onRowsChanged?.({
            type: 'move',
            tplIdx,
            sourceRowId,
            targetRowId: rowsState[targetIndex].id,
            sourceEmptyAfter: (sourceRemainingBlocks?.length ?? 0) === 0,
          });

          return nextRows;
        });
        return;
      }

      /**
       * Вертикальный фолбэк over
       * params
       * - verticalDeltaPx: вертикальный сдвиг указателя
       */
      const VERTICAL_ROW_THRESHOLD_PX = 32;
      if (overRowId === meta.sourceRowId && Math.abs(verticalDeltaPx) >= VERTICAL_ROW_THRESHOLD_PX) {
        setRowsState((rowsState) => {
          const { sourceRowId, tplIdx } = meta;

          const sourceIndex = rowsState.findIndex(
              (rowItem) => rowItem.id === sourceRowId,
          );
          if (sourceIndex < 0) return rowsState;

          const verticalDirection = verticalDeltaPx > 0 ? 1 : -1;
          const targetIndex = Math.max(
              0,
              Math.min(rowsState.length - 1, sourceIndex + verticalDirection),
          );
          if (targetIndex === sourceIndex) return rowsState;

          const sourceRow = rowsState[sourceIndex];
          const targetRow = rowsState[targetIndex];

          const movingBlocks =
              (sourceRow.blocks ?? []).filter((blockItem) => blockItem.tplIdx === tplIdx);
          if (!movingBlocks.length) return rowsState;

          const sourceRemainingBlocks = (sourceRow.blocks ?? []).filter(
              (blockItem: any) => blockItem.tplIdx !== tplIdx,
          );

          const targetLastEndAbs = calcRowLastEndAbs(targetRow, windowStartMin);

          let earliestAbsStart = Infinity;
          for (const blockItem of movingBlocks) {
            const [absStart] = toAbs(
                parseTimeToMinutes(blockItem.startTime),
                parseTimeToMinutes(blockItem.endTime),
            );
            if (absStart < earliestAbsStart) earliestAbsStart = absStart;
          }

          const shiftDeltaMin = targetLastEndAbs - earliestAbsStart;
          const shiftedBlocks = shiftBlocksOfTpl(movingBlocks, tplIdx, shiftDeltaMin);
          const targetPackedBlocks = packRowBlocksToStart(
              [...(targetRow.blocks ?? []), ...shiftedBlocks],
              windowStartMin,
          );

          const nextRows = rowsState.map((rowItem, rowIndex) => {
            if (rowIndex === sourceIndex)
              return { ...rowItem, blocks: sourceRemainingBlocks };
            if (rowIndex === targetIndex)
              return { ...rowItem, blocks: targetPackedBlocks };
            return rowItem;
          });

          onRowsChanged?.({
            type: 'move',
            tplIdx,
            sourceRowId,
            targetRowId: rowsState[targetIndex].id,
            sourceEmptyAfter: (sourceRemainingBlocks?.length ?? 0) === 0,
          });

          return nextRows;
        });
        return;
      }


      const { sourceRowId, tplIdx } = meta;

      /**
       * Основная ветка: обрабатываем swap/пустую зону в своей строке и перенос между строками
       * params
       * - overRowId: строка, куда дропнули
       * - normalizedOverTplIdx: tplIdx бандла, на который «наехали», если есть
       */
      setRowsState((prevRows) => {
        if (overRowId == null && normalizedOverTplIdx == null) {
          return prevRows;
        }

        /** SWAP внутри своей строки при «наезде» на другой бандл */
        if (
            overRowId === sourceRowId &&
            normalizedOverTplIdx != null &&
            normalizedOverTplIdx !== tplIdx
        ) {
          const rowIndex = prevRows.findIndex((rowItem) => rowItem.id === sourceRowId);
          if (rowIndex < 0) return prevRows;

          const blocks = prevRows[rowIndex].blocks ?? [];

          const groupOrder: number[] = [];
          for (const blockItem of blocks) {
            if (!groupOrder.includes(blockItem.tplIdx)) groupOrder.push(blockItem.tplIdx);
          }

          const fromIndex = groupOrder.indexOf(tplIdx);
          const toIndex = groupOrder.indexOf(normalizedOverTplIdx);
          if (fromIndex < 0 || toIndex < 0) return prevRows;

          const newOrder = [...groupOrder];
          newOrder.splice(fromIndex, 1);
          newOrder.splice(toIndex, 0, tplIdx);

          const blocksByGroup = new Map<number, any[]>();
          for (const blockItem of blocks) {
            const list = blocksByGroup.get(blockItem.tplIdx) ?? [];
            list.push(blockItem);
            blocksByGroup.set(blockItem.tplIdx, list);
          }

          const reorderedBlocks = newOrder.flatMap(
              (groupKey) => blocksByGroup.get(groupKey) ?? [],
          );
          const packedBlocks = packRowBlocksToStartInOrder(
              reorderedBlocks,
              windowStartMin,
          );

          return prevRows.map((rowItem, i) =>
              i === rowIndex ? { ...rowItem, blocks: packedBlocks } : rowItem,
          );
        }

        /** Пустая зона своей строки: влево — в начало, вправо — в конец */
        if (overRowId === sourceRowId && normalizedOverTplIdx == null) {
          const rowIndex = prevRows.findIndex((rowItem) => rowItem.id === sourceRowId);
          if (rowIndex < 0) return prevRows;

          const blocks = prevRows[rowIndex].blocks ?? [];

          const groupOrder: number[] = [];
          for (const blockItem of blocks) {
            if (!groupOrder.includes(blockItem.tplIdx)) groupOrder.push(blockItem.tplIdx);
          }

          const fromIndex = groupOrder.indexOf(tplIdx);
          if (fromIndex < 0) return prevRows;

          const isMovingLeft = horizontalDeltaPx < 0;

          const newOrder = [...groupOrder];
          newOrder.splice(fromIndex, 1);
          isMovingLeft ? newOrder.unshift(tplIdx) : newOrder.push(tplIdx);

          const blocksByGroup = new Map<number, any[]>();
          for (const blockItem of blocks) {
            const list = blocksByGroup.get(blockItem.tplIdx) ?? [];
            list.push(blockItem);
            blocksByGroup.set(blockItem.tplIdx, list);
          }

          const reorderedBlocks = newOrder.flatMap(
              (groupKey) => blocksByGroup.get(groupKey) ?? [],
          );
          const packedBlocks = packRowBlocksToStartInOrder(
              reorderedBlocks,
              windowStartMin,
          );

          return prevRows.map((rowItem, i) =>
              i === rowIndex ? { ...rowItem, blocks: packedBlocks } : rowItem,
          );
        }

          /** Перенос между строками */
          const targetRowId = overRowId!;
          if (targetRowId === sourceRowId) return prevRows;

        const sourceIndex = prevRows.findIndex((row) => row.id === sourceRowId);
        const targetIndex = prevRows.findIndex((row) => row.id === targetRowId);
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
          targetRowId,
          sourceEmptyAfter: (sourceRemainingBlocks?.length ?? 0) === 0,
        });

        return nextRows;
      });
    },
    [setRowsState, onRowsChanged, windowStartMin],
  );

  return { sensors, handleDragEnd };
};
