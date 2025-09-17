/**
 * PprPage — контейнер таймлайна ППР.
 * Отвечает только за разметку и делегирует всю бизнес-логику во внешний хук usePprTimeline.
 */
import { DndContext, closestCenter } from '@dnd-kit/core';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';

import './PprPage.css';
import { Collapse } from 'antd';
import { usePprTimeline } from '@/features/ppr/model/hooks/usePprTimeline';
import useTimelineStore from '@entities/timeline/model/store/timelineStore';
import type { User } from '@entities/users/model/mapping/mapping';
import PprRow from '@features/ppr/ui/PprRow/PprRow';
import TaskDetail from '@features/ppr/ui/TaskDetail/TaskDetail';
import {ALL_TASKS_ROW_ID} from "@/shared/constants";

/**
 * Свойства компонента PprPage
 * @property gridStart - начало временной сетки "HH:MM" (по умолчанию "00:00")
 * @property gridEnd - конец временной сетки "HH:MM" (по умолчанию "23:00")
 * @property executors - список исполнителей
 * @property onBlockClick - функция, вызываемая при клике на блок
 * @property onTimerChange - функция, вызываемая при изменении таймера задачи
 * @property onMoveBetweenExecutors - уведомление редактора о переносе между исполнителями
 * @property rowDisplayBySource - конфигурация отображения строк деталей по sourceKey
 */
