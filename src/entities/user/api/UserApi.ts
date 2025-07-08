/**
 * UserApi —  слой над graphql-request.
 */
import { graphqlClient } from '@/shared/lib/graphql/client';
import type {
  FetchUserQuery,
  FetchUserQueryVariables,
} from '@entities/work/api/fetchUser.generated.ts';
import { FetchUserDocument } from '@entities/work/api/fetchUser.generated.ts';

/**
 * Загружает пользователя по первичному ключу.
 * @param id — идентификатор пользователя
 */
export async function fetchUser(id: number): Promise<FetchUserQuery['users_by_pk']> {
  const { users_by_pk } = await graphqlClient.request<FetchUserQuery, FetchUserQueryVariables>(
    FetchUserDocument,
    { id },
  );
  return users_by_pk;
}
