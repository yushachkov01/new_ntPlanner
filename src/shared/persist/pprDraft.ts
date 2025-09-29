
/**
 * src/shared/persist/pprDraft.ts
 *
 * Персистентность драфта PPR (params + stages) c поддержкой:
 *  - V1 ключей на всю задачу;
 *  - V2 ключей на пару <templateKey, executorId>.
 * Добавлено: загрузка V2-параметров (для мгновенной гидрации таблицы).
 */

import { useEffect, useRef } from 'react';
import { templateStore } from '@/entities/template/model/store/templateStore';
import useTimelineStore from '@entities/timeline/model/store/timelineStore';

const TAG = '[PPR DRAFT]';
const log = (...args: any[]) => console.log(TAG, ...args);

/** =================== Типы =================== */

export type ParamsDraft = Record<string, Record<string, any>[]>;

export type MinutesByStageMap = Record<number, Record<string, number>>;

export interface UnifiedStagesSnapshot {
    executorsByTemplate: any[][];
    mainTemplateKey: string | undefined;
    mainTemplateRaw: Record<string, any> | undefined;
    params: Array<{ key: string; label: string; type: string }>;
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

/** =================== Ключи LS =================== */

export const paramsKey = (taskId: string) => `PPR_DRAFT::${taskId}::params`;
export const stagesKey = (taskId: string) => `PPR_DRAFT::${taskId}::stages`;

// Новые V2-ключи (мультишаблон/исполнитель)
const baseV2 = (taskId: string, templateKey: string, executorId: string) =>
    `PPR_DRAFT::${taskId}::${templateKey}::${executorId}`;
export const paramsKeyV2 = (taskId: string, templateKey: string, executorId: string) =>
    `${baseV2(taskId, templateKey, executorId)}::params`;
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
        if (!deepChanged(prev, data)) return; // анти-бесконечного сохранения
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

export const draftPrefix = (taskId: string) => `PPR_DRAFT::${taskId}::`;

/** Есть ли хоть что-то в LS для этой задачи? */
export function hasDraftForTask(taskId: string): boolean {
    try {
        if (typeof window === 'undefined') return false;
        const prefix = draftPrefix(taskId);
        for (let i = 0; i < window.localStorage.length; i++) {
            const k = window.localStorage.key(i) || '';
            if (k.startsWith(prefix)) return true;
        }
        // совместимость старых ключей
        return !!window.localStorage.getItem(paramsKey(taskId)) || !!window.localStorage.getItem(stagesKey(taskId));
    } catch {
        return false;
    }
}

/** Полностью удалить весь черновик для задачи (все V1 и V2 ключи) */
export function clearDraftForTask(taskId: string): void {
    try {
        if (typeof window === 'undefined') return;
        const prefix = draftPrefix(taskId);
        const toDelete: string[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
            const k = window.localStorage.key(i) || '';
            if (k.startsWith(prefix)) toDelete.push(k);
        }
        // совместимость:
        toDelete.push(paramsKey(taskId), stagesKey(taskId));
        toDelete.forEach((k) => window.localStorage.removeItem(k));
        log('LS CLEAR ALL for task', taskId, 'removed=', toDelete);
    } catch (e) {
        log('LS CLEAR error', taskId, e);
    }
}

/** ===== Совместимость: загрузка старых слепков ===== */
export function loadCompatSnapshot(taskId: string): UnifiedStagesSnapshot | undefined {
    return loadDraftFromLocalStorage<UnifiedStagesSnapshot>(stagesKey(taskId));
}
export function loadCompatParams(taskId: string): ParamsDraft | undefined {
    return loadDraftFromLocalStorage<ParamsDraft>(paramsKey(taskId));
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

            // key = PPR_DRAFT::<taskId>::<templateKey>::<executorId>::stages
            const middle = key.slice(prefix.length, key.length - suffix.length);
            const parts = middle.split('::');
            if (parts.length !== 2) continue;

            const [templateKey, executorId] = parts;
            const snap = loadDraftFromLocalStorage<UnifiedStagesSnapshot>(key);
            if (snap) out.push({ templateKey, executorId, snapshot: snap });
        }
    } catch (e) {
        log('loadV2Snapshots error', e);
    }
    return out;
}

