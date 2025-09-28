/**
 * src/shared/persist/pprDraft.ts
 *
 * Персистентность драфта PPR в localStorage + расширенная диагностика.
 *
 * Ключи:
 *  - PPR_DRAFT::<taskId>::params
 *  - PPR_DRAFT::<taskId>::stages
 *
 * Бизнес-логика НЕ меняется. Добавлены:
 *  - подробные логи на каждом этапе сборки снапшота;
 *  - вывод структуры стора таймлайна и наличия методов;
 *  - явные логи результата getMergedStageOverrides() и fallback stageFieldEdits;
 *  - дебаг-хелперы в window.__pprDraftDebug для ручного вызова в консоли.
 */

import { useEffect, useRef } from 'react';
import { templateStore } from '@/entities/template/model/store/templateStore';
import useTimelineStore from '@entities/timeline/model/store/timelineStore';

/** =================== мини-логгер =================== */
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
        // что мы увидели при сборке values
        stageValuesFrom: 'mergedOverrides' | 'stageFieldEdits' | 'none';
        stageValuesSample?: any;
    };
}

/** =================== Ключи LS =================== */

export const paramsKey = (taskId: string) => `PPR_DRAFT::${taskId}::params`;
export const stagesKey = (taskId: string) => `PPR_DRAFT::${taskId}::stages`;

/** =================== Безопасный JSON =================== */

export function safeStringify(value: unknown): string {
    try {
        return JSON.stringify(value);
    } catch (e) {
        log('safeStringify error', e);
        return 'null';
    }
}

export function safeParse<T = unknown>(text: string | null | undefined): T | undefined {
    if (typeof text !== 'string' || text.trim() === '') return undefined;
    try {
        return JSON.parse(text) as T;
    } catch (e) {
        log('safeParse error', e, 'text length=', text?.length ?? 0);
        return undefined;
    }
}

/** =================== LS helpers =================== */

export function saveDraftToLocalStorage<T>(key: string, data: T): void {
    try {
        if (typeof window === 'undefined') return;
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

/** =================== Снимки сто́ров =================== */

function snapshotParamsFromTemplateStore(): ParamsDraft {
    const state = templateStore.getState();
    const values = (state?.templateValues ?? {}) as ParamsDraft;
    log('SNAPSHOT paramsFromTemplateStore keys=', Object.keys(values));
    return values;
}

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
                    (typeof block?.tplIdx === 'number' ? block.tplIdx :
                        typeof block?.templateIdx === 'number' ? block.templateIdx :
                            typeof block?.templateIndex === 'number' ? block.templateIndex : undefined);

                const stageKey: string | undefined =
                    block?.stageKey ?? block?.stage ?? block?.stage_id ?? block?.stage_name;

                const minutesRaw =
                    block?.minutes ?? block?.duration ?? block?.timer ?? block?.timerMinutes;

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
 * Берём значения полей этапов из таймлайна.
 * 1) getMergedStageOverrides() — основной источник
 * 2) fallback: stageFieldEdits (нормализуем, убираем __time)
 */
