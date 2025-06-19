import type { Dayjs } from 'dayjs';

export type TabKey = 'all' | 'plan' | 'archive';

export interface DashboardState {
  activeTab: TabKey;
  dateRange: [Dayjs, Dayjs] | null;
  dateFilterVisible: boolean;
  colsVisible: boolean;
  visibleCols: string[];
}

export const ALL_COLUMNS = [
  { key: 'id', label: '#' },
  { key: 'date', label: 'Дата' },
  { key: 'project', label: 'Проект' },
  { key: 'site', label: 'Площадка' },
  { key: 'description', label: 'Описание' },
  { key: 'timeRange', label: 'Время проведения работ' },
  { key: 'status', label: 'Текущий статус' },
  { key: 'actions', label: 'Действия' },
] as const;
