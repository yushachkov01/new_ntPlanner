import type { UserData } from '../model/types.ts';

export const users: UserData[] = [
  {
    id: 2,
    name: 'Петров П.П.',
    blocks: [
      {
        id: 201,
        startTime: '01:00',
        endTime: '03:45',
        label: 'Блок физика',
        status: 'done_on_time',
        subSteps: [
          { id: 2001, label: 'Подэтап 1: ' },
          { id: 2002, label: 'Подэтап 2: ' },
        ],
      },
      {
        id: 202,
        startTime: '07:00',
        endTime: '09:15',
        label: 'Блок физика',
        status: 'done_on_time',
        subSteps: [
          { id: 2003, label: 'Подэтап 1: ' },
          { id: 2004, label: 'Подэтап 2: ' },
        ],
      },
      {
        id: 203,
        startTime: '15:00',
        endTime: '18:30',
        label: 'Блок физика',
        status: 'done',
        subSteps: [
          { id: 2005, label: 'Подэтап 1: ' },
          { id: 2006, label: 'Подэтап 2: ' },
        ],
      },
      {
        id: 205,
        startTime: '12:00',
        endTime: '13:30',
        label: 'блок настройка',
        status: 'pending_manual',
        subSteps: [
          { id: 2009, label: 'Подэтап 1: ' },
          { id: 2010, label: 'Подэтап 2: ' },
        ],
      },
      {
        id: 199,
        startTime: '21:30', // выходит за рамки смены
        endTime: '23:59', // (перехлёст через полночь)
        label: 'Согласование отчёта',
        status: 'overtime',
        subSteps: [
          { id: 1199, label: 'Подэтап: черновик' },
          { id: 1200, label: 'Подэтап: финальный pdf' },
        ],
      },
    ],
  },
];
