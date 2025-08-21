/**
 * Хранилище таймлайна (Zustand): строки-исполнители и их блоки.
 */
import { create } from 'zustand';

import type { StageField } from '@/entities/template/model/store/templateStore';
import { parseTimeToMinutes, toTime } from '@/shared/ui/time/toTime';
import type { BlockExt, Executor } from '@entities/timeline/model/types/types';

import { repackRowLeft } from '../logic/pack';
import { normSource, parseDurationToMinutes, toRowId, absEnd } from '../utils/time';

/**
 * Параметры добавления бандла из YAML
 * params
 *  - execIds: список исполнителей (если не указан — всем текущим)
 *  - label: подпись задачи/бандла
 *  - stageKeys: последовательность стадий
 *  - stagesField: метаданные стадий по ключу
 *  - windowStartMin: опорный старт окна (минуты)
 *  - sourceKey: связка с записью в таблице (для удаления)
 */
type AddFromYamlParams = {
  execIds?: Array<string | number>;
  label: string;
  stageKeys: string[];
  stagesField: Record<string, StageField>;
  windowStartMin?: number;
  sourceKey?: string | number;
};

/**
 * Параметры удаления блоков по sourceKey
 * params
 *  - execIds: список исполнителей (если не указан — у всех)
 *  - sourceKey: ключ-источник (привязка к записи таблицы)
 */
type RemoveParams = { execIds?: Array<string | number>; sourceKey: string | number };

/**
 * Параметры удаления блоков по префиксу ключа
 * @property execIds - список исполнителей (если не указан — у всех)
 * @property prefix - строка-префикс ключа
 */
type RemoveByPrefixParams = { execIds?: Array<string | number>; prefix: string };

/**
 * Параметры очистки блоков у исполнителей
 * params
 *  - execIds: список исполнителей (если не указан — у всех)
 */
type ResetParams = { execIds?: Array<string | number> };

/**
 * Интерфейс состояния Zustand для таймлайна
 */
interface TimelineState {
  /** Текущее состояние строк таймлайна (исполнители + их блоки) */
  rows: Executor[];

  /**
   * Полная замена массива строк.
   */
  setRows: (rows: Executor[]) => void;

  /**
   * Добавить бандл из YAML (последовательно для указанных исполнителей)
   */
  addFromYaml: (params: AddFromYamlParams) => void;

  /**
   * Удалить все блоки, созданные одной записью (по sourceKey),
   * только у указанных исполнителей (или у всех)
   */
  removeBySource: (params: RemoveParams) => void;

  /** Удалить блоки по префиксу ключа */
  removeBySourcePrefix?: (params: RemoveByPrefixParams) => void;

  /**
   * Очистить блоки у указанных исполнителей (или у всех).
   * Используем при смене шаблона.
   */
  resetExecutors: (params?: ResetParams) => void;

  /**- transferRowBlocks — перенести ВСЕ блоки со строки fromExecId на строку toExecId */
  transferRowBlocks?: (params: { fromExecId: number | string; toExecId: number | string }) => void;

  /** Сжать блоки в строке влево */
  compactRowLeft?: (rowId: number, startRefMin?: number) => void;

  /** Сжать блоки в нескольких строках */
  compactRowsLeft?: (rowIds: number[], startRefMin?: number) => void;

  /** Привязать (снапнуть) блоки к левому краю с учётом ссылки */
  snapRowLeft?: (rowId: number, startRefMin?: number) => void;
  /** ===== доп. строка исполнителя ===== */
  addEmptyExtraRowFor?: (baseRowId: number) => void;
  /** алиас под существующий UI-колбэк */
  addExtraRowBelow?: (baseRowId: number) => void;
  /** Проверить, есть ли у исполнителя доп. строка */
  hasExtraRow?: (baseRowId: number) => boolean;
  /** Проверить, относятся ли строки к одному исполнителю */
  isSamePersonRow?: (rowA: number, rowB: number) => boolean;
  /** удаление пустой доп. строки (возвращаем «+») */
  collapseEmptyExtraFor?: (rowOrBaseId: number) => void;
  /**  массово: убрать все пустые доп. строки (на случай dnd в ту же строку) */
  collapseAllEmptyExtras?: () => void;
  /**
   * Обновить длительность всех блоков конкретной стадии внутри бандла
   * Используется при ручном изменении «Таймер (мин)» в карточке задачи.
   */
  updateTplStageDuration?: (params: { tplIdx: number; stageKey: string; minutes: number }) => void;
}

