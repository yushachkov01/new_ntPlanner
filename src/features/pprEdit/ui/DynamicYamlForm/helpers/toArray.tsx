/**
 * Массив мета-ключей, которые не считаются пользовательскими полями.
 */
const META = ['key', 'name', 'widget', 'position', 'required', 'type', 'options', 'fields'];

import type { FieldCfg } from '@features/pprEdit/model/types';

/**
 * Преобразует вложенный узел (объект или массив) в упорядоченный массив конфигураций полей.
 * Отбрасывает поля с ключом "comment" и все meta-поля из META.
 *
 * @param node — входной узел: массив полей
 * @returns массив FieldCfg, отсортированный по свойству `position`
 */
export function toArray(node: any): FieldCfg[] {
  if (!node) return [];
  /**
   * Если пришёл сразу массив полей — фильтруем comment и сортируем по position
   */
  if (Array.isArray(node)) {
    return node
      .filter((f) => f.key !== 'comment')
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  }
  /**
   * Если узел содержит вложенное поле `fields` — рекурсивно обрабатываем его
   */
  if (node.fields) {
    return toArray(node.fields);
  }
  /**
   * Иначе — это объект, из которого берём все свойства, кроме мета- и comment,
   * приводим значения к FieldCfg и сортируем по position
   */
  return Object.entries(node)
    .filter(([k]) => !META.includes(k) && k !== 'comment')
    .map(([, v]) => v as FieldCfg)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
}
