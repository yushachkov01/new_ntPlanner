/**
 * То что мы получаем из Hasura — snake_case:
 */
export interface WorkDto {
  idInt: number
  date: string
  project: string
  site: string
  description: string
  time_range: string
  status: string
  ppr_hours: number
  work_hours: number
  overtime_hours: number
}

/**
 *  Внутренняя «domain» модель — camelCase:
 */
export interface Work {
  id: string
  date: string
  project: string
  site: string
  description: string
  timeRange: string
  status: string
  pprHours: number
  workHours: number
  overtimeHours: number
}
