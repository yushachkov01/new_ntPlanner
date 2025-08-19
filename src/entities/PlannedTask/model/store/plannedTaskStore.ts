import { create } from 'zustand';

import * as api from '../../api/PlannedTaskApi';
import type {
  RawTask,
  RawTimeWork,
  RawProject,
  RawRmTask,
  RawDevice,
  PlannedTask,
  TimeWork,
  Project,
  RmTask,
  Device,
} from '../mapping/mapper';
import {
  toDomainTask,
  toDomainTimeWork,
  toDomainProject,
  toDomainRmTask,
  toDomainDevice,
} from '../mapping/mapper';

interface State {
  /**
   * Список загруженных планируемых задач
   */
  tasks: PlannedTask[];
  /**
   * Список загруженных временных интервальных настроек
   */
  timeWorks: TimeWork[];
  /**
   * Список загруженных проектов
   */
  projects: Project[];
  /**
   * Список загруженных задач Redmine
   */
  rmTasks: RmTask[];
  /**
   * Список загруженных задач устройств
   */
  device: Device[];
  /**
   * Флаг состояния загрузки
   */
  loading: boolean;
  /**
   * Объект ошибки при неудачном запросе
   */
  error?: Error;
  /**
   * Загружает все ресурсы: задачи, интервалы, проекты и задачи RM
   * @returns Promise<void>
   */
  load: () => Promise<void>;

  deviceWhitelist: string[];
  setDeviceWhitelist: (hosts: string[]) => void;

  upsertDevice?: (patch: { id: string; hostname?: string }) => void;
  removeDevice?: (id: string) => void;
}

export const usePlannedTaskStore = create<State>((set, get) => ({
  tasks: [],
  timeWorks: [],
  projects: [],
  rmTasks: [],
  device: [],
  loading: false,
  error: undefined,

  /**
   * Асинхронно запрашивает
   * Затем преобразует результаты в доменные модели и сохраняет в стор.
   */
  load: async () => {
    set({ loading: true, error: undefined });
    try {
      const [rawTasks, rawTimes, rawProjects, rawRmTasks, RawDevice] = await Promise.all([
        api.fetchPlannedTasks() as Promise<RawTask[]>,
        api.fetchTimeWorks() as Promise<RawTimeWork[]>,
        api.fetchRmProjects() as Promise<RawProject[]>,
        api.fetchRmTasks() as Promise<RawRmTask[]>,
        api.fetchDevices() as Promise<RawDevice[]>,
      ]);
      /**
       * Преобразуем "сырые" устройства к доменной модели.
       * Params
       * - RawDevice: исходный массив устройств
       * - toDomainDevice: маппер сырого устройства в доменную модель
       * @returns devices: Device[] — список доменных устройств
       */
      const device = RawDevice.map(toDomainDevice);

      set({
        tasks: rawTasks.map(toDomainTask),
        timeWorks: rawTimes.map(toDomainTimeWork),
        projects: rawProjects.map(toDomainProject),
        rmTasks: rawRmTasks.map(toDomainRmTask),
        device,
        loading: false,
      });
      /**
       * Если белый список устройств ещё не задан — инициализируем его всеми hostname из устройств.
       * Params
       * - currentWhitelist: string[]  — текущее значение списка
       * - allHostnames: string[] — уникальные hostname из массива devices
       */
      const curWL = get().deviceWhitelist;
      if (!curWL || curWL.length === 0) {
        const allHosts = Array.from(new Set(device.map((d) => d.hostname).filter(Boolean)));
        set({ deviceWhitelist: allHosts });
      }
    } catch (e: any) {
      console.error('PlannedTaskStore.load error', e);
      set({ error: e, loading: false });
    }
  },
  /**
   * Установить белый список устройств (hostname).
   * Удаляет пустые значения и дубликаты.
   * Params
   * - hostnames: string[] — список имён хостов
   */
  deviceWhitelist: [],
  setDeviceWhitelist: (hosts) => {
    const uniq = Array.from(new Set(hosts.filter(Boolean)));
    set({ deviceWhitelist: uniq });
  },
  /**
   * Добавить новое устройство или обновить существующее по id.
   * Если device с таким id нет — добавится; если есть — обновится hostname (если передан).
   * Params
   * - payload: { id: string; hostname?: string }
   */
  upsertDevice: ({ id, hostname }) => {
    if (!id) return;
    const state = get();
    const ix = state.device.findIndex((d) => d.id === id);
    if (ix === -1) {
      /** Устройства с таким id нет — добавляем новое */
      set({ device: [...state.device, { id, hostname: hostname ?? '' } as Device] });
    } else {
      const next = state.device.slice();
      next[ix] = { ...next[ix], ...(hostname !== undefined ? { hostname } : {}) };
      set({ device: next });
    }
  },
  /**
   * Удалить устройство по id.
   * Params
   * - id: string — идентификатор устройства
   */
  removeDevice: (id: string) => {
    const state = get();
    set({ device: state.device.filter((d) => d.id !== id) });
  },
}));
