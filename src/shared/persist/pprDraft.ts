/**
 * src/shared/persist/pprDraft.ts
 *
 * Персистентность драфта PPR строго через V2-ключи:
 *   PPR_DRAFT::<taskId>::<templateKey>::<executorId>::stages
 *
 * НИЧЕГО больше в localStorage не пишем (никаких ::params и совместимых V1).
 * Параметры формы живут в zustand-persist ("templates-store") и попадают в unified-snapshot
 * через sections.unknown.inProgress.
 */

import { useEffect, useRef } from 'react';
import { templateStore } from '@/entities/template/model/store/templateStore';
import useTimelineStore from '@entities/timeline/model/store/timelineStore';
import YAML from 'yaml';

const TAG = '[PPR DRAFT]';
const log = (...args: any[]) => console.log(TAG, ...args);

/** =================== Типы =================== */

export type ParamsDraft = Record<string, Record<string, any>[]>;

export type MinutesByStageMap = Record<number, Record<string, number>>;

export interface UnifiedStagesSnapshot {
    executorsByTemplate: any[][];
    mainTemplateKey: string | undefined;
    mainTemplateRaw: Record<string, any> | undefined;
    /** В снапшоте храним список параметров; value НЕ хранится отдельно в LS — это часть снапшота. */
    params: Array<{ key: string; label: string; type: string; value?: any }>;
    stages: Record<string, any>;
    sections: { unknown: { inProgress: Record<string, any> } };
    taskId: string;
    updatedAt: string;
    v: number;
    __debugInfo__?: {
        minutesByStage: MinutesByStageMap;
        rowsCount: number;
        blocksCount: number;
        stageValuesFrom: 'mergedOverrides' | 'stageFieldEdits' | 'none';
        stageValuesSample?: any;
    };
}

/** =================== Helpers: key encoding =================== */

const enc = (s: string) => encodeURIComponent(String(s ?? '')).replace(/%20/g, '+');
const dec = (s: string) => decodeURIComponent(String(s ?? '').replace(/\+/g, '%20'));

/** =================== Ключи LS =================== */

const baseV2 = (taskId: string, templateKey: string, executorId: string) =>
    `PPR_DRAFT::${enc(taskId)}::${enc(templateKey)}::${enc(executorId)}`;

export const stagesKeyV2 = (taskId: string, templateKey: string, executorId: string) =>
    `${baseV2(taskId, templateKey, executorId)}::stages`;

/** =================== Безопасный JSON / анти-луп =================== */

const takeScalar = (v: any) => (v && typeof v === 'object' && 'value' in v ? (v as any).value : v);

const deepChanged = (a: unknown, b: unknown) => {
    try {
        return JSON.stringify(a) !== JSON.stringify(b);
    } catch {
        return true;
    }
};

export function safeStringify(value: unknown): string {
    try {
        return JSON.stringify(value);
    } catch {
        return 'null';
    }
}

export function safeParse<T = unknown>(text: string | null | undefined): T | undefined {
    if (typeof text !== 'string' || text.trim() === '') return undefined;
    try {
        return JSON.parse(text) as T;
    } catch {
        return undefined;
    }
}

export function saveDraftToLocalStorage<T>(key: string, data: T): void {
    try {
        if (typeof window === 'undefined') return;
        const prev = loadDraftFromLocalStorage<T>(key);
        if (!deepChanged(prev, data)) return;
        window.localStorage.setItem(key, safeStringify(data));
        log('LS SAVE', key, data);
    } catch (e) {
        log('LS SAVE error', key, e);
    }
}

export function loadDraftFromLocalStorage<T>(key: string): T | undefined {
    try {
        if (typeof window === 'undefined') return undefined;
        const parsed = safeParse<T>(window.localStorage.getItem(key));
        log('LS LOAD', key, parsed);
        return parsed;
    } catch (e) {
        log('LS LOAD error', key, e);
        return undefined;
    }
}

/** =================== Утилиты обнаружения/очистки =================== */

export const draftPrefix = (taskId: string) => `PPR_DRAFT::${enc(taskId)}::`;

export function hasDraftForTask(taskId: string): boolean {
    try {
        if (typeof window === 'undefined') return false;
        const prefix = draftPrefix(taskId);
        const suffix = '::stages';
        for (let i = 0; i < window.localStorage.length; i++) {
            const k = window.localStorage.key(i) || '';
            if (k.startsWith(prefix) && k.endsWith(suffix)) {
                log('hasDraftForTask: found key', k);
                return true;
            }
        }
        return false;
    } catch (e) {
        log('hasDraftForTask error', e);
        return false;
    }
}

