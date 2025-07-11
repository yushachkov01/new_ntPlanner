import React, { useState, useEffect } from 'react';

import './PprEditorPage.css';
import { parseYaml } from '@/shared/lib/yamlUtils/yamlUtils';
import { getObjectText } from '@/shared/minio/MinioClient';
import DynamicYamlForm from '@features/pprEdit/ui/DynamicYamlForm/DynamicYamlForm';
import { PlannedTaskDropdown } from '@features/pprEdit/ui/PlannedTaskDropdown/PlannedTaskDropdown';
import PprEditorTabs from '@features/pprEdit/ui/PprEditorTabs/PprEditorTabs';
import type { Template } from '@features/pprEdit/ui/yamlTemplate/YamlTemplateSelect';
import { YamlTemplateSelect } from '@features/pprEdit/ui/yamlTemplate/YamlTemplateSelect';
import LocationOverview from '@widgets/layout/LocationOverview/ui/LocationOverview';

/**
 * PprEditorPage — обёртка над фичами редактора ППР для задачи
 */
const PprEditorPage: React.FC = () => {
  /** @state выбранный ID задачи */
  const [selectedTaskId, setSelectedTaskId] = useState<string>();
  /** @state метаданные выбранного шаблона (ключ, распаршенный raw и т.д.) */
  const [tpl, setTpl] = useState<Template>();
  /** @state распаршенная схема YAML для передачи в DynamicYamlForm */
  const [schema, setSchema] = useState<any>(null);

  /**
   * Загрузка и парсинг YAML.
   *  запросит текст шаблона из minIO, распарсит через js-yaml
   * и запишет результат.
   */
  useEffect(() => {
    if (!tpl) return;
    (async () => {
      try {
        const raw = await getObjectText('yamls', tpl.key);
        const { data, error } = parseYaml(raw);
        if (error?.length) {
          console.error('YAML parsing errors:', error);
          return;
        }
        setSchema(data);
      } catch (err) {
        console.error('Failed to load or parse YAML:', err);
      }
    })();
  }, [tpl]);

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
      {schema && <DynamicYamlForm schema={schema} />}
    </section>
  );
};

export default PprEditorPage;
