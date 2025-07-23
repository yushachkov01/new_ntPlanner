import React, { useEffect, useState } from 'react';

import './PprEditorPage.css';
import LocationOverview from '@/widgets/layout/LocationOverview/ui/LocationOverview';
import type { Template } from '@entities/template/model/store/templateStore.ts';
import { userStore } from '@entities/user/model/store/UserStore';
import { WorkTimeStore } from '@entities/workTimeStore/model/store/workTimeStore';
import { addMinutes } from '@features/pprEdit/lib/time/addMinutes';
import DynamicYamlForm from '@features/pprEdit/ui/DynamicYamlForm/DynamicYamlForm';
import { PlannedTaskDropdown } from '@features/pprEdit/ui/PlannedTaskDropdown/PlannedTaskDropdown';
import PprEditorTabs from '@features/pprEdit/ui/PprEditorTabs/PprEditorTabs';
import YamlTemplateSelect from '@features/pprEdit/ui/yamlTemplate/YamlTemplateSelect.tsx';
import type { StageCfg } from '@pages/PprPage';
import PprPage from '@pages/PprPage';

import { Button } from 'antd';

interface WindowInterval {
  start: string;
  end: string;
}

/**
 * Строит цепочку этапов шаблона, начиная с указанного времени
 * @param template — объект шаблона с полями current_stages и stages_field
 * @param startTime — время начала цепочки в формате "HH:MM"
 * @returns массив записей { key, meta, start, end }
 */
function buildStageChain(
  template: Template,
  startTime: string,
): Array<{
  key: string;
  meta: Template['stages_field'][string];
  start: string;
  end: string;
}> {
  const stageChain: Array<{
    key: string;
    meta: Template['stages_field'][string];
    start: string;
    end: string;
  }> = [];
  let cursor = startTime;
  let currentKey = template.current_stages?.[0];

  for (let stepIndex = 0; stepIndex < 100 && currentKey && currentKey !== 'exit'; stepIndex++) {
    const stageMeta = template.stages_field[currentKey];
    if (!stageMeta) break;
    const nextEnd = addMinutes(cursor, stageMeta.timer_default ?? 0);
    stageChain.push({ key: currentKey, meta: stageMeta, start: cursor, end: nextEnd });
    cursor = nextEnd;
    currentKey = stageMeta.if_success;
  }
  return stageChain;
}

/**
 * Страница редактора PPR:
 * выбор задачи, настройка шаблонов и исполнителей,
 * отображение формы и таймлайна.
 */
