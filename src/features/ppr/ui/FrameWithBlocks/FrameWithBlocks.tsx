import React, { type FC, useMemo } from 'react';

import { parseTimeToMinutes } from '@/shared/ui/time/toTime';
import type { BlockExt } from '@features/ppr/ui/SingleExecutorRow/SingleExecutorRow';
import TemplateFrameBlock from '@features/ppr/ui/TemplateFrameBlock/TemplateFrameBlock';
import TimelineBlock from '@features/ppr/ui/TimelineBlock/TimelineBlock';

/**
 * для фильтрации этапов по роли инженера.
 * @param role название роли
 * @returns функция-предикат
 */
const blockHasRole = (role: string) => (block: BlockExt): boolean => {
    const keys: string[] = Array.isArray(block?.stageKeys) ? (block.stageKeys as string[]) : [];
    if (!keys.length) return false;

    const stagesField = (block as any)?.stagesField ?? {};
    for (const key of keys) {
        const st = stagesField?.[key];
        if (st && (st as any).engineer === role) return true;
    }
    return false;
};

interface FrameWithBlocksProps {
  execId: number;
  tplIdx: number;
  laneIdx: number;
  allBlocks: BlockExt[];
  rowsState: { id: number; blocks?: BlockExt[] }[];
  spanMin: number;
  startMin: number;
  coverageMap: Record<number, boolean>;
  openBlockId: number | null;
  setOpenBlockId(id: number | null): void;
  onBlockClick(tplIdx: number): void;
  rowParts: number;
}

/**
 * Компонент для фрейма-шаблона с вложенными TimelineBlock.
 * @param execId ID исполнителя
 * @param tplIdx индекс шаблона
 * @param laneIdx номер «полки» в строке
 * @param allBlocks все блоки из rowsState
 * @param rowsState исходный массив исполнителей
 * @param spanMin общая длина временного окна
 * @param startMin начало временного окна
 * @param coverageMap карта покрытия
 * @param openBlockId ID раскрытого блока
 * @param setOpenBlockId колбэк для установки раскрытого блока
 * @param onBlockClick колбэк клика по блоку
 * @param rowParts общее число «полок» в строке
 */
const FrameWithBlocks: FC<FrameWithBlocksProps> = ({
  execId,
  tplIdx,
  laneIdx,
  allBlocks,
  rowsState,
  spanMin,
  startMin,
  coverageMap,
  openBlockId,
  setOpenBlockId,
  onBlockClick,
  rowParts,
}) => {
    /**  набор id блоков, принадлежащих текущему исполнителю  */
    const blockIdsOfExec = useMemo<Set<number>>(() => {
        const row = rowsState.find((row) => row?.id === execId);
        const ids = new Set<number>();
        (row?.blocks ?? []).forEach((block) => {
            if (block && typeof block.id === 'number') ids.add(block.id);
        });
        return ids;
    }, [rowsState, execId]);

    /** Внутренние блоки данного шаблона (tplIdx) приписанные к текущему исполнителю */
    const inner: BlockExt[] = useMemo(() => {
        if (!Array.isArray(allBlocks) || allBlocks.length === 0 || blockIdsOfExec.size === 0) return [];
        return allBlocks.filter(
            (block) => block && block.tplIdx === tplIdx && typeof block.id === 'number' && blockIdsOfExec.has(block.id),
        );
    }, [allBlocks, tplIdx, blockIdsOfExec]);

    if (inner.length === 0) return null;

    /** Безопасный парс времени с поддержкой перехода через полночь */
    const toMin = (time: string): number | null => {
        try {
            const min = parseTimeToMinutes(time);
            return Number.isFinite(min) ? min : null;
        } catch {
            return null;
        }
    };

    /** Старт окна — минимальный start среди внутренних */
    const windowStartMinComputed = (() => {
        const startMinutesList = inner
            .map((block) => toMin(block.startTime))
            .filter((minutes): minutes is number => minutes !== null);
        if (startMinutesList.length === 0) return startMin;
        return Math.min(...startMinutesList);
    })();

    /** Финиш окна — максимальный end, нормализованный если end <= start (перешли через 00:00) */
    let windowEndMinComputed = (() => {
        const endMinutesList = inner
            .map((block) => {
                const startMinutes = toMin(block.startTime);
                const endMinutes = toMin(block.endTime);
                if (startMinutes === null || endMinutes === null) return null;
                return endMinutes <= startMinutes ? endMinutes + 1440 : endMinutes;
            })
            .filter((minutes): minutes is number => minutes !== null);
        if (endMinutesList.length === 0) return windowStartMinComputed;
        return Math.max(...endMinutesList);
    })();
    if (windowEndMinComputed <= windowStartMinComputed) windowEndMinComputed += 1440;

  const widthPx =
    (document.querySelector('.timeline-row__blocks') as HTMLElement | null)?.getBoundingClientRect().width ?? 0;

  return (
    <TemplateFrameBlock
      key={`all-${execId}-${tplIdx}-${laneIdx}`}
      idx={`${execId}-${tplIdx}`}
      startMin={windowStartMinComputed}
      endMin={windowEndMinComputed}
      windowStartMin={startMin}
      totalWindowMin={spanMin}
      containerWidthPx={widthPx}
      rowParts={rowParts}
      partIndex={laneIdx}
      isExpanded={false}
      onToggleExpand={() => {}}
      isSMRTemplate={inner.some(blockHasRole('Инженер СМР'))}
      isPZTemplate={inner.some(blockHasRole('Представитель Заказчика'))}
    >
      {inner.map((b) => (
        <TimelineBlock
          key={`blk-${execId}-${b.id}`}
          block={b}
          totalWindowMin={windowEndMinComputed - windowStartMinComputed}
          windowStartMin={windowStartMinComputed}
          expandedBlockId={openBlockId}
          setExpandedBlockId={setOpenBlockId}
          onDoubleClickBlock={setOpenBlockId}
          isCovered={!!coverageMap?.[b.id]}
          onClick={() => onBlockClick(b.tplIdx)}
          showStages
          laneParts={rowParts}
          laneIndex={laneIdx}
        />
      ))}
    </TemplateFrameBlock>
  );
};

export default FrameWithBlocks;
