import type { FC } from 'react';
import { useState, useMemo } from 'react';

import TimelineBlock from '@features/ppr/ui/TimelineBlock/TimelineBlock.tsx';
import TaskDetail from '@features/ppr/ui/TaskDetail/TaskDetail.tsx';
import './PprPage.css';
import { users } from '@features/ppr/data/users.ts';
import { calcCoveredMap } from '@features/ppr/lib/calcCoveredMap.ts';

const PprPage: FC = () => {
  const [expandedUsers, setExpandedUsers] = useState(false);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [expandedBlockId, setExpandedBlockId] = useState<number | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const aggregatedRow = {
    id: 0,
    name: 'Весь день' as const,
    blocks: users.flatMap((u) => u.blocks),
  };
  const rowsData = [aggregatedRow, ...(expandedUsers ? users : [])];

  /* словарь covered */
  const coveredDict = useMemo(() => {
    const dict: Record<number, boolean> = {};
    rowsData.forEach((r) => Object.assign(dict, calcCoveredMap(r.blocks)));
    return dict;
  }, [rowsData]);

  const spanHours = 24;
  const hours = Array.from({ length: spanHours }, (_, i) => i);
  const totalWindowMin = spanHours * 60;

  const getUserNameByBlockId = (blockId: number): string => {
    const u = users.find((user) => user.blocks.some((b) => b.id === blockId));
    return u ? u.name : 'Неизвестен';
  };
  const handleBlockDouble = (id: number) => setExpandedTaskId((prev) => (prev === id ? null : id));

  const taskDetailData = useMemo(() => {
    if (expandedTaskId == null) return null;
    return users.flatMap((u) => u.blocks).find((b) => b.id === expandedTaskId) ?? null;
  }, [expandedTaskId]);

  return (
    <div className="ppr-page">
      <h2 className="ppr-page__title">Таймлайн (00:00–23:00)</h2>

      <div className="timeline-container">
        {/* --- шапка --- */}
        <div className="timeline-header">
          <div className="timeline-header__spacer" />
          <div className="timeline-header__label-spacer" />
          {hours.map((h) => (
            <div key={h} className="timeline-header__hour">
              {String(h).padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {/* --- тело --- */}
        <div className="timeline-body">
          {rowsData.map((row) => (
            <div key={row.id} className="timeline-row">
              {/* --- иконки, подпись --- */}
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
                      /**
                       * клик по пользователю — показываем/скрываем его задачи внизу
                       */
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

              {/* --- блоки --- */}
              <div className="timeline-row__blocks">
                {hours.map((_, i) => (
                  <div key={i} className="timeline-row__grid-cell" />
                ))}
                {row.blocks.map((block) => (
                  <TimelineBlock
                    block={block}
                    totalWindowMin={totalWindowMin}
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

      {/* список всех задач */}
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
