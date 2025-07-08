/**
 * API-обёртка вокруг planned_tasks
 */
import { graphqlClient } from '@/shared/lib/graphql/client.ts';
import type { FetchPlannedTasksQuery } from '@entities/work/api/fetchPlannedTasks.generated.ts';
import { FetchPlannedTasksDocument } from '@entities/work/api/fetchPlannedTasks.generated.ts';

/** Загружает все planned_tasks */
export async function fetchPlannedTasks() {
  const { planned_tasks } = await graphqlClient.request<FetchPlannedTasksQuery>(
    FetchPlannedTasksDocument,
    {},
  );
  return planned_tasks;
}
