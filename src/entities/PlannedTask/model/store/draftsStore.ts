/**
 * Zustand-стор черновиков ППР с оффлайн-хранилищем (localStorage).
 * — Строгая типизация.
 * — Защита от сохранения под пустым/невалидным ключом.
 * — Миграция: удаление мусорных ключей и нормализация записей.
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { jsonStorage } from '@/shared/lib/storage/jsonStorage';
import {
    LS_KEYS,
    OFFLINE_V,
    type OfflineEnvelope,
    type PlannedTaskDraft,
    type UUID,
} from '@/shared/types/offline/offline';

/** Валидатор UUID (RFC4122 v1-5) */
const isUuid = (s: unknown): s is UUID =>
    typeof s === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);

type DraftsState = {
    /** Хранение черновиков по ключу planned_task.id */
    drafts: Record<UUID, PlannedTaskDraft>;
    /** Вставка/обновление черновика (id обязателен и должен быть UUID) */
    upsertDraft: (draft: PlannedTaskDraft) => void;
    /** Получить черновик по id */
    getDraft: (id: UUID) => PlannedTaskDraft | undefined;
    /** Удалить конкретный черновик */
    removeDraft: (id: UUID) => void;
    /** Полная очистка всех черновиков */
    clear: () => void;
};

export const useDraftsStore = create<DraftsState>()(
    devtools(
        persist(
            (set, get) => ({
                drafts: {},

                upsertDraft: (draft) => {
                    // Защита: не сохраняем под пустым/невалидным id
                    if (!isUuid(draft.id)) return;

                    set((s) => ({
                        drafts: {
                            ...s.drafts,
                            [draft.id]: {
                                ...draft,
                                version: draft.version ?? OFFLINE_V,
                                updatedAt: new Date().toISOString(),
                            },
                        },
                    }));
                },

                getDraft: (id) => (isUuid(id) ? get().drafts[id] : undefined),

                removeDraft: (id) =>
                    set((s) => {
                        if (!isUuid(id)) return s;
                        const { [id]: _omit, ...rest } = s.drafts;
                        return { drafts: rest };
                    }),

                clear: () => set({ drafts: {} }),
            }),
            {
                name: LS_KEYS.DRAFTS,

                // Адаптер хранения в LocalStorage с «конвертом» (версия + данные)
                storage: {
                    getItem: (key) => {
                        const env = jsonStorage.get<OfflineEnvelope<Record<UUID, PlannedTaskDraft>>>(key);
                        return env ? { state: env.data } : null;
                    },
                    setItem: (key, value) => {
                        const env: OfflineEnvelope<Record<UUID, PlannedTaskDraft>> = {
                            v: OFFLINE_V,
                            data: value.state,
                        };
                        jsonStorage.set(key, env);
                    },
                    removeItem: (key) => jsonStorage.remove(key),
                },

                version: OFFLINE_V,

                /**
                 * Миграция сохранённого состояния:
                 * 1) удаляем мусорные ключи ("" и любые не-UUID),
                 * 2) нормализуем поля id/version/updatedAt,
                 * 3) если по одному UUID есть дубль — оставляем самый свежий по updatedAt.
                 */
                migrate: async (persisted) => {
                    // если состояние пустое/некорректное — возвращаем как есть
                    const state = (persisted as any)?.state as DraftsState | undefined;
                    if (!state || typeof state !== 'object') return persisted as any;

                    const src = (state.drafts ?? {}) as Record<string, PlannedTaskDraft>;
                    const cleaned: Record<UUID, PlannedTaskDraft> = {};

                    for (const [rawKey, value] of Object.entries(src)) {
                        if (!isUuid(rawKey)) continue; // скипаем "" и любые невалидные ключи
                        const k = rawKey as UUID;

                        const normalized: PlannedTaskDraft = {
                            ...value,
                            id: k, // ключ = id
                            version: value.version ?? OFFLINE_V,
                            updatedAt: value.updatedAt ?? new Date().toISOString(),
                        };

                        const prev = cleaned[k];
                        if (!prev) {
                            cleaned[k] = normalized;
                            continue;
                        }

                        // коллизия по ключу — берём самый свежий
                        const prevTs = Date.parse(prev.updatedAt);
                        const nextTs = Date.parse(normalized.updatedAt);
                        cleaned[k] = Number.isFinite(nextTs) && nextTs > prevTs ? normalized : prev;
                    }

                    return {
                        ...(persisted as any),
                        state: {
                            ...(state as any),
                            drafts: cleaned,
                        },
                    };
                },
            },
        ),
    ),
);
