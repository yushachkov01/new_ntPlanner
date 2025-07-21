import type { FC } from 'react';
import React, { useEffect, useState, useMemo } from 'react';

import type { StageField } from '@/entities/template/model/store/templateStore';
import { executorStore } from '@entities/executor/model/store/executorStore';
import type { Executor as ExecutorEntity } from '@entities/executor/model/store/executorStore';
import { calcCoveredMap } from '@features/ppr/lib/calcCoveredMap';
import TaskDetail from '@features/ppr/ui/TaskDetail/TaskDetail';
import TimelineBlock from '@features/ppr/ui/TimelineBlock/TimelineBlock';
import './PprPage.css';

/**
 * Интервал времени для подсветки на сетке
 * @property start - время начала в формате "HH:MM"
 * @property end - время окончания в формате "HH:MM"
 */
interface WindowInterval {
  start: string;
  end: string;
}

/**
 * Расширенный тип задачи (блока) для отображения на таймлайне
 * @property id - уникальный идентификатор блока
 * @property label - метка/название задачи
 * @property startTime - время начала задачи "HH:MM"
 * @property endTime - время окончания задачи "HH:MM"
 * @property status - статус задачи (необязательно)
 * @property subSteps - подзадачи (необязательно)
 * @property tplIdx - индекс шаблона, используемый при кликах
 * @property stageKeys - ключи этапов задачи
 * @property stagesField - данные по этапам для задачи
 */
interface BlockExt {
  id: number;
  label: string;
  startTime: string;
  endTime: string;
  status?: string;
  subSteps?: string[];
  tplIdx: number;
  stageKeys: string[];
  stagesField: Record<string, StageField>;
}

/**
 * Тип исполнителя с блоками задач
 * @property id - уникальный идентификатор исполнителя
 * @property author - имя исполнителя
 * @property role - роль исполнителя (например, "разработчик")
 * @property blocks - список блоков задач исполнителя (необязательно)
 */
interface Executor {
  id: number;
  author: string;
  role: string;
  blocks?: BlockExt[];
}

/**
 * Конфигурация этапов для задачи
 * @property currentStages - ключи текущих этапов
 * @property stagesField - данные по полям этапов
 */
export interface StageCfg {
  currentStages: string[];
  stagesField: Record<string, StageField>;
}

/**
 * Свойства компонента PprPage
 * @property gridStart - начало временной сетки "HH:MM" (по умолчанию "00:00")
 * @property gridEnd - конец временной сетки "HH:MM" (по умолчанию "23:00")
 * @property highlightWindows - интервалы для подсветки
 * @property executors - список исполнителей
 * @property templateKeys - ключи шаблонов для highlightWindows
 * @property onBlockClick - функция, вызываемая при клике на блок
 * @property onTimerChange - функция, вызываемая при изменении таймера задачи
 */
interface Props {
  gridStart?: string;
  gridEnd?: string;
  highlightWindows?: WindowInterval[];
  executors: Executor[];
  templateKeys: string[];
  onBlockClick: (tplIdx: number) => void;
  onTimerChange: (tplIdx: number, stageKey: string, newTimer: number) => void;
}

/**
 * Отображает таймлайн задач по исполнителям с интерактивными блоками и деталями.
 */
