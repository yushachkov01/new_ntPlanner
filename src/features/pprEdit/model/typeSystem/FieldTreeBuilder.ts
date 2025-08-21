/**
 * строитель декларативного дерева формы
 * Преобразует описание параметров (FieldCfg) + types.yaml
 * в декларативное дерево узлов (FieldNode), где каждый узел описывает
 * поле формы или интерфейсное поле.
 */

import type { Rule } from 'antd/es/form';

import type { FieldCfg } from '@/features/pprEdit/model/types';

/**
 * Узел декларативного дерева (FieldTree).
 * Может быть:
 *  - простое поле (field)
 *  - интерфейс (interface)
 */
export type FieldNode =
  | {
      kind: 'field';
      key: string;
      label: string;
      rawType: string;
      widget: 'input' | 'number' | 'checkbox' | 'select';
      options?: Array<{ label: string; value: any }>;
      rules?: Rule[];
    }
  | {
      kind: 'interface';
      key: string;
      label: string;
      requestType?: string;
      withVlan?: boolean;
      /** множественный выбор интерфейсов (для коллекций) */
      multiple?: boolean;
    };

/** Результат "раскрытия" типа из types.yaml */
type ResolvedType = { base: string; enum?: any[]; format?: any };

/**
 * Построение правил валидации для AntD Form
 *
 * @param required — обязательное ли поле
 * @returns массив правил или undefined
 */
function buildRules(required?: boolean) {
  if (!required) return undefined;
  return [{ required: true, message: 'Обязательное поле' }];
}

/**
 * Безопасное преобразование объекта в словарь (dict).
 *
 * @param obj — входное значение
 * @returns объект-словарь или undefined
 */
const asDict = (obj: any): Record<string, any> | undefined =>
  obj && typeof obj === 'object' ? (obj as Record<string, any>) : undefined;
/**
 * Извлечение словаря типов из types.yaml
 *
 * @param typesYaml — YAML объект
 * @returns словарь типов
 */
function getTypesDict(typesYaml: any): Record<string, any> | undefined {
  if (!typesYaml) return undefined;
  if (typesYaml.types && typeof typesYaml.types === 'object') return asDict(typesYaml.types);
  return asDict(typesYaml);
}

/**
 * Извлечение словаря enums из types.yaml
 *
 * @param typesYaml — YAML объект
 * @returns словарь перечислений
 */
function getEnumsDict(typesYaml: any): Record<string, any> | undefined {
  if (!typesYaml) return undefined;
  if (typesYaml.enums && typeof typesYaml.enums === 'object') return asDict(typesYaml.enums);
  return undefined;
}

/**
 * Поиск записи типа по имени (с поддержкой case-insensitive + snake/camel case).
 *
 * @param name — имя типа
 * @param typesYaml — YAML объект
 * @returns найденная запись и ключ или null
 */
function findTypeEntry(name: string, typesYaml: any): { entry: any; key: string } | null {
  const typeDict = getTypesDict(typesYaml) ?? {};
  const enumsDict = getEnumsDict(typesYaml) ?? {};
  const nameLc = name.toLowerCase();
  const nameUnderscore = name.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase()).toLowerCase();

  /** прямое совпадение */
  if (typeDict[name]) return { entry: typeDict[name], key: name };

  const matchFromTypes = Object.keys(typeDict).find(
    (key) => key.toLowerCase() === nameLc || key.toLowerCase() === nameUnderscore,
  );
  if (matchFromTypes) return { entry: typeDict[matchFromTypes], key: matchFromTypes };

  /** плоский словарь верхнего уровня */
  if (typesYaml[name]) return { entry: typesYaml[name], key: name };
  const matchFlat = Object.keys(typesYaml).find(
    (key) => key !== 'types' && key !== 'enums' && key.toLowerCase() === nameLc,
  );
  if (matchFlat) return { entry: typesYaml[matchFlat], key: matchFlat };

  /** enums как отдельная секция */
  if (enumsDict[name]) return { entry: enumsDict[name], key: name };
  const matchEnum = Object.keys(enumsDict).find(
    (key) => key.toLowerCase() === nameLc || key.toLowerCase() === nameUnderscore,
  );
  if (matchEnum) return { entry: enumsDict[matchEnum], key: matchEnum };

  return null;
}

