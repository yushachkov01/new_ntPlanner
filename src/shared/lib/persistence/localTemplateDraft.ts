/**
 * Персистенция параметров и этапов выбранного шаблона в localStorage.
 * - Ключ: PPR_DRAFT::<templateId> (templateId берём из yaml_url | id | name).
 */


export type TemplateDraft = {
    params?: { values: Record<string, unknown>; savedAt: string };
    table?: { rows: Array<Record<string, unknown>>; savedAt: string };
};

export type StageDraftBundle = {
    stages: Record<
        string,
        {
            values: Record<string, unknown>;
            savedAt: string;
        }
    >;
};

export interface TemplateParamsDraft {
    values: Record<string, unknown>;
    savedAt: string;
}

export interface TemplateRowsDraft {
    rows: unknown[];
    savedAt: string;
}

export interface TemplateStageFormsDraft {
    stageForms: unknown[];
    meta?: Record<string, unknown>;
    savedAt: string;
}

export interface TemplateDraftBundle {
    params?: TemplateParamsDraft;
    rows?: TemplateRowsDraft;
    stageForms?: TemplateStageFormsDraft;
}

/** Стабильный ключ под конкретный шаблон */
export function buildTemplateDraftKey(templateId: string) {
    return `PPR_DRAFT::${templateId}`;
}

/** Best-effort извлечение идентификатора шаблона */
export function resolveTemplateId(template?: { yaml_url?: string; id?: string | number; name?: string }) {
    return String(template?.yaml_url ?? template?.id ?? template?.name ?? 'unknown');
}

/** Локальные безопасные JSON-хелперы */
export function jsonParse<T>(raw: string | null): T | undefined {
    if (!raw) return undefined;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return undefined;
    }
}
export function jsonStringify(obj: unknown): string {
    try {
        return JSON.stringify(obj);
    } catch {
        return '{}';
    }
}

/** Прочитать общий бандл черновика из localStorage */
export function readTemplateDraft(templateId: string): TemplateDraftBundle | undefined {
    const key = buildTemplateDraftKey(templateId);
    return jsonParse<TemplateDraftBundle>(localStorage.getItem(key));
}

/** Сохранить СТРОКИ ТАБЛИЦЫ (DynamicYamlForm) без потери остальных секций */
export function saveRows(templateId: string, rows: unknown[]) {
    const key = buildTemplateDraftKey(templateId);
    const prev = readTemplateDraft(templateId) ?? {};
    const next: TemplateDraftBundle = {
        ...prev,
        rows: { rows, savedAt: new Date().toISOString() },
    };
    localStorage.setItem(key, jsonStringify(next));
}

/** Сохранить АГРЕГИРОВАННЫЕ ФОРМЫ ЭТАПОВ (StagePanel) без потери остальных секций */
export function saveStageForms(
    templateId: string,
    stageForms: unknown[],
    meta?: Record<string, unknown>,
) {
    const key = buildTemplateDraftKey(templateId);
    const prev = readTemplateDraft(templateId) ?? {};
    const next: TemplateDraftBundle = {
        ...prev,
        stageForms: { stageForms, meta, savedAt: new Date().toISOString() },
    };
    localStorage.setItem(key, jsonStringify(next));
}
