/**
 * executorStore — хранилище для списка ролей и исполнителей.
 */
import { create } from 'zustand';

import * as api from '@/entities/executor/api/ExecutorApi';

/**
 * тип исполнителя
 */
export interface Executor {
  id: number;
  author: string; // Фио
  role: string;
}
/**
 * описание состояния
 */
interface ExecutorState {
  roles: string[];
  executors: Record<string, Executor[]>; // «роль → список»
  loadRoles: () => Promise<void>;
  loadByRole: (role: string) => Promise<void>;
}

export const executorStore = create<ExecutorState>((set, get) => ({
  roles: [],
  executors: {},

  /**
   * Загружаем все доступные роли;
   */
  async loadRoles() {
    if (get().roles.length) return;
    const roles = await api.fetchRoles();
    set({ roles });
    if (roles[0]) await get().loadByRole(roles[0]);
  },

  /**
   *  Ленивая подгрузка исполнителей выбранной роли
   */
  async loadByRole(role) {
    if (get().executors[role]) return;
    const list = await api.fetchByRole(role);
    set((state) => ({
      executors: { ...state.executors, [role]: list },
    }));
  },
}));
