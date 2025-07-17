import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

import type { RowWithStep } from '@/widgets/WorkTable';
import { workStore } from '@entities/work/model/store/WorkStore.ts';

import type { TabKey, DashboardState } from './types.ts';
import { ALL_COLUMNS } from './types.ts';

export function dashboardData() {
  const works = workStore((s) => s.works);
  const loading = workStore((s) => s.loading);

  /**
   * Преобразуем данные
   */
  const rows: RowWithStep[] = works.map((w) => ({
    ...w,
    plan: w.pprHours + w.workHours + w.overtimeHours,
    ppr: w.pprHours,
    request: 1,
    work: w.workHours,
    step: w.status === 'in_progress' ? 2 : 0,
  }));

  const today = dayjs().format('YYYY-MM-DD');
  const planRows = rows.filter((r) => r.date >= today);
  const archRows = rows.filter((r) => r.date < today);
  const allRows = [...planRows, ...archRows];

  const [state, setState] = useState<DashboardState>({
    activeTab: 'all',
    dateRange: null,
    dateFilterVisible: false,
    colsVisible: false,
    visibleCols: ALL_COLUMNS.map((c) => c.key),
  });

  const displayRows = useMemo(() => {
    let arr =
      state.activeTab === 'plan' ? planRows : state.activeTab === 'archive' ? archRows : allRows;

    if (state.dateRange) {
      const [from, to] = state.dateRange;
      const f = from.format('YYYY-MM-DD');
      const t = to.format('YYYY-MM-DD');
      arr = arr.filter((r) => r.date >= f && r.date <= t);
    }
    return arr;
  }, [allRows, planRows, archRows, state]);

  const setActiveTab = (tab: TabKey) =>
    setState((s) => ({
      ...s,
      activeTab: tab,
      dateFilterVisible: false,
      colsVisible: false,
    }));
  const setDateRange = (dr: DashboardState['dateRange']) =>
    setState((s) => ({ ...s, dateRange: dr }));
  const toggleDateFilterVisible = (v: boolean) => setState((s) => ({ ...s, dateFilterVisible: v }));
  const toggleColsVisible = (v: boolean) => setState((s) => ({ ...s, colsVisible: v }));
  const setVisibleCols = (key: string) =>
    setState((s) => ({
      ...s,
      visibleCols: s.visibleCols.includes(key)
        ? s.visibleCols.filter((k) => k !== key)
        : [...s.visibleCols, key],
    }));

  return {
    displayRows,
    loading,
    state,
    handlers: {
      setActiveTab,
      setDateRange,
      toggleDateFilterVisible,
      toggleColsVisible,
      setVisibleCols,
    },
  };
}
