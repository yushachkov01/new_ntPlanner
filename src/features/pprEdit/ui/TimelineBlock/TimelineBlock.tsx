/**
 * TimelineBlock — компонент для отрисовки одного блока задачи на шкале таймлайна.
 * Отвечает за:
 *  позиционирование и размер блока в зависимости от времени начала и конца
 *  обработку клика и двойного клика для выделения и открытия деталей
 */

import React from 'react';
import './TimelineBlock.css';

interface TimelineBlockProps {
  /** Объект задачи */
  block: {
    id: number;
    label: string;
    startTime: string;
    endTime: string;
    status: string;
    subSteps?: any;
  };
  /** Общая длительность отображаемого временного окна в минутах */
  totalWindowMin: number;
  /** Время начала окна в минутах от 00:00 (по умолчанию 0) */
  windowStartMin?: number;
  /** ID текущего развернутого блока (для подсветки) */
  expandedBlockId: number | null;
  /** Сеттер для изменения развернутого блока */
  setExpandedBlockId: (id: number | null) => void;
  /** Обработчик двойного клика по блоку */
  onDoubleClickBlock: (id: number) => void;
  /** Флаг: блок перекрыт (covered) другими задачами */
  isCovered: boolean;
}

/**
 * pad — дополняет число ведущим нулём до двух цифр.
 * @param n — исходное число
 * @returns строка вида "07", "12"
 */
const pad = (n: number) => n.toString().padStart(2, '0');

/**
 * toMin — конвертирует строку времени "HH:mm" в количество минут от 00:00.
 * @param time — строка формата "HH:mm"
 * @returns число минут с начала суток
 */
const toMin = (time: string) => {
  const [hh, mm] = time.split(':').map(Number);
  return hh * 60 + mm;
};

/**
 * TimelineBlock — функциональный компонент, рисующий один полосный блок на таймлайне.
 */
const TimelineBlock: React.FC<TimelineBlockProps> = ({
  block,
  totalWindowMin,
  windowStartMin = 0,
  expandedBlockId,
  setExpandedBlockId,
  onDoubleClickBlock,
  isCovered,
}) => {
  /** пересчитываем времена начала и конца задачи в минуты относительно окна */
  const startMin = toMin(block.startTime) - windowStartMin;
  const endMin = toMin(block.endTime) - windowStartMin;

  /** вычисляем смещение слева в процентах от ширины контейнера */
  const leftPct = (startMin / totalWindowMin) * 100;
  /** вычисляем ширину блока в процентах от ширины контейнера */
  const widthPct = ((endMin - startMin) / totalWindowMin) * 100;

  /**
   * Обработчик одиночного клика:
   *  переключает состояние expandedBlockId
   */
  const handleClick = () => {
    setExpandedBlockId(block.id === expandedBlockId ? null : block.id);
  };
  return (
    <div
      className={`timeline-interval ${
        block.id === expandedBlockId ? 'expanded' : ''
      } ${isCovered ? 'covered' : ''}`}
      style={{
        left: `${leftPct}%`,
        width: `${widthPct}%`,
      }}
      onClick={handleClick}
      onDoubleClick={() => onDoubleClickBlock(block.id)}
      title={`${block.label} (${block.startTime}–${block.endTime})`}
    />
  );
};

export default TimelineBlock;
