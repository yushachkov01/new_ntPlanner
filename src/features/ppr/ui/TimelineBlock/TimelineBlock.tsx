/**
 * Блок на таймлайне: рассчитывает позицию, обрабатывает клики и popover
 */
import { Popover } from 'antd';
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
          timer: (fld.timer_default as number | undefined) ?? toMinutes(fld.time),
          executorType: String(fld.executor ?? '')
            .trim()
            .toLowerCase(),
        };
      })
    : [];

  const totalStageMin = stages.reduce((sum, st) => sum + (st.timer || 0), 0) || 1;

  /** Раскраска блока */
  const containerRoleClass = (() => {
    if (!showStages || stages.length === 0) return '';
    const types = stages.map((s) => s.executorType);
    if (types.includes('auditor')) return 'timeline-block--auditor'; // красный
    if (types.includes('installer')) return 'timeline-block--installer'; // оранжевый
    return ''; // engineer -> оставить базовый синий
  })();

  /** итоговый класс по статусу и покрытию */
  const className = [
    'timeline-block',
    getStatusClass(block.status ?? 'info'),
    expandedBlockId === block.id && 'timeline-block--active',
    isCovered && 'timeline-block--covered',
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
      {!showStages && <div className="timeline-block__hover-text">{absEnd - absStart} мин</div>}

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
                style={{ width: `${(stage.timer / totalStageMin) * 100}%` }}
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
