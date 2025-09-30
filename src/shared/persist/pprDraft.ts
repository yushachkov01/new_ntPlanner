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

/** =================== Ключи LS =================== */

// Новые V2-ключи (мультишаблон/исполнитель)
const baseV2 = (taskId: string, templateKey: string, executorId: string) =>
    `PPR_DRAFT::${taskId}::${templateKey}::${executorId}`;
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

/** Есть ли хоть что-то в LS для этой задачи? (только V2 ::stages) */
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

/** Полностью удалить весь черновик для задачи (все V2 ключи) */
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

                if (
                    typeof tplIdx === 'number' &&
                    typeof stageKey === 'string' &&
                    typeof minutesRaw === 'number'
                ) {
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
        const rid =
            row?.id ?? row?.rowId ?? row?.row_id ?? row?.uuid ?? row?.key ?? row?._id ?? row?.hash;
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
        if (typeof tl.getMergedStageOverrides === 'function') {
            const merged = tl.getMergedStageOverrides();
            log('TIMELINE getMergedStageOverrides() ->', merged);
            if (merged && typeof merged === 'object' && Object.keys(merged).length > 0) {
                const keys = Object.keys(merged);
                const looksPerRow =
                    keys.some((k) => idSet.has(k)) ||
                    keys.some((k) => indexSet.has(k)) ||
                    keys.every((k) => /^\d+$/.test(k));

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

function normalizeRaw(raw: any): any {
    if (!raw) {
        return undefined;
    }
    if (typeof raw === 'object') {
        return raw;
    }
    if (typeof raw === 'string') {
        // Пробуем YAML
        try {
            const parsed = YAML.parse(raw);
            if (parsed && typeof parsed === 'object') {

                return parsed;
            }
        } catch (e) {
            console.warn('[PPR DRAFT][normalizeRaw] YAML.parse failed ->', e);
        }
        // Пробуем JSON
        try {
            const parsed = JSON.parse(raw);

            return parsed;
        } catch (e) {
        }
        return undefined;
    }
    return undefined;
}

// предохранители
const toArray = (v: any) => (v == null ? [] : Array.isArray(v) ? v : [v]);
const isTerminal = (v: any) => v === 'exit' || v == null;

/** Нормализуем ссылки между стадиями */
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
    if (!knownStages || !Object.prototype.hasOwnProperty.call(knownStages, stageKey)) {
        return false; // не создаём неизвестные стадии
    }
    const s = stages[stageKey];
    if (!s || typeof s !== 'object') {
        stages[stageKey] = { fields: {} };
    } else if (!s.fields || typeof s.fields !== 'object') {
        s.fields = {};
    }
    return true;
}

/**
 * Собирает ВСЕ строки формы, относящиеся к templateKey:
 * - из templateValues[templateKey]
 * - плюс из любых массивов (включая "undefined"), где row.__sourceKey начинается с "<templateKey>".
 */
function collectRowsForTemplate(
    templateValues: ParamsDraft,
    templateKey?: string
): Record<string, any>[] {
    if (!templateKey) return [];
    const rows: Record<string, any>[] = [];

    const pushAll = (arr?: any[]) => {
        if (!Array.isArray(arr)) return;
        for (const r of arr) if (r && typeof r === 'object') rows.push(r);
    };

    // 1) обычное место хранения
    pushAll((templateValues as any)[templateKey]);

    // 2) мусорные/временные ключи (в т.ч. "undefined") — ищем по __sourceKey
    for (const [k, arr] of Object.entries(templateValues || {})) {
        if (k === templateKey) continue;
        if (!Array.isArray(arr)) continue;
        for (const r of arr) {
            const src = String((r as any)?.__sourceKey ?? '').trim();
            if (!src) continue;
            const left = src.split('::')[0]; // "<tplKey>::<something>"
            if (left === templateKey) rows.push(r);
        }
    }

    // лёгкая дедупликация по JSON
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

/** =================== Построение единого среза =================== */

// function buildUnifiedStagesSnapshot(args: {
//     taskId: string;
//     mainTemplate?: any; // шаблон, для которого строим срез (может быть не "main")
//     executorsByTemplate?: any[][];
//     prev?: UnifiedStagesSnapshot | undefined;
//     tplIdx?: number; // индекс шаблона в executorsByTemplate (0 — основной)
// }): UnifiedStagesSnapshot {
//     const { taskId, mainTemplate, executorsByTemplate, prev, tplIdx = 0 } = args;
//
//     const mainTemplateKey: string | undefined = (mainTemplate as any)?.key;
//     const mainTemplateRaw: Record<string, any> | undefined = normalizeRaw((mainTemplate as any)?.raw);
//
//     // глубокая копия stages из RAW
//     const stages: Record<string, any> = mainTemplateRaw?.stages
//         ? JSON.parse(JSON.stringify(mainTemplateRaw.stages))
//         : {};
//
//     // нормализуем переходы
//     normalizeStageLinks(stages, mainTemplateRaw?.stages);
//
//     // гарантируем наличие .fields.*.value
//     for (const [stageKey, stage] of Object.entries(stages)) {
//         if (!stage || typeof stage !== 'object') {
//             (stages as any)[stageKey] = { fields: {} };
//             continue;
//         }
//         if (!(stage as any).fields || typeof (stage as any).fields !== 'object') {
//             (stages as any)[stageKey].fields = {};
//         }
//         for (const [fieldKey, rawField] of Object.entries(((stages as any)[stageKey].fields) ?? {})) {
//             if (rawField && typeof rawField === 'object') {
//                 if (!('value' in (rawField as any))) {
//                     (stages as any)[stageKey].fields[fieldKey] = { ...(rawField as any), value: null };
//                 }
//             } else {
//                 (stages as any)[stageKey].fields[fieldKey] = { value: null };
//             }
//         }
//     }
//
//     // sections.unknown.inProgress — собираем значения формы для текущего templateKey из zustand
//     const templateValues = snapshotParamsFromTemplateStore();
//     const rowsForTpl = collectRowsForTemplate(templateValues, mainTemplateKey);
//
//     const inProgress: Record<string, any> = {};
//     for (const chunk of rowsForTpl) {
//         if (!chunk || typeof chunk !== 'object') continue;
//         for (const [k, v] of Object.entries(chunk)) {
//             if (String(k).startsWith('__')) continue;
//             inProgress[k] = takeScalar(v);
//         }
//     }
//     const sections = { unknown: { inProgress } };
//
//     // Перекладываем прежние value/time из prev ТОЛЬКО если это тот же templateKey
//     if (prev?.stages && typeof prev.stages === 'object' && prev.mainTemplateKey === mainTemplateKey) {
//         for (const [stageKey, prevStage] of Object.entries(prev.stages)) {
//             if (!ensureStageFields({ stages, stageKey, knownStages: mainTemplateRaw?.stages })) continue;
//
//             if (typeof (prevStage as any).time === 'string') {
//                 (stages as any)[stageKey].time = (prevStage as any).time;
//             }
//
//             const prevFields = (prevStage as any).fields;
//             if (prevFields && typeof prevFields === 'object') {
//                 for (const [fieldKey, pf] of Object.entries(prevFields)) {
//                     const rawField = (((stages as any)[stageKey].fields ?? {})[fieldKey] ?? {}) as Record<
//                         string,
//                         any
//                     >;
//                     const prevValue = takeScalar(pf);
//                     (stages as any)[stageKey].fields[fieldKey] = {
//                         ...rawField,
//                         value: prevValue ?? null,
//                     };
//                 }
//             }
//         }
//     }
//
//     // Минуты из таймлайна (строго по текущему шаблону)
//     const { minutesByStage, rowsCount, blocksCount } = snapshotMinutesFromTimeline();
//     const byStageForTpl = minutesByStage[tplIdx] ?? {};
//     for (const [stageKey, minutes] of Object.entries(byStageForTpl)) {
//         if (!ensureStageFields({ stages, stageKey, knownStages: mainTemplateRaw?.stages })) continue;
//         (stages as any)[stageKey].time = `${Math.max(0, Math.round(Number(minutes) || 0))}m`;
//     }
//
//     // Значения полей из таймлайна
//     const stageValuesRes = snapshotStageFieldValuesFromTimeline(tplIdx, mainTemplateRaw);
//     if (stageValuesRes.map) {
//         for (const [stageKey, map] of Object.entries(stageValuesRes.map)) {
//             if (!ensureStageFields({ stages, stageKey, knownStages: mainTemplateRaw?.stages })) continue;
//             for (const [fieldKey, value] of Object.entries(map)) {
//                 const rawField = (((stages as any)[stageKey].fields ?? {})[fieldKey] ?? {}) as Record<
//                     string,
//                     any
//                 >;
//                 (stages as any)[stageKey].fields[fieldKey] = {
//                     ...rawField,
//                     value: takeScalar(value) ?? null,
//                 };
//             }
//         }
//     } else {
//         log('NO stage field values from timeline (merged/edit) — value remains from prev or null');
//     }
//
//     // Фоллбэк из формы (zustand) — дозаполняем пустые поля стадий
//     if (inProgress && typeof inProgress === 'object') {
//         const knownStages = mainTemplateRaw?.stages ?? {};
//         for (const [stageKey, stageRaw] of Object.entries(knownStages)) {
//             if (!ensureStageFields({ stages, stageKey, knownStages: mainTemplateRaw?.stages })) continue;
//
//             const rawFields = (stageRaw as any)?.fields || {};
//             for (const fieldKey of Object.keys(rawFields)) {
//                 const current = (stages as any)[stageKey].fields?.[fieldKey]?.value;
//                 if (current === undefined || current === null) {
//                     const fallback = takeScalar((inProgress as any)[fieldKey]);
//                     const rawField = (((stages as any)[stageKey].fields ?? {})[fieldKey] ?? {}) as Record<
//                         string,
//                         any
//                     >;
//                     (stages as any)[stageKey].fields[fieldKey] = {
//                         ...rawField,
//                         value: fallback ?? null,
//                     };
//                 }
//             }
//         }
//     }
//
//     // Формируем params с value (из формы, а если пусто — из полей стадий)
//     const paramDefs: Array<{ key: string; label: string; type: string }> = Array.isArray(
//         mainTemplateRaw?.params
//     )
//         ? (mainTemplateRaw!.params as any[]).map((p) => ({
//             key: String(p?.key ?? ''),
//             label: String(p?.label ?? String(p?.key ?? '')),
//             type: String(p?.type ?? ''),
//         }))
//         : [];
//
//     const pickFromStages = (paramKey: string) => {
//         for (const stage of Object.values(stages ?? {})) {
//             const fields = (stage as any)?.fields;
//             if (!fields || typeof fields !== 'object') continue;
//             if (Object.prototype.hasOwnProperty.call(fields, paramKey)) {
//                 const rf = fields[paramKey];
//                 const v = rf && typeof rf === 'object' && 'value' in (rf as any) ? (rf as any).value : rf;
//                 if (v !== undefined && v !== null) return v;
//             }
//         }
//         return undefined;
//     };
//
//     // const params = paramDefs.map((pd) => {
//     //     const vFromForm = (sections.unknown.inProgress as any)?.[pd.key];
//     //     const v = vFromForm !== undefined ? vFromForm : pickFromStages(pd.key);
//     //     return { ...pd, value: v ?? null };
//     // });
//
//     // --- стало (учитываем алиасы) ---
//     const params = paramDefs.map((pd) => {
//         const aliases = Array.from(
//             new Set(
//                 [
//                     pd.key,
//                     pd.label,             // часто сюда попадает "profileScan18"
//                     (pd as any).name,     // на всякий случай
//                     (pd as any).widget,   // если где-то ошибочно сохранили под widget
//                     pd.type,              // у тебя встречается "profileScan19" в type
//                 ]
//                     .map((v) => String(v ?? '').trim())
//                     .filter(Boolean)
//             )
//         );
//
//         // пробуем найти в форме по любому алиасу
//         let vFromForm: any = undefined;
//         for (const a of aliases) {
//             if ((sections.unknown.inProgress as any)?.hasOwnProperty(a)) {
//                 vFromForm = (sections.unknown.inProgress as any)[a];
//                 break;
//             }
//         }
//
//         // если в форме не нашли — пробуем достать из полей стадий по любому алиасу
//         let v: any = vFromForm;
//         if (v === undefined) {
//             for (const a of aliases) {
//                 const vv = pickFromStages(a);
//                 if (vv !== undefined && vv !== null) {
//                     v = vv;
//                     break;
//                 }
//             }
//         }
//
//         return { ...pd, value: v ?? null };
//     });
//
//     const snapshot: UnifiedStagesSnapshot = {
//         executorsByTemplate: (executorsByTemplate ?? []) as any[][],
//         mainTemplateKey,
//         mainTemplateRaw, // нормализованный объект
//         params,
//         stages,
//         sections,
//         taskId,
//         updatedAt: new Date().toISOString(),
//         v: 1,
//         __debugInfo__: {
//             minutesByStage,
//             rowsCount,
//             blocksCount,
//             stageValuesFrom: stageValuesRes.source,
//             stageValuesSample: stageValuesRes.map ? Object.entries(stageValuesRes.map)[0] : undefined,
//         },
//     };
//
//     log('UNIFIED SNAPSHOT built', {
//         taskId,
//         mainTemplateKey,
//         paramsCount: params.length,
//         stagesCount: Object.keys(stages).length,
//         tplIdx,
//         stageValuesFrom: snapshot.__debugInfo__?.stageValuesFrom,
//         sample: snapshot.__debugInfo__?.stageValuesSample,
//     });
//
//     return snapshot;
// }


function buildUnifiedStagesSnapshot(args: {
    taskId: string;
    mainTemplate?: any; // шаблон, для которого строим срез (может быть не "main")
    executorsByTemplate?: any[][];
    prev?: UnifiedStagesSnapshot | undefined;
    tplIdx?: number; // индекс шаблона в executorsByTemplate (0 — основной)
}): UnifiedStagesSnapshot {
    const { taskId, mainTemplate, executorsByTemplate, prev, tplIdx = 0 } = args;

    const mainTemplateKey: string | undefined = (mainTemplate as any)?.key;

    // Нормализуем RAW и работаем с глубокой копией, чтобы не мутировать оригинал
    const normalizedRaw: Record<string, any> | undefined = normalizeRaw((mainTemplate as any)?.raw);
    const rawClone: Record<string, any> | undefined = normalizedRaw
        ? JSON.parse(JSON.stringify(normalizedRaw))
        : undefined;

    // stages берём из КОПИИ rawClone (а не из оригинала)
    const stages: Record<string, any> = rawClone?.stages
        ? JSON.parse(JSON.stringify(rawClone.stages))
        : {};

    // нормализуем переходы
    normalizeStageLinks(stages, rawClone?.stages);

    // гарантируем наличие .fields.*.value
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

    // sections.unknown.inProgress — агрегат значений формы для текущего templateKey из zustand
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

    // Перекладываем прежние value/time из prev ТОЛЬКО если это тот же templateKey
    if (prev?.stages && typeof prev.stages === 'object' && prev.mainTemplateKey === mainTemplateKey) {
        for (const [stageKey, prevStage] of Object.entries(prev.stages)) {
            if (!ensureStageFields({ stages, stageKey, knownStages: rawClone?.stages })) continue;

            if (typeof (prevStage as any).time === 'string') {
                (stages as any)[stageKey].time = (prevStage as any).time;
            }

            const prevFields = (prevStage as any).fields;
            if (prevFields && typeof prevFields === 'object') {
                for (const [fieldKey, pf] of Object.entries(prevFields)) {
                    const rawField = (((stages as any)[stageKey].fields ?? {})[fieldKey] ?? {}) as Record<
                        string,
                        any
                    >;
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
        if (!ensureStageFields({ stages, stageKey, knownStages: rawClone?.stages })) continue;
        (stages as any)[stageKey].time = `${Math.max(0, Math.round(Number(minutes) || 0))}m`;
    }

    // Значения полей из таймлайна
    const stageValuesRes = snapshotStageFieldValuesFromTimeline(tplIdx, rawClone);
    if (stageValuesRes.map) {
        for (const [stageKey, map] of Object.entries(stageValuesRes.map)) {
            if (!ensureStageFields({ stages, stageKey, knownStages: rawClone?.stages })) continue;
            for (const [fieldKey, value] of Object.entries(map)) {
                const rawField = (((stages as any)[stageKey].fields ?? {})[fieldKey] ?? {}) as Record<
                    string,
                    any
                >;
                (stages as any)[stageKey].fields[fieldKey] = {
                    ...rawField,
                    value: takeScalar(value) ?? null,
                };
            }
        }
    } else {
        log('NO stage field values from timeline (merged/edit) — value remains from prev or null');
    }

    // Фоллбэк из формы (zustand) — дозаполняем пустые поля стадий
    if (inProgress && typeof inProgress === 'object') {
        const knownStages = rawClone?.stages ?? {};
        for (const [stageKey, stageRaw] of Object.entries(knownStages)) {
            if (!ensureStageFields({ stages, stageKey, knownStages: rawClone?.stages })) continue;

            const rawFields = (stageRaw as any)?.fields || {};
            for (const fieldKey of Object.keys(rawFields)) {
                const current = (stages as any)[stageKey].fields?.[fieldKey]?.value;
                if (current === undefined || current === null) {
                    const fallback = takeScalar((inProgress as any)[fieldKey]);
                    const rawField = (((stages as any)[stageKey].fields ?? {})[fieldKey] ?? {}) as Record<
                        string,
                        any
                    >;
                    (stages as any)[stageKey].fields[fieldKey] = {
                        ...rawField,
                        value: fallback ?? null,
                    };
                }
            }
        }
    }

    // Описание параметров (из rawClone.params) и вычисление их значений
    const paramDefs: Array<{ key: string; label: string; type: string }> = Array.isArray(
        rawClone?.params
    )
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

    // алиасы как в прежней версии (чтобы поймать profileScan18/profileScan19 и пр.)
    const paramsWithValue = paramDefs.map((pd) => {
        const aliases = Array.from(
            new Set(
                [
                    pd.key,
                    pd.label,
                    (pd as any).name,
                    (pd as any).widget,
                    pd.type,
                ]
                    .map((v) => String(v ?? '').trim())
                    .filter(Boolean)
            )
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

    // *** ВАЖНО: записываем value прямо в КОПИЮ rawClone.params ***
    if (Array.isArray(rawClone?.params)) {
        const byKey = new Map(paramsWithValue.map((p) => [p.key, p.value]));
        rawClone!.params = (rawClone!.params as any[]).map((p) => {
            const k = String(p?.key ?? '');
            const v = byKey.has(k) ? byKey.get(k) : undefined;

            // Сохраним и старые ad-hoc значения, если вдруг они уже были (не должно, но на всякий случай)
            const existing = (p as any)?.value;

            return v !== undefined
                ? { ...p, value: v }
                : existing !== undefined
                    ? { ...p, value: existing }
                    : { ...p, value: null };
        });
    }

    const snapshot: UnifiedStagesSnapshot = {
        executorsByTemplate: (executorsByTemplate ?? []) as any[][],
        mainTemplateKey,
        mainTemplateRaw: rawClone,            // <= копия RAW с value в params
        params: paramsWithValue,              // дублируем в удобный плоский вид
        stages,                               // с value в полях стадий
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

    log('UNIFIED SNAPSHOT built (+params.value injected into rawClone)', {
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

        log('MOUNT taskId=', taskId, 'extras.mainTemplate?.key=', extras?.mainTemplate?.key);

        const isNewTask = lastTaskRef.current !== taskId;
        lastTaskRef.current = taskId;

        /** ---------- V2: помечаем состояние отдельно по каждому шаблону и исполнителю ---------- */
        const savePerTemplateExecutor = () => {
            const allValues = snapshotParamsFromTemplateStore();
            const templates = extras?.templates ?? (extras?.mainTemplate ? [extras?.mainTemplate] : []);
            const xbt = extras?.executorsByTemplate ?? [];

            templates.forEach((tpl, idx) => {
                const tKey = String((tpl as any)?.key ?? '');
                const raw = normalizeRaw((tpl as any)?.raw);
                if (!tKey || !raw) {
                    if (tKey) log('SKIP V2 for template without RAW (or raw not parseable)', tKey);
                    return;
                }

                const execList = Array.isArray(xbt[idx]) ? xbt[idx] : [];
                const execIds =
                    execList.length > 0
                        ? execList.map((e: any) => String(e?.id ?? e?.uuid ?? e?.login ?? 'unknown'))
                        : ['__noexec__'];

                // Собираем unified-snapshot по каждому исполнителю и сохраняем ТОЛЬКО ::stages
                execIds.forEach((eid) => {
                    const sKey2 = stagesKeyV2(taskId, tKey, eid);
                    const prev2 = loadDraftFromLocalStorage<UnifiedStagesSnapshot>(sKey2);
                    const unified2 = buildUnifiedStagesSnapshot({
                        taskId,
                        mainTemplate: { ...(tpl as any), raw }, // важно: передаём нормализованный raw
                        executorsByTemplate: extras?.executorsByTemplate,
                        prev: prev2,
                        tplIdx: idx,
                    });
                    if (Object.keys(unified2.stages ?? {}).length === 0 && unified2.params.length === 0) {
                        log('SKIP V2 save: snapshot is empty for', tKey, 'eid=', eid);
                    } else {
                        saveDraftToLocalStorage<UnifiedStagesSnapshot>(sKey2, unified2);
                    }
                });
            });
        };

        // --- подписки ---
        const unsubTemplate = subscribePlain(
            templateStore,
            () => {
                savePerTemplateExecutor();
            },
            'templateStore'
        );

        const unsubTimeline = subscribePlain(
            (useTimelineStore as any),
            () => {
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

/** ======== Unified Snapshot → rows (для таблицы) и stage patches (для таймлайна) ======== */

export function rowsFromUnifiedSnapshot(snap: UnifiedStagesSnapshot): Array<Record<string, any>> {


    if (!snap) {
        console.groupEnd();
        return [];
    }

    // (A) быстрый путь: берем готовые value из snap.params, если они есть
    if (Array.isArray(snap.params) && snap.params.length > 0) {
        const row: Record<string, any> = {};
        for (const p of snap.params) {
            const k = String(p?.key ?? '').trim();
            if (!k) continue;
            if ('value' in (p as any)) row[k] = (p as any).value ?? null;
        }
        if (Object.keys(row).length > 0) {
            if (snap.mainTemplateKey) row.__sourceKey = snap.mainTemplateKey;
            console.groupEnd();
            return [row];
        }
    }

    // (B) общий путь: парсим raw и собираем по схеме
    const raw = normalizeRaw(snap.mainTemplateRaw) ?? snap.mainTemplateRaw;


    const paramKeys: string[] = Array.isArray(raw?.params)
        ? raw.params.map((p: any) => String(p?.key ?? '').trim()).filter(Boolean)
        : [];


    if (paramKeys.length === 0) {
        console.groupEnd();
        return [];
    }

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

    console.log(' -> branch (B) built row=', row);
    console.groupEnd();
    return [row];
}

/**
 * Достаёт тайминги стадий из unified-snapshot.
 * Возвращает map: stageKey -> minutes (number)
 */
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

/**
 * Достаёт значения полей стадий (для таймлайна): stageKey -> { fieldKey: value }
 */
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
    /** массив всех шаблонов по индексам: [mainTemplate, ...additionalTemplates] */
    templates?: Array<any | undefined>;
}): void {
    const { taskId, tplIdx, stageKey, minutes, mainTemplate, executorsByTemplate, templates } = opts;

    // Сохраняем ТОЛЬКО V2-ключи ::stages
    const tpl = templates?.[tplIdx] ?? (tplIdx === 0 ? mainTemplate : undefined);
    const tKey = String((tpl as any)?.key ?? '');
    if (!tKey) return;

    const execList = Array.isArray(executorsByTemplate?.[tplIdx]) ? executorsByTemplate![tplIdx] : [];
    const execIds =
        execList.length > 0
            ? execList.map((e: any) => String(e?.id ?? e?.uuid ?? e?.login ?? 'unknown'))
            : ['__noexec__'];

    const mm = Math.max(0, Math.round(Number(minutes) || 0));

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
