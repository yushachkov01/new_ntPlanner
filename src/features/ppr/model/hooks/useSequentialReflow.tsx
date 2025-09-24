import { useEffect } from 'react';


import type { Executor } from '../types';
import {packRowBlocksToStart} from "@/shared/timeline/packing";

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
  return packRowBlocksToStart(blocks, windowStartMin);
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
