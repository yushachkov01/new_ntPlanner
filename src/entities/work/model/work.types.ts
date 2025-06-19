/**
 *  Внутренняя «domain» модель — camelCase:
 */
export interface Work {
  id: string;
  date: string;
  project: string;
  site: string;
  description: string;
  timeRange: string;
  status: string;
  pprHours: number;
  workHours: number;
  overtimeHours: number;
}
