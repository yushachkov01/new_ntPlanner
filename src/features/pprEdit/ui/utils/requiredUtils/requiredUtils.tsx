// Утилиты для расчёта прогресса обязательных полей

/** Карта прогресса по стадиям: сколько заполнено/требуется */
export type ProgressMap = Record<string, { filled: number; required: number }>;

/**
 * Подсчёт количества required-полей в YAML-схеме шаблона.
 * Считаем:
 *  - верхнеуровневые `params` с флагом required
 *  - поля всех стадий по success-ветке (start -> if_success -> ...),
 *    где `fields.*.required === true`
 */
export function countRequiredInYaml(rawSchema: any): number {
  if (!rawSchema) return 0;

  let totalRequiredCount = 0;

  // 1) Верхнеуровневые параметры
  const topLevelParams = rawSchema?.params ?? {};
  totalRequiredCount += Object.values(topLevelParams).reduce(
    (accumulator: number, fieldDef: any) => accumulator + (fieldDef?.required ? 1 : 0),
    0,
  );

  // 2) Success-ветка стадий
  let startStageKey: string | undefined;
  let stagesMap: Record<string, any> = {};
  if (rawSchema?.current_stages && rawSchema?.stages_field) {
    const currentStagesArr = Array.isArray(rawSchema.current_stages)
      ? rawSchema.current_stages
      : [rawSchema.current_stages];
    startStageKey = currentStagesArr?.[0];
    stagesMap = rawSchema.stages_field ?? {};
  } else if (rawSchema?.start && rawSchema?.stages) {
    startStageKey = rawSchema.start;
    stagesMap = rawSchema.stages ?? {};
  }

  const successPathOrder: string[] = [];
  let cursorStageKey = startStageKey;
  let safetyGuardCounter = 0;

  while (
    cursorStageKey &&
    cursorStageKey !== 'exit' &&
    stagesMap[cursorStageKey] &&
    safetyGuardCounter < 500
  ) {
    successPathOrder.push(cursorStageKey);
    const nextOnSuccess = stagesMap[cursorStageKey]?.if_success;
    if (!nextOnSuccess) break;
    cursorStageKey = Array.isArray(nextOnSuccess) ? nextOnSuccess[0] : nextOnSuccess;
    safetyGuardCounter++;
  }

  for (const stageKey of successPathOrder) {
    const stageFields = stagesMap[stageKey]?.fields ?? {};
    for (const [_fieldKey, fieldDef] of Object.entries(stageFields)) {
      if ((fieldDef as any)?.required) totalRequiredCount += 1;
    }
  }

  return totalRequiredCount;
}
