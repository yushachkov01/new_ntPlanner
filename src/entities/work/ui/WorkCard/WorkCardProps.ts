import type { Work } from '@entities/work';

export interface WorkCardProps {
  work: Work;
  onAction: (id: number) => void;
}
