import type { FC } from 'react';
import { useState } from 'react';

import accountIcon from '@/assets/icons-account.png';

import type { SubStep } from './TaskDetail';
import TaskDetail from './TaskDetail';
import TimelineBlock from './TimelineBlock';

import './PprPage.css';

interface UserData {
  id: number;
  name: string;
  blocks: BlockData[];
}

function timeStringToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export interface BlockData {
  id: number;
  startTime: string;
  endTime: string;
  label: string;
  subSteps?: SubStep[];
}

const users: UserData[] = [
  {
    id: 1,
    name: 'Иванов И.И.',
    blocks: [
      {
        id: 101,
        startTime: '00:15',
        endTime: '02:00',
        label: 'Проверка системы',
        subSteps: [
          { id: 1001, label: 'Подэтап 1: Проверка БД' },
          { id: 1002, label: 'Подэтап 2: Тестирование API' },
        ],
      },
      {
        id: 102,
        startTime: '06:45',
        endTime: '08:00',
        label: 'Настройка сервера',
        subSteps: [
          { id: 1003, label: 'Подэтап 1: Установка ПО' },
          { id: 1004, label: 'Подэтап 2: Конфигурация' },
        ],
      },
      {
        id: 103,
        startTime: '20:30',
        endTime: '22:10',
        label: 'Завершение отчёта',
        subSteps: [
          { id: 1005, label: 'Подэтап 1: Сбор данных' },
          { id: 1006, label: 'Подэтап 2: Проверка' },
        ],
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
        label: 'Доступ к БД',
        subSteps: [
          { id: 2001, label: 'Подэтап 1: Привилегии' },
          { id: 2002, label: 'Подэтап 2: Тестовые запросы' },
        ],
      },
      {
        id: 202,
        startTime: '07:00',
        endTime: '09:15',
        label: 'Обновление ПО',
        subSteps: [
          { id: 2003, label: 'Подэтап 1: Скачивание пакетов' },
          { id: 2004, label: 'Подэтап 2: Установка' },
        ],
      },
      {
        id: 203,
        startTime: '15:00',
        endTime: '18:30',
        label: 'Тестирование',
        subSteps: [
          { id: 2005, label: 'Подэтап 1: Юнит-тесты' },
          { id: 2006, label: 'Подэтап 2: Интеграционные тесты' },
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
        label: 'Тест LAN',
        subSteps: [
          { id: 3001, label: 'Подэтап 1: Пропускная способность' },
          { id: 3002, label: 'Подэтап 2: Задержки' },
        ],
      },
      {
        id: 302,
        startTime: '12:00',
        endTime: '13:30',
        label: 'Внедрение правок',
        subSteps: [
          { id: 3003, label: 'Подэтап 1: Код-ревью' },
          { id: 3004, label: 'Подэтап 2: Слияние' },
        ],
      },
      {
        id: 303,
        startTime: '23:00',
        endTime: '23:59',
        label: 'Архивация данных',
        subSteps: [
          { id: 3005, label: 'Подэтап 1: Сжатие' },
          { id: 3006, label: 'Подэтап 2: Перенос' },
        ],
      },
    ],
  },
];

const PprPage: FC = () => {
  /**
   * Отображать ли отдельные ряды с пользователями
   */

  const [expandedUsers, setExpandedUsers] = useState(false);

  /**
   * Отображать ли секцию «Все задачи» (под таймлайном)
   */
  const [showAllTasks, setShowAllTasks] = useState(false);

  /**
   * Состояние для popover (одинарный клик)
   */
  const [expandedBlockId, setExpandedBlockId] = useState<number | null>(null);

  /**
   *    Состояние для TaskDetail (двойной клик)
   */
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);

  const handleBlockDouble = (blockId: number) => {
    setExpandedTaskId((prev) => (prev === blockId ? null : blockId));
  };

  const findBlockById = (id: number | null): BlockData | null => {
    if (id === null) return null;
    for (const u of users) {
      const found = u.blocks.find((b) => b.id === id);
      if (found) return found;
    }
    return null;
  };
  const taskDetailData = findBlockById(expandedTaskId);

  const aggregatedRow = {
    id: 0 as const,
    name: 'Весь день' as const,
    blocks: users.flatMap((u) => u.blocks),
  };
  const rowsData = [aggregatedRow, ...(expandedUsers ? users : [])];

  const spanHours = 24;
  const hours = Array.from({ length: spanHours }, (_, i) => i);
  const totalWindowMin = spanHours * 60;

  return (
    <div className="ppr-page">
      <h2 className="ppr-page__title">Таймлайн (00:00–23:00)</h2>

      <div className="timeline-container">
        <div className="timeline-header">
          <div className="timeline-header__spacer" />
          <div className="timeline-header__label-spacer" />
          {hours.map((h) => (
            <div key={h} className="timeline-header__hour">
              {h.toString().padStart(2, '0')}:00
            </div>
          ))}
        </div>

        <div className="timeline-body">
          {rowsData.map((rowItem) => (
            <div key={rowItem.id} className="timeline-row">
              <div className="timeline-row__icon-cell">
                {rowItem.id === 0 ? (
                  <div
                    className="avatar-combined"
                    onClick={() => {
                      setExpandedUsers((prev) => !prev);
                      setShowAllTasks(false);
                      setExpandedTaskId(null);
                    }}
                  >
                    {users.slice(0, 2).map((u, idx) => (
                      <div
                        key={u.id}
                        className="avatar-combined__circle"
                        style={{ left: `${idx * 0.75}rem` }}
                      >
                        <span className="avatar-icon">👤</span>
                      </div>
                    ))}
                    {users.length > 2 && (
                      <div
                        className="avatar-combined__circle avatar-combined__more"
                        style={{ left: `${2 * 0.75}rem` }}
                      >
                        +{users.length - 2}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="avatar-with-name">
                    <div className="avatar-single">
                      <img src={accountIcon} alt="User" className="avatar-single__img" />
                    </div>
                    <div className="avatar-name">{rowItem.name.split(' ')[0]}</div>
                  </div>
                )}
              </div>
              <div className="timeline-row__label-cell">
                {rowItem.id === 0 && (
                  <span
                    className="timeline-row__day-label"
                    onClick={() => {
                      setShowAllTasks((prev) => !prev);
                      setExpandedUsers(false);
                      setExpandedTaskId(null);
                    }}
                  >
                    Весь
                    <br />
                    день
                  </span>
                )}
              </div>
              <div className="timeline-row__blocks">
                {hours.map((_, i) => (
                  <div key={i} className="timeline-row__grid-cell" />
                ))}
                {(rowItem as any).blocks.map((block: BlockData) => (
                  <TimelineBlock
                    key={block.id}
                    block={block}
                    totalWindowMin={totalWindowMin}
                    expandedBlockId={expandedBlockId}
                    setExpandedBlockId={setExpandedBlockId}
                    onDoubleClickBlock={handleBlockDouble}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {showAllTasks && (
        <div className="all-tasks-container">
          {users
            .flatMap((u) => u.blocks)
            .map((block) => (
              <TaskDetail
                key={block.id}
                label={block.label}
                startTime={block.startTime}
                endTime={block.endTime}
                subSteps={block.subSteps}
                onClose={() => {}}
              />
            ))}
        </div>
      )}
      {taskDetailData && (
        <TaskDetail
          label={taskDetailData.label}
          startTime={taskDetailData.startTime}
          endTime={taskDetailData.endTime}
          subSteps={taskDetailData.subSteps}
          onClose={() => setExpandedTaskId(null)}
        />
      )}
    </div>
  );
};

export default PprPage;
