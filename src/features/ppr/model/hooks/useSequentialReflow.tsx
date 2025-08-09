import { useEffect } from 'react';

import { absEnd } from '@/features/ppr/lib/timeMath';
import { parseTimeToMinutes, toTime } from '@/shared/ui/time/toTime';

import type { Executor, BlockExt } from '../types';

/**
 * Хук: внутри каждой строки делает бандлы последовательными (без перекрытий).
 * Сдвигает только вперёд, если нужно.
 * params
 * - rowsState: текущие строки
 * - setRowsState: setState(rows) стора
 * - windowStartMin: старт окна (мин)
 */
type SetRowsState = (fn: (prev: Executor[]) => Executor[]) => void;

export const useSequentialReflow = (
  rowsState: Executor[],
  setRowsState: SetRowsState,
  windowStartMin: number,
) => {
  useEffect(() => {
    if (!Array.isArray(rowsState) || rowsState.length === 0) return;

    setRowsState((prevRows: Executor[]) => {
      let changedAnyRow = false;

      const nextRows = prevRows.map((row) => {
        const rowBlocks = row.blocks ?? [];
        if (rowBlocks.length === 0) return row;

        const blocksByTemplate = new Map<number, BlockExt[]>();
        for (const block of rowBlocks) {
          if (!blocksByTemplate.has(block.tplIdx)) blocksByTemplate.set(block.tplIdx, []);
          blocksByTemplate.get(block.tplIdx)!.push(block);
        }

        const bundleInfos = [...blocksByTemplate.values()].map((bundleBlocks) => {
          const minStartAbs = Math.min(
            ...bundleBlocks.map((block) => parseTimeToMinutes(block.startTime)),
          );
          const maxEndAbs = Math.max(
            ...bundleBlocks.map((block) => {
              const startAbs = parseTimeToMinutes(block.startTime);
              const endAbs = absEnd(startAbs, parseTimeToMinutes(block.endTime));
              return endAbs;
            }),
          );
          return { blocks: bundleBlocks, startAbs: minStartAbs, endAbs: maxEndAbs };
        });

        bundleInfos.sort((left, right) => left.startAbs - right.startAbs);

        let cursorAbs = bundleInfos.length ? bundleInfos[0].startAbs : windowStartMin;

        for (const bundleInfo of bundleInfos) {
          const targetStartAbs = Math.max(cursorAbs, bundleInfo.startAbs);
          if (targetStartAbs > bundleInfo.startAbs) {
            const shift = targetStartAbs - bundleInfo.startAbs;

            for (const block of bundleInfo.blocks) {
              const startAbs = parseTimeToMinutes(block.startTime);
              const endAbs = absEnd(startAbs, parseTimeToMinutes(block.endTime));
              block.startTime = toTime(startAbs + shift);
              block.endTime = toTime(endAbs + shift);
            }

            bundleInfo.startAbs += shift;
            bundleInfo.endAbs += shift;
            changedAnyRow = true;
          }

          cursorAbs = bundleInfo.endAbs;
        }

        return changedAnyRow ? { ...row, blocks: [...rowBlocks] } : row;
      });

      return changedAnyRow ? nextRows : prevRows;
    });
  }, [rowsState, setRowsState, windowStartMin]);
};