export function clearDraftForTask(taskId: string): void {
    try {
        if (typeof window === 'undefined') return;
        const prefix = draftPrefix(taskId);
        const toDelete: string[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
            const k = window.localStorage.key(i) || '';
            if (k.startsWith(prefix)) toDelete.push(k);
        }
        toDelete.forEach((k) => window.localStorage.removeItem(k));
        log('LS CLEAR ALL for task', taskId, 'removed=', toDelete);
    } catch (e) {
        log('LS CLEAR error', taskId, e);
    }
}

/** ===== V2: загрузка снапшотов стадий по шаблонам/исполнителям ===== */
export function loadV2Snapshots(
    taskId: string
): Array<{ templateKey: string; executorId: string; snapshot: UnifiedStagesSnapshot }> {
    const out: Array<{ templateKey: string; executorId: string; snapshot: UnifiedStagesSnapshot }> = [];
    try {
        if (typeof window === 'undefined') return out;
        const prefix = draftPrefix(taskId);
        const suffix = '::stages';

        for (let i = 0; i < window.localStorage.length; i++) {
            const key = window.localStorage.key(i) || '';
            if (!key.startsWith(prefix) || !key.endsWith(suffix)) continue;

            const middle = key.slice(prefix.length, key.length - suffix.length);
            const parts = middle.split('::');
            if (parts.length !== 2) continue;

            const [templateKeyEnc, executorIdEnc] = parts;
            const templateKey = dec(templateKeyEnc);
            const executorId = dec(executorIdEnc);

            const snap = loadDraftFromLocalStorage<UnifiedStagesSnapshot>(key);
            if (snap) out.push({ templateKey, executorId, snapshot: snap });
        }
    } catch (e) {
        log('loadV2Snapshots error', e);
    }
    return out;
}

/** =================== Снимки сто́ров =================== */

function snapshotParamsFromTemplateStore(): ParamsDraft {
    const state = templateStore.getState();
    const values = (state?.templateValues ?? {}) as ParamsDraft;
    log('SNAPSHOT paramsFromTemplateStore keys=', Object.keys(values));
    return values;
}

/** =================== Helpers =================== */

function normalizeRaw(raw: any): any {
    if (!raw) return undefined;
    if (typeof raw === 'object') return raw;
    if (typeof raw === 'string') {
        try {
            const parsedY = YAML.parse(raw);
            if (parsedY && typeof parsedY === 'object') return parsedY;
        } catch {}
        try {
            const parsedJ = JSON.parse(raw);
            return parsedJ;
        } catch {}
        return undefined;
    }
    return undefined;
}

const toArray = (v: any) => (v == null ? [] : Array.isArray(v) ? v : [v]);
const isTerminal = (v: any) => v === 'exit' || v == null;

function normalizeStageLinks(stages: Record<string, any>, known: Record<string, any> | undefined) {
    if (!known) return;
    for (const [key, s] of Object.entries(stages)) {
        const nexts = [...toArray((s as any)?.if_success), ...toArray((s as any)?.if_failure)];
        const valid: string[] = [];
        for (const to of nexts) {
            if (isTerminal(to)) continue;
            if (!Object.prototype.hasOwnProperty.call(known, to)) {
                console.warn('[PPR DRAFT] Unknown stage link', { from: key, to });
                continue;
            }
            valid.push(String(to));
        }
        if (Array.isArray((s as any)?.if_success)) {
            (s as any).if_success = (s as any).if_success.filter((x: any) => valid.includes(String(x)));
        } else if (typeof (s as any)?.if_success === 'string' && !valid.includes(String((s as any).if_success))) {
            (s as any).if_success = undefined;
        }
        if (Array.isArray((s as any)?.if_failure)) {
            (s as any).if_failure = (s as any).if_failure.filter((x: any) => valid.includes(String(x)));
        } else if (typeof (s as any)?.if_failure === 'string' && !valid.includes(String((s as any).if_failure))) {
            (s as any).if_failure = undefined;
        }
    }
}

function ensureStageFields(args: {
    stages: Record<string, any>;
    stageKey: string;
    knownStages: Record<string, any> | undefined;
}): boolean {
    const { stages, stageKey, knownStages } = args;
    if (!knownStages || !Object.prototype.hasOwnProperty.call(knownStages, stageKey)) return false;
    const s = stages[stageKey];
    if (!s || typeof s !== 'object') {
        stages[stageKey] = { fields: {} };
    } else if (!s.fields || typeof s.fields !== 'object') {
        s.fields = {};
    }
    return true;
}

