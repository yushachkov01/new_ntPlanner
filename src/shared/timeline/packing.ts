import {parseTimeToMinutes, toTime} from "@/shared/ui/time/toTime";
import {toAbs} from "@/shared/time";

/**
 * Упаковывает блоки «в начало окна», сохраняя относительный порядок по возрастанию start.
 */
export function packRowBlocksToStart(blocks: any[], windowStartMin: number) {
    if (!blocks?.length) return blocks;
    const items = blocks
        .map((block) => {
            const blockStartMin = parseTimeToMinutes(block.startTime);
            const blockEndMin = parseTimeToMinutes(block.endTime);
            const [, eAbs] = toAbs(blockStartMin, blockEndMin);
            return { block, duration: Math.max(1, eAbs - blockStartMin), start: blockStartMin};
        })
        .sort((left, right) => left.start - right.start);

    let cursor = windowStartMin;
    return items.map(({ block, duration }) => ({
        ...block,
        startTime: toTime(cursor),
        endTime: toTime((cursor += duration)),
    }));
}
