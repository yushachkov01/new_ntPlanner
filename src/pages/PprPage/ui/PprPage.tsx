import type { DragEndEvent } from '@dnd-kit/core';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import type { FC } from 'react';
import { useState, useMemo, useCallback, useRef, useEffect, useLayoutEffect } from 'react';

import type { StageField } from '@/entities/template/model/store/templateStore';
import { parseTimeToMinutes, toTime } from '@/shared/ui/time/toTime';
import type { User } from '@entities/users/model/mapping/mapping';
import { useUserStore } from '@entities/users/model/store/userStore';
import { calcCoveredMap } from '@features/ppr/lib/calcCoveredMap';
import PprRow from '@features/ppr/ui/PprRow/PprRow';
import TaskDetail from '@features/ppr/ui/TaskDetail/TaskDetail';
import './PprPage.css';

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
export interface BlockExt {
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

export interface Executor {
  id: number;
  author: string;
  role: string;
  blocks?: BlockExt[];
}

/**
 * Свойства компонента PprPage
 * @property gridStart - начало временной сетки "HH:MM" (по умолчанию "00:00")
 * @property gridEnd - конец временной сетки "HH:MM" (по умолчанию "23:00")
 * @property executors - список исполнителей
 * @property onBlockClick - функция, вызываемая при клике на блок
 * @property onTimerChange - функция, вызываемая при изменении таймера задачи
 */
interface Props {
  gridStart?: string;
  gridEnd?: string;
  executors: User[];
  onBlockClick: (tplIdx: number) => void;
  onTimerChange: (tplIdx: number, stageKey: string, newTimer: number) => void;
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
}) => {
  /** Локальный стейт строк (копия блоков исполнителей) */
  const [rowsState, setRowsState] = useState<Executor[]>(executors);
  useEffect(() => setRowsState(executors), [executors]);

  /** Расширенный вид пользователей и “Все задачи” */
  const [usersExpanded, setUsersExpanded] = useState(false);
  const [showingAllTasks, setShowingAllTasks] = useState(false);
  const [expandedExecutorId, setExpandedExecutorId] = useState<number | null>(null);

  /** ID открытого блока (для popover / detail) */
  const [activeBlockId, setActiveBlockId] = useState<number | null>(null);

  /** рассчитываем окно времени в минутах */
  const windowStartMin = parseTimeToMinutes(gridStart);
  const rawEndMin = parseTimeToMinutes(gridEnd);
  const windowEndMin = rawEndMin <= windowStartMin ? rawEndMin + 1440 : rawEndMin;
  const windowSpanMin = windowEndMin - windowStartMin;

  /**
   * Массив меток часов, по которым строится сетка на таймлайне
   */
  const hourLabels = Array.from({ length: Math.ceil(windowSpanMin / 60) + 1 }, (_, index) =>
    Math.floor(((windowStartMin + index * 60) % 1440) / 60),
  );

  /** Список всех блоков для расчёта перекрытий */
  const allBlocks = rowsState.flatMap((row) => row.blocks ?? []);
  const coverageMap = useMemo(() => calcCoveredMap(allBlocks), [allBlocks]);

  /** DRAG & DROP: сенсоры для pointer & touch */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  );

  /** Ref контейнера таймлайна для измерения ширины */
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const [timelineWidthPx, setTimelineWidthPx] = useState(0);
  useLayoutEffect(() => {
    if (timelineContainerRef.current) {
      setTimelineWidthPx(timelineContainerRef.current.getBoundingClientRect().width);
    }
  }, []);

  /**
   * Обработчик завершения перетаскивания блока:
   * пересчитывает время задач и перемещает bundle блоков в строке
   * @param event - событие окончания drag
   */
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const activeIdStr = event.active.id.toString();
      if (!activeIdStr.startsWith('template-')) return;

      const uniqueId = Number(activeIdStr.replace('template-', ''));
      const sourceRowId = Math.floor(uniqueId / 1000);
      const templateIndex = uniqueId % 1000;
      const targetRowId = typeof event.over?.id === 'number' ? event.over.id : sourceRowId;

      const containerWidth = timelineContainerRef.current?.getBoundingClientRect().width ?? 1;
      const deltaMinutes = (event.delta.x / containerWidth) * windowSpanMin;

      setRowsState((prevRows) => {
        const nextRows = prevRows.map((r) => ({
          ...r,
          blocks: [...(r.blocks ?? [])],
        }));
        const sourceRow = nextRows.find((r) => r.id === sourceRowId);
        if (!sourceRow) return prevRows;

        const movingBundle = sourceRow.blocks!.filter((b) => b.tplIdx === templateIndex);
        sourceRow.blocks = sourceRow.blocks!.filter((b) => b.tplIdx !== templateIndex);

        movingBundle.forEach((block) => {
          block.startTime = toTime(parseTimeToMinutes(block.startTime) + deltaMinutes);
          block.endTime = toTime(parseTimeToMinutes(block.endTime) + deltaMinutes);
        });

        const destRow = nextRows.find((r) => r.id === targetRowId) ?? sourceRow;
        destRow.blocks!.push(...movingBundle);

        return nextRows;
      });
    },
    [windowSpanMin],
  );

  /** Список всех пользователей из стора для деталей задач */
  const storedUsers: User[] = useUserStore((s) => s.users);
  const allExecutorsList = useMemo(() => [...storedUsers], [storedUsers]);

  /**
   * Находит автора блока по его ID
   * @param blockId - ID блока задачи
   * @returns имя автора или "Неизвестен"
   */
  const findOwnerName = (blockId: number): string =>
    rowsState.find((r) => r.blocks?.some((b) => b.id === blockId))?.author ?? 'Неизвестен';

  /**
   * Формирует маппинг исполнителей по этапам блока для TaskDetail
   * @param block - расширенный блок задачи
   */
  const buildExecutorsByStage = (block: BlockExt) => {
    const result: Record<string, { id: number; author: string; role: string }[]> = {};
    block.stageKeys.forEach((stageKey) => {
      result[stageKey] = [{ id: block.id, author: findOwnerName(block.id), role: '' }];
    });
    return result;
  };

  /**
   * Определяет список строк для рендеринга:
   * сначала «Все Задачи», затем по исполнителям
   */
  const rowsToRender: Executor[] = [
    { id: 0, author: 'Все Задачи', role: '', blocks: allBlocks },
    ...(usersExpanded ? rowsState : rowsState.filter((r) => r.id === expandedExecutorId)),
  ];

  const activeBlock = allBlocks.find((b) => b.id === activeBlockId) ?? null;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="ppr-page">
        <h2 className="ppr-page__title">
          Таймлайн ({gridStart}–{gridEnd})
        </h2>
        <div
          className="timeline-header"
          style={{
            gridTemplateColumns: `4rem 4rem repeat(${hourLabels.length},1fr)`,
          }}
        >
          <div />
          <div />
          {hourLabels.map((hourValue) => (
            <div key={hourValue}>{String(hourValue).padStart(2, '0')}:00</div>
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
              openBlockId={activeBlockId}
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
                executorsByStage={buildExecutorsByStage(block)}
                onExecutorAdd={() => {}}
                onExecutorRemove={() => {}}
                onTimerChange={(stageKey, val) => onTimerChange(block.tplIdx, stageKey, val)}
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
            performer={`РТК‑С, ${findOwnerName(activeBlock.id)}`}
            status={activeBlock.status}
            subSteps={activeBlock.subSteps}
            allExecutors={allExecutorsList}
            executorsByStage={buildExecutorsByStage(activeBlock)}
            onExecutorAdd={() => {}}
            onExecutorRemove={() => {}}
            onTimerChange={(stageKey, val) => onTimerChange(activeBlock.tplIdx, stageKey, val)}
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
