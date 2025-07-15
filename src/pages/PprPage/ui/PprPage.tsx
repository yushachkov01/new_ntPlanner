import type { FC } from 'react';
import { useState, useMemo } from 'react';

import TimelineBlock from '@features/ppr/ui/TimelineBlock/TimelineBlock.tsx';
import TaskDetail from '@features/ppr/ui/TaskDetail/TaskDetail.tsx';
import './PprPage.css';
import { users } from '@features/ppr/data/users.ts';
import { calcCoveredMap } from '@features/ppr/lib/calcCoveredMap.ts';
interface WindowInterval {
  start: string;
  end: string;
}

interface PprPageProps {
  /** Окно показа таймлайна */
  gridStart?: string;
  gridEnd?: string;
  highlightWindows?: WindowInterval[];
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
  const windowBlocks = highlightWindows.map((w, i) => ({
    id: -1000 - i, //для теста, чтобы различить с моками
    startTime: w.start,
    endTime: w.end,
    label: 'Окно работ',
    status: 'info' as const,
  }));

  const aggregatedRow = {
    id: 0,
    name: 'Весь день' as const,
    blocks: [...windowBlocks, ...users.flatMap((u) => u.blocks)],
  };

  /**
   * Генерирует массив строк для рендеринга (агрегат + пользователи)
   */
  const rowsData = [aggregatedRow, ...(expandedUsers ? users : [])];

  /**
   * Строит словарь перекрытых блоков { [blockId]: true }
   */
  const coveredDict = useMemo(() => {
    const dict: Record<number, boolean> = {};
    rowsData.forEach((rows) =>
      Object.assign(dict, calcCoveredMap(rows.blocks.filter((block) => block.id >= 0))),
    );
    return dict;
  }, [rowsData]);
  /**
   * По blockId получает имя пользователя или "Неизвестен"
   */
  const getUserNameByBlockId = (blockId: number) => {
    const user = users.find((currentUser) =>
      currentUser.blocks.some((block) => block.id === blockId),
    );
    return user?.name ?? 'Неизвестен';
  };

  /**
   * Переключает выделение блока для подробного просмотра
   */
  const handleBlockDouble = (id: number) => setExpandedTaskId((prev) => (prev === id ? null : id));

  /**
   * Извлекает данные блока для TaskDetail при двойном клике
   */
  const taskDetailData = useMemo(() => {
    if (expandedTaskId == null) return null;
    return users.flatMap((u) => u.blocks).find((b) => b.id === expandedTaskId) ?? null;
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
          {rowsData.map((row) => (
            <div key={row.id} className="timeline-row">
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
                    {users.slice(0, 2).map((u, i) => (
                      <div
                        key={u.id}
                        className="avatar-combined__circle"
                        style={{ left: `${i * 0.75}rem` }}
                      >
                        <span className="avatar-icon">👤</span>
                      </div>
                    ))}
                    {users.length > 2 && (
                      <div
                        className="avatar-combined__circle avatar-combined__more"
                        style={{ left: `1.5rem` }}
                      >
                        +{users.length - 2}
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
                    <div className="avatar-name">{row.name.split(' ')[0]}</div>
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
                style={{ gridTemplateColumns: `repeat(${hourCount}, 1fr)` }}
              >
                {hours.map((_, i) => (
                  <div key={i} className="timeline-row__grid-cell" />
                ))}
                {row.blocks.map((block) => (
                  <TimelineBlock
                    key={block.id}
                    block={block}
                    totalWindowMin={windowSpanMin}
                    windowStartMin={windowStartMin}
                    expandedBlockId={expandedBlockId}
                    setExpandedBlockId={setExpandedBlockId}
                    onDoubleClickBlock={handleBlockDouble}
                    isCovered={!!coveredDict[block.id]}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {showAllTasks && (
        <div className="all-tasks-container">
          {users
            .flatMap((u) => u.blocks)
            .map((b) => (
              <TaskDetail key={b.id} {...b} onClose={() => {}} />
            ))}
        </div>
      )}
      {selectedUserId != null && (
        <div className="user-tasks-container">
          {users
            .find((u) => u.id === selectedUserId)!
            .blocks.map((b) => (
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
