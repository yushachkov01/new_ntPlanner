/**
 * PprPage — контейнер таймлайна ППР.
 * Отвечает только за разметку и делегирует всю бизнес-логику во внешний хук usePprTimeline.
 */
import { DndContext, closestCenter } from '@dnd-kit/core';
import type { FC } from 'react';

import './PprPage.css';
import { usePprTimeline } from '@/features/ppr/model/hooks/usePprTimeline';
import type { User } from '@entities/users/model/mapping/mapping';
import PprRow from '@features/ppr/ui/PprRow/PprRow';
import TaskDetail from '@features/ppr/ui/TaskDetail/TaskDetail';

/**
 * Свойства компонента PprPage
 * @property gridStart - начало временной сетки "HH:MM" (по умолчанию "00:00")
 * @property gridEnd - конец временной сетки "HH:MM" (по умолчанию "23:00")
 * @property executors - список исполнителей
 * @property onBlockClick - функция, вызываемая при клике на блок
 * @property onTimerChange - функция, вызываемая при изменении таймера задачи
 * @property onMoveBetweenExecutors - уведомление редактора о переносе между исполнителями
 */
interface Props {
  gridStart?: string;
  gridEnd?: string;
  executors: User[];
  onBlockClick: (tplIdx: number) => void;
  onTimerChange: (tplIdx: number, stageKey: string, newTimer: number) => void;
  onMoveBetweenExecutors?: (p: {
    templateKey?: string;
    sourceKey?: string;
    sourceRowId: number;
    targetRowId: number;
    sourceEmptyAfter: boolean;
  }) => void;
}

/**
 * Отображает таймлайн задач по исполнителям с интерактивными блоками и деталями.
 * @param gridStart - начало временной сетки
 * @param gridEnd - конец временной сетки
 * @param executors - список исполнителей
 * @param onBlockClick - обработчик клика по блоку
 * @param onTimerChange - обработчик изменения таймера задачи
 */
const PprPage: FC<Props> = ({
  gridStart = '00:00',
  gridEnd = '23:00',
  executors,
  onBlockClick,
  onTimerChange,
  onMoveBetweenExecutors,
}) => {
  /** значения и хелперы таймлайна из хука */
  const {
    /** снимок всех строк таймлайна из стора */
    data: { rowsState, rowsToRender, allBlocks },

    /** параметры разметки и геометрии таймлайна */
    layout: {
      /** подписи часов в шапке таймлайна */
      hourLabels,
      /** длительность видимого окна в минутах */
      windowSpanMin,
      /** старт окна в минутах с 00:00 (с учётом перехода через полночь) */
      windowStartMin,
      /** карта: какие блоки полностью покрыты другими */
      coverageMap,
      /** текущая ширина контейнера таймлайна */
      timelineWidthPx,
      /** ref на DOM-контейнер таймлайна (для вычисления ширины и DnD) */
      timelineContainerRef,
    },

    /** настройки и обработчики drag-and-drop */
    dnd: {
      /** сенсоры dnd-kit (мышь/тач) с нужными ограничениями */
      sensors,
      /** обработчик завершения перетаскивания (укладка без перекрытий) */
      handleDragEnd,
    },

    /** состояние UI и его сеттеры */
    ui: {
      /** активный блок, для которого открыты детали */
      activeBlock,
      /** установить/сбросить активный блок по id */
      setActiveBlockId,
      /** режим показа карточек для всех задач сразу */
      showingAllTasks,
      /** переключить режим показа всех задач */
      setShowingAllTasks,
      /** флаг: раскрыт ли список всех исполнителей */
      usersExpanded,
      /** переключить раскрытие списка исполнителей */
      setUsersExpanded,
      /** id исполнителя, чью строку показываем в свернутом режиме */
      expandedExecutorId,
      /** установить/сбросить выбранного исполнителя для показа */
      setExpandedExecutorId,
    },

    /** утилиты и данные, помогающие рендеру */
    helpers: {
      /** получить имя владельца блока по id блока */
      findOwnerName,
      /** список всех пользователей из стора (для селектов/деталей) */
      allExecutorsList,
    },
  } = usePprTimeline({ gridStart, gridEnd, executors, onTimerChange, onMoveBetweenExecutors });

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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

        <div ref={timelineContainerRef}>
          {rowsToRender.map((row) => (
            <PprRow
              key={row.id}
              row={row}
              rowsState={rowsState}
              hourLabels={hourLabels}
              spanMin={windowSpanMin}
              startMin={windowStartMin}
              coverageMap={coverageMap}
              openBlockId={activeBlock?.id ?? null}
              setOpenBlockId={setActiveBlockId}
              onBlockClick={onBlockClick}
              onTimerChange={onTimerChange}
              setExpandedUsers={setUsersExpanded}
              setShowingAll={setShowingAllTasks}
              timelineWidthPx={timelineWidthPx}
              expandedExecutorId={expandedExecutorId}
              setExpandedExecutorId={setExpandedExecutorId}
            />
          ))}
        </div>

        {showingAllTasks && (
          <div className="all-tasks-container">
            {allBlocks.map((block) => (
              <TaskDetail
                key={block.id}
                id={block.id}
                label={block.label}
                startTime={block.startTime}
                endTime={block.endTime}
                performer={`РТК-С, ${findOwnerName(block.id)}`}
                status={block.status}
                subSteps={block.subSteps}
                allExecutors={allExecutorsList}
                executorsByStage={{}}
                onExecutorAdd={() => {}}
                onExecutorRemove={() => {}}
                onTimerChange={(stageKey, newTimer) =>
                  onTimerChange(block.tplIdx, stageKey, newTimer)
                }
                stageKeys={block.stageKeys}
                stagesField={block.stagesField}
                onClose={() => setShowingAllTasks(false)}
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
            performer={`РТК-С, ${findOwnerName(activeBlock.id)}`}
            status={activeBlock.status}
            subSteps={activeBlock.subSteps}
            allExecutors={allExecutorsList}
            executorsByStage={{}}
            onTimerChange={(stageKey, newTimer) =>
              onTimerChange(activeBlock.tplIdx, stageKey, newTimer)
            }
            stageKeys={activeBlock.stageKeys}
            stagesField={activeBlock.stagesField}
            onClose={() => setActiveBlockId(null)}
          />
        )}
      </div>
    </DndContext>
  );
};

export default PprPage;
