/**
 * Добавляет заданное количество минут к времени в формате "HH:MM".
 *
 * @param timeString — исходное время в формате "HH:MM"
 * @param minutesToAdd — число минут для добавления
 * @returns новое время в формате "HH:MM"
 */
export const addMinutes = (timeString: string, minutesToAdd: number): string => {
  /** Разбираем строку времени на часы и минуты */
  const [hours, minutes] = timeString.split(':').map(Number);
  /** Создаём временной объект на произвольную дату, устанавливаем часы и минуты */
  const date = new Date(0, 0, 0, hours, minutes);
  /** Добавляем минуты */
  date.setMinutes(date.getMinutes() + minutesToAdd);
  return date.toTimeString().slice(0, 5);
};