/** Собираем строки формы, относящиеся к templateKey (включая «мусорные» ключи по __sourceKey). */
function collectRowsForTemplate(templateValues: ParamsDraft, templateKey?: string): Record<string, any>[] {
    if (!templateKey) return [];
    const rows: Record<string, any>[] = [];
    const pushAll = (arr?: any[]) => {
        if (!Array.isArray(arr)) return;
        for (const r of arr) if (r && typeof r === 'object') rows.push(r);
    };
    pushAll((templateValues as any)[templateKey]);

    for (const [k, arr] of Object.entries(templateValues || {})) {
        if (k === templateKey) continue;
        if (!Array.isArray(arr)) continue;
        for (const r of arr) {
            const src = String((r as any)?.__sourceKey ?? '').trim();
            if (!src) continue;
            const left = src.split('::')[0];
            if (left === templateKey) rows.push(r);
        }
    }

    const seen = new Set<string>();
    const uniq: Record<string, any>[] = [];
    for (const r of rows) {
        const key = safeStringify(r);
        if (seen.has(key)) continue;
        seen.add(key);
        uniq.push(r);
    }
    return uniq;
}

/** Стабильный сбор ВСЕХ шаблонов из extras + templateStore (на случай, если extras.templates не прокинут). */
function collectTemplatesEverywhere(extras?: {
    mainTemplate?: any;
    templates?: Array<any | undefined>;
}) {
    const list: any[] = [];

    const normalizeKey = (t: any): string => {
        const raw =
            t?.key ??
            t?.templateKey ??
            t?.templateName ??
            t?.name ??
            t?.id ??
            t?.template;
        let key = String(raw ?? '').trim();
        if (!key) {
            const fromRaw =
                t?.raw?.templateName ??
                t?.raw?.name ??
                t?.raw?.key ??
                t?.raw?.id;
            key = String(fromRaw ?? '').trim();
        }
        return key;
    };

    const push = (t?: any) => {
        if (!t) return;
        const key = normalizeKey(t);
        if (!key) return;
        const rawCandidate = t?.raw ?? t?.content ?? t?.yaml ?? t?.text ?? t?.rawYaml;
        list.push({ ...t, key, raw: rawCandidate ?? t?.raw });
    };

    // 1) из extras
    if (extras?.mainTemplate) push(extras.mainTemplate);
    if (Array.isArray(extras?.templates)) extras!.templates!.forEach(push);

    // 2) из templateStore
    try {
        const st = (templateStore as any)?.getState?.() ?? {};
        const possibleArrays = [
            st.templates,
            st.items,
            st.list,
            st.allTemplates,
            st.availableTemplates,
            st.selectedTemplates,
            st.templateList,
        ].filter(Array.isArray) as any[][];
        for (const arr of possibleArrays) arr.forEach(push);

        const possibleMaps = [st.templatesMap, st.byKey, st.templatesByKey, st.map].filter(
            (m: any) => m && typeof m === 'object'
        ) as Record<string, any>[];
        for (const m of possibleMaps) Object.values(m).forEach(push);
    } catch (e) {
        log('collectTemplatesEverywhere store scan error:', e);
    }

    const seen = new Set<string>();
    const uniq: any[] = [];
    for (const t of list) {
        if (seen.has(t.key)) continue;
        seen.add(t.key);
        uniq.push(t);
    }
    log('TEMPLATES collected:', uniq.map((t) => t.key));
    return uniq;
}

/** =================== Построение единого среза =================== */

function snapshotMinutesFromTimeline(): {
    minutesByStage: MinutesByStageMap;
    rowsCount: number;
    blocksCount: number;
} {
    const tl = (useTimelineStore as any)?.getState?.();
    const minutesByStage: MinutesByStageMap = {};
    let rowsCount = 0;
    let blocksCount = 0;

    const add = (tplIdx: number, stageKey: string, minutes: number) => {
        if (!Number.isFinite(minutes)) return;
        if (minutes <= 0) return;
        if (!minutesByStage[tplIdx]) minutesByStage[tplIdx] = {};
        minutesByStage[tplIdx][stageKey] = Math.round(minutes);
    };

    if (tl && Array.isArray(tl.rows)) {
        rowsCount = tl.rows.length;
        for (const row of tl.rows as any[]) {
            const blocks = Array.isArray(row?.blocks) ? row.blocks : [];
            blocksCount += blocks.length;
            for (const block of blocks) {
                const tplIdx: number | undefined =
                    typeof block?.tplIdx === 'number'
                        ? block.tplIdx
                        : typeof block?.templateIdx === 'number'
                            ? block.templateIdx
                            : typeof block?.templateIndex === 'number'
                                ? block.templateIndex
                                : undefined;

                const stageKey: string | undefined =
                    block?.stageKey ?? block?.stage ?? block?.stage_id ?? block?.stage_name;

                const minutesRaw = block?.minutes ?? block?.duration ?? block?.timer ?? block?.timerMinutes;

                if (typeof tplIdx === 'number' && typeof stageKey === 'string' && typeof minutesRaw === 'number') {
                    add(tplIdx, stageKey, minutesRaw);
                }
            }
        }
    }

    log('SNAPSHOT minutesByStage', minutesByStage, 'rows=', rowsCount, 'blocks=', blocksCount);
    return { minutesByStage, rowsCount, blocksCount };
}

