/**
 * Персистентность драфта ППР строго через ключи:
 *   PPR_DRAFT::<taskId>::<templateKey>::<executorId>::stages
 * В localStorage храним только снапшоты стадий.
 */

import { useEffect, useRef } from 'react';
import YAML from 'yaml';

import { templateStore } from '@/entities/template/model/store/templateStore';
import useTimelineStore from '@entities/timeline/model/store/timelineStore';
import {LOG_TAG} from "@/shared/constants";


const log = (...args: any[]) => console.log(LOG_TAG, ...args);

export type ParamsDraft = Record<string, Record<string, any>[]>;

export type MinutesByStageMap = Record<number, Record<string, number>>;

/**
 * UnifiedStagesSnapshot — «единый снимок» состояния пп для конкретного шаблона и исполнителя.
 * Используется как полезная нагрузка в ключе:
 *   PPR_DRAFT::<taskId>::<templateKey>::<executorId>::stages
 */
export interface UnifiedStagesSnapshot {
    /**
     * Матрица исполнителей по шаблонам.
     * executorsByTemplate[i] — список исполнителей для шаблона с индексом i.
     * Нужна, чтобы при восстановлении понимать «кто где» без внешних сто́ров.
     */
    executorsByTemplate: any[][];

    /**
     * Ключ основного шаблона, к которому относится снапшот.
     * Используется как __sourceKey для табличных строк и для валидации стадий.
     */
    mainTemplateKey: string | undefined;

    /**
     * Нормализованный YAML/JSON текущего шаблона.
     * Достаточен для построения порядка стадий и их полей (stages/stages_field, params и т.д.).
     */
    mainTemplateRaw: Record<string, any> | undefined;

    /**
     * Плоский список параметров шаблона (из schema.params),
     * уже обогащённый фактическими value (если они известны).
     * Это приоритетный источник для восстановления табличной формы.
     */
    params: Array<{ key: string; label: string; type: string; value?: any }>;

    /**
     * Карта стадий: ключ — stageKey.
     * Каждая стадия может содержать:
     *   - time: строка вида "Xm" (например, "30m") — длительность этапа;
     *   - fields: { [fieldKey]: { value: any, ...описание поля из raw } }.
     * Эти данные нужны для реставрации таймлайна/блоков.
     */
    stages: Record<string, any>;

    /**
     * Дополнительные секции снапшота.
     * unknown.inProgress — «плоский» срез табличных значений (параметров),
     * который помогает подставлять значения в поля стадий/формы, если они ещё не записаны в stages/params.
     */
    sections: { unknown: { inProgress: Record<string, any> } };

    /**
     * ID задачи, к которой относится данный снапшот.
     * Дублируем для самодостаточности и удобства отладки.
     */
    taskId: string;

    /**
     * ISO-метка времени последнего обновления снапшота.
     * Используется для «свежести»
     */
    updatedAt: string;

    /**
     * Версия формата unified-снапшота.
     * Сейчас — 1. На будущее: позволяет мигрировать структуру при изменениях.
     */
    v: number;

    /**
     * Отладочная информация — не участвует в восстановлении UI, нужна для анализа.
     */
    __debugInfo__?: {
        /**
         * Карта минут по стадиям, сгруппированная по индексу шаблона:
         * minutesByStage[tplIdx][stageKey] = minutes
         */
        minutesByStage: MinutesByStageMap;

        /** Сколько рядов и блоков увидели в таймлайне в момент сборки снапшота. */
        rowsCount: number;
        blocksCount: number;

        /**
         * Откуда брали значения полей стадий:
         *  - 'mergedOverrides' — объединённые правки из стора таймлайна;
         *  - 'stageFieldEdits' — сырые правки полей;
         *  - 'none' — не нашли, брали из sections.unknown.inProgress или оставили null.
         */
        stageValuesFrom: 'mergedOverrides' | 'stageFieldEdits' | 'none';

        /** Произвольный пример пары [stageKey, fieldsMap] для быстрой диагностики. */
        stageValuesSample?: any;
    };
}


