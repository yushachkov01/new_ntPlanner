/**
 *  для кэширования и загрузки YAML-шаблонов из MinIO.
 *  Данные хранятся в Map<cacheKey, Template[]>
 *  Одновременно отслеживает выполняющиеся загрузки в Set<cacheKey>
 *  При повторном запросе возвращает данные из кэша или ждёт завершения текущей загрузки
 */

import { create } from "zustand";
import { listObjects, getObjectText } from "@/shared/minio/MinioClient";
import { parseYaml } from "@/shared/lib/yamlUtils/yamlUtils";

export interface Template {
  key: string;
  name: string;
  raw: any;
}

interface State {
  /** Кэш загруженных шаблонов: Map<cacheKey, Template[]> */
  cache: Map<string, Template[]>;
  /** Множество ключей, для которых идёт загрузка */
  loading: Set<string>;
  /**
   * Загрузить шаблоны из MinIO:
   * - при наличии в кэше возвращает сразу
   * - при активной загрузке ждёт её окончания
   * - иначе делает запросы listObjects + getObjectText + parseYaml
   *
   * @param bucket — имя бакета в MinIO
   * @param prefix — префикс внутри бакета
   * @returns Promise<Template[]> — массив моделей шаблонов
   */
  fetchTemplates: (bucket: string, prefix?: string) => Promise<Template[]>;
}

export const useTemplateStore = create<State>((set, get) => ({
  cache:   new Map(),
  loading: new Set(),

  async fetchTemplates(bucket, prefix = "") {
    const cacheKey = `${bucket}/${prefix}`;

    /**  Если в кэше уже есть данные — возвращаем их сразу */
    const cached = get().cache.get(cacheKey);
    if (cached) return cached;

    /**  Если для этого ключа уже идёт загрузка — ждём её завершения */
    if (get().loading.has(cacheKey)) {
      return await new Promise<Template[]>((resolve) => {
        const unsub = useTemplateStore.subscribe(
            (s) => s.cache.get(cacheKey),
            (value) => {
              if (value) {
                unsub();
                resolve(value);
              }
            },
        );
      });
    }

    /**  Выполняем новую загрузку шаблонов */
    try {
      set((s) => ({ loading: new Set(s.loading).add(cacheKey) }));

      const objs = await listObjects(bucket, prefix);
      const templates: Template[] = [];

      for (const o of objs) {
        if (!o.Key?.endsWith(".yaml")) continue;
        const key = o.Key!;
        const text = await getObjectText(bucket, key);
        const { data, error } = parseYaml(text);
        if (error) {
          console.error(`Ошибка парсинга шаблона "${key}":`, error);
          continue;
        }
        templates.push({
          key,
          name: (data as any)?.name ?? key,
          raw:  data,
        });
      }

      /** сохраняем в кэш и снимаем флаг загрузки */
      set((s) => {
        const nextCache = new Map(s.cache);
        nextCache.set(cacheKey, templates);
        const nextLoading = new Set(s.loading);
        nextLoading.delete(cacheKey);
        return { cache: nextCache, loading: nextLoading };
      });

      return templates;
    } catch (e) {
      /** на ошибке тоже снимаем флаг загрузки */
      set((s) => {
        const nextLoading = new Set(s.loading);
        nextLoading.delete(cacheKey);
        return { loading: nextLoading };
      });
      throw e;
    }
  },
}));