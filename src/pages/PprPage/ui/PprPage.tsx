import type { FC } from 'react';
import React, { useState, useMemo } from 'react';

import TaskDetail from '@features/ppr/ui/TaskDetail/TaskDetail';
import TimelineBlock from '@features/ppr/ui/TimelineBlock/TimelineBlock';
import './PprPage.css';
import { calcCoveredMap } from '@features/ppr/lib/calcCoveredMap';

interface WindowInterval {
  start: string;
  end: string;
}
interface Executor {
  id: number;
  author: string;
  role: string;
  blocks?: Array<{
    id: number;
    label: string;
    startTime: string;
    endTime: string;
    status?: string;
    subSteps?: string[];
  }>;
}

interface PprPageProps {
  /** Окно показа таймлайна */
  gridStart?: string;
  gridEnd?: string;
  highlightWindows?: WindowInterval[];
  executors: Executor[];
  /** Ключи шаблонов по порядку (основной + доп.) */
  templateKeys: string[];
  /** колбэк: клик по блоку → передаёт индекс шаблона */
  onBlockClick: (templateIndex: number) => void;
}

/**
 * PprPage — основная страница «Таймлайн»
 * Отвечает за:
 * - Отрисовку шкалы времени 24 часа
 * - Отображение агрегированной строки и списка пользователей
 * - Управление состояниями раскрытия рядов и деталей задач
 */