function snapshotStageFieldValuesFromTimeline():
| { source: 'mergedOverrides' | 'stageFieldEdits' | 'none'; map?: Record<string, Record<string, any>> } {
    const tl = (useTimelineStore as any)?.getState?.();
    if (!tl) {
        log('SNAPSHOT stageValues: timeline state is empty');
        return { source: 'none' };
    }

    // 1) Пытаемся взять getMergedStageOverrides
    try {
        if (typeof tl.getMergedStageOverrides === 'function') {
            const merged = tl.getMergedStageOverrides();
            log('TIMELINE getMergedStageOverrides() ->', merged);

            // ✅ валидный источник только если непустой
            if (merged && typeof merged === 'object' && Object.keys(merged).length > 0) {
                return { source: 'mergedOverrides', map: merged as Record<string, Record<string, any>> };
            }
            log('getMergedStageOverrides is empty -> fallback to stageFieldEdits');
        } else {
            log('TIMELINE getMergedStageOverrides: NOT FOUND -> fallback to stageFieldEdits');
        }
    } catch (e) {
        log('TIMELINE getMergedStageOverrides threw', e, '-> fallback to stageFieldEdits');
    }

    // 2) Fallback: stageFieldEdits
    try {
        const raw = tl.stageFieldEdits;
        log('TIMELINE stageFieldEdits raw ->', raw);
        if (!raw || typeof raw !== 'object') return { source: 'none' };

        // Возможные форматы stageFieldEdits:
        // а) { [rowId]: { [stageKey]: { [fieldKey]: any, __time?: number } } }
        // б) { [rowId]: { [stageKey]: { value: { [fieldKey]: any, __time?: number } } } }
        const collapsed: Record<string, Record<string, any>> = {};

        Object.entries(raw as Record<string, any>).forEach(([rowId, byStage]) => {
            const stagesMap = (byStage && typeof byStage === 'object') ? byStage : {};
            Object.entries(stagesMap).forEach(([stageKey, rawFields]) => {
                const payload = rawFields && typeof rawFields === 'object' && 'value' in rawFields
                    ? (rawFields as any).value
                    : rawFields;

                if (!payload || typeof payload !== 'object') return;
                collapsed[stageKey] = collapsed[stageKey] || {};

                Object.entries(payload).forEach(([fieldKey, v]) => {
                    if (String(fieldKey).startsWith('__')) return; // отбрасываем служебное
                    collapsed[stageKey][fieldKey] = v ?? null;     // только значение
                });
            });
        });

        log('TIMELINE stageFieldEdits normalized(collapsed) ->', collapsed);

        if (Object.keys(collapsed).length > 0) {
            return { source: 'stageFieldEdits', map: collapsed };
        }
        return { source: 'none' };
    } catch (e) {
        log('TIMELINE stageFieldEdits normalize error', e);
        return { source: 'none' };
    }
}

/** =================== Построение единого среза =================== */

