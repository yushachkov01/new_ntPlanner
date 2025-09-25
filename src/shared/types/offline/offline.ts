// Версии форматов оффлайн-хранилища
export const OFFLINE_V = 1 as const;

export type UUID = string & { __brand: 'uuid' };

/**
 * Минимальный черновик ППР для оффлайна.
 * Данные подобраны по доступному состоянию на странице редактора:
 * - mainTemplateKey — ключ основного шаблона
 * - executorsByTemplate — список исполнителей по шаблонам (как в usePprExecutors)
 * - timelineOverrides — ручные изменения длительностей стадий на таймлайне
 */
export interface PlannedTaskDraft {
    id: UUID; // planned_tasks.id
    yamlUrl?: string;
    mainTemplateKey?: string;
    executorsByTemplate?: Array<Array<Record<string, unknown>>>;
    timelineOverrides?: Array<{ tplIdx: number; stageKey: string; minutes: number }>;
    updatedAt: string; // ISO
    version: number; // формат черновика
}

/** Ключи в localStorage */
export const LS_KEYS = {
    DRAFTS: 'ntp:offline:drafts',          // Map<taskId, PlannedTaskDraft>
    MUTATION_QUEUE: 'ntp:offline:queue',   // Очередь GraphQL-мутаций (на будущее)
} as const;

/** Оболочка над состоянием для возможности миграций */
export interface OfflineEnvelope<T> {
    v: number; // версия формата конверта
    data: T;
}
