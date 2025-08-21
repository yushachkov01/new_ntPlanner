import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { calcCoveredMap } from '@/features/ppr/lib/calcCoveredMap';
import { parseTimeToMinutes } from '@/shared/ui/time/toTime';
import useTimelineStore from '@entities/timeline/model/store/timelineStore';
import type { Executor } from '@entities/timeline/model/store/timelineStore';
import type { User } from '@entities/users/model/mapping/mapping';
import { useUserStore } from '@entities/users/model/store/userStore';

import { useMergeExecutors } from './useMergeExecutors';
import { useSequentialReflow } from './useSequentialReflow';
import { useTimelineDnD } from './useTimelineDnD';

/**
 * Хук-комбайн: вся логика таймлайна (мердж пользователей, dnd).
 * params
 * - gridStart: строка HH:mm
 * - gridEnd: строка HH:mm
 * - executors: входные исполнители
 * - onTimerChange: пробрасывается в детали/строки
 * - onMoveBetweenExecutors: уведомление редактора о переносе между исполнителями
 */
export function usePprTimeline({
  gridStart,
  gridEnd,
  executors,
  onTimerChange,
  onMoveBetweenExecutors,
}: {
  gridStart: string;
  gridEnd: string;
  executors: User[] | any[];
  onTimerChange: (tplIdx: number, stageKey: string, newTimer: number) => void;
  onMoveBetweenExecutors?: (p: {
    templateKey?: string;
    sourceKey?: string;
    sourceRowId: number;
    targetRowId: number;
    sourceEmptyAfter: boolean;
  }) => void;
}) {
  /** Стор таймлайна */
  const rowsStateRaw = useTimelineStore((s) => s.rows);
  const setRowsInStore = useTimelineStore((s) => s.setRows);

  /**
   * Обёртка над setRows, чтобы поддержать setRows(prev => next)
   * и не падать, если стор ещё пустой
   */
  const setRowsState = useCallback(
    (value: any) => {
      if (typeof value === 'function') {
        const currentRows = Array.isArray(useTimelineStore.getState().rows)
          ? useTimelineStore.getState().rows
          : [];
        const nextRows = value(currentRows);
        setRowsInStore(nextRows);
      } else {
        setRowsInStore(value);
      }
    },
    [setRowsInStore],
  );

  /** Синхронизация исполнителей -> строки стора */
  useMergeExecutors(executors, setRowsState);

  /** UI-состояния панели/деталей */
  const [usersExpanded, setUsersExpanded] = useState(false);
  const [showingAllTasks, setShowingAllTasks] = useState(false);
  const [expandedExecutorId, setExpandedExecutorId] = useState<number | null>(null);
  const [activeBlockId, setActiveBlockId] = useState<number | null>(null);

  /** Временное окно */
  const windowStartMin = parseTimeToMinutes(gridStart);
  const rawEndMin = parseTimeToMinutes(gridEnd);
  const windowEndMin = rawEndMin <= windowStartMin ? rawEndMin + 1440 : rawEndMin;
  const windowSpanMin = windowEndMin - windowStartMin;

  /** Разметка часов заголовка */
  const hourLabels = Array.from({ length: Math.ceil(windowSpanMin / 60) + 1 }, (_, index) =>
    Math.floor(((windowStartMin + index * 60) % 1440) / 60),
  );

  /** Контейнер таймлайна (для вычисления ширины в DnD) */
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const [timelineWidthPx, setTimelineWidthPx] = useState(0);
  useLayoutEffect(() => {
    if (timelineContainerRef.current) {
      setTimelineWidthPx(timelineContainerRef.current.getBoundingClientRect().width);
    }
  }, []);

  /** Снапшот строк стора */
  const rowsState = (Array.isArray(rowsStateRaw) ? rowsStateRaw : []) as Executor[];

  /** Показываем только сетевых инженеров */
  const ROLE_NET = 'Сетевой инженер';
  const netRows = useMemo(() => rowsState.filter((r) => (r.role ?? '') === ROLE_NET), [rowsState]);

  /** Все блоки (для «Все задачи») — ТОЛЬКО сетевые */
  const allBlocks = useMemo(() => netRows.flatMap((row) => row.blocks ?? []), [netRows]);
  /** Карта «покрытых» блоков */
  const coverageMap = useMemo(() => calcCoveredMap(allBlocks), [allBlocks]);

  /** DnD: сенсоры и обработчик */
  const { sensors, handleDragEnd } = useTimelineDnD({
    timelineContainerRef,
    windowSpanMin,
    windowStartMin,
    setRowsState,
    onRowsChanged: onMoveBetweenExecutors,
  });

  /** Последовательная раскладка бандлов внутри строки */
  useSequentialReflow(rowsState, setRowsState, windowStartMin);

  /** Данные исполнителей */
  const storedUsers: User[] = useUserStore((s) => s.users);
  const allExecutorsList = useMemo(() => [...storedUsers], [storedUsers]);

  /**
   * Имя владельца блока по id блока
   * params
   * - blockId: id блока
   */
  const findOwnerName = (blockId: number): string =>
    rowsState.find((row) => row.blocks?.some((block) => block.id === blockId))?.author ??
    'Неизвестен';

  /** Что рисуем: «Все Задачи» + нужные строки */
  const rowsToRender: Executor[] = [
    { id: 0, author: 'Все Задачи', role: '', blocks: allBlocks },
    ...(usersExpanded ? netRows : netRows.filter((row) => row.id === expandedExecutorId)),
  ];

  /** Активный блок */
  const activeBlock = allBlocks.find((block) => block.id === activeBlockId) ?? null;
  const rowsForUi = netRows;

  return {
    data: { rowsState, rowsToRender, allBlocks, rowsForUi },
    layout: {
      hourLabels,
      windowSpanMin,
      windowStartMin,
      coverageMap,
      timelineWidthPx,
      timelineContainerRef,
    },
    dnd: { sensors, handleDragEnd },
    ui: {
      activeBlock,
      setActiveBlockId,
      showingAllTasks,
      setShowingAllTasks,
      usersExpanded,
      setUsersExpanded,
      expandedExecutorId,
      setExpandedExecutorId,
    },
    helpers: { findOwnerName, allExecutorsList },
  };
}