function buildUnifiedStagesSnapshot(args: {
    taskId: string;
    mainTemplate?: any;
    executorsByTemplate?: any[][];
    prev?: UnifiedStagesSnapshot | undefined;
}): UnifiedStagesSnapshot {
    const { taskId, mainTemplate, executorsByTemplate, prev } = args;

    const mainTemplateKey: string | undefined = (mainTemplate as any)?.key;
    const mainTemplateRaw: Record<string, any> | undefined = (mainTemplate as any)?.raw;

    const paramsMeta: Array<{ key: string; label: string; type: string }> =
        Array.isArray(mainTemplateRaw?.params)
            ? (mainTemplateRaw!.params as any[]).map((p) => ({
                key: String(p?.key ?? ''),
                label: String(p?.label ?? String(p?.key ?? '')),
                type: String(p?.type ?? ''),
            }))
            : [];

    // глубокая копия stages из RAW
    const stages: Record<string, any> = mainTemplateRaw?.stages
        ? JSON.parse(JSON.stringify(mainTemplateRaw.stages))
        : {};

    // Гарантируем наличие .fields[fieldKey].value
    for (const [, stage] of Object.entries(stages)) {
        if (!stage.fields || typeof stage.fields !== 'object') {
            stage.fields = {};
            continue;
        }
        for (const [fieldKey, rawField] of Object.entries(stage.fields)) {
            if (rawField && typeof rawField === 'object') {
                if (!('value' in (rawField as any))) {
                    (stage.fields as any)[fieldKey] = { ...(rawField as any), value: null };
                }
            } else {
                (stage.fields as any)[fieldKey] = { value: null };
            }
        }
    }

    // sections.unknown.inProgress
    const templateValues = snapshotParamsFromTemplateStore();
    const inProgress: Record<string, any> = {};
    if (mainTemplateKey && Array.isArray((templateValues as any)[mainTemplateKey])) {
        const first = (templateValues as any)[mainTemplateKey][0] ?? {};
        for (const k of Object.keys(first)) {
            if (!k.startsWith('__')) inProgress[k] = first[k];
        }
    }
    const sections = { unknown: { inProgress } };

    // Перекладываем прежние value/time из LS
    if (prev?.stages && typeof prev.stages === 'object') {
        for (const [stageKey, prevStage] of Object.entries(prev.stages)) {
            if (!stages[stageKey]) stages[stageKey] = { fields: {} };

            if (typeof (prevStage as any).time === 'string') {
                stages[stageKey].time = (prevStage as any).time;
            }

            const prevFields = (prevStage as any).fields;
            if (prevFields && typeof prevFields === 'object') {
                if (!stages[stageKey].fields) stages[stageKey].fields = {};
                for (const [fieldKey, pf] of Object.entries(prevFields)) {
                    const rawField = (stages[stageKey].fields[fieldKey] ?? {}) as Record<string, any>;
                    const prevValue = (pf && typeof pf === 'object' && 'value' in (pf as any))
                        ? (pf as any).value
                        : pf;
                    stages[stageKey].fields[fieldKey] = {
                        ...rawField,
                        value: prevValue ?? null,
                    };
                }
            }
        }
    }

    // Минуты из таймлайна
    const { minutesByStage, rowsCount, blocksCount } = snapshotMinutesFromTimeline();
    const byStage0 = minutesByStage[0] ?? {};
    for (const [stageKey, minutes] of Object.entries(byStage0)) {
        if (!stages[stageKey]) stages[stageKey] = { fields: {} };
        stages[stageKey].time = `${Math.max(0, Math.round(Number(minutes) || 0))}m`;
    }

    // Значения полей из таймлайна (mergedOverrides || edits)
    const stageValuesRes = snapshotStageFieldValuesFromTimeline();
    if (stageValuesRes.map) {
        for (const [stageKey, map] of Object.entries(stageValuesRes.map)) {
            if (!stages[stageKey]) stages[stageKey] = { fields: {} };
            if (!stages[stageKey].fields) stages[stageKey].fields = {};
            for (const [fieldKey, value] of Object.entries(map)) {
                const rawField = (stages[stageKey].fields[fieldKey] ?? {}) as Record<string, any>;
                // ⚠️ Кладём именно выбранное/введённое значение (строка/число/булево/объект) или null
                stages[stageKey].fields[fieldKey] = {
                    ...rawField,
                    value: value ?? null,
                };
            }
        }
    } else {
        log('NO stage field values from timeline (merged/edit) — value remains from prev or null');
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
    } catch (e) {
        log('subscribePlain error', tag, e);
        return () => {};
    }
}

/** =================== Публичный хук =================== */

