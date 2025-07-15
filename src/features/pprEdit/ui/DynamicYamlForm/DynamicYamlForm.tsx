/**
 * таблица полей
 */
import { Form, Button, Typography, Select, message } from 'antd';
import React, { useEffect, useState, useMemo } from 'react';

import './DynamicYamlForm.css';
import type { FieldCfg } from '@/features/pprEdit/model/types';
import { TimeIntervalModal } from '@/features/pprEdit/ui/timePicker/TimeIntervalModal';
import { AddFieldModal } from '@features/pprEdit/ui/DynamicYamlForm/AddFieldModal/AddFieldModal.tsx';
import { FieldRenderer } from '@features/pprEdit/ui/DynamicYamlForm/FieldRenderer/FieldRenderer.tsx';
import SwitchingForm from '@features/pprEdit/ui/DynamicYamlForm/SwitchingForm/SwitchingForm.tsx';
import { PRESET_TIMES } from '@features/pprEdit/ui/PprEditorTabs/PprEditorTabs.tsx';

import { FieldsTable } from '../FieldsTable/FieldsTable';
import { toArray } from './helpers/toArray';

const { Title, Text } = Typography;
const { Option } = Select;

interface WindowInterval {
  start: string;
  end: string;
}

interface Props {
  schema: {
    headline?: string;
    switching?: boolean;
    settings: Record<string, any>;
  };
  /** Колбэк: сообщает наружу выбранное окно работ2 */
  onWorkTimeChange?: (interval: WindowInterval) => void;
  /** Границы работ1 для валидации */
  workWindow?: WindowInterval;
  /** начальное значение для селекта */
  initialInterval?: string;
}

/**
 * Компонент динамической формы, строящейся по YAML-схеме.
 *
 * @param schema.headline — заголовок формы
 * @param schema.switching — режим «переключения» (две колонки) или простой (одна колонка)
 * @param schema.settings — описание полей из YAML
 */
export default function DynamicYamlForm({
  schema,
  onWorkTimeChange,
  workWindow = { start: '00:00', end: '23:00' }, // значение по‑умолчанию
  initialInterval,
}: Props) {
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
   * селект времени
   */
  const [interval, setInterval] = useState<string>(initialInterval ?? '');
  const [timeModalOpen, setTimeModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  /** Извлечь интервалы из строки вида "HH:mm–HH:mm" */
  const extractTimes = (val: string): WindowInterval | null => {
    const match = val.match(/(\d{2}:\d{2})\s*[–-]\s*(\d{2}:\d{2})/);
    if (!match) return null;
    return { start: match[1], end: match[2] };
  };

  /**
   * Применить выбранный кастомный интервал.
   * Валидирует относительно workWindow.start/end.
   */
  const applyInterval = (val: string) => {
    const parsed = extractTimes(val);
    if (!parsed) return;
    /** Защита: валидируем только если передан workWindow */
    if (parsed.start < workWindow.start || parsed.end > workWindow.end) {
      message.error(
        `Диапазон работ должен быть в пределах ${workWindow.start} – ${workWindow.end}`,
      );
      setErrorMsg(`Диапазон должен быть в пределах ${workWindow.start} – ${workWindow.end}`);
      return;
    }
    setErrorMsg(null);
    setInterval(val);
    onWorkTimeChange?.(parsed);
  };

  return (
    <section className="dyf__root">
      {schema.headline && <Title level={3}>{schema.headline}</Title>}

      <div className="dyf__layout">
        <div className="dyf__form-col">
          {schema.switching ? (
            <>
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
              <div className="dyf__time-interval-modal" style={{ marginTop: 12 }}>
                <Text className="tab-content--work__label">Время проведения работ2:</Text>
                <Select
                  className="dyf__time-interval-input"
                  style={{ width: 220, marginLeft: 8 }}
                  value={interval || undefined}
                  placeholder="Окно работ"
                  onSelect={(val) =>
                    val === '__custom__' ? setTimeModalOpen(true) : applyInterval(val as string)
                  }
                >
                  {PRESET_TIMES.map((t) => (
                    <Option key={t.value} value={t.value}>
                      {t.label}
                    </Option>
                  ))}
                </Select>
                {errorMsg && (
                  <Text type="danger" style={{ marginTop: 8 }}>
                    {errorMsg}
                  </Text>
                )}
              </div>
            </>
          ) : (
            <Form form={form} layout="vertical">
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
                <Select
                  style={{ width: 220, marginLeft: 12 }}
                  value={interval || undefined}
                  placeholder="Окно работ"
                  onSelect={(val) =>
                    val === '__custom__' ? setTimeModalOpen(true) : applyInterval(val as string)
                  }
                >
                  {PRESET_TIMES.map((t) => (
                    <Option key={t.value} value={t.value}>
                      {t.label}
                    </Option>
                  ))}
                </Select>
                {errorMsg && (
                  <Text type="danger" style={{ marginTop: 8 }}>
                    {errorMsg}
                  </Text>
                )}
              </div>
            </Form>
          )}

          <AddFieldModal
            open={open}
            targetGroup={targetGroup}
            groups={switchGroups}
            draft={draft}
            onChange={(upd) => setDraft((draft) => ({ ...draft, ...upd }))}
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
      <TimeIntervalModal
        open={timeModalOpen}
        onCancel={() => setTimeModalOpen(false)}
        onOk={(value) => {
          applyInterval(value);
          setTimeModalOpen(false);
        }}
      />
    </section>
  );
}
