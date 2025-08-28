import { Form, Input, InputNumber, Select } from 'antd';
import type { ReactNode } from 'react';

import { STAGE_PANEL_TEXT } from '@/shared/constants';
import type { FieldKind, StageFieldDef } from '@/shared/types/fieldRenderer/types';

/** нормализация типа */
export const normalizeType = (t?: string) => (t || '').toString().trim().toLowerCase();

/** определить общий вид поля */
export function resolveFieldKind(fd: StageFieldDef): FieldKind {
  const type = normalizeType(fd.type);
  const hasDropdown =
    fd.widget === 'dropdown' || Array.isArray(fd.enum) || Array.isArray(fd.options);
  if (hasDropdown) return 'select';
  if (type === 'memo') return 'textarea';
  if (type === 'int' || type === 'integer' || type === 'number') return 'number';
  if (type === 'boolean' || type === 'bool') return 'boolean';
  return 'text';
}

/** собрать опции для Select */
export function buildSelectOptions(fd: StageFieldDef) {
  const raw = (fd.enum || fd.options || []) as any[];
  return raw.map((opt) => {
    const label =
      typeof opt === 'object' && opt !== null
        ? (opt.label ?? opt.value ?? JSON.stringify(opt))
        : String(opt);
    const value =
      typeof opt === 'object' && opt !== null ? (opt.value ?? JSON.stringify(opt)) : String(opt);
    return { label: String(label), value: String(value) };
  });
}

/** реестр инпутов по kind */
const INPUTS_BY_KIND: Record<FieldKind, (fd: StageFieldDef) => ReactNode> = {
  select: (fd) => (
    <Select
      placeholder={STAGE_PANEL_TEXT.form.selectPlaceholder}
      options={buildSelectOptions(fd)}
    />
  ),
  textarea: () => <Input.TextArea autoSize={{ minRows: 4, maxRows: 12 }} />,
  number: () => <InputNumber style={{ width: '100%' }} />,
  boolean: () => <Select options={[...STAGE_PANEL_TEXT.booleanOptions]} />,
  text: () => <Input />,
};

/** единая обвязка Form.Item */
export function wrapFormItem(name: string, label: string, isRequired: boolean, node: ReactNode) {
  return (
    <Form.Item
      key={name}
      label={label}
      name={name}
      rules={
        isRequired
          ? [{ required: true, message: STAGE_PANEL_TEXT.common.requiredField }]
          : undefined
      }
    >
      {node}
    </Form.Item>
  );
}

/** финальный унифицированный рендер одного поля */
export function renderField(fd: StageFieldDef): ReactNode {
  const name = fd.key ?? '';
  if (!name) return null;
  const label = fd.label ?? name;
  const isRequired = Boolean(fd.required);
  const kind = resolveFieldKind(fd);
  const inputNode = INPUTS_BY_KIND[kind](fd);
  return wrapFormItem(name, label, isRequired, inputNode);
}
