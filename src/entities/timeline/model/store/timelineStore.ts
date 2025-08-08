import { create } from 'zustand';

/** Блок на таймлайне */
export interface BlockExt {
  id: number;
  label: string;
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  status?: string;
  subSteps?: string[];
  tplIdx: number;
  stageKeys: string[];
  stagesField: Record<string, any>;
}

export interface Executor {
  id: number;
  author: string;
  role: string;
  blocks?: BlockExt[];
}

interface TimelineState {
  /** Текущее состояние строк таймлайна (исполнители + их блоки) */
  rows: Executor[];

  /**
   * Полная замена массива строк..
   */
  setRows: (rows: Executor[]) => void;

  /**
   * Функциональное обновление массива строк.
   */
  updateRows: (updater: (prev: Executor[]) => Executor[]) => void;

  /** Установить блоки конкретного исполнителя (полная замена его blocks) */
  setExecutorBlocks: (executorId: number, blocks: BlockExt[]) => void;

  /** Добавить блоки к конкретному исполнителю (дополнить его blocks) */
  appendBlocks: (executorId: number, newBlocks: BlockExt[]) => void;
}

export const useTimelineStore = create<TimelineState>()((set, get) => ({
  rows: [],
  /**
   * Полностью заменить массив строк.
   * @param rows Новый массив строк.
   */
  setRows: (rows) => set({ rows }),

  updateRows: (updater) => set((state) => ({ rows: updater(state.rows) })),

  setExecutorBlocks: (executorId, blocks) =>
    set((state) => ({
      rows: state.rows.map((r) => (r.id === executorId ? { ...r, blocks: [...blocks] } : r)),
    })),

  appendBlocks: (executorId, newBlocks) =>
    set((state) => ({
      rows: state.rows.map((r) =>
        r.id === executorId ? { ...r, blocks: [...(r.blocks ?? []), ...newBlocks] } : r,
      ),
    })),
}));

export default useTimelineStore;
