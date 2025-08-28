import { normalizeRoleKey, type RoleKey } from '@/shared/utils/normalizeRoleKey';

/** Безопасное обращение к свойству по пути "a.b.c" */
export const getByPath = (obj: any, path: string) =>
  !obj || !path ? undefined : path.split('.').reduce((acc, k) => (acc == null ? acc : acc[k]), obj);

/** Интерполяция {{ expr }} внутри строки с поддержкой путей */
export function interpolate(tpl: string, ctx: Record<string, any>) {
  if (!tpl || typeof tpl !== 'string') return '';
  return tpl.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_, expr: string) => {
    const raw = getByPath(ctx, expr.trim());
    return raw == null ? '' : String(raw);
  });
}

/** Достаём корневые плейсхолдеры (params.*) */
export function extractPlaceholderRoots(stagesField: Record<string, any>): string[] {
  const set = new Set<string>();
  const rx = /\{\{\s*([^}]+?)\s*\}\}/g;
  Object.values(stagesField ?? {}).forEach((meta: any) => {
    const text = String(meta?.description ?? '');
    let m: RegExpExecArray | null;
    while ((m = rx.exec(text))) {
      const expr = String(m[1]).trim();
      const path = expr.replace(/^params\./, '');
      const root = path.split('.')[0];
      if (root) set.add(root);
    }
  });
  return Array.from(set);
}

/**
 * Строим контекст подстановки по одной строке таблицы
 */
export function buildParamsFromSingleRow(
  roots: string[],
  colKeys: string[],
  headers: string[],
  row: string[],
): Record<string, any> {
  const ctx: Record<string, any> = {};
  if (!roots.length || !row?.length) return ctx;

  roots.forEach((root) => {
    let idx = -1;
    if (colKeys?.length)
      idx = colKeys.findIndex((key) => String(key).trim() === String(root).trim());
    if (idx < 0 && headers?.length)
      idx = headers.findIndex((header) => String(header).trim() === String(root).trim());
    if (idx < 0) idx = row.findIndex((cell) => String(cell ?? '').trim().length > 0);
    if (idx >= 0 && idx < row.length) ctx[root] = row[idx] ?? '';
  });

  return ctx;
}

/** Прибавить минуты к строке "HH:MM" (циклически в пределах суток) */
export function addMinutesToTime(hhmm: string, minutes: number): string {
  const [h, m] = (hhmm ?? '00:00').split(':').map((x) => parseInt(x, 10) || 0);
  const total = (((h * 60 + m + Math.max(0, minutes)) % (24 * 60)) + 24 * 60) % (24 * 60);
  const hh = String(Math.floor(total / 60)).padStart(2, '0');
  const mm = String(total % 60).padStart(2, '0');
  return `${hh}:${mm}`;
}

/** Нормализация отображаемого имени пользователя */
export const normalizeAuthor = (raw: any): string => {
  const candidate =
    raw?.author ??
    raw?.fio ??
    raw?.name ??
    `${raw?.last_name ?? ''} ${raw?.first_name ?? ''}`.trim();
  return candidate && candidate.length > 0 ? candidate : `User ${raw?.id ?? ''}`;
};

/** Приведение произвольной роли к внутреннему RoleKey */
export const toCanonicalRole = (roleRaw?: string): RoleKey | undefined => {
  const direct = normalizeRoleKey(roleRaw);
  if (direct) return direct;
  if (roleRaw === 'Сетевой инженер') return 'engineer';
  if (roleRaw === 'Инженер СМР') return 'installer';
  if (roleRaw === 'Представитель Заказчика') return 'auditor';
  if (roleRaw === 'Система') return 'system';
  return undefined;
};
