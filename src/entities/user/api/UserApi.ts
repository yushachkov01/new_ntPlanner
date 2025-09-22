/**
 * UserApi —  слой над graphql-request.
 */
import { graphqlClient } from '@/shared/lib/graphql/client';
import type {
  FetchUserQuery,
  FetchUserQueryVariables,
} from '@entities/work/api/fetchUser.generated.ts';
import { FetchUserDocument } from '@entities/work/api/fetchUser.generated';

/**
 * Загружает пользователя по первичному ключу.
 * @param id — идентификатор пользователя
 */
export async function fetchUser(id: number): Promise<FetchUserQuery['user_by_pk']> {
  const { user_by_pk } = await graphqlClient.request<FetchUserQuery, FetchUserQueryVariables>(
    FetchUserDocument,
    { id },
  );
  return user_by_pk;
}
