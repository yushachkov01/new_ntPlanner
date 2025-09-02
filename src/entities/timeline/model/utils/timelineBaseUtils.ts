/**
 * Минимальное значение минут (гарантия что > 0)
 * @param numberValue - исходное число
 * @returns округлённое значение (>= 1)
 */
export const min1 = (numberValue: number) => (numberValue > 0 ? Math.floor(numberValue) : 1);

/**
 * Построение последовательности стадий по цепочке if_success,
 * начиная со стартового ключа
 */
export function orderStagesByIfSuccess(
  stageKeys: string[],
  stagesField: Record<string, any>,
): string[] {
  const out: string[] = [];
  if (!stageKeys || stageKeys.length === 0) return out;

  let current = stageKeys[0];
  const visited = new Set<string>();
  let guard = 0;

  while (current && !visited.has(current) && guard++ < 1000) {
    const meta: any = (stagesField as any)[current];
    if (!meta) break;

    out.push(current);
    visited.add(current);

    let next: any = meta?.if_success;
    if (Array.isArray(next)) next = next[0];

    // конец ветки
    if (!next || typeof next !== 'string' || next === 'exit') break;

    // если следующая стадия не определена в stages — останавливаемся
    if (!(next in stagesField)) break;
    current = next;
  }
  return out;
}