/**
 * Кодирует часть ключа, чтобы её можно было
 * безопасно вставить между разделителями "::".
 * Пробелы → "+", остальное — как в encodeURIComponent.
 */
const encodeKeyPart = (input: unknown) =>
    encodeURIComponent(String(input ?? '')).replace(/%20/g, '+');

/**
 * Декодирует часть ключа, преобразуя "+" обратно в пробел
 * (через "%20"), затем обычный decodeURIComponent.
 */
const decodeKeyPart = (input: unknown) =>
    decodeURIComponent(String(input ?? '').replace(/\+/g, '%20'));

/**Формирование ключей LS */

/**
 * Базовый префикс V2: PPR_DRAFT::<taskId>::<templateKey>::<executorId>
 */
const baseKeyV2 = (taskId: string, templateKey: string, executorId: string) =>
    `PPR_DRAFT::${encodeKeyPart(taskId)}::${encodeKeyPart(templateKey)}::${encodeKeyPart(executorId)}`;

/**
 * Полный ключ для stages V2.
 */
export const stagesKeyV2 = (taskId: string, templateKey: string, executorId: string) =>
    `${baseKeyV2(taskId, templateKey, executorId)}::stages`;

/** Безопасный JSON и сравнение  */

/**
 * Возвращает внутреннее значение из объектов вида { value }.
 * Если передан скаляр — возвращает его, если объект без value — вернёт сам объект.
 */
const unwrapScalar = (v: any) => (v && typeof v === 'object' && 'value' in v ? (v as any).value : v);

/**
 * Глубокое сравнение через JSON (fail-safe).
 * @returns true, если объекты отличаются (или не сериализуются).
 */
const hasDeepChange = (a: unknown, b: unknown) => {
    try {
        return JSON.stringify(a) !== JSON.stringify(b);
    } catch {
        return true;
    }
};

/**
 * Безопасная сериализация объекта в JSON
 */
export function safeStringify(value: unknown): string {
    try {
        return JSON.stringify(value);
    } catch {
        return 'null';
    }
}

/**
 * Безопасный парсинг JSON-строки.
 * @returns Объект T или undefined, если парсинг не удался/пусто.
 */
export function safeParse<T = unknown>(text: string | null | undefined): T | undefined {
    if (typeof text !== 'string' || text.trim() === '') return undefined;
    try {
        return JSON.parse(text) as T;
    } catch {
        return undefined;
    }
}

/**
 * Сохраняет значение по ключу в localStorage, если оно реально изменилось.
 * @param key Ключ LS
 * @param data Любой сериализуемый объект
 */
export function saveDraftToLocalStorage<T>(key: string, data: T): void {
    try {
        if (typeof window === 'undefined') return;
        const prev = loadDraftFromLocalStorage<T>(key);
        if (!hasDeepChange(prev, data)) return;
        window.localStorage.setItem(key, safeStringify(data));
        log('LS SAVE', key, data);
    } catch (e) {
        log('LS SAVE error', key, e);
    }
}

/**
 * Загружает значение по ключу из localStorage.
 * @param key Ключ LS
 */
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


/**
 * Префикс всех ключей
 */
export const draftPrefix = (taskId: string) => `PPR_DRAFT::${encodeKeyPart(taskId)}::`;

/**
 * Есть ли в браузере черновики для указанной задачи.
 * @param taskId ID задачи
 */
export function hasDraftForTask(taskId: string): boolean {
    try {
        if (typeof window === 'undefined') return false;
        const prefix = draftPrefix(taskId);
        const suffix = '::stages';
        for (let i = 0; i < window.localStorage.length; i++) {
            const key = window.localStorage.key(i) || '';
            if (key.startsWith(prefix) && key.endsWith(suffix)) {
                log('hasDraftForTask: found key', key);
                return true;
            }
        }
        return false;
    } catch (e) {
        log('hasDraftForTask error', e);
        return false;
    }
}

/**
 * Полностью очищает все черновики по задаче.
 * @param taskId ID задачи
 */
