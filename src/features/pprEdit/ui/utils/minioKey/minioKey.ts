/**
 * Склеивание ключа (путь/имя файла) для использования в бакете MinIO.
 * Убирает лишние слэши и формирует корректный путь в формате:
 *   "prefix/name"
 * Если префикс пустой — возвращает только имя файла.
 */

/**
 * Формирует корректный ключ объекта для MinIO из префикса и имени файла.
 *
 * @param prefixStr - префикс (папка или путь внутри бакета)
 * @param name - имя файла или объекта
 * @returns строка с корректно склеенным ключом
 */
export const joinKey = (prefixStr?: string, name?: string): string => {
  /** Нормализованный префикс: удаляем ведущие/конечные слэши */
  const normalizedPrefix = (prefixStr ?? '').replace(/^\/+|\/+$/g, '');

  /** Нормализованное имя файла: удаляем ведущие слэши */
  const normalizedName = (name ?? '').replace(/^\/+/, '');

  /** Склейка: если есть префикс — "prefix/name", иначе просто "name" */
  return normalizedPrefix ? `${normalizedPrefix}/${normalizedName}` : normalizedName;
};
