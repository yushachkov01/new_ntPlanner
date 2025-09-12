import { create } from 'zustand';

export type StageFormPersistKey = {
    plannedTaskId?: string | null;
    templateKey: string;
    stageKey: string;
    rowId?: number | string | null;
};

export type StageFormKey = StageFormPersistKey;

export type StageFormValues = Record<string, unknown>;

/**
 * Строит строковый ключ для словаря состояний формы этапа.
 * @params: { plannedTaskId, templateKey, stageKey, rowId } — составные части ключа
 */
const makePersistKey = ({ plannedTaskId, templateKey, stageKey, rowId }: StageFormPersistKey) =>
    [plannedTaskId ?? 'pt', templateKey, stageKey, rowId ?? 'r0'].join('::');

type StageFormState = {
    valuesByStage: Record<string, StageFormValues>;
};

type StageFormActions = {
    /**
     * Возвращает сохранённые значения формы по составному ключу.
     */
    get: (key: StageFormPersistKey) => StageFormValues | undefined;

    /**
     * Полностью заменяет значения формы для заданного ключа.
     * params: key — составной ключ; values — полное состояние формы
     */
    setAll: (key: StageFormPersistKey, values: StageFormValues) => void;

    /**
     * Частично обновляет (merge) значения формы для заданного ключа.
     * params: key — составной ключ; patch — патч значений формы
     */
    patch: (key: StageFormPersistKey, patch: StageFormValues) => void;

    /**
     * Удаляет сохранённые значения формы для конкретного ключа.
     * params: key — составной ключ, который нужно удалить
     */
    reset: (key: StageFormPersistKey) => void;

    /**
     * Очищает все состояния форм, принадлежащие указанному шаблону.
     * params: templateKey — ключ шаблона, по которому фильтруем
     */
    resetByTemplate: (templateKey: string) => void;
};

/**
 * Хук Zustand-хранилища для персиста значений форм этапов.
 * params: нет (используйте методы get/setAll/patch/reset/resetByTemplate)
 */
export const useStageFormStore = create<StageFormState & StageFormActions>((set, get) => ({
    valuesByStage: {},

    /**
     * Возвращает сохранённые значения формы по составному ключу.
     */
    get: (key) => get().valuesByStage[makePersistKey(key)],

    /**
     * Полностью заменяет значения формы для заданного ключа.
     */
    setAll: (key, values) =>
        set((currentState) => ({
            valuesByStage: {
                ...currentState.valuesByStage,
                [makePersistKey(key)]: { ...values },
            },
        })),

    /**
     * Частично обновляет (merge) значения формы для заданного ключа.
     */
    patch: (key, patch) =>
        set((currentState) => {
            const persistKeyString = makePersistKey(key);
            const previousValues = currentState.valuesByStage[persistKeyString] ?? {};
            return {
                valuesByStage: {
                    ...currentState.valuesByStage,
                    [persistKeyString]: { ...previousValues, ...patch },
                },
            };
        }),

    /**
     * Удаляет сохранённые значения формы для конкретного ключа.
     */
    reset: (key) =>
        set((currentState) => {
            const nextValuesByStage = { ...currentState.valuesByStage };
            delete nextValuesByStage[makePersistKey(key)];
            return { valuesByStage: nextValuesByStage };
        }),

    /**
     * Очищает все состояния форм, принадлежащие указанному шаблону.
     */
    resetByTemplate: (templateKey) =>
        set((currentState) => {
            const filteredValuesByStage = Object.fromEntries(
                Object.entries(currentState.valuesByStage).filter(
                    ([persistKeyString]) => !persistKeyString.includes(`::${templateKey}::`),
                ),
            );
            return { valuesByStage: filteredValuesByStage };
        }),
}));
