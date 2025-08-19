import { useEffect } from 'react';

import { toAbs } from '@/features/ppr/lib/timeMath';
import { parseTimeToMinutes, toTime } from '@/shared/ui/time/toTime';

import type { Executor } from '../types';

/**
 * Хук: внутри каждой строки делает бандлы последовательными (без перекрытий).
 * Сдвигает только вперёд, если нужно.
 * params
 * - rowsState: текущие строки
 * - setRowsState: setState(rows) стора
 * - windowStartMin: старт окна (мин)
 */
type SetRowsState = (fn: (prev: Executor[]) => Executor[]) => void;

/** Упаковать блоки в начало окна */
function packToStart(blocks: any[], windowStartMin: number): any[] {
  if (!blocks?.length) return blocks;
  const items = blocks
    .map((b) => {
      const sMin = parseTimeToMinutes(b.startTime);
      const eMin = parseTimeToMinutes(b.endTime);
      const [, eAbs] = toAbs(sMin, eMin);
      const duration = eAbs - sMin;

      // нормализованный старт для корректной сортировки через полночь
      const sAbsForSort = sMin < windowStartMin ? sMin + 1440 : sMin;

      return { b, sAbsForSort, duration };
    })
    .sort((a, b) => a.sAbsForSort - b.sAbsForSort);

  let cursor = windowStartMin;
  return items.map(({ b, duration }) => {
    const ns = cursor;
    const ne = cursor + duration;
    cursor = ne;
    return { ...b, startTime: toTime(ns), endTime: toTime(ne) };
  });
}

/**
 * Держит каждую рабочую строку плотно слева (без зазоров),
 * «Все задачи» (id=0) не трогаем.
 */
export const useSequentialReflow = (
  rowsState: Executor[],
  setRowsState: SetRowsState,
  windowStartMin: number,
) => {
  useEffect(() => {
    if (!rowsState?.length) return;

    let changedAnyRow = false;

    const nextRows = rowsState.map((row) => {
      if (row.id === 0) return row;
      const rowBlocks = row.blocks ?? [];
      if (rowBlocks.length === 0) return row;

      const packed = packToStart(rowBlocks, windowStartMin);

      let equal = packed.length === rowBlocks.length;
      if (equal) {
        for (let i = 0; i < rowBlocks.length; i++) {
          if (
            rowBlocks[i].startTime !== packed[i].startTime ||
            rowBlocks[i].endTime !== packed[i].endTime
          ) {
            equal = false;
            break;
          }
        }
      }
      if (equal) return row;

      changedAnyRow = true;
      return { ...row, blocks: packed };
    });

    if (changedAnyRow) {
      setRowsState(() => nextRows);
    }
  }, [rowsState, setRowsState, windowStartMin]);
};
