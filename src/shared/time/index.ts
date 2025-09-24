// базовые утилиты времени
import {MINUTES_IN_DAY} from "@/shared/constants";
export { parseTimeToMinutes, toTime } from '@/shared/ui/time/toTime';

/**
 * Возвращает абсолютный конец интервала с учётом перехода через полночь.
 * Если end <= start — добавляем 1440 минут (сутки).
 */
export const absEnd = (startAbsMin: number, rawEndMin: number) =>
    rawEndMin <= startAbsMin ? rawEndMin + 1440 : rawEndMin;

/**
 * Превращает [start,end] в абсолютную пару минут, где end >= start.
 */
export const toAbs = (startMin: number, endMin: number) => {
    const endAbsMin = endMin <= startMin ? endMin + 1440 : endMin;
    return [startMin, endAbsMin] as const;
};

/** true, если окно визуализации охватывает >= 24ч */
export const isMultiDayWindow = (totalWindowMin: number) =>
    totalWindowMin >= MINUTES_IN_DAY;

/** Гарантирует, что конец не раньше начала (учёт перехода через полночь) */
export const ensureEndAfterStart = (startMin: number, endMin: number) =>
    endMin + (endMin <= startMin ? MINUTES_IN_DAY : 0);

/** Сдвигает минутную метку внутрь окна, если оно многосуточное и отметка слева от окна */
export const shiftIntoWindow = (
    absMin: number,
    windowStartMin: number,
    totalWindowMin: number,
) => absMin + (isMultiDayWindow(totalWindowMin) && absMin < windowStartMin ? MINUTES_IN_DAY : 0);

/**
 * Нормализует интервал к абсолютным минутам и к окну:
 * - делает end >= start (через ensureEndAfterStart)
 * - при многосуточном окне сдвигает точки внутрь окна
 * - возвращает абсолютные и относительные координаты + длительность
 */
export const normalizeIntervalToWindow = (
    startMin: number,
    endMin: number,
    windowStartMin: number,
    totalWindowMin: number,
) => {
    let absStart = startMin;
    let absEnd = ensureEndAfterStart(startMin, endMin);

    absStart = shiftIntoWindow(absStart, windowStartMin, totalWindowMin);
    absEnd = shiftIntoWindow(absEnd, windowStartMin, totalWindowMin);

    const relStart = absStart - windowStartMin;
    const relEnd = absEnd - windowStartMin;
    const duration = Math.max(1, absEnd - absStart);

    return { absStart, absEnd, relStart, relEnd, duration };
};

/** Утилита для перевода относительного отрезка в проценты ширины окна */
export const toPercentInterval = (relStart: number, relEnd: number, totalWindowMin: number) => {
    const leftPercent = (Math.max(0, relStart) / totalWindowMin) * 100;
    const widthPercent =
        ((Math.min(totalWindowMin, relEnd) - Math.max(0, relStart)) / totalWindowMin) * 100;
    return { leftPercent, widthPercent };
};
