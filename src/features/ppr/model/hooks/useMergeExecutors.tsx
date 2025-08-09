import { useEffect } from 'react';

import { toRowId } from '@/features/ppr/lib/ids';
import type { User } from '@entities/users/model/mapping/mapping';

import type { Executor } from '../types';

/**
 * Хук: синхронизирует список исполнителей из пропсов с rows в сторе.
 * Не трогает blocks, только создаёт/обновляет строки.
 * params
 * - executors: входные исполнители
 * - setRowsState: setState(rows) для стора таймлайна
 */
type SetRowsState = (fn: (prev: Executor[]) => Executor[]) => void;

export const useMergeExecutors = (executors: User[] | any[], setRowsState: SetRowsState) => {
  useEffect(() => {
    setRowsState((prevRows: Executor[] = []) => {
      const prevById = new Map<number, Executor>(
        (prevRows ?? []).map((row) => [Number(row.id), row]),
      );

      const mergedRows: Executor[] = (executors ?? [])
        .map((userLike: any) => {
          const rowId = toRowId(userLike?.id);
          const existedRow = prevById.get(rowId);

          return existedRow
            ? {
                ...existedRow,
                author:
                  userLike?.author ??
                  userLike?.fio ??
                  userLike?.name ??
                  userLike?.username ??
                  `User ${userLike?.id}`,
                role: userLike?.role ?? userLike?.position ?? existedRow.role ?? '',
              }
            : {
                id: rowId,
                author:
                  userLike?.author ??
                  userLike?.fio ??
                  userLike?.name ??
                  userLike?.username ??
                  `User ${userLike?.id}`,
                role: userLike?.role ?? userLike?.position ?? '',
                blocks: [],
              };
        })
        .filter(Boolean) as Executor[];

      return mergedRows as any;
    });
  }, [executors, setRowsState]);
};