export function clearDraftForTask(taskId: string): void {
    try {
        if (typeof window === 'undefined') return;
        const prefix = draftPrefix(taskId);
        const toDelete: string[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
            const key = window.localStorage.key(i) || '';
            if (key.startsWith(prefix)) toDelete.push(key);
        }
        toDelete.forEach((k) => window.localStorage.removeItem(k));
        log('LS CLEAR ALL for task', taskId, 'removed=', toDelete);
    } catch (e) {
        log('LS CLEAR error', taskId, e);
    }
}

/**
 * Сканирует localStorage и собирает все снапшоты для taskId.
 * @param taskId ID задачи
 */
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
            const templateKey = decodeKeyPart(templateKeyEnc);
            const executorId = decodeKeyPart(executorIdEnc);

            const snapshot = loadDraftFromLocalStorage<UnifiedStagesSnapshot>(key);
            if (snapshot) out.push({ templateKey, executorId, snapshot });
        }
    } catch (e) {
        log('loadV2Snapshots error', e);
    }
    return out;
}

/**
 * Забирает текущие значения таблиц параметров из templateStore.
 */
function snapshotParamsFromTemplateStore(): ParamsDraft {
    const state = templateStore.getState();
    const values = (state?.templateValues ?? {}) as ParamsDraft;
    log('SNAPSHOT paramsFromTemplateStore keys=', Object.keys(values));
    return values;
}

/**
 * Превращает raw (YAML/JSON/объект/строка) в объект схемы.
 * @param raw Любая форма raw
 */
function normalizeRaw(raw: any): any {
    if (!raw) return undefined;
    if (typeof raw === 'object') return raw;

    if (typeof raw === 'string') {
        try {
            const y = YAML.parse(raw);
            if (y && typeof y === 'object') return y;
        } catch {}
        try {
            return JSON.parse(raw);
        } catch {}
        return undefined;
    }
    return undefined;
}

const toArray = (v: any) => (v == null ? [] : Array.isArray(v) ? v : [v]);
const isTerminal = (v: any) => v === 'exit' || v == null;

/**
 * Чистит некорректные ссылки переходов между стадиями (if_success/if_failure).
 * @param stages Редактируемая карта стадий
 * @param known Полная оригинальная карта стадий для валидации
 */
function normalizeStageLinks(stages: Record<string, any>, known: Record<string, any> | undefined) {
    if (!known) return;

    for (const [stageKey, stage] of Object.entries(stages)) {
        const nexts = [...toArray((stage as any)?.if_success), ...toArray((stage as any)?.if_failure)];
        const valid: string[] = [];

        for (const to of nexts) {
            if (isTerminal(to)) continue;
            if (!Object.prototype.hasOwnProperty.call(known, to)) {
                console.warn(LOG_TAG, 'Unknown stage link', { from: stageKey, to });
                continue;
            }
            valid.push(String(to));
        }

        if (Array.isArray((stage as any)?.if_success)) {
            (stage as any).if_success = (stage as any).if_success.filter((x: any) => valid.includes(String(x)));
        } else if (typeof (stage as any)?.if_success === 'string' && !valid.includes(String((stage as any).if_success))) {
            (stage as any).if_success = undefined;
        }

        if (Array.isArray((stage as any)?.if_failure)) {
            (stage as any).if_failure = (stage as any).if_failure.filter((x: any) => valid.includes(String(x)));
        } else if (typeof (stage as any)?.if_failure === 'string' && !valid.includes(String((stage as any).if_failure))) {
            (stage as any).if_failure = undefined;
        }
    }
}
/**
 * Гарантирует наличие контейнера fields для указанной стадии.
 * @returns true, если стадия существует (известна), иначе false.
 */
function ensureStageFields(args: {
    stages: Record<string, any>;
    stageKey: string;
    knownStages: Record<string, any> | undefined;
}): boolean {
    const { stages, stageKey, knownStages } = args;
    if (!knownStages || !Object.prototype.hasOwnProperty.call(knownStages, stageKey)) return false;

    const current = stages[stageKey];
    if (!current || typeof current !== 'object') {
        stages[stageKey] = { fields: {} };
    } else if (!current.fields || typeof current.fields !== 'object') {
        current.fields = {};
    }
    return true;
}

