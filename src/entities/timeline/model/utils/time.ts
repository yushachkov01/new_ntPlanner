/**
 * Утилиты для работы с временем и идентификаторами в таймлайне.
 * Содержит функции для нормализации источников, парсинга длительностей,
 * генерации стабильных идентификаторов строк и вычисления конца интервалов.
 */

/**
 * Нормализует входное значение в строковый идентификатор источника.
 *
 * @param value - любое входное значение
 * @returns строка-идентификатор или undefined, если значение пустое
 */
export const normSource = (value: unknown): string | undefined => {
  if (value === null || value === undefined) return undefined;
  const stringValue = String(value).trim();
  return stringValue === '' ? undefined : stringValue;
};

/**
 * Парсер длительности в минуты.
 * @param value - длительность в любом поддерживаемом формате
 * @returns длительность в минутах
 */
export const parseDurationToMinutes = (value: unknown): number => {
  if (value == null) return 0;

  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.floor(value));
  }

  const rawString = String(value).trim();
  if (!rawString) return 0;

  const normalizedString = rawString.toLowerCase().replace(/,/g, '.').replace(/\s+/g, ' ');
  {
    const match = normalizedString.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (match) {
      const hours = Number(match[1]) || 0;
      const minutes = Number(match[2]) || 0;
      const seconds = Number(match[3] ?? 0) || 0;
      return hours * 60 + minutes + Math.floor(seconds / 60);
    }
  }
  {
    const match = normalizedString.match(
      /^pt(?:(\d+(?:\.\d+)?)h)?(?:(\d+(?:\.\d+)?)m)?(?:(\d+(?:\.\d+)?)s)?$/i,
    );
    if (match) {
      const hours = Number(match[1] ?? 0) || 0;
      const minutes = Number(match[2] ?? 0) || 0;
      const seconds = Number(match[3] ?? 0) || 0;
      return Math.max(0, Math.floor(hours * 60 + minutes + seconds / 60));
    }
  }
  {
    if (/^\d+(\.\d+)?$/.test(normalizedString)) {
      return Math.max(0, Math.floor(Number(normalizedString)));
    }

    const hoursMatch = normalizedString.match(/(\d+(?:\.\d+)?)\s*h/);
    const minutesMatch = normalizedString.match(/(\d+(?:\.\d+)?)\s*m/);
    const secondsMatch = normalizedString.match(/(\d+(?:\.\d+)?)\s*s/);

    if (hoursMatch || minutesMatch || secondsMatch) {
      const hours = hoursMatch ? Number(hoursMatch[1]) : 0;
      const minutes = minutesMatch ? Number(minutesMatch[1]) : 0;
      const seconds = secondsMatch ? Number(secondsMatch[1]) : 0;
      return Math.max(0, Math.floor(hours * 60 + minutes + seconds / 60));
    }
  }
  {
    const numericValue = Number(normalizedString);
    if (Number.isFinite(numericValue)) {
      return Math.max(0, Math.floor(numericValue));
    }
  }

  return 0;
};

/**
 * Генерация стабильного идентификатора строки (rowId).
 * Если вход — число, оно возвращается как есть.
 * Если строка — применяется хеш-функция.
 *
 * @param id - идентификатор (число или строка)
 * @returns числовой идентификатор строки
 */
export const toRowId = (id: unknown): number => {
  if (typeof id === 'number' && Number.isFinite(id)) return id;

  const stringId = String(id ?? '');
  if (stringId.trim() === '') return 1;

  let hash = 5381;
  for (let i = 0; i < stringId.length; i++) {
    const code = stringId.charCodeAt(i);
    hash = (hash << 5) + hash + code;
    hash |= 0;
  }

  const result = Math.abs(hash);
  return result === 0 ? 1 : result;
};

/**
 * Вычисляет абсолютный конец интервала (endMin), учитывая переход через полночь.
 *
 * @param startMin - начало интервала в минутах
 * @param endMin - конец интервала в минутах
 * @returns абсолютное значение конца интервала
 */
export const absEnd = (startMin: number, endMin: number): number =>
  endMin <= startMin ? endMin + 24 * 60 : endMin;
