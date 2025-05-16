import { gql } from '@apollo/client';

export const GET_WORKS = gql`
  query GetWorks {
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
