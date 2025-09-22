import { getSdk as getDeviceSdk } from '@/entities/work/api/fetchDevices.generated';
import { getSdk as getTasksSdk } from '@/entities/work/api/fetchPlannedTasks.generated';
import { getSdk as getProjectsSdk } from '@/entities/work/api/fetchRmProjects.generated';
import { getSdk as getRmTasksSdk } from '@/entities/work/api/fetchRmTasks.generated';
import { getSdk as getTimeWorksSdk } from '@/entities/work/api/fetchTimeWorks.generated';
import { graphqlClient } from '@/shared/lib/graphql/client';
const tasksSdk = getTasksSdk(graphqlClient);
const timeWorksSdk = getTimeWorksSdk(graphqlClient);
const projectsSdk = getProjectsSdk(graphqlClient);
const rmTasksSdk = getRmTasksSdk(graphqlClient);
const deviceSdk = getDeviceSdk(graphqlClient);
/**
 * Читает все запланированные задачи
 * @returns массив сырых записей planned_tasks
 */
export async function fetchPlannedTasks() {
  const { planned_tasks } = await tasksSdk.fetchPlannedTasks();
  return planned_tasks;
}

/**
 * Читает все временные интервалы (TimeWorks) из GraphQL.
 * @returns массив сырых записей time_works
 */
export async function fetchTimeWorks() {
  const { time_works } = await timeWorksSdk.fetchTimeWorks();
  return time_works;
}

/**
 * Читает все проекты Redmine из GraphQL.
 * @returns массив сырых записей rm_projects
 */
export async function fetchRmProjects() {
  const { rm_projects } = await projectsSdk.fetchRmProjects();
  return rm_projects;
}

export async function fetchRmTasks() {
  const { rm_tasks } = await rmTasksSdk.fetchRmTasks();
  return rm_tasks;
}

export async function fetchDevices() {
  const { devices } = await deviceSdk.fetchDevices();
  return devices;
}
