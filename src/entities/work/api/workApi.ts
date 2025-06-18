/**
 * ГрафQL-клиент для всех запросов к Hasura
 */
import { graphqlClient } from '@/shared/lib/graphql/client';

import type { DeleteWorkMutation, DeleteWorkMutationVariables } from './deleteWork.generated';
import { DeleteWorkDocument } from './deleteWork.generated';
import type { FetchWorksQuery } from './fetchWorks.generated';
import { FetchWorksDocument } from './fetchWorks.generated';
import type { InsertWorkMutation, InsertWorkMutationVariables } from './insertWork.generated';
import { InsertWorkDocument } from './insertWork.generated';
import type { UpdateWorkMutation, UpdateWorkMutationVariables } from './updateWork.generated';
import { UpdateWorkDocument } from './updateWork.generated';

/**
 * Загружает все работы из Hasura
 * @returns Список записей works.
 */
export async function fetchWorks(): Promise<FetchWorksQuery['works']> {
  const { works } = await graphqlClient.request<FetchWorksQuery>(FetchWorksDocument, {});
  return works;
}
/**
 * Вставляет новую запись work в Hasura.
 * @returns id вставленной записи
 */
export async function insertWork(object: InsertWorkMutationVariables['object']): Promise<number> {
  const { insert_works_one } = await graphqlClient.request<
    InsertWorkMutation,
    InsertWorkMutationVariables
  >(InsertWorkDocument, { object });
  if (!insert_works_one) throw new Error('Insert failed');
  return insert_works_one.id;
}
/**
 * Обновляет одну запись work по первичному ключу.
 * @param id — первичный ключ записи
 * @returns id обновлённой записи
 */
export async function updateWork(
  id: number,
  set: UpdateWorkMutationVariables['_set'],
): Promise<number> {
  const { update_works_by_pk } = await graphqlClient.request<
    UpdateWorkMutation,
    UpdateWorkMutationVariables
  >(UpdateWorkDocument, { id, set });
  if (!update_works_by_pk) throw new Error('Update failed');
  return update_works_by_pk.id;
}
/**
 * Удаляет записи work
 */
export async function deleteWork(where: DeleteWorkMutationVariables['where']): Promise<number> {
  const { delete_works } = await graphqlClient.request<
    DeleteWorkMutation,
    DeleteWorkMutationVariables
  >(DeleteWorkDocument, { where });
  return delete_works.affected_rows;
}
