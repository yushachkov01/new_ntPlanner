import React, { useState } from 'react';
import './PprEditorPage.css';

import DynamicYamlForm from '@features/pprEdit/ui/DynamicYamlForm/DynamicYamlForm';
import { PlannedTaskDropdown } from '@features/pprEdit/ui/PlannedTaskDropdown/PlannedTaskDropdown';
import PprEditorTabs from '@features/pprEdit/ui/PprEditorTabs/PprEditorTabs';
import type { Template } from '@features/pprEdit/ui/yamlTemplate/YamlTemplateSelect';
import { YamlTemplateSelect } from '@features/pprEdit/ui/yamlTemplate/YamlTemplateSelect';
import PprPage from '@pages/PprPage';
import LocationOverview from '@widgets/layout/LocationOverview/ui/LocationOverview';

import { Button } from 'antd';
import { WorkTimeStore } from '@entities/workTimeStore/model/store/workTimeStore.tsx';

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
  };
  const changeTemplate = (i: number, t: Template) =>
    setTemplates((list) => list.map((x, idx) => (idx === i ? t : x)));

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
            onChange={setSelectedTaskId!}
          />

          {selectedTaskId && (
            <div className="ppr-editor-card__yaml-template">
              <YamlTemplateSelect bucket="yamls" value={tpl?.key} onChange={setTpl} />
            </div>
          )}
        </div>
        <div className="ppr-editor-card__controls-right">
          {selectedTaskId && (
            <div className="ppr-editor-card__tabs">
              <PprEditorTabs taskId={selectedTaskId} onWorkTimeChange={setTimelineWindow} />
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
          />
          {t.raw && (
            <DynamicYamlForm
              schema={t.raw}
              workWindow={timelineWindow}
              initialInterval={
                highlightWindows[idx + 1]
                  ? `${highlightWindows[idx + 1]!.start}–${highlightWindows[idx + 1]!.end}`
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
            highlightWindows={highlightWindows.filter(
              (window): window is WindowInterval => window !== null,
            )}
          />
        </div>
      )}
    </section>
  );
};

export default PprEditorPage;
