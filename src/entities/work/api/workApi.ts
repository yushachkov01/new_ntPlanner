import gql from 'graphql-tag';

import { graphqlClient } from '@/shared/lib/graphql/client';

import type { WorkDto } from '../model/work.types';

/**
 * Fetch all
 */
const WORKS_QUERY = gql`
  query Works {
    works {
      id
      date
      project
      site
      description
      time_range
      status
      ppr_hours
      work_hours
      overtime_hours
    }
  }
`;

/**
 * Insert
 */
const INSERT_WORK_MUTATION = gql`
  mutation InsertWork($object: works_insert_input!) {
    insert_works_one(object: $object) {
      id
    }
  }
`;

/**
 * Update
 */

const UPDATE_WORK_MUTATION = gql`
  mutation UpdateWork($id: Int!, $set: works_set_input!) {
    update_works_by_pk(pk_columns: { id: $id }, _set: $set) {
      id
    }
  }
`;

export async function fetchWorks(): Promise<WorkDto[]> {
  const { works } = await graphqlClient.request<{ works: WorkDto[] }>(WORKS_QUERY);
  return works;
}

export async function insertWork(input: Omit<WorkDto, 'id'>): Promise<number> {
  const { insert_works_one } = await graphqlClient.request<{ insert_works_one: { id: number } }>(
    INSERT_WORK_MUTATION,
    { object: input },
  );
  return insert_works_one.id;
}

export async function updateWork(id: number, set: Partial<Omit<WorkDto, 'id'>>): Promise<void> {
  await graphqlClient.request(UPDATE_WORK_MUTATION, { id, set });
}
