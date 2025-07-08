import { create } from 'zustand';

import * as api from '@/entities/user/api/UserApi';
import type { FetchUserQuery } from '@entities/work/api/fetchUser.generated.ts';

type User = NonNullable<FetchUserQuery['users_by_pk']>;

/**
 * UserStore — zustand-хранилище для текущего ( авторизованного пользователя ).
 * - user: хранит данные пользователя (role + author)
 * - load: загружает пользователя
 */
export interface UserStore {
  /** Данные загруженного пользователя или null, если не загружен */
  user: User | null;
  /**
   * Загружает пользователя по первичному ключу
   * @param id — идентификатор пользователя
   */
  load: (id: number) => Promise<void>;
}

/**
 * zustand-стор с дефолтными значениями и экшеном load
 */
export const userStore = create<UserStore>((set) => ({
  user: null,

  /**
   * Асинхронный экшен: запрос к API
   */
  async load(id: number) {
    const record = await api.fetchUser(id);
    if (record) {
      set({ user: record });
    }
  },
}));
