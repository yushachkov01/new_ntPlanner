/**
 * Хук для управления списками исполнителей
 * - Хранит исполнителей по каждому шаблону (executorsByTemplate).
 * - Поддерживает вкладку "Исполнители" (tabExecutors).
 * - Гарантирует, что текущий пользователь всегда добавляется как исполнитель,
 *   если выбран главный шаблон и список пустой.
 * - Предоставляет функции для добавления и удаления исполнителей.
 */

import { useEffect, useMemo, useState } from 'react';

import { normalizeExec, normalizeExecId } from '@features/pprEdit/ui/utils/execUtils/execUtils';

/**
 * Хук управления исполнителями PPR.
 *
 * @param currentUser — текущий пользователь
 * @param mainTemplate —  шаблон
 */
export const usePprExecutors = (currentUser: any, mainTemplate: any) => {
  const [executorsByTemplate, setExecutorsByTemplate] = useState<any[][]>(
    currentUser ? [[normalizeExec(currentUser)]] : [[]],
  );

  /**
   * Исполнители, отображаемые во вкладке "Исполнители".
   */
  const [tabExecutors, setTabExecutors] = useState<any[]>(
    (executorsByTemplate[0] ?? []).map(normalizeExec),
  );

  /**
   * Автоматически добавляет текущего пользователя как исполнителя,
   */
  useEffect(() => {
    if (mainTemplate && executorsByTemplate[0].length === 0 && currentUser) {
      const currentUserExec = normalizeExec(currentUser);
      setExecutorsByTemplate((previousList) => {
        const updatedList = [...previousList];
        updatedList[0] = [currentUserExec];
        return updatedList;
      });
      setTabExecutors([currentUserExec]);
    }
  }, [mainTemplate, currentUser, executorsByTemplate]);

  /**
   * Уникальный список всех исполнителей из всех шаблонов.
   */
  const pprExecutors = useMemo(
    () =>
      Array.from(
        new Map(
          (executorsByTemplate.flat() as any[])
            .map(normalizeExec)
            .map((executor) => [String(executor.id), executor]),
        ).values(),
      ),
    [executorsByTemplate],
  );

  /**
   * Добавление исполнителя в указанный шаблон.
   *
   * @param templateIndex шаблона
   * @param executor исполнитель для добавления
   */
  const addExecutor = (templateIndex: number, executor: any) =>
    setExecutorsByTemplate((previousList) => {
      const updatedList = [...previousList];
      if (!Array.isArray(updatedList[templateIndex])) updatedList[templateIndex] = [];
      const normalizedExecutor = normalizeExec(executor);
      const executorKey = String(normalizedExecutor.id);

      const alreadyExists = updatedList[templateIndex].some(
        (item: any) => String(item.id) === executorKey,
      );
      if (!alreadyExists) {
        updatedList[templateIndex].push(normalizedExecutor);
      }

      return updatedList;
    });

  /**
   * Удаление исполнителя из указанного шаблона.
   *
   * @param templateIndex индекс шаблона
   * @param executorId ID исполнителя для удаления
   */
  const removeExecutor = (templateIndex: number, executorId: number | string) =>
    setExecutorsByTemplate((previousList) => {
      const updatedList = [...previousList];
      updatedList[templateIndex] = (updatedList[templateIndex] ?? []).filter(
        (item: any) => String(item.id) !== String(executorId),
      );
      return updatedList;
    });

  return {
    executorsByTemplate,
    setExecutorsByTemplate,
    tabExecutors,
    setTabExecutors,
    pprExecutors,
    addExecutor,
    removeExecutor,
    normalizeExecId,
  };
};
