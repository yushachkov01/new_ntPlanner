/**
 * Преобразует количество минут в строку формата "HH:MM".
 * @param totalMinutes — минуты
 * @returns Время в формате "HH:MM".
 */
export const toTime = (totalMinutes: number): string => {
  const minutesPart = ((totalMinutes % 60) + 60) % 60;
  const hoursPart = ((((totalMinutes - minutesPart) / 60) % 24) + 24) % 24;
  return `${String(hoursPart).padStart(2, '0')}:${String(minutesPart).padStart(2, '0')}`;
};

/**
 * парсер: из строки "HH:MM" возвращает число минут от начала дня
 * @param time
 * @returns количество минут
 */
export const parseTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};
