import type { BlockExt } from '@/features/ppr/model/types';
import { parseTimeToMinutes } from '@/shared/ui/time/toTime';

/**
 * Рассчитывает, какие блоки полностью покрыты другими блоками.
 * blocks: список блоков таймлайна
 */
export function calcCoveredMap(blocks: BlockExt[]): Record<number, boolean> {
  const coveredMap: Record<number, boolean> = {};

  /**
   * Нормализует интервал в абсолютные минуты (учёт перехода через 00:00).
   * params
   * - startMin: минуты старта интервала
   * - endMin: минуты конца интервала
   * returns
   * - { startAbsMin, endAbsMin }: конец всегда >= начала
   */
  const normalizeInterval = (startMin: number, endMin: number) => {
    /** Абсолютный старт интервала в минутах от 00:00 текущих суток */
    const startAbsMin = startMin;
    /** Абсолютный конец интервала (>= startAbsMin), с учётом перетекания через полночь */
    const endAbsMin = endMin <= startMin ? endMin + 1440 : endMin;
    return { startAbsMin, endAbsMin };
  };

  /**
   * Приводит интервал к общей базе времени, чтобы сравнивать пары,
   * где один из интервалов может «лежать до 00:00».
   * returns
   * - { startAbsMin, endAbsMin }: интервал, развёрнутый на одной оси времени
   */
  const unwrapToBase = (startMin: number, endMin: number, baseStart: number) => {
    /** Нормализованный интервал с учётом возможного перехода через полночь */
    let { startAbsMin, endAbsMin } = normalizeInterval(startMin, endMin);

    /**
     * Если интервал «до базы» (оба конца <= baseStart), переносим его на сутки вперёд,
     * чтобы baseStart попадал внутрь общей оси сравнения.
     */
    const isCompletelyBeforeBase = startAbsMin < baseStart && endAbsMin <= baseStart;
    if (isCompletelyBeforeBase) {
      startAbsMin += 1440;
      endAbsMin += 1440;
    }
    return { startAbsMin, endAbsMin };
  };

  /**
   * Двойной цикл по всем парам блоков (i < j), чтобы проверить покрытие.
   */
  for (let firstIndex = 0; firstIndex < blocks.length; firstIndex++) {
    /** Блок слева в паре */
    const firstBlock = blocks[firstIndex];

    for (let secondIndex = firstIndex + 1; secondIndex < blocks.length; secondIndex++) {
      /** Блок справа в паре */
      const secondBlock = blocks[secondIndex];

      /** Минуты старта первого блока */
      const firstStartMin = parseTimeToMinutes(firstBlock.startTime);
      /** Минуты конца первого блока ) */
      const firstEndMin = parseTimeToMinutes(firstBlock.endTime);

      /** Минуты старта второго блока */
      const secondStartMin = parseTimeToMinutes(secondBlock.startTime);
      /** Минуты конца второго блока */
      const secondEndMin = parseTimeToMinutes(secondBlock.endTime);

      /**
       * Общая база для пары — минимальный старт двух блоков.
       * Нужна, чтобы одинаково «развернуть» интервалы по отношению к этой базе.
       */
      const baseStart = Math.min(firstStartMin, secondStartMin);

      /** Интервал первого блока на общей оси времени */
      const firstInterval = unwrapToBase(firstStartMin, firstEndMin, baseStart);
      /** Интервал второго блока на общей оси времени */
      const secondInterval = unwrapToBase(secondStartMin, secondEndMin, baseStart);

      /**
       * Сравнение интервалов
       */
      const firstCoversSecond =
        firstInterval.startAbsMin <= secondInterval.startAbsMin &&
        firstInterval.endAbsMin >= secondInterval.endAbsMin &&
        (firstInterval.startAbsMin < secondInterval.startAbsMin ||
          firstInterval.endAbsMin > secondInterval.endAbsMin);

      /**
       *  второй блок полностью покрывает первый
       */
      const secondCoversFirst =
        secondInterval.startAbsMin <= firstInterval.startAbsMin &&
        secondInterval.endAbsMin >= firstInterval.endAbsMin &&
        (secondInterval.startAbsMin < firstInterval.startAbsMin ||
          secondInterval.endAbsMin > firstInterval.endAbsMin);

      /** Фиксируем покрытие, помечаем целиком покрытый блок */
      if (firstCoversSecond) {
        coveredMap[secondBlock.id] = true;
      } else if (secondCoversFirst) {
        coveredMap[firstBlock.id] = true;
      }
    }
  }

  /**
   * Возвращаем карту покрытий
   */
  return coveredMap;
}
