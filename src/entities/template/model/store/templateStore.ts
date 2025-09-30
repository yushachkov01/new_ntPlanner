

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { parseYaml } from '@/shared/lib/yamlUtils/yamlUtils';
import { getMinioClient } from '@/shared/minio/getMinioClient';
import { loadYamlTemplatesNative } from '@/shared/integration/templates';
import {
    TEMPLATES_STORE_PERSIST_KEY,
    TEMPLATES_STORE_PERSIST_VERSION,
} from '@/shared/constants';

/**
 * Описание поля в колонке таблицы шаблона
 */
export interface TemplateColumnField {
    key: string;
    name: string;
    position: number;
    widget: 'input' | 'dropdown' | 'group';
    type: 'string' | 'boolean' | 'number';
    options?: string[];
    defaultValue?: string | number | boolean;
}

/**
 * Описание колонки шаблона
 */
export interface TemplateColumn {
    key: string;
    name: string;
    position: number;
    widget: 'input' | 'dropdown' | 'group';
    comment?: string;
    engineer?: string;
    /** Если widget === "group" */
    fields?: Record<string, TemplateColumnField>;
}

/**
 * Конфигурация этапа шаблона
 */
export interface StageField {
    description: string;
    engineer: string;
    timer_default: number;
    if_success: string;
    if_failure?: string;
    commands_hand: boolean;
    /** Вложенные параметры этапа */
    fields?: Record<string, TemplateColumnField>;
}

/**
 * Полная сущность шаблона
 */
export interface Template {
    templateName: string;
    settings: Record<string, TemplateColumn>;
    stage_status: string;
    timer_default: number;
    current_stages: string[];
    stages_field: Record<string, StageField>;
    rawYaml: string;
    raw: Record<string, unknown>;
}

/** ---------- Вспомогательные ---------- */

type Row = Record<string, any>;
type TemplateRows = Record<string, Row[]>;

const normKey = (k: string | null | undefined) => String(k ?? '').trim();

/** лёгкий дедуп по JSON */
const dedup = (rows: Row[]) => {
    const seen = new Set<string>();
    const out: Row[] = [];
    for (const r of rows ?? []) {
        const token = JSON.stringify(r ?? null);
        if (seen.has(token)) continue;
        seen.add(token);
        out.push(r);
    }
    return out;
};

/** НЕ обрезаем __sourceKey; если его нет — генерируем уникальный */
const ensureSourceKey = (tplKey: string, row: any): string => {
    const raw = row?.__sourceKey;
    if (raw && String(raw).trim()) return String(raw).trim();
    return `${tplKey}::${Date.now()}_${Math.random().toString(36).slice(2)}`;
};

interface TemplatesState {
    /** Все загруженные шаблоны по ключу */
    templates: Record<string, Template>;
    /** Текущий выбранный ключ шаблона */
    currentTemplateKey: string | null;
    memoryCache: Record<string, Template[]>;
    /** Набор ключей, для которых в данный момент идёт загрузка */
    loading: Set<string>;

    /** --- Служебное: ре-гидрация persist завершилась --- */
    hydrated: boolean;

    /** Сохранить список шаблонов */
    setTemplates: (list: Template[]) => void;
    /** Выбрать активный шаблон по имени */
    selectTemplate: (name: string) => void;
    /** Асинхронно загрузить список шаблонов */
    fetchTemplates: (bucket: string, prefix?: string) => Promise<Template[]>;
    /** Обновить шаблон функцией */
    updateTemplate: (name: string, updater: (prev: Template) => Template) => void;
    /** Частично обновить шаблон по patch */
    patchTemplate: (name: string, patch: Partial<Template>) => void;

    /** Сбросить все данные по шаблонам (без строк формы) */
    reset: () => void;
    /** Полная очистка, включая templateValues */
    resetAll: () => void;

    /** Хранилище введённых строк формы: key(=templateKey) -> rows */
    templateValues: TemplateRows;

