
/**
 * DynamicYamlForm — форма по YAML + таблица.
 * - Источник полей: LS(PPR_DRAFT.mainTemplateRaw.params) → schema.params → schema.settings.
 * - Обогащение виджетов/опций из types.yaml (и fallback из самих params).
 * - Гидрация инпутов из LS (params[*].value), с маппингом под актуальные ключи (__2/__3).
 * - «ЗНАЧЕНИЕ ИЗ PARAMS»: первая непустая строка из templates-store.
 * - Таблица: строки замаплены под текущие ключи колонок.
 */

import { Form, Typography, Button, message, Skeleton, Alert } from 'antd';
import {useEffect, useMemo, useRef, useState, useCallback, useId} from 'react';

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

/* ==================== Utils ==================== */

const isEmptyValue = (v: unknown) => {
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
const hasAnyFilled = (obj: Record<string, any>) => Object.values(obj).some((v) => !isEmptyValue(v));

const safeParse = <T,>(raw: string | null): T | null => {
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
};

/** Прочитать КАРТУ значений из localStorage: PPR_DRAFT.* → mainTemplateRaw.params[*].value */
function readParamsValueMapFromLS(targetMainTemplateKey?: string): Record<string, any> {
  const rows: Array<{ key?: string; params?: any[]; updatedAt?: string }> = [];

  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i) || '';
    if (!k.startsWith('PPR_DRAFT::')) continue;
    const v = safeParse<any>(localStorage.getItem(k));
    if (!v) continue;

    const mtKey = v?.mainTemplateKey ?? v?.mainTemplate?.mainTemplateKey;
    const mtr = v?.mainTemplateRaw ?? v?.mainTemplate?.mainTemplateRaw ?? {};
    const params = Array.isArray(mtr?.params) ? mtr.params : Array.isArray(v?.params) ? v.params : null;
    if (!params) continue;

    rows.push({ key: mtKey, params, updatedAt: v?.updatedAt || v?.updated_at || v?.time || '' });
  }

  if (!rows.length) return {};

  let chosen =
      rows.find((r) => (r.key || '') === (targetMainTemplateKey || '')) ||
      rows.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))[0];

  const out: Record<string, any> = {};
  for (const p of chosen.params as any[]) {
    const key = String(p?.key ?? p?.name ?? '').trim();
    if (!key) continue;
    if ('value' in (p ?? {})) out[key] = (p as any).value;
  }
  return out;
}

/** Прочитать МАССИВ параметров из LS (как в mainTemplateRaw.params[*]) — для построения UI */
function readParamsArrayFromLS(targetMainTemplateKey?: string): any[] | undefined {
  const candidates: Array<{ key?: string; params?: any[]; updatedAt?: string }> = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i) || '';
    if (!k.startsWith('PPR_DRAFT::')) continue;
    const v = safeParse<any>(localStorage.getItem(k));
    if (!v) continue;
    const mtKey = v?.mainTemplateKey ?? v?.mainTemplate?.mainTemplateKey;
    const mtr = v?.mainTemplateRaw ?? v?.mainTemplate?.mainTemplateRaw ?? {};
    const params = Array.isArray(mtr?.params) ? mtr.params : null;
    if (!params) continue;
    candidates.push({ key: mtKey, params, updatedAt: v?.updatedAt || v?.updated_at || v?.time || '' });
  }
  if (!candidates.length) return undefined;
  const chosen =
      candidates.find((c) => (c.key || '') === (targetMainTemplateKey || '')) ||
      candidates.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))[0];
  return chosen?.params ?? undefined;
}

/** map из schema.params[*].value (fallback) */
function buildValueMapFromSchema(schema: any): Record<string, any> {
  const arr = Array.isArray(schema?.params) ? schema.params : [];
  const out: Record<string, any> = {};
  for (const p of arr) {
    const key = String(p?.key ?? p?.name ?? '').trim();
    if (!key) continue;
    if ('value' in (p ?? {})) out[key] = (p as any).value;
  }
  return out;
}

