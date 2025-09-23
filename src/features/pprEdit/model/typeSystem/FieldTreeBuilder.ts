/**
 * строитель декларативного дерева формы
 * Преобразует описание параметров (FieldCfg) + types.yaml
 * в декларативное дерево узлов (FieldNode), где каждый узел описывает
 * поле формы или интерфейсное поле.
 */

import type { FieldCfg } from '@/features/pprEdit/model/types';
import {StageFieldDef} from "@/shared/types/fieldRenderer/types";
import {COMPOSITE_TYPE_SET} from "@/shared/constants";
import {FieldNode} from "@/shared/types/fileNode/fileNode";

/** Результат "раскрытия" типа из types.yaml */
type ResolvedType = { base: string; enum?: any[]; format?: any };

/** Построение правил валидации для AntD Form */
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
  if (!hit) return { base: typeName };

  const typeEntry = hit.entry;

  /** если alias определён как массив -> enum */
  if (Array.isArray(typeEntry)) {
    return { base: 'string', enum: typeEntry };
  }
    /**
     * Если запись типа (typeEntry) — объект и у него есть поле enum (массив значений):
     * - Берём базовый тип (если явно указан type — строка, иначе "string")
     * - Возвращаем ResolvedType с base, enum и format
     */
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

/** вспомогательно: нормализация строкового типа */
const normalizeType = (type?: string) => (type || '').toString().trim().toLowerCase();

/** запись из types.yaml, поддержка ссылочных типов  */
function mergeWithTypeDef(schema: any, typesYaml?: any): any {
  const rawType = (schema?.type ?? '').toString().trim();
  const isRef = rawType.startsWith('^');
  const typeKey = isRef ? rawType.slice(1) : rawType;
  const hit = typesYaml ? findTypeEntry(typeKey, typesYaml) : null;
  const fromTypes = hit?.entry;

  if (!fromTypes || typeof fromTypes !== 'object') {
    return { ...schema, type: isRef ? typeKey : rawType };
  }
  return { ...(fromTypes as object), ...(schema as object), type: isRef ? typeKey : rawType };
}

