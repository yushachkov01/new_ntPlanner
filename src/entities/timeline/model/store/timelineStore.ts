/**
 * Хранилище таймлайна (Zustand): строки-исполнители и их блоки.
 */
import { create } from 'zustand';

import type { StageField } from '@/entities/template/model/store/templateStore';
import { parseTimeToMinutes, toTime } from '@/shared/ui/time/toTime';
import type { BlockExt, Executor } from '@entities/timeline/model/types/types';
import { min1, orderStagesByIfSuccess } from '@entities/timeline/model/utils/timelineBaseUtils';

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

  stageFieldEdits: Record<number, Record<string, Record<string, any>>>;
  setStageFieldValue: (params: {
    tplIdx?: number;
    stageKey: string;
    fieldKey: string;
    value: any;
  }) => void;
  /**  правка таймера этапа (используется для rollback, которых нет на таймлайне) */
  setStageTime?: (params: { tplIdx?: number; stageKey: string; minutes: number }) => void;

  clearStageFieldValuesFor: (tplIdx: number) => void;
  getMergedStageOverrides: (
    tplIdx: number,
  ) => Record<string, { time?: number; fields?: Record<string, any> }>;

  /** собрать id исполнителей, реально присутствующих в блоках данного шаблона */
  getTplExecutorIds?: (tplIdx: number) => string[];
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

      const execIdsRaw: string[] | undefined = execIds?.map((value) => String(value));
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
            execIds: execIdsRaw,
          } as any);

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
      if (!execIds?.length) {
        if (state.rows.length === 0) return state;
        return { rows: [] as Executor[] };
      }
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
    const firstRow = rows.find((row) => row.id === rowA);
    const secondRow = rows.find((row) => row.id === rowB);

    if (!firstRow || !secondRow) return false;

    const firstBaseRowId = firstRow.isExtra ? (firstRow.parentId ?? firstRow.id) : firstRow.id;
    const secondBaseRowId = secondRow.isExtra ? (secondRow.parentId ?? secondRow.id) : secondRow.id;

    return firstBaseRowId === secondBaseRowId;
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

    get().setStageTime?.({ tplIdx, stageKey, minutes: safeMinutes });
    set((state) => {
      const rows = (state.rows ?? []).map((row) => ({ ...row, blocks: [...(row.blocks ?? [])] }));
      for (const row of rows) {
        const blocks = row.blocks ?? [];
        const blocksInTemplate = blocks.filter((block) => block.tplIdx === tplIdx);
        if (blocksInTemplate.length === 0) continue;

        const sortedBlocks: BlockExt[] = [...blocksInTemplate].sort(
          (a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime),
        );

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
          const newStart = cursor;
          const newEnd = cursor + Math.max(1, durations[stageIndex]);
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
  stageFieldEdits: {},

  /**
   * Сохранить значение произвольного поля этапа (fields).
   */
  setStageFieldValue: ({ tplIdx = 0, stageKey, fieldKey, value }) => {
    set((state) => {
      const stageEditsMap = { ...(state.stageFieldEdits ?? {}) };
      const editsByTemplate = { ...(stageEditsMap[tplIdx] ?? {}) };
      const editsByStage = { ...(editsByTemplate[stageKey] ?? {}) };
      const nextStageEdits = { ...editsByStage, [fieldKey]: value };
      stageEditsMap[tplIdx] = { ...editsByTemplate, [stageKey]: nextStageEdits };
      return { stageFieldEdits: stageEditsMap };
    });
  },

  /**
   * Установить явное время этапа (override) для последующего сохранения в YAML.
   */
  setStageTime: ({ tplIdx = 0, stageKey, minutes }) => {
    set((state) => {
      const stageEditsMap = { ...(state.stageFieldEdits ?? {}) };
      const editsByTemplate = { ...(stageEditsMap[tplIdx] ?? {}) };
      const editsByStage = { ...(editsByTemplate[stageKey] ?? {}) };
      const nextStageEdits = { ...editsByStage, __time: min1(minutes) };
      stageEditsMap[tplIdx] = { ...editsByTemplate, [stageKey]: nextStageEdits };
      return { stageFieldEdits: stageEditsMap };
    });
  },
  /**
   * Очистить все правки (поля/время) для конкретного шаблона.
   */
  clearStageFieldValuesFor: (tplIdx: number) => {
    set((state) => {
      const stageEditsMap = { ...(state.stageFieldEdits ?? {}) };
      if (!(tplIdx in stageEditsMap)) return state;
      delete stageEditsMap[tplIdx];
      return { stageFieldEdits: stageEditsMap };
    });
  },

  /**
   * Собираем overrides для YAML.
   */
  getMergedStageOverrides: (tplIdx: number) => {
    const rows = get().rows ?? [];
    const blocksInTemplate: BlockExt[] = [];

    for (const row of rows) {
      const blocksForTemplate = (row.blocks ?? []).filter((block) => block.tplIdx === tplIdx);
      if (blocksForTemplate.length) blocksInTemplate.push(...blocksForTemplate);
    }

    const overrides: Record<string, { time?: number; fields?: Record<string, any> }> = {};

    // время из таймлайна (success)
    if (blocksInTemplate.length > 0) {
      for (const block of blocksInTemplate) {
        const startMinutes = parseTimeToMinutes(block.startTime);
        const endMinutes = parseTimeToMinutes(block.endTime);
        const durationMinutes = Math.max(1, absEnd(startMinutes, endMinutes) - startMinutes);

        for (const sk of block.stageKeys ?? []) {
          const prev = overrides[sk] ?? {};
          if (prev.time == null) overrides[sk] = { ...prev, time: durationMinutes };
          else overrides[sk] = { ...prev };
        }
      }
    }

    const stageEditsMap = get().stageFieldEdits ?? {};
    const editsByTemplate = stageEditsMap[tplIdx] ?? {};
    for (const [sk, rawFields] of Object.entries(editsByTemplate)) {
      const stageFields = rawFields as any;
      const explicitTime = Number.isFinite(stageFields?.__time)
        ? Number(stageFields.__time)
        : Number.isFinite(stageFields?.time)
          ? Number(stageFields.time)
          : undefined;

      const prev = overrides[sk] ?? {};
      const nextFields = { ...(prev.fields ?? {}) };

      // выносим time из полей, чтобы они попали в корневой overrides[sk].time
      const { __time, time, ...rest } = stageFields ?? {};
      if (explicitTime && explicitTime > 0) {
        overrides[sk] = { ...prev, time: min1(explicitTime), fields: { ...nextFields, ...rest } };
      } else {
        overrides[sk] = { ...prev, fields: { ...nextFields, ...rest } };
      }
    }

    return overrides;
  },

  /** собрать id исполнителей, реально присутствующих в блоках данного шаблона */
  getTplExecutorIds: (tplIdx: number) => {
    const rows = get().rows ?? [];
    const ids = new Set<string>();
    for (const row of rows) {
      for (const block of row.blocks ?? []) {
        if (block.tplIdx === tplIdx && Array.isArray(block.execIds)) {
          for (const id of block.execIds) ids.add(String(id));
        }
      }
    }
    return [...ids];
  },
}));

export default useTimelineStore;
export { toRowId } from '../utils/time';
export type { BlockExt, Executor } from '@entities/timeline/model/types/types';
