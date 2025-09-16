import { useDraggable, useDroppable, useDndMonitor } from '@dnd-kit/core';
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
import { createPortal } from 'react-dom';

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

/** строка HH:MM (округление до ближайшей минуты) */
function formatMinutesToHHMM(totalMinutes: number): string {
    if (!Number.isFinite(totalMinutes)) return '00:00';
    let minutes = Math.round(totalMinutes) % 1440;
    if (minutes < 0) minutes += 1440;
    const hh = Math.floor(minutes / 60);
    const mm = minutes % 60;
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
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
    const [dragDeltaX, setDragDeltaX] = useState(0);
    const [isDraggingFromMonitor, setIsDraggingFromMonitor] = useState(false);

    useDndMonitor({
        onDragStart(event) {
            if (event.active.id === draggableId) {
                setIsDraggingFromMonitor(true);
                setDragDeltaX(0);
            }
        },
        onDragMove(event) {
            if (event.active.id === draggableId) {
                setDragDeltaX(event.delta.x);
            }
        },
        onDragCancel(event) {
            if (event.active.id === draggableId) {
                setIsDraggingFromMonitor(false);
                setDragDeltaX(0);
            }
        },
        onDragEnd(event) {
            if (event.active.id === draggableId) {
                setIsDraggingFromMonitor(false);
                setDragDeltaX(0);
            }
        },
    });

    const deltaMin = useMemo(() => {
        const offsetX = (transform?.x ?? dragDeltaX) || 0;
        if (containerWidthPx <= 0) return 0;
        return (offsetX / containerWidthPx) * totalWindowMin;
    }, [transform?.x, dragDeltaX, containerWidthPx, totalWindowMin]);

    /**
     * Вычисляет CSS-свойства top и height
     * для размещения фрейма в своей «полке».
     */
    const lane: React.CSSProperties = useMemo(() => {
        if ((rowParts ?? 1) <= 1) return { top: 0, height: '100%' };
        const heightPercent = 100 / rowParts!;
        return { top: `${heightPercent * partIndex!}%`, height: `${heightPercent}%` };
    }, [rowParts, partIndex]);

  /**
   * Анимация только ПОСЛЕ drop:
   * - ловим переход isDragging: true -> false
   * - включаем transition на left/width на один следующий кадр
   */
  const wasDraggingRef = useRef(false);
  const [animateAfterDrop, setAnimateAfterDrop] = useState(false);

    useEffect(() => {
        const draggingNow = isDragging || isDraggingFromMonitor;
        if (draggingNow) {
            wasDraggingRef.current = true;
            setAnimateAfterDrop(false);
            return;
        }
        if (wasDraggingRef.current) {
            const id = requestAnimationFrame(() => setAnimateAfterDrop(true));
            return () => cancelAnimationFrame(id);
        }
    }, [isDragging, isDraggingFromMonitor]);

    /** итоговый стиль контейнера фрейма */
    const style: React.CSSProperties = {
        ...lane,
        left: `${leftPct}%`,
        width: `${widthPct}%`,
        transform:
            transform
                ? CSS.Translate.toString({ x: transform.x, y: 0 })
                : dragDeltaX
                    ? CSS.Translate.toString({ x: dragDeltaX, y: 0 })
                    : undefined,
        zIndex: (isDragging || isDraggingFromMonitor) ? 20 : 1,
        position: 'absolute',
        transition: animateAfterDrop
            ? 'left 240ms cubic-bezier(.2,.8,.2,1), width 240ms cubic-bezier(.2,.8,.2,1)'
            : 'none',
        willChange:
            (isDragging || isDraggingFromMonitor) ? 'transform' : animateAfterDrop ? 'left, width' : undefined,
        backfaceVisibility: 'hidden',
        contain: 'layout paint',
        overflow: 'visible',
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

    /**
     * Ref на DOM-элемент блока (template-frame).
     * Используется для вычисления позиции и размеров блока (через getBoundingClientRect).
     */
    const blockRef = useRef<HTMLDivElement | null>(null);

    /** Стили для вертикальной линии слева (зелёной) */
    const [startLineStyle, setStartLineStyle] = useState<React.CSSProperties>({ display: 'none' });

    /** Стили для вертикальной линии справа (красной) */
    const [endLineStyle, setEndLineStyle] = useState<React.CSSProperties>({ display: 'none' });

    /** Стили для лейбла слева с временем начала блока. */
    const [startLabelStyle, setStartLabelStyle] = useState<React.CSSProperties>({ display: 'none' });

    /** Стили для лейбла справа с временем конца блока. */
    const [endLabelStyle, setEndLabelStyle] = useState<React.CSSProperties>({ display: 'none' });

    /**
     * Коэффициент, указывающий где "базовая линия" цифр в заголовке таймлайна.
     */
    const HEADER_DIGITS_BASELINE_RATIO = 0.78;

    /** Отступ между верхом линии и текстовым лейблом с временем. */
    const LABEL_GAP_ABOVE_LINE_PX = 6;

    /** Цвет линии начала блока (зелёный). */
    const LEFT_LINE_COLOR = 'rgb(0, 200, 83)';

    /** Цвет линии конца блока (красный). */
    const RIGHT_LINE_COLOR = 'rgb(244, 67, 54)';

    /**
     * Функция ищет элемент шапки таймлайна.
     */
    const findTimelineHeaderRect = useCallback((): DOMRect | null => {
        const host = blockRef.current;
        if (!host) return null;

        // Корневой контейнер таймлайна
        const root =
            host.closest('.timeline') ||
            host.parentElement;

        const selectors = [
            '.timeline-header',
        ];

        for (const sel of selectors) {
            const el = (root as HTMLElement | null)?.querySelector?.(sel) || document.querySelector(sel);
            if (el) return el.getBoundingClientRect();
        }
        return null;
    }, []);

    /** Флаг: показывать ли направляющие (зависит от drag state). */
    const showGuides = isDragging || isDraggingFromMonitor;

    /**
     *  отвечает за рендер вертикальных направляющих (линии и лейблы).
     * Пока showGuides=true, каждую анимацию кадра пересчитывает координаты
     * и обновляет стили для startLine, endLine, startLabel, endLabel.
     */
    useEffect(() => {
        if (!showGuides) {
            // Скрываем все линии и подписи
            setStartLineStyle(s => ({ ...s, display: 'none' }));
            setEndLineStyle(s => ({ ...s, display: 'none' }));
            setStartLabelStyle(s => ({ ...s, display: 'none' }));
            setEndLabelStyle(s => ({ ...s, display: 'none' }));
            return;
        }

        let rafId = 0;

        /**
         * Пересчитывает позиции и обновляет стили направляющих.
         * Запускается в каждом кадре
         */
        const update = () => {
            const el = blockRef.current;
            if (!el) {
                rafId = requestAnimationFrame(update);
                return;
            }

            // Позиция блока
            const rect = el.getBoundingClientRect();

            // Позиция шапки таймлайна
            const headerRect = findTimelineHeaderRect();

            // Верх линии (чуть ниже цифр в шапке), низ — низ блока
            const headerTop = headerRect ? headerRect.top : rect.top - 56;
            const lineTop = Math.round(
                headerRect
                    ? headerRect.top + headerRect.height * HEADER_DIGITS_BASELINE_RATIO
                    : (headerTop + 40)
            );
            const lineBottom = Math.round(rect.bottom);
            const lineHeight = Math.max(8, lineBottom - lineTop);

            /** Общие CSS-свойства для обеих вертикальных линий */
            const commonLine: React.CSSProperties = {
                position: 'fixed',
                top: `${lineTop}px`,
                height: `${lineHeight}px`,
                width: '2px',
                borderRadius: '1px',
                zIndex: 9999,
                display: 'block',
                pointerEvents: 'none',
                boxShadow: '0 0 0 1px rgba(0,0,0,.2)',
            };

            // Линия слева (зелёная)
            setStartLineStyle({
                ...commonLine,
                left: `${Math.round(rect.left)}px`,
                background: LEFT_LINE_COLOR,
            });

            // Линия справа (красная)
            setEndLineStyle({
                ...commonLine,
                left: `${Math.round(rect.right)}px`,
                background: RIGHT_LINE_COLOR,
            });

            // Лейблы над линиями
            const labelTop = Math.max(headerTop, lineTop - LABEL_GAP_ABOVE_LINE_PX);

            /** Общие CSS для лейблов */
            const commonLabel: React.CSSProperties = {
                position: 'fixed',
                top: `${labelTop}px`,
                background: 'rgba(0,0,0,.9)',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 700,
                lineHeight: 1,
                padding: '3px 6px',
                borderRadius: '6px',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 6px rgba(0,0,0,.25)',
                zIndex: 10000,
                display: 'block',
                pointerEvents: 'none',
            };

            // Лейбл слева
            setStartLabelStyle({
                ...commonLabel,
                left: `${Math.round(rect.left)}px`,
                transform: 'translateX(-100%)',
            });

            // Лейбл справа
            setEndLabelStyle({
                ...commonLabel,
                left: `${Math.round(rect.right)}px`,
                transform: 'translateX(0)',
            });
            rafId = requestAnimationFrame(update);
        };
        rafId = requestAnimationFrame(update);

        // Обновления при скролле/resize
        window.addEventListener('scroll', update, true);
        window.addEventListener('resize', update);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('scroll', update, true);
            window.removeEventListener('resize', update);
        };
    }, [showGuides, findTimelineHeaderRect]);

    return (
        <>
            {showGuides &&
                createPortal(
                    <>
                        <div style={startLineStyle} />
                        <div className="guide-label-floating" style={startLabelStyle}>
                            {formatMinutesToHHMM(startMin + deltaMin)}
                        </div>

                        <div style={endLineStyle} />
                        <div className="guide-label-floating" style={endLabelStyle}>
                            {formatMinutesToHHMM(endMin + deltaMin)}
                        </div>
                    </>,
                    document.body
                )}

            <div
                ref={(node) => {
                    setCombinedRef(node);
                    blockRef.current = node;
                }}
                className={[
                    'template-frame',
                    press && 'template-frame--pressing',
                    (isDragging || isDraggingFromMonitor) && 'template-frame--dragging',
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
            </div>
        </>
    );
};

export default TemplateFrameBlock;
