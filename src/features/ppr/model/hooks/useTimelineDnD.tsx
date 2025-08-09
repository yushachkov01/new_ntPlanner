import type { DragEndEvent, DndContextProps } from '@dnd-kit/core';
import { PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useCallback } from 'react';

import { parseOverRowId } from '@/features/ppr/lib/ids';
import { toAbs, findNearestFreeStart } from '@/features/ppr/lib/timeMath';
import { parseTimeToMinutes, toTime } from '@/shared/ui/time/toTime';

import type { Executor } from '../types';

/**
 * Хук: сенсоры и обработчик DnD для переносов бандлов.
 * params
 * - timelineContainerRef: ref контейнера таймлайна
 * - windowSpanMin: длительность окна (мин)
 * - windowStartMin: старт окна (мин)
 * - setRowsState: setState(rows) стора
 */
type SetRowsState = (fn: (prev: Executor[]) => Executor[]) => void;

export const useTimelineDnD = ({
  timelineContainerRef,
  windowSpanMin,
  windowStartMin,
  setRowsState,
}: {
  timelineContainerRef: React.RefObject<HTMLDivElement>;
  windowSpanMin: number;
  windowStartMin: number;
  setRowsState: SetRowsState;
}) => {
  /** Сенсоры dnd-kit */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  );

  /**
   * Обработчик окончания DnD:
   * - переносит весь «бандл» (tplIdx) в целевую строку
   * - расставляет блоки без наложений, учитывая горизонтальный сдвиг
   */
  const handleDragEnd: DndContextProps['onDragEnd'] = useCallback(
    (event: DragEndEvent) => {
      const activeIdStr = event.active.id.toString();
      if (!activeIdStr.startsWith('template-')) return;

      const uniqueId = Number(activeIdStr.replace('template-', ''));
      const sourceRowId = Math.floor(uniqueId / 1000);
      const templateIndex = uniqueId % 1000;

      const overRowRaw = parseOverRowId(event.over?.id);
      const targetRowId = overRowRaw && overRowRaw !== 0 ? overRowRaw : sourceRowId;

      const containerWidth = timelineContainerRef.current?.getBoundingClientRect().width ?? 1;
      const deltaMinutes = (event.delta.x / containerWidth) * windowSpanMin;

      setRowsState((prevRows: Executor[]) => {
        const nextRows = prevRows.map((row) => ({
          ...row,
          blocks: [...(row.blocks ?? [])],
        }));

        const sourceRow = nextRows.find((row) => row.id === sourceRowId);
        if (!sourceRow) return prevRows;

        const movingBundle = sourceRow.blocks!.filter((block) => block.tplIdx === templateIndex);
        sourceRow.blocks = sourceRow.blocks!.filter((block) => block.tplIdx !== templateIndex);
        if (movingBundle.length === 0) return prevRows;

        const minStartBefore = Math.min(
          ...movingBundle.map((block) => parseTimeToMinutes(block.startTime)),
        );

        const bundlePieces = movingBundle.map((block) => {
          const startMin = parseTimeToMinutes(block.startTime);
          const endMin = parseTimeToMinutes(block.endTime);
          const [startAbsMin, endAbsMin] = toAbs(startMin, endMin);
          return {
            block,
            offsetFromMin: startAbsMin - minStartBefore,
            duration: endAbsMin - startAbsMin,
          };
        });

        const totalDuration = bundlePieces.reduce((sum, piece) => sum + piece.duration, 0);
        const desiredStartAbs = minStartBefore + deltaMinutes;

        const destinationRow = nextRows.find((row) => row.id === targetRowId) ?? sourceRow;

        const busyIntervals = (destinationRow.blocks ?? []).map((destinationBlock) => {
          const startMin = parseTimeToMinutes(destinationBlock.startTime);
          const endMin = parseTimeToMinutes(destinationBlock.endTime);
          const [startAbsMin, endAbsMin] = toAbs(startMin, endMin);
          return { s: startAbsMin, e: endAbsMin };
        });

        const placeStartAbs = findNearestFreeStart(
          desiredStartAbs,
          totalDuration,
          busyIntervals,
          windowStartMin,
        );

        const nextTplIdx =
          (destinationRow.blocks?.length
            ? Math.max(...destinationRow.blocks.map((block) => block.tplIdx))
            : -1) + 1;

        for (const piece of bundlePieces) {
          const startAbsMin = placeStartAbs + piece.offsetFromMin;
          const endAbsMin = startAbsMin + piece.duration;
          piece.block.startTime = toTime(startAbsMin);
          piece.block.endTime = toTime(endAbsMin);
          piece.block.tplIdx = nextTplIdx;
        }

        destinationRow.blocks!.push(...movingBundle);
        return nextRows;
      });
    },
    [timelineContainerRef, windowSpanMin, windowStartMin, setRowsState],
  );

  return { sensors, handleDragEnd };
};
