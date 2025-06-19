import { useState, useMemo } from 'react';

import { calcCoveredMap } from '@features/ppr/lib/calcCoveredMap.ts';

import type { UserData } from './types.ts';
import { users } from '../data/users.ts';

export function usePprData() {
  const [expandedUsers, setExpandedUsers] = useState(false);
  const [expandedBlockId, setExpandedBlockId] = useState<number | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showAllTasks, setShowAllTasks] = useState(false);

  const rows = useMemo<UserData[]>(() => {
    const agg: UserData = {
      id: 0,
      name: 'Весь день',
      blocks: users.flatMap((u) => u.blocks),
    };
    return [agg, ...(expandedUsers ? users : [])];
  }, [expandedUsers]);

  const covered = useMemo(() => {
    return rows.reduce((acc, r) => ({ ...acc, ...calcCoveredMap(r.blocks) }), {});
  }, [rows]);

  return {
    rows,
    covered,
    expandedUsers,
    setExpandedUsers,
    expandedBlockId,
    setExpandedBlockId,
    expandedTaskId,
    setExpandedTaskId,
    selectedUserId,
    setSelectedUserId,
    showAllTasks,
    setShowAllTasks,
  };
}
