export interface Work {
  readonly id: number;
  readonly date: string;
  readonly project: string;
  readonly site: string;
  readonly description: string;
  readonly time_range: string;
  status: 'pending' | 'in_progress' | 'done';
  readonly ppr_hours: number;
  readonly work_hours: number;
  readonly overtime_hours: number;
  data: Work[];
  onAction: (id: number) => void;
}