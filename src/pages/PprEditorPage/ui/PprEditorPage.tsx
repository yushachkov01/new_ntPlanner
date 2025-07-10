import React, { useState } from 'react';
import './PprEditorPage.css';

import { PlannedTaskDropdown } from '@features/pprEdit/ui/PlannedTaskDropdown/PlannedTaskDropdown';
import PprEditorTabs from '@features/pprEdit/ui/PprEditorTabs/PprEditorTabs';
import type { Template } from '@features/pprEdit/ui/yamlTemplate/YamlTemplateSelect';
import { YamlTemplateSelect } from '@features/pprEdit/ui/yamlTemplate/YamlTemplateSelect';
import LocationOverview from '@widgets/layout/LocationOverview/ui/LocationOverview';

/**
 * PprEditorPage — обёртка над фичами редактора ППР для задачи
 */
const PprEditorPage: React.FC = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>();
  const [tpl, setTpl] = useState<Template>();

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
              <PprEditorTabs taskId={selectedTaskId} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PprEditorPage;
