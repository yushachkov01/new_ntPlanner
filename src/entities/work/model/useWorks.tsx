// import { useLazyLoadQuery, graphql } from 'react-relay';
// import { WorksQuery } from './__generated__/WorksQuery.graphql';
//
// /**
//  * Хук для получения списка works
//  */
// export function useWorks() {
//     const data = useLazyLoadQuery<WorksQuery>(
//         graphql`
//       query useWorksQuery {
//         works {
//           id
//           date
//           project
//           site
//           description
//           timeRange: time_range
//           status
//           pprHours: ppr_hours
//           workHours: work_hours
//           overtimeHours: overtime_hours
//         }
//       }
//     `,
//         {}
//     );
//     return data.works;
// }