/**
 * Минимальное значение минут (гарантия что > 0)
 * @param numberValue - исходное число
 * @returns округлённое значение (>= 1)
 */
const min1 = (numberValue: number) => (numberValue > 0 ? Math.floor(numberValue) : 1);

/**
 * Построение последовательности стадий по цепочке if_success,
 * начиная со стартового ключа
 */
function orderStagesByIfSuccess(
  stageKeys: string[],
  stagesField: Record<string, StageField>,
): string[] {
  const out: string[] = [];
  if (!stageKeys || stageKeys.length === 0) return out;

  let current = stageKeys[0];
  const visited = new Set<string>();
  let guard = 0;

  while (current && !visited.has(current) && guard++ < 1000) {
    const meta: any = (stagesField as any)[current];
    if (!meta) break;

    out.push(current);
    visited.add(current);

    let next: any = meta?.if_success;
    if (Array.isArray(next)) next = next[0];

    // конец ветки
    if (!next || typeof next !== 'string' || next === 'exit') break;

    // если следующая стадия не определена в stages — останавливаемся
    if (!(next in stagesField)) break;
    current = next;
  }
  return out;
}

/**
 * стартовая стадия цепочки if_success:
 */
function guessStartStageKey(
  stageSet: Set<string>,
  stagesField: Record<string, StageField>,
): string | undefined {
  const hasIncoming = new Set<string>();
  for (const key of stageSet) {
    const meta: any = (stagesField as any)[key];
    let next: any = meta?.if_success;
    if (Array.isArray(next)) next = next[0];
    if (typeof next === 'string' && next !== 'exit' && stageSet.has(next)) {
      hasIncoming.add(next);
    }
  }
  for (const key of stageSet) {
    if (!hasIncoming.has(key)) return key;
  }
  return [...stageSet][0];
}

/**
 * Хук-слайс Zustand для работы с таймлайном.
 */