function snapshotStageFieldValuesFromTimeline(
    tplIdx: number,
    templateRaw?: any
): { source: 'mergedOverrides' | 'stageFieldEdits' | 'none'; map?: Record<string, Record<string, any>> } {
    const tl = (useTimelineStore as any)?.getState?.();
    if (!tl) return { source: 'none' };

    const rows: any[] = Array.isArray(tl.rows) ? tl.rows : [];

    const rowsOfTpl: { row: any; idxInAll: number }[] = [];
    rows.forEach((r, i) => {
        const rTplIdx =
            typeof r?.tplIdx === 'number'
                ? r.tplIdx
                : typeof r?.templateIdx === 'number'
                    ? r.templateIdx
                    : typeof r?.templateIndex === 'number'
                        ? r.templateIndex
                        : undefined;
        if (rTplIdx === tplIdx) rowsOfTpl.push({ row: r, idxInAll: i });
    });

    const idSet = new Set<string>();
    const indexSet = new Set<string>();
    const stageKeysInBlocks = new Set<string>();

    for (const { row, idxInAll } of rowsOfTpl) {
        const rid = row?.id ?? row?.rowId ?? row?.row_id ?? row?.uuid ?? row?.key ?? row?._id ?? row?.hash;
        if (rid != null && String(rid)) idSet.add(String(rid));
        indexSet.add(String(idxInAll));

        const blocks = Array.isArray(row?.blocks) ? row.blocks : [];
        for (const b of blocks) {
            const sk = String(b?.stageKey ?? b?.stage ?? b?.stage_id ?? b?.stage_name ?? '');
            if (sk) stageKeysInBlocks.add(sk);
        }
    }

    const knownStagesRoot = templateRaw?.stages ?? templateRaw?.stages_field ?? {};
    const stageKeysForTpl = new Set<string>(Object.keys(knownStagesRoot));

    const filterFlatByStageKeys = (flat: Record<string, any>) => {
        const out: Record<string, Record<string, any>> = {};
        const mustCheckBlocks = stageKeysInBlocks.size > 0;
        for (const [stageKey, fields] of Object.entries(flat || {})) {
            if (!stageKeysForTpl.has(stageKey)) continue;
            if (mustCheckBlocks && !stageKeysInBlocks.has(stageKey)) continue;

            const payload = takeScalar(fields);
            if (!payload || typeof payload !== 'object') continue;

            out[stageKey] = {};
            for (const [fieldKey, v] of Object.entries(payload)) {
                if (String(fieldKey).startsWith('__')) continue;
                out[stageKey][fieldKey] = takeScalar(v) ?? null;
            }
        }
        return out;
    };

    const collapsePerRow = (perRowObj: Record<string, any>) => {
        const out: Record<string, Record<string, any>> = {};
        let matched = false;

        for (const [rowKey, byStage] of Object.entries(perRowObj || {})) {
            const accept = idSet.has(rowKey) || indexSet.has(rowKey) || /^\d+$/.test(rowKey);
            if (!accept) continue;
            matched = true;

            const stagesMap = byStage && typeof byStage === 'object' ? byStage : {};
            for (const [stageKey, rawFields] of Object.entries(stagesMap)) {
                if (!stageKeysForTpl.has(stageKey)) continue;
                if (stageKeysInBlocks.size && !stageKeysInBlocks.has(stageKey)) continue;

                const payload = takeScalar(rawFields);
                if (!payload || typeof payload !== 'object') continue;

                out[stageKey] = out[stageKey] || {};
                for (const [fieldKey, v] of Object.entries(payload)) {
                    if (String(fieldKey).startsWith('__')) continue;
                    out[stageKey][fieldKey] = takeScalar(v) ?? null;
                }
            }
        }
        return { out, matched };
    };

    try {
        if (typeof (tl as any).getMergedStageOverrides === 'function') {
            const merged = (tl as any).getMergedStageOverrides();
            if (merged && typeof merged === 'object' && Object.keys(merged).length > 0) {
                const keys = Object.keys(merged);
                const looksPerRow =
                    keys.some((k) => idSet.has(k)) || keys.some((k) => indexSet.has(k)) || keys.every((k) => /^\d+$/.test(k));

                if (looksPerRow) {
                    const { out, matched } = collapsePerRow(merged as Record<string, any>);
                    if (matched && Object.keys(out).length > 0) return { source: 'mergedOverrides', map: out };
                } else {
                    const filtered = filterFlatByStageKeys(merged as Record<string, any>);
                    if (Object.keys(filtered).length > 0) return { source: 'mergedOverrides', map: filtered };
                }
            }
        }
    } catch (e) {
        log('getMergedStageOverrides threw', e);
    }

    try {
        const raw = (tl as any).stageFieldEdits;
        if (!raw || typeof raw !== 'object') return { source: 'none' };

        const { out, matched } = collapsePerRow(raw as Record<string, any>);
        if (matched && Object.keys(out).length > 0) return { source: 'stageFieldEdits', map: out };

        const filtered = filterFlatByStageKeys(raw as Record<string, any>);
        if (Object.keys(filtered).length > 0) return { source: 'stageFieldEdits', map: filtered };

        return { source: 'none' };
    } catch (e) {
        log('stageFieldEdits normalize error', e);
        return { source: 'none' };
    }
}

