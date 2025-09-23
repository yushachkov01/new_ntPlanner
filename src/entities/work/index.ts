export * from './api/WorkApi';
export * from '@entities/work/model/store/WorkStore';
import { graphqlClient } from '@/shared/lib/graphql/client';
import { getSdk } from '@entities/work/api/plannedTasks.generated';

export const workApi = getSdk(graphqlClient);

export const { plannedTaskByPk, namesLike, updatePlannedTask, insertPlannedTaskOne } = workApi;
