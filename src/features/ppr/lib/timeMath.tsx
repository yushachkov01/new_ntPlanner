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
