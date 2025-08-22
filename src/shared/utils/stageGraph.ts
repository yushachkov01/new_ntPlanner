import type { StageField } from '@/entities/template/model/store/templateStore';

/**
 * Нормализует поле переходов (if_success / if_failure) в массив строк.
 * Отбрасывает пустые значения и "exit".
 */
export function toStageArray(next: any): string[] {
  const raw = Array.isArray(next) ? next : next ? [next] : [];
  return raw.map(String).filter((key) => key && key !== 'exit');
}

/**
 * Определяем стартовую стадию графа,
 *
 * @param stagesField Словарь стадий из шаблона.
 * @returns Ключ стартовой стадии или `undefined`, если стадий нет.
 */
export function guessStartStageKey(stagesField: Record<string, StageField>): string | undefined {
  const keys = Object.keys(stagesField ?? {});
  if (!keys.length) return undefined;

  const hasIncoming = new Set<string>();
  for (const key of keys) {
    const meta: any = (stagesField as any)[key];
    for (const succ of toStageArray(meta?.if_success))
      if (keys.includes(succ)) hasIncoming.add(succ);
    for (const fail of toStageArray(meta?.if_failure))
      if (keys.includes(fail)) hasIncoming.add(fail);
  }
  const start = keys.find((key) => !hasIncoming.has(key));
  return start ?? keys[0];
}

/**
 * Строит порядок обхода стадий
 * начиная со стартовой, затем идём по success-ветке,
 * после — обходим все failure-ветки.
 *
 * @param stagesField Словарь стадий из шаблона.
 * @returns Массив ключей стадий в порядке отображения.
 */
export function buildFullStageOrder(stagesField: Record<string, StageField>): string[] {
  const result: string[] = [];
  const seen = new Set<string>();
  const has = (key: string) => Boolean(key && stagesField && stagesField[key]);

  const walk = (key?: string) => {
    if (!key || !has(key) || seen.has(key)) return;
    seen.add(key);
    result.push(key);

    const meta: any = (stagesField as any)[key];
    const succ = toStageArray(meta?.if_success);
    if (succ.length) walk(succ[0]);
    for (const f of toStageArray(meta?.if_failure)) walk(f);
  };

  walk(guessStartStageKey(stagesField));

  for (const key of Object.keys(stagesField ?? {})) {
    if (!seen.has(key)) walk(key);
  }

  return result;
}

/** Тип входящей связи в стадию (для отрисовки иконки). */
export type IncomingType = 'success' | 'failure' | undefined;

/**
 * @param stagesField Словарь стадий из шаблона.
 * @returns Map: { [stageKey]: 'success' | 'failure' | undefined }
 */
export function buildIncomingTypeMap(
  stagesField: Record<string, StageField>,
): Record<string, IncomingType> {
  const map: Record<string, IncomingType> = {};
  for (const [, metaAny] of Object.entries(stagesField ?? {})) {
    const meta = metaAny as any;
    for (const success of toStageArray(meta?.if_success))
      if (!map[success]) map[success] = 'success';
    for (const failure of toStageArray(meta?.if_failure))
      if (!map[failure]) map[failure] = 'failure';
  }
  return map;
}
