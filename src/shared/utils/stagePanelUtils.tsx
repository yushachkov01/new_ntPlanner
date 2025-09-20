import { Form, Input, InputNumber, Select } from 'antd';
import type { ReactNode } from 'react';

import { STAGE_PANEL_TEXT } from '@/shared/constants';
import type { FieldKind, StageFieldDef } from '@/shared/types/fieldRenderer/types';
import { buildFieldTree, type FieldNode } from '@/features/pprEdit/model/typeSystem/FieldTreeBuilder';
import type { FieldCfg } from '@/features/pprEdit/model/types';
import { DeclarativeFormRenderer } from '@/features/pprEdit/ui/DeclarativeFormRenderer/DeclarativeFormRenderer';

/** Словарь типов */
export type TypesDict = Record<string, any>;

/** нормализация типа */
export const normalizeType = (types?: string) => (types || '').toString().trim().toLowerCase();

/** Адаптер: StageFieldDef -> FieldCfg (минимально необходимое) */
function stageFieldToFieldCfg(fd: StageFieldDef): FieldCfg {
  return {
    key: (fd as any).key,
    label: (fd as any).label,
    type: (fd as any).type,
    enum: (fd as any).enum,
    widget: (fd as any).widget,
    required: (fd as any).required,
    min: (fd as any).min,
    max: (fd as any).max,
    step: (fd as any).step,
    placeholder: (fd as any).placeholder,
    multiple: (fd as any).multiple,
    options: (fd as any).options,
  } as any;
}

/** Достаём единственный FieldNode для поля этапа через общий билдер */
function fieldNodeFromStage(fd: StageFieldDef, types?: TypesDict): FieldNode | null {
  const asCfg = stageFieldToFieldCfg(fd);
  const { nodes } = buildFieldTree([asCfg] as any, types);
  return nodes[0] ?? null;
}

/**  мердж inline-определения поля со схемой из types.yaml (для placeholder/min/max и тд) */
const mergeWithTypeDef = (fd: StageFieldDef, types?: TypesDict): StageFieldDef => {
  const rawType = (fd.type ?? '').toString().trim();
  const isRef = rawType.startsWith('^');
  const typeKey = isRef ? rawType.slice(1) : rawType;
  const dict = (types && (types.types || types)) || {};
  const fromTypes = dict?.[typeKey];
  if (!fromTypes || typeof fromTypes !== 'object') {
    return { ...fd, type: isRef ? typeKey : rawType };
  }
  return { ...(fromTypes as object), ...(fd as object), type: isRef ? typeKey : rawType } as StageFieldDef;
};

/** определить общий вид поля */
export function resolveFieldKind(fd: StageFieldDef, types?: TypesDict): FieldKind {
  const node = fieldNodeFromStage(fd, types);
  if (!node) return 'text';

  // интерфейс рендерим не  input/select, а отдельным компонентом
  if (node.kind === 'interface') return 'text';

  switch ((node as any).widget) {
    case 'select':
      return 'select';
    case 'textarea':
      return 'textarea';
    case 'number':
      return 'number';
    case 'checkbox':
      return 'boolean';
    default:
      return 'text';
  }
}

/** собрать опции для Select */
export function buildSelectOptions(fd: StageFieldDef, types?: TypesDict) {
  const node = fieldNodeFromStage(fd, types);
  if (!node || node.kind !== 'field') return [];
  const raw = node.options ?? [];
  return raw.map((key) => ({ label: String(key.label), value: String(key.value) }));
}

/** реестр инпутов по kind */
const INPUTS_BY_KIND: Record<FieldKind, (fd: StageFieldDef, types?: TypesDict) => ReactNode> = {
  select: (fd, types) => {
    const node = fieldNodeFromStage(fd, types);
    const effective = mergeWithTypeDef(fd, types);
    const isMultiple =
        Boolean((node as any)?.multiple) ||
        Boolean((effective as any)?.multiple) ||
        normalizeType((effective as any)?.widget).includes('multi') ||
        normalizeType((effective as any)?.type).includes('multi');

    return (
      <Select
        mode={isMultiple ? ('multiple' as const) : undefined}
        allowClear
        showSearch
        placeholder={
        ((node as any)?.placeholder as any) ||
        ((effective as any)?.placeholder as any) ||
        STAGE_PANEL_TEXT?.form?.selectPlaceholder
}
        options={buildSelectOptions(fd, types)}
        filterOption={(input, option) =>
          (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
        }
      />
    );
  },
  textarea: (fd, types) => {
    const node = fieldNodeFromStage(fd, types);
    const effective = mergeWithTypeDef(fd, types);
    return (
        <Input.TextArea
            autoSize={{ minRows: 4, maxRows: 12 }}
            placeholder={((node as any)?.placeholder as any) || ((effective as any)?.placeholder as any) || undefined}
        />
    );
  },
  number: (fd, types) => {
    const node = fieldNodeFromStage(fd, types);
    const effective = mergeWithTypeDef(fd, types);
    return (
        <InputNumber
            style={{ width: '100%' }}
            min={((node as any)?.min as number | undefined) ?? ((effective as any)?.min as number | undefined) ?? undefined}
            max={((node as any)?.max as number | undefined) ?? ((effective as any)?.max as number | undefined) ?? undefined}
            step={((node as any)?.step as number | undefined) ?? ((effective as any)?.step as number | undefined) ?? undefined}
            placeholder={((node as any)?.placeholder as any) || ((effective as any)?.placeholder as any) || undefined}
        />
    );
  },
  boolean: () => <Select options={[...STAGE_PANEL_TEXT.booleanOptions]} />,
  text: (fd, types) => {
    const node = fieldNodeFromStage(fd, types);
    const effective = mergeWithTypeDef(fd, types);
    return <Input placeholder={((node as any)?.placeholder as any) || ((effective as any)?.placeholder as any) || undefined} />;
  },
};

/** единая обвязка Form.Item */
export function wrapFormItem(name: string, label: string, isRequired: boolean, node: ReactNode) {
  return (
      <Form.Item
          key={name}
          label={label}
          name={name}
          rules={isRequired ? [{ required: true, message: STAGE_PANEL_TEXT.common.requiredField }] : undefined}
      >
        {node}
      </Form.Item>
  );
}

/** финальный унифицированный рендер одного поля */
export function renderField(fd: StageFieldDef, types?: TypesDict): ReactNode {
  const name = fd.key ?? '';
  if (!name) return null;

  const node = fieldNodeFromStage(fd, types);
  const effective = mergeWithTypeDef(fd, types);

  if (node?.kind === 'interface') {
    return <DeclarativeFormRenderer nodes={[node]} />;
  }

  const label = String((node?.kind === 'field' ? (node as any).label : (effective as any).label ?? name) as string);
  const isRequired =
      Boolean((effective as any)?.required) ||
      Boolean(node?.kind === 'field' && (node as any)?.rules?.some((r: any) => r?.required));

  const kind = resolveFieldKind(fd, types);
  const inputNode = (INPUTS_BY_KIND[kind] ?? INPUTS_BY_KIND.text)(fd, types);
  return wrapFormItem(name, label, isRequired, inputNode);
}
