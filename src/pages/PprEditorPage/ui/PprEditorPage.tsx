import React, { useEffect, useMemo, useRef, useState } from 'react';

import './PprEditorPage.css';
import LocationOverview from '@/widgets/layout/LocationOverview/ui/LocationOverview';
import type { Template } from '@entities/template/model/store/templateStore.ts';
import useTimelineStore from '@entities/timeline/model/store/timelineStore';
import { userStore } from '@entities/user/model/store/UserStore';
import { WorkTimeStore } from '@entities/workTimeStore/model/store/workTimeStore';
import { usePprExecutors } from '@features/pprEdit/model/hooks/usePprExecutors';
import { usePprWizard } from '@features/pprEdit/model/hooks/usePprWizard';
import { useTimelineMove } from '@features/pprEdit/model/hooks/useTimelineMove';
import ConfirmDeleteDialog from '@features/pprEdit/ui/ConfirmDeleteDialog/ConfirmDeleteDialog';
import DynamicYamlForm from '@features/pprEdit/ui/DynamicYamlForm/DynamicYamlForm';
import { PlannedTaskDropdown } from '@features/pprEdit/ui/PlannedTaskDropdown/PlannedTaskDropdown';
import PprEditorTabs from '@features/pprEdit/ui/PprEditorTabs/PprEditorTabs';
import { normalizeExec } from '@features/pprEdit/ui/utils/execUtils/execUtils';
import { resolveTemplateWithRaw } from '@features/pprEdit/ui/utils/templateRaw/templateRaw';
import YamlTemplateSelect from '@features/pprEdit/ui/yamlTemplate/YamlTemplateSelect';
import PprPage from '@pages/PprPage';

import { Button, Steps, message } from 'antd';

/**
 * Бакет и префикс для загрузки YAML-шаблонов
 */
