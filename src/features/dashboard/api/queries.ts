import { graphql } from 'react-relay';

export const DASHBOARD_QUERY = graphql`
  query queriesDashboardPageQuery {
    works {
      id
      date
      project
      site
      description
      timeRange: time_range
      status
      pprHours: ppr_hours
      workHours: work_hours
      overtimeHours: overtime_hours
    }
  }
`;
