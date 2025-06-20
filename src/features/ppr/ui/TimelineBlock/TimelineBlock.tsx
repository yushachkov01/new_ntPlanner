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
 * @param expandedBlockId – id блока, для которого открыт popover
 * @param setExpandedBlockId – функция установки id открытого блока
 * @param onDoubleClickBlock – колбэк на двойной клик по блоку
 * @param isCovered – флаг, указывающий, что блок покрыт другим
 */
const TimelineBlock: FC<TimelineBlockProps> = ({
  block,
  totalWindowMin,
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
   * Разбор startTime и endTime в часы и минуты
   */
  const [sH, sM] = block.startTime.split(':').map(Number);
  const [eH, eM] = block.endTime.split(':').map(Number);

  /**
   * Перевод времени начала и конца в минуты от начала окна
   */
  const startMin = sH * 60 + sM;
  const endMin = eH * 60 + eM;

  /**
   * Вычисление позиции и ширины блока в процентах от общей длительности
   */
  const leftPercent = (startMin / totalWindowMin) * 100;
  const widthPercent = ((endMin - startMin) / totalWindowMin) * 100;

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
   * Закрываем popover, если открыт блок с другим id
   */
  useEffect(() => {
    if (expandedBlockId !== block.id) {
      setShowPopover(false);
    }
  }, [expandedBlockId, block.id]);

  /**
   * Обработчик двойного клика передаёт id блока вверх
   */
  const handleDoubleClick = () => onDoubleClickBlock(block.id);

  /**
   * Получаем CSS-класс по статусу блока
   */
  const statusClass = getStatusClass(block.status ?? 'info');

  /**
   * Определяем, активен ли этот блок (popover открыт)
   */
  const isActive = expandedBlockId === block.id;

  /**
   * Собираем итоговый список CSS-классов
   */
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
