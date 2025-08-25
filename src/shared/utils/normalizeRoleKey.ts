export const ROLE_KEYS = ['engineer', 'installer', 'auditor', 'system'] as const;
export type RoleKey = (typeof ROLE_KEYS)[number];

export const isRoleKey = (value: unknown): value is RoleKey =>
  typeof value === 'string' && ROLE_KEYS.includes(value as RoleKey);

/** Возвращает ключ роли, либо undefined, если значение не из списка. */
export const normalizeRoleKey = (role?: string): RoleKey | undefined => {
  if (!role) return undefined;
  const roles = role.trim().toLowerCase();
  return isRoleKey(roles) ? (roles as RoleKey) : undefined;
};
