import type { FC } from 'react';

import AllTasksRow from '@features/ppr/ui/AllTasksRow/AllTasksRow';
import SingleExecutorRow from '@features/ppr/ui/SingleExecutorRow/SingleExecutorRow';

/**
 * Тип исполнителя (или агрегатора «Все Задачи»).
 */
interface Executor {
  id: number;
  author: string;
  role: string;
  blocks?: any[];
}

/**
 * Общие пропсы для PprRow и дочерних компонентов.
 */
export interface Props {
  row: Executor;
  rowsState: Executor[];
  hourLabels: number[];
  spanMin: number;
  startMin: number;
  coverageMap: Record<number, boolean>;
  openBlockId: number | null;
  setOpenBlockId(id: number | null): void;
  onBlockClick(tplIdx: number): void;
  setExpandedUsers(v: boolean): void;
  isExpandedUsers: boolean;
  setShowingAll(v: boolean): void;
}
/**
 * Компонент PprRow выбирает между отображением строки одного исполнителя
 * и агрегированной строкой «Все Задачи».
 *
 * @param {Props} props - Пропсы компонента.
 * @returns {JSX.Element} Компонент строки таймлайна.
 */
const PprRow: FC<Props> = (props) => {
  const { row, rowsState } = props;

  if (!row || typeof row.id !== 'number') {
    return null;
  }

  const isRowsStateArray = Array.isArray(rowsState);
  const safeRowsState: Executor[] = isRowsStateArray ? rowsState : [];
  if (row.id === 0) {
    return <AllTasksRow {...props} rowsState={safeRowsState} />;
  }
  return <SingleExecutorRow {...props} rowsState={safeRowsState} />;
};

export default PprRow;
