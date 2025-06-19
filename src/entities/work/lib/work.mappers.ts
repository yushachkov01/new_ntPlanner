/**
 * DTO-типы из codegen
 */
import type {
  /**
   * fetchWorks()
   */
  Works,
  /**
   * insertWork()
   */
  Works_Insert_Input as Insert,
  /**
   * UpdateWork()
   */
  Works_Set_Input as Patch,
} from '../api/fetchWorks.generated';
import type { Work } from '../model/work.types';

/**
 * GraphQL → Domain
 * Функция преобразует «сырое» DTO из Hasura в чистую модель приложения:
 * - snake_case  → camelCase
 * @returns объект типа Work для UI и стора
 */
export function dtoToDomain(row: Works): Work {
  return {
    id: String(row.idInt),
    date: row.date,
    project: row.project,
    site: row.site,
    description: row.description,
    timeRange: row.time_range,
    status: row.status,
    pprHours: row.ppr_hours,
    workHours: row.work_hours,
    overtimeHours: row.overtime_hours,
  };
}

/**
 * Domain → DTO
 * @param w
 */
export function domainToInsert(w: Omit<Work, 'id'>): Insert {
  return {
    date: w.date,
    project: w.project,
    site: w.site,
    description: w.description,
    time_range: w.timeRange,
    status: w.status,
    ppr_hours: w.pprHours,
    work_hours: w.workHours,
    overtime_hours: w.overtimeHours,
  };
}

/**
 * === Domain → DTO (PATCH) ===
 * Формирует объект для мутации updateWork() из частичного Work:
 * - принимает Partial<Omit<Work,'id'>> с изменёнными полями
 * - копирует только те поля, которые указаны
 * - camelCase → snake_case
 * @param p — объект с изменениями в Work (может содержать несколько полей)
 * @returns объект Patch (Works_Set_Input) для updateWork()
 */
export function domainPatchToDto(p: Partial<Omit<Work, 'id'>>): Patch {
  const dto: Patch = {};
  if (p.date) dto.date = p.date;
  if (p.project) dto.project = p.project;
  if (p.site) dto.site = p.site;
  if (p.description) dto.description = p.description;
  if (p.timeRange) dto.time_range = p.timeRange;
  if (p.status) dto.status = p.status;
  if (p.pprHours != null) dto.ppr_hours = p.pprHours;
  if (p.workHours != null) dto.work_hours = p.workHours;
  if (p.overtimeHours != null) dto.overtime_hours = p.overtimeHours;
  return dto;
}
