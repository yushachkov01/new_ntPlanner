/**
 * Определяем и экспортируем useWorkStore, который держит в себе состояние списка работ (works)
 */
import { create } from 'zustand';

import * as api from '../api/workApi';
import type { WorkDto, Work } from '../model/work.types';

/**
 * Типизация стора
 */
type Store = {
  works: Work[];
  loading: boolean;
  error: string | null;
  // actions:
  /**
   * actions:
   */
  load: () => Promise<void>;
  add: (dto: WorkDto) => void;
  update: (dto: Partial<WorkDto> & { id: number }) => void;
  insert: (input: Omit<WorkDto, 'id'>) => Promise<void>;
  patch: (id: number, set: Partial<Omit<WorkDto, 'id'>>) => Promise<void>;
};

/**
 * Создание стора
 */
export const useWorkStore = create<Store>((set, get) => ({
  works: [],
  loading: false,
  error: null,

  /**
   * initial fetch
   */
  load: async () => {
    set({ loading: true, error: null });
    try {
      const dtos = await api.fetchWorks();
      const works: Work[] = dtos.map((dto) => ({
        id: dto.id.toString(),
        date: dto.date,
        project: dto.project,
        site: dto.site,
        description: dto.description,
        timeRange: dto.time_range,
        status: dto.status,
        pprHours: dto.ppr_hours,
        workHours: dto.work_hours,
        overtimeHours: dto.overtime_hours,
      }));
      set({ works, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  /**
   * 2) push from WS (new record)
   * @param dto
   */
  add: (dto) => {
    const w: Work = {
      id: dto.id.toString(),
      date: dto.date,
      project: dto.project,
      site: dto.site,
      description: dto.description,
      timeRange: dto.time_range,
      status: dto.status,
      pprHours: dto.ppr_hours,
      workHours: dto.work_hours,
      overtimeHours: dto.overtime_hours,
    };
    set((state) => ({
      works: [w, ...state.works.filter((x) => x.id !== w.id)],
    }));
  },

  /**
   * push from WS (patch)
   */
  update: ({ id, ...rest }) => {
    set((state) => ({
      works: state.works.map((w) =>
        w.id === String(id)
          ? {
              ...w,
              date: rest.date ?? w.date,
              project: rest.project ?? w.project,
              site: rest.site ?? w.site,
              description: rest.description ?? w.description,
              timeRange: rest.time_range ?? w.timeRange,
              status: rest.status ?? w.status,
              pprHours: rest.ppr_hours ?? w.pprHours,
              workHours: rest.work_hours ?? w.workHours,
              overtimeHours: rest.overtime_hours ?? w.overtimeHours,
            }
          : w,
      ),
    }));
  },

  insert: async (input) => {
    await api.insertWork(input);
  },

  /**
   * update`
   */
  patch: async (id, setFields) => {
    await api.updateWork(id, setFields);
  },
}));
