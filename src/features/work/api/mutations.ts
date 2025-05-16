import { gql } from '@apollo/client';

export const UPDATE_WORK_STATUS = gql`
  mutation UpdateWorkStatus($id: Int!, $status: String!) {
    update_works_by_pk(pk_columns: { id: $id }, _set: { status: $status }) {
      id
      status
    }
  }
`;