function buildUnifiedStagesSnapshot(args: {
    taskId: string;
    mainTemplate?: any;
    executorsByTemplate?: any[][];
    prev?: UnifiedStagesSnapshot | undefined;
    tplIdx?: number;
}): UnifiedStagesSnapshot {
    const { taskId, mainTemplate, executorsByTemplate, prev, tplIdx = 0 } = args;

    const mainTemplateKey: string | undefined = (mainTemplate as any)?.key;

    const normalizedRaw: Record<string, any> | undefined = normalizeRaw(
        (mainTemplate as any)?.raw ?? (mainTemplate as any)?.content ?? (mainTemplate as any)?.yaml ?? (mainTemplate as any)?.text
    );
    const rawClone: Record<string, any> | undefined = normalizedRaw
        ? JSON.parse(JSON.stringify(normalizedRaw))
        : undefined;

    const knownStagesRaw: Record<string, any> =
        (rawClone?.stages && typeof rawClone.stages === 'object')
            ? rawClone.stages
            : (rawClone?.stages_field && typeof rawClone.stages_field === 'object')
                ? rawClone.stages_field
                : {};

    const stages: Record<string, any> = JSON.parse(JSON.stringify(knownStagesRaw));

    normalizeStageLinks(stages, knownStagesRaw);

    for (const [stageKey, stage] of Object.entries(stages)) {
        if (!stage || typeof stage !== 'object') {
            (stages as any)[stageKey] = { fields: {} };
            continue;
        }
        if (!(stage as any).fields || typeof (stage as any).fields !== 'object') {
            (stages as any)[stageKey].fields = {};
        }
        for (const [fieldKey, rawField] of Object.entries(((stages as any)[stageKey].fields) ?? {})) {
            if (rawField && typeof rawField === 'object') {
                if (!('value' in (rawField as any))) {
                    (stages as any)[stageKey].fields[fieldKey] = { ...(rawField as any), value: null };
                }
            } else {
                (stages as any)[stageKey].fields[fieldKey] = { value: null };
            }
        }
    }

    const templateValues = snapshotParamsFromTemplateStore();
    const rowsForTpl = collectRowsForTemplate(templateValues, mainTemplateKey);

    const inProgress: Record<string, any> = {};
    for (const chunk of rowsForTpl) {
        if (!chunk || typeof chunk !== 'object') continue;
        for (const [k, v] of Object.entries(chunk)) {
            if (String(k).startsWith('__')) continue;
            inProgress[k] = takeScalar(v);
        }
    }
    const sections = { unknown: { inProgress } };

    if (prev?.stages && typeof prev.stages === 'object' && prev.mainTemplateKey === mainTemplateKey) {
        for (const [stageKey, prevStage] of Object.entries(prev.stages)) {
            if (!ensureStageFields({ stages, stageKey, knownStages: knownStagesRaw })) continue;

            if (typeof (prevStage as any).time === 'string') {
                (stages as any)[stageKey].time = (prevStage as any).time;
            }

            const prevFields = (prevStage as any).fields;
            if (prevFields && typeof prevFields === 'object') {
                for (const [fieldKey, pf] of Object.entries(prevFields)) {
                    const rawField = (((stages as any)[stageKey].fields ?? {})[fieldKey] ?? {}) as Record<string, any>;
                    const prevValue = takeScalar(pf);
                    (stages as any)[stageKey].fields[fieldKey] = { ...rawField, value: prevValue ?? null };
                }
            }
        }
    }

    const { minutesByStage, rowsCount, blocksCount } = snapshotMinutesFromTimeline();
    const byStageForTpl = minutesByStage[tplIdx] ?? {};
    for (const [stageKey, minutes] of Object.entries(byStageForTpl)) {
        if (!ensureStageFields({ stages, stageKey, knownStages: knownStagesRaw })) continue;
        (stages as any)[stageKey].time = `${Math.max(0, Math.round(Number(minutes) || 0))}m`;
    }

    const stageValuesRes = snapshotStageFieldValuesFromTimeline(tplIdx, rawClone);
    if (stageValuesRes.map) {
        for (const [stageKey, map] of Object.entries(stageValuesRes.map)) {
            if (!ensureStageFields({ stages, stageKey, knownStages: knownStagesRaw })) continue;
            for (const [fieldKey, value] of Object.entries(map)) {
                const rawField = (((stages as any)[stageKey].fields ?? {})[fieldKey] ?? {}) as Record<string, any>;
                (stages as any)[stageKey].fields[fieldKey] = { ...rawField, value: takeScalar(value) ?? null };
            }
        }
    }

    if (inProgress && typeof inProgress === 'object') {
        const knownStages = knownStagesRaw;
        for (const [stageKey, stageRaw] of Object.entries(knownStages)) {
            if (!ensureStageFields({ stages, stageKey, knownStages })) continue;
            const rawFields = (stageRaw as any)?.fields || {};
            for (const fieldKey of Object.keys(rawFields)) {
                const current = (stages as any)[stageKey].fields?.[fieldKey]?.value;
                if (current === undefined || current === null) {
                    const fallback = takeScalar((inProgress as any)[fieldKey]);
                    const rawField = (((stages as any)[stageKey].fields ?? {})[fieldKey] ?? {}) as Record<string, any>;
                    (stages as any)[stageKey].fields[fieldKey] = { ...rawField, value: fallback ?? null };
                }
            }
        }
    }

    const paramDefs: Array<{ key: string; label: string; type: string }> = Array.isArray(rawClone?.params)
        ? (rawClone!.params as any[]).map((p) => ({
            key: String(p?.key ?? ''),
            label: String(p?.label ?? String(p?.key ?? '')),
            type: String(p?.type ?? ''),
        }))
        : [];

    const pickFromStages = (paramKey: string) => {
        for (const stage of Object.values(stages ?? {})) {
            const fields = (stage as any)?.fields;
            if (!fields || typeof fields !== 'object') continue;
            if (Object.prototype.hasOwnProperty.call(fields, paramKey)) {
                const rf = fields[paramKey];
                const v = rf && typeof rf === 'object' && 'value' in (rf as any) ? (rf as any).value : rf;
                if (v !== undefined && v !== null) return v;
            }
        }
        return undefined;
    };

    const paramsWithValue = paramDefs.map((pd) => {
        const aliases = Array.from(
            new Set([pd.key, pd.label, (pd as any).name, (pd as any).widget, pd.type].map((v) => String(v ?? '').trim()).filter(Boolean))
        );

        let vFromForm: any = undefined;
        for (const a of aliases) {
            if ((sections.unknown.inProgress as any)?.hasOwnProperty(a)) {
                vFromForm = (sections.unknown.inProgress as any)[a];
                break;
            }
        }

        let v: any = vFromForm;
        if (v === undefined) {
            for (const a of aliases) {
                const vv = pickFromStages(a);
                if (vv !== undefined && vv !== null) {
                    v = vv;
                    break;
                }
            }
        }

        return { ...pd, value: v ?? null };
    });

    if (Array.isArray(rawClone?.params)) {
        const byKey = new Map(paramsWithValue.map((p) => [p.key, p.value]));
        rawClone!.params = (rawClone!.params as any[]).map((p) => {
            const k = String(p?.key ?? '');
            const v = byKey.has(k) ? byKey.get(k) : undefined;
            const existing = (p as any)?.value;
            return v !== undefined ? { ...p, value: v } : existing !== undefined ? { ...p, value: existing } : { ...p, value: null };
        });
    }

    const snapshot: UnifiedStagesSnapshot = {
        executorsByTemplate: (executorsByTemplate ?? []) as any[][],
        mainTemplateKey,
        mainTemplateRaw: rawClone,
        params: paramsWithValue,
        stages,
        sections,
        taskId,
        updatedAt: new Date().toISOString(),
        v: 1,
        __debugInfo__: {
            minutesByStage,
            rowsCount,
            blocksCount,
            stageValuesFrom: stageValuesRes.source,
            stageValuesSample: stageValuesRes.map ? Object.entries(stageValuesRes.map)[0] : undefined,
        },
    };

    log('UNIFIED SNAPSHOT built', {
        taskId,
        mainTemplateKey,
        paramsCount: paramsWithValue.length,
        stagesCount: Object.keys(stages).length,
        tplIdx,
        stageValuesFrom: snapshot.__debugInfo__?.stageValuesFrom,
    });

    return snapshot;
}