/**
 * Собирает все строки таблиц, относящиеся к templateKey
 * @param templateValues Полный набор значений из templateStore
 * @param templateKey Ключ шаблона
 */
function collectRowsForTemplate(templateValues: ParamsDraft, templateKey?: string): Record<string, any>[] {
    if (!templateKey) return [];

    const rows: Record<string, any>[] = [];
    const pushAll = (arr?: any[]) => {
        if (!Array.isArray(arr)) return;
        for (const r of arr) if (r && typeof r === 'object') rows.push(r);
    };

    // прямые строки
    pushAll((templateValues as any)[templateKey]);

    // косвенные строки с __sourceKey
    for (const [k, arr] of Object.entries(templateValues || {})) {
        if (k === templateKey || !Array.isArray(arr)) continue;
        for (const r of arr) {
            const src = String((r as any)?.__sourceKey ?? '').trim();
            if (!src) continue;
            const left = src.split('::')[0];
            if (left === templateKey) rows.push(r);
        }
    }

    // уникализация
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

/**
 * Собирает список всех шаблонов из extras и (как запасной путь) из templateStore.
 * Нужен, чтобы мультисейв работал даже если снаружи прокинули не всё.
 */
function collectTemplatesEverywhere(extras?: {
    mainTemplate?: any;
    templates?: Array<any | undefined>;
}) {
    const list: any[] = [];

    const normalizeKey = (t: any): string => {
        const raw = t?.key ?? t?.templateKey ?? t?.templateName ?? t?.name ?? t?.id ?? t?.template;
        let key = String(raw ?? '').trim();
        if (!key) {
            const fromRaw = t?.raw?.templateName ?? t?.raw?.name ?? t?.raw?.key ?? t?.raw?.id;
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
    if (Array.isArray(extras?.templates)) extras.templates.forEach(push);

    // 2) из templateStore (все популярные поля)
    try {
        const st = (templateStore as any)?.getState?.() ?? {};

        const arrays = [
            st.templates,
            st.items,
            st.list,
            st.allTemplates,
            st.availableTemplates,
            st.selectedTemplates,
            st.templateList,
        ].filter(Array.isArray) as any[][];

        arrays.forEach((arr) => arr.forEach(push));

        const maps = [st.templatesMap, st.byKey, st.templatesByKey, st.map].filter(
            (m: any) => m && typeof m === 'object'
        ) as Record<string, any>[];

        maps.forEach((m) => Object.values(m).forEach(push));
    } catch (e) {
        log('collectTemplatesEverywhere store scan error:', e);
    }

    // уникализация по ключу
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

/**
 * Снимает карту из таймлайна.
 * Используется как источник истинных таймеров при сборке снапшота.
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
        if (!Number.isFinite(minutes) || minutes <= 0) return;
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
                                : undefined;

                const stageKey: string | undefined =
                    block?.stageKey ?? block?.stage ?? block?.stage_id ?? block?.stage_name;

                const minutesRaw =
                    block?.minutes ?? block?.duration ?? block?.timer ?? block?.timerMinutes;

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
 * Достаёт значения полей стадий из таймлайна (mergedOverrides → stageFieldEdits → none).
 * Возвращает плоскую карту { [stageKey]: { [fieldKey]: value } } только по стадиям текущего шаблона.
 * @param tplIdx Индекс шаблона
 * @param templateRaw Нормализованный raw шаблона
 */
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
                        : undefined;
        if (rTplIdx === tplIdx) rowsOfTpl.push({ row: r, idxInAll: i });
    });

    const rowIdSet = new Set<string>();
    const rowIndexSet = new Set<string>();
    const stageKeysInBlocks = new Set<string>();

    for (const { row, idxInAll } of rowsOfTpl) {
        const rid =
            row?.id ?? row?.rowId ?? row?.row_id ?? row?.uuid ?? row?.key ?? row?._id ?? row?.hash;
        if (rid != null && String(rid)) rowIdSet.add(String(rid));
        rowIndexSet.add(String(idxInAll));

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

            const payload = unwrapScalar(fields);
            if (!payload || typeof payload !== 'object') continue;

            out[stageKey] = {};
            for (const [fieldKey, v] of Object.entries(payload)) {
                if (String(fieldKey).startsWith('__')) continue;
                out[stageKey][fieldKey] = unwrapScalar(v) ?? null;
            }
        }
        return out;
    };

    const collapsePerRow = (perRowObj: Record<string, any>) => {
        const out: Record<string, Record<string, any>> = {};
        let matched = false;

        for (const [rowKey, byStage] of Object.entries(perRowObj || {})) {
            const accept =
                rowIdSet.has(rowKey) || rowIndexSet.has(rowKey) || /^\d+$/.test(rowKey);
            if (!accept) continue;
            matched = true;

            const stagesMap = byStage && typeof byStage === 'object' ? byStage : {};
            for (const [stageKey, rawFields] of Object.entries(stagesMap)) {
                if (!stageKeysForTpl.has(stageKey)) continue;
                if (stageKeysInBlocks.size && !stageKeysInBlocks.has(stageKey)) continue;

                const payload = unwrapScalar(rawFields);
                if (!payload || typeof payload !== 'object') continue;

                out[stageKey] = out[stageKey] || {};
                for (const [fieldKey, v] of Object.entries(payload)) {
                    if (String(fieldKey).startsWith('__')) continue;
                    out[stageKey][fieldKey] = unwrapScalar(v) ?? null;
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
                    keys.some((k) => rowIdSet.has(k)) ||
                    keys.some((k) => rowIndexSet.has(k)) ||
                    keys.every((k) => /^\d+$/.test(k));

                if (looksPerRow) {
                    const { out, matched } = collapsePerRow(merged as Record<string, any>);
                    if (matched && Object.keys(out).length > 0)
                        return { source: 'mergedOverrides', map: out };
                } else {
                    const filtered = filterFlatByStageKeys(merged as Record<string, any>);
                    if (Object.keys(filtered).length > 0)
                        return { source: 'mergedOverrides', map: filtered };
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

/**
 * Собирает единый снапшот стадий для конкретного шаблона (tplIdx) и задачи.
 * Включает: таймеры, значения полей, params (с value), sections.unknown.inProgress.
 * @param args.taskId ID задачи
 * @param args.mainTemplate Шаблон (key + raw)
 * @param args.executorsByTemplate Матрица исполнителей
 * @param args.prev Предыдущий снапшот (для наследования time/fields)
 * @param args.tplIdx Индекс шаблона
 */
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
        (mainTemplate as any)?.raw ??
        (mainTemplate as any)?.content ??
        (mainTemplate as any)?.yaml ??
        (mainTemplate as any)?.text
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

    // Валидация ссылок и подготовка полей
    normalizeStageLinks(stages, knownStagesRaw);
    for (const [sKey, stage] of Object.entries(stages)) {
        if (!stage || typeof stage !== 'object') {
            (stages as any)[sKey] = { fields: {} };
            continue;
        }
        if (!(stage as any).fields || typeof (stage as any).fields !== 'object') {
            (stages as any)[sKey].fields = {};
        }
        for (const [fKey, rawField] of Object.entries(((stages as any)[sKey].fields) ?? {})) {
            if (rawField && typeof rawField === 'object') {
                if (!('value' in (rawField as any))) {
                    (stages as any)[sKey].fields[fKey] = { ...(rawField as any), value: null };
                }
            } else {
                (stages as any)[sKey].fields[fKey] = { value: null };
            }
        }
    }

    // params (табличные значения) → sections.unknown.inProgress
    const templateValues = snapshotParamsFromTemplateStore();
    const rowsForTpl = collectRowsForTemplate(templateValues, mainTemplateKey);

    const inProgress: Record<string, any> = {};
    for (const chunk of rowsForTpl) {
        if (!chunk || typeof chunk !== 'object') continue;
        for (const [k, v] of Object.entries(chunk)) {
            if (String(k).startsWith('__')) continue;
            inProgress[k] = unwrapScalar(v);
        }
    }
    const sections = { unknown: { inProgress } };

    // Наследуем time/fields из предыдущего снапшота (если совпадает шаблон)
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
                    const prevValue = unwrapScalar(pf);
                    (stages as any)[stageKey].fields[fieldKey] = { ...rawField, value: prevValue ?? null };
                }
            }
        }
    }

    // Таймеры из таймлайна → time в минутах (Xm)
    const { minutesByStage, rowsCount, blocksCount } = snapshotMinutesFromTimeline();
    const byStageForTpl = minutesByStage[tplIdx] ?? {};
    for (const [stageKey, minutes] of Object.entries(byStageForTpl)) {
        if (!ensureStageFields({ stages, stageKey, knownStages: knownStagesRaw })) continue;
        (stages as any)[stageKey].time = `${Math.max(0, Math.round(Number(minutes) || 0))}m`;
    }

    // Значения полей стадий из таймлайна (mergedOverrides/stageFieldEdits)
    const stageValuesRes = snapshotStageFieldValuesFromTimeline(tplIdx, rawClone);
    if (stageValuesRes.map) {
        for (const [stageKey, fieldsMap] of Object.entries(stageValuesRes.map)) {
            if (!ensureStageFields({ stages, stageKey, knownStages: knownStagesRaw })) continue;
            for (const [fieldKey, value] of Object.entries(fieldsMap)) {
                const rawField = (((stages as any)[stageKey].fields ?? {})[fieldKey] ?? {}) as Record<string, any>;
                (stages as any)[stageKey].fields[fieldKey] = { ...rawField, value: unwrapScalar(value) ?? null };
            }
        }
    }

    // Фоллбэк: если в поле стадии нет value — подставляем из inProgress (params)
    if (inProgress && typeof inProgress === 'object') {
        const knownStages = knownStagesRaw;
        for (const [stageKey, stageRaw] of Object.entries(knownStages)) {
            if (!ensureStageFields({ stages, stageKey, knownStages })) continue;
            const rawFields = (stageRaw as any)?.fields || {};
            for (const fieldKey of Object.keys(rawFields)) {
                const current = (stages as any)[stageKey].fields?.[fieldKey]?.value;
                if (current === undefined || current === null) {
                    const fallback = unwrapScalar((inProgress as any)[fieldKey]);
                    const rawField = (((stages as any)[stageKey].fields ?? {})[fieldKey] ?? {}) as Record<string, any>;
                    (stages as any)[stageKey].fields[fieldKey] = { ...rawField, value: fallback ?? null };
                }
            }
        }
    }

    // params (список определений + value)
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
            new Set([pd.key, pd.label, (pd as any).name, (pd as any).widget, pd.type]
                .map((v) => String(v ?? '').trim())
                .filter(Boolean))
        );

        // 1) inProgress (табличные)
        let vFromForm: any = undefined;
        for (const a of aliases) {
            if ((sections.unknown.inProgress as any)?.hasOwnProperty(a)) {
                vFromForm = (sections.unknown.inProgress as any)[a];
                break;
            }
        }

        // 2) стадии
        let value: any = vFromForm;
        if (value === undefined) {
            for (const a of aliases) {
                const vv = pickFromStages(a);
                if (vv !== undefined && vv !== null) {
                    value = vv;
                    break;
                }
            }
        }

        return { ...pd, value: value ?? null };
    });

    // Проставим value обратно в rawClone.params (для самодостаточного снапшота)
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

