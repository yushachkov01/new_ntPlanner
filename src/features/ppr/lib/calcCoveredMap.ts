/**
 * Импорт типа данных блоков расписания
 */
import { parseTimeToMinutes } from '@/shared/ui/time/toTime';

import type { BlockData } from '../model/types.ts';

/**
 * Рассчитывает, какие блоки полностью покрыты другими блоками.
 *
 * @param blocks — массив блоков с полями id, startTime и endTime
 * @returns Объект, где ключи — id покрытых блоков, значение — true
 */
export function calcCoveredMap(blocks: BlockData[]): Record<number, boolean> {
  /**
   * Результирующий словарь покрытия
   */
  const covered: Record<number, boolean> = {};

  /**
   * Перебираем все пары блоков для проверки покрытий
   */
  for (let i = 0; i < blocks.length; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      const a = blocks[i];
      const b = blocks[j];

      /**
       * Временные границы блоков в минутах
       */
      const aStart = parseTimeToMinutes(a.startTime);
      const aEnd = parseTimeToMinutes(a.endTime);
      const bStart = parseTimeToMinutes(b.startTime);
      const bEnd = parseTimeToMinutes(b.endTime);

      /**
       * Если A начинается раньше B и заканчивается позже B — B покрыт A
       */
      if (aStart < bStart && aEnd > bEnd) {
        covered[b.id] = true;
      } else if (bStart < aStart && bEnd > aEnd) {
        /**
         * Если B начинается раньше A и заканчивается позже A — A покрыт B
         */
        covered[a.id] = true;
      } else if (aStart === bStart && aEnd >= bEnd) {
        /**
         * Если начало совпадает, но A длится дольше или столько же, сколько B — B покрыт A
         */
        covered[b.id] = true;
      } else if (bStart === aStart && bEnd >= aEnd) {
        /**
         * Если начало совпадает, но B длится дольше или столько же, сколько A — A покрыт B
         */
        covered[a.id] = true;
      }
    }
  }

  /**
   * Возвращаем карту покрытий
   */
  return covered;
}
