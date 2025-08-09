/**
 * Хранилище таймлайна (Zustand): строки-исполнители и их блоки.
 */
import { create } from 'zustand';

import type { StageField } from '@/entities/template/model/store/templateStore';
import { parseTimeToMinutes, toTime } from '@/shared/ui/time/toTime';

/**
 * Блок на таймлайне (один отрезок стадии)
 */
export interface BlockExt {
  /**  уникальный числовой идентификатор блока */
  id: number;
  /** Заголовок/подпись блока */
  label: string;
  /** Время начала в формате "HH:MM" */
  startTime: string;
  /** Время окончания в формате "HH:MM" (может «перетекать» на следующий день) */
  endTime: string;
  status?: string;
  subSteps?: string[];
  /** Индекс бандла; блоки с одинаковым tplIdx считаются одним «бандлом» */
  tplIdx: number;
  /** Список ключей стадий, к которым относится блок (обычно один ключ) */
  stageKeys: string[];
  /** Метаданные стадий по ключу */
  stagesField: Record<string, StageField>;
  /** Ключ-источник (строка таблицы), чтобы можно было удалить все блоки одной записи */
  sourceKey?: string;
}

export interface Executor {
  id: number;
  author: string;
  role: string;
  blocks?: BlockExt[];
}

/**
 * Делает стабильный number из string|number id (для стора).
 * Нужно, когда из внешнего мира приходят строковые/UUID id.
 * params
 *  - id: исходный идентификатор (string | number)
 */
const toRowId = (id: string | number): number => {
  /** Строковое представление входного id */
  const stringId = String(id);

  /** Аккумулируемый хэш для получения стабильного числовой rowId, с которым дальше работает таймлайн и DnD-логика.
   */
  let hashed = 5381;

  for (let i = 0; i < stringId.length; i++) {
    /** Код текущего символа */
    const code = stringId.charCodeAt(i);
    /** Обновление хэша: hash * 33 + code (с приводом к 32-бит) */
    hashed = (hashed << 5) + hashed + code;
    hashed |= 0;
  }

  /** Положительный (и ненулевой) идентификатор строки */
  const positiveId = Math.abs(hashed) || 1;

  return typeof id === 'number' && Number.isFinite(id) ? id : positiveId;
};

/**
 * Возвращает «абсолютный» конец интервала с учетом перехода через полночь.
 * Если конец <= начало, считаем, что конец на следующем дне.
 * params
 *  - startMin: начало (в минутах)
 *  - endRawMin: конец как есть (в минутах)
 */
const absEnd = (startMin: number, endRawMin: number) =>
  endRawMin <= startMin ? endRawMin + 1440 : endRawMin;

/**
 * Упаковать строку так, чтобы бандлы (tplIdx) шли ПОСЛЕДОВАТЕЛЬНО без перекрытий.
 * Меняет времена в блоках вперед (не двигает назад).
 * params
 *  - row: строка исполнителя, которую нужно упаковать
 *  - startRefMin: опорный старт, откуда можно начинать укладку
 */
