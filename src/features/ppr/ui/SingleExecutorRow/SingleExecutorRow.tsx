import { useDroppable } from '@dnd-kit/core';
import type { FC } from 'react';

import { parseTimeToMinutes } from '@/shared/ui/time/toTime';
import type { Props } from '@features/ppr/ui/PprRow/PprRow';
import TemplateFrameBlock from '@features/ppr/ui/TemplateFrameBlock/TemplateFrameBlock';
import TimelineBlock from '@features/ppr/ui/TimelineBlock/TimelineBlock';
import type { BlockExt } from '@pages/PprPage/ui/PprPage';

/**
 * Проверяет, содержит ли блок этап с указанной ролью инженера.
 * @param block - блок с набором этапов
 * @param role - роль для поиска
 * @returns true, если такой этап найден
 */
const hasStage = (block: BlockExt, role: string) =>
  block.stageKeys.some((k) => (block.stagesField?.[k] as any)?.engineer === role);

/**
 * Отображает одну строку таймлайна для конкретного исполнителя.
 * Разбивает строку на "полки" при параллельных шаблонах и отображает
 * рамки шаблонов и вложенные блоки задач.
 * @param row - информация об исполнителе и его блоках
 * @param hourLabels - метки часов для сетки
 * @param spanMin - длина окна отображения в минутах
 * @param startMin - начало окна в минутах от 00:00
 * @param coverageMap - карта покрытия этапов
 * @param openBlockId - id развернутого блока
 * @param setOpenBlockId - функция установки развернутого блока
 * @param onBlockClick - колбэк при клике на шаблон (tplIdx)
 */
const SingleExecutorRow: FC<Props> = ({
  row,
  hourLabels,
  spanMin,
  startMin,
  coverageMap,
  openBlockId,
  setOpenBlockId,
  onBlockClick,
}) => {
  const { setNodeRef } = useDroppable({ id: row.id });

  /**
   * Список всех блоков исполнителя. Если блоки отсутствуют, используем пустой массив.
   */
  const blocks = row.blocks ?? [];
  /**
   * Уникальные индексы шаблонов у исполнителя. Определяют количество "полок".
   */
  const tplIds = Array.from(new Set(blocks.map((block) => block.tplIdx)));
  /** для строк исполнителей высота всегда одна «полка» */
  const rowParts = 1;
  const laneIdx = 0;

  const isRowSMR = row.role === 'Инженер СМР';
  const isRowPZ = row.role === 'Представитель Заказчика';

  return (
    <div ref={setNodeRef} className="timeline-row">
      <div className="timeline-row__icon-cell">
        <div className="avatar-single">
          <span className="avatar-icon">👤</span>
        </div>
      </div>
      <div className="timeline-row__label-cell">{row.author}</div>

      <div
        className="timeline-row__blocks"
        style={{ gridTemplateColumns: `repeat(${hourLabels.length}, 1fr)` }}
      >
        {hourLabels.map((_, i) => (
          <div key={i} className="timeline-row__grid-cell" />
        ))}

        {tplIds.map((tplIdx) => {
          const inner = blocks.filter((block) => block.tplIdx === tplIdx);
          if (!inner.length) return null;

          // вычисляем абсолютные границы шаблона (в минутах)
          const s = Math.min(...inner.map((block) => parseTimeToMinutes(block.startTime)));
          let e = Math.max(
            ...inner.map((block) => {
              const st = parseTimeToMinutes(block.startTime),
                en = parseTimeToMinutes(block.endTime);
              return en <= st ? en + 1440 : en;
            }),
          );
          if (e <= s) e += 1440;

          const widthPx =
            document.querySelector('.timeline-row__blocks')?.getBoundingClientRect().width ?? 0;

          return (
            <TemplateFrameBlock
              key={`row-${row.id}-${tplIdx}`}
              idx={row.id * 1000 + tplIdx}
              startMin={s}
              endMin={e}
              windowStartMin={startMin}
              totalWindowMin={spanMin}
              containerWidthPx={widthPx}
              rowParts={rowParts}
              partIndex={laneIdx}
              onToggleExpand={() => {}}
              isSMRTemplate={isRowSMR || inner.some((block) => hasStage(block, 'Инженер СМР'))}
              isPZTemplate={
                isRowPZ || inner.some((block) => hasStage(block, 'Представитель Заказчика'))
              }
            >
              {inner.map((block) => (
                <TimelineBlock
                  key={`blk-${row.id}-${block.id}`}
                  block={block}
                  totalWindowMin={e - s}
                  windowStartMin={s}
                  expandedBlockId={openBlockId}
                  setExpandedBlockId={setOpenBlockId}
                  onDoubleClickBlock={setOpenBlockId}
                  isCovered={!!coverageMap[block.id]}
                  onClick={() => onBlockClick(block.tplIdx)}
                  showStages
                  laneParts={rowParts}
                  laneIndex={laneIdx}
                />
              ))}
            </TemplateFrameBlock>
          );
        })}
      </div>
    </div>
  );
};

export default SingleExecutorRow;
