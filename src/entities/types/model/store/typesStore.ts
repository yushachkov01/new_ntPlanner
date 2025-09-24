/**
 * Zustand store для загрузки и хранения types.yaml.
 * Используется для подгрузки описания типов (enums и тд)
 */

import * as YAML from 'js-yaml';
import { create } from 'zustand';
import {TYPES_FILENAME, YAML_BUCKET} from "@/shared/constants";

/**
 * Универсальный парсер строки в объект.*
 * @param text - входная строка в формате YAML или JSON
 * @returns разобранный объект или null
 */
function parseYamlOrJson(text: string): any | null {
  try {
    return YAML.load(text);
  } catch {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }
}

/**
 * Список URL-кандидатов для загрузки types.yaml
 */
const CANDIDATE_URLS: string[] = [
  '/yamls/types.yaml?x-id=GetObject',
  '/yamls/types.yaml',
  '/types.yaml',
  '/assets/types.yaml',
];

/**
 * загружаем types.yaml через MinIO-клиент.
 *
 * @returns объект типов или null, если загрузка невозможна
 */
async function tryLoadViaMinio(): Promise<any | null> {
  try {
    const minioModule = await import('@/shared/minio/MinioClient');
    if (!minioModule?.getObjectText) return null;

    const text: string = await minioModule.getObjectText(YAML_BUCKET, TYPES_FILENAME);
    const parsedObject = parseYamlOrJson(text);
    return parsedObject && typeof parsedObject === 'object' ? parsedObject : null;
  } catch {
    return null;
  }
}

/**
 * Основная функция загрузки types.yaml.
 * @returns разобранный объект types.yaml
 */
async function loadTypesYamlOnce(): Promise<any | null> {
  const preloaded = (window as any).__TYPES_YAML__;
  if (preloaded && typeof preloaded === 'object') {
    return preloaded;
  }
  const fromMinio = await tryLoadViaMinio();
  if (fromMinio) return fromMinio;

  for (const url of CANDIDATE_URLS) {
    try {
      const response = await fetch(url, { method: 'GET', cache: 'no-store', mode: 'cors' });
      if (!response.ok) continue;

      const text = await response.text();
      const parsedObject = parseYamlOrJson(text);
      if (parsedObject && typeof parsedObject === 'object') return parsedObject;
    } catch (error) {
      console.error('[DYF/typesStore] error', error);
    }
  }
  return null;
}

/**
 * Тип состояния Zustand-хранилища типов.
 */
type TypesStore = {
  /** Загруженные types.yaml (null — ещё не пробовали загрузить, {} — пустой результат, object — успешная загрузка) */
  types: any | null;

  /** Индикатор текущей загрузки */
  isLoading: boolean;

  /** Сообщение об ошибке, если загрузка не удалась */
  error: string | null;

  /** Время последней попытки загрузки (timestamp) */
  lastAttemptAt: number | null;

  /**
   * Метод загрузки types.yaml.
   * @param force - если true, игнорирует кэш и форсирует загрузку
   */
  load: (force?: boolean) => Promise<void>;

  /**
   * Метод установки типов
   * @param newTypes - новый объект types.yaml
   */
  setTypes: (newTypes: any) => void;
};

/**
 * Zustand store для хранения и загрузки types.yaml.
 */
export const useTypesStore = create<TypesStore>((set, get) => ({
  types: null,
  isLoading: false,
  error: null,
  lastAttemptAt: null,

  /**
   * Устанавливает объект типов в хранилище.
   *
   * @param newTypes - объект types.yaml
   */
  setTypes(newTypes) {
    set({ types: newTypes });
  },

  /**
   * Загружает types.yaml с учётом cooldown и форсированной загрузки.
   *
   * @param force - если true, игнорирует cooldown и состояние
   */
  async load(force = false) {
    const state = get();
    const now = Date.now();

    const isCooldownExpired = !state.lastAttemptAt || now - state.lastAttemptAt > 1500;
    const hasValidTypes =
      !!state.types && typeof state.types === 'object' && Object.keys(state.types).length > 0;

    if (!force && (state.isLoading || hasValidTypes || !isCooldownExpired)) {
      return;
    }

    set({ isLoading: true, error: null, lastAttemptAt: now });

    try {
      const data = await loadTypesYamlOnce();

      if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
        set({ types: {}, isLoading: false, error: 'types.yaml not found or empty' });
        return;
      }

      set({ types: data, isLoading: false, error: null });
    } catch (error: any) {
      set({
        types: {},
        isLoading: false,
        error: String(error?.message ?? error),
      });
    }
  },
}));
