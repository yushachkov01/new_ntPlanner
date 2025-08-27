export type FieldKind = 'select' | 'textarea' | 'number' | 'boolean' | 'text';

export type StageFieldDef = {
  key?: string;
  label?: string;
  type?: string;
  required?: boolean;
  default?: any;
  enum?: any[];
  position?: number;
  widget?: string;
  options?: any[];
};