/** ===== V2: загрузка params (для мгновенной гидрации таблицы) ===== */
// export function loadV2Params(
//     taskId: string
// ): Array<{ templateKey: string; executorId: string; rows: Record<string, any>[] }> {
//     const out: Array<{ templateKey: string; executorId: string; rows: Record<string, any>[] }> = [];
//     try {
//         if (typeof window === 'undefined') return out;
//         const prefix = draftPrefix(taskId);
//         const suffix = '::params';
//
//         for (let i = 0; i < window.localStorage.length; i++) {
//             const key = window.localStorage.key(i) || '';
//             if (!key.startsWith(prefix) || !key.endsWith(suffix)) continue;
//
//             // key = PPR_DRAFT::<taskId>::<templateKey>::<executorId>::params
//             const middle = key.slice(prefix.length, key.length - suffix.length);
//             const parts = middle.split('::');
//             if (parts.length !== 2) continue;
//
//             const [templateKey, executorId] = parts;
//             const rows = loadDraftFromLocalStorage<Record<string, any>[]>(key) ?? [];
//             out.push({ templateKey, executorId, rows: Array.isArray(rows) ? rows : [] });
//         }
//     } catch (e) {
//         log('loadV2Params error', e);
//     }
//     return out;
// }

export function loadV2Params(
    taskId: string
): Array<{ templateKey: string; executorId: string; rows: Record<string, any>[] }> {
    const out: Array<{ templateKey: string; executorId: string; rows: Record<string, any>[] }> = [];
    try {
        if (typeof window === 'undefined') return out;
        const prefix = draftPrefix(taskId);
        const suffix = '::params';

        for (let i = 0; i < window.localStorage.length; i++) {
            const key = window.localStorage.key(i) || '';
            if (!key.startsWith(prefix) || !key.endsWith(suffix)) continue;

            // key = PPR_DRAFT::<taskId>::<templateKey>::<executorId>::params
            const middle = key.slice(prefix.length, key.length - suffix.length);
            const parts = middle.split('::');
            if (parts.length !== 2) continue;

            const [templateKey, executorId] = parts;
            const rawRows = loadDraftFromLocalStorage<Record<string, any>[]>(key) ?? [];
            const rows = (Array.isArray(rawRows) ? rawRows : []).map((r) => ({ __sourceKey: templateKey, ...r }));
            out.push({ templateKey, executorId, rows });
        }
    } catch (e) {
        log('loadV2Params error', e);
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

/** Быстрый геттер ID исполнителя (без привязки к типам проекта) */
const pickExecId = (exec: any): string =>
    String(exec?.id ?? exec?.uuid ?? exec?.userId ?? exec?.user_id ?? exec?.login ?? 'unknown');

/**
 * Читаем минуты из таймлайна (по блокам).
 */
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

/**
 * Значения полей этапов из таймлайна для КОНКРЕТНОГО шаблона (tplIdx).
 */
function snapshotStageFieldValuesFromTimeline(
    tplIdx: number,
    templateRaw?: any
): { source: 'mergedOverrides' | 'stageFieldEdits' | 'none'; map?: Record<string, Record<string, any>> } {
    const tl = (useTimelineStore as any)?.getState?.();
    if (!tl) return { source: 'none' };

    const rows: any[] = Array.isArray(tl.rows) ? tl.rows : [];

    // строки нужного шаблона + индексы
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

    const stageKeysForTpl = new Set<string>(Object.keys(templateRaw?.stages ?? {}));

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

            const stagesMap = (byStage && typeof byStage === 'object') ? byStage : {};
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
        if (typeof tl.getMergedStageOverrides === 'function') {
            const merged = tl.getMergedStageOverrides();
            log('TIMELINE getMergedStageOverrides() ->', merged);
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
        const raw = tl.stageFieldEdits;
        log('TIMELINE stageFieldEdits raw ->', raw);
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

/** =================== Helpers =================== */

function ensureStageFields(args: {
    stages: Record<string, any>;
    stageKey: string;
    knownStages: Record<string, any> | undefined;
}): { ok: boolean } {
    const { stages, stageKey, knownStages } = args;
    // Не создаём новые стадии, которых нет в RAW
    if (!knownStages || !Object.prototype.hasOwnProperty.call(knownStages, stageKey)) {
        return { ok: false };
    }
    const s = stages[stageKey];
    if (!s || typeof s !== 'object') {
        stages[stageKey] = { fields: {} };
    } else if (!s.fields || typeof s.fields !== 'object') {
        s.fields = {};
    }
    return { ok: true };
}

/** =================== Построение единого среза =================== */

function buildUnifiedStagesSnapshot(args: {
    taskId: string;
    mainTemplate?: any; // шаблон, для которого строим срез (может быть не "main")
    executorsByTemplate?: any[][];
    prev?: UnifiedStagesSnapshot | undefined;
    tplIdx?: number; // индекс шаблона в executorsByTemplate (0 — основной)
}): UnifiedStagesSnapshot {
    const { taskId, mainTemplate, executorsByTemplate, prev, tplIdx = 0 } = args;

    const mainTemplateKey: string | undefined = (mainTemplate as any)?.key;
    const mainTemplateRaw: Record<string, any> | undefined = (mainTemplate as any)?.raw;

    const paramsMeta: Array<{ key: string; label: string; type: string }> = Array.isArray(mainTemplateRaw?.params)
        ? (mainTemplateRaw!.params as any[]).map((p) => ({
            key: String(p?.key ?? ''),
            label: String(p?.label ?? String(p?.key ?? '')),
            type: String(p?.type ?? ''),
        }))
        : [];

    // глубокая копия stages из RAW
    const stages: Record<string, any> = mainTemplateRaw?.stages ? JSON.parse(JSON.stringify(mainTemplateRaw.stages)) : {};

    // гарантируем наличие .fields.*.value для известных стадий
    for (const [stageKey, stage] of Object.entries(stages)) {
        if (!stage || typeof stage !== 'object') {
            (stages as any)[stageKey] = { fields: {} };
            continue;
        }
        if (!(stage as any).fields || typeof (stage as any).fields !== 'object') {
            (stages as any)[stageKey].fields = {};
        }

        // ⬇⬇⬇ ВАЖНО: обращаться через [stageKey], а не через .fields на корне
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

    // sections.unknown.inProgress — берём все записи текущего templateKey и сливаем
    const templateValues = snapshotParamsFromTemplateStore();
    const inProgress: Record<string, any> = {};
    let formValuesForTpl: Record<string, any> = {};

    if (mainTemplateKey && Array.isArray((templateValues as any)[mainTemplateKey])) {
        const arr = (templateValues as any)[mainTemplateKey] as Array<Record<string, any>>;
        const merged: Record<string, any> = {};
        for (const chunk of arr) {
            if (!chunk || typeof chunk !== 'object') continue;
            for (const [k, v] of Object.entries(chunk)) {
                if (String(k).startsWith('__')) continue;
                merged[k] = (v && typeof v === 'object' && 'value' in (v as any)) ? (v as any).value : v;
            }
        }
        Object.assign(inProgress, merged);
        formValuesForTpl = merged;
    } else {
        formValuesForTpl = {};
    }

    const sections = { unknown: { inProgress } };

    // Перекладываем прежние value/time из LS ТОЛЬКО если prev от того же templateKey
    if (prev?.stages && typeof prev.stages === 'object' && prev.mainTemplateKey === mainTemplateKey) {
        for (const [stageKey, prevStage] of Object.entries(prev.stages)) {
            const ok = ensureStageFields({ stages, stageKey, knownStages: mainTemplateRaw?.stages });
            if (!ok) continue;

            if (typeof (prevStage as any).time === 'string') {
                (stages as any)[stageKey].time = (prevStage as any).time;
            }

            const prevFields = (prevStage as any).fields;
            if (prevFields && typeof prevFields === 'object') {
                for (const [fieldKey, pf] of Object.entries(prevFields)) {
                    const rawField = (((stages as any)[stageKey].fields ?? {})[fieldKey] ?? {}) as Record<string, any>;
                    const prevValue = takeScalar(pf);
                    (stages as any)[stageKey].fields[fieldKey] = {
                        ...rawField,
                        value: prevValue ?? null,
                    };
                }
            }
        }
    }

    // Минуты из таймлайна (строго по текущему шаблону)
    const { minutesByStage, rowsCount, blocksCount } = snapshotMinutesFromTimeline();
    const byStageForTpl = minutesByStage[tplIdx] ?? {};
    for (const [stageKey, minutes] of Object.entries(byStageForTpl)) {
        const ok = ensureStageFields({ stages, stageKey, knownStages: mainTemplateRaw?.stages });
        if (!ok) continue;
        (stages as any)[stageKey].time = `${Math.max(0, Math.round(Number(minutes) || 0))}m`;
    }

    // Значения полей из таймлайна
    const stageValuesRes = snapshotStageFieldValuesFromTimeline(tplIdx, mainTemplateRaw);
    if (stageValuesRes.map) {
        for (const [stageKey, map] of Object.entries(stageValuesRes.map)) {
            const ok = ensureStageFields({ stages, stageKey, knownStages: mainTemplateRaw?.stages });
            if (!ok) continue;

            for (const [fieldKey, value] of Object.entries(map)) {
                const rawField = (((stages as any)[stageKey].fields ?? {})[fieldKey] ?? {}) as Record<string, any>;
                (stages as any)[stageKey].fields[fieldKey] = {
                    ...rawField,
                    value: takeScalar(value) ?? null,
                };
            }
        }
    } else {
        log('NO stage field values from timeline (merged/edit) — value remains from prev or null');
    }

    // Фоллбэк из формы (templateValues)
    if (formValuesForTpl && typeof formValuesForTpl === 'object') {
        const knownStages = mainTemplateRaw?.stages ?? {};
        for (const [stageKey, stageRaw] of Object.entries(knownStages)) {
            const ok = ensureStageFields({ stages, stageKey, knownStages });
            if (!ok) continue;

            const rawFields = (stageRaw as any)?.fields || {};
            for (const fieldKey of Object.keys(rawFields)) {
                const current = (stages as any)[stageKey].fields?.[fieldKey]?.value;
                if (current === undefined || current === null) {
                    const fallback = takeScalar((formValuesForTpl as any)[fieldKey]);
                    const rawField = (((stages as any)[stageKey].fields ?? {})[fieldKey] ?? {}) as Record<string, any>;
                    (stages as any)[stageKey].fields[fieldKey] = {
                        ...rawField,
                        value: fallback ?? null,
                    };
                }
            }
        }
    }

    const snapshot: UnifiedStagesSnapshot = {
        executorsByTemplate: (executorsByTemplate ?? []) as any[][],
        mainTemplateKey,
        mainTemplateRaw,
        params: paramsMeta,
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
        paramsCount: paramsMeta.length,
        stagesCount: Object.keys(stages).length,
        tplIdx,
        stageValuesFrom: snapshot.__debugInfo__?.stageValuesFrom,
        sample: snapshot.__debugInfo__?.stageValuesSample,
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

/** =================== Публичный хук =================== */

export function usePprDraftPersistence(
    taskId: string | undefined,
    extras?: {
        mainTemplate?: any;
        executorsByTemplate?: any[][];
        /** массив всех шаблонов по индексам: [mainTemplate, ...additionalTemplates] */
        templates?: Array<any | undefined>;
    }
) {
    const lastTaskRef = useRef<string | undefined>(undefined);

    useEffect(() => {
        if (!taskId) return;

        log('MOUNT taskId=', taskId);

        const isNewTask = lastTaskRef.current !== taskId;
        lastTaskRef.current = taskId;

        const pKey = paramsKey(taskId);
        const sKey = stagesKey(taskId);

        // ----- БАЗОВАЯ гидрация (совместимость) -----
        if (isNewTask) {
            const p = loadDraftFromLocalStorage<ParamsDraft>(pKey);
            if (p && typeof p === 'object') {
                const store = templateStore.getState();
                for (const [key, entries] of Object.entries(p)) {
                    store.setTemplateValues?.(key, Array.isArray(entries) ? entries : []);
                }
            }
            saveDraftToLocalStorage<ParamsDraft>(pKey, snapshotParamsFromTemplateStore());

            // Начальный unified (для основного шаблона)
            const prev = loadDraftFromLocalStorage<UnifiedStagesSnapshot>(sKey);
            const unified = buildUnifiedStagesSnapshot({
                taskId,
                mainTemplate: extras?.mainTemplate,
                executorsByTemplate: extras?.executorsByTemplate,
                prev,
                tplIdx: 0,
            });
            saveDraftToLocalStorage<UnifiedStagesSnapshot>(sKey, unified);
        }

        const saveUnifiedCompat = () => {
            const prev = loadDraftFromLocalStorage<UnifiedStagesSnapshot>(sKey);
            const unified = buildUnifiedStagesSnapshot({
                taskId,
                mainTemplate: extras?.mainTemplate,
                executorsByTemplate: extras?.executorsByTemplate,
                prev,
                tplIdx: 0,
            });
            saveDraftToLocalStorage<UnifiedStagesSnapshot>(sKey, unified);
        };

        /** ---------- V2: помечаем состояние отдельно по каждому шаблону и исполнителю ---------- */
        const savePerTemplateExecutor = () => {
            const allValues = snapshotParamsFromTemplateStore();
            const templates = extras?.templates ?? (extras?.mainTemplate ? [extras?.mainTemplate] : []);
            const xbt = extras?.executorsByTemplate ?? [];

            templates.forEach((tpl, idx) => {
                const tKey = String((tpl as any)?.key ?? '');
                const raw = (tpl as any)?.raw;
                if (!tKey || !raw) return;

                const execList = Array.isArray(xbt[idx]) ? xbt[idx] : [];
                const execIds = execList.length > 0 ? execList.map(pickExecId) : ['__noexec__'];

                // Параметры — только под конкретный templateKey
                const tplValues = Array.isArray((allValues as any)[tKey]) ? (allValues as any)[tKey] : [];

                execIds.forEach((eid) => {
                    // params V2
                    saveDraftToLocalStorage(paramsKeyV2(taskId, tKey, eid), tplValues);

                    // stages V2
                    const sKey2 = stagesKeyV2(taskId, tKey, eid);
                    const prev2 = loadDraftFromLocalStorage<UnifiedStagesSnapshot>(sKey2);
                    const unified2 = buildUnifiedStagesSnapshot({
                        taskId,
                        mainTemplate: tpl,
                        executorsByTemplate: extras?.executorsByTemplate,
                        prev: prev2,
                        tplIdx: idx,
                    });
                    saveDraftToLocalStorage<UnifiedStagesSnapshot>(sKey2, unified2);
                });
            });
        };

        // --- подписки ---
        const unsubTemplate = subscribePlain(
            templateStore,
            () => {
                // Совместимость: общий слепок params и единый unified
                saveDraftToLocalStorage<ParamsDraft>(pKey, snapshotParamsFromTemplateStore());
                saveUnifiedCompat();
                // Новые V2
                savePerTemplateExecutor();
            },
            'templateStore'
        );

        const unsubTimeline = subscribePlain(
            (useTimelineStore as any),
            () => {
                // Совместимость + V2
                saveUnifiedCompat();
                savePerTemplateExecutor();
            },
            'timelineStore'
        );

        // Опциональный stageFormStore — если появится
        let unsubStageForm: undefined | (() => void);
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const maybe = require('@/entities/stageFormStore/model/store/stageFormStore');
            if (maybe?.useStageFormStore?.subscribe) {
                unsubStageForm = subscribePlain(
                    maybe.useStageFormStore,
                    () => {
                        saveUnifiedCompat();
                        savePerTemplateExecutor();
                    },
                    'stageFormStore'
                );
            }
        } catch {
            /* optional */
        }

        // Первичный прогон V2 при маунте/смене шаблонов/исполнителей
        savePerTemplateExecutor();

        return () => {
            unsubTemplate?.();
            unsubTimeline?.();
            unsubStageForm?.();
        };
    }, [taskId, extras?.mainTemplate, extras?.executorsByTemplate, extras?.templates]);
}

/** =================== Мгновенный патч таймера =================== */

export function patchStageTimeInLocalStorage(opts: {
    taskId: string;
    tplIdx: number;
    stageKey: string;
    minutes: number;
    mainTemplate?: any;
    executorsByTemplate?: any[][];
    /** массив всех шаблонов по индексам: [mainTemplate, ...additionalTemplates] */
    templates?: Array<any | undefined>;
}): void {
    const { taskId, tplIdx, stageKey, minutes, mainTemplate, executorsByTemplate, templates } = opts;

    // Совместимость: прежний единый ключ на задачу
    const sKeyCompat = stagesKey(taskId);

    let unified = loadDraftFromLocalStorage<UnifiedStagesSnapshot>(sKeyCompat);
    if (!unified) {
        unified = buildUnifiedStagesSnapshot({ taskId, mainTemplate, executorsByTemplate, tplIdx: 0 });
    }

    if (!unified.stages) unified.stages = {};
    if (!unified.stages[stageKey]) unified.stages[stageKey] = { fields: {} };

    const mm = Math.max(0, Math.round(Number(minutes) || 0));
    unified.stages[stageKey].time = `${mm}m`;
    unified.updatedAt = new Date().toISOString();
    saveDraftToLocalStorage<UnifiedStagesSnapshot>(sKeyCompat, unified);

    // Новое V2: сохраняем ещё и под ключ шаблона/исполнителя
    const tpl = templates?.[tplIdx] ?? (tplIdx === 0 ? mainTemplate : undefined);
    const tKey = String((tpl as any)?.key ?? '');
    if (tKey) {
        const execList = Array.isArray(executorsByTemplate?.[tplIdx]) ? executorsByTemplate![tplIdx] : [];
        const execIds = execList.length > 0 ? execList.map((e: any) => String(e?.id ?? e?.uuid ?? e?.login ?? 'unknown')) : ['__noexec__'];

        execIds.forEach((eid) => {
            const sKey2 = stagesKeyV2(taskId, tKey, eid);
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
}

