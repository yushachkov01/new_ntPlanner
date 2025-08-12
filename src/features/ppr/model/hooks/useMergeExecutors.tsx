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
      const previousRows = Array.isArray(prevRows) ? prevRows : [];

      /** родительские строки  */
      const previousParents = previousRows.filter((row) => !(row as any).isExtra);
      /** дополнительные строки  */
      const previousExtras = previousRows.filter((row) => (row as any).isExtra);

      /** обновлённые родительские строки по входящему списку */
      const incomingParents: Executor[] = (executors ?? []).map((executor: any) => {
        const rowId = toRowId(
          executor?.id ?? executor?.user_id ?? executor?.value ?? executor?.key,
        );
        const existingParent = previousParents.find(
          (parent) => Number((parent as any).id) === rowId,
        );
        const author =
          executor?.author ??
          executor?.fio ??
          executor?.name ??
          executor?.username ??
          `User ${executor?.id}`;
        const role = executor?.role?.name ?? executor?.role ?? (existingParent as any)?.role ?? '';

        return existingParent
          ? { ...(existingParent as any), author, role }
          : ({ id: rowId, author, role, blocks: [] } as any);
      });

      const parentMap = new Map(
        incomingParents.map((parentRow) => [Number((parentRow as any).id), parentRow]),
      );

      /** синхронизируем extra с актуальными ФИО/ролями родителя */
      const extrasByParent = new Map<number, Executor[]>();
      for (const extraRow of previousExtras as any[]) {
        const parentId = Number(extraRow.parentId ?? 0);
        if (!parentId || !parentMap.has(parentId)) continue;
        const parentRow = parentMap.get(parentId)!;
        const syncedExtra = {
          ...extraRow,
          author: (parentRow as any).author,
          role: (parentRow as any).role,
        };
        if (!extrasByParent.has(parentId)) extrasByParent.set(parentId, []);
        extrasByParent.get(parentId)!.push(syncedExtra);
      }

      /** сохраняем порядок как был */
      const result: Executor[] = [];
      const usedParents = new Set<number>();

      for (const previousRow of previousRows as any[]) {
        if (previousRow.isExtra) continue;
        const parentId = Number(previousRow.id);
        const parentRow = parentMap.get(parentId);
        if (!parentRow) continue;

        if (!usedParents.has(parentId)) {
          result.push(parentRow);
          usedParents.add(parentId);
          const extras = extrasByParent.get(parentId) ?? [];
          result.push(...extras);
        }
      }

      /** новые родители (которых раньше не было) добавим в конец */
      for (const parentRow of incomingParents as any[]) {
        const parentId = Number(parentRow.id);
        if (!usedParents.has(parentId)) {
          result.push(parentRow);
        }
      }

      return result as any;
    });
  }, [executors, setRowsState]);
};
