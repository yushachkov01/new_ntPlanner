/**
 * Блок на таймлайне: рассчитывает позицию, обрабатывает клики и popover
 */
import type { FC, CSSProperties } from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';

import './TimelineBlock.css';
import { parseTimeToMinutes } from '@/shared/ui/time/toTime';
import { getStatusClass } from '@features/ppr/lib/getStatusClass';
import type { TimelineBlockProps } from '@features/ppr/model/types';

/**
 *  пропсы для TimelineBlock.
 */
export interface TimelineBlockExProps extends TimelineBlockProps {
  /** Количество «полок» в ряду */
  laneParts: number;
  /** Индекс текущей «полки» */
  laneIndex: number;
  /** Рисовать ли внутри мини-этапы */
  showStages?: boolean;
}

/**
 * Компонент блока задачи на таймлайне.
 * Вычисляет своё положение/ширину по времени,
 * показывает внутренние этапы.
 * @param {TimelineBlockExProps} props - Пропсы компонента
 */

const TimelineBlock: FC<TimelineBlockExProps> = ({
  block,
  totalWindowMin,
  windowStartMin,
  expandedBlockId,
  setExpandedBlockId,
  onDoubleClickBlock,
  isCovered,
  showStages = false,
  laneParts,
  laneIndex,
}) => {
  /**
   * Состояние видимости popover
   */
  const [showPopover, setShowPopover] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /**
   * При показе popover, свернуть детальную карточку
   */
  const handleClick = useCallback(() => {
    setShowPopover((prev) => !prev);
    if (expandedBlockId) setExpandedBlockId(null);
  }, [expandedBlockId, setExpandedBlockId]);

  /**
   * Двойной клик — popover прячется, разворачивается детальная панель
   */
  const handleDoubleClick = useCallback(() => {
    setShowPopover(false);
    setExpandedBlockId(block.id);
    onDoubleClickBlock(block.id);
  }, [block.id, onDoubleClickBlock, setExpandedBlockId]);

  /**
   * Закрываем popover, если открыт блок с другим id
   */
  useEffect(() => {
    if (expandedBlockId !== block.id) setShowPopover(false);
  }, [expandedBlockId, block.id]);

  /** абсолютные минуты начала/конца */
  let absStart = parseTimeToMinutes(block.startTime);
  let absEnd = parseTimeToMinutes(block.endTime);

  /** учёт перехода через полночь */
  if (absEnd <= absStart) absEnd += 1440;
  if (totalWindowMin >= 1440) {
    if (absStart < windowStartMin) absStart += 1440;
    if (absEnd < windowStartMin) absEnd += 1440;
  }
  const relStart = absStart - windowStartMin;
  const relEnd = absEnd - windowStartMin;

  /** если блок вне видимой области — не рендерим */
  if (relEnd <= 0 || relStart >= totalWindowMin) return null;

  const leftPercent = (Math.max(0, relStart) / totalWindowMin) * 100;
  const widthPercent =
    ((Math.min(totalWindowMin, relEnd) - Math.max(0, relStart)) / totalWindowMin) * 100;

  /** положение по вертикали */
  const laneH = 100 / laneParts;
  const innerH = laneH * 0.7;
  const paddingTop = laneH * 0.15;
  const topPct = laneH * laneIndex + paddingTop;

  const style: CSSProperties = {
    left: `${leftPercent}%`,
    width: `${widthPercent}%`,
    top: `${topPct}%`,
    height: `${innerH}%`,
  };

  /** генерируем массив мини-этапов */
  const stages = showStages
    ? block.stageKeys.map((key) => {
        const fld = (block.stagesField?.[key] as any) || {};
        return {
          key,
          timer: fld.timer_default ?? 0,
          engineer: (fld.engineer ?? '').trim(),
        };
      })
    : [];

  const totalStageMin = stages.reduce((sum, st) => sum + st.timer, 0) || 1;

  /** итоговый класс по статусу и покрытию */
  const className = [
    'timeline-block',
    getStatusClass(block.status ?? 'info'),
    expandedBlockId === block.id && 'timeline-block--active',
    isCovered && 'timeline-block--covered',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={ref}
      className={className}
      style={style}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {!showStages && <div className="timeline-block__hover-text">{absEnd - absStart} мин</div>}

      {showStages && (
        <div className="timeline-block__stages">
          {stages.map((st, i) => (
            <div
              key={i}
              title={st.key}
              className={
                'timeline-block__stage' +
                (st.engineer === 'Инженер СМР'
                  ? ' timeline-block__stage--highlight'
                  : st.engineer === 'Представитель Заказчика'
                    ? ' timeline-block__stage--pz-highlight'
                    : '')
              }
              style={{ width: `${(st.timer / totalStageMin) * 100}%` }}
            />
          ))}
        </div>
      )}

      {showPopover && (
        <div className="timeline-block__popover">
          <div className="popover-arrow" />
          <div className="popover-content">
            <div className="popover-title">“{block.label}”</div>
            <div className="popover-time">
              {block.startTime}–{block.endTime}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineBlock;
