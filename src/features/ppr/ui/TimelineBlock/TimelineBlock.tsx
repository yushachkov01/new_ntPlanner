import type { FC } from 'react';
import { useState, useEffect, useRef } from 'react';

import './TimelineBlock.css';
import { getStatusClass } from '@features/ppr/lib/getStatusClass.ts';
import type { TimelineBlockProps } from '@features/ppr/model/types.ts';

const TimelineBlock: FC<TimelineBlockProps> = ({
  block,
  totalWindowMin,
  expandedBlockId,
  setExpandedBlockId,
  onDoubleClickBlock,
  isCovered,
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const [sH, sM] = block.startTime.split(':').map(Number);
  const [eH, eM] = block.endTime.split(':').map(Number);
  const startMin = sH * 60 + sM;
  const endMin = eH * 60 + eM;

  const leftPercent = (startMin / totalWindowMin) * 100;
  const widthPercent = ((endMin - startMin) / totalWindowMin) * 100;

  /* показать/скрыть popover */
  const handleClick = () => {
    setShowPopover((prev) => {
      const next = !prev;
      setExpandedBlockId(next ? block.id : null);
      return next;
    });
  };

  /* если открыли чужой popover — закрываем свой */
  useEffect(() => {
    if (expandedBlockId !== block.id) setShowPopover(false);
  }, [expandedBlockId, block.id]);

  const handleDoubleClick = () => onDoubleClickBlock(block.id);
  const statusClass = getStatusClass(block.status ?? 'info');
  const isActive = expandedBlockId === block.id;

  const className = [
    'timeline-block',
    statusClass,
    isActive ? 'timeline-block--active' : '',
    isCovered ? 'timeline-block--covered' : '',
  ].join(' ');

  return (
    <div
      ref={ref}
      className={className}
      style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div className="timeline-block__hover-text">{endMin - startMin} мин</div>

      {showPopover && (
        <div className="timeline-block__popover">
          <div className="popover-arrow" />
          <div className="popover-content">
            <div className="popover-title">“{block.label}”</div>
            <div className="popover-time">
              {block.startTime} – {block.endTime}
              {block.status === 'pending_manual' && ' (Ручной, не выполнен)'}
              {block.status === 'pending_auto' && ' (Авто, не выполнен)'}
              {block.status === 'info' && ' (Инфо, не выполнено)'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineBlock;
