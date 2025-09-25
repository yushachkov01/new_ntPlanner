/**
 * Рендерит динамическую форму по YAML-схеме, ведёт таблицу добавленных строк,
 * синхронизирует каждую строку с таймлайном.
 * Поддерживает редактирование/удаление, уведомляет родителя о числе строк
 * и умеет восстанавливать значения полей из initialValues (локальный оффлайн-черновик).
 */

import { Form, Typography, Button, message, Skeleton, Alert } from 'antd';
import { useEffect, useMemo, useState, useCallback } from 'react';

import './DynamicYamlForm.css';
import { templateStore } from '@/entities/template/model/store/templateStore';
import type { FieldCfg } from '@/features/pprEdit/model/types';
import { buildFieldTree } from '@/features/pprEdit/model/typeSystem/FieldTreeBuilder';
import { DeclarativeFormRenderer } from '@/features/pprEdit/ui/DeclarativeFormRenderer/DeclarativeFormRenderer';
import useTimelineStore from '@entities/timeline/model/store/timelineStore';
import { useTypesStore } from '@entities/types/model/store/typesStore';
import type { User } from '@entities/users/model/mapping/mapping';

import { FieldsTable } from '../FieldsTable/FieldsTable';
import { toArray } from './helpers/toArray';

const { Title } = Typography;

/**
 * - schema: любая YAML-схема шаблона
 * - executors?: массив исполнителей
 * - templateKey?: ключ шаблона
 * - initialValues?: стартовые значения формы (для восстановления из черновика)
 * - onValuesChange?: отдаём наверх актуальные значения формы (для автосейва)
 * - onRowCountChange?: (count: number) => void — уведомление о числе записей в таблице
 */
interface Props {
  schema: any;
  executors?: Array<Pick<User, 'id'> & { author?: string; role?: string }>;
  templateKey?: string;
  initialValues?: Record<string, any>;
  onValuesChange?: (values: Record<string, any>) => void;
  onRowCountChange?: (count: number) => void;
  onDisplayTableChange?: (
      headers: string[],
      rows: string[][],
      sources: (string | undefined)[],
      colKeys: string[],
  ) => void;
}

type RowWithSource = Record<string, any> & { __sourceKey?: string };

/** Универсальная проверка пустого значения. true => значение пустое */
const isEmptyValue = (value: unknown): boolean => {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (typeof value === 'boolean') return value === false;
  if (typeof value === 'number') return Number.isNaN(value);
  if (value instanceof Date) return Number.isNaN(+value);
  if (Array.isArray(value)) return value.length === 0 || value.every(isEmptyValue);
  if (typeof value === 'object') {
    const vals = Object.values(value as Record<string, unknown>);
    return vals.length === 0 || vals.every(isEmptyValue);
  }
  return false;
};
/** true => есть хотя бы одно ЗАПОЛНЕННОЕ значение */
const hasAnyFilled = (values: Record<string, any>): boolean =>
    Object.values(values).some((value) => !isEmptyValue(value));

/**
 * Компонент DynamicYamlForm: динамическая форма + таблица записей + связка с таймлайном.
 */
