/**
 * Безопасно парсит длительность из YAML/строки в минуты.
 *
 * Поддерживаемые форматы:
 *   - целое число (минуты): "15" или 15
 *   - "10m", "1h", "1h 30m" (регистр не важен, пробелы допустимы)
 *
 * @param value Любое значение из YAML/настроек.
 * @returns Количество минут (>0) либо `undefined`, если распарсить не удалось.
 */
export function parseDurationToMinutesSafe(value: unknown): number | undefined {
  if (value == null) return undefined;

  if (typeof value === 'number' && isFinite(value)) {
    const numberValue = Math.floor(value);
    return numberValue > 0 ? numberValue : undefined;
  }

  if (typeof value === 'string') {
    const normalizedValue = value.trim().toLowerCase();

    if (/^\d+$/.test(normalizedValue)) {
      const parsedNumber = parseInt(normalizedValue, 10);
      return parsedNumber > 0 ? parsedNumber : undefined;
    }

    const hoursMatch = normalizedValue.match(/(\d+)\s*h/);
    const minutesMatch = normalizedValue.match(/(\d+)\s*m/);

    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;

    const totalMinutes = hours * 60 + minutes;
    return totalMinutes > 0 ? totalMinutes : undefined;
  }

  return undefined;
}
