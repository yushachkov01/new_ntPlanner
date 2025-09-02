/**
 * Регулярное выражение для проверки строкового UUID
 * Соответствует шаблону: 8-4-4-4-12 шестнадцатеричных символов.
 */
export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Проверяет, является ли переданное значение строкой-UUID.
 *
 * @param value Значение для проверки.
 * @returns `true`, если `value` — строка и проходит проверку по `UUID_RE`; иначе `false`.
 */
export const isUuid = (value: unknown): value is string =>
  typeof value === 'string' && UUID_RE.test(value);

/**
 * Возвращает первый валидный UUID из переданного набора значений.
 */
export const pickUuid = (...values: unknown[]) => values.find(isUuid) as string | undefined;

/**
 * Универсальная проверка «пустоты» значения.
 *
 * @param value Проверяемое значение.
 * @returns `true`, если значение считается пустым; иначе `false`.
 */
export function isEmptyValue(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (typeof value === 'boolean') return value === false;
  if (typeof value === 'number') return Number.isNaN(value);
  if (value instanceof Date) return Number.isNaN(+value);
  if (Array.isArray(value)) return value.length === 0 || value.every(isEmptyValue);
  if (typeof value === 'object') {
    const asObject = value as Record<string, unknown>;
    const objectValues = Object.values(asObject);
    return objectValues.length === 0 || objectValues.every(isEmptyValue);
  }
  return false;
}

/**
 *  сортирует объект по ключам.
 *
 * @param input Любое значение (объект/массив/примитив).
 * @returns Детально отсортированная копия для объектов/массивов или исходное значение для примитивов.
 */
export function deepSort(input: any): any {
  if (Array.isArray(input)) return input.map(deepSort);

  if (input && typeof input === 'object') {
    return Object.keys(input)
      .sort()
      .reduce((result: any, key: string) => {
        result[key] = deepSort(input[key]);
        return result;
      }, {});
  }
  return input;
}
