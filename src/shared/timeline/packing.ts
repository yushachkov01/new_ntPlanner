import {parseTimeToMinutes, toTime} from "@/shared/ui/time/toTime";
import {toAbs} from "@/shared/time";
import {Executor} from "@features/ppr/model/types";

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

/**
 * Находит значение конца блока в строке (в абсолютных минутах).
 *
 * @param row — строка исполнителя
 * @param fallback — значение по умолчанию, если строка пустая
 * @returns максимальный конец (endTime) в минутах
 */
export function calcRowLastEndAbs(row: Executor, fallback: number): number {
    const blocks = row.blocks ?? [];
    if (!blocks.length) return fallback;

    let lastEndAbs = -Infinity;
    for (const block of blocks) {
        const startMin = parseTimeToMinutes(block.startTime);
        const endMin = parseTimeToMinutes(block.endTime);
        const [, absEnd] = toAbs(startMin, endMin);
        if (absEnd > lastEndAbs) lastEndAbs = absEnd;
    }

    return Number.isFinite(lastEndAbs) ? lastEndAbs : fallback;
}

/**
 * Сдвигает все блоки с определённым tplIdx на указанное количество минут.
 *
 * @param blocks — массив блоков
 * @param tplIdx — идентификатор бандла
 * @param deltaMin — смещение в минутах
 * @returns новый массив блоков со сдвигом
 */
export function shiftBlocksOfTpl(blocks: any[], tplIdx: number, deltaMin: number): any[] {
    return blocks.map((block) => {
        if (block.tplIdx !== tplIdx) return block;
        const startMin = parseTimeToMinutes(block.startTime);
        const endMin = parseTimeToMinutes(block.endTime);
        const [absStart, absEnd] = toAbs(startMin, endMin);
        return {
            ...block,
            startTime: toTime(absStart + deltaMin),
            endTime: toTime(absEnd + deltaMin),
        };
    });
}
