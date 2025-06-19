import type { UserData } from '../model/types.ts';

export const users: UserData[] = [
  {
    id: 1,
    name: 'Иванов И.И.',
    blocks: [
      {
        id: 101,
        startTime: '00:15',
        endTime: '02:00',
        label: 'Блок физика',
        status: 'done_on_time',
        subSteps: [
          {
            id: 1001,
            label: 'Подэтап 1: Организация линии связи между $hostname1 $inf1x и $hostname2 $inf2x',
          },
          {
            id: 1002,
            label:
              'Подэтап 2:   Проверка состояния интерфейсов для организованной линии связи между $hostname1 $inf1x и $hostname2 $inf2x с помощью команд:  $hostname1 $cmd_list1, $hostname2 $cmd_list2',
          },
        ],
      },
      {
        id: 123,
        startTime: '06:45',
        endTime: '08:00',
        label: 'Настройка сервера',
        status: 'done_on_time',
        subSteps: [
          { id: 1003, label: 'Подэтап 1: ' },
          { id: 1004, label: 'Подэтап 2: ' },
        ],
      },
      {
        id: 104,
        startTime: '03:00',
        endTime: '04:30',
        label: 'Ручное тестирование',
        status: 'pending_manual',
        subSteps: [
          { id: 1007, label: 'Подэтап 1: ' },
          { id: 1008, label: 'Подэтап 2: ' },
        ],
      },
      {
        id: 105,
        startTime: '04:30',
        endTime: '05:30',
        label: 'Блок физика',
        status: 'done_on_time',
        subSteps: [
          { id: 1009, label: 'Подэтап 1: ' },
          { id: 1010, label: 'Подэтап 2: ' },
        ],
      },
      {
        id: 152,
        startTime: '06:45',
        endTime: '08:00',
        label: 'Настройка сервера',
        status: 'done_on_time',
      },
      {
        id: 184,
        startTime: '08:45',
        endTime: '12:00',
        label: 'Настройка сервера',
        status: 'done_on_time',
      },
      {
        id: 140,
        startTime: '20:00',
        endTime: '23:00',
        label: 'Настройка сервера',
        status: 'done',
      },
    ],
  },
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
        startTime: '21:30',
        endTime: '23:59',
        label: 'Согласование отчёта',
        status: 'overtime',
        subSteps: [
          { id: 1199, label: 'Подэтап: черновик' },
          { id: 1200, label: 'Подэтап: финальный pdf' },
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'Сидоров С.С.',
    blocks: [
      {
        id: 301,
        startTime: '02:30',
        endTime: '04:00',
        label: 'Блок физика',
        status: 'done_on_time',
        subSteps: [
          { id: 3001, label: 'Подэтап 1: ' },
          { id: 3002, label: 'Подэтап 2: ' },
        ],
      },
      {
        id: 302,
        startTime: '12:00',
        endTime: '13:30',
        label: 'блок настройка',
        status: 'done_on_time',
        subSteps: [
          { id: 3003, label: 'Подэтап 1: ' },
          { id: 3004, label: 'Подэтап 2: ' },
        ],
      },
      {
        id: 303,
        startTime: '23:00',
        endTime: '23:59',
        label: 'блок настройка',
        status: 'overtime',
        subSteps: [
          { id: 3005, label: 'Подэтап 1: ' },
          { id: 3006, label: 'Подэтап 2: ' },
        ],
      },
      {
        id: 304,
        startTime: '18:00',
        endTime: '19:30',
        label: 'блок настройка',
        status: 'done',
        subSteps: [
          { id: 3007, label: 'Подэтап 1:  ' },
          { id: 3008, label: 'Подэтап 2: ' },
        ],
      },
      {
        id: 305,
        startTime: '19:30',
        endTime: '21:00',
        label: 'Блок физика',
        status: 'info',
        subSteps: [
          { id: 3009, label: 'Подэтап 1: ' },
          { id: 3010, label: 'Подэтап 2: ' },
        ],
      },
    ],
  },
];