const BUCKET = 'yamls';
const PREFIX = '';

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
   * Пользователь и окно таймлайна (старт/финиш сетки)
   */
  const currentUser = userStore((s) => s.user)!;
  const { timelineWindow, setTimelineWindow } = WorkTimeStore();

  /**
   * Исполнители и слоты (по основному и дополнительным шаблонам)
   * Params — нет
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

  /** используем «точечное» удаление блоков по префиксу sourceKey (templateKey) */
  const removeBySourcePrefix = useTimelineStore((s) => (s as any).removeBySourcePrefix);
  const updateTplStageDuration = useTimelineStore((s) => (s as any).updateTplStageDuration);

  /**
   * Список дополнительных (вторичных) шаблонов, добавленных пользователем
   */
  const [additionalTemplates, setAdditionalTemplates] = useState<Template[]>([]);
  const [hiddenExtraSlots, setHiddenExtraSlots] = useState<Set<number>>(new Set());
  /**
   * Обработчик перемещения бандлов между исполнителями в таймлайне
   */
  const handleMoveBetweenExecutors = useTimelineMove({
    executorsByTemplate,
    setExecutorsByTemplate,
    tabExecutors,
    setTabExecutors,
    mainTemplate,
    additionalTemplates,
  });

  /**
   * Фактическое наличие строк в сторе таймлайна
   */
  const liveRowsCount = useTimelineStore((s) => s.rows?.length ?? 0);
  useEffect(() => {
    if (liveRowsCount > 0) {
      setParamsConfirmed(true);
    }
  }, [liveRowsCount, setParamsConfirmed]);

  /**
   * Как только на шаге 3 появились блоки (liveRowsCount > 0) — подтверждаем параметры
   */
  const paramsRef = useRef<HTMLDivElement | null>(null);
  const [tplReadyTick, setTplReadyTick] = useState(0);

  useEffect(() => {
    if (!mainTemplate) return;
    if ((mainTemplate as any).raw) setTplReadyTick((t) => t + 1);
  }, [mainTemplate]);

  /**
   * Добавляет новый пустой шаблон:
   *   расширяет массив шаблонов,
   *   добавляет окно подсветки,
   *   создаёт пустой слот исполнителей.
   */
  const addTemplate = () => {
    const me = normalizeExec(currentUser);
    const newIndex = additionalTemplates.length;
    setAdditionalTemplates((prev) => [...prev, {} as Template]);
    setExecutorsByTemplate((prevList) => [...prevList, currentUser ? [me] : []]);
    setHiddenExtraSlots((prev) => {
      const next = new Set(prev);
      next.delete(newIndex);
      return next;
    });
  };

  /** Сменить шаблон (точечно удаляем блоки ) */
  const changeTemplate = async (index: number, newTemplate: Template) => {
    const prevKey = (additionalTemplates[index] as any)?.key;
    const execIds = (executorsByTemplate[index + 1] ?? []).map(normalizeExecId);
    if (prevKey) {
      /** удаляем только блоки, созданные «старым» шаблоном этой вкладки */
      removeBySourcePrefix?.({ execIds, prefix: String(prevKey) });
    }
    const resolved = await resolveTemplateWithRaw(newTemplate as Template, BUCKET, PREFIX);
    if (!resolved) {
      message.error('Не удалось загрузить YAML шаблона.');
      return;
    }
    setAdditionalTemplates((prev) => prev.map((item, idx) => (idx === index ? resolved : item)));
    setHiddenExtraSlots((prev) => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  };

  /** состояние модалки подтверждения */
  const [confirmState, setConfirmState] = useState<
    { open: true; kind: 'main' | 'extra'; index?: number } | { open: false }
  >({ open: false });

  /**
   * Итоговый набор исполнителей для таймлайна (уникальный)
   */
  const timelineExecutors = useMemo(() => {
    const list = (pprExecutors as any[]) ?? [];
    if (list.length > 0) return list;
    return (tabExecutors ?? []).map(normalizeExec);
  }, [pprExecutors, tabExecutors]);

  const [rowDisplayBySource, setRowDisplayBySource] = useState<
    Record<string, { headers: string[]; row: string[]; colKeys: string[] }>
  >({});
  return (
    <section className="ppr-editor-card">
      <div style={{ padding: '8px 16px 0 16px' }}>
        <Steps
          current={currentStep}
          items={[
            { title: 'Задача' },
            { title: 'Значения (в табе)' },
            { title: 'Шаблон' },
            { title: 'Параметры шаблона' },
            { title: 'Заявка готова' },
          ]}
        />
      </div>

      <header className="ppr-editor-card__header">
        <div className="ppr-location-divider" />
        <LocationOverview />
        <div className="ppr-location-divider" />
      </header>
      <div className="ppr-editor-card__controls">
        <div className="ppr-editor-card__controls-left" style={{ width: '100%' }}>
          <PlannedTaskDropdown
            className="ppr-editor-card__select"
            placeholder="Список выбранных планируемых работ"
            value={selectedTaskId}
            onChange={(val) => {
              setSelectedTaskId(val);
              setTabsConfirmed(false);
              setMainTemplate(undefined);
              setParamsConfirmed(false);
            }}
          />
        </div>
      </div>
      {!!selectedTaskId && (
        <div style={{ marginTop: 12 }}>
          <div className="ppr-editor-card__controls-right">
            <div className="ppr-editor-card__tabs">
              <PprEditorTabs
                taskId={selectedTaskId}
                onWorkTimeChange={setTimelineWindow}
                executors={tabExecutors}
                addExecutor={(exe) =>
                  setTabExecutors((prev) =>
                    prev.some((e) => String(e.id) === String((exe as any).id))
                      ? prev
                      : [...prev, normalizeExec(exe)],
                  )
                }
                removeExecutor={(id) =>
                  setTabExecutors((prev) => prev.filter((e) => String(e.id) !== String(id)))
                }
              />
            </div>
            {!tabsConfirmed && (
              <div style={{ marginTop: 12 }}>
                <Button type="primary" onClick={() => setTabsConfirmed(true)}>
                  Перейти к выбору шаблона
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      {tabsConfirmed && (
        <div className="ppr-template-wrap" style={{ marginTop: 16 }}>
          <YamlTemplateSelect
            bucket={BUCKET}
            value={(mainTemplate as any)?.key}
            onChange={async (tpl) => {
              const prevMainKey = (mainTemplate as any)?.key;
              const execIds = (executorsByTemplate[0] ?? []).map(normalizeExecId);
              if (prevMainKey) removeBySourcePrefix?.({ execIds, prefix: String(prevMainKey) });
              if (currentUser) {
                const me = normalizeExec(currentUser);
                setExecutorsByTemplate((prev) => {
                  const next = [...prev];
                  const list0 = next[0] ?? [];
                  const hasMe = list0.some((x: any) => String(x.id) === String(me.id));
                  next[0] = hasMe ? list0 : [me, ...list0];
                  return next;
                });
                setTabExecutors((prev) =>
                  prev.some((x) => String(x.id) === String(me.id)) ? prev : [me, ...prev],
                );
              }

              // подгрузим raw при необходимости
              const resolved = await resolveTemplateWithRaw(tpl as Template, BUCKET, PREFIX);
              if (!resolved) {
                message.error('Не удалось загрузить YAML шаблона.');
                return;
              }
              setMainTemplate(resolved);
              setParamsConfirmed(false);

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
            disabled={!(mainTemplate as any)?.key}
            onClick={() => setConfirmState({ open: true, kind: 'main' })}
          >
            Удалить шаблон
          </Button>
        </div>
      )}
      {step3Done && (
        <div ref={paramsRef}>
          {(mainTemplate as any)?.key && (mainTemplate as any)?.raw && (
            <DynamicYamlForm
              key={`main-${(mainTemplate as any)?.key}-${tplReadyTick}`}
              schema={(mainTemplate as any)?.raw}
              templateKey={(mainTemplate as any)?.key}
              executors={(executorsByTemplate[0] ?? []).map(normalizeExec)}
              onRowCountChange={(cnt) => {
                if (!paramsConfirmed && cnt > 0) setParamsConfirmed(true);
              }}
              onDisplayTableChange={(headers, rows, sources, colKeys) => {
                setRowDisplayBySource((prev) => {
                  const next = { ...prev };
                  rows.forEach((row, idx) => {
                    const src = sources[idx];
                    if (!src) return;
                    next[src] = { headers, row, colKeys: colKeys ?? [] };
                  });
                  return next;
                });
              }}
            />
          )}
        </div>
      )}

      {additionalTemplates.map((template, idx) => {
        if (hiddenExtraSlots.has(idx)) return null;
        return (
          <React.Fragment key={idx}>
            <div className="ppr-template-wrap" style={{ marginTop: 12 }}>
              <YamlTemplateSelect
                bucket={BUCKET}
                value={(template as any).key}
                onChange={(newTpl) => changeTemplate(idx, newTpl)}
                executors={(executorsByTemplate[idx + 1] ?? []).map(normalizeExec)}
                addExecutor={(executor) => addExecutor(idx + 1, executor)}
                removeExecutor={(executorId) => removeExecutor(idx + 1, executorId)}
                tabCandidates={tabExecutors}
              />

              <Button
                className="ppr-template-wrap__delete"
                danger
                ghost
                disabled={!(template as any)?.key}
                onClick={() => setConfirmState({ open: true, kind: 'extra', index: idx })}
              >
                Удалить шаблон
              </Button>
            </div>

            {(template as any)?.key && (template as any)?.raw && (
              <DynamicYamlForm
                key={`extra-${idx}-${(template as any)?.key}-${tplReadyTick}`}
                schema={(template as any)?.raw}
                templateKey={(template as any)?.key}
                executors={(executorsByTemplate[idx + 1] ?? []).map(normalizeExec)}
                onRowCountChange={() => {}}
                onDisplayTableChange={(headers, rows, sources, colKeys) => {
                  setRowDisplayBySource((prev) => {
                    const next = { ...prev };
                    rows.forEach((row, i) => {
                      const src = sources[i];
                      if (!src) return;
                      next[src] = { headers, row, colKeys: colKeys ?? [] };
                    });
                    return next;
                  });
                }}
              />
            )}
          </React.Fragment>
        );
      })}

      {step5Done && (
        <>
          <Button type="dashed" onClick={addTemplate} style={{ marginTop: 12 }}>
            Добавить шаблон
          </Button>
          <div className="ppr-editor-card__timeline">
            <PprPage
              gridStart={timelineWindow.start}
              gridEnd={timelineWindow.end}
              executors={timelineExecutors}
              onBlockClick={() => {}}
              onTimerChange={(tplIdx, stageKey, newTimer) => {
                updateTplStageDuration?.({
                  tplIdx,
                  stageKey,
                  minutes: Number(newTimer) || 0,
                });
              }}
              onMoveBetweenExecutors={handleMoveBetweenExecutors}
              rowDisplayBySource={rowDisplayBySource}
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
