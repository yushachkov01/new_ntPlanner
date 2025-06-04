import type { FC, MouseEvent } from 'react';
import { useState } from 'react';

export interface BlockData {
  id: number;
  startTime: string;
  endTime: string;
  label: string;
}

interface TimelineBlockProps {
  block: BlockData;
  totalWindowMin: number;
  expandedBlockId: number | null;
  setExpandedBlockId: (id: number | null) => void;
  onDoubleClickBlock: (id: number) => void;
}

const TimelineBlock: FC<TimelineBlockProps> = ({
  block,
  totalWindowMin,
  expandedBlockId,
  setExpandedBlockId,
  onDoubleClickBlock,
}) => {
  const [hStart, mStart] = block.startTime.split(':').map(Number);
  const [hEnd, mEnd] = block.endTime.split(':').map(Number);
  const startMin = hStart * 60 + mStart;
  const endMin = hEnd * 60 + mEnd;
  const durationMin = endMin - startMin;
  const leftPerc = (startMin / totalWindowMin) * 100;
  const widthPerc = (durationMin / totalWindowMin) * 100;

  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    expandedBlockId === block.id ? setExpandedBlockId(null) : setExpandedBlockId(block.id);
  };

  const handleDoubleClick = (e: MouseEvent) => {
    e.stopPropagation();
    setExpandedBlockId(block.id);
    onDoubleClickBlock(block.id);
  };

  return (
    <div
      className="timeline-block"
      style={{ left: `${leftPerc}%`, width: `${widthPerc}%` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* при наведении показываем длительность */}
      {isHovered && <span className="timeline-block__hover-text">{durationMin} мин</span>}

      {/* popover (одинарный клик) */}
      {expandedBlockId === block.id && (
        <div className="timeline-block__popover">
          <div className="popover-arrow" />
          <div className="popover-content">
            <div className="popover-title">“{block.label}”</div>
            <div className="popover-time">
              {block.startTime} – {block.endTime}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineBlock;
