/**
 * Стор для управления временными интервалами шкалы и подсветок внутри неё
 */
import { create } from 'zustand';

export interface WindowInterval {
  start: string;
  end: string;
}

interface WorkTimeState {
  /** Границы всей шкалы (работа) */
  timelineWindow: WindowInterval;
  /** Массив подсвечиваемых внутри (работа) */
  highlightWindows: (WindowInterval | null)[];
  /**
   * Установить границы всей шкалы
   * @param wi — новый интервал (start–end)
   */
  setTimelineWindow: (wi: WindowInterval) => void;
  /**
   * Заменить все подсветки
   * @param highlightedWindows — массив интервалов или null
   */
  replaceHighlightWindows: (highlightedWindows: (WindowInterval | null)[]) => void;
  updateHighlightWindow: (idx: number, wi: WindowInterval | null) => void;
  /** Добавить пустой слот под новую подсветку */
  appendHighlightWindow: () => void;
}

export const WorkTimeStore = create<WorkTimeState>((set) => ({
  timelineWindow: { start: '00:00', end: '23:00' },
  highlightWindows: [null],

  setTimelineWindow: (wi) => set({ timelineWindow: wi }),

  replaceHighlightWindows: (highlightedWindows) => set({ highlightWindows: highlightedWindows }),

  updateHighlightWindow: (idx, wi) =>
    set((state) => {
      const arr = [...state.highlightWindows];
      arr[idx] = wi;
      return { highlightWindows: arr };
    }),

  appendHighlightWindow: () =>
    set((state) => ({ highlightWindows: [...state.highlightWindows, null] })),
}));
