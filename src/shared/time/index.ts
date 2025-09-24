// базовые утилиты времени
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
