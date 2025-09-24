/**
 * Блок на таймлайне: рассчитывает позицию, обрабатывает клики и popover
 */
import { Popover } from 'antd';
import type { FC, CSSProperties } from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';

import './TimelineBlock.css';
import { parseTimeToMinutes, normalizeIntervalToWindow, toPercentInterval } from '@/shared/time';
import { getStatusClass, getContainerRoleClass } from '@/shared/ui/timeline/classNames';
import type { TimelineBlockProps } from '@features/ppr/model/types';
import { TIMELINE_CLASSES } from '@/shared/constants';

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

/** Утилита: переводит time из YAML  */
function toMinutes(val: any): number {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const m = val.match(/(\d+)\s*m/i);
    if (m) return parseInt(m[1], 10);
  }
  return 0;
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
  const [showPopover, setShowPopover] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
  const normalizedInterval = normalizeIntervalToWindow(absStart, absEnd, windowStartMin, totalWindowMin);

  /** если блок вне видимой области — не рендерим */
  if (normalizedInterval.relEnd <= 0 || normalizedInterval.relStart >= totalWindowMin) return null;

  /** проценты позиционирования/ширины */
  const { leftPercent, widthPercent } = toPercentInterval(
      normalizedInterval.relStart,
      normalizedInterval.relEnd,
      totalWindowMin,
  );

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
          timer: (fld.timer_default as number | undefined) ?? toMinutes(fld.time),
          executorType: String(fld.executor ?? '')
            .trim()
            .toLowerCase(),
        };
      })
    : [];

  /** Раскраска блока */
  const containerRoleClass = getContainerRoleClass(stages);

  /** итоговый класс по статусу и покрытию */
  const className = [
    TIMELINE_CLASSES.BASE,
    getStatusClass(block.status ?? 'info'),
    expandedBlockId === block.id && TIMELINE_CLASSES.ACTIVE,
    isCovered && TIMELINE_CLASSES.COVERED,
    containerRoleClass,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Popover
      open={showPopover}
      onOpenChange={(open) => {
        setShowPopover(open);
        if (open && expandedBlockId) setExpandedBlockId(null);
      }}
      trigger="click"
      placement="top"
      getPopupContainer={() => document.body}
      destroyTooltipOnHide
      content={
        <div className="popover-content">
          <div className="popover-title">“{block.label}”</div>
          <div className="popover-time">
            {block.startTime} – {block.endTime}
          </div>
        </div>
      }
    >
    <div ref={ref} className={className} style={style} onDoubleClick={handleDoubleClick}>
      {!showStages && <div className="timeline-block__hover-text">{normalizedInterval.absEnd - normalizedInterval.absStart} мин</div>}

      {showStages && (
        <div className="timeline-block__stages">
          {stages.map((stage, stageIndex) => {
            const type = stage.executorType;

            const stageClass =
              'timeline-block__stage' +
              (type === 'installer'
                ? ' timeline-block__stage--highlight' // оранжевый
                : type === 'auditor'
                  ? ' timeline-block__stage--pz-highlight' // красный
                  : ''); // engineer -> базовый синий

            return (
              <div
                key={stageIndex}
                title={stage.key}
                className={stageClass}
                style={{ width: `${(stage.timer / (stages.reduce((absStart, st) => absStart + (st.timer || 0), 0) || 1)) * 100}%` }}
              />
            );
          })}
        </div>
      )}
    </div>
    </Popover>
  );
};

export default TimelineBlock;
