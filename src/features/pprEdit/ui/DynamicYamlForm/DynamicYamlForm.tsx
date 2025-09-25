
/**
 * Динамическая форма по YAML (восстановление и live-синхронизация):
 * - строит поля по types.yaml
 * - хранит таблицу записей (каждая с __sourceKey)
 * - восстанавливает форму и таймлайн из сохранённых строк
 * - при любом изменении формы обновляет соответствующую строку и пересобирает её бандл
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Form, Typography, Button, message, Skeleton, Alert } from 'antd';

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

type RowWithSource = Record<string, any> & { __sourceKey?: string };

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
  /** уведомление вверх, если нужно сохранять секцию в LS */
  onDraftSectionChange?: (
      sectionKey: string,
      patch: { rows?: any[]; inProgress?: Record<string, any> },
  ) => void;
}

/* ---------- helpers ---------- */

const isEmptyValue = (v: unknown): boolean => {
  if (v == null) return true;
  if (typeof v === 'string') return v.trim() === '';
  if (typeof v === 'boolean') return v === false;
  if (typeof v === 'number') return Number.isNaN(v);
  if (v instanceof Date) return Number.isNaN(+v);
  if (Array.isArray(v)) return v.length === 0 || v.every(isEmptyValue);
  if (typeof v === 'object') {
    const vals = Object.values(v as Record<string, unknown>);
    return vals.length === 0 || vals.every(isEmptyValue);
  }
  return false;
};
const hasAnyFilled = (obj: Record<string, any>) =>
    Object.values(obj).some((v) => !isEmptyValue(v));

/* ---------- component ---------- */

