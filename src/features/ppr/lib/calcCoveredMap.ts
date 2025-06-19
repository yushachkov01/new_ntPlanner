import type { BlockData } from '../model/types.ts';

export function calcCoveredMap(blocks: BlockData[]): Record<number, boolean> {
  const covered: Record<number, boolean> = {};
  const toMin = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  for (let i = 0; i < blocks.length; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      const a = blocks[i],
        b = blocks[j];
      const aStart = toMin(a.startTime),
        aEnd = toMin(a.endTime);
      const bStart = toMin(b.startTime),
        bEnd = toMin(b.endTime);

      if (aStart < bStart && aEnd > bEnd) covered[b.id] = true;
      else if (bStart < aStart && bEnd > aEnd) covered[a.id] = true;
      else if (aStart === bStart && aEnd >= bEnd) covered[b.id] = true;
      else if (bStart === aStart && bEnd >= aEnd) covered[a.id] = true;
    }
  }
  return covered;
}