/**
 * Рекурсивное «раскрытие» alias-цепочки.
 *
 * @param typeName — имя типа
 * @param typesYaml — YAML со схемой типов
 * @param guard — защита от циклов (счётчик глубины)
 * @returns ResolvedType — базовый тип + enum + формат
 */
function resolveType(typeName: string, typesYaml?: any, guard = 0): ResolvedType {
  if (!typeName) return { base: 'string' };
  if (!typesYaml) return { base: typeName };
  if (guard > 32) return { base: typeName };
  const hit = findTypeEntry(typeName, typesYaml);

  if (!hit) {
    return { base: typeName };
  }

  const typeEntry = hit.entry;

  /** если alias определён как массив -> enum */
  if (Array.isArray(typeEntry)) {
    return { base: 'string', enum: typeEntry };
  }

  if (typeEntry && typeof typeEntry === 'object' && Array.isArray(typeEntry.enum)) {
    const base = typeof typeEntry.type === 'string' ? typeEntry.type : 'string';
    return { base, enum: typeEntry.enum, format: typeEntry.format };
  }

  if (typeEntry && typeof typeEntry === 'object' && typeof typeEntry.type === 'string') {
    const deeper = resolveType(String(typeEntry.type), typesYaml, guard + 1);
    return {
      base: deeper.base,
      enum: Array.isArray(typeEntry.enum) ? typeEntry.enum : deeper.enum,
      format: typeEntry.format ?? deeper.format,
    };
  }
  return { base: 'string' };
}

const isStructuredAlias = (entry: any) =>
  !!entry &&
  typeof entry === 'object' &&
  !Array.isArray(entry) &&
  !('type' in entry) &&
  !('enum' in entry);

/**
 * Добавить field-узел по простому типу / enum
 */
function pushSimpleFieldNode(
  nodes: FieldNode[],
  key: string,
  label: string,
  rawType: string,
  schema: any,
  required?: boolean,
  typesYaml?: any,
) {
  const explicitEnum = Array.isArray(schema?.enum) ? schema.enum : undefined;
  const resolved = resolveType(schema?.type ?? rawType, typesYaml);
  const finalEnum = explicitEnum ?? resolved.enum;

  if (resolved.base === 'number' || resolved.base === 'int') {
    nodes.push({
      kind: 'field',
      key,
      label,
      rawType,
      widget: 'number',
      rules: buildRules(required ?? schema?.required),
    });
    return;
  }
  if (resolved.base === 'boolean') {
    nodes.push({
      kind: 'field',
      key,
      label,
      rawType,
      widget: 'checkbox',
      rules: buildRules(required ?? schema?.required),
    });
    return;
  }
  if (finalEnum && finalEnum.length) {
    nodes.push({
      kind: 'field',
      key,
      label,
      rawType,
      widget: 'select',
      options: finalEnum.map((v: any) => ({ label: String(v), value: v })),
      rules: buildRules(required ?? schema?.required),
    });
    return;
  }
  nodes.push({
    kind: 'field',
    key,
    label,
    rawType,
    widget: 'input',
    rules: buildRules(required ?? schema?.required),
  });
}

/**
 * Главная функция: строит декларативное дерево (FieldTree) из параметров.
 *
 * @param params — массив параметров конфигурации
 * @param typesYaml — объект types.yaml для резолвинга alias и enum
 * @returns FieldTree — массив узлов
 */