const PprPage: FC<PprPageProps> = ({
  gridStart = '00:00',
  gridEnd = '23:00',
  highlightWindows = [],
  executors,
  templateKeys,
  onBlockClick,
}) => {
  /** Показывать список пользователей */
  const [expandedUsers, setExpandedUsers] = useState(false);
  /** Отображать все задачи*/
  const [showAllTasks, setShowAllTasks] = useState(false);
  /** ID блока для подсветки и показа popover */
  const [expandedBlockId, setExpandedBlockId] = useState<number | null>(null);
  /** ID задачи для отображения подробного TaskDetail */
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  /** Выбранный пользователь для показа его задач */
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  /** Общее число часов и массив меток часов */
  const toMin = (time: string) => {
    const [hh, mm] = time.split(':').map(Number);
    return hh * 60 + mm;
  };

  /** Начало и конец окна в минутах */
  const windowStartMin = toMin(gridStart);
  let windowEndMin = toMin(gridEnd);

  /** Если конец <= началу — считаем, что конец на следующий день */
  if (windowEndMin <= windowStartMin) {
    windowEndMin += 24 * 60;
  }

  const windowSpanMin = windowEndMin - windowStartMin;

  const hourCount = Math.ceil(windowSpanMin / 60) + 1;
  const hours = Array.from({ length: hourCount }, (_, i) =>
    Math.floor(((windowStartMin + i * 60) % (24 * 60)) / 60),
  );

  /** «блоки» для каждого интервала */
  const windowBlocks = highlightWindows.map((window, index) => ({
    id: -1000 - index, //для теста, чтобы различить с моками
    startTime: window.start,
    endTime: window.end,
    label: templateKeys[index] ?? 'Окно работ',
    status: 'info' as const,
  }));

  const aggregatedRow = {
    id: 0,
    name: 'Весь день' as const,
    blocks: [...windowBlocks, ...executors.flatMap((user) => user.blocks || [])],
  };

  /**
   * Генерирует массив строк для рендеринга (агрегат + пользователи)
   */
  const rowsData = [aggregatedRow, ...(expandedUsers ? executors : [])];

  /**
   * Строит словарь перекрытых блоков { [blockId]: true }
   */
  const coveredDict = useMemo(() => {
    const coveredBlocksMap: Record<number, boolean> = {};
    rowsData.forEach((rows) => {
      const blocks = rows.blocks ?? [];
      Object.assign(
        coveredBlocksMap,
        calcCoveredMap(blocks.filter((coveredBlocksMap) => coveredBlocksMap.id >= 0)),
      );
    });
    return coveredBlocksMap;
  }, [rowsData]);
  /**
   * По blockId получает имя пользователя или "Неизвестен"
   */
  const getUserNameByBlockId = (blockId: number) =>
    executors.find((user) => user.blocks?.some((block) => block.id === blockId))?.author ??
    'Неизвестен';

  /**
   * Переключает выделение блока для подробного просмотра
   */
  const handleBlockDouble = (id: number) => setExpandedTaskId((prev) => (prev === id ? null : id));

  /**
   * Извлекает данные блока для TaskDetail при двойном клике
   */
  const taskDetailData = useMemo(() => {
    if (expandedTaskId == null) return null;
    return executors.flatMap((u) => u.blocks || []).find((b) => b.id === expandedTaskId) ?? null;
  }, [expandedTaskId]);

  return (
    <div className="ppr-page">
      <h2 className="ppr-page__title">
        Таймлайн ({gridStart}–{gridEnd})
      </h2>
      <div className="timeline-container">
        <div
          className="timeline-header"
          style={{ gridTemplateColumns: `4rem 4rem repeat(${hourCount}, 1fr)` }}
        >
          <div className="timeline-header__spacer" />
          <div className="timeline-header__label-spacer" />
          {hours.map((h, idx) => (
            <div key={idx} className="timeline-header__hour">
              {String(h).padStart(2, '0')}:00
            </div>
          ))}
        </div>
        <div className="timeline-body">
          {rowsData.map((row, templateIndex) => (
            <div key={`${row.id}-${templateIndex}`} className="timeline-row">
              <div className="timeline-row__icon-cell">
                {row.id === 0 ? (
                  <div
                    className="avatar-combined"
                    onClick={() => {
                      setExpandedUsers((p) => !p);
                      setShowAllTasks(false);
                      setSelectedUserId(null);
                      setExpandedTaskId(null);
                    }}
                  >
                    {executors.slice(0, 2).map((u, i) => (
                      <div
                        key={u.id}
                        className="avatar-combined__circle"
                        style={{ left: `${i * 0.75}rem` }}
                      >
                        <span className="avatar-icon">👤</span>
                      </div>
                    ))}
                    {executors.length > 2 && (
                      <div
                        className="avatar-combined__circle avatar-combined__more"
                        style={{ left: `1.5rem` }}
                      >
                        +{executors.length - 2}
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="avatar-with-name"
                    onClick={() => {
                      setSelectedUserId((prev) => (prev === row.id ? null : row.id));
                      setShowAllTasks(false);
                      setExpandedTaskId(null);
                    }}
                  >
                    <div className="avatar-single">
                      <span className="avatar-icon">👤</span>
                    </div>
                    <div className="avatar-name">{row.author}</div>
                  </div>
                )}
              </div>
              <div className="timeline-row__label-cell">
                {row.id === 0 && (
                  <span
                    className="timeline-row__day-label"
                    onClick={() => {
                      setShowAllTasks((p) => !p);
                      setExpandedUsers(false);
                      setExpandedTaskId(null);
                    }}
                  >
                    Все
                    <br />
                    Задачи
                  </span>
                )}
              </div>
              <div
                className="timeline-row__blocks"
                style={{ gridTemplateColumns: `repeat(${hourCount},1fr)` }}
              >
                {hours.map((_, i) => (
                  <div key={i} className="timeline-row__grid-cell" />
                ))}
                {(row.blocks ?? []).map((block) => (
                  <TimelineBlock
                    key={block.id}
                    block={block}
                    totalWindowMin={windowSpanMin}
                    windowStartMin={windowStartMin}
                    expandedBlockId={expandedBlockId}
                    setExpandedBlockId={setExpandedBlockId}
                    onDoubleClickBlock={handleBlockDouble}
                    isCovered={!!coveredDict[block.id]}
                    onClick={() => onBlockClick(templateIndex)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {showAllTasks && (
        <div className="all-tasks-container">
          {executors
            .flatMap((u) => u.blocks || [])
            .map((b) => (
              <TaskDetail key={b.id} {...b} onClose={() => {}} />
            ))}
        </div>
      )}
      {selectedUserId != null && (
        <div className="user-tasks-container">
          {executors
            .find((u) => u.id === selectedUserId)!
            .blocks!.map((b) => (
              <TaskDetail key={b.id} {...b} onClose={() => {}} />
            ))}
        </div>
      )}
      {taskDetailData && (
        <TaskDetail
          id={taskDetailData.id}
          label={taskDetailData.label}
          startTime={taskDetailData.startTime}
          endTime={taskDetailData.endTime}
          subSteps={taskDetailData.subSteps}
          onClose={() => setExpandedTaskId(null)}
          performer={`РТК-С, ${getUserNameByBlockId(taskDetailData.id)}`}
          status={taskDetailData.status}
        />
      )}
    </div>
  );
};

export default PprPage;