    /** Полностью заменить массив записей под ключом */
    setTemplateValues: (key: string, entries: Row[]) => void;
    /** Получить массив записей по ключу */
    getTemplateValues: (key: string) => Row[];
    /** Слить записи с существующими (с дедупом) */
    mergeTemplateValues: (key: string, entries: Row[]) => void;
    /** Добавить одну строку */
    appendTemplateRow: (key: string, row: Row) => void;
    /** Обновить строку по индексу */
    updateTemplateRow: (key: string, index: number, patch: Partial<Row>) => void;
    /** Удалить строку по индексу */
    removeTemplateRow: (key: string, index: number) => void;
    /** Очистить записи по ключу */
    clearTemplateValues: (key: string) => void;
}

export const templateStore = create<TemplatesState>()(
    devtools(
        persist(
            (set, get) => ({
                templateValues: {},
                templates: {},
                currentTemplateKey: null,
                memoryCache: {},
                loading: new Set<string>(),
                hydrated: false,

                /** сохраняем список шаблонов */
                setTemplates: (templateArray) =>
                    set({
                        templates: Object.fromEntries(
                            (templateArray ?? []).map((tpl) => [tpl.templateName, tpl]),
                        ),
                    }),

                /** выбираем текущий шаблон по ключу */
                selectTemplate: (templateName) => {
                    const k = normKey(templateName);
                    if (!k) return;
                    if (get().templates[k]) {
                        set({ currentTemplateKey: k });
                    }
                },

                /** обновляем шаблон через функцию-updater */
                updateTemplate: (templateName, updater) => {
                    const k = normKey(templateName);
                    if (!k) return;
                    const previous = get().templates[k];
                    if (!previous) return;
                    set((state) => ({
                        templates: {
                            ...state.templates,
                            [k]: updater(previous),
                        },
                    }));
                },

                /** патчим части шаблона */
                patchTemplate: (templateName, patch) =>
                    get().updateTemplate(templateName, (prev) => ({ ...prev, ...patch })),

                /** ----------- Работа со строками формы ----------- */

                setTemplateValues: (key, entries) => {
                    const k = normKey(key);
                    if (!k) return;
                    const rows = Array.isArray(entries) ? entries.slice() : [];
                    const fixed = rows.map((r) =>
                        r && typeof r === 'object'
                            ? { ...r, __sourceKey: ensureSourceKey(k, r) }
                            : r,
                    );
                    set((state) => ({
                        templateValues: { ...state.templateValues, [k]: fixed },
                    }));
                },

                getTemplateValues: (key) => {
                    const k = normKey(key);
                    if (!k) return [];
                    const arr = get().templateValues[k];
                    return Array.isArray(arr) ? arr : [];
                },

                mergeTemplateValues: (key, entries) => {
                    const k = normKey(key);
                    if (!k) return;
                    const prev = get().templateValues[k] ?? [];
                    const next = Array.isArray(entries) ? entries : [];
                    const fixed = next.map((r) =>
                        r && typeof r === 'object'
                            ? { ...r, __sourceKey: ensureSourceKey(k, r) }
                            : r,
                    );
                    const merged = dedup([...prev, ...fixed]);
                    set((state) => ({
                        templateValues: { ...state.templateValues, [k]: merged },
                    }));
                },

                appendTemplateRow: (key, row) => {
                    const k = normKey(key);
                    if (!k) return;
                    const prev = get().templateValues[k] ?? [];
                    const payload =
                        row && typeof row === 'object'
                            ? { ...row, __sourceKey: ensureSourceKey(k, row) }
                            : row;
                    const merged = dedup([...prev, payload]);
                    set((state) => ({
                        templateValues: { ...state.templateValues, [k]: merged },
                    }));
                },

                updateTemplateRow: (key, index, patch) => {
                    const k = normKey(key);
                    if (!k) return;
                    const prev = get().templateValues[k] ?? [];
                    if (index < 0 || index >= prev.length) return;
                    const updated = prev.slice();
                    updated[index] = { ...updated[index], ...patch };
                    set((state) => ({
                        templateValues: { ...state.templateValues, [k]: updated },
                    }));
                },

                removeTemplateRow: (key, index) => {
                    const k = normKey(key);
                    if (!k) return;
                    const prev = get().templateValues[k] ?? [];
                    if (index < 0 || index >= prev.length) return;
                    const next = prev.slice(0, index).concat(prev.slice(index + 1));
                    set((state) => ({
                        templateValues: { ...state.templateValues, [k]: next },
                    }));
                },

                clearTemplateValues: (key: string) =>
                    set((state) => {
                        const k = normKey(key);
                        if (!k) return {};
                        const copy = { ...state.templateValues };
                        delete copy[k];
                        return { templateValues: copy };
                    }),

                /** ----------- Загрузка шаблонов из Minio ----------- */

                async fetchTemplates(bucket: string, prefix = '') {
                    const cacheKey = `${bucket}/${prefix}`;
                    const cachedTemplates = get().memoryCache[cacheKey];
                    if (cachedTemplates) return cachedTemplates;

                    set((state) => ({ loading: new Set(state.loading).add(cacheKey) }));

                    try {
                        const native = await getMinioClient();
                        const items = await loadYamlTemplatesNative(
                            native,
                            bucket,
                            prefix,
                            (yamlText: string) => {
                                const { data } = parseYaml(yamlText);
                                return (data ?? {}) as Record<string, unknown>;
                            },
                        );

                        const loadedTemplates: Template[] = items.map(({ key, text, data }) => ({
                            templateName: (data as any).templateName ?? (data as any).name ?? key,
                            settings: (data as any).settings ?? {},
                            stage_status: (data as any).stage_status ?? '',
                            timer_default: (data as any).timer_default ?? 0,
                            current_stages: (data as any).current_stages ?? [],
                            stages_field: (data as any).stages_field ?? {},
                            rawYaml: text,
                            raw: data as Record<string, unknown>,
                        }));

                        set((state) => ({
                            memoryCache: {
                                ...state.memoryCache,
                                [cacheKey]: loadedTemplates,
                            },
                        }));

                        // копируем в основной map
                        get().setTemplates(loadedTemplates);

                        if (!get().currentTemplateKey && loadedTemplates.length) {
                            set({ currentTemplateKey: loadedTemplates[0].templateName });
                        }

                        return loadedTemplates;
                    } finally {
                        set((state) => {
                            const nextLoading = new Set(state.loading);
                            nextLoading.delete(cacheKey);
                            return { loading: nextLoading };
                        });
                    }
                },

                /** Сброс только служебных частей (без templateValues) */
                reset: () =>
                    set({
                        templates: {},
                        currentTemplateKey: null,
                        memoryCache: {},
                        loading: new Set<string>(),
                    }),

                /** Полная очистка: включая строки формы */
                resetAll: () =>
                    set({
                        templates: {},
                        currentTemplateKey: null,
                        memoryCache: {},
                        loading: new Set<string>(),
                        templateValues: {},
                    }),
            }),
            {
                name: TEMPLATES_STORE_PERSIST_KEY,
                version: TEMPLATES_STORE_PERSIST_VERSION,

                /** В persist кладём только то, что нужно для восстановления формы */
                partialize: (state) => ({
                    currentTemplateKey: state.currentTemplateKey,
                    templateValues: state.templateValues,
                }),

                /**
                 * КРИТИЧЕСКОЕ МЕСТО:
                 * При ре-гидрации не затираем уже положенные в рантайме строки.
                 * current имеет приоритет над persisted; templateValues мержим глубоко.
                 */
                merge: (persisted: any, current: any) => {
                    const pTV = (persisted?.state?.templateValues ?? {}) as TemplateRows;
                    const cTV = (current?.templateValues ?? {}) as TemplateRows;

                    // current поверх persisted
                    const mergedTemplateValues: TemplateRows = { ...pTV, ...cTV };

                    return {
                        ...persisted?.state,
                        ...current,
                        templateValues: mergedTemplateValues,
                    };
                },

                onRehydrateStorage: () => (state, error) => {
                    if (error) {
                        console.warn('[templates-store] rehydrate error:', error);
                    }
                    (state as any)?.set?.({ hydrated: true });
                    // Для наглядности в консоли:
                    try {

                    } catch {}
                },
            },
        ),
    ),
);

