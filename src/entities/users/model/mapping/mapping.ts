import type { FetchRolesQuery } from '@entities/work/api/fetchRoles.generated';
import type { FetchUsersQuery } from '@entities/work/api/fetchUsers.generated';

/** Сырой тип роли (snake_case) */
export type RawRole = FetchRolesQuery['public7_roles'][number];

/** Доменный тип роли (camelCase) */
export interface Role {
  id: string;
  name: string;
}

export function toDomainRole(r: RawRole): Role {
  return {
    id: r.id,
    name: r.role,
  };
}

/** Сырой тип пользователя (snake_case) */
export type RawUser = FetchUsersQuery['public7_users'][number];

/** Доменный тип пользователя (camelCase) */
export interface User {
  id: string;
  name: string;
  email: string;
  timeZone: string;
  isActive: boolean;
  roleId: string;
  groupId: string;
}

export function toDomainUser(u: RawUser): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    timeZone: u.time_zone,
    isActive: u.is_active,
    roleId: u.role_id,
    groupId: u.group_id,
  };
}