/** слить определения полей: LS(params) → schema.params → schema.settings  */
function buildEffectiveParams(
    lsParamsRaw: Array<{ key?: string; name?: string; label?: string; type?: string; widget?: string; enum?: any[]; options?: any[] }> | undefined,
    schemaParams: FieldCfg[] | undefined,
    settingsAsParams: FieldCfg[] | undefined,
): FieldCfg[] {
  const ls = Array.isArray(lsParamsRaw) ? lsParamsRaw : [];
  const base = Array.isArray(schemaParams) && schemaParams.length
      ? schemaParams
      : Array.isArray(settingsAsParams) ? settingsAsParams : [];

  const byKey = new Map<string, FieldCfg>();
  for (const f of base) {
    const k = String((f as any).key ?? (f as any).name ?? '').trim();
    if (k) byKey.set(k, f);
  }

  for (const p of ls) {
    const k = String(p?.key ?? p?.name ?? '').trim();
    if (!k) continue;
    const prev = byKey.get(k) ?? ({} as FieldCfg);
    byKey.set(k, {
      ...prev,
      key: k,
      name: prev?.name ?? k,
      label: p?.label ?? prev?.label ?? k,
      type: p?.type ?? prev?.type,
      // прокинем, если в LS уже лежит widget/options/enum
      ...(p?.widget ? { widget: (p as any).widget } : {}),
      ...(p?.enum ? { enum: (p as any).enum } : {}),
      ...(p?.options ? { options: (p as any).options } : {}),
    } as FieldCfg);
  }

  return Array.from(byKey.values());
}

type AnyFieldCfg = FieldCfg & {
  __originalKey?: string;
  widget?: string;
  options?: Array<{ label: string; value: any }>;
};

/** обогатить widget/options из types.yaml; если нет типа — выбрать безопасный widget */
function enrichParamsWithTypes(params: FieldCfg[], types: any): AnyFieldCfg[] {
  return (params ?? []).map((f: any) => {
    const tKey = String(f?.type ?? '').trim();
    const tDef = tKey && types ? types[tKey] : null;

    const rawOptions = f?.options ?? f?.enum ?? tDef?.options ?? tDef?.enum ?? null;

    const widget =
        f?.widget ??
        tDef?.widget ??
        (Array.isArray(rawOptions) ? 'select' : 'input');

    const options = Array.isArray(rawOptions)
        ? rawOptions.map((opt: any) =>
            typeof opt === 'object'
                ? { label: String(opt.label ?? opt.name ?? opt.value ?? opt), value: opt.value ?? opt.key ?? opt }
                : { label: String(opt), value: opt },
        )
        : undefined;

    return { ...f, widget, options } as AnyFieldCfg;
  });
}

/** объект без __sourceKey и пустых значений */
function buildDisplayObjFromRow(row?: Record<string, any> | null): Record<string, any> | null {
  if (!row) return null;
  const clone = { ...row };
  delete (clone as any).__sourceKey;
  const entries = Object.entries(clone).filter(([, v]) => !isEmptyValue(v));
  if (!entries.length) return null;
  return Object.fromEntries(entries);
}

/** замапить одну строку (originalKeys → formKeys) под текущие uiParams */
function mapRowToFormKeys(
    row: Record<string, any>,
    uiParams: (AnyFieldCfg & { __originalKey?: string })[],
): RowWithSource {
  const mapped: RowWithSource = { __sourceKey: (row as any).__sourceKey };
  for (const f of uiParams) {
    const formKey = (f as any).key ?? (f as any).name;
    const originalKey = (f as any).__originalKey ?? formKey;
    if (!formKey) continue;

    if (Object.prototype.hasOwnProperty.call(row, formKey)) {
      mapped[formKey] = (row as any)[formKey];
    } else if (Object.prototype.hasOwnProperty.call(row, originalKey)) {
      mapped[formKey] = (row as any)[originalKey];
    }
  }
  return mapped;
}

/* ==================== Component ==================== */

