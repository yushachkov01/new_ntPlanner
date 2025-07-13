/**
 * таблица полей
 */
import { Form, Button, Typography } from 'antd';
import React, { useEffect, useState, useMemo } from 'react';

import { toArray } from './helpers/toArray';

import './DynamicYamlForm.css';
import type { FieldCfg } from '@/features/pprEdit/model/types';
import { AddFieldModal } from '@features/pprEdit/ui/DynamicYamlForm/AddFieldModal/AddFieldModal.tsx';
import { FieldRenderer } from '@features/pprEdit/ui/DynamicYamlForm/FieldRenderer/FieldRenderer.tsx';
import SwitchingForm from '@features/pprEdit/ui/DynamicYamlForm/SwitchingForm/SwitchingForm.tsx';

import { FieldsTable } from '../FieldsTable/FieldsTable';

const { Title } = Typography;

interface Props {
  schema: {
    headline?: string;
    switching?: boolean;
    settings: Record<string, any>;
  };
}

/**
 * Компонент динамической формы, строящейся по YAML-схеме.
 *
 * @param schema.headline — заголовок формы
 * @param schema.switching — режим «переключения» (две колонки) или простой (одна колонка)
 * @param schema.settings — описание полей из YAML
 */
export default function DynamicYamlForm({ schema }: Props) {
  const [form] = Form.useForm();
  /**
   *  поля, сгруппированные по ключам
   */
  const [groupFields, setGroupFields] = useState<Record<string, FieldCfg[]>>({});
  /**
   *  корневые поля
   */
  const [rootFields, setRootFields] = useState<FieldCfg[]>([]);
  /**
   *   флаг открытия модального окна добавления поля
   */
  const [open, setOpen] = useState(false);
  /**
   *  временный объект-черновик для нового поля
   */
  const [draft, setDraft] = useState<Partial<FieldCfg>>({});
  /**
   *  state: ключ группы, в которую будет добавлено новое поле
   */
  const [targetGroup, setTaskGroup] = useState<string>('');

  /**
   * При изменении schema разбираем settings:
   */
  useEffect(() => {
    if (!schema.settings) return;
    if (schema.switching) {
      const entries = Object.entries(schema.settings).sort(
        ([, a], [, b]) => (a.position ?? 0) - (b.position ?? 0),
      );
      setGroupFields(Object.fromEntries(entries.map(([k, cfg]) => [k, toArray(cfg)])));
      setRootFields([]);
    } else {
      setRootFields(toArray({ fields: schema.settings }));
      setGroupFields({});
    }
  }, [schema]);

  /**
   * Формируем список групп для переключения
   */
  const switchGroups = useMemo(
    () =>
      schema.switching
        ? Object.entries(schema.settings)
            .sort(([, a], [, b]) => (a.position ?? 0) - (b.position ?? 0))
            .map(([key, cfg]) => ({ key, name: cfg.name }))
        : [],
    [schema],
  );

  /**
   * Обработчик добавления нового поля из модалки.
   */
  const handleAdd = () => {
    if (!draft.key || !draft.name) return;
    const cfg: FieldCfg = {
      key: draft.key!,
      name: draft.key!,
      widget: 'input',
      defaultValue: draft.name,
    };
    if (schema.switching) {
      setGroupFields((p) => ({
        ...p,
        [targetGroup]: [...(p[targetGroup] || []), cfg],
      }));
    } else {
      setRootFields((p) => [...p, cfg]);
    }

    /**
     * добавляем в форму значение нового поля
     */
    form.setFieldsValue({ [cfg.key]: cfg.defaultValue });
    setDraft({});
    setOpen(false);
  };
  /**
   * Удаление поля
   */
  const handleRemoveField = (groupKey: string, fieldKey: string) =>
    setGroupFields((p) => ({
      ...p,
      [groupKey]: p[groupKey].filter((f) => f.key !== fieldKey),
    }));

  const handleRemoveRoot = (fieldKey: string) =>
    setRootFields((p) => p.filter((f) => f.key !== fieldKey));

  return (
    <section className="dyf__root">
      {schema.headline && <Title level={3}>{schema.headline}</Title>}

      <div className="dyf__layout">
        <div className="dyf__form-col">
          <Form form={form} layout="vertical">
            {schema.switching ? (
              <SwitchingForm
                form={form}
                groups={switchGroups}
                fields={groupFields}
                onAddClick={(key) => {
                  setTaskGroup(key);
                  setOpen(true);
                }}
                onRemoveField={handleRemoveField}
              />
            ) : (
              <>
                {rootFields.map((f) => (
                  <FieldRenderer
                    key={f.key}
                    field={f}
                    path={[]}
                    onRemove={() => handleRemoveRoot(f.key)}
                  />
                ))}
                <div className="dyf__btn-wrap">
                  <Button
                    type="dashed"
                    onClick={() => {
                      setTaskGroup('root');
                      setOpen(true);
                    }}
                  >
                    + Добавить поле
                  </Button>
                </div>
              </>
            )}
          </Form>

          <AddFieldModal
            open={open}
            targetGroup={targetGroup}
            groups={switchGroups}
            draft={draft}
            onChange={(upd) => setDraft((d) => ({ ...d, ...upd }))}
            onGroupChange={(g) => setTaskGroup(g)}
            onAdd={handleAdd}
            onClose={() => setOpen(false)}
          />
        </div>

        <div className="dyf__table-col">
          <FieldsTable
            switching={!!schema.switching}
            groups={switchGroups}
            groupFields={groupFields}
            rootFields={rootFields}
            form={form}
          />
        </div>
      </div>
    </section>
  );
}
