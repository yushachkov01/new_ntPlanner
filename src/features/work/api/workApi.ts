// // import axios from 'axios';
// import { Work } from '@/entities/work/model/work';
//
// // TODO: поменять базовый URL
// // const BASE_URL = '/api';
//
// export const fetchWorks = async (): Promise<Work[]> => {
//   // реальный запрос:
//   // const response = await axios.get<Work[]>(`${BASE_URL}/works`);
//   // return response.data;
//
//   // mock
//   const mock: Work[] = [
//     {
//       id: 3,
//       date: '2025-04-27',
//       project: 'ЛР2025. Ответные порты. Урал',
//       site: 'Курганский ф-ал, г.Курган, ',
//       description: 'Проведение миграции на 45-KRGV-AR4',
//       timeRange: '00:00 - 06:00 (МСК)',
//       status: 'pending',
//       pprHours: 4,
//       workHours: 6,
//       overtimeHours: 2,
//     },
//     {
//       id: 3,
//       date: '2025-04-27',
//       project: 'ЛР2025. Ответные порты. Урал',
//       site: 'Курганский ф-ал, г.Курган, ',
//       description: 'Проведение миграции на 45-KRGV-AR4',
//       timeRange: '00:00 - 06:00 (МСК)',
//       status: 'pending',
//       pprHours: 4,
//       workHours: 6,
//       overtimeHours: 2,
//     },
//     {
//       id: 3,
//       date: '2025-04-27',
//       project: 'ЛР2025. Ответные порты. Урал',
//       site: 'Курганский ф-ал, г.Курган, ',
//       description: 'Проведение миграции на 45-KRGV-AR4',
//       timeRange: '00:00 - 06:00 (МСК)',
//       status: 'pending',
//       pprHours: 4,
//       workHours: 6,
//       overtimeHours: 2,
//     },
//     {
//       id: 1,
//       date: '2025-05-14',
//       project: 'ЛР2025. Ответные порты. Урал',
//       site: 'Курганский ф-ал, с.Юргамыш, ул.Ленина 2',
//       description: 'Проведение интеграционных работ на XX-KRGR-DSW1',
//       timeRange: '09:00–16:00 (МСК)',
//       status: 'in_progress',
//       pprHours: 3,
//       workHours: 5,
//       overtimeHours: 1,
//     },
//     {
//       id: 2,
//       date: '2025-05-27',
//       project: 'ЛР2025. Ответные порты. Урал',
//       site: 'Курганский ф-ал, г.Курган, ',
//       description: 'Проведение миграции на 45-KRGV-AR4',
//       timeRange: '00:00 - 06:00 (МСК)',
//       status: 'pending',
//       pprHours: 3,
//       workHours: 5,
//       overtimeHours: 1,
//       data: [],
//       onAction: () => {},
//     },
//     {
//       id: 2,
//       date: '2025-05-27',
//       project: 'ЛР2025. Ответные порты. Урал',
//       site: 'Курганский ф-ал, г.Курган, ',
//       description: 'Проведение миграции на 45-KRGV-AR4',
//       timeRange: '00:00 - 06:00 (МСК)',
//       status: 'pending',
//       pprHours: 3,
//       workHours: 5,
//       overtimeHours: 1,
//       data: [],
//       onAction: () => {},
//     },
//   ];
//   return new Promise((resolve) => setTimeout(() => resolve(mock), 500));
// };
