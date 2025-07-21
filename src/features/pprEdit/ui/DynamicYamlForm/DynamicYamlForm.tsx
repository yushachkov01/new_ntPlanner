import { Form, Typography } from 'antd';
import React, { useEffect, useState, useMemo } from 'react';

import { toArray } from './helpers/toArray';

import './DynamicYamlForm.css';
import type { FieldCfg } from '@/features/pprEdit/model/types';
import { FieldRenderer } from '@features/pprEdit/ui/DynamicYamlForm/FieldRenderer/FieldRenderer';

import { FieldsTable } from '../FieldsTable/FieldsTable';

const { Title } = Typography;

interface Props {
  /**
   * Схема формы, полученная из YAML:
   *   headline:  заголовок
   *   settings: объект с настройками полей
   */
  schema: {
    headline?: string;
    settings: Record<string, any>;
  };
  /**
   * Колбэк при изменении рабочего интервала
   */
  onWorkTimeChange?: (interval: { start: string; end: string }) => void;
  /**
   * Текущее рабочее окно
   */
  workWindow?: { start: string; end: string };
  /**
   * Начальный интервал
   */
  initialInterval?: string;
}

/**
 * Динамическая форма, рендерящая поля по конфигурации YAML.
 */
export default function DynamicYamlForm({ schema }: Props) {
  /** Управление формой Ant Design */
  const [form] = Form.useForm();

  /** Состояние сгруппированных полей */
  const [groupFields, setGroupFields] = useState<Record<string, FieldCfg[]>>({});
  /** Состояние корневых полей */
  const [rootFields, setRootFields] = useState<FieldCfg[]>([]);

  /**
   * при изменении schema заполняем либо groupFields, либо rootFields.
   */
  useEffect(() => {
    if (!schema.settings) return;
    setRootFields(toArray({ fields: schema.settings }));
    setGroupFields({});
  }, [schema]);

  /**
   * Массив групп для формы
   */
  const simpleGroups = useMemo(
    () =>
      Object.entries(schema.settings || {})
        .sort(([, configA], [, configB]) => (configA.position ?? 0) - (configB.position ?? 0))
        .map(([groupKey, groupConfig]) => ({
          key: groupKey,
          name: groupConfig.name,
        })),
    [schema.settings],
  );

  return (
    <section className="dyf__root">
      {schema.headline && <Title level={3}>{schema.headline}</Title>}
      <div className="dyf__layout">
        <div className="dyf__form-col">
          <Form form={form} layout="vertical">
            {rootFields.map((fieldCfg) => (
              <FieldRenderer key={fieldCfg.key} field={fieldCfg} path={[]} onRemove={() => {}} />
            ))}
          </Form>
        </div>
        <div className="dyf__table-col">
          <FieldsTable
            groups={simpleGroups}
            groupFields={groupFields}
            rootFields={rootFields}
            form={form}
          />
        </div>
      </div>
    </section>
  );
}
