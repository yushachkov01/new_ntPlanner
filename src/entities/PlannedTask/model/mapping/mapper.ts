import type { FetchPlannedTasksQuery } from '@/entities/work/api/fetchPlannedTasks.generated';
import type { FetchRmProjectsQuery } from '@/entities/work/api/fetchRmProjects.generated';
import type { FetchRmTasksQuery } from '@/entities/work/api/fetchRmTasks.generated';
import type { FetchTimeWorksQuery } from '@/entities/work/api/fetchTimeWorks.generated';
import type {
  Public7_Planned_Tasks_Insert_Input,
  Public7_Planned_Tasks_Set_Input,
} from '@/shared/api/graphql';
import type { FetchDevicesQuery } from '@entities/work/api/fetchDevices.generated';

/** Сырые данные задачи из public7_planned_tasks (snake_case) */
export type RawTask = FetchPlannedTasksQuery['public7_planned_tasks'][number];

/** Сырые данные интервала из public7_time_works (snake_case) */
export type RawTimeWork = FetchTimeWorksQuery['public7_time_works'][number];

/** Сырые данные проекта из public7_rm_projects (snake_case) */
export type RawProject = FetchRmProjectsQuery['public7_rm_projects'][number];

/** Сырые данные Redmine-задачи из public7_rm_tasks (snake_case) */
export type RawRmTask = FetchRmTasksQuery['public7_rm_tasks'][number];

/** Сырые данные Redmine-задачи из public7_devices (snake_case) */
export type RawDevice = FetchDevicesQuery['public7_devices'][number];

/** Доменная модель задачи (camelCase) */
export interface PlannedTask {
  id: string;
  name: string;
  description: string;
  rmTaskId: string;
  yamlUrl: string;
  timeWorkId: string;
  authorId: string;
}

/** Доменная модель интервала времени (camelCase + Date) */
export interface TimeWork {
  id: string;
  startAt: Date;
  endAt: Date;
}

/** Доменная модель проекта (camelCase) */
export interface Project {
  id: string;
  extId: number;
  name: string;
}

/** Доменная модель Redmine-задачи (camelCase) */
export interface RmTask {
  id: string;
  extId: number;
  name: string;
  status: string;
  projectId: string;
}
/** Доменная модель Device (camelCase) */
export interface Device {
  id: string;
  hostname: string;
  nodeId: string;
  roleId: string;
  modelId: string;
}

/** helpers  */
export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Проверяет, что значение является валидным UUID.
 * @param value строка или null
 * @returns строка UUID или undefined
 */
const asUuid = (value?: string | null): string | undefined =>
  typeof value === 'string' && UUID_RE.test(value) ? value : undefined;

/**
 * Очищает строку от пробелов и пустых значений.
 * @param rawValue строка или null
 * @returns строка без пробелов или undefined, если пусто
 */
const clean = (rawValue?: string | null): string | undefined => {
  if (rawValue == null) return undefined;
  const trimmedValue = String(rawValue).trim();
  return trimmedValue.length ? trimmedValue : undefined;
};

/** raw → domain для PlannedTask */
export function toDomainTask(r: RawTask): PlannedTask {
  return {
    id: r.id,
    name: r.name,
    description: r.description ?? '',
    rmTaskId: r.rm_task_id,
    yamlUrl: r.yaml_url ?? '',
    timeWorkId: r.time_work_id,
    authorId: r.author_id,
  };
}

/** raw → domain для TimeWork */
export function toDomainTimeWork(r: RawTimeWork): TimeWork {
  return {
    id: r.id,
    startAt: new Date(r.start_at),
    endAt: new Date(r.end_at),
  };
}

/** raw → domain для Project */
export function toDomainProject(r: RawProject): Project {
  return {
    id: r.id,
    extId: r.ext_id,
    name: r.name,
  };
}

/** raw → domain для RmTask */
export function toDomainRmTask(r: RawRmTask): RmTask {
  return {
    id: r.id,
    extId: r.ext_id,
    name: r.name,
    status: r.status,
    projectId: r.project_id,
  };
}

export function toDomainDevice(r: RawDevice): Device {
  return {
    id: r.id,
    hostname: r.hostname,
    nodeId: r.node_id,
    roleId: r.role_id,
    modelId: r.model_id,
  };
}

/** domain → raw (GraphQL inputs)
 *   Используем именно сгенерированные типы Hasura:
 *     - Public7_Planned_Tasks_Insert_Input
 *     - Public7_Planned_Tasks_Set_Input
 *  Это убирает расхождения между типами выборки (query) и типами записи (insert/update).
 */

/** Полный объект для INSERT (все поля опциональные)*/
export function toRawTaskInsert(plannedTask: PlannedTask): Public7_Planned_Tasks_Insert_Input {
  return {
    name: clean(plannedTask.name),
    description: clean(plannedTask.description),
    rm_task_id: asUuid(plannedTask.rmTaskId),
    yaml_url: clean(plannedTask.yamlUrl),
    time_work_id: asUuid(plannedTask.timeWorkId),
    author_id: asUuid(plannedTask.authorId),
  };
}

export function toRawTaskSet(partialTask: Partial<PlannedTask>): Public7_Planned_Tasks_Set_Input {
  return {
    name: partialTask.name !== undefined ? clean(partialTask.name) : undefined,
    description: partialTask.description !== undefined ? clean(partialTask.description) : undefined,
    rm_task_id: partialTask.rmTaskId !== undefined ? asUuid(partialTask.rmTaskId) : undefined,
    yaml_url: partialTask.yamlUrl !== undefined ? clean(partialTask.yamlUrl) : undefined,
    time_work_id: partialTask.timeWorkId !== undefined ? asUuid(partialTask.timeWorkId) : undefined,
    author_id: partialTask.authorId !== undefined ? asUuid(partialTask.authorId) : undefined,
  };
}
