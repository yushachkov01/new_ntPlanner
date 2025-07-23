import { create } from 'zustand';

import type { FetchPlannedTasksQuery } from '@entities/work/api/fetchPlannedTasks.generated.ts';

import * as api from '../../api/PlannedTaskApi';

/**
 *  Берём тип одной строки
 */
type Task = FetchPlannedTasksQuery['planned_tasks'][number];

interface State {
  tasks: Task[];
  load: () => Promise<void>;
}

export const PlannedTaskStore = create<State>((set) => ({
  tasks: [],
  async load() {
    const rows = await api.fetchPlannedTasks();
    set({ tasks: rows });
  },
}));
