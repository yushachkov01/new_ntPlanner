/**
 * Стабильный перевод произвольного id (string|number) в числовой rowId.
 * params
 * - rawId: исходный id пользователя/исполнителя
 */
export const toRowId = (rawId: string | number): number => {
  if (typeof rawId === 'number' && Number.isFinite(rawId)) return rawId;
  const keyStr = String(rawId);

  let hashAccumulator = 5381;
  for (let index = 0; index < keyStr.length; index++) {
    hashAccumulator = (hashAccumulator << 5) + hashAccumulator + keyStr.charCodeAt(index);
    hashAccumulator |= 0;
  }
  return Math.abs(hashAccumulator) || 1;
};

/**
 * Разбор id зоны дропа (DND) в rowId.
 * - overId: значение из dnd-kit
 */
export const parseOverRowId = (overId: unknown): number | null => {
  if (typeof overId === 'number' && Number.isFinite(overId)) return overId;
  if (typeof overId === 'string') {
    const match = overId.match(/^row-(\d+)$/);
    if (match) return Number(match[1]);
    const numericCandidate = Number(overId);
    if (!Number.isNaN(numericCandidate)) return numericCandidate;
  }
  return null;
};
