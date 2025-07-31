import { create } from 'zustand';

import * as api from '../../api/PlannedTaskApi';
import type {
  RawTask,
  RawTimeWork,
  RawProject,
  RawRmTask,
  PlannedTask,
  TimeWork,
  Project,
  RmTask,
} from '../mapping/mapper';
import { toDomainTask, toDomainTimeWork, toDomainProject, toDomainRmTask } from '../mapping/mapper';

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
  loading: false,
  error: undefined,

  /**
   * Асинхронно запрашивает
   * Затем преобразует результаты в доменные модели и сохраняет в стор.
   */
  load: async () => {
    set({ loading: true, error: undefined });
    try {
      const [rawTasks, rawTimes, rawProjects, rawRmTasks] = await Promise.all([
        api.fetchPlannedTasks() as Promise<RawTask[]>,
        api.fetchTimeWorks() as Promise<RawTimeWork[]>,
        api.fetchRmProjects() as Promise<RawProject[]>,
        api.fetchRmTasks() as Promise<RawRmTask[]>,
      ]);

      set({
        tasks: rawTasks.map(toDomainTask),
        timeWorks: rawTimes.map(toDomainTimeWork),
        projects: rawProjects.map(toDomainProject),
        rmTasks: rawRmTasks.map(toDomainRmTask),
        loading: false,
      });
    } catch (e: any) {
      console.error('PlannedTaskStore.load error', e);
      set({ error: e, loading: false });
    }
  },
}));
