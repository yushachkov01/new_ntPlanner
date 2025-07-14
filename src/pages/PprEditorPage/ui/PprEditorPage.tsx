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
  const addTemplate = () => setTemplates((list) => [...list, {} as Template]);
  const changeTemplate = (i: number, t: Template) =>
    setTemplates((list) => list.map((x, idx) => (idx === i ? t : x)));

  /** текущее окно работ */
  const [workInterval, setWorkInterval] = useState<{ start: string; end: string }>({
    start: '00:00',
    end: '23:00',
  });

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
              <PprEditorTabs taskId={selectedTaskId} onWorkTimeChange={setWorkInterval} />
            </div>
          )}
        </div>
      </div>
      {tpl?.raw && <DynamicYamlForm schema={tpl.raw} />}
      <div>
        {selectedTaskId &&
          templates.map((t, idx) => (
            <React.Fragment key={idx}>
              <YamlTemplateSelect
                bucket="yamls"
                value={t.key}
                onChange={(tpl) => changeTemplate(idx, tpl)}
              />
              {t.raw && <DynamicYamlForm schema={t.raw} />}
            </React.Fragment>
          ))}

        {selectedTaskId && (
          <Button type="dashed" onClick={addTemplate}>
            Добавить шаблон
          </Button>
        )}
      </div>
      {selectedTaskId && (
        <div className="ppr-editor-card__timeline">
          <PprPage startTime={workInterval.start} endTime={workInterval.end} />
        </div>
      )}
    </section>
  );
};

export default PprEditorPage;
