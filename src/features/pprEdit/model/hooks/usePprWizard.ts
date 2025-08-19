/**
 * Хук для управления состоянием мастера (wizard) создания/редактирования PPR-плана.
 * Следит за шагами и вычисляет, какой шаг текущий, а какие завершены.
 */

import { useState, useMemo } from 'react';

import type { Template } from '@entities/template/model/store/templateStore.ts';

/**
 * Хук управления пошаговым мастером PPR.
 */
export const usePprWizard = () => {
  /** ID выбранной задачи (UUID) */
  const [selectedTaskId, setSelectedTaskId] = useState<string>();

  /** Флаг подтверждения вкладок */
  const [tabsConfirmed, setTabsConfirmed] = useState(false);

  /** Флаг подтверждения параметров */
  const [paramsConfirmed, setParamsConfirmed] = useState(false);

  /** Главный выбранный шаблон */
  const [mainTemplate, setMainTemplate] = useState<Template | undefined>();

  /**
   * Вычисление прогресса по шагам мастера:
   * step1 — задача выбрана
   * step2 — вкладки подтверждены
   * step3 — выбран шаблон
   * step5 — параметры подтверждены
   *
   * current — текущий шаг (0–4)
   */
  const steps = useMemo(() => {
    const step1Done = !!selectedTaskId;
    const step2Done = step1Done && tabsConfirmed;
    const step3Done = step2Done && !!(mainTemplate as any)?.key;
    const step5Done = step3Done && paramsConfirmed;

    const current = !step1Done ? 0 : !step2Done ? 1 : !step3Done ? 2 : !step5Done ? 3 : 4;

    return { step1Done, step2Done, step3Done, step5Done, current };
  }, [selectedTaskId, tabsConfirmed, paramsConfirmed, mainTemplate]);

  return {
    // состояния
    selectedTaskId,
    setSelectedTaskId,
    tabsConfirmed,
    setTabsConfirmed,
    paramsConfirmed,
    setParamsConfirmed,
    mainTemplate,
    setMainTemplate,

    // вычисляемые данные
    currentStep: steps.current,
    step3Done: steps.step3Done,
    step5Done: steps.step5Done,
  };
};