const packRowSequential = (row: Executor, startRefMin = 0) => {
  /** копия массива блоков  */
  const blocks = row.blocks ?? [];
  if (blocks.length === 0) return;

  /** Группировка блоков по tplIdx (бандлы) */
  const bundlesByTpl = new Map<number, BlockExt[]>();
  for (const block of blocks) {
    if (!bundlesByTpl.has(block.tplIdx)) bundlesByTpl.set(block.tplIdx, []);
    bundlesByTpl.get(block.tplIdx)!.push(block);
  }

  /**
   * Сводки по бандлам: массив объектов { blocks, s, e },
   * где s/e — абсолютные границы бандла в минутах.
   */
  const bundleInfos = [...bundlesByTpl.values()].map((group) => {
    /** Минимальный старт среди блоков бандла */
    const bundleStart = Math.min(...group.map((b) => parseTimeToMinutes(b.startTime)));
    /** Максимальный конец среди блоков бандла (с учетом перехода через 00:00) */
    const bundleEnd = Math.max(
      ...group.map((b) => {
        const startMin = parseTimeToMinutes(b.startTime);
        const endMin = absEnd(startMin, parseTimeToMinutes(b.endTime));
        return endMin;
      }),
    );
    return { blocks: group, s: bundleStart, e: bundleEnd };
  });

  /** Сортировка бандлов по их текущему старту */
  bundleInfos.sort((a, b) => a.s - b.s);

  /** Курсор укладки — от опоры или от первого бандла, что больше */
  let cursorMin = Math.max(startRefMin, bundleInfos.length ? bundleInfos[0].s : startRefMin);

  /** Флаг, были ли изменения (важно для триггера обновления Zustand) */
  let moved = false;

  for (const info of bundleInfos) {
    /** Целевой старт бандла — не раньше курсора и не раньше его текущего старта */
    const targetStart = Math.max(cursorMin, info.s);

    if (targetStart > info.s) {
      /** Сдвиг (в минутах), на который нужно передвинуть весь бандл */
      const shiftMin = targetStart - info.s;

      /** Сдвигаем каждый блок бандла вперед */
      for (const blk of info.blocks) {
        /** Текущий старт блока в минутах */
        const blkStartMin = parseTimeToMinutes(blk.startTime);
        /** Текущий абсолютный конец блока в минутах */
        const blkEndMin = absEnd(blkStartMin, parseTimeToMinutes(blk.endTime));

        /** Новый старт блока (после сдвига) */
        const newStartMin = blkStartMin + shiftMin;
        /** Новый конец блока (после сдвига) */
        const newEndMin = blkEndMin + shiftMin;
        blk.startTime = toTime(newStartMin);
        blk.endTime = toTime(newEndMin);
      }

      /** Обновляем сводные границы бандла после сдвига */
      info.s += shiftMin;
      info.e += shiftMin;
      moved = true;
    }

    /** Следующий бандл должен начинаться после текущего */
    cursorMin = info.e;
  }

  if (moved) {
    /**
     * Создаем новый массив блоков для корректного shallow-сравнения в Zustand,
     * чтобы подписчики получили обновление.
     */
    row.blocks = [...blocks];
  }
};

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
  sourceKey?: string;
};

/**
 * Параметры удаления блоков по sourceKey
 * params
 *  - execIds: список исполнителей (если не указан — у всех)
 *  - sourceKey: ключ-источник (привязка к записи таблицы)
 */
type RemoveParams = { execIds?: Array<string | number>; sourceKey: string };

/**
 * Параметры очистки блоков у исполнителей
 * params
 *  - execIds: список исполнителей (если не указан — у всех)
 */
type ResetParams = { execIds?: Array<string | number> };