/** =================== Подписки =================== */

function subscribePlain(store: any, onAnyChange: () => void, tag: string): () => void {
    try {
        if (!store?.subscribe) return () => {};
        return store.subscribe(() => {
            log(`${tag} <- change detected`);
            onAnyChange();
        });
    } catch {
        return () => {};
    }
}

/** =================== Вспомогательное: где взять executorId =================== */

function deriveExecutorsByTemplateIdx(idx: number, extras?: { executorsByTemplate?: any[][] }): string[] {
    // 1) из extras
    const xbt = extras?.executorsByTemplate ?? [];
    if (Array.isArray(xbt[idx]) && (xbt[idx] as any[]).length > 0) {
        return (xbt[idx] as any[]).map((e: any) => String(e?.id ?? e?.uuid ?? e?.login ?? e?.userId ?? e));
    }
    if (Array.isArray(xbt[0]) && (xbt[0] as any[]).length > 0) {
        return (xbt[0] as any[]).map((e: any) => String(e?.id ?? e?.uuid ?? e?.login ?? e?.userId ?? e));
    }

    // 2) из templateStore (частые варианты названий)
    try {
        const st = (templateStore as any)?.getState?.() ?? {};
        const candidates =
            st.executorsByTemplate ??
            st.assigneesByTemplate ??
            st.performersByTemplate ??
            st.ownersByTemplate ??
            st.templateExecutors ??
            st.selectedExecutors;

        const arr = Array.isArray(candidates?.[idx]) ? candidates[idx] : Array.isArray(candidates?.[0]) ? candidates[0] : [];
        if (arr?.length) {
            return (arr as any[]).map((e: any) => String(e?.id ?? e?.uuid ?? e?.login ?? e?.userId ?? e));
        }
    } catch {}

    // 3) фоллбэк: чтобы сегмент не пустел
    return ['__noexec__'];
}