interface Props {
  gridStart?: string;
  gridEnd?: string;
  executors: User[];
  onBlockClick?: (tplIdx: number) => void;
  onTimerChange?: (tplIdx: number, stageKey: string, minutes: number) => void;
  onMoveBetweenExecutors?: (blockId: number, fromExecId: number, toExecId: number) => void;
  rowDisplayBySource?: Record<string, { headers: string[]; row: string[]; colKeys: string[] }>;
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
                                rowDisplayBySource = {},
                            }) => {
    /** значения и хелперы таймлайна из хука */
    const timeline = usePprTimeline({
        gridStart,
        gridEnd,
        executors,
        onBlockClick,
        onTimerChange,
        onMoveBetweenExecutors,
    });
    /** снимок всех строк таймлайна из стора */
    const {
        data: {
            rowsToRender,
            allBlocks,
            rowsForUi,
            coverageMap,
        } = { rowsToRender: [], allBlocks: [], rowsForUi: {}, coverageMap: {} },

    /** параметры разметки и геометрии таймлайна */
    layout: {
      /** подписи часов в шапке таймлайна */
      hourLabels,
      /** длительность видимого окна в минутах */
      windowSpanMin,
      /** старт окна в минутах с 00:00 (с учётом перехода через полночь) */
      windowStartMin,
      /** ref на DOM-контейнер таймлайна (для вычисления ширины и DnD) */
      timelineContainerRef,
    } = {} as any,
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
        } = {} as any,

    /** утилиты и данные, помогающие рендеру */
    helpers,
    } = timeline as any;

  /**создать/свернуть доп. строку; проверка существования */
  const addExtraRowBelow = useTimelineStore((s) => s.addExtraRowBelow)!;
  const hasExtraRow = useTimelineStore((s) => s.hasExtraRow)!;
  const collapseEmptyExtraFor = useTimelineStore((s) => s.collapseEmptyExtraFor)!;
  const rowsSnapshot = useTimelineStore((s) => s.rows);

  /** есть ли блоки на самой доп. строке (для показа «−» только когда она пуста) */
  const extraHasBlocks = (baseId: number) => {
    const extra = (rowsSnapshot ?? []).find((r) => r.isExtra && r.parentId === baseId);
    return !!(extra && (extra.blocks?.length ?? 0) > 0);
  };

    /** Безопасные обёртки */
    const findOwnerNameSafe = (blockId: number) =>
        helpers && typeof helpers.findOwnerName === 'function' ? helpers.findOwnerName(blockId) : '';
    const allExecutorsList = helpers?.allExecutorsList ?? [];

    const safeRowsToRender = Array.isArray(rowsToRender)
        ? rowsToRender.filter((row: any) => row && typeof row.id === 'number')
        : [];

    //  агрегатор «Все Шаблоны» никогда не скрываем.
    const rowsForVisualRender = safeRowsToRender;

    /** Клик по аватару слева */
    const handleToggleUsersExpanded = () => {
        try {
            setUsersExpanded?.(!usersExpanded);
        } catch(e) {
            console.error('[PprPage] toggle usersExpanded failed:', e);
        }
    };

    /**
     * Источник данных для агрегатора (id=0):
     *  - берём базовые строки исполнителей (id != 0 && !isExtra)
     *  - находим их доп-строки (isExtra && parentId===baseId)
     */
    const rowsForAllTasksAggregation = React.useMemo(() => {
        const sourceRows = Array.isArray(rowsForUi) ? rowsForUi : Array.isArray(rowsSnapshot) ? rowsSnapshot : [];
        const baseRows = sourceRows.filter((row: any) => row && row.id !== ALL_TASKS_ROW_ID && !row.isExtra);
        const extraRows = sourceRows.filter((row: any) => row && row.isExtra && typeof row.parentId === 'number');

        const extrasByParent = new Map<number, any[]>();
        for (const er of extraRows) {
            const arr = extrasByParent.get(er.parentId) ?? [];
            arr.push(er);
            extrasByParent.set(er.parentId, arr);
        }

        const merged = baseRows.map((baseRow: any) => {
            const extraRowsForParent = extrasByParent.get(baseRow.id) ?? [];
            const extraBlocks = extraRowsForParent.flatMap((extraRow) => (Array.isArray(extraRow.blocks) ? extraRow.blocks : []));
            const baseBlocks = Array.isArray(baseRow.blocks) ? baseRow.blocks : [];
            return { ...baseRow, blocks: [...baseBlocks, ...extraBlocks] };
        });

        return merged;
    }, [rowsForUi, rowsSnapshot]);

    /** Видимые блоки  */
    const pickVisibleBlocks = (): any[] => {
        const visibleIds = Object.entries(coverageMap ?? {})
            .filter(([, isVisible]) => Boolean(isVisible))
            .map(([blockId]) => Number(blockId))
            .filter((blockId) => Number.isFinite(blockId));

        if (visibleIds.length) {
            const byId = new Map<number, any>();
            (allBlocks ?? []).forEach((block: any) => {
                if (block && typeof block.id === 'number') byId.set(block.id, block);
            });
            return visibleIds
                .map((id) => byId.get(id))
                .filter((block): block is any => Boolean(block));
        }

        const collectedBlocks: any[] = rowsForVisualRender.flatMap((row: any) => {
            const rowUi = (rowsForUi as any)?.[row.id];
            if (Array.isArray(rowUi) && rowUi.length) return rowUi;
            return Array.isArray(row?.blocks) ? row.blocks : [];
        });

        const uniqueBlocks = new Map<number, any>();
        for (const block of collectedBlocks) {
            if (block && typeof block.id === 'number' && !uniqueBlocks.has(block.id)) uniqueBlocks.set(block.id, block);
        }
        return Array.from(uniqueBlocks.values());
    };

    const visibleBlocks = pickVisibleBlocks();

    /** Группировка по шаблонам */
    const visibleTemplates = React.useMemo(() => {
        const map = new Map<number, any[]>();
        for (const block of visibleBlocks) {
            const key = Number(block?.tplIdx);
            if (!Number.isFinite(key)) continue;
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(block);
        }
        return map;
    }, [visibleBlocks]);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="ppr-page">
        <h2 className="ppr-page__title">
          Таймлайн ({gridStart}–{gridEnd})
        </h2>

        <div className="timeline-header" style={{ ['--hours' as any]: hourLabels.length }}>
          <div />
          <div />
          {hourLabels.map((hour) => (
            <div key={hour}>{String(hour).padStart(2, '0')}:00</div>
          ))}
        </div>

        <div ref={timelineContainerRef}>
          {rowsForVisualRender.map((row: any, index: number) => {
            /** не показываем кнопки на агрегаторе «Все задачи» (id === 0) и на доп. строках */
            const isParentRow = row.id !== ALL_TASKS_ROW_ID && !row.isExtra;
            const hasExtra = isParentRow && hasExtraRow(row.id);
            /** «+» показываем, если доп. строки нет; «−» — только если доп. строка есть и она пуста */
            const showAdd = isParentRow && !hasExtra;
            const showMinus = isParentRow && hasExtra && !extraHasBlocks(row.id);
            const rowsStateForThisRow =
                row.id === ALL_TASKS_ROW_ID ? rowsForAllTasksAggregation : rowsForVisualRender;
            return (
              /** обёртка для аккуратных кнопок «+» / «−» */
              <div key={row.id} className="ppr-row-wrap">
                {showAdd && (
                  <button
                    type="button"
                    className="ppr-row__add"
                    title="Добавить дополнительную строку"
                    aria-label="Добавить дополнительную строку"
                    onClick={() => addExtraRowBelow(row.id)}
                  >
                    +
                  </button>
                )}

                {showMinus && (
                  <button
                    type="button"
                    className="ppr-row__add"
                    title="Свернуть дополнительную строку"
                    aria-label="Свернуть дополнительную строку"
                    onClick={() => collapseEmptyExtraFor(row.id)}
                  >
                    −
                  </button>
                )}

                                {row.id !== ALL_TASKS_ROW_ID && (
                                    <div
                                        className="ppr-row__avatar-hit"
                                        onClick={handleToggleUsersExpanded}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') handleToggleUsersExpanded();
                                        }}
                                        aria-label="Показать/скрыть список исполнителей"
                                        style={{
                                            position: 'absolute',
                                            left: 8,
                                            top: 2,
                                            width: 44,
                                            height: 44,
                                            zIndex: 3,
                                            cursor: 'pointer',
                                        }}
                                    />
                                )}

                <PprRow
                  row={row}
                  rowsState={rowsStateForThisRow}
                  hourLabels={hourLabels}
                  spanMin={windowSpanMin}
                  startMin={windowStartMin}
                  coverageMap={coverageMap ?? {}}
                  openBlockId={activeBlock?.id ?? null}
                  setOpenBlockId={setActiveBlockId}
                  onBlockClick={(tplIdx) => onBlockClick?.(tplIdx)}
                  setExpandedUsers={setUsersExpanded}
                  isExpandedUsers={usersExpanded}
                  setShowingAll={setShowingAllTasks}
                />
              </div>
            );
          })}
        </div>

                {/* НИЖНЯЯ СЕКЦИЯ: collapse по видимым шаблонам */}
                {showingAllTasks && visibleTemplates.size > 0 && (
                    <Collapse
                        className="all-tasks-section"
                        accordion={false}
                        items={Array.from(visibleTemplates.entries()).map(([tplIdx, blocks]) => {
                            const block = blocks[0];
                            const performer = `РТК-С, ${findOwnerNameSafe(block.id)}`;
                            const header = `${block.label} — ${block.startTime} … ${block.endTime} — ${performer}`;

                            const src = String(block?.sourceKey ?? '');
                            const display = src ? rowDisplayBySource[src] : undefined;

                            return {
                                key: String(tplIdx),
                                label: header,
                                children: (
                                    <TaskDetail
                                        key={`tpl-${tplIdx}`}
                                        tplIdx={block.tplIdx}
                                        id={block.id}
                                        label={block.label}
                                        startTime={block.startTime}
                                        endTime={block.endTime}
                                        performer={performer}
                                        status={block.status}
                                        subSteps={block.subSteps}
                                        allExecutors={allExecutorsList}
                                        executorsByStage={{}}
                                        onTimerChange={(stageKey, newTimer) => onTimerChange?.(block.tplIdx, stageKey, newTimer)}
                                        stageKeys={block.stageKeys}
                                        stagesField={block.stagesField}
                                        onClose={() => setShowingAllTasks(false)}
                                        displayHeaders={display?.headers ?? []}
                                        displayRow={display?.row ?? []}
                                        displayColKeys={display?.colKeys ?? []}
                                        hideTitle
                                    />
                                ),
                            };
                        })}
                    />
                )}

                {activeBlock &&
                    (() => {
                        const src = String((activeBlock as any)?.sourceKey ?? '');
                        const display = src ? rowDisplayBySource[src] : undefined;
                        return (
                            <TaskDetail
                                key={activeBlock.id}
                                tplIdx={activeBlock.tplIdx}
                                id={activeBlock.id}
                                label={activeBlock.label}
                                startTime={activeBlock.startTime}
                                endTime={activeBlock.endTime}
                                performer={`РТК-С, ${findOwnerNameSafe(activeBlock.id)}`}
                                status={activeBlock.status}
                                subSteps={activeBlock.subSteps}
                                allExecutors={allExecutorsList}
                                executorsByStage={{}}
                                onTimerChange={(stageKey, newTimer) =>
                                    onTimerChange?.(activeBlock.tplIdx, stageKey, newTimer)
                                }
                                stageKeys={activeBlock.stageKeys}
                                stagesField={activeBlock.stagesField}
                                onClose={() => setActiveBlockId(null)}
                                displayHeaders={display?.headers ?? []}
                                displayRow={display?.row ?? []}
                                displayColKeys={display?.colKeys ?? []}
                            />
                        );
                    })()}
            </div>
        </DndContext>
    );
};

export default PprPage;
