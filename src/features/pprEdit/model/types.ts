/**
 * Тип доступных виджетов для отображения поля.
 */
export type Widget = 'input' | 'textarea' | 'dropdown' | 'checkbox' | 'group';

/**
 * Описание конфигурации одного поля из YAML-схемы.
 */
export interface FieldCfg {
  key: string;
  /** Отображаемое имя поля */
  name: string;
  /** Тип виджета для рендера (input, textarea и т. д.) */
  widget: Widget;
  /** Позиция поля при сортировке */
  position?: number;
  /** Список опций для dropdown-поля  */
  options?: string[];
  /** Вложенные поля для группы (widget === "group") */
  fields?: Record<string, FieldCfg>;
}
