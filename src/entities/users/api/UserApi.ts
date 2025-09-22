import { graphqlClient } from '@/shared/lib/graphql/client';
import type { FetchRolesQuery } from '@entities/work/api/fetchRoles.generated';
import { FetchRolesDocument } from '@entities/work/api/fetchRoles.generated';
import type { FetchUsersQuery } from '@entities/work/api/fetchUsers.generated';
import { FetchUsersDocument } from '@entities/work/api/fetchUsers.generated';

/** Загружает всех пользователей */
export async function fetchUsers(): Promise<FetchUsersQuery['users']> {
  const { users } = await graphqlClient.request<FetchUsersQuery>(FetchUsersDocument, {});
  return users;
}

/** Загружает все роли */
export async function fetchRoles(): Promise<FetchRolesQuery['roles']> {
  const { roles } = await graphqlClient.request<FetchRolesQuery>(FetchRolesDocument, {});
  return roles;
}