/** =================== Публичный хук =================== */

export function usePprDraftPersistence(
    taskId: string | undefined,
    extras?: {
        mainTemplate?: any;
        executorsByTemplate?: any[][];
        templates?: Array<any | undefined>;
    }
) {
    const lastTaskRef = useRef<string | undefined>(undefined);

    useEffect(() => {
        if (!taskId) return;

        log('MOUNT taskId=', taskId, 'extras.mainTemplate?.key=', extras?.mainTemplate?.key);
        lastTaskRef.current = taskId;

        const savePerTemplateExecutor = () => {
            const templates = collectTemplatesEverywhere({ mainTemplate: extras?.mainTemplate, templates: extras?.templates });

            log(
                'AUTOSAVE templates:',
                templates.map((t, i) => ({
                    idx: i,
                    key: t?.key,
                    hasRaw: !!(t?.raw ?? t?.content ?? t?.yaml ?? t?.text ?? t?.rawYaml),
                }))
            );

            templates.forEach((tpl, idx) => {
                const tKey = String((tpl as any)?.key ?? '').trim();
                let raw = normalizeRaw((tpl as any)?.raw ?? (tpl as any)?.content ?? (tpl as any)?.yaml ?? (tpl as any)?.text ?? (tpl as any)?.rawYaml);

                if (!tKey) return;
                if (!raw) raw = { params: [], stages: {} }; // безопасный фоллбэк — чтобы ключ появился

                const execIds = deriveExecutorsByTemplateIdx(idx, { executorsByTemplate: extras?.executorsByTemplate });

                execIds.forEach((eid) => {
                    const sKey2 = stagesKeyV2(taskId, tKey, String(eid));
                    const prev2 = loadDraftFromLocalStorage<UnifiedStagesSnapshot>(sKey2);
                    const unified2 = buildUnifiedStagesSnapshot({
                        taskId,
                        mainTemplate: { ...(tpl as any), raw },
                        executorsByTemplate: extras?.executorsByTemplate,
                        prev: prev2,
                        tplIdx: idx,
                    });

                    log('AUTOSAVE →', { tplIdx: idx, templateKey: tKey, executorId: String(eid), lsKey: sKey2 });
                    saveDraftToLocalStorage<UnifiedStagesSnapshot>(sKey2, unified2);
                });
            });
        };

        const unsubTemplate = subscribePlain(templateStore, () => {
            savePerTemplateExecutor();
        }, 'templateStore');

        const unsubTimeline = subscribePlain((useTimelineStore as any), () => {
            savePerTemplateExecutor();
        }, 'timelineStore');

        let unsubStageForm: undefined | (() => void);
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const maybe = require('@/entities/stageFormStore/model/store/stageFormStore');
            if (maybe?.useStageFormStore?.subscribe) {
                unsubStageForm = subscribePlain(maybe.useStageFormStore, () => {
                    savePerTemplateExecutor();
                }, 'stageFormStore');
            }
        } catch {}

        // Первичный прогон
        savePerTemplateExecutor();

        return () => {
            unsubTemplate?.();
            unsubTimeline?.();
            unsubStageForm?.();
        };
    }, [taskId, extras?.mainTemplate, extras?.executorsByTemplate, extras?.templates]);
}

/** ======== Unified Snapshot → rows / minutes / fields ======== */