/**
 * Универсальная подписка на любой zustand-store; дергает onChange при любом апдейте.
 * @param store zustand store (с .subscribe)
 * @param onChange Колбэк на изменение
 * @param tag Метка для логов
 */
function subscribeStorePlain(store: any, onChange: () => void, tag: string): () => void {
    try {
        if (!store?.subscribe) return () => {};
        return store.subscribe(() => {
            log(`${tag} <- change detected`);
            onChange();
        });
    } catch {
        return () => {};
    }
}

/**
 * Возвращает список executorId для указанного индекса шаблона.
 * 1) Пытается взять из extras.executorsByTemplate[index] (или [0]).
 * 2) Пробует вытащить из templateStore (популярные поля).
 * 3) Возвращает ['__noexec__'] как безопасный фоллбэк.
 */
function deriveExecutorsByTemplateIdx(
    index: number,
    extras?: { executorsByTemplate?: any[][] }
): string[] {
    // 1) из extras
    const xbt = extras?.executorsByTemplate ?? [];
    if (Array.isArray(xbt[index]) && (xbt[index] as any[]).length > 0) {
        return (xbt[index] as any[]).map((e: any) => String(e?.id ?? e?.uuid ?? e?.login ?? e?.userId ?? e));
    }
    if (Array.isArray(xbt[0]) && (xbt[0] as any[]).length > 0) {
        return (xbt[0] as any[]).map((e: any) => String(e?.id ?? e?.uuid ?? e?.login ?? e?.userId ?? e));
    }

    // 2) из templateStore
    try {
        const st = (templateStore as any)?.getState?.() ?? {};
        const candidates =
            st.executorsByTemplate ??
            st.assigneesByTemplate ??
            st.performersByTemplate ??
            st.ownersByTemplate ??
            st.templateExecutors ??
            st.selectedExecutors;

        const arr = Array.isArray(candidates?.[index])
            ? candidates[index]
            : Array.isArray(candidates?.[0])
                ? candidates[0]
                : [];

        if (arr?.length) {
            return (arr as any[]).map((e: any) =>
                String(e?.id ?? e?.uuid ?? e?.login ?? e?.userId ?? e)
            );
        }
    } catch {}

    // 3) фоллбэк
    return ['__noexec__'];
}