export function buildFieldTree(params: FieldCfg[] = [], typesYaml?: any): { nodes: FieldNode[] } {
  const nodes: FieldNode[] = [];

  for (const param of params) {
    const key = String((param as any).key ?? (param as any).name ?? '');
    const label = String((param as any).label ?? (param as any).name ?? key);
    const paramType = String((param as any).type ?? 'string');

    if (paramType === 'interface' || paramType === 'interface_with_vlan') {
      nodes.push({
        kind: 'interface',
        key,
        label,
        requestType: 'interface',
        withVlan: paramType === 'interface_with_vlan',
      });
      continue;
    }

    if (paramType === '^device') {
      nodes.push({
        kind: 'field',
        key,
        label,
        rawType: paramType,
        widget: 'select',
        rules: buildRules((param as any).required),
      });
      continue;
    }

    const hit = typesYaml ? findTypeEntry(paramType, typesYaml) : null;

    if (hit && isStructuredAlias(hit.entry)) {
      const struct = hit.entry as Record<string, any>;

      // device
      if (struct.device) {
        const schema = struct.device;
        if (schema?.type === '^device') {
          nodes.push({
            kind: 'field',
            key: `${key}.device`,
            label: `${label}: устройство`,
            rawType: '^device',
            widget: 'select',
            rules: buildRules(schema?.required ?? (param as any).required),
          });
        } else {
          pushSimpleFieldNode(
            nodes,
            `${key}.device`,
            `${label}: устройство`,
            String(schema?.type ?? 'string'),
            schema,
            (param as any).required,
            typesYaml,
          );
        }
      }

      // model
      if (struct.model) {
        const schema = struct.model;
        pushSimpleFieldNode(
          nodes,
          `${key}.model`,
          `${label}: модель`,
          String(schema?.type ?? 'string'),
          schema,
          (param as any).required,
          typesYaml,
        );
      }

      // interfaces
      if (
        struct.interfaces &&
        (struct.interfaces.type === 'collection' || struct.interfaces.type === 'array')
      ) {
        const inner = struct.interfaces.inner_type ?? struct.interfaces.items?.type;
        const innerType = String(inner ?? '');

        if (innerType === 'interface' || innerType === 'interface_with_vlan') {
          nodes.push({
            kind: 'interface',
            key: `${key}.interfaces`,
            label: `${label}: интерфейсы`,
            requestType: 'interface',
            withVlan: innerType === 'interface_with_vlan',
            multiple: true, // ключевой флаг
          });
        } else {
          nodes.push({
            kind: 'field',
            key: `${key}.interfaces`,
            label: `${label}: интерфейсы`,
            rawType: 'string',
            widget: 'input',
            rules: buildRules(struct.interfaces?.required ?? (param as any).required),
          });
        }
      }
      for (const subKey of Object.keys(struct)) {
        if (['device', 'model', 'interfaces'].includes(subKey)) continue;
        const schema = struct[subKey];
        if (schema && typeof schema === 'object') {
          pushSimpleFieldNode(
            nodes,
            `${key}.${subKey}`,
            `${label}: ${subKey}`,
            String(schema?.type ?? 'string'),
            schema,
            (param as any).required,
            typesYaml,
          );
        }
      }

      continue;
    }

    /** Резолвим alias из types.yaml */
    const resolved = resolveType(paramType, typesYaml);
    const explicitEnum = Array.isArray((param as any).enum) ? (param as any).enum : undefined;
    const finalEnum = explicitEnum ?? resolved.enum;

    /** string + enum -> select */
    if (resolved.base === 'string') {
      if (finalEnum && finalEnum.length) {
        nodes.push({
          kind: 'field',
          key,
          label,
          rawType: paramType,
          widget: 'select',
          options: finalEnum.map((value: any) => ({ label: String(value), value })),
          rules: buildRules((param as any).required),
        });
      } else {
        nodes.push({
          kind: 'field',
          key,
          label,
          rawType: paramType,
          widget: 'input',
          rules: buildRules((param as any).required),
        });
      }
      continue;
    }

    /** number / int */
    if (resolved.base === 'number' || resolved.base === 'int') {
      nodes.push({
        kind: 'field',
        key,
        label,
        rawType: paramType,
        widget: 'number',
        rules: buildRules((param as any).required),
      });
      continue;
    }

    // boolean
    if (resolved.base === 'boolean') {
      nodes.push({
        kind: 'field',
        key,
        label,
        rawType: paramType,
        widget: 'checkbox',
        rules: buildRules((param as any).required),
      });
      continue;
    }

    // Фолбэк: string (input)
    nodes.push({
      kind: 'field',
      key,
      label,
      rawType: paramType,
      widget: 'input',
      rules: buildRules((param as any).required),
    });
  }

  return { nodes };
}
