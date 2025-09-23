/**
 * Рендерит динамическую форму по YAML-схеме, ведёт таблицу добавленных строк,
 * синхронизирует каждую строку с таймлайном
 * поддерживает редактирование/удаление, и уведомляет родителя о количестве строк.
 *
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
 * - onRowCountChange?: (count: number) => void — уведомление о числе записей в таблице
 */
interface Props {
  schema: any;
  executors?: Array<Pick<User, 'id'> & { author?: string; role?: string }>;
  templateKey?: string;
  onRowCountChange?: (count: number) => void;
  onDisplayTableChange?: (
    headers: string[],
    rows: string[][],
    sources: (string | undefined)[],
    colKeys: string[],
  ) => void;
}

type RowWithSource = Record<string, any> & { __sourceKey?: string };

/**
 * Универсальная проверка пустого значения.
 * Возвращает true, если значение "пустое"
 */
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
  onRowCountChange,
  onDisplayTableChange,
}: Props) {
  /** Управление формой Ant Design */
  const [form] = Form.useForm();
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
   *   для декларативной формы:
   * - types: загруженные типы
   * - loadTypes: загрузка
   * - isTypesLoading/error: состояние загрузки
   */
  const types = useTypesStore((state) => state.types);
  const loadTypes = useTypesStore((state) => state.load);
  const isTypesLoading = useTypesStore((state) => state.isLoading);
  const typesError = useTypesStore((state) => state.error);

  /**
   * Флаг готовности типов: есть объект и в нём есть ключи.
   */
  const typesReady = !!types && typeof types === 'object' && Object.keys(types).length > 0;

  /**
   *  форс-загрузка типов при монтировании (первичный прогрев).
   */
  useEffect(() => {
    void loadTypes(true);
  }, [loadTypes]);

  /**
   * догрузка типов, если они ещё не готовы.
   */
  useEffect(() => {
    if (!typesReady) void loadTypes();
  }, [typesReady, loadTypes, types]);

  /**
   * Исходные параметры для формы (верхний уровень),
   */
  const rawParams = useMemo(() => {
    return Array.isArray(schema?.params) && schema.params.length
      ? (schema.params as FieldCfg[])
      : (toArray({ fields: schema?.settings }) as FieldCfg[]);
  }, [schema?.params, schema?.settings]);

  /**
   * Делаем ключи полей уникальными
   */
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

  /**
   * Колонки таблицы (видимые заголовки) по текущей конфигурации полей.
   */
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

  /**
   * Сброс формы/таблицы при смене схемы/шаблона.
   */
  useEffect(() => {
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
  }, [schema?.headline, uiParams, form, templateKey]);

  /**
   * Уведомляем родителя о количестве строк в таблице.
   */
  useEffect(() => {
    onRowCountChange?.(localData.length);
  }, [localData.length, onRowCountChange]);

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

  /**
   * сабмит формы — добавление или редактирование записи + синхронизация с таймлайном
   * params:
   * vals: значения полей формы
   */
  const onFinish = (vals: Record<string, any>) => {
    /** Если не заполнено ни одного поля — ничего не добавляем/не сохраняем */
    if (!hasAnyFilled(vals)) {
      message.warning('Заполните хотя бы одно поле перед добавлением записи');
      return;
    }

    /**
     * ключ раздела в templateStore
     */
    const templateSectionKey = schema?.headline;
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
        }
      }
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
      /** Удаляем блоки с таймлайна по ключу (для всех исполнителей) */
      removeBySource({ sourceKey });

      setLocalData((prev) => prev.filter((row) => (row as any)?.__sourceKey !== sourceKey));
      setTemplateValues(
        templateSectionKey,
        (prevGlobalValues ?? []).filter((row: any) => row?.__sourceKey !== sourceKey),
      );
    } else {
      /** если ключа нет, удаляем по индексу только в таблицах */
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

  /**
   * Построение дерева полей (если types загружены).
   */
  const fieldTree = useMemo(() => {
    if (!typesReady) return { nodes: [] };
    try {
      const { nodes } = buildFieldTree((uiParams ?? []) as FieldCfg[], types);
      return { nodes };
    } catch {
      return { nodes: [] };
    }
  }, [uiParams, typesReady, types]);

  const handleDisplayTableChange = useCallback(
    (headers: string[], rows: string[][], sources: (string | undefined)[], colKeys: string[]) => {
      onDisplayTableChange?.(headers, rows, sources, colKeys);
    },
    [onDisplayTableChange],
  );
  return (
    <section className="dyf__root">
      <Title level={4}>{schema?.headline}</Title>

      <div className="dyf__layout">
        <div className="dyf__form-col">
          <Form form={form} layout="vertical" onFinish={onFinish}>
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
