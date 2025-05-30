import type { Status } from '@entities/work/model/types/Status.ts';

export interface Work {
  readonly id: number;
  readonly date: string;
  readonly project: string;
  readonly site: string;
  readonly description: string;
  readonly timeRange: string;
  readonly status: Status;
  readonly pprHours: number;
  readonly workHours: number;
  readonly overtimeHours: number;
  data: Work[];
  onAction: (id: number) => void;
}

export interface WorkState {
  items: Work[];
  loading: boolean;
  error: string | null;
}