const useTimelineStore = create<TimelineState>((set, get) => ({
  /** Массив строк-исполнителей с блоками */
  rows: [],

  /**
   * Установка массива строк.
   * Гарантируем, что в стор попадает именно массив (в противном случае — пустой).
   * params
   *  - rows: новый массив строк
   */
  setRows: (rows) => set({ rows: Array.isArray(rows) ? rows : [] }),

  /**
   * Добавление бандла из YAML ко всем/указанным исполнителям.
   * Кладем последовательно и без перекрытий; глобальный курсор «перетекает» между исполнителями.
   * params
   *  - execIds, label, stageKeys, stagesField, windowStartMin, sourceKey
   */
  addFromYaml: ({
    execIds,
    label,
    stageKeys,
    stagesField,
    windowStartMin = 0,
    sourceKey,
  }: AddFromYamlParams) => {
    set((state) => {
      /** Копия текущих строк с блоками */
      const nextRows = (state.rows ?? []).map((row) => ({
        ...row,
        blocks: [...(row.blocks ?? [])],
      }));

      /**
       * Целевые исполнители: либо те, что передали, либо все строки.
       * Преобразуем идентификаторы в стабильные числовые rowId.
       */
      const targetRowIds = (execIds && execIds.length ? execIds : [toRowId('default')]).map(
        toRowId,
      );

      /** Если строки ещё нет — добавляем пустую */
      for (const rowId of targetRowIds) {
        if (!nextRows.some((row) => row.id === rowId)) {
          nextRows.push({ id: rowId, author: '', role: '', blocks: [] });
        }
      }

      /** Стартовое время для каждого исполнителя */
      const baseStartByRow = new Map<number, number>();
      for (const rowId of targetRowIds) {
        const row = nextRows.find((r) => r.id === rowId)!;
        const blocks = row.blocks ?? [];
        const startMin =
          blocks.length === 0
            ? Math.max(0, Math.floor(windowStartMin))
            : Math.max(
                ...blocks.map((block) =>
                  absEnd(parseTimeToMinutes(block.startTime), parseTimeToMinutes(block.endTime)),
                ),
              );
        baseStartByRow.set(rowId, startMin);
      }

      /** Следующий уникальный id блока */
      const nextBlockId =
        Math.max(0, ...nextRows.flatMap((r) => r.blocks ?? []).map((block) => block.id)) + 1;
      let runningBlockId = nextBlockId;

      /** Индекс шаблона */
      const nextTplIdxBase =
        Math.max(-1, ...nextRows.flatMap((r) => r.blocks ?? []).map((block) => block.tplIdx)) + 1;

      /** строим порядок по if_success, начиная с первого ключа  */
      const orderedStageKeys = orderStagesByIfSuccess(stageKeys, stagesField);

      /** Добавляем блоки по каждому исполнителю */
      for (const rowId of targetRowIds) {
        const row = nextRows.find((r) => r.id === rowId)!;
        const blocks = row.blocks ?? [];
        let cursor = baseStartByRow.get(rowId)!;
        /**
         * Новый tplIdx для этой строки — чтобы свежедобавленный бандл
         * не «склеивался» с уже существующими при переносах.
         */
        const tplIdx = nextTplIdxBase + (rowId === targetRowIds[0] ? 0 : 1);
        /** Последовательно добавляем стадии бандла */
        for (const stageKey of orderedStageKeys) {
          /** Метаданные стадии (таймеры и т.п.) */
          const stageMeta = (stagesField as any)[stageKey];
          const rawDur = stageMeta?.duration ?? stageMeta?.time ?? 0;
          const parsed = parseDurationToMinutes(rawDur);
          const durationMin = min1(parsed);

          /** Старт и конец блока */
          const stageStartAbsMin = cursor;
          const stageEndAbsMin = stageStartAbsMin + durationMin;

          /** Создаем блок стадии */
          blocks.push({
            id: runningBlockId++,
            label: String(label ?? stageKey),
            startTime: toTime(stageStartAbsMin % (24 * 60)),
            endTime: toTime(stageEndAbsMin % (24 * 60)),
            tplIdx,
            stageKeys: [stageKey],
            stagesField,
            sourceKey: normSource(sourceKey ?? `${label}::${stageKey}`),
          });

          cursor = stageEndAbsMin;
        }

        /** Сдвигаем блоки к левому краю */
        repackRowLeft(row, baseStartByRow.get(rowId)!);
      }

      return { rows: nextRows };
    });
  },

  /**
   * Удаляет все блоки, у которых sourceKey совпадает
   * (точечное удаление по строке таблицы), для указанных исполнителей или всех.
   * params
   *  - execIds, sourceKey
   */
  removeBySource: ({ execIds, sourceKey }) => {
    const key = normSource(sourceKey);
    if (!key) return;

    set((state) => {
      const rows = (state.rows ?? []).map((row) => ({ ...row, blocks: [...(row.blocks ?? [])] }));
      const byIds = new Set((execIds ?? []).map(toRowId));

      for (const row of rows) {
        if (byIds.size && !byIds.has(row.id)) continue;
        row.blocks = (row.blocks ?? []).filter((block) => (block.sourceKey ?? '') !== key);
        repackRowLeft(row, 0);
      }
      return { rows };
    });
  },

  /**
   * Удаление блоков по префиксу sourceKey
   */
  removeBySourcePrefix: ({ execIds, prefix }) => {
    const prefixStr = String(prefix ?? '').trim();
    if (!prefixStr) return;

    set((state) => {
      const rows = (state.rows ?? []).map((row) => ({ ...row, blocks: [...(row.blocks ?? [])] }));
      const byIds = new Set((execIds ?? []).map(toRowId));

      for (const row of rows) {
        if (byIds.size && !byIds.has(row.id)) continue;
        row.blocks = (row.blocks ?? []).filter(
          (block) => !String(block.sourceKey ?? '').startsWith(prefixStr),
        );
        repackRowLeft(row, 0);
      }
      return { rows };
    });
  },

  /**
   * Полностью очищает блоки у указанных исполнителей (или у всех).
   * params
   *  - execIds?: список исполнителей
   */
  resetExecutors: ({ execIds }: ResetParams = {}) => {
    set((state) => {
      if (!execIds || execIds.length === 0) return { rows: [] as Executor[] };
      const ids = new Set(execIds.map(toRowId));
      const rows = (state.rows ?? []).filter((r) => !ids.has(r.id));
      return { rows };
    });
  },

  /**- transferRowBlocks — перенести ВСЕ блоки со строки fromExecId на строку toExecId */
  transferRowBlocks: ({ fromExecId, toExecId }) => {
    const fromId = toRowId(fromExecId);
    const toId = toRowId(toExecId);
    if (fromId === toId) return;

    set((state) => {
      const rows = Array.isArray(state.rows) ? [...state.rows] : [];
      const fromIdx = rows.findIndex((r) => r.id === fromId);
      const toIdx = rows.findIndex((r) => r.id === toId);
      if (fromIdx < 0 || toIdx < 0) return state;

      const fromRow = { ...rows[fromIdx], blocks: [...(rows[fromIdx].blocks ?? [])] };
      const toRow = { ...rows[toIdx], blocks: [...(rows[toIdx].blocks ?? [])] };

      const oldTpls = Array.from(new Set((fromRow.blocks ?? []).map((block) => block.tplIdx))).sort(
        (a, b) => a - b,
      );
      const nextIdxBase = Math.max(-1, ...(toRow.blocks ?? []).map((block) => block.tplIdx)) + 1;
      const idxMap = new Map<number, number>(oldTpls.map((tpl, i) => [tpl, nextIdxBase + i]));

      const moving: BlockExt[] = [];
      for (const block of fromRow.blocks ?? []) {
        moving.push({ ...block, tplIdx: idxMap.get(block.tplIdx)! });
      }
      /** Исходную строку очищаем */
      fromRow.blocks = [];
      toRow.blocks = [...(toRow.blocks ?? []), ...moving];

      repackRowLeft(fromRow, 0);
      repackRowLeft(toRow, 0);

      rows[fromIdx] = fromRow;
      rows[toIdx] = toRow;
      return { rows };
    });
  },

  /**
   * Сжимает блоки в строке
   */
  compactRowLeft: (rowId, startRefMin = 0) => {
    set((state) => {
      const rows = Array.isArray(state.rows) ? [...state.rows] : [];
      const idx = rows.findIndex((r) => r.id === rowId);
      if (idx < 0) return state;
      const row = { ...rows[idx], blocks: [...(rows[idx].blocks ?? [])] };
      repackRowLeft(row, startRefMin);
      rows[idx] = row;
      return { rows };
    });
  },

  /**
   * Сжимает блоки в нескольких строках
   */
  compactRowsLeft: (rowIds, startRefMin = 0) => {
    set((state) => {
      const rows = Array.isArray(state.rows) ? [...state.rows] : [];
      const setIds = new Set(rowIds.map(toRowId));
      for (let i = 0; i < rows.length; i++) {
        if (!setIds.has(rows[i].id)) continue;
        const row = { ...rows[i], blocks: [...(rows[i].blocks ?? [])] };
        repackRowLeft(row, startRefMin);
        rows[i] = row;
      }
      return { rows };
    });
  },

  /**
   * Привязывает блоки в строке к левому краю
   */
  snapRowLeft: (rowId, startRefMin = 0) => {
    set((state) => {
      const rows = Array.isArray(state.rows) ? [...state.rows] : [];
      const idx = rows.findIndex((r) => r.id === rowId);
      if (idx < 0) return state;
      const row = { ...rows[idx], blocks: [...(rows[idx].blocks ?? [])] };
      repackRowLeft(row, startRefMin);
      rows[idx] = row;
      return { rows };
    });
  },

  /** доп. строка исполнителя  */

  addEmptyExtraRowFor: (baseRowId: number) => {
    set((state) => {
      const rows = Array.isArray(state.rows) ? [...state.rows] : [];
      const baseIdx = rows.findIndex((r) => r.id === baseRowId && !r.isExtra);
      if (baseIdx < 0) return state;

      if (rows.some((r) => r.isExtra && r.parentId === baseRowId)) return state;

      const base = rows[baseIdx];
      const extra: Executor = {
        id: Math.max(1, ...rows.map((r) => r.id)) + 1,
        author: base.author,
        role: base.role,
        isExtra: true,
        parentId: baseRowId,
        blocks: [],
      };

      /** вставляем сразу под базовой строкой */
      rows.splice(baseIdx + 1, 0, extra);
      return { rows };
    });
  },

  /**  чтобы существующий UI-колбэк addExtraRowBelow работал без правок */
  addExtraRowBelow: (baseRowId: number) => {
    get().addEmptyExtraRowFor?.(baseRowId);
  },

  /**
   * Проверка наличия доп. строки у исполнителя
   */
  hasExtraRow: (baseRowId: number) => {
    const rows = get().rows ?? [];
    return rows.some((r) => r.isExtra && r.parentId === baseRowId);
  },

  /**
   * Проверка — это строки одного и того же исполнителя
   */
  isSamePersonRow: (rowA: number, rowB: number) => {
    if (rowA === rowB) return true;
    const rows = get().rows ?? [];
    const a = rows.find((r) => r.id === rowA);
    const b = rows.find((r) => r.id === rowB);
    if (!a || !b) return false;
    const aRoot = a.isExtra ? (a.parentId ?? a.id) : a.id;
    const bRoot = b.isExtra ? (b.parentId ?? b.id) : b.id;
    return aRoot === bRoot;
  },

  /** удалить доп. строку владельца, если она пустая (возврат «+») */
  collapseEmptyExtraFor: (rowOrBaseId: number) => {
    set((state) => {
      const rows = Array.isArray(state.rows) ? [...state.rows] : [];
      const baseId = (() => {
        const base = rows.find((r) => r.id === rowOrBaseId);
        if (!base) return rowOrBaseId;
        return base.isExtra ? (base.parentId ?? rowOrBaseId) : rowOrBaseId;
      })();

      const extraIdx = rows.findIndex((r) => r.isExtra && r.parentId === baseId);
      if (extraIdx < 0) return state;

      const extra = rows[extraIdx];
      if ((extra.blocks?.length ?? 0) > 0) return state;

      rows.splice(extraIdx, 1);
      return { rows };
    });
  },

  /**  массово удаляем все пустые доп. строки (на случай dnd в ту же строку) */
  collapseAllEmptyExtras: () => {
    set((state) => {
      const rows = Array.isArray(state.rows) ? [...state.rows] : [];
      const filtered = rows.filter((r) => !(r.isExtra && (r.blocks?.length ?? 0) === 0));
      return { rows: filtered };
    });
  },
  /**
   * Обновить длительность блоков конкретной стадии внутри бандла
   * Используется при ручном изменении «Таймер (мин)» в карточке задачи.
   */
  updateTplStageDuration: ({ tplIdx, stageKey, minutes }) => {
    const safeMinutes = min1(Number(minutes) || 0);

    set((state) => {
      const rows = (state.rows ?? []).map((row) => ({ ...row, blocks: [...(row.blocks ?? [])] }));
      for (const row of rows) {
        const blocks = row.blocks ?? [];
        const blocksInTemplate = blocks.filter((block) => block.tplIdx === tplIdx);
        if (blocksInTemplate.length === 0) continue;
        /**
         * пересобираем СТРОГО по цепочке if_success,
         */
        const stageSet = new Set<string>();
        for (const block of blocksInTemplate) {
          for (const stageKeyCandidate of block.stageKeys ?? []) {
            stageSet.add(stageKeyCandidate);
          }
        }
        const anyStagesField = (blocksInTemplate[0]?.stagesField ?? {}) as Record<
          string,
          StageField
        >;

        /** находим стартовую стадию по графу if_success */
        const startKey = guessStartStageKey(stageSet, anyStagesField);

        /** строим цепочку от старта */
        const chain = startKey ? orderStagesByIfSuccess([startKey], anyStagesField) : [];

        /** сопоставляем ключам цепочки реальные блоки */
        const sortedBlocks: BlockExt[] = [];
        for (const chainKey of chain) {
          const block = blocksInTemplate.find(
            (blockCandidate) =>
              Array.isArray(blockCandidate.stageKeys) &&
              blockCandidate.stageKeys.includes(chainKey),
          );
          if (block) sortedBlocks.push(block);
        }

        if (sortedBlocks.length === 0) continue;

        /** старт бандла */
        const firstStart = Math.min(
          ...sortedBlocks.map((block) => parseTimeToMinutes(block.startTime)),
        );

        /** текущие длительности каждого блока бандла  */
        const durations = sortedBlocks.map((block) => {
          const start = parseTimeToMinutes(block.startTime);
          const end = parseTimeToMinutes(block.endTime);
          return Math.max(1, absEnd(start, end) - start);
        });

        /** подменяем длительность только у нужной стадии */
        const targetIndex = sortedBlocks.findIndex(
          (block) => Array.isArray(block.stageKeys) && block.stageKeys.includes(stageKey),
        );
        if (targetIndex >= 0) {
          durations[targetIndex] = safeMinutes;
        }

        /** пересобираем времена start/end */
        let cursor = firstStart;
        for (let stageIndex = 0; stageIndex < sortedBlocks.length; stageIndex++) {
          const block = sortedBlocks[stageIndex];
          const duration = Math.max(1, durations[stageIndex]);
          const newStart = cursor;
          const newEnd = cursor + duration;

          /** переписываем исходный объект в row.blocks */
          const idxInRow = blocks.findIndex((blockCandidate) => blockCandidate.id === block.id);
          if (idxInRow >= 0) {
            blocks[idxInRow] = {
              ...blocks[idxInRow],
              startTime: toTime(newStart % (24 * 60)),
              endTime: toTime(newEnd % (24 * 60)),
            };
          }
          cursor = newEnd;
        }
        /** чтобы не было перекрытий */
        repackRowLeft(row, 0);
      }

      return { rows };
    });
  },
}));

export default useTimelineStore;
export { toRowId } from '../utils/time';
export type { BlockExt, Executor } from '@entities/timeline/model/types/types';
