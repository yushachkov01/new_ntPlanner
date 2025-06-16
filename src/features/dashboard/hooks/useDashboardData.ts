import dayjs from 'dayjs';
import { useState, useMemo } from 'react';
import { useLazyLoadQuery } from 'react-relay';

import type { DashboardPageQuery } from '@/__generated__/DashboardPageQuery.graphql';
import type { RowWithStep } from '@widgets/WorkTable';

import { DASHBOARD_QUERY } from '../api/queries';
import type { TabKey, DashboardState, UseDashboardResult } from '../types';
import { ALL_COLUMNS } from '../types';

export function useDashboardData(): UseDashboardResult {
  const data = useLazyLoadQuery<DashboardPageQuery>(DASHBOARD_QUERY, {});
  /**
   * Преобразуем данные
   */
  const works = data.works;
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

  // Локальный UI-стейт
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

  // Обработчики
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
