import {TEMPLATE_IDX_MODULO} from "@/shared/constants";
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

/**
 * Нужен для простых проверок, получает overId (id цели drop-а в dnd-kit) и возвращает только tplIdx (индекс группы шаблона), без rowId.
 */
export const parseOverTplIdx = (overId: unknown): number | null => {
  if (typeof overId === 'string') {
    const match = overId.match(/^template-(\d+)$/);
    if (match) {
      const composite = Number(match[1]);
      if (Number.isFinite(composite)) return composite % 1000; // НОРМАЛИЗУЕМ!
    }
  }
  if (typeof overId === 'number' && Number.isFinite(overId)) {
    return overId % 1000;
  }
  return null;
};

/**
 * id зоны дропа (overId), которую возвращает dnd-kit в событии onDragEnd.
 */
export const parseOverTplMeta = (overId: unknown): { rowId: number; tplIdx: number } | null => {
  if (typeof overId === 'string') {
    const match = overId.match(/^template-(\d+)$/);
    if (match) {
      const composite = Number(match[1]);
      if (Number.isFinite(composite)) {
        return {
          rowId: Math.floor(composite / 1000),
          tplIdx: composite % TEMPLATE_IDX_MODULO,
        };
      }
    }
  }
  if (typeof overId === 'number' && Number.isFinite(overId)) {
    return {
      rowId: Math.floor(overId / 1000),
      tplIdx: overId % TEMPLATE_IDX_MODULO,
    };
  }
  return null;
};
