export type FieldKind = 'select' | 'textarea' | 'number' | 'boolean' | 'text';

export type StageFieldDef = {
  /** Ключ поля  */
  key?: string;
  /** Подпись рядом с контролом */
  label?: string;
  /** Тип */
  type?: string;
  /** Обязательное поле */
  required?: boolean;
  /** Значение по умолчанию */
  default?: any;
  enum?: any[];
  options?: any[];
  widget?: string;
  multiple?: boolean;

  /** Для number */
  min?: number;
  max?: number;
  step?: number;

  /** Вспомогательное */
  placeholder?: string;
  position?: number;
};
