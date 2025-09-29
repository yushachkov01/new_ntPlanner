import React, { useEffect, useMemo, useRef, useState } from 'react';

import './PprEditorPage.css';
import { usePlannedTaskStore } from '@/entities/PlannedTask/model/store/plannedTaskStore';
import {
  YAML_BUCKET,
  STEP_ICON_SIZE,
  WS_EVENT_PLANNED_TASK_STATUS,
  PROGRESS_EVENT_NAME,
} from '@/shared/constants';
import { subscribe as wsSubscribe } from '@/shared/ws/wsClient';
import LocationOverview from '@/widgets/layout/LocationOverview/ui/LocationOverview';
import type { Template } from '@entities/template/model/store/templateStore';
import { templateStore } from '@/entities/template/model/store/templateStore';
import useTimelineStore from '@entities/timeline/model/store/timelineStore';
import { userStore } from '@entities/user/model/store/UserStore';
import { useUserStore } from '@entities/users/model/store/userStore';
import { WorkTimeStore } from '@entities/workTimeStore/model/store/workTimeStore';
import { isUuid, pickUuid } from '@features/pprEdit/lib/utils/utils';
import { usePprExecutors } from '@features/pprEdit/model/hooks/usePprExecutors';
import { usePprWizard } from '@features/pprEdit/model/hooks/usePprWizard';
import { useTimelineMove } from '@features/pprEdit/model/hooks/useTimelineMove';
import { savePlannedTask } from '@features/pprEdit/model/services/savePlannedTask';
import ConfirmDeleteDialog from '@features/pprEdit/ui/ConfirmDeleteDialog/ConfirmDeleteDialog';
import DynamicYamlForm from '@features/pprEdit/ui/DynamicYamlForm/DynamicYamlForm';
import { PlannedTaskDropdown } from '@features/pprEdit/ui/PlannedTaskDropdown/PlannedTaskDropdown';
import PprEditorTabs from '@features/pprEdit/ui/PprEditorTabs/PprEditorTabs';
import { normalizeExec } from '@features/pprEdit/ui/utils/execUtils/execUtils';
import type { ProgressMap } from '@features/pprEdit/ui/utils/requiredUtils/requiredUtils';
import { countRequiredInYaml } from '@features/pprEdit/ui/utils/requiredUtils/requiredUtils';
import { resolveTemplateWithRaw } from '@features/pprEdit/ui/utils/templateRaw/templateRaw';
import YamlTemplateSelect from '@features/pprEdit/ui/yamlTemplate/YamlTemplateSelect';
import PprPage from '@pages/PprPage';

import { Button, Steps, message, Tooltip, Progress, Modal } from 'antd';

import PprDraftAutosave from '@/features/pprEdit/ui/PprDraftAutosave/PprDraftAutosave';
import {
  clearDraftForTask,
  hasDraftForTask,
  loadV2Snapshots,
  loadCompatSnapshot,
  loadCompatParams,
  loadV2Params,
  patchStageTimeInLocalStorage,
  UnifiedStagesSnapshot,
} from '@/shared/persist/pprDraft';