export function usePprDraftPersistence(
    taskId: string | undefined,
    extras?: { mainTemplate?: any; executorsByTemplate?: any[][] },
) {
    const lastTaskRef = useRef<string | undefined>(undefined);

    useEffect(() => {
        if (!taskId) return;

        log('MOUNT taskId=', taskId);

        const isNewTask = lastTaskRef.current !== taskId;
        lastTaskRef.current = taskId;

        // Диагностика по сторам
        try {
            const tl = (useTimelineStore as any)?.getState?.();
            log('stageFormStore exists:', false); // в проекте опционально
            log('timelineStore keys:', tl ? Object.keys(tl) : []);
            log('has getMergedStageOverrides:', !!tl?.getMergedStageOverrides);
        } catch {}

        const pKey = paramsKey(taskId);
        const sKey = stagesKey(taskId);

        // Гидрация params
        if (isNewTask) {
            const p = loadDraftFromLocalStorage<ParamsDraft>(pKey);
            log('HYDRATE FROM LS');
            if (p && typeof p === 'object') {
                const store = templateStore.getState();
                for (const [key, entries] of Object.entries(p)) {
                    store.setTemplateValues?.(key, Array.isArray(entries) ? entries : []);
                }
            }
            saveDraftToLocalStorage<ParamsDraft>(pKey, snapshotParamsFromTemplateStore());

            // Начальный unified
            const prev = loadDraftFromLocalStorage<UnifiedStagesSnapshot>(sKey);
            const unified = buildUnifiedStagesSnapshot({
                taskId,
                mainTemplate: extras?.mainTemplate,
                executorsByTemplate: extras?.executorsByTemplate,
                prev,
            });
            saveDraftToLocalStorage<UnifiedStagesSnapshot>(sKey, unified);
        }

        const saveUnified = () => {
            const prev = loadDraftFromLocalStorage<UnifiedStagesSnapshot>(sKey);
            const unified = buildUnifiedStagesSnapshot({
                taskId,
                mainTemplate: extras?.mainTemplate,
                executorsByTemplate: extras?.executorsByTemplate,
                prev,
            });
            saveDraftToLocalStorage<UnifiedStagesSnapshot>(sKey, unified);
        };

        const unsubTemplate = subscribePlain(
            templateStore,
            () => {
                saveDraftToLocalStorage<ParamsDraft>(pKey, snapshotParamsFromTemplateStore());
                saveUnified();
            },
            'templateStore',
        );

        const unsubTimeline = subscribePlain(
            (useTimelineStore as any),
            () => {
                saveUnified();
            },
            'timelineStore',
        );

        // Опциональный stageFormStore — если появится
        let unsubStageForm: undefined | (() => void);
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const maybe = require('@/entities/stageFormStore/model/store/stageFormStore');
            if (maybe?.useStageFormStore?.subscribe) {
                unsubStageForm = subscribePlain(maybe.useStageFormStore, () => {
                    saveUnified();
                }, 'stageFormStore');
            }
        } catch {
            /* optional */
        }

        // ----- глобальные дебаг-хелперы -----
        try {
            (window as any).__pprDraftDebug = {
                getTemplateState: () => templateStore.getState?.(),
                getTimelineState: () => (useTimelineStore as any)?.getState?.(),
                getMergedStageOverrides:
                    () => (useTimelineStore as any)?.getState?.()?.getMergedStageOverrides?.(),
                snapshotStages: () =>
                    buildUnifiedStagesSnapshot({
                        taskId,
                        mainTemplate: extras?.mainTemplate,
                        executorsByTemplate: extras?.executorsByTemplate,
                        prev: loadDraftFromLocalStorage<UnifiedStagesSnapshot>(sKey),
                    }),
            };
            log('window.__pprDraftDebug ready:', Object.keys((window as any).__pprDraftDebug));
        } catch {}

        return () => {
            unsubTemplate?.();
            unsubTimeline?.();
            unsubStageForm?.();
        };
    }, [taskId, extras?.mainTemplate, extras?.executorsByTemplate]);
}

/** =================== Мгновенный патч таймера =================== */

export function patchStageTimeInLocalStorage(opts: {
    taskId: string;
    tplIdx: number;
    stageKey: string;
    minutes: number;
    mainTemplate?: any;
    executorsByTemplate?: any[][];
}): void {
    const { taskId, tplIdx, stageKey, minutes, mainTemplate, executorsByTemplate } = opts;
    const sKey = stagesKey(taskId);

    let unified = loadDraftFromLocalStorage<UnifiedStagesSnapshot>(sKey);
    if (!unified) {
        unified = buildUnifiedStagesSnapshot({ taskId, mainTemplate, executorsByTemplate });
    }

    const mm = Math.max(0, Math.round(Number(minutes) || 0));
    if (!unified.stages) unified.stages = {};
    if (!unified.stages[stageKey]) unified.stages[stageKey] = { fields: {} };
    unified.stages[stageKey].time = `${mm}m`;

    if (!unified.__debugInfo__)
        unified.__debugInfo__ = { minutesByStage: {}, rowsCount: 0, blocksCount: 0, stageValuesFrom: 'none' };
    if (!unified.__debugInfo__.minutesByStage) unified.__debugInfo__.minutesByStage = {};
    if (!unified.__debugInfo__.minutesByStage[tplIdx]) unified.__debugInfo__.minutesByStage[tplIdx] = {};
    unified.__debugInfo__.minutesByStage[tplIdx][stageKey] = mm;

    unified.updatedAt = new Date().toISOString();
    saveDraftToLocalStorage<UnifiedStagesSnapshot>(sKey, unified);
}