const PprPage: FC<Props> = ({
  gridStart = '00:00',
  gridEnd = '23:00',
  highlightWindows = [],
  executors,
  templateKeys,
  onBlockClick,
  onTimerChange,
}) => {
  /** Получаем карту исполнителей из Zustand */
  const executorMap = executorStore((state) => state.executors);

  /** Плоский массив всех исполнителей */
  const flatExecutors: ExecutorEntity[] = useMemo(
    () => Object.values(executorMap).flat(),
    [executorMap],
  );

  /**
   * Преобразует строку времени "HH:MM" в минуты с начала суток
   */
  const timeStringToMinutes = (timeString: string): number => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  /** Начало и конец сетки в минутах */
  const startMinutes = timeStringToMinutes(gridStart);
  const endMinutes =
    timeStringToMinutes(gridEnd) <= startMinutes
      ? timeStringToMinutes(gridEnd) + 1440
      : timeStringToMinutes(gridEnd);
  const spanMinutes = endMinutes - startMinutes;

  /** Метки часов для заголовка сетки */
  const hourLabels = Array.from({ length: Math.ceil(spanMinutes / 60) + 1 }, (_, index) =>
    Math.floor(((startMinutes + index * 60) % 1440) / 60),
  );

  /** Собираем все блоки задач */
  const blocksList: BlockExt[] = executors.flatMap((executor) => executor.blocks ?? []);

  /** Карта для «перекрытых» блоков (для затемнения) */
  const coverageMap = useMemo(() => calcCoveredMap(blocksList), [blocksList]);

  /** Локальное состояние для управления отображением */
  const [openBlockId, setOpenBlockId] = useState<number | null>(null);
  const [isExpandedUsers, setExpandedUsers] = useState(false);
  const [isShowingAll, setShowingAll] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  /** Активный блок деталей по идентификатору */
  const activeBlock: BlockExt | null = useMemo(
    () => blocksList.find((block) => block.id === openBlockId) ?? null,
    [openBlockId, blocksList],
  );
  const getOwnerName = (blockId: number): string =>
    executors.find((executor) => executor.blocks?.some((block) => block.id === blockId))?.author ??
    'Неизвестен';

  /** Формируем строки для рендеринга: всего и по исполнителям */
  const totalRow = { id: 0, author: 'Весь день', blocks: blocksList };
  const rowEntries = [totalRow, ...(isExpandedUsers ? executors : [])];

  /** Группировка исполнителей по этапам для активного блока */
  const executorsByStage: Record<string, ExecutorEntity[]> = {};
  if (activeBlock) {
    activeBlock.stageKeys.forEach((stageKey) => {
      executorsByStage[stageKey] = [
        { id: activeBlock.id, author: getOwnerName(activeBlock.id), role: '' },
      ];
    });
  }

  /**
   * Добавляет исполнителя к этапу
   */
  const handleExecutorAdd = (stageKey: string, executorEntity: ExecutorEntity) => {
    executorsByStage[stageKey] = [...(executorsByStage[stageKey] || []), executorEntity];
  };

  /**
   * Удаляет исполнителя из этапа
   */
  const handleExecutorRemove = (stageKey: string, executorId: number) => {
    executorsByStage[stageKey] =
      executorsByStage[stageKey]?.filter((e) => e.id !== executorId) ?? [];
  };

  return (
    <div className="ppr-page">
      <h2 className="ppr-page__title">
        Таймлайн ({gridStart}–{gridEnd})
      </h2>
      <div
        className="timeline-header"
        style={{ gridTemplateColumns: `4rem 4rem repeat(${hourLabels.length},1fr)` }}
      >
        <div />
        <div />
        {hourLabels.map((hour) => (
          <div key={hour}>{String(hour).padStart(2, '0')}:00</div>
        ))}
      </div>
      {rowEntries.map((row, rowIndex) => (
        <div key={rowIndex} className="timeline-row">
          <div className="timeline-row__icon-cell">
            {row.id === 0 ? (
              <div
                className="avatar-combined"
                onClick={() => {
                  setExpandedUsers((prev) => !prev);
                  setShowingAll(false);
                  setSelectedUserId(null);
                  setOpenBlockId(null);
                }}
              >
                {executors.slice(0, 2).map((executor, idx) => (
                  <div
                    key={executor.id}
                    className="avatar-combined__circle"
                    style={{ left: `${idx * 0.75}rem` }}
                  >
                    <span className="avatar-icon">👤</span>
                  </div>
                ))}
                {executors.length > 2 && (
                  <div
                    className="avatar-combined__circle avatar-combined__more"
                    style={{ left: '1.5rem' }}
                  >
                    +{executors.length - 2}
                  </div>
                )}
              </div>
            ) : (
              <div
                className="avatar-with-name"
                onClick={() => {
                  setSelectedUserId((prev) => (prev === row.id ? null : row.id));
                  setShowingAll(false);
                  setOpenBlockId(null);
                }}
              >
                <div className="avatar-single">
                  <span className="avatar-icon">👤</span>
                </div>
                <div className="avatar-name">{row.author}</div>
              </div>
            )}
          </div>
          <div className="timeline-row__label-cell">
            {row.id === 0 && (
              <span
                className="timeline-row__day-label"
                onClick={() => {
                  setShowingAll((prev) => !prev);
                  setExpandedUsers(false);
                  setOpenBlockId(null);
                }}
              >
                Все
                <br />
                Задачи
              </span>
            )}
          </div>
          <div
            className="timeline-row__blocks"
            style={{ gridTemplateColumns: `repeat(${hourLabels.length},1fr)` }}
          >
            {hourLabels.map((_, idx) => (
              <div key={idx} className="timeline-row__grid-cell" />
            ))}
            {row.id === 0 &&
              highlightWindows!.map((w, idx) => {
                const startVal =
                  timeStringToMinutes(w.start) < startMinutes
                    ? timeStringToMinutes(w.start) + 1440
                    : timeStringToMinutes(w.start);
                const endVal =
                  timeStringToMinutes(w.end) < startMinutes
                    ? timeStringToMinutes(w.end) + 1440
                    : timeStringToMinutes(w.end);
                const leftPercent = ((startVal - startMinutes) / spanMinutes) * 100;
                const widthPercent = ((endVal - startMinutes) / spanMinutes) * 100 - leftPercent;
                return (
                  <div
                    key={idx}
                    className="template-frame"
                    title={`${templateKeys[idx]}: ${w.start}–${w.end}`}
                    style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                  />
                );
              })}
            {row.blocks?.map((block) => (
              <TimelineBlock
                key={block.id}
                block={block}
                totalWindowMin={spanMinutes}
                windowStartMin={startMinutes}
                expandedBlockId={openBlockId}
                setExpandedBlockId={setOpenBlockId}
                onDoubleClickBlock={() => setOpenBlockId(block.id)}
                isCovered={!!coverageMap[block.id]}
                onClick={() => onBlockClick(block.tplIdx)}
              />
            ))}
          </div>
        </div>
      ))}
      {isShowingAll && (
        <div className="all-tasks-container">
          {blocksList.map((block) => (
            <TaskDetail
              key={block.id}
              id={block.id}
              label={block.label}
              startTime={block.startTime}
              endTime={block.endTime}
              performer={`РТК‑С, ${getOwnerName(block.id)}`}
              status={block.status}
              subSteps={block.subSteps}
              allExecutors={flatExecutors}
              executorsByStage={executorsByStage}
              onExecutorAdd={handleExecutorAdd}
              onExecutorRemove={handleExecutorRemove}
              onTimerChange={(stageKey, val) => onTimerChange(block.tplIdx, stageKey, val)}
              stageKeys={block.stageKeys}
              stagesField={block.stagesField}
              onClose={() => setShowingAll(false)}
            />
          ))}
        </div>
      )}
      {selectedUserId != null && (
        <div className="user-tasks-container">
          {executors
            .find((executor) => executor.id === selectedUserId)
            ?.blocks?.map((block) => (
              <TaskDetail
                key={block.id}
                id={block.id}
                label={block.label}
                startTime={block.startTime}
                endTime={block.endTime}
                performer={`РТК‑С, ${getOwnerName(block.id)}`}
                status={block.status}
                subSteps={block.subSteps}
                allExecutors={flatExecutors}
                executorsByStage={executorsByStage}
                onExecutorAdd={handleExecutorAdd}
                onExecutorRemove={handleExecutorRemove}
                onTimerChange={(stageKey, val) => onTimerChange(block.tplIdx, stageKey, val)}
                stageKeys={block.stageKeys}
                stagesField={block.stagesField}
                onClose={() => setSelectedUserId(null)}
              />
            ))}
        </div>
      )}
      {activeBlock && (
        <TaskDetail
          key={activeBlock.id}
          id={activeBlock.id}
          label={activeBlock.label}
          startTime={activeBlock.startTime}
          endTime={activeBlock.endTime}
          performer={`РТК‑С, ${getOwnerName(activeBlock.id)}`}
          status={activeBlock.status}
          subSteps={activeBlock.subSteps}
          allExecutors={flatExecutors}
          executorsByStage={executorsByStage}
          onExecutorAdd={handleExecutorAdd}
          onExecutorRemove={handleExecutorRemove}
          onTimerChange={(stageKey, val) => onTimerChange(activeBlock.tplIdx, stageKey, val)}
          stageKeys={activeBlock.stageKeys}
          stagesField={activeBlock.stagesField}
          onClose={() => setOpenBlockId(null)}
        />
      )}
    </div>
  );
};

export default PprPage;
