import { gql } from '@apollo/client';

export const GET_WORKS = gql`
  query GetWorks {
    works {
      id
      date
      project
      site
      description
      # алиас для time_range → timeRange
      timeRange: time_range
      status
      # и для остальных полей:
      pprHours: ppr_hours
      workHours: work_hours
      overtimeHours: overtime_hours
    }
  }
`;
