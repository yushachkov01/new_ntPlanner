import { Form, Typography, Button } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';

import './DynamicYamlForm.css';
import { templateStore } from '@/entities/template/model/store/templateStore';
import type { FieldCfg } from '@/features/pprEdit/model/types';
import useTimelineStore from '@entities/timeline/model/store/timelineStore';
import type { User } from '@entities/users/model/mapping/mapping';
import { FieldRenderer } from '@features/pprEdit/ui/DynamicYamlForm/FieldRenderer/FieldRenderer';

import { toArray } from './helpers/toArray';
import { FieldsTable } from '../FieldsTable/FieldsTable';

const { Title } = Typography;

interface Props {
  schema: any;
  executors?: Array<Pick<User, 'id'> & { author?: string; role?: string }>;
  templateKey?: string;
}

type RowWithSource = Record<string, any> & { __sourceKey?: string };

/**
 * Динамическая форма, рендерящая поля по конфигурации YAML.
 * schema: объект YAML-схемы
 * executors: исполнители, для которых будут создаваться блоки
 * templateKey: ключ шаблона
 */
export default function DynamicYamlForm({ schema, executors = [], templateKey }: Props) {
  /** Управление формой Ant Design */
  const [form] = Form.useForm();

  /** Состояние корневых полей */
  const [rootFields, setRootFields] = useState<FieldCfg[]>([]);
  const [localData, setLocalData] = useState<RowWithSource[]>([]);

  /**
   * индекс редактируемой записи в таблице
   * params
   */
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  /**
   * сеттер templateStore по ключу схемы
   */
  const setTemplateValues = templateStore((state) => state.setTemplateValues);

  /**
   * геттер templateStore по ключу схемы
   * params
   */
  const getTemplateValues = templateStore((state) => state.getTemplateValues);

  /**
   * экшен стора таймлайна
   */
  const addFromYaml = useTimelineStore((state) => state.addFromYaml);

  /**
   * экшен стора таймлайна: удалить блоки по sourceKey
   */
  const removeBySource = useTimelineStore((state) => state.removeBySource);

  /**
   * реакция на смену схемы - перерисовываем поля и очищаем значения
   */
  useEffect(() => {
    /**
     * нормализация полей формы из schema.settings
     * params
     */
    setRootFields(toArray({ fields: schema.settings }));

    /**
     * сброс значений формы
     */
    form.resetFields();

    /**
     * очистка локальной таблицы
     */
    setLocalData([]);

    /**
     * выход из режима редактирования
     */
    setEditingIndex(null);
  }, [schema.headline, schema.settings, form, templateKey]);

  /**
   * вычисляет упорядоченную цепочку стадий из YAML
   * schema: исходная YAML-схема
   * returns
   * { stageKeys, stagesField }: массив ключей стадий и словарь метаданных
   */
  const stagesFromYaml = useMemo(() => {
    /**
     * копия входной схемы
     */
    const rawSchema = schema ?? {};

    /**
     * стартовый ключ стадии
     */
    const startKey: string | undefined =
      Array.isArray(rawSchema.current_stages) && rawSchema.current_stages.length
        ? rawSchema.current_stages[0]
        : undefined;

    /**
     * словарь метаданных стадий
     */
    const stagesField: Record<string, any> = rawSchema.stages_field ?? {};

    /**
     * результирующий список ключей стадий по порядку
     */
    const stageKeys: string[] = [];

    /**
     * текущий курсор-ключ при обходе цепочки стадий
     */
    let cursorKey = startKey;
    let guard = 0;

    while (cursorKey && cursorKey !== 'exit' && guard < 200) {
      if (!stagesField[cursorKey]) break;
      stageKeys.push(cursorKey);
      cursorKey = stagesField[cursorKey]?.if_success;
      guard++;
    }

    return { stageKeys, stagesField: stagesField as Record<string, any> };
  }, [schema]);

  /**
   * сабмит формы — добавление или редактирование записи + синхронизация с таймлайном
   * params:
   * vals: значения полей формы
   */
  const onFinish = (vals: Record<string, any>) => {
    /**
     * ключ раздела в templateStore
     */
    const templateSectionKey = schema.headline;

    /**
     * предыдущее глобальное состояние значений по этому ключу
     */
    const prevGlobalValues = getTemplateValues(templateSectionKey);

    /**
     * список id исполнителей текущего шаблона (string|number как пришло)
     */
    const executorIds = (executors ?? []).map((executor: any) => executor.id);

    /**
     * разобранная из YAML цепочка стадий и словарь метаданных
     */
    const { stageKeys, stagesField } = stagesFromYaml;

    if (editingIndex === null) {
      /**ДОБАВЛЕНИЕ
       * уникальный ключ источника для связи «строка таблицы -> блоки таймлайна»
       */
      const sourceKey = `${
        templateKey ?? templateSectionKey
      }::${Date.now()}_${Math.random().toString(36).slice(2)}`;

      /**
       * новая строка таблицы с прикреплённым sourceKey
       */
      const nextRow: RowWithSource = { ...vals, __sourceKey: sourceKey };

      /**
       * новое значение таблицы
       */
      const nextLocalData = [...localData, nextRow];

      setLocalData(nextLocalData);
      setTemplateValues(templateSectionKey, [...prevGlobalValues, nextRow]);

      if (stageKeys.length) {
        addFromYaml({
          label: schema.headline || schema.templateName || 'Новая запись',
          stageKeys,
          stagesField,
          execIds: executorIds,
          sourceKey,
        });
      }
    } else {
      /**
       * РЕДАКТИРОВАНИЕ
       * исходный sourceKey редактируемой строки
       */
      const sourceKey = localData[editingIndex]?.__sourceKey;

      /**
       * обновлённая строка с сохранением sourceKey
       */
      const patchedRow: RowWithSource = { ...vals, __sourceKey: sourceKey };

      /**
       * новый массив локальных данных с заменой строки по индексу
       */
      const nextLocalData = localData.map((rowItem, index) =>
        index === editingIndex ? patchedRow : rowItem,
      );

      setLocalData(nextLocalData);
      setTemplateValues(
        templateSectionKey,
        prevGlobalValues.map((rowItem: any, index: number) =>
          index === editingIndex ? patchedRow : rowItem,
        ),
      );
    }

    /**
     * очистка формы и выход из режима редактирования
     */
    form.resetFields();
    setEditingIndex(null);
  };

  /**
   * удаляет запись из таблицы и соответствующие блоки с таймлайна по её sourceKey
   * params
   * - index: индекс удаляемой записи
   */
  const handleDelete = (index: number) => {
    /**
     * ключ раздела в templateStore — headline схемы
     * params
     */
    const templateSectionKey = schema.headline;

    /**
     * предыдущее глобальное состояние значений по этому ключу
     */
    const prevGlobalValues = getTemplateValues(templateSectionKey);

    /**
     * удаляемая строка
     */
    const rowToRemove = localData[index];

    /**
     * её sourceKey (если есть)
     */
    const rowSourceKey = rowToRemove?.__sourceKey;

    /**
     * локальные данные без удаляемой строки
     */
    const nextLocalData = localData.filter((_, i) => i !== index);

    setLocalData(nextLocalData);
    setTemplateValues(
      templateSectionKey,
      prevGlobalValues.filter((_: any, i: number) => i !== index),
    );

    if (rowSourceKey) {
      /**
       * id исполнителей, у которых нужно удалить связанные блоки
       */
      const executorIds = (executors ?? []).map((executor: any) => executor.id);
      removeBySource({ execIds: executorIds, sourceKey: rowSourceKey });
    }

    if (editingIndex === index) {
      form.resetFields();
      setEditingIndex(null);
    }
  };

  /**
   * Загружает выбранную запись в форму для редактирования.
   * params
   * - index: индекс строки для редактирования
   */
  const handleEdit = (index: number) => {
    /**
     * установка индекса редактируемой записи
     */
    setEditingIndex(index);

    /**
     * копия строки без служебного поля __sourceKey
     */
    const formRow = { ...localData[index] };
    delete (formRow as any).__sourceKey;

    /**
     * проставление значений в форму
     */
    form.setFieldsValue(formRow);
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