/**
 * Срез Zustand для таймлайна
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
  addFromYaml: (p: AddFromYamlParams) => void;

  /**
   * Удалить все блоки, созданные одной записью (по sourceKey),
   * только у указанных исполнителей (или у всех)
   */
  removeBySource: (p: RemoveParams) => void;

  /**
   * Очистить блоки у указанных исполнителей (или у всех).
   * Используем при смене шаблона.
   */
  resetExecutors: (p?: ResetParams) => void;
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
  setRows: (rows) => {
    /** Нормализованный массив строк (или пустой, если прилетело не-массив) */
    const normalized = Array.isArray(rows) ? rows : [];
    set({ rows: normalized });
  },

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
      /** Текущее состояние строк (массив) */
      const baseRows = Array.isArray(state.rows) ? state.rows : [];

      /** Глубокая поверхностная копия строк и их блоков */
      const nextRows = baseRows.map((row) => ({ ...row, blocks: [...(row.blocks ?? [])] }));

      /**
       * Целевые исполнители: либо те, что передали, либо все строки.
       * Преобразуем идентификаторы в стабильные числовые rowId.
       */
      const targetRowIds = (execIds?.length ? execIds : nextRows.map((r) => r.id)).map(toRowId);

      /** Глобальный счетчик id для новых блоков */
      const nextBlockId =
        Math.max(0, ...nextRows.flatMap((r) => r.blocks ?? []).map((b) => b.id)) + 1;

      /** Текущий изменяемый счетчик id, чтобы присваивать уникальные значения */
      let runningBlockId = nextBlockId;

      /**
       * Глобальный «самый правый» конец среди ВСЕХ блоков (в абсолютных минутах),
       * чтобы новый бандл шел строго после уже размещенных.
       */
      const globalLastEnd = Math.max(
        windowStartMin,
        ...nextRows
          .flatMap((r) => r.blocks ?? [])
          .map((b) => {
            /** Старт блока в минутах */
            const blockStartMin = parseTimeToMinutes(b.startTime);
            /** Абсолютный конец блока в минутах (учет перехода через ночь) */
            const blockEndMin = parseTimeToMinutes(b.endTime);
            /** Нормализованный конец */
            return blockEndMin <= blockStartMin ? blockEndMin + 1440 : blockEndMin;
          }),
      );

      /**
       * Сквозной курсор укладки (минуты), который «перетекает»
       * от одного исполнителя к следующему, обеспечивая последовательность.
       */
      let globalCursorMin = globalLastEnd;

      /** Раскладываем бандл по каждому целевому исполнителю */
      for (const rowId of targetRowIds) {
        /** Строка-исполнитель, куда будем добавлять блоки */
        const row = nextRows.find((r) => r.id === rowId);
        if (!row) continue;
        row.blocks ??= [];

        /**
         * Новый tplIdx для этой строки — чтобы свежедобавленный бандл
         * не «склеивался» с уже существующими при переносах.
         */
        const nextTplIdx = row.blocks.length ? Math.max(...row.blocks.map((b) => b.tplIdx)) + 1 : 0;

        /** курсор для укладки стадий внутри одного исполнителя */
        let localCursorMin = globalCursorMin;

        /** Последовательно добавляем стадии бандла */
        for (const stageKey of stageKeys) {
          /** Метаданные стадии (таймеры и т.п.) */
          const stageMeta = (stagesField as any)[stageKey] || {};

          /** Длительность стадии (в минутах) */
          const stageDurationMin = Math.max(
            1,
            Number(stageMeta.timer_default ?? stageMeta.timer ?? 0) || 0,
          );

          /** Абсолютный старт новой стадии (минуты) */
          const stageStartAbsMin = localCursorMin;
          /** Абсолютный конец новой стадии (минуты) */
          const stageEndAbsMin = stageStartAbsMin + stageDurationMin;

          /** Создаем блок стадии */
          row.blocks.push({
            id: runningBlockId++,
            label,
            startTime: toTime(stageStartAbsMin),
            endTime: toTime(stageEndAbsMin),
            tplIdx: nextTplIdx,
            stageKeys: [stageKey],
            stagesField: { [stageKey]: stageMeta },
            sourceKey,
          });

          /** Сдвиг курсора для следующей стадии */
          localCursorMin = stageEndAbsMin;
        }

        /** Следующий исполнитель начнет укладку после конца текущего бандла */
        globalCursorMin = localCursorMin;
        packRowSequential(row, windowStartMin);
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
    set((state) => {
      /** Набор целевых rowId (если задан execIds), иначе null => для всех */
      const idSet = execIds?.length ? new Set(execIds.map(toRowId)) : null;

      /** Текущее состояние строк */
      const baseRows = Array.isArray(state.rows) ? state.rows : [];

      /** Новый массив строк с отфильтрованными блоками */
      const filteredRows = baseRows.map((row) => ({
        ...row,
        blocks:
          idSet && !idSet.has(row.id)
            ? row.blocks
            : (row.blocks ?? []).filter((b) => b.sourceKey !== sourceKey),
      }));

      return { rows: filteredRows };
    });
  },

  /**
   * Полностью очищает блоки у указанных исполнителей (или у всех).
   * params
   *  - execIds?: список исполнителей
   */
  resetExecutors: ({ execIds }: ResetParams = {}) => {
    set((state) => {
      /** Набор целевых rowId (если задан execIds), иначе null => для всех */
      const idSet = execIds?.length ? new Set(execIds.map(toRowId)) : null;

      /** Текущее состояние строк */
      const baseRows = Array.isArray(state.rows) ? state.rows : [];

      /** Новый массив строк с очищенными блоками (по условию) */
      const clearedRows = baseRows.map((row) => ({
        ...row,
        blocks: idSet && !idSet.has(row.id) ? row.blocks : [],
      }));

      return { rows: clearedRows };
    });
  },
}));

export default useTimelineStore;
export { toRowId };
