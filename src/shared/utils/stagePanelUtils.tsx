import { Form, Input, InputNumber, Select } from 'antd';
import type { ReactNode } from 'react';

import { STAGE_PANEL_TEXT } from '@/shared/constants';
import type { FieldKind, StageFieldDef } from '@/shared/types/fieldRenderer/types';

/** Словарь типов */
export type TypesDict = Record<string, any>;

/** нормализация типа */
export const normalizeType = (t?: string) => (t || '').toString().trim().toLowerCase();

/** достать определение типа из types.yaml по имени поля */
const pickTypeDef = (fd: StageFieldDef, types?: TypesDict) => types?.[String(fd.type ?? '').trim()];

/** определить общий вид поля */
export function resolveFieldKind(fd: StageFieldDef, types?: TypesDict): FieldKind {
  const type = normalizeType(fd.type);
  const def = pickTypeDef(fd, types);
  const hasDropdown =
    normalizeType(fd.widget) === 'dropdown' ||
    Array.isArray(fd.enum) ||
    Array.isArray(fd.options) ||
    Array.isArray(def?.enum) ||
    Array.isArray(def?.options);

  if (hasDropdown) return 'select';
  if (type === 'memo' || normalizeType(def?.type) === 'memo') return 'textarea';
  if (
    type === 'int' ||
    type === 'integer' ||
    type === 'number' ||
    normalizeType(def?.type) === 'number'
  )
    return 'number';
  if (type === 'boolean' || type === 'bool' || normalizeType(def?.type) === 'boolean')
    return 'boolean';
  return 'text';
}

/** собрать опции для Select */
export function buildSelectOptions(fd: StageFieldDef, types?: TypesDict) {
  const def = pickTypeDef(fd, types);
  const raw = (fd.enum || fd.options || def?.enum || def?.options || []) as any[];
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
const INPUTS_BY_KIND: Record<FieldKind, (fd: StageFieldDef, types?: TypesDict) => ReactNode> = {
  select: (fd, t) => {
    const mode =
      fd.multiple ||
      normalizeType(fd.widget).includes('multi') ||
      normalizeType(fd.type).includes('multi')
        ? ('multiple' as const)
        : undefined;

    return (
      <Select
        mode={mode}
        allowClear
        showSearch
        placeholder={(fd.placeholder as any) || STAGE_PANEL_TEXT?.form?.selectPlaceholder}
        options={buildSelectOptions(fd, t)}
        filterOption={(input, option) =>
          (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
        }
      />
    );
  },
  textarea: (fd) => (
    <Input.TextArea
      autoSize={{ minRows: 4, maxRows: 12 }}
      placeholder={(fd.placeholder as any) || undefined}
    />
  ),
  number: (fd) => (
    <InputNumber
      style={{ width: '100%' }}
      min={fd.min as number | undefined}
      max={fd.max as number | undefined}
      step={fd.step as number | undefined}
      placeholder={(fd.placeholder as any) || undefined}
    />
  ),
  boolean: () => <Select options={[...STAGE_PANEL_TEXT.booleanOptions]} />,
  text: (fd) => <Input placeholder={(fd.placeholder as any) || undefined} />,
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
export function renderField(fd: StageFieldDef, types?: TypesDict): ReactNode {
  const name = fd.key ?? '';
  if (!name) return null;
  const label = String(fd.label ?? name);
  const isRequired = Boolean(fd.required);
  const kind = resolveFieldKind(fd, types);
  const inputNode = (INPUTS_BY_KIND[kind] ?? INPUTS_BY_KIND.text)(fd, types);
  return wrapFormItem(name, label, isRequired, inputNode);
}
