import React, { useEffect, useState } from 'react';

import './PprEditorPage.css';
import type { Executor } from '@entities/executor/model/store/executorStore.ts';
import { userStore } from '@entities/user/model/store/UserStore.ts';
import { WorkTimeStore } from '@entities/workTime/model/store/workTimeStore.tsx';
import DynamicYamlForm from '@features/pprEdit/ui/DynamicYamlForm/DynamicYamlForm';
import { PlannedTaskDropdown } from '@features/pprEdit/ui/PlannedTaskDropdown/PlannedTaskDropdown';
import PprEditorTabs from '@features/pprEdit/ui/PprEditorTabs/PprEditorTabs';
import type { Template } from '@features/pprEdit/ui/yamlTemplate/YamlTemplateSelect';
import { YamlTemplateSelect } from '@features/pprEdit/ui/yamlTemplate/YamlTemplateSelect';
import PprPage from '@pages/PprPage';
import LocationOverview from '@widgets/layout/LocationOverview/ui/LocationOverview';

import { Button } from 'antd';

interface WindowInterval {
  start: string;
  end: string;
}

/**
 * PprEditorPage — обёртка над фичами редактора ППР для задачи
 */
const PprEditorPage: React.FC = () => {
  /** @state выбранный ID задачи */
  const [selectedTaskId, setSelectedTaskId] = useState<string>();
  /** @state метаданные выбранного шаблона, в том числе уже распаршенный файл */
  const [tpl, setTpl] = useState<Template>();

  /** Для шаблонов */
  const [templates, setTemplates] = useState<Template[]>([]);
  /**
   * Ключи шаблонов (названия)
   */
  const templateKeys = [tpl?.key ?? '<default>', ...templates.map((t) => t.key)];

  /** @const текущий пользователь из userStore */
  const currentUser = userStore((state) => state.user)!;

  /**
   * @state массив исполнителей по каждому шаблону
   */
  const [executorsByTemplate, setExecutorsByTemplate] = useState<Executor[][]>([
    currentUser ? [currentUser] : [],
  ]);

  /**
   *  если выбран шаблон и исполнителей нет — подставляем текущего пользователя
   */
  useEffect(() => {
    if (tpl && executorsByTemplate[0].length === 0 && currentUser) {
      setExecutorsByTemplate((list) => {
        const copy = [...list];
        copy[0] = [currentUser];
        return copy;
      });
    }
  }, [tpl]);

  /**
   * Состояние временных окон и действия с ними из WorkTimeStore
   */
  const {
    timelineWindow,
    highlightWindows,
    setTimelineWindow,
    updateHighlightWindow,
    appendHighlightWindow,
  } = WorkTimeStore();
  /**
   * Добавляет новый YAML‑шаблон в список и сразу создаёт к нему слот подсветки
   */
  const addTemplate = () => {
    setTemplates((list) => [...list, {} as Template]);
    appendHighlightWindow();
    setExecutorsByTemplate((list) => [...list, currentUser ? [currentUser] : []]);
  };

  /**
   * Добавляет исполнителя к шаблону по индексу
   * @param idx — индекс шаблона
   * @param exe — исполнитель
   */
  const handleAddExecutor = (idx: number, exe: Executor) => {
    setExecutorsByTemplate((list) => {
      const copy = [...list];
      if (!copy[idx].find((e) => e.id === exe.id)) copy[idx] = [...copy[idx], exe];
      return copy;
    });
  };

  /**
   * Удаляет исполнителя по id из шаблона по индексу
   * @param idx — индекс шаблона
   * @param id — ID исполнителя
   */
  const handleRemoveExecutor = (idx: number, id: number) => {
    setExecutorsByTemplate((list) => {
      const copy = [...list];
      copy[idx] = copy[idx].filter((e) => e.id !== id);
      return copy;
    });
  };

  /**
   * Заменяет шаблон по индексу
   * @param id — индекс
   * @param template — шаблон
   */
  const changeTemplate = (id: number, template: Template) =>
    setTemplates((list) => list.map((x, idx) => (idx === id ? template : x)));

  /**
   * Список всех исполнителей с привязкой к их временным блокам
   * используется в PprPage для отрисовки таймлайна
   */
  const executorsWithBlocks: Executor[] = Object.values(
    executorsByTemplate
      .flatMap((execList, tplIdx) =>
        execList.map((exec) => ({
          exec,
          tplIdx,
        })),
      )
      .reduce<Record<number, { id: number; author: string; role: string; blocks: any[] }>>(
        (acc, { exec, tplIdx }) => {
          const key = exec.id;
          if (!acc[key]) {
            acc[key] = {
              id: exec.id,
              author: exec.author,
              role: exec.role,
              blocks: [],
            };
          }

          const currentWindow = highlightWindows[tplIdx];
          if (currentWindow) {
            acc[key].blocks.push({
              id: exec.id * 1000 + tplIdx,
              startTime: currentWindow.start,
              endTime: currentWindow.end,
              label: templateKeys[tplIdx],
              status: 'info',
            });
          }
          return acc;
        },
        {},
      ),
  );

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
            <div className="ppr-editor-card__yaml-template">
              <YamlTemplateSelect
                bucket="yamls"
                value={tpl?.key}
                onChange={setTpl}
                executors={executorsByTemplate[0]}
                addExecutor={(e) => handleAddExecutor(0, e)}
                removeExecutor={(id) => handleRemoveExecutor(0, id)}
              />
            </div>
          )}
        </div>
        <div className="ppr-editor-card__controls-right">
          {selectedTaskId && (
            <div className="ppr-editor-card__tabs">
              <PprEditorTabs
                taskId={selectedTaskId}
                onWorkTimeChange={setTimelineWindow}
                executors={executorsByTemplate[0]}
                addExecutor={handleAddExecutor}
                removeExecutor={handleRemoveExecutor}
              />
            </div>
          )}
        </div>
      </div>
      {tpl?.raw && (
        <DynamicYamlForm
          schema={tpl.raw}
          workWindow={timelineWindow}
          initialInterval={
            highlightWindows[0]
              ? `${highlightWindows[0].start}–${highlightWindows[0].end}`
              : undefined
          }
          onWorkTimeChange={(interval) => updateHighlightWindow(0, interval)}
        />
      )}

      {templates.map((t, idx) => (
        <React.Fragment key={idx}>
          <YamlTemplateSelect
            bucket="yamls"
            value={t.key}
            onChange={(tpl) => changeTemplate(idx, tpl)}
            executors={executorsByTemplate[idx + 1]}
            addExecutor={(e) => handleAddExecutor(idx + 1, e)}
            removeExecutor={(id) => handleRemoveExecutor(idx + 1, id)}
          />
          {t.raw && (
            <DynamicYamlForm
              schema={t.raw}
              workWindow={timelineWindow}
              initialInterval={
                highlightWindows[idx + 1]
                  ? `${highlightWindows[idx + 1].start}–${highlightWindows[idx + 1].end}`
                  : undefined
              }
              onWorkTimeChange={(interval) => updateHighlightWindow(idx + 1, interval)}
            />
          )}
        </React.Fragment>
      ))}

      {selectedTaskId && (
        <Button type="dashed" onClick={addTemplate}>
          Добавить шаблон
        </Button>
      )}
      {selectedTaskId && (
        <div className="ppr-editor-card__timeline">
          <PprPage
            gridStart={timelineWindow.start}
            gridEnd={timelineWindow.end}
            highlightWindows={highlightWindows.filter((w): w is WindowInterval => w !== null)}
            executors={[
              ...new Map(
                executorsWithBlocks.flat().map((e) => [e.id, e] as [number, Executor]),
              ).values(),
            ]}
            templateKeys={templateKeys}
            onBlockClick={(tplIdx: number) => {
              const name = templateKeys[tplIdx] ?? 'неизвестный шаблон';
              alert(`Это блок из шаблона: ${name}`);
            }}
          />
        </div>
      )}
    </section>
  );
};

export default PprEditorPage;