const PprEditorPage: React.FC = () => {
  const {
    selectedTaskId,
    setSelectedTaskId,
    tabsConfirmed,
    setTabsConfirmed,
    paramsConfirmed,
    setParamsConfirmed,
    mainTemplate,
    setMainTemplate,
    currentStep,
    step3Done,
    step5Done,
  } = usePprWizard();

  const currentUser = userStore((state) => state.user)!;
  const workTimeStore = WorkTimeStore() as any;
  const { timelineWindow, setTimelineWindow } = workTimeStore;
  const selectedTimeWorkId: string | undefined = workTimeStore?.selectedTimeWorkId;

  const addedExecutors = useUserStore((state) => state.addedExecutors);

  const tasks = usePlannedTaskStore((state) => state.tasks);
  const selectedTask = useMemo(() => tasks.find((task) => task.id === selectedTaskId), [tasks, selectedTaskId]);

  /** Исполнители (по шаблонам) */
  const {
    executorsByTemplate,
    setExecutorsByTemplate,
    tabExecutors,
    setTabExecutors,
    pprExecutors,
    addExecutor,
    removeExecutor,
    normalizeExecId,
  } = usePprExecutors(currentUser, mainTemplate);

  /** Таймлайн-стор API */
  const removeBySourcePrefix = useTimelineStore((state) => (state as any).removeBySourcePrefix);
  const updateTplStageDuration = useTimelineStore((state) => (state as any).updateTplStageDuration);
  const getMergedStageOverrides = useTimelineStore((state) => (state as any).getMergedStageOverrides);
  const getTimelineState = (useTimelineStore as any).getState;

  /** Шаблоны доп. вкладок */
  const [additionalTemplates, setAdditionalTemplates] = useState<Template[]>([]);
  const [hiddenExtraSlots, setHiddenExtraSlots] = useState<Set<number>>(new Set());

  const handleMoveBetweenExecutors = useTimelineMove({
    executorsByTemplate,
    setExecutorsByTemplate,
    tabExecutors,
    setTabExecutors,
    mainTemplate,
    additionalTemplates,
  });

  /** Флаги появления строк таймлайна */
  const liveRowsCount = useTimelineStore((state) => state.rows?.length ?? 0);
  useEffect(() => {
    if (liveRowsCount > 0) setParamsConfirmed(true);
  }, [liveRowsCount, setParamsConfirmed]);

  /** refs */
  const paramsRef = useRef<HTMLDivElement | null>(null);
  const [tplReadyTick, setTplReadyTick] = useState(0);
  useEffect(() => {
    if ((mainTemplate as any)?.raw) setTplReadyTick((tick) => tick + 1);
  }, [mainTemplate]);

  const mainFormValuesRef = useRef<any>(null);

  /** Review/lock */
  const [reviewForId, setReviewForId] = useState<string | null>(null);
  const [statusVerified, setStatusVerified] = useState(false);
  const editingLocked = !!reviewForId && !statusVerified;

  useEffect(() => {
    const unsubscribe = wsSubscribe((wsMessage: any) => {
      if (!wsMessage || wsMessage.type !== WS_EVENT_PLANNED_TASK_STATUS) return;
      const incomingId = String(wsMessage.id ?? '');
      const incomingStatus = String(wsMessage.status ?? '');
      if (!incomingId) return;
      if (reviewForId && incomingId === reviewForId) {
        if (incomingStatus.toLowerCase() === 'verified') {
          setStatusVerified(true);
          setReviewForId(null);
          message.success('Заявка утверждена тимлидом');
        }
      }
    });
    return () => unsubscribe?.();
  }, [reviewForId]);

  /** Добавить ещё шаблон */
  const addTemplate = () => {
    if (editingLocked) return;
    const meExec = normalizeExec(currentUser);
    const newIndex = additionalTemplates.length;
    setAdditionalTemplates((prev) => [...prev, {} as Template]);
    setExecutorsByTemplate((prevList) => [...prevList, currentUser ? [meExec] : []]);
    setHiddenExtraSlots((prev) => {
      const next = new Set(prev);
      next.delete(newIndex);
      return next;
    });
    setAllowStep5(false);
  };

  /** Смена шаблона вкладки */
  const changeTemplate = async (index: number, newTemplate: Template) => {
    if (editingLocked) return;
    const prevKey = (additionalTemplates[index] as any)?.key;
    const execIds = (executorsByTemplate[index + 1] ?? []).map(normalizeExecId);
    if (prevKey) removeBySourcePrefix?.({ execIds, prefix: String(prevKey) });

    const resolved = await resolveTemplateWithRaw(newTemplate as Template, YAML_BUCKET);
    if (!resolved) return message.error('Не удалось загрузить YAML шаблона.');

    setAdditionalTemplates((prev) => prev.map((t, i) => (i === index ? resolved : t)));
    setHiddenExtraSlots((prev) => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
    setAllowStep5(false);
  };

  /** Подтверждение удаления */
  const [confirmState, setConfirmState] = useState<{ open: true; kind: 'main' | 'extra'; index?: number } | { open: false }>({ open: false });

  /** Исполнители для таймлайна */
  const timelineExecutors = useMemo(() => {
    const list = (pprExecutors as any[]) ?? [];
    if (list.length > 0) return list;
    return (tabExecutors ?? []).map(normalizeExec);
  }, [pprExecutors, tabExecutors]);

  /** Автор и смена */
  const authorUuid =
      pickUuid((currentUser as any)?.id, (currentUser as any)?.uuid) ??
      pickUuid(...(addedExecutors ?? []).map((v) => v.id)) ??
      pickUuid((selectedTask as any)?.authorId, (selectedTask as any)?.author_id);

  const timeWorkUuid =
      (selectedTimeWorkId && isUuid(selectedTimeWorkId) ? selectedTimeWorkId : undefined) ??
      pickUuid((selectedTask as any)?.timeWorkId, (selectedTask as any)?.time_work_id);

  /** Сохранение */
  const [saving, setSaving] = useState(false);
  const templateChosen = Boolean((mainTemplate as any)?.key);

  /** Прогресс по required */
  const [progressMap, setProgressMap] = useState<ProgressMap>({});
  useEffect(() => {
    const handler = (event: Event) => {
      const { id, filled, required } = (event as CustomEvent<{ id: string; filled: number; required: number }>).detail || ({} as any);
      if (!id) return;
      setProgressMap((prev) => ({ ...prev, [id]: { filled, required } }));
    };
    window.addEventListener(PROGRESS_EVENT_NAME, handler as EventListener);
    return () => window.removeEventListener(PROGRESS_EVENT_NAME, handler as EventListener);
  }, []);

  const totals = useMemo(
      () =>
          Object.values(progressMap).reduce(
              (acc, v) => ({ filled: acc.filled + (v?.filled ?? 0), required: acc.required + (v?.required ?? 0) }),
              { filled: 0, required: 0 }
          ),
      [progressMap]
  );

  const yamlRequiredTotal = useMemo(() => {
    let sum = 0;
    const mainRaw = (mainTemplate as any)?.raw;
    if (mainRaw) sum += countRequiredInYaml(mainRaw);
    for (const t of additionalTemplates) {
      const raw = (t as any)?.raw;
      if (raw) sum += countRequiredInYaml(raw);
    }
    return sum;
  }, [mainTemplate, additionalTemplates]);

  const effectiveRequired = useMemo(() => Math.max(totals.required, yamlRequiredTotal), [totals.required, yamlRequiredTotal]);
  const totalPercent = useMemo(() => {
    if (effectiveRequired <= 0) return 0;
    const clamped = Math.min(totals.filled, effectiveRequired);
    return Math.round((clamped / effectiveRequired) * 100);
  }, [totals.filled, effectiveRequired]);

  const isParamsComplete = effectiveRequired === 0 ? true : totals.filled >= effectiveRequired;

  /** Разрешение шага 5 только после Save */
  const [allowStep5, setAllowStep5] = useState(false);

  const canSave = isParamsComplete && templateChosen && Boolean(selectedTaskId && authorUuid && timeWorkUuid);
  const saveTooltip =
      !isParamsComplete
          ? 'Заполните все обязательные поля (100%)'
          : !templateChosen
              ? 'Выберите шаблон YAML'
              : !selectedTaskId
                  ? 'Выберите задачу'
                  : !authorUuid
                      ? 'Нет author_id (UUID пользователя/исполнителя)'
                      : !timeWorkUuid
                          ? 'Нет time_work_id (выберите смену/интервал)'
                          : undefined;

  const handleSave = async () => {
    if (saving || editingLocked) return;
    if (!templateChosen) return message.error('Не выбран YAML-шаблон (шаг «Шаблон»).');
    if (!isParamsComplete) return message.error('Заполните все обязательные поля (100%).');

    setAllowStep5(true);
    setSaving(true);
    setStatusVerified(false);
    try {
      const result = await savePlannedTask({
        mainTemplate,
        selectedTask,
        executorsByTemplate,
        getMergedStageOverrides,
        getTimelineState,
        mainFormValues: mainFormValuesRef.current,
        createNew: true,
        selectedTaskId: selectedTaskId ?? undefined,
        authorUuid: authorUuid ?? undefined,
        timeWorkUuid: timeWorkUuid ?? undefined,
      });
      if (result?.createdId) setReviewForId(result.createdId);
      if (result?.updatedId) setReviewForId(result.updatedId);
    } catch (error: any) {
      console.error('[PprEditorPage] save error:', error);
      console.error(`Не удалось сохранить: ${error?.response?.errors?.[0]?.message ?? error?.message ?? 'unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  /** ======== ВОССТАНОВЛЕНИЕ ИЗ localStorage ======== */

  const restoringTaskRef = useRef<string | null>(null);
  const restoreCacheRef = useRef<{ compat?: UnifiedStagesSnapshot; v2?: ReturnType<typeof loadV2Snapshots> } | null>(null);

  const applySnapshotToTimeline = (tplIdx: number, snap?: UnifiedStagesSnapshot) => {
    if (!snap || !snap.stages) return;
    // 1) Таймеры
    for (const [stageKey, stage] of Object.entries(snap.stages)) {
      const timeStr = (stage as any)?.time;
      if (!timeStr || typeof timeStr !== 'string') continue;
      const mm = Math.max(0, parseInt(String(timeStr).replace(/\D+/g, ''), 10) || 0);
      updateTplStageDuration?.({ tplIdx, stageKey, minutes: mm });
    }
    // 2) Поля-оверрайды (если есть API в сторе)
    const tl = (useTimelineStore as any).getState?.();
    const setStageFieldEdits = tl?.setStageFieldEdits ?? tl?.mergeStageFieldEdits;
    if (typeof setStageFieldEdits === 'function') {
      const perRow: Record<string, Record<string, any>> = { '0': {} };
      for (const [stageKey, stage] of Object.entries(snap.stages)) {
        const srcFields = ((stage as any)?.fields) || {};
        const payload: Record<string, any> = {};
        for (const [fieldKey, f] of Object.entries(srcFields)) {
          const v = (f && typeof f === 'object' && 'value' in (f as any)) ? (f as any).value : f;
          if (v !== undefined) payload[fieldKey] = v;
        }
        if (Object.keys(payload).length > 0) perRow['0'][stageKey] = { value: payload };
      }
      try {
        setStageFieldEdits(perRow);
      } catch {}
    }
  };

  // const restoreFromLocalStorage = async (taskId: string) => {
  //   restoringTaskRef.current = taskId;
  //
  //   // 1) Совместимость: восстановим params v1
  //   const compatParams = loadCompatParams(taskId);
  //   if (compatParams && typeof compatParams === 'object') {
  //     const store = templateStore.getState();
  //     for (const [key, entries] of Object.entries(compatParams)) {
  //       store.setTemplateValues?.(key, Array.isArray(entries) ? entries : []);
  //     }
  //   }
  //
  //   // 2) V2 params (по шаблонам/исполнителям) — мержим по templateKey
  //   const v2params = loadV2Params(taskId);
  //   if (v2params.length) {
  //     const grouped = new Map<string, any[]>();
  //     v2params.forEach(({ templateKey, rows }) => {
  //       if (!rows?.length) return;
  //       const prev = grouped.get(templateKey) ?? [];
  //       grouped.set(templateKey, [...prev, ...rows]);
  //     });
  //     const store = templateStore.getState();
  //     for (const [tKey, rows] of grouped.entries()) {
  //       store.setTemplateValues?.(tKey, rows);
  //     }
  //   }
  //
  //   // 3) Снапшоты стадий
  //   const compat = loadCompatSnapshot(taskId);
  //   const v2 = loadV2Snapshots(taskId);
  //   restoreCacheRef.current = { compat, v2 };
  //
  //   // основной шаблон
  //   if (compat?.mainTemplateKey) {
  //     const resolvedMain = await resolveTemplateWithRaw({ key: compat.mainTemplateKey } as any, YAML_BUCKET);
  //     if (resolvedMain) setMainTemplate(resolvedMain);
  //   }
  //
  //   // executors
  //   if (compat?.executorsByTemplate) {
  //     setExecutorsByTemplate(compat.executorsByTemplate);
  //     setTabExecutors((prev) => (prev.length ? prev : compat.executorsByTemplate[0] || []));
  //   }
  //
  //   // extra шаблоны
  //   const extraTemplateKeys = Array.from(
  //       new Set((v2 || []).map((x) => x.templateKey).filter((k) => k && k !== compat?.mainTemplateKey))
  //   );
  //   if (extraTemplateKeys.length) {
  //     const resolved = await Promise.all(extraTemplateKeys.map((k) => resolveTemplateWithRaw({ key: k } as any, YAML_BUCKET)));
  //     setAdditionalTemplates(resolved.filter(Boolean) as any);
  //   }
  //
  //   // ускорим переход к форме/параметрам
  //   setParamsConfirmed(true);
  //   setAllowStep5(true);
  // };
  const restoreFromLocalStorage = async (taskId: string) => {
    restoringTaskRef.current = taskId;

    // 1) Совместимость: params V1
    const compatParams = loadCompatParams(taskId);
    if (compatParams && typeof compatParams === 'object') {
      const store = templateStore.getState();
      for (const [tKey, entries] of Object.entries(compatParams)) {
        const rows = Array.isArray(entries) ? entries : [];
        // ВАЖНО: добавить __sourceKey
        store.setTemplateValues?.(tKey, rows.map((r) => ({ __sourceKey: tKey, ...r })));
      }
    }

    // 2) V2 params по шаблонам/исполнителям
    const v2params = loadV2Params(taskId);
    if (v2params.length) {
      const grouped = new Map<string, any[]>();
      v2params.forEach(({ templateKey, rows }) => {
        if (!rows?.length) return;
        const prev = grouped.get(templateKey) ?? [];
        // ВАЖНО: добавить __sourceKey для каждой строки
        grouped.set(templateKey, [...prev, ...rows.map((r) => ({ __sourceKey: templateKey, ...r }))]);
      });
      const store = templateStore.getState();
      for (const [tKey, rows] of grouped.entries()) {
        store.setTemplateValues?.(tKey, rows);
      }
    }

    // 3) Снапшоты стадий
    const compat = loadCompatSnapshot(taskId);
    const v2 = loadV2Snapshots(taskId);
    restoreCacheRef.current = { compat, v2 };

    // главный шаблон
    if (compat?.mainTemplateKey) {
      const resolvedMain = await resolveTemplateWithRaw({ key: compat.mainTemplateKey } as any, YAML_BUCKET);
      if (resolvedMain) setMainTemplate(resolvedMain);
    }

    // executors
    if (compat?.executorsByTemplate) {
      setExecutorsByTemplate(compat.executorsByTemplate);
      setTabExecutors((prev) => (prev.length ? prev : compat.executorsByTemplate[0] || []));
    }

    // доп. шаблоны
    const extraTemplateKeys = Array.from(
        new Set((v2 || []).map((x) => x.templateKey).filter((k) => k && k !== compat?.mainTemplateKey))
    );
    if (extraTemplateKeys.length) {
      const resolved = await Promise.all(
          extraTemplateKeys.map((k) => resolveTemplateWithRaw({ key: k } as any, YAML_BUCKET))
      );
      setAdditionalTemplates(resolved.filter(Boolean) as any);
    }

    // включаем шаг параметров, чтобы форма смонтировалась
    setParamsConfirmed(true);
    setAllowStep5(true);

    // СРАЗУ пересобираем таймлайн после того, как значения форм улетели в store
    const tl = (useTimelineStore as any).getState?.();
    tl?.rebuildAll?.();
    // и ещё раз после рендера формы — на случай, если строки создаются эффектором формы
    setTimeout(() => (useTimelineStore as any).getState?.()?.rebuildAll?.(), 0);
  };

  // когда строки появились — применяем длительности/поля по кэшу восстановления
  useEffect(() => {
    const taskId = restoringTaskRef.current;
    if (!taskId) return;
    if (liveRowsCount <= 0) return;

    const cache = restoreCacheRef.current;
    if (!cache) return;

    applySnapshotToTimeline(0, cache.compat);

    const v2 = cache.v2 || [];
    additionalTemplates.forEach((tpl, i) => {
      const tplIdx = i + 1;
      const tKey = (tpl as any)?.key;
      if (!tKey) return;
      const found = v2.find((x) => x.templateKey === tKey)?.snapshot;
      if (found) applySnapshotToTimeline(tplIdx, found);
    });

    restoringTaskRef.current = null;
    restoreCacheRef.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveRowsCount, additionalTemplates]);

  /** UI: шаги */
  const pendingTitle: React.ReactNode =
      editingLocked && !statusVerified ? (
          <span className="ppr-step-title">
        <span className="ppr-step-pulse" />
        <span>На проверке</span>
      </span>
      ) : (
          'На проверке'
      );

  const computedStepsCurrent = (() => {
    let computed = currentStep;
    if (statusVerified) computed = Math.max(computed, 5);
    else if (editingLocked) computed = Math.max(computed, 4);
    if (computed >= 3) {
      if (!isParamsComplete) return 3;
      if (!allowStep5) return 3;
    }
    return computed;
  })();

  const showStep4Progress = currentStep >= 3;
  const paramsStepIcon = showStep4Progress ? (
      <span className="ppr-steps__progress-icon" style={{ display: 'flex' }}>
      <Progress
          type="circle"
          percent={totalPercent}
          size={STEP_ICON_SIZE}
          strokeLinecap="round"
          status={totalPercent === 100 ? 'success' : 'normal'}
          format={(p) => `${p ?? 0}%`}
      />
    </span>
  ) : undefined;

  return (
      <section className="ppr-editor-card">
        <PprDraftAutosave
            taskId={selectedTaskId}
            mainTemplate={mainTemplate}
            executorsByTemplate={executorsByTemplate}
            templates={[mainTemplate, ...additionalTemplates]}
        />

        <div style={{ padding: '8px 16px 0 16px' }}>
          <Steps
              current={computedStepsCurrent}
              items={[
                { title: 'Задача' },
                { title: 'Значения (в табе)' },
                { title: 'Шаблон' },
                { title: 'Параметры шаблона', icon: paramsStepIcon },
                { title: pendingTitle },
                { title: 'Заявка готова' },
              ]}
          />
        </div>

        <header className="ppr-editor-card__header">
          <div className="ppr-location-divider" />
          <LocationOverview />
          <div className="ppr-location-divider" />
        </header>

        <div className="ppr-editor-card__controls" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="ppr-editor-card__controls-left" style={{ width: '100%' }}>
            <PlannedTaskDropdown
                className="ppr-editor-card__select"
                placeholder="Список выбранных планируемых работ"
                value={selectedTaskId}
                disabled={editingLocked}
                onChange={async (taskId) => {
                  if (editingLocked) return;

                  const proceedOpen = async () => {
                    setSelectedTaskId(taskId);
                    setTabsConfirmed(false);
                    setMainTemplate(undefined);
                    setParamsConfirmed(false);
                    setAllowStep5(false);
                  };

                  if (taskId && hasDraftForTask(taskId)) {
                    Modal.confirm({
                      title: 'Вы желаете продолжить редактирование?',
                      content: 'Найден сохранённый черновик в этом браузере.',
                      okText: 'Продолжить',
                      cancelText: 'Начать заново',
                      okButtonProps: { type: 'primary' },
                      cancelButtonProps: { danger: true },
                      onOk: async () => {
                        await proceedOpen();
                        await restoreFromLocalStorage(taskId);
                      },
                      onCancel: async () => {
                        clearDraftForTask(taskId);
                        await proceedOpen();
                      },
                    });
                  } else {
                    await proceedOpen();
                  }
                }}
            />
          </div>

          <Tooltip title={saveTooltip || (editingLocked ? 'Заявка на проверке' : undefined)}>
            <Button type="primary" onClick={handleSave} loading={saving} disabled={!canSave || editingLocked}>
              Сохранить
            </Button>
          </Tooltip>
        </div>

        {!!selectedTaskId && (
            <div style={{ marginTop: 12 }}>
              <div className="ppr-editor-card__controls-right" style={editingLocked ? { pointerEvents: 'none', opacity: 0.6 } : undefined}>
                <div className="ppr-editor-card__tabs">
                  <PprEditorTabs
                      taskId={selectedTaskId}
                      onWorkTimeChange={setTimelineWindow}
                      executors={tabExecutors}
                      addExecutor={(executorToAdd) =>
                          setTabExecutors((prev) =>
                              prev.some((e) => String(e.id) === String((executorToAdd as any).id)) ? prev : [...prev, normalizeExec(executorToAdd)]
                          )
                      }
                      removeExecutor={(executorId) => setTabExecutors((prev) => prev.filter((e) => String(e.id) !== String(executorId)))}
                  />
                </div>

                {!tabsConfirmed && (
                    <div style={{ marginTop: 12 }}>
                      <Button type="primary" onClick={() => setTabsConfirmed(true)} disabled={editingLocked}>
                        Перейти к выбору шаблона
                      </Button>
                    </div>
                )}
              </div>
            </div>
        )}

        {tabsConfirmed && (
            <div className="ppr-template-wrap" style={{ marginTop: 16, ...(editingLocked ? { pointerEvents: 'none', opacity: 0.6 } : {}) }}>
              <YamlTemplateSelect
                  bucket={YAML_BUCKET}
                  value={(mainTemplate as any)?.key}
                  disabled={editingLocked as any}
                  onChange={async (selectedTemplate) => {
                    if (editingLocked) return;
                    const prevMainKey = (mainTemplate as any)?.key;
                    const execIds = (executorsByTemplate[0] ?? []).map(normalizeExecId);
                    if (prevMainKey) removeBySourcePrefix?.({ execIds, prefix: String(prevMainKey) });

                    if (currentUser) {
                      const meExec = normalizeExec(currentUser);
                      setExecutorsByTemplate((prev) => {
                        const next = [...prev];
                        const mainList = next[0] ?? [];
                        const hasMe = mainList.some((e) => String(e.id) === String(meExec.id));
                        next[0] = hasMe ? mainList : [meExec, ...mainList];
                        return next;
                      });
                      setTabExecutors((prev) => (prev.some((e) => String(e.id) === String(meExec.id)) ? prev : [meExec, ...prev]));
                    }

                    const resolved = await resolveTemplateWithRaw(selectedTemplate as Template, YAML_BUCKET);
                    if (!resolved) return message.error('Не удалось загрузить YAML шаблона.');
                    setMainTemplate(resolved);
                    setParamsConfirmed(false);
                    setAllowStep5(false);
                    setTimeout(() => paramsRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
                  }}
                  executors={(executorsByTemplate[0] ?? []).map(normalizeExec)}
                  addExecutor={(executor) => addExecutor(0, executor)}
                  removeExecutor={(executorId) => removeExecutor(0, executorId)}
                  tabCandidates={tabExecutors}
              />
              <Button
                  className="ppr-template-wrap__delete"
                  danger
                  ghost
                  disabled={editingLocked || !(mainTemplate as any)?.key}
                  onClick={() => setConfirmState({ open: true, kind: 'main' })}
              >
                Удалить шаблон
              </Button>
            </div>
        )}

        {step3Done && (
            <div ref={paramsRef} style={editingLocked ? { pointerEvents: 'none', opacity: 0.6 } : undefined}>
              {(mainTemplate as any)?.key && (mainTemplate as any)?.raw && (
                  <DynamicYamlForm
                      key={`main-${(mainTemplate as any)?.key}-${tplReadyTick}`}
                      schema={(mainTemplate as any)?.raw}
                      templateKey={(mainTemplate as any)?.key}
                      executors={(executorsByTemplate[0] ?? []).map(normalizeExec)}
                      onRowCountChange={(rowCount: number) => !paramsConfirmed && rowCount > 0 && setParamsConfirmed(true)}
                      onValuesChange={(formValues: any) => {
                        if (editingLocked) return;
                        mainFormValuesRef.current = formValues;
                        setAllowStep5(false);
                      }}
                  />
              )}
            </div>
        )}

        {additionalTemplates.map((templateItem, templateIndex) => {
          if (hiddenExtraSlots.has(templateIndex)) return null;
          return (
              <React.Fragment key={templateIndex}>
                <div className="ppr-template-wrap" style={{ marginTop: 12, ...(editingLocked ? { pointerEvents: 'none', opacity: 0.6 } : {}) }}>
                  <YamlTemplateSelect
                      bucket={YAML_BUCKET}
                      value={(templateItem as any).key}
                      disabled={editingLocked as any}
                      onChange={(newTemplate) => {
                        changeTemplate(templateIndex, newTemplate);
                        setAllowStep5(false);
                      }}
                      executors={(executorsByTemplate[templateIndex + 1] ?? []).map(normalizeExec)}
                      addExecutor={(executor) => addExecutor(templateIndex + 1, executor)}
                      removeExecutor={(executorId) => removeExecutor(templateIndex + 1, executorId)}
                      tabCandidates={tabExecutors}
                  />
                  <Button
                      className="ppr-template-wrap__delete"
                      danger
                      ghost
                      disabled={editingLocked || !(templateItem as any)?.key}
                      onClick={() => setConfirmState({ open: true, kind: 'extra', index: templateIndex })}
                  >
                    Удалить шаблон
                  </Button>
                </div>

                {(templateItem as any)?.key && (templateItem as any)?.raw && (
                    <DynamicYamlForm
                        key={`extra-${templateIndex}-${(templateItem as any)?.key}-${tplReadyTick}`}
                        schema={(templateItem as any)?.raw}
                        templateKey={(templateItem as any)?.key}
                        executors={(executorsByTemplate[templateIndex + 1] ?? []).map(normalizeExec)}
                        onRowCountChange={() => {}}
                    />
                )}
              </React.Fragment>
          );
        })}

        {step5Done && (
            <>
              <Button type="dashed" onClick={addTemplate} style={{ marginTop: 12 }} disabled={editingLocked}>
                Добавить шаблон
              </Button>

              <div className="ppr-editor-card__timeline" style={editingLocked ? { pointerEvents: 'none', opacity: 0.6 } : undefined}>
                <PprPage
                    gridStart={timelineWindow.start}
                    gridEnd={timelineWindow.end}
                    executors={timelineExecutors}
                    executorsByTemplate={executorsByTemplate}
                    onBlockClick={() => {}}
                    onTimerChange={(templateIdx, stageKey, newTimerMinutes) => {
                      if (editingLocked) return;

                      updateTplStageDuration?.({ tplIdx: templateIdx, stageKey, minutes: Number(newTimerMinutes) || 0 });

                      if (selectedTaskId) {
                        patchStageTimeInLocalStorage({
                          taskId: selectedTaskId,
                          tplIdx: templateIdx,
                          stageKey,
                          minutes: Number(newTimerMinutes) || 0,
                          mainTemplate,
                          executorsByTemplate,
                          templates: [mainTemplate, ...additionalTemplates],
                        });
                      }
                      setAllowStep5(false);
                    }}
                    onMoveBetweenExecutors={handleMoveBetweenExecutors}
                />
              </div>
            </>
        )}

        <ConfirmDeleteDialog
            open={!!confirmState.open}
            kind={confirmState.open ? confirmState.kind : undefined}
            index={confirmState.open ? confirmState.index : undefined}
            mainTemplate={mainTemplate}
            additionalTemplates={additionalTemplates}
            executorsByTemplate={executorsByTemplate}
            normalizeExecId={normalizeExecId}
            removeBySourcePrefix={removeBySourcePrefix}
            setMainTemplate={setMainTemplate}
            setParamsConfirmed={setParamsConfirmed}
            setTabsConfirmed={setTabsConfirmed}
            setAdditionalTemplates={setAdditionalTemplates}
            setHiddenExtraSlots={setHiddenExtraSlots}
            onCancel={() => setConfirmState({ open: false })}
        />
      </section>
  );
};

export default PprEditorPage;
