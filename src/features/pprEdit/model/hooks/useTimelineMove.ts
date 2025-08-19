/**
 * Хук для обработки Drag & Drop (DnD) перемещений исполнителей на таймлайне PPR-плана.
 * Управляет обновлением состояния исполнителей при переносе между строками/шаблонами.
 */

import useTimelineStore, { toRowId } from '@entities/timeline/model/store/timelineStore';
import { userStore } from '@entities/user/model/store/UserStore';
import { useUserStore } from '@entities/users/model/store/userStore';
import { normalizeExec, putFirst } from '@features/pprEdit/ui/utils/execUtils/execUtils';

/**
 * Обрабатывает DnD между исполнителями:
 *  - перенос в рамках одной строки или между строками,
 *  - привязка исполнителей к шаблону,
 *  - обновление состояния таба «Исполнители»,
 *  - корректировка строк («схлопывание» пустых доп. строк).
 *
 * @param executorsByTemplate список исполнителей по каждому шаблону
 * @param setExecutorsByTemplate setter для обновления executorsByTemplate
 * @param tabExecutors список исполнителей во вкладке «Исполнители»
 * @param setTabExecutors setter для обновления tabExecutors
 * @param mainTemplate шаблон
 * @param additionalTemplates список дополнительных шаблонов
 *
 * @returns функцию-обработчик перемещений (DnD)
 */
export const useTimelineMove = ({
  executorsByTemplate,
  setExecutorsByTemplate,
  tabExecutors,
  setTabExecutors,
  mainTemplate,
  additionalTemplates,
}: {
  executorsByTemplate: any[][];
  setExecutorsByTemplate: React.Dispatch<React.SetStateAction<any[][]>>;
  tabExecutors: any[];
  setTabExecutors: React.Dispatch<React.SetStateAction<any[]>>;
  mainTemplate: any;
  additionalTemplates: any[];
}) => {
  /** Проверка — один ли и тот же исполнитель (строка) */
  const isSamePersonRow = useTimelineStore((storeState) => storeState.isSamePersonRow);

  /** Схлопывание пустой дополнительной строки для исполнителя */
  const collapseEmptyExtraFor = useTimelineStore((storeState) => storeState.collapseEmptyExtraFor);

  /** Сдвиг всех блоков строки в начало */
  const snapRowLeft = useTimelineStore((storeState) => (storeState as any).snapRowLeft);

  /** Все пользователи системы */
  const allUsers = useUserStore((storeState) => storeState.users || []);

  /** Текущий пользователь */
  const currentUser = userStore((storeState) => storeState.user);

  /**
   * Получить ID корневой строки (если это дополнительная строка «+» — вернуть parentId)
   * @param rowId идентификатор строки
   * @returns ID корневой строки
   */
  const getRootRowId = (rowId: number) => {
    const rows = useTimelineStore.getState().rows ?? [];
    const row = rows.find((row) => row.id === rowId);
    return row?.isExtra ? row.parentId! : rowId;
  };

  /**
   * Получить исполнителя по ID строки (rowId).
   *
   * @param rowId идентификатор строки
   * @returns нормализованный исполнитель или null
   */
  const resolveExecutorByRowId = (rowId: number) => {
    const baseId = getRootRowId(rowId);

    const fromTab = (tabExecutors as any[]).find(
      (user) =>
        toRowId(
          user?.id ?? user?.user_id ?? user?.userId ?? user?.value ?? user?.key ?? user?.user?.id,
        ) === baseId,
    );
    if (fromTab) return normalizeExec(fromTab);

    const fromAll = allUsers.find(
      (user: any) =>
        toRowId(
          user?.id ?? user?.user_id ?? user?.userId ?? user?.value ?? user?.key ?? user?.user?.id,
        ) === baseId,
    );
    if (fromAll) return normalizeExec(fromAll);

    if (currentUser && toRowId(currentUser?.id) === baseId) {
      return normalizeExec(currentUser);
    }
    return null;
  };

  /**
   * Определить индекс слота шаблона по ключу.
   * @param templateKey ключ шаблона
   * @returns индекс (0 — главный, 1..N — дополнительные, -1 — не найдено)
   */
  const resolveTemplateSlotIndex = (templateKey?: string): number => {
    if (!templateKey) return -1;
    if ((mainTemplate as any)?.key === templateKey) return 0;
    const additionalIndex = additionalTemplates.findIndex(
      (tpl) => (tpl as any)?.key === templateKey,
    );
    return additionalIndex >= 0 ? additionalIndex + 1 : -1;
  };

  /**
   * Основной обработчик DnD
   *
   * @param templateKey ключ шаблона, в который переносим
   * @param sourceKey исходный ключ блока
   * @param sourceRowId ID строки-источника
   * @param targetRowId ID строки-цели
   * @param sourceEmptyAfter true, если после перемещения строка-источник осталась пустой
   */
  return ({
    templateKey,
    sourceKey,
    sourceRowId,
    targetRowId,
    sourceEmptyAfter,
  }: {
    templateKey?: string;
    sourceKey?: string;
    sourceRowId: number;
    targetRowId: number;
    sourceEmptyAfter: boolean;
  }) => {
    const isSame = sourceRowId === targetRowId || isSamePersonRow?.(sourceRowId, targetRowId);
    if (isSame) {
      snapRowLeft?.(getRootRowId(sourceRowId));
      if (sourceEmptyAfter) collapseEmptyExtraFor?.(sourceRowId);
      return;
    }

    /** Определяем ключ шаблона */
    const keyFromSource = sourceKey ? String(sourceKey).split('::')[0] : undefined;
    const effectiveTemplateKey = templateKey ?? keyFromSource;

    /** Определяем индекс слота */
    let slotIndex = resolveTemplateSlotIndex(effectiveTemplateKey);
    if (slotIndex < 0) slotIndex = 0;

    /** Исполнитель для добавления и удаления */
    const addExecutor = resolveExecutorByRowId(targetRowId);
    const removeExecutor = resolveExecutorByRowId(sourceRowId);
    const removeIdStr = removeExecutor ? String(removeExecutor.id) : null;

    if (!addExecutor) {
      if (sourceEmptyAfter) collapseEmptyExtraFor?.(sourceRowId);
      return;
    }

    /** Обновляем список исполнителей */
    setExecutorsByTemplate((prevExecutors) => {
      const nextExecutors = prevExecutors.map((slot) => [...(slot ?? [])]);

      /** Добавляем исполнителя в нужный слот */
      nextExecutors[slotIndex] = putFirst(nextExecutors[slotIndex] ?? [], addExecutor);

      /** Удаляем исполнителя из других слотов, если источник опустел */
      if (sourceEmptyAfter && removeIdStr) {
        for (let i = 0; i < nextExecutors.length; i++) {
          nextExecutors[i] = (nextExecutors[i] ?? []).filter(
            (exec) => String(exec.id) !== removeIdStr,
          );
        }
      }
      return nextExecutors;
    });

    /** обновляем вкладку исполнителей */
    if (slotIndex === 0) setTabExecutors((prev) => putFirst(prev, addExecutor));

    /** Сдвигаем блоки в начало (визуальное выравнивание) */
    const destinationBase = getRootRowId(targetRowId);
    const sourceBase = getRootRowId(sourceRowId);
    snapRowLeft?.(destinationBase);
    snapRowLeft?.(sourceBase);

    /** Если источник опустел — схлопываем доп. строку */
    if (sourceEmptyAfter) collapseEmptyExtraFor?.(sourceRowId);
  };
};
