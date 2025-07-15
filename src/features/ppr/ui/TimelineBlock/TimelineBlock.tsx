/**
 * Блок на таймлайне: рассчитывает позицию, обрабатывает клики и popover
 */
import type { FC } from 'react';
import { useState, useEffect, useRef } from 'react';

import './TimelineBlock.css';
import { getStatusClass } from '@features/ppr/lib/getStatusClass.ts';
import type { TimelineBlockProps } from '@features/ppr/model/types.ts';

/**
 * Компонент блока на временной шкале
 *
 * @param block – данные блока (время, метка, статус, id)
 * @param totalWindowMin – общая длительность шкалы в минутах
 * @param windowStartMin – смещение начала окна (в минутах от 00:00), используется для расчёта
 * @param expandedBlockId – id блока, для которого открыт popover
 * @param setExpandedBlockId – функция установки id открытого блока
 * @param onDoubleClickBlock – колбэк на двойной клик по блоку
 * @param isCovered – флаг, указывающий, что блок покрыт другим
 */
const TimelineBlock: FC<TimelineBlockProps> = ({
  block,
  totalWindowMin,
  windowStartMin,
  expandedBlockId,
  setExpandedBlockId,
  onDoubleClickBlock,
  isCovered,
}) => {
  /**
   * Состояние видимости popover
   */
  const [showPopover, setShowPopover] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  /**
   * Закрываем popover, если открыт блок с другим id
   */
  useEffect(() => {
    if (expandedBlockId !== block.id) setShowPopover(false);
  }, [expandedBlockId, block.id]);

  /** Перевод "HH:mm" → минуты */
  const toMin = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  /** абсолютные минуты начала/конца */
  let absStart = toMin(block.startTime);
  let absEnd = toMin(block.endTime);

  /** учёт перехода через полночь */
  if (absEnd <= absStart) absEnd += 1440;

  /** выравнивание относительно окна */
  if (absStart < windowStartMin) absStart += 1440;
  if (absEnd < windowStartMin) absEnd += 1440;

  const relStart = absStart - windowStartMin;
  const relEnd = absEnd - windowStartMin;

  /** если блок вне видимой области — не рендерим */
  if (relEnd <= 0 || relStart >= totalWindowMin) return null;

  const leftPercent = (Math.max(0, relStart) / totalWindowMin) * 100;
  const widthPercent =
    ((Math.min(totalWindowMin, relEnd) - Math.max(0, relStart)) / totalWindowMin) * 100;
  /**
   * Обработчик клика: переключает popover
   * и обновляет expandedBlockId
   */
  const handleClick = () => {
    setShowPopover((prev) => {
      const next = !prev;
      setExpandedBlockId(next ? block.id : null);
      return next;
    });
  };
  /**
   * Обработчик двойного клика передаёт id блока вверх
   */
  const handleDoubleClick = () => onDoubleClickBlock(block.id);

  /** итоговый класс по статусу и покрытию */
  const className = [
    'timeline-block',
    getStatusClass(block.status ?? 'info'),
    expandedBlockId === block.id ? 'timeline-block--active' : '',
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
      <div className="timeline-block__hover-text">{absEnd - absStart}мин</div>
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