export function rowsFromUnifiedSnapshot(snap: UnifiedStagesSnapshot): Array<Record<string, any>> {
    if (!snap) return [];

    if (Array.isArray(snap.params) && snap.params.length > 0) {
        const row: Record<string, any> = {};
        for (const p of snap.params) {
            const k = String(p?.key ?? '').trim();
            if (!k) continue;
            if ('value' in (p as any)) row[k] = (p as any).value ?? null;
        }
        if (Object.keys(row).length > 0) {
            if (snap.mainTemplateKey) row.__sourceKey = snap.mainTemplateKey;
            return [row];
        }
    }

    const raw = normalizeRaw(snap.mainTemplateRaw) ?? snap.mainTemplateRaw;

    const paramKeys: string[] = Array.isArray(raw?.params)
        ? raw.params.map((p: any) => String(p?.key ?? '').trim()).filter(Boolean)
        : [];

    if (paramKeys.length === 0) return [];

    const inProgress = snap?.sections?.unknown?.inProgress ?? {};

    const stageFieldValue = (paramKey: string) => {
        for (const stage of Object.values(snap.stages ?? {})) {
            const fields = (stage as any)?.fields;
            if (!fields || typeof fields !== 'object') continue;
            if (Object.prototype.hasOwnProperty.call(fields, paramKey)) {
                const rf = fields[paramKey];
                const v = rf && typeof rf === 'object' && 'value' in (rf as any) ? (rf as any).value : rf;
                if (v !== undefined && v !== null) return v;
            }
        }
        return undefined;
    };

    const row: Record<string, any> = {};
    for (const key of paramKeys) {
        const v1 = (inProgress as any)?.[key];
        const v2 = v1 === undefined ? stageFieldValue(key) : v1;
        row[key] = v2 ?? null;
    }
    if (snap.mainTemplateKey) row.__sourceKey = snap.mainTemplateKey;
    return [row];
}

export function minutesFromUnifiedSnapshot(snap: UnifiedStagesSnapshot): Record<string, number> {
    const out: Record<string, number> = {};
    if (!snap?.stages) return out;

    for (const [stageKey, stage] of Object.entries(snap.stages)) {
        const t = (stage as any)?.time;
        if (typeof t !== 'string') continue;
        const mm = parseInt(t.replace(/\D+/g, ''), 10);
        if (Number.isFinite(mm)) out[stageKey] = Math.max(0, mm);
    }
    return out;
}

export function stageFieldValuesFromUnifiedSnapshot(
    snap: UnifiedStagesSnapshot
): Record<string, Record<string, any>> {
    const out: Record<string, Record<string, any>> = {};
    if (!snap?.stages) return out;

    for (const [stageKey, stage] of Object.entries(snap.stages)) {
        const fields = (stage as any)?.fields;
        if (!fields || typeof fields !== 'object') continue;

        for (const [fieldKey, rawField] of Object.entries(fields)) {
            const v =
                rawField && typeof rawField === 'object' && 'value' in (rawField as any)
                    ? (rawField as any).value
                    : rawField;
            if (v === undefined) continue;
            if (!out[stageKey]) out[stageKey] = {};
            out[stageKey][fieldKey] = v;
        }
    }
    return out;
}

/** =================== Мгновенный патч таймера (только V2) =================== */

export function patchStageTimeInLocalStorage(opts: {
    taskId: string;
    tplIdx: number;
    stageKey: string;
    minutes: number;
    mainTemplate?: any;
    executorsByTemplate?: any[][];
    templates?: Array<any | undefined>;
}): void {
    const { taskId, tplIdx, stageKey, minutes, mainTemplate, executorsByTemplate, templates } = opts;

    const tpl =
        (Array.isArray(templates) && templates[tplIdx]) ??
        (tplIdx === 0 ? mainTemplate : undefined);
    const tKey = String((tpl as any)?.key ?? '').trim();
    if (!tKey) return;

    const execIds =
        Array.isArray(executorsByTemplate?.[tplIdx]) && executorsByTemplate![tplIdx].length
            ? executorsByTemplate![tplIdx].map((e: any) => String(e?.id ?? e?.uuid ?? e?.login ?? e?.userId ?? e))
            : ['__noexec__']; // фоллбэк — сегмент не пустеет

    const mm = Math.max(0, Math.round(Number(minutes) || 0));

    execIds.forEach((eid) => {
        const sKey2 = stagesKeyV2(taskId, tKey, String(eid));
        let uni2 = loadDraftFromLocalStorage<UnifiedStagesSnapshot>(sKey2);
        if (!uni2) {
            uni2 = buildUnifiedStagesSnapshot({
                taskId,
                mainTemplate: tpl,
                executorsByTemplate,
                tplIdx,
            });
        }
        if (!uni2.stages) uni2.stages = {};
        if (!uni2.stages[stageKey]) uni2.stages[stageKey] = { fields: {} };
        (uni2.stages as any)[stageKey].time = `${mm}m`;
        uni2.updatedAt = new Date().toISOString();
        saveDraftToLocalStorage<UnifiedStagesSnapshot>(sKey2, uni2);
    });
}
