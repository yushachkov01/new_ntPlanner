/**
 * Импорт типа данных блоков расписания
 */
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
   * Преобразует строку времени "HH:MM" в количество минут от начала дня
   *
   * @param t — строка в формате "HH:MM"
   * @returns Число минут
   */
  const toMin = (t: string): number => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

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
      const aStart = toMin(a.startTime);
      const aEnd = toMin(a.endTime);
      const bStart = toMin(b.startTime);
      const bEnd = toMin(b.endTime);

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