const PprEditorPage: React.FC = () => {
  /** ID выбранной задачи */
  const [selectedTaskId, setSelectedTaskId] = useState<string>();
  /** Основной шаблон */
  const [mainTemplate, setMainTemplate] = useState<Template>();
  /** Список дополнительных шаблонов */
  const [additionalTemplates, setAdditionalTemplates] = useState<Template[]>([]);
  /** Текущий пользователь из стора */
  const currentUser = userStore((state) => state.user)!;
  /** Исполнители для каждого шаблона */
  const [executorsByTemplate, setExecutorsByTemplate] = useState([
    currentUser ? [currentUser] : [],
  ] as any[][]);

  /** Ключи шаблонов для передачи в PprPage */
  const templateKeys = [
    mainTemplate?.key ?? '<default>',
    ...additionalTemplates.map((template) => template.key),
  ];

  /** Методы стора рабочего времени */
  const {
    timelineWindow,
    highlightWindows,
    setTimelineWindow,
    updateHighlightWindow,
    appendHighlightWindow,
    setHighlightWindows,
  } = WorkTimeStore();

  /** Когда появился основной шаблон, но ещё нет исполнителей — добавляем текущего */
  useEffect(() => {
    if (mainTemplate && executorsByTemplate[0].length === 0) {
      setExecutorsByTemplate((prevList) => {
        const nextList = [...prevList];
        nextList[0] = [currentUser];
        return nextList;
      });
    }
  }, [mainTemplate, currentUser, executorsByTemplate]);

  /**
   * Добавляет исполнителя к указанному шаблону по индексу
   * @param templateIndex — индекс шаблона в массиве executorsByTemplate
   * @param executor — объект исполнителя
   */
  const addExecutor = (templateIndex: number, executor: any) =>
    setExecutorsByTemplate((prevList) => {
      const nextList = [...prevList];
      if (!nextList[templateIndex].some((item: any) => item.id === executor.id)) {
        nextList[templateIndex].push(executor);
      }
      return nextList;
    });

  /**
   * Удаляет исполнителя из указанного шаблона по индексу
   * @param templateIndex — индекс шаблона
   * @param executorId — id исполнителя
   */
  const removeExecutor = (templateIndex: number, executorId: number) =>
    setExecutorsByTemplate((prevList) => {
      const nextList = [...prevList];
      nextList[templateIndex] = nextList[templateIndex].filter(
        (item: any) => item.id !== executorId,
      );
      return nextList;
    });

  /**
   * Добавляет новый пустой шаблон:
   *   расширяет массив шаблонов,
   *   добавляет окно подсветки,
   *   создаёт пустой слот исполнителей.
   */
  const addTemplate = () => {
    setAdditionalTemplates((prev) => [...prev, {} as Template]);
    appendHighlightWindow();
    setExecutorsByTemplate((prevList) => [...prevList, currentUser ? [currentUser] : []]);
  };

  /**
   * Меняет шаблон в массиве additionalTemplates по индексу
   * @param index — индекс шаблона
   * @param newTemplate — новый объект шаблона
   */
  const changeTemplate = (index: number, newTemplate: Template) =>
    setAdditionalTemplates((prev) => prev.map((item, idx) => (idx === index ? newTemplate : item)));

  /**
   * Обрабатывает изменение таймера этапа:
   * сохраняет в основном или дополнительном шаблоне.
   * @param tplIdx — индекс шаблона
   * @param stageKey — ключ этапа
   * @param newTimer — новое значение таймера
   */
  const handleTimerChange = (tplIdx: number, stageKey: string, newTimer: number) => {
    if (tplIdx === 0 && mainTemplate) {
      mainTemplate.stages_field[stageKey].timer_default = newTimer;
      setMainTemplate({ ...mainTemplate });
    } else {
      const target = additionalTemplates[tplIdx - 1];
      target.stages_field[stageKey].timer_default = newTimer;
      setAdditionalTemplates([
        ...additionalTemplates.slice(0, tplIdx - 1),
        { ...target },
        ...additionalTemplates.slice(tplIdx),
      ]);
    }
  };

  /** Конфигурации этапов для передачи в PprPage */
  const stageCfgs: StageCfg[] = [
    {
      currentStages: mainTemplate?.current_stages || [],
      stagesField: mainTemplate?.stages_field || {},
    },
    ...additionalTemplates.map((template) => ({
      currentStages: template.current_stages || [],
      stagesField: template.stages_field || {},
    })),
  ];

  /** Генерация блоков для всех исполнителей */
  const executorsWithBlocks = Object.values(
    executorsByTemplate
      .flatMap((list, templateIndex) => list.map((executor) => ({ executor, templateIndex })))
      .reduce<Record<number, any>>((acc, { executor, templateIndex }) => {
        if (!acc[executor.id]) acc[executor.id] = { ...executor, blocks: [] };

        const windowStart =
          templateIndex === 0 ? timelineWindow.start : highlightWindows[templateIndex]?.start;
        const templateObj =
          templateIndex === 0 ? mainTemplate : additionalTemplates[templateIndex - 1];

        if (windowStart && templateObj) {
          buildStageChain(templateObj, windowStart).forEach(({ key, meta, start, end }, order) => {
            acc[executor.id].blocks.push({
              id: executor.id * 10000 + templateIndex * 100 + order,
              startTime: start,
              endTime: end,
              label: key,
              status: 'info',
              stageKeys: [key],
              stagesField: { [key]: meta },
              tplIdx: templateIndex,
            });
          });
        }
        return acc;
      }, {}),
  );

  /** Пересчёт highlightWindows при изменении шаблонов или времени начала */
  useEffect(() => {
    const windows: (WindowInterval | null)[] = [];

    if (mainTemplate) {
      const mainChain = buildStageChain(mainTemplate, timelineWindow.start);
      if (mainChain.length) {
        windows.push({
          start: mainChain[0].start,
          end: mainChain[mainChain.length - 1].end,
        });
      }
    }

    additionalTemplates.forEach((template, idx) => {
      const prevEnd = windows[idx]?.end || timelineWindow.start;
      const chain = buildStageChain(template, prevEnd);
      if (chain.length) {
        windows.push({
          start: chain[0].start,
          end: chain[chain.length - 1].end,
        });
      }
    });

    setHighlightWindows(windows);
  }, [mainTemplate, additionalTemplates, timelineWindow.start, setHighlightWindows]);

  return (
    <section className="ppr-editor-card">
      <header className="ppr-editor-card__header">
        <LocationOverview />
      </header>
      <div className="ppr-editor-card__controls">
        <div className="ppr-editor-card__controls-left">
          <PlannedTaskDropdown
            className="ppr-editor-card__select"
            placeholder="Выберите задачу"
            value={selectedTaskId}
            onChange={setSelectedTaskId}
          />
          {selectedTaskId && (
            <YamlTemplateSelect
              bucket="yamls"
              value={mainTemplate?.key}
              onChange={setMainTemplate}
              executors={executorsByTemplate[0]}
              addExecutor={(executor) => addExecutor(0, executor)}
              removeExecutor={(executorId) => removeExecutor(0, executorId)}
            />
          )}
        </div>
        {selectedTaskId && (
          <div className="ppr-editor-card__controls-right">
            <div className="ppr-editor-card__tabs">
              <PprEditorTabs
                taskId={selectedTaskId}
                onWorkTimeChange={setTimelineWindow}
                executors={executorsByTemplate[0]}
                addExecutor={addExecutor}
                removeExecutor={removeExecutor}
              />
            </div>
          </div>
        )}
      </div>
      {mainTemplate?.raw && (
        <DynamicYamlForm
          schema={mainTemplate.raw}
          workWindow={timelineWindow}
          onWorkTimeChange={(interval) => updateHighlightWindow(0, interval)}
        />
      )}

      {additionalTemplates.map((template, idx) => (
        <React.Fragment key={idx}>
          <YamlTemplateSelect
            bucket="yamls"
            value={template.key}
            onChange={(newTpl) => changeTemplate(idx, newTpl)}
            executors={executorsByTemplate[idx + 1]}
            addExecutor={(executor) => addExecutor(idx + 1, executor)}
            removeExecutor={(executorId) => removeExecutor(idx + 1, executorId)}
          />
          {template.raw && (
            <DynamicYamlForm
              schema={template.raw}
              workWindow={timelineWindow}
              onWorkTimeChange={(interval) => updateHighlightWindow(idx + 1, interval)}
            />
          )}
        </React.Fragment>
      ))}

      {selectedTaskId && (
        <>
          <Button type="dashed" onClick={addTemplate}>
            Добавить шаблон
          </Button>
          <div className="ppr-editor-card__timeline">
            <PprPage
              gridStart={timelineWindow.start}
              gridEnd={timelineWindow.end}
              highlightWindows={highlightWindows.filter(
                (interval): interval is WindowInterval => !!interval,
              )}
              executors={[...new Map(executorsWithBlocks.map((item) => [item.id, item])).values()]}
              templateKeys={templateKeys}
              stageCfgs={stageCfgs}
              onBlockClick={() => {}}
              onTimerChange={handleTimerChange}
            />
          </div>
        </>
      )}
    </section>
  );
};

export default PprEditorPage;
