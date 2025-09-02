import { isEmptyValue } from './utils';

/**
 * Строит список всех достижимых стадий
 *
 * @param {any} schemaRaw Сырая схема YAML-шаблона (`stages`, `start`/`current_stages` и пр.).
 * @returns {{ stageOrder: string[]; stagesDict: Record<string, any> }}
 */
export function computeAllReachableStages(schemaRaw: any): {
  stageOrder: string[];
  stagesDict: Record<string, any>;
} {
  const stagesDict: Record<string, any> = schemaRaw?.stages ?? {};
  const startKey: string | undefined = schemaRaw?.start ?? schemaRaw?.current_stages ?? undefined;

  const stageOrder: string[] = [];
  const visited = new Set<string>();

  /** Добавляет стадию в порядок, если её ещё не было. */
  const pushStageUnique = (stageKey: string) => {
    if (!visited.has(stageKey)) {
      visited.add(stageKey);
      stageOrder.push(stageKey);
    }
  };

  /**
   * Возвращает список следующих стадий
   * учитываются ветви `if_success` и `if_failure`.
   */
  function collectNextStageKeys(stageMeta: any): string[] {
    const accumulator: string[] = [];

    const appendCandidate = (value: any) => {
      if (!value) return;

      if (typeof value === 'string') {
        // фильтр: не «exit»
        if (value !== 'exit' && stagesDict[value]) accumulator.push(value);
      } else if (Array.isArray(value)) {
        value.forEach((item) => appendCandidate(item));
      }
    };

    appendCandidate(stageMeta?.if_success);
    appendCandidate(stageMeta?.if_failure);
    return accumulator;
  }

  /** обход графа стадий, начиная с указанного ключа. */
  const traverseFromStage = (stageKey: string) => {
    if (!stageKey || visited.has(stageKey) || !stagesDict[stageKey]) return;

    pushStageUnique(stageKey);

    const stageMeta = stagesDict[stageKey] ?? {};
    for (const nextKey of collectNextStageKeys(stageMeta)) {
      traverseFromStage(nextKey);
    }
  };

  //  сначала обходим от стартовой точки (если задана)
  if (startKey && stagesDict[startKey]) traverseFromStage(startKey);

  //  затем добавляем «висящие» стадии (если они не покрылись обходом)
  Object.keys(stagesDict).forEach((key) => traverseFromStage(key));

  return { stageOrder, stagesDict };
}

/**
 * Собирает множество всех ключей полей, встречающихся в `stagesDict[*].fields`.
 *
 * @param {Record<string, any>} stagesDict Словарь стадий.
 * @returns {Set<string>} Множество ключей полей (для фильтрации/исключения при сборке args).
 */
export function collectStageFieldKeys(stagesDict: Record<string, any>): Set<string> {
  const fieldKeys = new Set<string>();

  Object.values(stagesDict ?? {}).forEach((stageMeta: any) => {
    const stageFields = stageMeta?.fields;
    if (stageFields && typeof stageFields === 'object') {
      Object.keys(stageFields).forEach((fieldKey) => fieldKeys.add(fieldKey));
    }
  });

  return fieldKeys;
}

/**
 * По переданному списку исполнителей и названию роли возвращает ID пользователя.
 * Ожидается, что у исполнителя роль хранится в `role` или `role_name`.
 *
 * @param {any[]} executors Массив исполнителей.
 * @param {string|undefined} roleName Название роли (как в YAML).
 * @returns {string|undefined} Строковый ID пользователя или `undefined`, если не найден.
 */
export function findIdByRole(executors: any[], roleName: string | undefined) {
  if (!roleName) return undefined;
  const candidate = executors?.find((user) => (user?.role ?? user?.role_name) === roleName);
  return candidate?.id ? String(candidate.id) : undefined;
}

/**
 * Отображает роль стадии на конкретный пользовательский ID, если он передан.
 *
 * @param {string|undefined} role Роль стадии (`engineer`/`installer`/`auditor`).
 * @param {string} [engineerId] ID инженера.
 * @param {string} [installerId] ID монтажника.
 * @param {string} [auditorId] ID аудитора.
 * @returns {string|undefined} Соответствующий ID пользователя или `undefined`.
 */
