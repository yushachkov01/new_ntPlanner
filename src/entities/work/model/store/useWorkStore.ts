import { create } from 'zustand';

import * as api from '../../api/WorkApi.ts';
import type { WorkDto, Work } from '../work.types.ts';

type Store = {
  works: Work[];

  /**
   * Загрузить все записи
   */
  load: () => Promise<void>;

  /**
   * Создать новую запись
   */
  insert: (input: Omit<WorkDto, 'idInt'>) => Promise<void>;

  /**
   *  Отправить обновление на сервер
   */
  patch: (idInt: number, setFields: Partial<Omit<WorkDto, 'idInt'>>) => Promise<void>;

  /**
   * Вставить/заменить запись
   */
  add: (dto: WorkDto) => void;

  /**
   *   Обновить запись
   */
  update: (dto: WorkDto) => void;

  /**
   *  Удалить запись на сервере
   */
  remove: (idInt: number) => Promise<void>;
};

export const useWorkStore = create<Store>((set, get) => ({
  works: [],

  load: async () => {
    const dtos = await api.fetchWorks();
    const works: Work[] = dtos.map((d) => ({
      id: String(d.idInt),
      date: d.date,
      project: d.project,
      site: d.site,
      description: d.description,
      timeRange: d.time_range,
      status: d.status,
      pprHours: d.ppr_hours,
      workHours: d.work_hours,
      overtimeHours: d.overtime_hours,
    }));
    set({ works });
  },

  insert: async (input) => {
    const idInt = await api.insertWork(input);
    get().add({ ...input, idInt });
  },

  patch: async (idInt, setFields) => {
    await api.updateWork(idInt, setFields);
  },

  add: (dto) => {
    const w: Work = {
      id: String(dto.idInt),
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
    set((s) => ({
      works: [w, ...s.works.filter((x) => x.id !== w.id)],
    }));
  },

  update: (dto) => {
    set((s) => ({
      works: s.works.map((w) =>
        w.id === String(dto.idInt)
          ? {
              ...w,
              date: dto.date,
              project: dto.project,
              site: dto.site,
              description: dto.description,
              timeRange: dto.time_range,
              status: dto.status,
              pprHours: dto.ppr_hours,
              workHours: dto.work_hours,
              overtimeHours: dto.overtime_hours,
            }
          : w,
      ),
    }));
  },

  remove: async (idInt) => {
    await api.deleteWork({ idInt: { _eq: idInt } });
    /**
     * сразу перезагружаем все записи, чтобы в сторе стало актуально
     */
    await get().load();
  },
}));