const DynamicYamlForm: React.FC<Props> = ({
                                            schema,
                                            executors = [],
                                            templateKey,
                                            onRowCountChange,
                                            onDisplayTableChange,
                                            onDraftSectionChange,
                                          }) => {
  const [form] = Form.useForm();

  const [localRows, setLocalRows] = useState<RowWithSource[]>([]);
  /** если null — считаем, что редактируем «первую» строку (или новую) */
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const setTemplateValues = templateStore((s) => s.setTemplateValues);
  const getTemplateValues = templateStore((s) => s.getTemplateValues);

  const addFromYaml = useTimelineStore((s) => s.addFromYaml);
  const removeBySource = useTimelineStore((s) => s.removeBySource);

  const types = useTypesStore((s) => s.types);
  const loadTypes = useTypesStore((s) => s.load);
  const isTypesLoading = useTypesStore((s) => s.isLoading);
  const typesError = useTypesStore((s) => s.error);
  const typesReady = !!types && Object.keys(types).length > 0;

  /* --- загрузка types --- */
  useEffect(() => {
    void loadTypes(true);
  }, [loadTypes]);
  useEffect(() => {
    if (!typesReady) void loadTypes();
  }, [typesReady, loadTypes]);

  /* --- параметры формы из schema --- */
  const rawParams = useMemo(() => {
    return Array.isArray(schema?.params) && schema.params.length
        ? (schema.params as FieldCfg[])
        : (toArray({ fields: schema?.settings }) as FieldCfg[]);
  }, [schema?.params, schema?.settings]);

  const uiParams = useMemo(() => {
    const seen = new Map<string, number>();
    return (rawParams ?? []).map((cfg: any) => {
      const key = String(cfg.key ?? cfg.name ?? '');
      if (!key) return cfg;
      const n = seen.get(key) ?? 0;
      seen.set(key, n + 1);
      return n === 0 ? cfg : { ...cfg, key: `${key}__${n + 1}` };
    }) as FieldCfg[];
  }, [rawParams]);

  const tableColumns = useMemo<FieldCfg[]>(
      () =>
          (uiParams ?? []).map((cfg: any) => ({
            key: cfg.key ?? cfg.name,
            name: cfg.label ?? cfg.name ?? cfg.key,
            label: cfg.label,
            type: cfg.type,
            widget: (cfg as any).widget,
          })),
      [uiParams],
  );

  /* --- стадийная модель из YAML --- */
  const stagesFromYaml = useMemo(() => {
    const raw = schema ?? {};
    let start: string | undefined;
    let stagesDict: Record<string, any> = {};

    if (raw?.current_stages && raw?.stages_field) {
      const arr = Array.isArray(raw.current_stages) ? raw.current_stages : [raw.current_stages];
      start = arr?.[0];
      stagesDict = raw.stages_field ?? {};
    } else if (raw?.start && raw?.stages) {
      start = raw.start;
      stagesDict = raw.stages ?? {};
    }

    const stageKeys: string[] = [];
    let cur = start;
    let guard = 0;
    while (cur && cur !== 'exit' && stagesDict[cur] && guard < 500) {
      stageKeys.push(cur);
      const next = stagesDict[cur]?.if_success;
      if (!next) break;
      cur = Array.isArray(next) ? next[0] : next;
      guard++;
    }
    return { stageKeys, stagesField: stagesDict as Record<string, any> };
  }, [schema]);

  const execIds = useMemo(() => (executors ?? []).map((e: any) => e.id), [executors]);

  /* --- восстановление секции: строки, форма, таймлайн --- */
  useEffect(() => {
    const sectionKey = schema?.headline;
    const saved: RowWithSource[] = (getTemplateValues(sectionKey) ?? []) as any[];

    setLocalRows(saved);
    onRowCountChange?.(saved.length);
    onDraftSectionChange?.(sectionKey, { rows: saved });

    // Подставим значения в форму:
    const firstRow = saved?.[0];
    form.resetFields();
    if (firstRow) {
      const { __sourceKey, ...values } = firstRow;
      form.setFieldsValue(values); // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< подставляем сохранённые значения
      setEditingIndex(0); // считаем, что редактируем первую запись
    } else {
      setEditingIndex(null);
    }

    // Пересоберём таймлайн для каждой сохраненной строки
    const { stageKeys, stagesField } = stagesFromYaml;
    if (saved?.length && stageKeys.length) {
      saved.forEach((row) => {
        const sourceKey = row.__sourceKey;
        if (!sourceKey) return;
        removeBySource({ sourceKey });
        addFromYaml({
          label: sectionKey || 'Запись',
          stageKeys,
          stagesField,
          execIds,
          sourceKey,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema?.headline, templateKey, uiParams, stagesFromYaml, getTemplateValues, execIds]);

  /* --- уведомление о количестве строк --- */
  useEffect(() => {
    onRowCountChange?.(localRows.length);
  }, [localRows.length, onRowCountChange]);

  /* --- дерево полей --- */
  const fieldTree = useMemo(() => {
    if (!typesReady) return { nodes: [] as any[] };
    try {
      const { nodes } = buildFieldTree((uiParams ?? []) as FieldCfg[], types);
      return { nodes };
    } catch {
      return { nodes: [] as any[] };
    }
  }, [uiParams, typesReady, types]);

  /* --- live-синхронизация при изменении формы --- */
  const syncRowAndTimeline = useCallback(
      (rowIndex: number, patchValues: Record<string, any>) => {
        const sectionKey = schema?.headline;
        const prevRows = (getTemplateValues(sectionKey) ?? []) as RowWithSource[];

        const baseRow = prevRows[rowIndex] ?? localRows[rowIndex];
        const sourceKey = baseRow?.__sourceKey;

        // если строки нет — ничего не делаем (её создаст сабмит)
        if (!baseRow || !sourceKey) return;

        const nextRow: RowWithSource = { ...baseRow, ...patchValues, __sourceKey: sourceKey };

        const nextRows = prevRows.map((r, i) => (i === rowIndex ? nextRow : r));
        setLocalRows((cur) => cur.map((r, i) => (i === rowIndex ? nextRow : r)));
        setTemplateValues(sectionKey, nextRows);
        onDraftSectionChange?.(sectionKey, { rows: nextRows, inProgress: patchValues });

        // пересобираем именно этот бандл
        const { stageKeys, stagesField } = stagesFromYaml;
        if (stageKeys.length) {
          removeBySource({ sourceKey });
          addFromYaml({
            label: sectionKey || 'Запись',
            stageKeys,
            stagesField,
            execIds,
            sourceKey,
          });
        }
      },
      [
        schema?.headline,
        localRows,
        setTemplateValues,
        getTemplateValues,
        onDraftSectionChange,
        stagesFromYaml,
        execIds,
        removeBySource,
        addFromYaml,
      ],
  );

  const handleValuesChange = useCallback(
      (_changed: any, allValues: Record<string, any>) => {
        const sectionKey = schema?.headline ?? 'unknown';
        onDraftSectionChange?.(sectionKey, { inProgress: allValues });

        // если редактируем существующую — обновляем и пересобираем её бандл
        const index = editingIndex ?? 0;
        if ((localRows[index]?.__sourceKey)) {
          syncRowAndTimeline(index, allValues);
        }
      },
      [schema?.headline, editingIndex, localRows, onDraftSectionChange, syncRowAndTimeline],
  );

  /* --- сабмит: добавить новую или сохранить редактируемую --- */
  const onFinish = (vals: Record<string, any>) => {
    if (!hasAnyFilled(vals)) {
      message.warning('Заполните хотя бы одно поле перед добавлением записи');
      return;
    }
    const sectionKey = schema?.headline;
    const prevRows = (getTemplateValues(sectionKey) ?? []) as RowWithSource[];
    const { stageKeys, stagesField } = stagesFromYaml;

    if (editingIndex === null || !localRows[editingIndex]?.__sourceKey) {
      // Добавление
      const sourceKey = `${templateKey ?? sectionKey}::${Date.now()}_${Math.random()
          .toString(36)
          .slice(2)}`;
      const nextRow: RowWithSource = { ...vals, __sourceKey: sourceKey };
      const nextRows = [...prevRows, nextRow];

      setLocalRows((cur) => [...cur, nextRow]);
      setTemplateValues(sectionKey, nextRows);
      onDraftSectionChange?.(sectionKey, { rows: nextRows });

      if (stageKeys.length) {
        addFromYaml({
          label: schema?.headline || schema?.description || 'Новая запись',
          stageKeys,
          stagesField,
          execIds,
          sourceKey,
        });
      }
      // остаёмся в режиме редактирования только что созданной строки
      setEditingIndex(nextRows.length - 1);
    } else {
      // Сохранение существующей
      const idx = editingIndex!;
      const sourceKey = localRows[idx].__sourceKey!;
      const updated: RowWithSource = { ...vals, __sourceKey: sourceKey };
      const nextRows = prevRows.map((r, i) => (i === idx ? updated : r));

      setLocalRows((cur) => cur.map((r, i) => (i === idx ? updated : r)));
      setTemplateValues(sectionKey, nextRows);
      onDraftSectionChange?.(sectionKey, { rows: nextRows });

      removeBySource({ sourceKey });
      if (stageKeys.length) {
        addFromYaml({
          label: schema?.headline || schema?.templateName || 'Обновлённая запись',
          stageKeys,
          stagesField,
          execIds,
          sourceKey,
        });
      }
    }
  };

  /* --- удаление строки --- */
  const handleDelete = (index: number, passedSourceKey?: string) => {
    const sectionKey = schema?.headline;
    const prevRows = (getTemplateValues(sectionKey) ?? []) as RowWithSource[];

    const sourceKey =
        passedSourceKey ??
        prevRows[index]?.__sourceKey ??
        localRows[index]?.__sourceKey ??
        '';

    if (sourceKey) {
      removeBySource({ sourceKey });
      const filterByKey = (r: any) => r?.__sourceKey !== sourceKey;
      const nextRows = prevRows.filter(filterByKey);

      setLocalRows((cur) => cur.filter(filterByKey));
      setTemplateValues(sectionKey, nextRows);
      onDraftSectionChange?.(sectionKey, { rows: nextRows });
    } else {
      const nextRows = prevRows.filter((_, i) => i !== index);
      setLocalRows((cur) => cur.filter((_, i) => i !== index));
      setTemplateValues(sectionKey, nextRows);
      onDraftSectionChange?.(sectionKey, { rows: nextRows });
    }

    if (editingIndex === index) {
      setEditingIndex(null);
      form.resetFields();
    }
  };

  /* --- загрузить запись в форму для явного редактирования --- */
  const handleEdit = (index: number) => {
    setEditingIndex(index);
    const { __sourceKey, ...values } = localRows[index] ?? {};
    form.setFieldsValue(values ?? {});
    onDraftSectionChange?.(schema?.headline ?? 'unknown', { inProgress: values ?? {} });
  };

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
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onValuesChange={handleValuesChange}
            >
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
                  <DeclarativeFormRenderer nodes={buildFieldTree((uiParams ?? []) as FieldCfg[], types).nodes} />
              )}

              <Form.Item>
                <Button type="primary" htmlType="submit" block disabled={!typesReady && isTypesLoading}>
                  {editingIndex == null || !localRows[editingIndex]?.__sourceKey
                      ? 'Добавить запись'
                      : 'Сохранить изменения'}
                </Button>
              </Form.Item>
            </Form>
          </div>

          <div className="dyf__table-col">
            <FieldsTable
                rootFields={tableColumns}
                data={localRows}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDisplayTableChange={handleDisplayTableChange}
            />
          </div>
        </div>
      </section>
  );
};

export default DynamicYamlForm;
