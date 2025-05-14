export interface Work {
  readonly id: number;
  readonly date: string;
  readonly project: string;
  readonly site: string;
  readonly description: string;
  readonly timeRange: string;
  status: 'pending' | 'in_progress' | 'done';
  readonly pprHours: number;
  readonly workHours: number;
  readonly overtimeHours: number;
  data: Work[];
  onAction: (id: number) => void;
}
