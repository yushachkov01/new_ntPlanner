/**
 * Утилиты для перепаковки блоков (этапов) в строке таймлайна.
 * - Сдвигает блоки «влево» без зазоров, сохраняя порядок их создания (tplIdx).
 * - Обеспечивает компактное и последовательное отображение этапов.
 */

import { parseTimeToMinutes, toTime, absEnd } from '@/shared/time';

import type { Executor, BlockExt } from '../types/types';

/**
 * Перепаковывает блоки строки так, чтобы они шли «влево» без зазоров.
 * @param row - строка исполнителя, в которой содержатся блоки
 * @param startRefMin - опорная точка (в минутах), с которой начинается перепаковка (по умолчанию 0)
 */
export const repackRowLeft = (row: Executor, startRefMin = 0): void => {
  /** Список блоков исполнителя */
  const blocks = row.blocks ?? [];
  if (blocks.length === 0) return;

  /** Группировка блоков по tplIdx */
  const blocksByTemplate = new Map<number, BlockExt[]>();
  for (const block of blocks) {
    if (!blocksByTemplate.has(block.tplIdx)) {
      blocksByTemplate.set(block.tplIdx, []);
    }
    blocksByTemplate.get(block.tplIdx)!.push(block);
  }

  /** Порядок tplIdx (сортировка по возрастанию — порядок создания) */
  const templateOrder = Array.from(blocksByTemplate.keys()).sort((a, b) => a - b);

  /** Новый массив блоков после перепаковки */
  const newBlocks: BlockExt[] = [];
  let cursorMin = startRefMin;

  /** Перебор групп блоков по порядку tplIdx */
  for (const templateIdx of templateOrder) {
    /** Сортировка блоков внутри группы по времени начала */
    const stages = [...blocksByTemplate.get(templateIdx)!].sort(
      (a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime),
    );

    /** Пересчёт времени для каждого блока */
    for (const block of stages) {
      const startMin = parseTimeToMinutes(block.startTime);
      const endMin = absEnd(startMin, parseTimeToMinutes(block.endTime));
      const durationMin = Math.max(1, endMin - startMin); // защита от нулевой/отрицательной длительности

      block.startTime = toTime(cursorMin);
      cursorMin += durationMin;
      block.endTime = toTime(cursorMin);

      newBlocks.push(block);
    }
  }

  /** Обновляем блоки у исполнителя */
  row.blocks = [...newBlocks];
};
