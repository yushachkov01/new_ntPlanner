/**
 *  Используем типы, сгенерированные graphql-codegen:
 *  FetchExecutorRoles    — запрос на все роли
 *  FetchExecutorsByRole*  — запрос на исполнители по роли
 */
import { graphqlClient } from '@/shared/lib/graphql/client';
import type { FetchExecutorRolesQuery } from '@entities/work/api/FetchExecutorRoles.generated.ts';
import { FetchExecutorRolesDocument } from '@entities/work/api/FetchExecutorRoles.generated.ts';
import type {
  FetchExecutorsByRoleQuery,
  FetchExecutorsByRoleQueryVariables,
} from '@entities/work/api/FetchExecutorsByRole.generated.ts';
import { FetchExecutorsByRoleDocument } from '@entities/work/api/FetchExecutorsByRole.generated.ts';

/**
 *  Получаем список ролей
 */
export const fetchRoles = async () => {
  const { executor } = await graphqlClient.request<FetchExecutorRolesQuery>(
    FetchExecutorRolesDocument,
  );
  return executor.map((e) => e.role);
};
/**
 * Получаем исполнителей по роли
 * @param role
 */
export const fetchByRole = async (role: string) => {
  const { executor } = await graphqlClient.request<
    FetchExecutorsByRoleQuery,
    FetchExecutorsByRoleQueryVariables
  >(FetchExecutorsByRoleDocument, { role });
  return executor;
};