export default function DynamicYamlForm({
                                          schema,
                                          executors = [],
                                          templateKey,
                                          initialValues,
                                          onValuesChange,
                                          onRowCountChange,
                                          onDisplayTableChange,
                                        }: Props) {
  /** Управление формой Ant Design */
  const [form] = Form.useForm();
  const [localData, setLocalData] = useState<RowWithSource[]>([]);

  /** индекс редактируемой записи в таблице */
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  /** templateStore */
  const setTemplateValues = templateStore((state) => state.setTemplateValues);
  const getTemplateValues = templateStore((state) => state.getTemplateValues);

  /** экшены таймлайна */
  const addFromYaml = useTimelineStore((state) => state.addFromYaml);
  const removeBySource = useTimelineStore((state) => state.removeBySource);

  /** types.yaml загрузка/состояние */
  const types = useTypesStore((state) => state.types);
  const loadTypes = useTypesStore((state) => state.load);
  const isTypesLoading = useTypesStore((state) => state.isLoading);
  const typesError = useTypesStore((state) => state.error);

  const typesReady = !!types && typeof types === 'object' && Object.keys(types).length > 0;

  /** прогрев типов */
  useEffect(() => {
    void loadTypes(true);
  }, [loadTypes]);

  /** догрузка типов по необходимости */
  useEffect(() => {
    if (!typesReady) void loadTypes();
  }, [typesReady, loadTypes, types]);

  /** Исходные параметры для формы (верхний уровень) */
  const rawParams = useMemo(() => {
    return Array.isArray(schema?.params) && schema.params.length
        ? (schema.params as FieldCfg[])
        : (toArray({ fields: schema?.settings }) as FieldCfg[]);
  }, [schema?.params, schema?.settings]);

  /** Делаем ключи полей уникальными */
  const uiParams = useMemo(() => {
    const seenCounters = new Map<string, number>();
    return (rawParams ?? []).map((fieldConfig: any) => {
      const originalKey = String(fieldConfig.key ?? fieldConfig.name ?? '');
      if (!originalKey) return fieldConfig;
      const ordinalIndex = seenCounters.get(originalKey) ?? 0;
      seenCounters.set(originalKey, ordinalIndex + 1);
      return ordinalIndex === 0
          ? fieldConfig
          : { ...fieldConfig, key: `${originalKey}__${ordinalIndex + 1}` };
    }) as FieldCfg[];
  }, [rawParams]);

  /** Колонки таблицы по конфигурации полей */
  const tableColumns = useMemo<FieldCfg[]>(
      () =>
          (uiParams ?? []).map((fieldConfig: any) => ({
            key: fieldConfig.key ?? fieldConfig.name,
            name: fieldConfig.label ?? fieldConfig.name ?? fieldConfig.key,
            label: fieldConfig.label,
            type: fieldConfig.type,
            widget: (fieldConfig as any).widget,
          })),
      [uiParams],
  );

  /** Сброс формы/таблицы при смене схемы/шаблона + применение initialValues */
  useEffect(() => {
    form.resetFields();
    setLocalData([]);
    setEditingIndex(null);

    // если пришли стартовые значения из оффлайн-черновика — применим
    if (initialValues && typeof initialValues === 'object') {
      form.setFieldsValue(initialValues);
      // уведомим наверх и триггернём автосейв
      onValuesChange?.(form.getFieldsValue(true));
      document.dispatchEvent(new Event('ntp:form:changed'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema?.headline, uiParams, templateKey]);

  /** Применять новые initialValues (например, когда пользователь нажал «Продолжить») */
  useEffect(() => {
    if (initialValues && typeof initialValues === 'object') {
      form.setFieldsValue(initialValues);
      onValuesChange?.(form.getFieldsValue(true));
      document.dispatchEvent(new Event('ntp:form:changed'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  /** Уведомляем родителя о количестве строк */
  useEffect(() => {
    onRowCountChange?.(localData.length);
  }, [localData.length, onRowCountChange]);

  /** Получение порядка стадий из YAML */
  const stagesFromYaml = useMemo(() => {
    const rawSchema = schema ?? {};
    let startStageKey: string | undefined;
    let stagesField: Record<string, any> = {};

    if (rawSchema?.current_stages && rawSchema?.stages_field) {
      const asArray = Array.isArray(rawSchema.current_stages)
          ? rawSchema.current_stages
          : [rawSchema.current_stages];
      startStageKey = asArray?.[0];
      stagesField = rawSchema.stages_field ?? {};
    } else if (rawSchema?.start && rawSchema?.stages) {
      startStageKey = rawSchema.start;
      stagesField = rawSchema.stages ?? {};
    }

    const stageKeys: string[] = [];
    let cursorKey = startStageKey;
    let stepGuardCounter = 0;

    while (cursorKey && cursorKey !== 'exit' && stagesField[cursorKey] && stepGuardCounter < 500) {
      stageKeys.push(cursorKey);
      const successNext = stagesField[cursorKey]?.if_success;
      if (!successNext) break;
      cursorKey = Array.isArray(successNext) ? successNext[0] : successNext;
      stepGuardCounter++;
    }

    return { stageKeys, stagesField: stagesField as Record<string, any> };
  }, [schema]);

  /** Сабмит формы — добавление/редактирование записи + синхронизация с таймлайном */
  const onFinish = (vals: Record<string, any>) => {
    if (!hasAnyFilled(vals)) {
      message.warning('Заполните хотя бы одно поле перед добавлением записи');
      return;
    }

    const templateSectionKey = schema?.headline;
    const prevGlobalValues = getTemplateValues(templateSectionKey);
    const executorIds = (executors ?? []).map((executor: any) => executor.id);

    const { stageKeys, stagesField } = stagesFromYaml;

    if (editingIndex === null) {
      // ДОБАВЛЕНИЕ
      const sourceKey = `${
          templateKey ?? templateSectionKey
      }::${Date.now()}_${Math.random().toString(36).slice(2)}`;

      const nextRow: RowWithSource = { ...vals, __sourceKey: sourceKey };
      setLocalData((prev) => [...prev, nextRow]);
      setTemplateValues(templateSectionKey, [...prevGlobalValues, nextRow]);

      if (stageKeys.length) {
        addFromYaml({
          label: schema?.headline || schema?.description || 'Новая запись',
          stageKeys,
          stagesField,
          execIds: executorIds,
          sourceKey,
        });
        document.dispatchEvent(new Event('ntp:timeline:changed'));
      }
    } else {
      // РЕДАКТИРОВАНИЕ
      const sourceKey = localData[editingIndex]?.__sourceKey;
      const patchedRow: RowWithSource = { ...vals, __sourceKey: sourceKey };

      setLocalData((prev) =>
          prev.map((rowItem, index) => (index === editingIndex ? patchedRow : rowItem)),
      );
      setTemplateValues(
          templateSectionKey,
          prevGlobalValues.map((rowItem: any, index: number) =>
              index === editingIndex ? patchedRow : rowItem,
          ),
      );

      if (sourceKey) {
        removeBySource({ sourceKey });
        if (stageKeys.length) {
          addFromYaml({
            label: schema?.headline || schema?.templateName || 'Обновлённая запись',
            stageKeys,
            stagesField,
            execIds: executorIds,
            sourceKey,
          });
          document.dispatchEvent(new Event('ntp:timeline:changed'));
        }
      }
    }

    // очистка формы / выход из режима редактирования
    form.resetFields();
    setEditingIndex(null);

    // уведомим про изменения значений (для автосейва черновика)
    onValuesChange?.(form.getFieldsValue(true));
    document.dispatchEvent(new Event('ntp:form:changed'));
  };

  /** Удаляет запись из таблицы и блоки таймлайна по её sourceKey */
  const handleDelete = (index: number, passedSourceKey?: string) => {
    const templateSectionKey = schema?.headline;
    const prevGlobalValues = getTemplateValues(templateSectionKey);

    const sourceKey = String(
        passedSourceKey ??
        (localData[index] as any)?.__sourceKey ??
        (prevGlobalValues?.[index] as any)?.__sourceKey ??
        '',
    ).trim();

    if (sourceKey) {
      removeBySource({ sourceKey });
      document.dispatchEvent(new Event('ntp:timeline:changed'));

      setLocalData((prev) => prev.filter((row) => (row as any)?.__sourceKey !== sourceKey));
      setTemplateValues(
          templateSectionKey,
          (prevGlobalValues ?? []).filter((row: any) => row?.__sourceKey !== sourceKey),
      );
    } else {
      setLocalData((prev) => prev.filter((_, i) => i !== index));
      setTemplateValues(
          templateSectionKey,
          (prevGlobalValues ?? []).filter((_: any, i: number) => i !== index),
      );
    }

    if (
        editingIndex === index ||
        (sourceKey && localData[editingIndex ?? -1]?.__sourceKey === sourceKey)
    ) {
      form.resetFields();
      setEditingIndex(null);
      onValuesChange?.(form.getFieldsValue(true));
      document.dispatchEvent(new Event('ntp:form:changed'));
    }
  };

  /** Загружает запись в форму для редактирования */
  const handleEdit = (index: number) => {
    setEditingIndex(index);
    const formRow = { ...localData[index] };
    delete (formRow as any).__sourceKey;
    form.setFieldsValue(formRow);
    onValuesChange?.(form.getFieldsValue(true));
    document.dispatchEvent(new Event('ntp:form:changed'));
  };

  /** Построение дерева полей (если types загружены) */
  const fieldTree = useMemo(() => {
    if (!typesReady) return { nodes: [] };
    try {
      const { nodes } = buildFieldTree((uiParams ?? []) as FieldCfg[], types);
      return { nodes };
    } catch {
      return { nodes: [] };
    }
  }, [uiParams, typesReady, types]);

  /** Отдаём наружу текущую таблицу для предпросмотра */
  const handleDisplayTableChange = useCallback(
      (headers: string[], rows: string[][], sources: (string | undefined)[], colKeys: string[]) => {
        onDisplayTableChange?.(headers, rows, sources, colKeys);
      },
      [onDisplayTableChange],
  );

  /** Локальный обработчик изменениий формы для автосейва черновика */
  const handleValuesChange = (_: any, allValues: Record<string, any>) => {
    onValuesChange?.(allValues);
    document.dispatchEvent(new Event('ntp:form:changed'));
  };

  return (
      <section className="dyf__root">
        <Title level={4}>{schema?.headline}</Title>

        <div className="dyf__layout">
          <div className="dyf__form-col">
            <Form form={form} layout="vertical" onFinish={onFinish} onValuesChange={handleValuesChange}>
              {!typesReady ? (
                  <>
                    {typesError && (
                        <Alert
                            type="warning"
                            showIcon
                            message="Не удалось загрузить types.yaml"
                            description={typesError}
                            style={{ marginBottom: 12 }}
                        />
                    )}
                    <Skeleton active paragraph={{ rows: 3 }} />
                  </>
              ) : (
                  <DeclarativeFormRenderer nodes={fieldTree.nodes} />
              )}

              <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    block
                    disabled={!typesReady && isTypesLoading}
                >
                  {editingIndex === null ? 'Добавить запись' : 'Сохранить изменения'}
                </Button>
              </Form.Item>
            </Form>
          </div>

          <div className="dyf__table-col">
            <FieldsTable
                rootFields={tableColumns}
                data={localData}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDisplayTableChange={handleDisplayTableChange}
            />
          </div>
        </div>
      </section>
  );
}
