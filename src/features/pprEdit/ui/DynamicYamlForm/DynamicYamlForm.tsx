import { Form, Button, Typography } from 'antd';
import React, { useEffect, useState, useMemo } from 'react';

import { toArray } from './helpers/toArray';

import './DynamicYamlForm.css';
import type { FieldCfg, Widget } from '@features/pprEdit/model/types.ts';
import { AddFieldModal } from '@features/pprEdit/ui/DynamicYamlForm/AddFieldModal/AddFieldModal.tsx';
import { FieldRenderer } from '@features/pprEdit/ui/DynamicYamlForm/FieldRenderer/FieldRenderer.tsx';
import SwitchingForm from '@features/pprEdit/ui/DynamicYamlForm/SwitchingForm/SwitchingForm.tsx';

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
      const gf: Record<string, FieldCfg[]> = {};
      entries.forEach(([key, cfg]) => {
        gf[key] = toArray(cfg);
      });
      setGroupFields(gf);
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
    if (!draft.key || !draft.widget) return;
    const cfg: FieldCfg = {
      key: draft.key!,
      name: draft.name!,
      widget: draft.widget as Widget,
      options:
        draft.widget === 'dropdown' && typeof draft.options === 'string'
          ? draft.options.split(',')
          : undefined,
    };
    if (schema.switching) {
      setGroupFields((prev) => ({
        ...prev,
        [targetGroup]: [...(prev[targetGroup] || []), cfg],
      }));
    } else {
      setRootFields((prev) => [...prev, cfg]);
    }
    setOpen(false);
    setDraft({});
  };

  return (
    <section className="dyf__root">
      {schema.headline && (
        <Title level={3} style={{ textDecoration: 'none' }}>
          {schema.headline}
        </Title>
      )}

      {schema.switching ? (
        <SwitchingForm
          groups={switchGroups}
          fields={groupFields}
          onAddClick={(key) => {
            setTaskGroup(key);
            setOpen(true);
          }}
        />
      ) : (
        <>
          <Form layout="vertical">
            {rootFields.map((f) => (
              <FieldRenderer key={f.key} field={f} path={[]} />
            ))}
          </Form>
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

      <AddFieldModal
        open={open}
        targetGroup={targetGroup}
        groups={switchGroups}
        draft={draft}
        onChange={(upd) => setDraft((d) => ({ ...d, ...upd }))}
        onAdd={handleAdd}
        onClose={() => setOpen(false)}
      />
    </section>
  );
}
