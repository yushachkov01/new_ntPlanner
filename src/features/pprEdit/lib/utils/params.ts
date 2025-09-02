/**
 * Утилиты для выборки и нормализации «строк параметров» (rows) из разных источников:
 */

import { templateStore } from '@/entities/template/model/store/templateStore';

import { deepSort } from './utils';

/**
 * Возвращает список ключей параметров (`params`) из сырого описания схемы YAML.
 *
 * Берёт массив `schemaRaw.params`, извлекает поле `key` у каждого элемента,
 * нормализует в строку и отбрасывает пустые значения.
 *
 * @param  schemaRaw - Сырые данные схемы YAML (как из файла шаблона).
 * @returns {string[]} Отфильтрованный список ключей параметров (ненулевые строки).
 */
export function getParamKeys(schemaRaw: any): string[] {
  const paramsArray = Array.isArray(schemaRaw?.params) ? schemaRaw.params : [];
  return paramsArray.map((paramItem: any) => String(paramItem?.key ?? '').trim()).filter(Boolean);
}

/**
 * Проверяет, выглядит ли переданный объект как «строка параметров».
 *
 * Если список ключей пустой — считает, что строка валидна (true).
 * Иначе — валидно, если в объекте присутствует хотя бы один из `paramKeys`.
 *
 * @param  candidate - Проверяемый объект.
 * @param {string[]} paramKeys - Список ключей параметров.
 * @returns {boolean} Признак того, что объект похож на строку параметров.
 */
export function looksLikeParamRow(candidate: any, paramKeys: string[]): boolean {
  if (!candidate || typeof candidate !== 'object') return false;
  if (!Array.isArray(paramKeys) || paramKeys.length === 0) return true;
  return paramKeys.some((key) => candidate[key] != null);
}

/**
 *
 * Используется для дедупликации одинаковых строк: выбирает только поля
 * из `paramKeys`
 *
 * @param {any} row - Строка параметров.
 * @param {string[]} paramKeys - Ключи параметров, которые надо учесть.
 * @returns {string} Детерминированная подпись (JSON-строка).
 */
export function rowParamSignature(row: any, paramKeys: string[]): string {
  const pickedFields: any = {};
  for (const key of paramKeys) {
    if (row && Object.prototype.hasOwnProperty.call(row, key)) {
      pickedFields[key] = row[key];
    }
  }
  return JSON.stringify(deepSort(pickedFields));
}

/**
 *  забрает строки параметров
 * @param  schemaRaw - Сырые данные схемы YAML.
 * @param {string} [templateKey] - Ключ (имя) текущего YAML-шаблона.
 * @returns {any[]} Массив строк параметров или пустой массив.
 */
function getRowsFromTemplateStorePrioritized(schemaRaw: any, templateKey?: string): any[] {
  const storeState = templateStore.getState() as any;
  const getTemplateValues = storeState?.getTemplateValues?.bind(storeState);
  if (typeof getTemplateValues !== 'function') return [];

  const preferredKeys: string[] = [];
  if (templateKey) preferredKeys.push(String(templateKey));
  if (schemaRaw?.headline) preferredKeys.push(String(schemaRaw.headline));
  preferredKeys.push('main', 'default');

  for (const key of preferredKeys) {
    const candidateValues = getTemplateValues(key) ?? [];
    if (Array.isArray(candidateValues) && candidateValues.length) return [...candidateValues];
  }
  return [];
}

/**
 *  поиск потенциальных строк параметров
 * @param {string[]} paramKeys - Ключи параметров для проверки.
 * @returns {any[]} Найденные строки параметров.
 */
function deepScanTemplateStore(paramKeys: string[]): any[] {
  const storeState = templateStore.getState() as any;
  const collectedRows: any[] = [];
  const seenCollections = new Set<any>();

  const traverse = (node: any, depth = 0) => {
    if (!node || typeof node !== 'object' || depth > 4) return;

    /** массив объектов — собираем кандидатов */
    if (
      Array.isArray(node) &&
      node.length &&
      node.every((elem) => elem && typeof elem === 'object')
    ) {
      if (!seenCollections.has(node)) {
        seenCollections.add(node);
        collectedRows.push(...node.filter((row) => looksLikeParamRow(row, paramKeys)));
      }
      return;
    }
    for (const childValue of Object.values(node)) traverse(childValue, depth + 1);
  };

  try {
    traverse(storeState, 0);
  } catch {
    // fail-safe
  }
  return collectedRows;
}

/**
 * Пытается извлечь строки параметров непосредственно из значений формы.
 * @param  formValues - Значения формы (как они есть).
 * @param {string[]} paramKeys - Ключи параметров для проверки.
 * @returns {any[]} Выбранные строки параметров или пустой массив.
 */
function pickRowsFromFormValues(formValues: any, paramKeys: string[]): any[] {
  if (!formValues) return [];

  if (Array.isArray(formValues) && formValues.every((elem) => elem && typeof elem === 'object')) {
    return formValues.filter((row) => looksLikeParamRow(row, paramKeys));
  }

  // formValues.rows — массив строк
  const rowsMaybe = (formValues as any)?.rows;
  if (
    Array.isArray(rowsMaybe) &&
    rowsMaybe.every((elem: any) => elem && typeof elem === 'object')
  ) {
    return rowsMaybe.filter((row: any) => looksLikeParamRow(row, paramKeys));
  }

  if (typeof formValues === 'object') {
    let bestArray: any[] | null = null;
    for (const value of Object.values(formValues)) {
      if (
        Array.isArray(value) &&
        value.length &&
        value.every((elem) => elem && typeof elem === 'object')
      ) {
        if (!bestArray || value.length > bestArray.length) bestArray = value;
      }
    }
    if (bestArray) return bestArray.filter((row) => looksLikeParamRow(row, paramKeys));
  }

  // одиночный объект, похожий на строку параметров
  if (typeof formValues === 'object' && looksLikeParamRow(formValues, paramKeys)) {
    return [formValues];
  }

  return [];
}

/**
 * Собирает итоговый список строк параметров в порядке приоритетов
 * Удаляет дубликаты
 * @param {any} schemaRaw - Сырые данные схемы YAML.
 * @param {string | undefined} templateKey - Ключ активного шаблона.
 * @param {any} formValues - Значения формы для fallback.
 * @returns {any[]} Уникальные строки параметров, готовые к использованию.
 */
export function collectAllParamRows(
  schemaRaw: any,
  templateKey: string | undefined,
  formValues: any,
): any[] {
  const paramKeys = getParamKeys(schemaRaw);

  // по приоритетам
  let rows: any[] = getRowsFromTemplateStorePrioritized(schemaRaw, templateKey);

  // значения формы
  if (!rows.length) rows = pickRowsFromFormValues(formValues, paramKeys);

  if (!rows.length) rows = deepScanTemplateStore(paramKeys);

  const seenSignatures = new Set<string>();
  const resultRows: any[] = [];

  for (const rawRow of rows) {
    const sanitizedRow: any = {};
    Object.entries(rawRow ?? {}).forEach(([key, value]) => {
      if (key === '__sourceKey') return;
      sanitizedRow[key] = value;
    });

    if (!looksLikeParamRow(sanitizedRow, paramKeys)) continue;
    const signature = rowParamSignature(sanitizedRow, paramKeys);
    if (signature === '{}') continue;
    if (!seenSignatures.has(signature)) {
      seenSignatures.add(signature);
      resultRows.push(sanitizedRow);
    }
  }

  return resultRows;
}
