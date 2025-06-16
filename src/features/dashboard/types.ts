import type { Dayjs } from 'dayjs';

import type { RowWithStep } from '@widgets/WorkTable';

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

export type UseDashboardResult = {
  displayRows: RowWithStep[];
  state: DashboardState;
  handlers: {
    setActiveTab: (tab: TabKey) => void;
    setDateRange: (dr: DashboardState['dateRange']) => void;
    toggleDateFilterVisible: (v: boolean) => void;
    toggleColsVisible: (v: boolean) => void;
    setVisibleCols: (key: string) => void;
  };
};
