import { useDroppable } from '@dnd-kit/core';
import type { FC } from 'react';
import React from 'react';

import FrameWithBlocks from '@features/ppr/ui/FrameWithBlocks/FrameWithBlocks';
import type { Props } from '@features/ppr/ui/PprRow/PprRow';

/**
 * Компонент строки «Все Задачи» на общем таймлайне.
 * Делит строку на вертикальные «полки» по числу уникальных tplIdx,
 * собирает все пары (execId, tplIdx) и рендерит для каждой FrameWithBlocks.
 */
const AllTasksRow: FC<Props> = ({
  rowsState,
  hourLabels,
  spanMin,
  startMin,
  coverageMap,
  openBlockId,
  setOpenBlockId,
  onBlockClick,
  setExpandedUsers,
  isExpandedUsers,
  setShowingAll,
}) => {
  const { setNodeRef } = useDroppable({ id: 0 });

  /** все блоки из всех исполнителей */
  const allBlocks = rowsState.flatMap((r) => r.blocks ?? []);
  const frames = rowsState
    .filter((r) => r.blocks?.length)
    .flatMap((r) => {
      const tplIds = Array.from(new Set(r.blocks!.map((b) => b.tplIdx)));
      return tplIds.map((tplIdx) => ({ execId: r.id, tplIdx }));
    });

  /** Количество полок */
  const rowParts = frames.length || 1;

  return (
    <div ref={setNodeRef} className="timeline-row">
      <div className="timeline-row__icon-cell">
        <div
          className="avatar-combined"
          onClick={() => {
            setExpandedUsers((prev) => !prev);
            setOpenBlockId(null);
          }}
        >
          {rowsState
            .filter((r) => r.blocks?.length)
            .slice(0, 2)
            .map((ex, i) => (
              <div
                key={ex.id}
                className="avatar-combined__circle"
                style={{ left: `${i * 0.75}rem` }}
              >
                <span className="avatar-icon">👤</span>
              </div>
            ))}
          {rowsState.filter((r) => r.blocks?.length).length > 2 && (
            <div
              className="avatar-combined__circle avatar-combined__more"
              style={{ left: '1.5rem' }}
            >
              +{rowsState.filter((r) => r.blocks?.length).length - 2}
            </div>
          )}
        </div>
      </div>
      <div className="timeline-row__label-cell">
        <span
          className="timeline-row__day-label"
          onClick={() => {
            setShowingAll((p) => !p);
            setExpandedUsers(false);
            setOpenBlockId(null);
          }}
        >
          Все
          <br />
          Задачи
        </span>
      </div>
      <div
        className="timeline-row__blocks"
        style={{ gridTemplateColumns: `repeat(${hourLabels.length},1fr)` }}
      >
        {hourLabels.map((_, i) => (
          <div key={i} className="timeline-row__grid-cell" />
        ))}

        {frames.map((frame, laneIdx) => (
          <FrameWithBlocks
            key={`${frame.execId}-${frame.tplIdx}-${laneIdx}`}
            execId={frame.execId}
            tplIdx={frame.tplIdx}
            laneIdx={laneIdx}
            allBlocks={allBlocks}
            rowsState={rowsState}
            spanMin={spanMin}
            startMin={startMin}
            coverageMap={coverageMap}
            openBlockId={openBlockId}
            setOpenBlockId={setOpenBlockId}
            onBlockClick={onBlockClick}
            rowParts={rowParts}
          />
        ))}
      </div>
    </div>
  );
};

export default AllTasksRow;
