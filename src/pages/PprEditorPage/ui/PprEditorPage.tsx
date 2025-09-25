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

// ===== оффлайн: авто-сейв / восстановление =====
import type { UUID } from '@/shared/types/offline/offline';
import { useDraftAutosave } from '@features/pprEdit/model/hooks/useDraftAutosave';
import { useDraftsStore } from '@/entities/PlannedTask/model/store/draftsStore';

const PprEditorPage: React.FC = () => {
  /**
   * Хук мастера: текущее состояние шагов и выбранных сущностей
   */
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

  /**
   * Пользователь и окно таймлайна
   */
  const currentUser = userStore((state) => state.user)!;
  const workTimeStore = WorkTimeStore() as any;
  const { timelineWindow, setTimelineWindow } = workTimeStore;
  const selectedTimeWorkId: string | undefined = workTimeStore?.selectedTimeWorkId;

  // Исполнители
  const addedExecutors = useUserStore((state) => state.addedExecutors);

  // Задачи и выбранная
  const tasks = usePlannedTaskStore((state) => state.tasks);
  const selectedTask = useMemo(
      () => tasks.find((task) => task.id === selectedTaskId),
      [tasks, selectedTaskId],
  );

  /**
   * Исполнители и слоты
   */
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

  /** точечное удаление блоков по префиксу sourceKey (templateKey) */
  const removeBySourcePrefix = useTimelineStore((state) => (state as any).removeBySourcePrefix);
  const updateTplStageDuration = useTimelineStore((state) => (state as any).updateTplStageDuration);
  const getMergedStageOverrides = useTimelineStore(
      (state) => (state as any).getMergedStageOverrides,
  );
  const getTimelineState = (useTimelineStore as any).getState;

  /** дополнительные шаблоны */
  const [additionalTemplates, setAdditionalTemplates] = useState<Template[]>([]);
  const [hiddenExtraSlots, setHiddenExtraSlots] = useState<Set<number>>(new Set());

  /** обработчик перемещения бандлов */
  const handleMoveBetweenExecutors = useTimelineMove({
    executorsByTemplate,
    setExecutorsByTemplate,
    tabExecutors,
    setTabExecutors,
    mainTemplate,
    additionalTemplates,
  });

  /** наличие строк в таймлайне */
  const liveRowsCount = useTimelineStore((state) => state.rows?.length ?? 0);
  useEffect(() => {
    if (liveRowsCount > 0) setParamsConfirmed(true);
  }, [liveRowsCount, setParamsConfirmed]);

  /** шаг 3 готовность */
  const paramsRef = useRef<HTMLDivElement | null>(null);
  const [tplReadyTick, setTplReadyTick] = useState(0);
  useEffect(() => {
    if ((mainTemplate as any)?.raw) setTplReadyTick((tick) => tick + 1);
  }, [mainTemplate]);

  /** значения формы */
  const mainFormValuesRef = useRef<any>(null);

  /** статус проверки */
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

  /** добавить вторичный шаблон */
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

  /** сменить вторичный шаблон */
  const changeTemplate = async (index: number, newTemplate: Template) => {
    if (editingLocked) return;
    const prevKey = (additionalTemplates[index] as any)?.key;
    const execIds = (executorsByTemplate[index + 1] ?? []).map(normalizeExecId);
    if (prevKey) removeBySourcePrefix?.({ execIds: execIds, prefix: String(prevKey) });

    const resolved = await resolveTemplateWithRaw(newTemplate as Template, YAML_BUCKET);
    if (!resolved) {
      message.error('Не удалось загрузить YAML шаблона.');
      return;
    }
    setAdditionalTemplates((prev) =>
        prev.map((templateItem, idx) => (idx === index ? resolved : templateItem)),
    );
    setHiddenExtraSlots((prev) => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
    setAllowStep5(false);
  };

  /** модалка удаления шаблона */
  const [confirmState, setConfirmState] = useState<
      { open: true; kind: 'main' | 'extra'; index?: number } | { open: false }
  >({ open: false });

  /** итоговые исполнители для таймлайна */
  const timelineExecutors = useMemo(() => {
    const list = (pprExecutors as any[]) ?? [];
    if (list.length > 0) return list;
    return (tabExecutors ?? []).map(normalizeExec);
  }, [pprExecutors, tabExecutors]);

  const authorUuid =
      pickUuid((currentUser as any)?.id, (currentUser as any)?.uuid) ??
      pickUuid(...(addedExecutors ?? []).map((value) => value.id)) ??
      pickUuid((selectedTask as any)?.authorId, (selectedTask as any)?.author_id);

  const timeWorkUuid =
      (selectedTimeWorkId && isUuid(selectedTimeWorkId) ? selectedTimeWorkId : undefined) ??
      pickUuid((selectedTask as any)?.timeWorkId, (selectedTask as any)?.time_work_id);

  /** сохранение */
  const [saving, setSaving] = useState(false);
  const templateChosen = Boolean((mainTemplate as any)?.key);

  /** прогресс обязательных полей */
  const [progressMap, setProgressMap] = useState<ProgressMap>({});
  useEffect(() => {
    const progressEventHandler = (event: Event) => {
      const customEvent = event as CustomEvent<{ id: string; filled: number; required: number }>;
      const { id, filled, required } = customEvent.detail || ({} as any);
      if (!id) return;
      setProgressMap((prev) => ({ ...prev, [id]: { filled, required } }));
    };
    window.addEventListener(PROGRESS_EVENT_NAME, progressEventHandler as EventListener);
    return () =>
        window.removeEventListener(PROGRESS_EVENT_NAME, progressEventHandler as EventListener);
  }, []);

  const totals = useMemo(
      () =>
          Object.values(progressMap).reduce(
              (accumulator, value) => ({
                filled: accumulator.filled + (value?.filled ?? 0),
                required: accumulator.required + (value?.required ?? 0),
              }),
              { filled: 0, required: 0 },
          ),
      [progressMap],
  );

  const yamlRequiredTotal = useMemo(() => {
    let sumRequired = 0;
    const mainRawSchema = (mainTemplate as any)?.raw;
    if (mainRawSchema) sumRequired += countRequiredInYaml(mainRawSchema);
    for (const templateItem of additionalTemplates) {
      const rawSchema = (templateItem as any)?.raw;
      if (rawSchema) sumRequired += countRequiredInYaml(rawSchema);
    }
    return sumRequired;
  }, [mainTemplate, additionalTemplates]);

  const effectiveRequired = useMemo(
      () => Math.max(totals.required, yamlRequiredTotal),
      [totals.required, yamlRequiredTotal],
  );

  const totalPercent = useMemo(() => {
    if (effectiveRequired <= 0) return 0;
    const clampedFilled = Math.min(totals.filled, effectiveRequired);
    return Math.round((clampedFilled / effectiveRequired) * 100);
  }, [totals.filled, effectiveRequired]);

  const isParamsComplete = effectiveRequired === 0 ? true : totals.filled >= effectiveRequired;

  /** Разрешать шаг 5 только после клика «Сохранить» */
  const [allowStep5, setAllowStep5] = useState(false);

  const canSave =
      isParamsComplete && templateChosen && Boolean(selectedTaskId && authorUuid && timeWorkUuid);

  const saveTooltip = !isParamsComplete
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

  // ===== оффлайн: авто-сейв и восстановление (работает и online, и offline) =====
  const taskIdUUID = (selectedTaskId ?? selectedTask?.id ?? '') as UUID;

  // «лёгкий» снэпшот текущего состояния
  const draftPayloadSupplier = () => {
    const overrides = getMergedStageOverrides?.() ?? {};
    const timelineOverrides =
        Object.entries(overrides).flatMap(([tplIdxStr, map]) =>
            Object.entries(map as Record<string, number>).map(([stageKey, minutes]) => ({
              tplIdx: Number(tplIdxStr),
              stageKey,
              minutes: Number(minutes) || 0,
            })),
        ) ?? [];

    return {
      yamlUrl: (selectedTask as any)?.yaml_url,
      mainTemplateKey: (mainTemplate as any)?.key as string | undefined,
      executorsByTemplate: executorsByTemplate as Array<Array<Record<string, unknown>>>,
      timelineOverrides,
    };
  };

  // автосейв по событиям ntp:*
  const { restoredDraft } = useDraftAutosave(taskIdUUID, draftPayloadSupplier);

  // ---- МОДАЛЬНОЕ ПРЕДЛОЖЕНИЕ ВОССТАНОВИТЬ ЧЕРНОВИК ----
  const draftForSelected = useDraftsStore((s) =>
      selectedTaskId ? (s.drafts as any)?.[selectedTaskId] : undefined,
  );
  const [restoreOpen, setRestoreOpen] = useState(false);
  const offeredRef = useRef<string | null>(null); // чтобы не предлагать повторно для того же id

  // показываем модалку ТОЛЬКО если есть данные по именно этой задаче
  useEffect(() => {
    if (!selectedTaskId) return;
    if (offeredRef.current === selectedTaskId) return;
    if (draftForSelected && draftForSelected.id === selectedTaskId) {
      setRestoreOpen(true);
      offeredRef.current = selectedTaskId;
    }
  }, [selectedTaskId, draftForSelected]);

  // применить черновик (по кнопке «Продолжить»)
  const applyDraft = async () => {
    const draft = draftForSelected || restoredDraft;
    if (!draft) return;

    // 1) исполнители
    if (Array.isArray(draft.executorsByTemplate)) {
      setExecutorsByTemplate(draft.executorsByTemplate as any);
    }
    // 2) тайминги стадий
    if (Array.isArray(draft.timelineOverrides)) {
      draft.timelineOverrides.forEach(({ tplIdx, stageKey, minutes }) => {
        updateTplStageDuration?.({ tplIdx, stageKey, minutes: Number(minutes) || 0 });
      });
    }
    // 3) шаблон
    if (draft.mainTemplateKey) {
      try {
        if (navigator.onLine) {
          const resolved = await resolveTemplateWithRaw(
              { key: draft.mainTemplateKey } as Template,
              YAML_BUCKET,
          );
          if (resolved) {
            setMainTemplate(resolved);
            setTimeout(() => paramsRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
          }
        } else {
          setMainTemplate((prev: any) =>
              prev?.key ? prev : ({ key: draft.mainTemplateKey } as any),
          );
        }
      } catch {
        /* игнорируем — можно выбрать руками */
      }
    }
    setRestoreOpen(false);
  };

  // начать заново (просто закрываем модалку, черновик не трогаем)
  const dismissDraft = () => setRestoreOpen(false);

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
      console.error(
          `Не удалось сохранить: ${
              error?.response?.errors?.[0]?.message ?? error?.message ?? 'unknown error'
          }`,
      );
    } finally {
      setSaving(false);
    }
  };

  // Заголовок шага «На проверке»
  const pendingTitle: React.ReactNode =
      editingLocked && !statusVerified ? (
          <span className="ppr-step-title">
        <span className="ppr-step-pulse" />
        <span>На проверке</span>
      </span>
      ) : (
          'На проверке'
      );

  /** Итоговый активный шаг */
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

  // Иконка процента
  const showStep4Progress = currentStep >= 3;
  const paramsStepIcon = showStep4Progress ? (
      <span className="ppr-steps__progress-icon" style={{ display: 'flex' }}>
      <Progress
          type="circle"
          percent={totalPercent}
          size={STEP_ICON_SIZE}
          strokeLinecap="round"
          status={totalPercent === 100 ? 'success' : 'normal'}
          format={(percentValue) => `${percentValue ?? 0}%`}
      />
    </span>
  ) : undefined;

  return (
      <section className="ppr-editor-card">
        {/* Модалка восстановления черновика */}
        <Modal
            open={restoreOpen}
            onOk={applyDraft}
            onCancel={dismissDraft}
            okText="Продолжить"
            cancelText="Начать заново"
            centered
            maskClosable={false}
        >
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
            Желаете продолжить редактирование?
          </div>
          <div style={{ opacity: 0.8 }}>
            Найдены несохранённые изменения для выбранной задачи. Вы можете восстановить их или начать заново.
          </div>
        </Modal>

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
        <div
            className="ppr-editor-card__controls"
            style={{ display: 'flex', gap: 12, alignItems: 'center' }}
        >
          <div className="ppr-editor-card__controls-left" style={{ width: '100%' }}>
            <PlannedTaskDropdown
                className="ppr-editor-card__select"
                placeholder="Список выбранных планируемых работ"
                value={selectedTaskId}
                disabled={editingLocked}
                onChange={(taskId) => {
                  if (editingLocked) return;
                  setSelectedTaskId(taskId);
                  setTabsConfirmed(false);
                  setMainTemplate(undefined);
                  setParamsConfirmed(false);
                  setAllowStep5(false);
                }}
            />
          </div>

          <Tooltip title={saveTooltip || (editingLocked ? 'Заявка на проверке' : undefined)}>
            <Button
                type="primary"
                onClick={handleSave}
                loading={saving}
                disabled={!canSave || editingLocked}
            >
              Сохранить
            </Button>
          </Tooltip>
        </div>
        {!!selectedTaskId && (
            <div style={{ marginTop: 12 }}>
              <div
                  className="ppr-editor-card__controls-right"
                  style={editingLocked ? { pointerEvents: 'none', opacity: 0.6 } : undefined}
              >
                <div className="ppr-editor-card__tabs">
                  <PprEditorTabs
                      taskId={selectedTaskId}
                      onWorkTimeChange={setTimelineWindow}
                      executors={tabExecutors}
                      addExecutor={(executorToAdd) =>
                          setTabExecutors((prev) =>
                              prev.some(
                                  (existing) => String(existing.id) === String((executorToAdd as any).id),
                              )
                                  ? prev
                                  : [...prev, normalizeExec(executorToAdd)],
                          )
                      }
                      removeExecutor={(executorId) =>
                          setTabExecutors((prev) =>
                              prev.filter((existing) => String(existing.id) !== String(executorId)),
                          )
                      }
                  />
                </div>
                {!tabsConfirmed && (
                    <div style={{ marginTop: 12 }}>
                      <Button
                          type="primary"
                          onClick={() => setTabsConfirmed(true)}
                          disabled={editingLocked}
                      >
                        Перейти к выбору шаблона
                      </Button>
                    </div>
                )}
              </div>
            </div>
        )}
        {tabsConfirmed && (
            <div
                className="ppr-template-wrap"
                style={{
                  marginTop: 16,
                  ...(editingLocked ? { pointerEvents: 'none', opacity: 0.6 } : {}),
                }}
            >
              <YamlTemplateSelect
                  bucket={YAML_BUCKET}
                  value={(mainTemplate as any)?.key}
                  disabled={editingLocked as any}
                  onChange={async (selectedTemplate) => {
                    if (editingLocked) return;
                    const prevMainKey = (mainTemplate as any)?.key;
                    const execIds = (executorsByTemplate[0] ?? []).map(normalizeExecId);
                    if (prevMainKey)
                      removeBySourcePrefix?.({ execIds: execIds, prefix: String(prevMainKey) });
                    if (currentUser) {
                      const meExec = normalizeExec(currentUser);
                      setExecutorsByTemplate((prev) => {
                        const next = [...prev];
                        const mainList = next[0] ?? [];
                        const hasMe = mainList.some(
                            (existing) => String(existing.id) === String(meExec.id),
                        );
                        next[0] = hasMe ? mainList : [meExec, ...mainList];
                        return next;
                      });
                      setTabExecutors((prev) =>
                          prev.some((existing) => String(existing.id) === String(meExec.id))
                              ? prev
                              : [meExec, ...prev],
                      );
                    }

                    const resolved = await resolveTemplateWithRaw(
                        selectedTemplate as Template,
                        YAML_BUCKET,
                    );
                    if (!resolved) {
                      message.error('Не удалось загрузить YAML шаблона.');
                      return;
                    }
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
            <div
                ref={paramsRef}
                style={editingLocked ? { pointerEvents: 'none', opacity: 0.6 } : undefined}
            >
              {(mainTemplate as any)?.key && (mainTemplate as any)?.raw && (
                  <DynamicYamlForm
                      key={`main-${(mainTemplate as any)?.key}-${tplReadyTick}`}
                      schema={(mainTemplate as any)?.raw}
                      templateKey={(mainTemplate as any)?.key}
                      executors={(executorsByTemplate[0] ?? []).map(normalizeExec)}
                      onRowCountChange={(rowCount: number) => {
                        if (!paramsConfirmed && rowCount > 0) setParamsConfirmed(true);
                      }}
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
                <div
                    className="ppr-template-wrap"
                    style={{
                      marginTop: 12,
                      ...(editingLocked ? { pointerEvents: 'none', opacity: 0.6 } : {}),
                    }}
                >
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
              <Button
                  type="dashed"
                  onClick={addTemplate}
                  style={{ marginTop: 12 }}
                  disabled={editingLocked}
              >
                Добавить шаблон
              </Button>
              <div
                  className="ppr-editor-card__timeline"
                  style={editingLocked ? { pointerEvents: 'none', opacity: 0.6 } : undefined}
              >
                <PprPage
                    gridStart={timelineWindow.start}
                    gridEnd={timelineWindow.end}
                    executors={timelineExecutors}
                    executorsByTemplate={executorsByTemplate}
                    onBlockClick={() => {}}
                    onTimerChange={(templateIdx, stageKey, newTimerMinutes) => {
                      if (editingLocked) return;
                      updateTplStageDuration?.({
                        tplIdx: templateIdx,
                        stageKey,
                        minutes: Number(newTimerMinutes) || 0,
                      });
                      setAllowStep5(false);
                    }}
                    onMoveBetweenExecutors={(args) => {
                      handleMoveBetweenExecutors(args);
                    }}
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
