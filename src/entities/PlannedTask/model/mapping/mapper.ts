import type { FetchPlannedTasksQuery } from '@/entities/work/api/fetchPlannedTasks.generated';
import type { FetchRmProjectsQuery } from '@/entities/work/api/fetchRmProjects.generated';
import type { FetchRmTasksQuery } from '@/entities/work/api/fetchRmTasks.generated';
import type { FetchTimeWorksQuery } from '@/entities/work/api/fetchTimeWorks.generated';

/** Сырые данные задачи из public7_planned_tasks (snake_case) */
export type RawTask = FetchPlannedTasksQuery['public7_planned_tasks'][number];

/** Сырые данные интервала из public7_time_works (snake_case) */
export type RawTimeWork = FetchTimeWorksQuery['public7_time_works'][number];

/** Сырые данные проекта из public7_rm_projects (snake_case) */
export type RawProject = FetchRmProjectsQuery['public7_rm_projects'][number];

/** Сырые данные Redmine-задачи из public7_rm_tasks (snake_case) */
export type RawRmTask = FetchRmTasksQuery['public7_rm_tasks'][number];

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

/** Тип для input-объекта вставки / обновления задачи */
export type RawTaskInput = Omit<RawTask, 'id'>;

/** domain → raw для PlannedTask */
export function toRawTask(t: PlannedTask): RawTaskInput {
  return {
    name: t.name,
    description: t.description,
    rm_task_id: t.rmTaskId,
    yaml_url: t.yamlUrl,
    time_work_id: t.timeWorkId,
    author_id: t.authorId,
  };
}