export default function DynamicYamlForm({
                                          schema,
                                          executors = [],
                                          templateKey,
                                          onRowCountChange,
                                          onDisplayTableChange,
                                        }: Props) {
  const [form] = Form.useForm();
  const [localData, setLocalData] = useState<RowWithSource[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const setTemplateValues = templateStore((s) => s.setTemplateValues);
  const getTemplateValues = templateStore((s) => s.getTemplateValues);

  const addFromYaml = useTimelineStore((s) => s.addFromYaml);
  const removeBySource = useTimelineStore((s) => s.removeBySource);

  const types = useTypesStore((s) => s.types);
  const loadTypes = useTypesStore((s) => s.load);
  const isTypesLoading = useTypesStore((s) => s.isLoading);
  const typesError = useTypesStore((s) => s.error);

  const typesReady = !!types && typeof types === 'object' && Object.keys(types).length > 0;

  const storeKey = useMemo(
      () => (templateKey ?? schema?.headline ?? 'unknown_template') as string,
      [templateKey, schema?.headline],
  );
  const instanceId = useId();
  const formKey = `${storeKey}::${instanceId}`;

  /* загрузка types */
  useEffect(() => { void loadTypes(true); }, [loadTypes]);
  useEffect(() => { if (!typesReady) void loadTypes(); }, [typesReady, loadTypes, types]);

  /* читаем "сырой" список параметров из LS (для построения UI) */
  const lsParamsArray = useMemo(() => readParamsArrayFromLS(templateKey), [templateKey]);

  /* исходники параметров из schema */
  const schemaParams = useMemo(
      () => (Array.isArray(schema?.params) ? (schema.params as FieldCfg[]) : undefined),
      [schema?.params],
  );
  const settingsAsParams = useMemo(
      () => (toArray({ fields: schema?.settings }) as FieldCfg[]) ?? undefined,
      [schema?.settings],
  );

  /* эффективные поля и их обогащение виджетами/опциями */
  const effectiveParams = useMemo(
      () => buildEffectiveParams(lsParamsArray, schemaParams, settingsAsParams),
      [lsParamsArray, schemaParams, settingsAsParams],
  );

  const enrichedParams = useMemo(
      () => enrichParamsWithTypes(effectiveParams, types),
      [effectiveParams, types],
  );

  /** делаем ключи уникальными и помним __originalKey */
  const uiParams = useMemo(() => {
    const seen = new Map<string, number>();
    return (enrichedParams ?? []).map((f: any) => {
      const originalKey = String(f.key ?? f.name ?? '').trim();
      if (!originalKey) return f as AnyFieldCfg & { __originalKey?: string };
      const idx = seen.get(originalKey) ?? 0;
      seen.set(originalKey, idx + 1);
      return idx === 0
          ? { ...f, __originalKey: originalKey }
          : { ...f, __originalKey: originalKey, key: `${originalKey}__${idx + 1}` };
    }) as (AnyFieldCfg & { __originalKey?: string })[];
  }, [enrichedParams]);

  /** колонки таблицы (пробрасываем widget/options) */
  const tableColumns = useMemo(
      () =>
          (uiParams ?? []).map((f: any) => ({
            key: f.key ?? f.name,
            name: f.label ?? f.name ?? f.key,
            label: f.label,
            type: f.type,
            widget: f.widget,
            options: f.options,
          })),
      [uiParams],
  );

  /** значения для гидрации инпутов: приоритет LS → schema */
  const paramsFromLSMap   = useMemo(() => readParamsValueMapFromLS(templateKey), [templateKey]);
  const paramsFromSchema  = useMemo(() => buildValueMapFromSchema(schema), [schema?.params]);
  const rawParamsCombined = useMemo(() => ({ ...paramsFromSchema, ...paramsFromLSMap }), [paramsFromSchema, paramsFromLSMap]);

  /** маппинг значений под текущие ключи формы */
  const paramsValueMap = useMemo(() => {
    if (!uiParams?.length) return {};
    const res: Record<string, any> = {};
    for (const f of uiParams) {
      const formKey = (f as any).key ?? (f as any).name;
      const originalKey = (f as any).__originalKey ?? formKey;
      if (!formKey) continue;
      if (originalKey in rawParamsCombined) res[formKey] = rawParamsCombined[originalKey];
    }
    return res;
  }, [uiParams, rawParamsCombined]);

  /** когда реально построены ноды формы */
  const nodesReadyRef = useRef(false);
  const fieldTree = useMemo(() => {
    if (!uiParams?.length) return { nodes: [] as any[] };
    try {
      const { nodes } = buildFieldTree(uiParams as FieldCfg[], types ?? {});
      nodesReadyRef.current = nodes.length > 0;
      return { nodes };
    } catch {
      nodesReadyRef.current = false;
      return { nodes: [] as any[] };
    }
  }, [uiParams, types]);

  /** посев таблицы (и templates-store) при холодном старте */
  useEffect(() => {
    setLocalData([]);
    setEditingIndex(null);

    const existing = getTemplateValues(storeKey);
    if (Array.isArray(existing) && existing.length > 0) {
      setLocalData(existing as RowWithSource[]);
      return;
    }
    if (Object.keys(rawParamsCombined).length) {
      const seeded: RowWithSource = {
        ...rawParamsCombined,
        __sourceKey: `${storeKey}::seed_${Date.now().toString(36)}`,
      };
      setLocalData([seeded]);
      setTemplateValues(storeKey, [seeded]);
    }
  }, [storeKey, rawParamsCombined, getTemplateValues, setTemplateValues]);

  /** гидрация формы — после монтирования полей */
  useEffect(() => {
    const tick = setTimeout(() => {
      if (nodesReadyRef.current && Object.keys(paramsValueMap).length) {
        form.setFieldsValue(paramsValueMap);
      }
    }, 0);
    return () => clearTimeout(tick);
  }, [paramsValueMap, form, fieldTree.nodes]);

  /** «ЗНАЧЕНИЕ ИЗ PARAMS»: первая непустая строка из templates-store */
  const displayObjFromTemplatesStore = useMemo(() => {
    const firstFilled = localData.find((row) => {
      const clone = { ...row }; delete (clone as any).__sourceKey;
      return Object.values(clone).some((v) => v !== undefined && v !== null && String(v).trim?.() !== '');
    });
    return buildDisplayObjFromRow(firstFilled || null);
  }, [localData]);

  const paramsValueString = useMemo(() => {
    if (!displayObjFromTemplatesStore) return '';
    const entries = Object.entries(displayObjFromTemplatesStore);
    if (entries.length === 1) return String(entries[0][1] ?? '');
    try { return JSON.stringify(displayObjFromTemplatesStore); } catch { return String(displayObjFromTemplatesStore); }
  }, [displayObjFromTemplatesStore]);

  /** данные для таблицы: строки → маппинг под form/table keys */
  const tableDataMapped = useMemo<RowWithSource[]>(() => {
    if (!Array.isArray(localData) || !uiParams?.length) return localData;
    return localData.map((row) => mapRowToFormKeys(row, uiParams));
  }, [localData, uiParams]);

  /* служебные эффекты */
  useEffect(() => { onRowCountChange?.(localData.length); }, [localData.length, onRowCountChange]);

  /** этапы из YAML */
  const stagesFromYaml = useMemo(() => {
    const raw = schema ?? {};
    let startStageKey: string | undefined;
    let stagesField: Record<string, any> = {};

    if (raw?.current_stages && raw?.stages_field) {
      const asArr = Array.isArray(raw.current_stages) ? raw.current_stages : [raw.current_stages];
      startStageKey = asArr?.[0];
      stagesField = raw.stages_field ?? {};
    } else if (raw?.start && raw?.stages) {
      startStageKey = raw.start;
      stagesField = raw.stages ?? {};
    }

    const stageKeys: string[] = [];
    let cursor = startStageKey;
    let guard = 0;
    while (cursor && cursor !== 'exit' && stagesField[cursor] && guard < 500) {
      stageKeys.push(cursor);
      const next = stagesField[cursor]?.if_success;
      if (!next) break;
      cursor = Array.isArray(next) ? next[0] : next;
      guard++;
    }
    return { stageKeys, stagesField: stagesField as Record<string, any> };
  }, [schema]);

  /** сабмит */
  const onFinish = (vals: Record<string, any>) => {
    if (!hasAnyFilled(vals)) { message.warning('Заполните хотя бы одно поле'); return; }

    const prev = getTemplateValues(storeKey);
    const executorIds = (executors ?? []).map((e: any) => e.id); // пока не используется, но сохраняю
    const { stageKeys, stagesField } = stagesFromYaml;

    if (editingIndex === null) {
      const sourceKey = `${storeKey}::${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const nextRow: RowWithSource = { ...vals, __sourceKey: sourceKey };
      setLocalData((p) => [...p, nextRow]);
      setTemplateValues(storeKey, [...prev, nextRow]);

      if (stageKeys.length) {
        addFromYaml({
          label: schema?.headline || schema?.description || 'Новая запись',
          stageKeys, stagesField, execIds: executorIds, sourceKey,
        });
      }
    } else {
      const sourceKey = localData[editingIndex]?.__sourceKey;
      const patchedRow: RowWithSource = { ...vals, __sourceKey: sourceKey };
      setLocalData((p) => p.map((r, i) => (i === editingIndex ? patchedRow : r)));
      setTemplateValues(storeKey, prev.map((r: any, i: number) => (i === editingIndex ? patchedRow : r)));

      if (sourceKey) {
        removeBySource({ sourceKey });
        if (stageKeys.length) {
          addFromYaml({
            label: schema?.headline || schema?.templateName || 'Обновлённая запись',
            stageKeys, stagesField, execIds: executorIds, sourceKey,
          });
        }
      }
    }

    form.resetFields();
    setEditingIndex(null);
  };

  const handleDelete = (index: number, passedSourceKey?: string) => {
    const prev = getTemplateValues(storeKey);
    const sourceKey = String(
        passedSourceKey ??
        (localData[index] as any)?.__sourceKey ??
        (prev?.[index] as any)?.__sourceKey ??
        '',
    ).trim();

    if (sourceKey) {
      removeBySource({ sourceKey });
      setLocalData((p) => p.filter((row) => (row as any)?.__sourceKey !== sourceKey));
      setTemplateValues(storeKey, (prev ?? []).filter((row: any) => row?.__sourceKey !== sourceKey));
    } else {
      setLocalData((p) => p.filter((_, i) => i !== index));
      setTemplateValues(storeKey, (prev ?? []).filter((_: any, i: number) => i !== index));
    }

    if (editingIndex === index || (sourceKey && localData[editingIndex ?? -1]?.__sourceKey === sourceKey)) {
      form.resetFields();
      setEditingIndex(null);
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    const formRow = mapRowToFormKeys(localData[index], uiParams);
    delete (formRow as any).__sourceKey;
    form.setFieldsValue(formRow);
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

        {/* Вывод из первой непустой строки templates-store */}
        <p style={{ margin: '0 0 12px 0', opacity: 0.85 }}>
          <strong>ЗНАЧЕНИЕ ИЗ PARAMS:</strong>{' '}
          <span>{paramsValueString || '—'}</span>
        </p>

        <div className="dyf__layout">
          <div className="dyf__form-col">
            <Form
                key={formKey}
                form={form}
                layout="vertical"
                initialValues={paramsValueMap}
                onFinish={onFinish}
            >
              {!fieldTree.nodes.length ? (
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
                <Button type="primary" htmlType="submit" block disabled={!fieldTree.nodes.length && isTypesLoading}>
                  {editingIndex === null ? 'Добавить запись' : 'Сохранить изменения'}
                </Button>
              </Form.Item>
            </Form>
          </div>

          <div className="dyf__table-col">
            <FieldsTable
                rootFields={tableColumns as any}
                data={tableDataMapped}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDisplayTableChange={handleDisplayTableChange}
            />
          </div>
        </div>
      </section>
  );
}
