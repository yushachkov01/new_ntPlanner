import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { parseYaml } from '@/shared/lib/yamlUtils/yamlUtils';
import { getMinioClient } from '@/shared/minio/getMinioClient';
import {loadYamlTemplatesNative} from "@/shared/integration/templates";

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

/**
 * Состояние стора шаблонов
 */
interface TemplatesState {
  /** Все загруженные шаблоны по ключу */
  templates: Record<string, Template>;
  /** Текущий выбранный ключ шаблона */
  currentTemplateKey: string | null;
  memoryCache: Record<string, Template[]>;
  /** Набор ключей, для которых в данный момент идёт загрузка */
  loading: Set<string>;
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
  /** Сбросить все данные стора */
  reset: () => void;
  /** Хранилище введённых строк формы */
  templateValues: Record<string, Record<string, any>[]>;
  /** Сохранить массив записей под ключом (executorId|headline) */
  setTemplateValues: (key: string, entries: Record<string, any>[]) => void;
  /** Получить массив записей по ключу */
  getTemplateValues: (key: string) => Record<string, any>[];
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

        clearTemplateValues: (key: string) =>
          set((state) => {
            const copy = { ...state.templateValues };
            delete copy[key];
            return { templateValues: copy };
          }),

        /** сохраняем список шаблонов */
        setTemplates: (templateArray) =>
          set({
            templates: Object.fromEntries(templateArray.map((tpl) => [tpl.templateName, tpl])),
          }),

        /** выбираем текущий шаблон по ключу */
        selectTemplate: (templateName) => {
          if (get().templates[templateName]) {
            set({ currentTemplateKey: templateName });
          }
        },

        /** обновляем шаблон через функцию‑updater */
        updateTemplate: (templateName, updater) => {
          const previous = get().templates[templateName];
          if (!previous) return;
          set((state) => ({
            templates: {
              ...state.templates,
              [templateName]: updater(previous),
            },
          }));
        },

        /** патчим части шаблона */
        patchTemplate: (templateName, patch) =>
          get().updateTemplate(templateName, (prev) => ({ ...prev, ...patch })),
        setTemplateValues: (key, entries) =>
          set((state) => ({
            templateValues: { ...state.templateValues, [key]: entries },
          })),
        getTemplateValues: (key) => get().templateValues[key] ?? [],
        /** асинхронный fetch шаблонов из Minio */
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
              // маппим к нашей доменной сущности Template (сохраняем rawYaml!)
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
            /** копируем в основной map */
            get().setTemplates(loadedTemplates);
            if (!get().currentTemplateKey && loadedTemplates.length) {
              set({ currentTemplateKey: loadedTemplates[0].templateName });
            }
            return loadedTemplates;
          } finally {
            /** снимаем пометку загрузки */
            set((state) => {
              const nextLoading = new Set(state.loading);
              nextLoading.delete(cacheKey);
              return { loading: nextLoading };
            });
          }
        },

        reset: () =>
          set({
            templates: {},
            currentTemplateKey: null,
            memoryCache: {},
            loading: new Set<string>(),
          }),
      }),
      {
        name: 'templates-store',
        version: 9,
        partialize: (state) => ({
          currentTemplateKey: state.currentTemplateKey,
          templateValues: state.templateValues,
        }),
      },
    ),
  ),
);
