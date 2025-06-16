import type { Work } from '@entities/work';

export interface RowWithStep extends Work {
  plan: number;
  ppr: number;
  request: number;
  work: number;
  step: number;
}

export interface PropsWorkTable {
  data: RowWithStep[];
  isArchive?: boolean;
  visibleColumns?: string[];
}
