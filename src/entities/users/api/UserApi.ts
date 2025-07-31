import { graphqlClient } from '@/shared/lib/graphql/client';
import type { FetchRolesQuery } from '@entities/work/api/fetchRoles.generated';
import { FetchRolesDocument } from '@entities/work/api/fetchRoles.generated';
import type { FetchUsersQuery } from '@entities/work/api/fetchUsers.generated';
import { FetchUsersDocument } from '@entities/work/api/fetchUsers.generated';

/** Загружает всех пользователей */
export async function fetchUsers(): Promise<FetchUsersQuery['public7_users']> {
  const { public7_users } = await graphqlClient.request<FetchUsersQuery>(FetchUsersDocument, {});
  return public7_users;
}

/** Загружает все роли */
export async function fetchRoles(): Promise<FetchRolesQuery['public7_roles']> {
  const { public7_roles } = await graphqlClient.request<FetchRolesQuery>(FetchRolesDocument, {});
  return public7_roles;
}
