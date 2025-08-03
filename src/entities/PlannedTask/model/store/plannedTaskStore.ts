import { create } from 'zustand';

import * as api from '../../api/PlannedTaskApi';
import type {
  RawTask,
  RawTimeWork,
  RawProject,
  RawRmTask,
  RawDevice,
  PlannedTask,
  TimeWork,
  Project,
  RmTask,
  Device,
} from '../mapping/mapper';
import {
  toDomainTask,
  toDomainTimeWork,
  toDomainProject,
  toDomainRmTask,
  toDomainDevice,
} from '../mapping/mapper';

interface State {
  /**
   * Список загруженных планируемых задач
   */
  tasks: PlannedTask[];
  /**
   * Список загруженных временных интервальных настроек
   */
  timeWorks: TimeWork[];
  /**
   * Список загруженных проектов
   */
  projects: Project[];
  /**
   * Список загруженных задач Redmine
   */
  rmTasks: RmTask[];
  /**
   * Список загруженных задач устройств
   */
  device: Device[];
  /**
   * Флаг состояния загрузки
   */
  loading: boolean;
  /**
   * Объект ошибки при неудачном запросе
   */
  error?: Error;
  /**
   * Загружает все ресурсы: задачи, интервалы, проекты и задачи RM
   * @returns Promise<void>
   */
  load: () => Promise<void>;
}

export const usePlannedTaskStore = create<State>((set) => ({
  tasks: [],
  timeWorks: [],
  projects: [],
  rmTasks: [],
  device: [],
  loading: false,
  error: undefined,

  /**
   * Асинхронно запрашивает
   * Затем преобразует результаты в доменные модели и сохраняет в стор.
   */
  load: async () => {
    set({ loading: true, error: undefined });
    try {
      const [rawTasks, rawTimes, rawProjects, rawRmTasks, RawDevice] = await Promise.all([
        api.fetchPlannedTasks() as Promise<RawTask[]>,
        api.fetchTimeWorks() as Promise<RawTimeWork[]>,
        api.fetchRmProjects() as Promise<RawProject[]>,
        api.fetchRmTasks() as Promise<RawRmTask[]>,
        api.fetchDevices() as Promise<RawDevice[]>,
      ]);

      set({
        tasks: rawTasks.map(toDomainTask),
        timeWorks: rawTimes.map(toDomainTimeWork),
        projects: rawProjects.map(toDomainProject),
        rmTasks: rawRmTasks.map(toDomainRmTask),
        device: RawDevice.map(toDomainDevice),
        loading: false,
      });
    } catch (e: any) {
      console.error('PlannedTaskStore.load error', e);
      set({ error: e, loading: false });
    }
  },
}));
