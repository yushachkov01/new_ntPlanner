import { parseTimeToMinutes } from '@/shared/ui/time/toTime';

/**
 * Корректный конец интервала (учёт перехода через полночь).
 * params
 * - startAbsMin: абсолютный старт в минутах
 * - rawEndMin: «сырые» минуты конца
 */
export const absEnd = (startAbsMin: number, rawEndMin: number) =>
  rawEndMin <= startAbsMin ? rawEndMin + 1440 : rawEndMin;

/**
 * Длительность блока в минутах.
 * params
 * - block: объект с полями startTime/endTime (HH:mm)
 */
export const blockDuration = (block: { startTime: string; endTime: string }) => {
  const startAbsMin = parseTimeToMinutes(block.startTime);
  const endAbsMin = absEnd(startAbsMin, parseTimeToMinutes(block.endTime));
  return Math.max(1, endAbsMin - startAbsMin);
};

/**
 * Перевод [start,end) в абсолютные минуты (end >= start с учётом 24ч).
 * params
 * - startMin: минуты старта
 * - endMin: минуты конца
 */
export const toAbs = (startMin: number, endMin: number) => {
  const endAbsMin = endMin <= startMin ? endMin + 1440 : endMin;
  return [startMin, endAbsMin] as const;
};

/**
 * свободный старт >= desiredStartAbs,
 * чтобы интервал длиной totalDuration не пересекал занятые интервалы.
 * params
 * - desiredStartAbs: желаемый старт (минуты)
 * - totalDuration: длительность (минуты)
 * - busyIntervals: занятые интервалы
 * - windowStartMin: минимум, от которого можно начинать
 */
export const findNearestFreeStart = (
  desiredStartAbs: number,
  totalDuration: number,
  busyIntervals: Array<{ s: number; e: number }>,
  windowStartMin: number,
) => {
  const sortedIntervals = [...busyIntervals].sort((left, right) => left.s - right.s);
  let probeStartAbs = Math.max(desiredStartAbs, windowStartMin);

  for (const interval of sortedIntervals) {
    const fitsBeforeInterval = probeStartAbs + totalDuration <= interval.s;
    if (fitsBeforeInterval) break;

    const intersectsInterval =
      probeStartAbs < interval.e && probeStartAbs + totalDuration > interval.s;

    if (intersectsInterval) {
      probeStartAbs = interval.e;
    }
  }
  return probeStartAbs;
};
