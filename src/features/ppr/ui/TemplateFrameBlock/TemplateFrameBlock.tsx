import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { FC, PropsWithChildren } from 'react';
import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
  Children,
  isValidElement,
  cloneElement,
} from 'react';

import './TemplateFrameBlock.css';
import { toTime } from '@/shared/ui/time/toTime';

interface Props extends PropsWithChildren {
  idx: number;
  startMin: number;
  endMin: number;
  windowStartMin: number;
  totalWindowMin: number;
  containerWidthPx: number;
  onToggleExpand(): void;
  rowParts?: number;
  partIndex?: number;
  isSMRTemplate?: boolean;
  isPZTemplate?: boolean;
}

/**
 * Компонент «рамки» шаблона на таймлайне.
 *
 * @param idx — уникальный идентификатор фрейма (для dnd-kit).
 * @param startMin — время начала фрейма, минуты от 00:00.
 * @param endMin — время конца фрейма, минуты от 00:00.
 * @param windowStartMin — начало видимого окна таймлайна, минуты от 00:00.
 * @param totalWindowMin — длина видимого окна, в минутах.
 * @param containerWidthPx — ширина контейнера
 * @param onToggleExpand — колбэк клика по badge.
 * @param rowParts — на сколько частей разбивается строка (высота фрейма).
 * @param partIndex — индекс текущей «полки» в строке.
 * @param isSMRTemplate — флаг подсветки зелёным.
 * @param isPZTemplate — флаг подсветки оранжевым.
 * @param children — внутренние блоки TimelineBlock.
 */
const TemplateFrameBlock: FC<Props> = ({
  idx,
  startMin,
  endMin,
  windowStartMin,
  totalWindowMin,
  containerWidthPx,
  children,
  rowParts = 1,
  partIndex = 0,
  isSMRTemplate = false,
  isPZTemplate = false,
}) => {
  /** dnd-kit hook для drag&drop */
  const draggableId = `template-${idx}`;
  const { setNodeRef, listeners, attributes, transform, isDragging } = useDraggable({
    id: draggableId,
  });

  /** делаем фрейм также зоной дропа, чтобы можно было «наехать» одним бандлом на другой */
  const { setNodeRef: setDropRef } = useDroppable({ id: draggableId });

  /** единый ref, который передаём контейнеру: и draggable, и droppable одновременно */
  const setCombinedRef = useCallback(
    (node: HTMLElement | null) => {
      setNodeRef(node);
      setDropRef(node as any);
    },
    [setNodeRef, setDropRef],
  );

  /** состояние «нажатия» для эффекта заливки */
  const [press, setPress] = useState(false);
  const down = useCallback(() => setPress(true), []);
  const up = useCallback(() => setPress(false), []);
  useEffect(() => {
    if (isDragging) setPress(false);
  }, [isDragging]);

  /**
   * Вычисляет относительное положение и ширину фрейма
   * в процентах от всего окна таймлайна.
   */
  const { leftPct, widthPct } = useMemo(() => {
    const span = (endMin <= startMin ? endMin + 1440 : endMin) - startMin;
    const relStart =
      (((startMin - windowStartMin) % totalWindowMin) + totalWindowMin) % totalWindowMin;
    const relEnd = Math.min(relStart + span, totalWindowMin);
    return {
      leftPct: (relStart / totalWindowMin) * 100,
      widthPct: ((relEnd - relStart) / totalWindowMin) * 100,
    };
  }, [startMin, endMin, windowStartMin, totalWindowMin]);

  /**
   * Перевод смещения по оси X в минуты.
   */
  const deltaMin = useMemo(() => {
    if (!transform?.x || containerWidthPx <= 0) return 0;
    return (transform.x / containerWidthPx) * totalWindowMin;
  }, [transform, containerWidthPx, totalWindowMin]);

  /**
   * Вычисляет CSS-свойства top и height
   * для размещения фрейма в своей «полке».
   */
  const lane: React.CSSProperties = useMemo(() => {
    if ((rowParts ?? 1) <= 1) return { top: 0, height: '100%' };
    const h = 100 / rowParts!;
    return { top: `${h * partIndex!}%`, height: `${h}%` };
  }, [rowParts, partIndex]);

  /**
   * Анимация только ПОСЛЕ drop:
   * - ловим переход isDragging: true -> false
   * - включаем transition на left/width на один следующий кадр
   */
  const wasDraggingRef = useRef(false);
  const [animateAfterDrop, setAnimateAfterDrop] = useState(false);

  useEffect(() => {
    if (isDragging) {
      wasDraggingRef.current = true;
      setAnimateAfterDrop(false);
      return;
    }
    if (wasDraggingRef.current) {
      const id = requestAnimationFrame(() => setAnimateAfterDrop(true));
      return () => cancelAnimationFrame(id);
    }
  }, [isDragging]);

  /** итоговый стиль контейнера фрейма */
  const style: React.CSSProperties = {
    ...lane,
    left: `${leftPct}%`,
    width: `${widthPct}%`,
    transform: transform ? CSS.Translate.toString({ x: transform.x, y: 0 }) : undefined,
    zIndex: isDragging ? 20 : 1,
    position: 'absolute',
    transition: animateAfterDrop
      ? 'left 240ms cubic-bezier(.2,.8,.2,1), width 240ms cubic-bezier(.2,.8,.2,1)'
      : 'none',
    willChange: isDragging ? 'transform' : animateAfterDrop ? 'left, width' : undefined,
    backfaceVisibility: 'hidden',
    contain: 'layout paint',
  };

  /**
   * Оборачивает потомков, чтобы они
   * растягивались на всю высоту фрейма.
   */
  const renderedChildren = Children.map(children, (ch) =>
    isValidElement(ch)
      ? cloneElement(ch as any, {
          style: {
            ...(ch.props.style || {}),
            top: 0,
            height: '100%',
          },
          laneParts: 1,
          laneIndex: 0,
        })
      : ch,
  );

  return (
    <div
      ref={setCombinedRef}
      className={[
        'template-frame',
        press && 'template-frame--pressing',
        isDragging && 'template-frame--dragging',
        isSMRTemplate && 'template-frame--smr',
        isPZTemplate && 'template-frame--zr',
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      onPointerDown={down}
      onPointerUp={up}
      onPointerCancel={up}
      {...listeners}
      {...attributes}
    >
      <div className="template-frame__bg" />
      {renderedChildren}
      {isDragging && (
        <>
          <div className="template-frame__guide guide-start">
            <span className="guide-label">{toTime(startMin + deltaMin)}</span>
          </div>
          <div className="template-frame__guide guide-end">
            <span className="guide-label">{toTime(endMin + deltaMin)}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default TemplateFrameBlock;