export function mapStageRoleToUserId(
  role: string | undefined,
  engineerId?: string,
  installerId?: string,
  auditorId?: string,
) {
  if (!role) return undefined;
  const roleNormalized = String(role).toLowerCase().trim();
  if (roleNormalized === 'engineer') return engineerId;
  if (roleNormalized === 'installer') return installerId;
  if (roleNormalized === 'auditor') return auditorId;
  return undefined;
}

/**
 * Собирает объект `stages` для одного аргумента (одной строки параметров).
 *
 * Пустые объекты стадий не включаются в результат.
 *
 * @param {any} row Строка параметров (одна запись аргумента).
 * @param {string[]} stageOrder Упорядоченный список ключей стадий.
 * @param {Record<string, any>} stagesDict Словарь стадий.
 * @param {Record<string, any>|undefined} overridesForTpl Глобальные поправки времени/полей для шаблона.
 * @param {Record<string, any>|undefined} stageFieldEditsFlat Плоская карта правок полей (по ключу поля).
 * @param {string} [engineerId] ID инженера.
 * @param {string} [installerId] ID монтажника.
 * @param {string} [auditorId] ID аудитора.
 * @returns {Record<string, any>} Объект `stages` (ключ — stageKey, значение — собранные поля/время/исполнитель).
 */
export function buildStagesForRow(
  row: any,
  stageOrder: string[],
  stagesDict: Record<string, any>,
  overridesForTpl: Record<string, any> | undefined,
  stageFieldEditsFlat: Record<string, any> | undefined,
  engineerId?: string,
  installerId?: string,
  auditorId?: string,
) {
  const stagesOut: Record<string, any> = {};

  for (const stageKey of stageOrder) {
    const stageMeta = stagesDict?.[stageKey] ?? {};
    const stageBlock: any = {};

    const overrideTimeMinutes = overridesForTpl?.[stageKey]?.time;
    if (typeof overrideTimeMinutes === 'number' && overrideTimeMinutes > 0) {
      stageBlock.time = `${Math.max(1, Math.round(overrideTimeMinutes))}m`;
    } else if (stageMeta?.time) {
      stageBlock.time = stageMeta.time;
    }

    //  Тэги
    if (!isEmptyValue(stageMeta?.tags)) stageBlock.tags = stageMeta.tags;

    //  Поля: meta.fields с приоритетами
    const stageFields = stageMeta?.fields;
    if (stageFields && typeof stageFields === 'object') {
      const overrideFields = overridesForTpl?.[stageKey]?.fields ?? {};

      Object.entries(stageFields).forEach(([fieldKey, fieldMeta]: [string, any]) => {
        let resolvedValue: any;

        if (Object.prototype.hasOwnProperty.call(overrideFields, fieldKey)) {
          resolvedValue = overrideFields[fieldKey];
        } else if (
          stageFieldEditsFlat &&
          Object.prototype.hasOwnProperty.call(stageFieldEditsFlat, fieldKey)
        ) {
          resolvedValue = stageFieldEditsFlat[fieldKey];
        } else if (row && Object.prototype.hasOwnProperty.call(row, fieldKey)) {
          resolvedValue = (row as any)[fieldKey];
        } else if (fieldMeta?.default !== undefined) {
          resolvedValue = fieldMeta.default;
        }

        if (resolvedValue !== undefined) stageBlock[fieldKey] = resolvedValue;
      });
    }

    //  Исполнитель: из роли стадии
    const mappedExecutorId = mapStageRoleToUserId(
      stageMeta?.executor,
      engineerId,
      installerId,
      auditorId,
    );
    if (mappedExecutorId) stageBlock.executor = mappedExecutorId;

    //  Добавляем стадию в выход, только если в ней что-то есть
    if (!isEmptyValue(stageBlock)) stagesOut[stageKey] = stageBlock;
  }

  return stagesOut;
}
