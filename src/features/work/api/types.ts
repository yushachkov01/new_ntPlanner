export interface WorkDto {
  id: number;
  date: string;
  project: string;
  site: string;
  description: string;
  time_range: string;
  status: string;
  ppr_hours: number;
  work_hours: number;
  overtime_hours: number;
}
