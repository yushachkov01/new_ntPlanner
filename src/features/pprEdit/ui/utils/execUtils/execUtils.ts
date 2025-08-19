/**
 * Вспомогательные функции для нормализации и работы с объектами исполнителей
 *
 * @param executor — исходный объект исполнителя в произвольном виде
 * @returns объект с нормализованными полями: id, author, role
 */
export const normalizeExec = (executor: any) => ({
  /** Уникальный идентификатор исполнителя */
  id: executor?.id ?? executor?.user_id ?? executor?.value ?? executor?.key,

  /** Имя/ФИО исполнителя*/
  author:
    executor?.author ??
    executor?.fio ??
    executor?.name ??
    `${executor?.last_name ?? ''} ${executor?.first_name ?? ''}`.trim() ??
    `User ${executor?.id ?? ''}`,

  /** Роль исполнителя (строка или объект с name) */
  role: executor?.role?.name ?? executor?.role ?? '',
});

/**
 * Получение ID исполнителя в "нормализованном" виде.
 *
 * @param entity — объект исполнителя (может иметь разные поля id/user_id/value/key)
 * @returns строковый/числовой идентификатор
 */
export const normalizeExecId = (entity: any) =>
  entity?.id ?? entity?.user_id ?? entity?.value ?? entity?.key;

/**
 * Перемещает указанный элемент (who) в начало списка по его id.
 *
 * @param list — исходный список элементов
 * @param who — объект, который нужно переместить в начало
 * @returns новый массив, где who стоит первым, остальные сохраняются в порядке, но без дубликата who
 */
export const putFirst = <T extends { id?: string | number }>(list: T[], who: T) => {
  const id = String(who?.id);
  if (!id) return list ?? [];

  /** Убираем элемент who из списка (если он там уже есть) */
  const filteredList = (list ?? []).filter((item: any) => String(item?.id) !== id);

  /** Возвращаем новый список: сначала who, затем остальные */
  return [who, ...filteredList];
};
