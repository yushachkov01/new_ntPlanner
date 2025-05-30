import type { Work } from '@entities/work';
import WorkTable from '@widgets/WorkTable';

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
