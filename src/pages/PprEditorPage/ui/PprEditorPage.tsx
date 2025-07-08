import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './PprEditorPage.css';

import { PlannedTaskDropdown } from '@features/pprEdit/ui/PlannedTaskDropdown/PlannedTaskDropdown';
import PprEditorTabs from '@features/pprEdit/ui/PprEditorTabs/PprEditorTabs';
import LocationOverview from '@widgets/layout/LocationOverview/ui/LocationOverview.tsx';

/**
 * PprEditorPage — обёртка над фичами редактора ППР для задачи
 */
const PprEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>();

  return (
    <section className="ppr-editor-card">
      <header className="ppr-editor-card__header">
        <LocationOverview />
      </header>
      <div className="ppr-editor-card__controls">
        <PlannedTaskDropdown
          className="ppr-editor-card__select"
          value={selectedTaskId}
          onChange={setSelectedTaskId!}
        />
        {selectedTaskId && (
          <div className="ppr-editor-card__tabs">
            <PprEditorTabs taskId={selectedTaskId} />
          </div>
        )}
      </div>
    </section>
  );
};

export default PprEditorPage;
