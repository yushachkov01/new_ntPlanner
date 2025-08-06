import type { FC } from 'react';
import React from 'react';

import { parseTimeToMinutes } from '@/shared/ui/time/toTime';
import type { BlockExt } from '@features/ppr/ui/SingleExecutorRow/SingleExecutorRow';
import TemplateFrameBlock from '@features/ppr/ui/TemplateFrameBlock/TemplateFrameBlock';
import TimelineBlock from '@features/ppr/ui/TimelineBlock/TimelineBlock';

/**
 * для фильтрации этапов по роли инженера.
 * @param role название роли
 * @returns функция-предикат
 */
function has(role: string) {
  return (b: BlockExt): boolean =>
    b.stageKeys.some((k) => (b.stagesField?.[k] as any)?.engineer === role);
}

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
  const inner = allBlocks.filter(
    (b) =>
      b.tplIdx === tplIdx &&
      rowsState.some((r) => r.id === execId && r.blocks?.some((bl) => bl.id === b.id)),
  );
  if (!inner.length) return null;

  const s = Math.min(...inner.map((b) => parseTimeToMinutes(b.startTime)));
  let e = Math.max(
    ...inner.map((b) => {
      const st = parseTimeToMinutes(b.startTime),
        en = parseTimeToMinutes(b.endTime);
      return en <= st ? en + 1440 : en;
    }),
  );
  if (e <= s) e += 1440;

  const widthPx =
    document.querySelector('.timeline-row__blocks')?.getBoundingClientRect().width ?? 0;

  return (
    <TemplateFrameBlock
      key={`all-${execId}-${tplIdx}-${laneIdx}`}
      idx={`${execId}-${tplIdx}`}
      startMin={s}
      endMin={e}
      windowStartMin={startMin}
      totalWindowMin={spanMin}
      containerWidthPx={widthPx}
      rowParts={rowParts}
      partIndex={laneIdx}
      isExpanded={false}
      onToggleExpand={() => {}}
      isSMRTemplate={inner.some(has('Инженер СМР'))}
      isPZTemplate={inner.some(has('Представитель Заказчика'))}
    >
      {inner.map((b) => (
        <TimelineBlock
          key={`blk-${execId}-${b.id}`}
          block={b}
          totalWindowMin={e - s}
          windowStartMin={s}
          expandedBlockId={openBlockId}
          setExpandedBlockId={setOpenBlockId}
          onDoubleClickBlock={setOpenBlockId}
          isCovered={!!coverageMap[b.id]}
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
