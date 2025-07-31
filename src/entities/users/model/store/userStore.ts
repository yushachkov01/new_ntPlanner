import { create } from 'zustand';

import * as api from '@/entities/users/api/UserApi';

import type { User, Role } from '../mapping/mapping';
import { toDomainUser, toDomainRole } from '../mapping/mapping';

/**
 * Описание состояния пользователей и ролей.
 */
interface UserState {
  /**
   * Список загруженных пользователей
   */
  users: User[];
  /**
   * Список загруженных ролей
   */
  roles: Role[];
  addedExecutors: {
    id: string;
    author: string;
    role: string;
  }[];
  /**
   * Флаг загрузки данных (true, если идёт запрос)
   */
  loading: boolean;
  /**
   * Объект ошибки при неудаче запроса (undefined, если ошибок нет)
   */
  error?: Error;
  /**
   * Загружает users и roles
   * @returns Promise<void>
   */
  load: () => Promise<void>;
  /**
   * Добавляет нового исполнителя, если он ещё не добавлен
   */
  addExecutor: (executor: { id: string; author: string; role: string }) => void;
  /**
   * Удаляет исполнителя по его id
   * @param id — идентификатор исполнителя
   */
  removeExecutor: (id: string) => void;
}

/**
 *  Работа с пользователями и ролями через zustand
 */
export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  roles: [],
  addedExecutors: [],
  loading: false,
  error: undefined,

  /**
   * Асинхронно загружает пользователей и роли
   */
  load: async () => {
    set({ loading: true, error: undefined });
    try {
      const [rawUsers, rawRoles] = await Promise.all([api.fetchUsers(), api.fetchRoles()]);
      set({
        users: rawUsers.map(toDomainUser),
        roles: rawRoles.map(toDomainRole),
        loading: false,
      });
    } catch (e: any) {
      set({ error: e, loading: false });
    }
  },

  /**
   * Добавляет исполнителя в список, если такого ещё нет
   */
  addExecutor: (executor) =>
    set((state) => {
      if (state.addedExecutors.find((e) => e.id === executor.id)) {
        return {};
      }
      return { addedExecutors: [...state.addedExecutors, executor] };
    }),

  /**
   * Удаляет исполнителя по его id
   */
  removeExecutor: (id) =>
    set((state) => ({
      addedExecutors: state.addedExecutors.filter((e) => e.id !== id),
    })),
}));