/**
 * Включает автоперсистенцию:
 * — на любое изменение templateStore/timeline/stageFormStore снимается unified-snapshot
 * — для каждого шаблона и каждого executorId кладём свою запись:
 *     PPR_DRAFT::<taskId>::<templateKey>::<executorId>::stages
 *
 * @param taskId ID задачи
 */
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

        /** Записать снапшоты для всех (template × executorId) */
        const savePerTemplateExecutor = () => {
            const templates = collectTemplatesEverywhere({
                mainTemplate: extras?.mainTemplate,
                templates: extras?.templates,
            });

            log(
                'AUTOSAVE templates:',
                templates.map((t, i) => ({
                    idx: i,
                    key: t?.key,
                    hasRaw: !!(t?.raw ?? t?.content ?? t?.yaml ?? t?.text ?? t?.rawYaml),
                }))
            );

            templates.forEach((tpl, tplIdx) => {
                const templateKey = String((tpl as any)?.key ?? '').trim();
                let raw = normalizeRaw(
                    (tpl as any)?.raw ?? (tpl as any)?.content ?? (tpl as any)?.yaml ?? (tpl as any)?.text ?? (tpl as any)?.rawYaml
                );

                if (!templateKey) return;
                if (!raw) raw = { params: [], stages: {} }; // безопасный фоллбэк — чтобы ключ появился

                const executorIds = deriveExecutorsByTemplateIdx(tplIdx, {
                    executorsByTemplate: extras?.executorsByTemplate,
                });

                executorIds.forEach((executorId) => {
                    const lsKey = stagesKeyV2(taskId, templateKey, String(executorId));
                    const prevSnap = loadDraftFromLocalStorage<UnifiedStagesSnapshot>(lsKey);

                    const unified = buildUnifiedStagesSnapshot({
                        taskId,
                        mainTemplate: { ...(tpl as any), raw },
                        executorsByTemplate: extras?.executorsByTemplate,
                        prev: prevSnap,
                        tplIdx,
                    });

                    log('AUTOSAVE →', {
                        tplIdx,
                        templateKey,
                        executorId: String(executorId),
                        lsKey,
                    });

                    saveDraftToLocalStorage<UnifiedStagesSnapshot>(lsKey, unified);
                });
            });
        };

        // Подписки на изменения
        const unsubTemplate = subscribeStorePlain(templateStore, savePerTemplateExecutor, 'templateStore');
        const unsubTimeline = subscribeStorePlain((useTimelineStore as any), savePerTemplateExecutor, 'timelineStore');

        let unsubStageForm: undefined | (() => void);
        try {
            const maybe = require('@/entities/stageFormStore/model/store/stageFormStore');
            if (maybe?.useStageFormStore?.subscribe) {
                unsubStageForm = subscribeStorePlain(maybe.useStageFormStore, savePerTemplateExecutor, 'stageFormStore');
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

/**
 * Достаёт одну «табличную» строку params из unified-snapshot.
 * Если в snap.params уже есть value — используем их; иначе соберем из raw/sections.
 */
export function rowsFromUnifiedSnapshot(snap: UnifiedStagesSnapshot): Array<Record<string, any>> {
    if (!snap) return [];

    // 1) приоритет — snap.params
    if (Array.isArray(snap.params) && snap.params.length > 0) {
        const row: Record<string, any> = {};
        for (const p of snap.params) {
            const key = String(p?.key ?? '').trim();
            if (!key) continue;
            if ('value' in (p as any)) row[key] = (p as any).value ?? null;
        }
        if (Object.keys(row).length > 0) {
            if (snap.mainTemplateKey) row.__sourceKey = snap.mainTemplateKey;
            return [row];
        }
    }

    // 2) собрать из raw + sections
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

/** =================== Мгновенный патч таймера (V2) =================== */

/**
 * Мгновенно обновляет таймер одной стадии во всех LS-ключах (template × executorId) выбранного tplIdx.
 * Если под ключом нет снапшота — создаёт его на лету.
 *
 * @param opts.taskId ID задачи
 * @param opts.tplIdx Индекс шаблона (0 — главный)
 * @param opts.stageKey Ключ стадии
 * @param opts.minutes Новое значение таймера (минуты)
 * @param opts.mainTemplate Главный шаблон (для сборки снапшота, если его ещё нет)
 * @param opts.executorsByTemplate Матрица исполнителей
 * @param opts.templates Полный список шаблонов (главный + дополнительные)
 */
export function patchStageTimeInLocalStorage(opts: {
    taskId: string;
    tplIdx: number;
    stageKey: string;
    minutes: number;
    mainTemplate?: any;
    executorsByTemplate?: any[][];
    templates?: Array<any | undefined>;
}): void {
    const {
        taskId,
        tplIdx,
        stageKey,
        minutes,
        mainTemplate,
        executorsByTemplate,
        templates,
    } = opts;

    const tpl =
        (Array.isArray(templates) && templates[tplIdx]) || (tplIdx === 0 ? mainTemplate : undefined);

    const templateKey = String((tpl as any)?.key ?? '').trim();
    if (!templateKey) return;

    const executorIds =
        Array.isArray(executorsByTemplate?.[tplIdx]) && executorsByTemplate![tplIdx].length
            ? executorsByTemplate![tplIdx].map((e: any) =>
                String(e?.id ?? e?.uuid ?? e?.login ?? e?.userId ?? e)
            )
            : ['__noexec__'];

    const mm = Math.max(0, Math.round(Number(minutes) || 0));

    executorIds.forEach((executorId) => {
        const lsKey = stagesKeyV2(taskId, templateKey, String(executorId));
        let snapshot = loadDraftFromLocalStorage<UnifiedStagesSnapshot>(lsKey);

        if (!snapshot) {
            snapshot = buildUnifiedStagesSnapshot({
                taskId,
                mainTemplate: tpl,
                executorsByTemplate,
                tplIdx,
            });
        }

        if (!snapshot.stages) snapshot.stages = {};
        if (!snapshot.stages[stageKey]) snapshot.stages[stageKey] = { fields: {} };

        (snapshot.stages as any)[stageKey].time = `${mm}m`;
        snapshot.updatedAt = new Date().toISOString();

        saveDraftToLocalStorage<UnifiedStagesSnapshot>(lsKey, snapshot);
    });
}