/** собрать enum/options или любые другие типы из types.yaml */
function buildOptions(schema: any, typesYaml?: any): Array<{ label: string; value: any }> {
  const effective = mergeWithTypeDef(schema, typesYaml);
  const raw: any[] =
      (Array.isArray(effective?.enum) && effective.enum) ||
      (Array.isArray(effective?.options) && effective.options) ||
      (Array.isArray(effective?.check) && effective.check) ||
      (Array.isArray(effective?.radio) && effective.radio) ||
      (Array.isArray(schema?.enum) && schema.enum) ||
      (Array.isArray(schema?.check) && schema.check) ||
      (Array.isArray(schema?.radio) && schema.radio) ||
      [];
  const seen = new Set<string>();
  return raw
      .map((opt: any) => {
        const label =
            typeof opt === 'object' && opt !== null
                ? (opt.label ?? opt.value ?? JSON.stringify(opt))
                : String(opt);
        const value =
            typeof opt === 'object' && opt !== null ? (opt.value ?? JSON.stringify(opt)) : String(opt);
        return { label: String(label), value };
      })
      .filter((o) => {
        const key = String(o.value);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
}

/** Простой field (input/number/checkbox/select/textarea/radio) — единая реализация */
function pushSimpleFieldNode(
  nodes: FieldNode[],
  key: string,
  label: string,
  rawType: string,
  schema: any,
  required?: boolean,
  typesYaml?: any,
) {
    // спец. случай ^device → select без options (options придут на рендере)
    if (rawType === '^device') {
        nodes.push({
            kind: 'field',
            key,
            label,
            rawType,
            widget: 'select',
            rules: buildRules(required ?? schema?.required),
            placeholder: (schema?.placeholder as string) || undefined,
        });
        return;
    }

  const effective = mergeWithTypeDef(schema ?? {}, typesYaml);
  const explicitEnum = Array.isArray(schema?.enum) ? schema.enum : undefined;
  const resolved = resolveType(schema?.type ?? rawType, typesYaml);
  const finalEnum =
      explicitEnum ??
      resolved.enum ??
      (Array.isArray(effective?.options) ? effective.options : undefined) ??
      (Array.isArray((effective as any)?.check) ? (effective as any).check : undefined);
  const finalOptions = buildOptions({ ...effective, enum: finalEnum }, typesYaml);

    // radio
    const isRadioWidget =
        normalizeType((effective as any)?.widget) === 'radio' ||
        Array.isArray((effective as any)?.radio) ||
        Array.isArray((schema as any)?.radio) ||
        (Array.isArray((resolved as any)?.format)
            ? (resolved as any).format.map(normalizeType).includes('radio')
            : normalizeType((resolved as any)?.format) === 'radio');

    if (isRadioWidget) {
        const radioOptions = buildOptions(
            { ...effective, radio: (effective as any)?.radio ?? (schema as any)?.radio },
            typesYaml,
        );
        nodes.push({
            kind: 'field',
            key,
            label,
            rawType,
            widget: 'radio',
            options: radioOptions,
            rules: buildRules(required ?? schema?.required),
            placeholder: (effective?.placeholder as string) || undefined,
        });
        return;
    }

    // textarea (memo)
  if (normalizeType(effective?.type) === 'memo') {
    nodes.push({
      kind: 'field',
      key,
      label,
      rawType,
      widget: 'textarea',
      rules: buildRules(required ?? schema?.required),
      placeholder: (effective?.placeholder as string) || undefined,
    });
    return;
  }

  if (
      resolved.base === 'number' ||
      resolved.base === 'int' ||
      normalizeType(effective?.type) === 'number'
  ) {
    nodes.push({
      kind: 'field',
      key,
      label,
      rawType,
      widget: 'number',
      rules: buildRules(required ?? schema?.required),
      min: (effective?.min as number | undefined) ?? undefined,
      max: (effective?.max as number | undefined) ?? undefined,
      step: (effective?.step as number | undefined) ?? undefined,
      placeholder: (effective?.placeholder as string) || undefined,
    });
    return;
  }
  // boolean → checkbox
  if (resolved.base === 'boolean' || normalizeType(effective?.type) === 'boolean') {
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
  // dropdown (string + enum/options/check)
  const isDropdown =
      normalizeType(effective?.widget) === 'dropdown' ||
      (finalOptions && Array.isArray(finalOptions) && finalOptions.length > 0) ||
      Array.isArray((effective as any)?.check);
  if (isDropdown) {
    const isMultiple =
        Boolean(effective?.multiple) ||
        normalizeType(effective?.widget).includes('multi') ||
        Array.isArray((effective as any)?.check);

    nodes.push({
      kind: 'field',
      key,
      label,
      rawType,
      widget: 'select',
      options: finalOptions?.map((o) => ({ label: String(o.label), value: o.value })),
      rules: buildRules(required ?? schema?.required),
      multiple: isMultiple,
      placeholder: (effective?.placeholder as string) || undefined,
    });
    return;
  }
  // default: input
  nodes.push({
    kind: 'field',
    key,
    label,
    rawType,
    widget: 'input',
    rules: buildRules(required ?? schema?.required),
    placeholder: (effective?.placeholder as string) || undefined,
  });
}

/** Композитный (интерфейс-подобный) узел */
function pushCompositeNode(
    nodes: FieldNode[],
    key: string,
    label: string,
    typeKey: string,
    opts?: { multiple?: boolean },
) {
    const isIface = typeKey.startsWith('interface');
    nodes.push({
        kind: 'interface',
        key,
        label,
        requestType: isIface ? 'interface' : typeKey, // для routing — 'routing' и т.п.
        withVlan: typeKey === 'interface_with_vlan',
        multiple: !!opts?.multiple,
    });
}

/** Разворачивание структурного алиаса (объект вида { device, model, interfaces, ... }) */
function expandStructuredAlias(
    nodes: FieldNode[],
    baseKey: string,
    baseLabel: string,
    struct: Record<string, any>,
    required: boolean | undefined,
    typesYaml?: any,
) {
    // device
    if (struct.device) {
        const schema = struct.device;
        pushSimpleFieldNode(
            nodes,
            `${baseKey}.device`,
            `${baseLabel}: устройство`,
            String(schema?.type ?? '^device'),
            schema,
            required,
            typesYaml,
        );
    }

    // model
    if (struct.model) {
        const schema = struct.model;
        pushSimpleFieldNode(
          nodes,
          `${baseKey}.model`,
          `${baseLabel}: модель`,
          String(schema?.type ?? 'string'),
          schema,
          required,
          typesYaml,
        );
      }

      // interfaces (коллекция)
      if (
        struct.interfaces &&
        (normalizeType(struct.interfaces.type) === 'collection' ||
            normalizeType(struct.interfaces.type) === 'array' ||
            normalizeType(struct.interfaces.type) === 'list')
      ) {
        const inner =
            struct.interfaces.inner_type ?? struct.interfaces.items?.type ?? struct.interfaces.items;
        const innerType = String((typeof inner === 'string' ? inner : (inner?.type as string)) ?? '');

        if (COMPOSITE_TYPE_SET.has(innerType)) {
            pushCompositeNode(nodes, `${baseKey}.interfaces`, `${baseLabel}: интерфейсы`, innerType, {
                multiple: true,
            });
        } else {
            pushSimpleFieldNode(
                nodes,
                `${baseKey}.interfaces`,
                `${baseLabel}: интерфейсы`,
                'string',
                struct.interfaces,
                required,
                typesYaml,
            );
        }
    }

    // прочие под-поля структуры
    for (const subKey of Object.keys(struct)) {
        if (['device', 'model', 'interfaces'].includes(subKey)) continue;
        const schema = struct[subKey];
        if (!schema || typeof schema !== 'object') continue;

        const subType = String(schema?.type ?? 'string');
        if (COMPOSITE_TYPE_SET.has(subType)) {
            pushCompositeNode(nodes, `${baseKey}.${subKey}`, `${baseLabel}: ${subKey}`, subType);
        } else {
          pushSimpleFieldNode(
            nodes,
            `${baseKey}.${subKey}`,
            `${baseLabel}: ${subKey}`,
                subType,
            schema,
            required,
            typesYaml,
          );
        }
      }
}

/** ОБЩАЯ сборка узлов — для params и stages */
function buildNodesFromSpecs(specs: StageFieldDef[] = [], typesYaml?: any): { nodes: FieldNode[] } {
    const nodes: FieldNode[] = [];

    for (const spec of specs) {
        const key = String(spec.key ?? '').trim();
        if (!key) continue;
        const label = String(spec.label ?? spec.key);
        const typeKey = String(spec.type ?? 'string');

        // Композитный тип
        if (COMPOSITE_TYPE_SET.has(typeKey)) {
            pushCompositeNode(nodes, key, label, typeKey, { multiple: !!spec.multiple });
            continue;
        }

    // Структурный алиас
    const hit = typesYaml ? findTypeEntry(typeKey, typesYaml) : null;
    if (hit && isStructuredAlias(hit.entry)) {
            expandStructuredAlias(nodes, key, label, hit.entry as Record<string, any>, spec.required, typesYaml);
            continue;
        }

    pushSimpleFieldNode(
            nodes,
            key,
            label,
            typeKey,
            {
                type: typeKey,
                enum: spec.enum,
                options: spec.options,
                widget: spec.widget,
                min: spec.min,
                max: spec.max,
                step: spec.step,
                placeholder: spec.placeholder,
                required: spec.required,
                multiple: spec.multiple,
            },
            spec.required,
            typesYaml,
        );
    }
    return { nodes };
}

/** Универсальный нормализатор → StageFieldDef (и для params, и для stages) */
function toSpec(input: FieldCfg | (Partial<StageFieldDef> & { key: string })): StageFieldDef {
    const rawInput = input as any;
    const key = String(rawInput.key ?? rawInput.name ?? '').trim();
    const label = String(rawInput.label ?? rawInput.name ?? key);
    const type = String(rawInput.type ?? 'string');

    return {
        key,
        label,
        type,
        required: rawInput.required,
        enum: rawInput.enum,
        options: rawInput.options,
        widget: rawInput.widget,
        min: rawInput.min,
        max: rawInput.max,
        step: rawInput.step,
        placeholder: rawInput.placeholder,
        multiple: rawInput.multiple,
    };
}

/**  params → FieldNode[] */
export function buildFieldTree(params: FieldCfg[] = [], typesYaml?: any): { nodes: FieldNode[] } {
    const specs = (params ?? []).map(toSpec);
    return buildNodesFromSpecs(specs, typesYaml);
}

/** Те же узлы для stages → FieldNode[] */
export function buildFieldNodesFromStageFields(
    stageFields: ReadonlyArray<Partial<StageFieldDef> & { key: string }> = [],
    typesYaml?: any,
): { nodes: FieldNode[] } {
    const specs = (stageFields ?? []).map(toSpec);
    return buildNodesFromSpecs(specs, typesYaml);
}
