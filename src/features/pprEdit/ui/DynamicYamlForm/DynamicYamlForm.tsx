import { Form, Typography, Button } from 'antd';
import React, { useEffect, useState } from 'react';

import { toArray } from './helpers/toArray';

import './DynamicYamlForm.css';
import type { FieldCfg } from '@/features/pprEdit/model/types';
import { FieldRenderer } from '@features/pprEdit/ui/DynamicYamlForm/FieldRenderer/FieldRenderer';

import { FieldsTable } from '../FieldsTable/FieldsTable';

import { templateStore } from '@/entities/template/model/store/templateStore';

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
  const [localData, setLocalData] = useState<Record<string, any>[]>([]);
  /** Индекс редактируемой строки, или null если добавление */
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const setTemplateValues = templateStore((s) => s.setTemplateValues);
  const getTemplateValues = templateStore((s) => s.getTemplateValues);

  /**
   * Обновляем поля
   *
   * @param schema.headline  — заголовок шаблона
   * @param schema.settings  — настройки полей шаблона
   */
  useEffect(() => {
    setRootFields(toArray({ fields: schema.settings }));
    form.resetFields();
    setLocalData([]);
    setEditingIndex(null);
  }, [schema.headline, schema.settings, form]);

  /**
   * Обработчик сабмита формы:
   * добавляет новую запись или сохраняет изменения существующей.
   * @param vals — значения полей формы
   */
  const onFinish = (vals: Record<string, any>) => {
    const key = schema.headline;
    const prevGlobal = getTemplateValues(key);
    let nextLocal: Record<string, any>[];

    if (editingIndex === null) {
      nextLocal = [...localData, vals];
      setLocalData(nextLocal);
      setTemplateValues(key, [...prevGlobal, vals]);
    } else {
      nextLocal = localData.map((row, i) => (i === editingIndex ? vals : row));
      setLocalData(nextLocal);
      setTemplateValues(
        key,
        prevGlobal.map((row, i) => (i === editingIndex ? vals : row)),
      );
    }

    form.resetFields();
    setEditingIndex(null);
  };

  /** Удаляем одну строку
   *  @param index — индекс строки для удаления
   */
  const handleDelete = (index: number) => {
    const key = schema.headline;
    const prevGlobal = getTemplateValues(key);
    const nextLocal = localData.filter((_, i) => i !== index);
    setLocalData(nextLocal);
    setTemplateValues(
      key,
      prevGlobal.filter((_, i) => i !== index),
    );
    if (editingIndex === index) {
      form.resetFields();
      setEditingIndex(null);
    }
  };

  /**
   * Загружает выбранную запись в форму для редактирования.
   * @param index — индекс строки для редактирования
   */
  const handleEdit = (index: number) => {
    setEditingIndex(index);
    form.setFieldsValue(localData[index]);
  };

  return (
    <section className="dyf__root">
      <Title level={4}>{schema.headline}</Title>
      <div className="dyf__layout">
        <div className="dyf__form-col">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            {rootFields.map((field) => (
              <FieldRenderer key={field.key} field={field} path={[]} onRemove={() => {}} />
            ))}
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                {editingIndex === null ? 'Добавить запись' : 'Сохранить изменения'}
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="dyf__table-col">
          <FieldsTable
            rootFields={rootFields}
            data={localData}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </section>
  );
}
