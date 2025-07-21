import { create } from 'zustand';

import { graphqlClient } from '@/shared/lib/graphql/client';
import type { FetchLocationQuery } from '@entities/work/api/fetchLocation.generated.ts';
import { FetchLocationDocument } from '@entities/work/api/fetchLocation.generated.ts';

/**
 * Описание модели локации
 * @property provider — название провайдера
 * @property branch — название филиала
 * @property city — город
 * @property street — улица
 */
export interface Location {
  provider: string;
  branch: string;
  city: string;
  street: string;
}

/**
 * Состояние стора локации
 * @property location — текущая локация или null, если не загружена
 * @property load — асинхронная функция загрузки локации
 */
interface LocationState {
  location: Location | null;
  load: () => Promise<void>;
}

/**
 * Zustand‑стор для хранения и загрузки локации
 */
export const locationStore = create<LocationState>((set) => ({
  /** Начальное состояние: локация не загружена */
  location: null,

  /**
   * Загружает первую запись из массива locations через GraphQL‑клиент
   */
  async load() {
    const response = await graphqlClient.request<FetchLocationQuery>(FetchLocationDocument, {});
    /** Сохраняем первую запись или null, если массив пуст */
    set({ location: response.locations?.[0] ?? null });
  },
}));
