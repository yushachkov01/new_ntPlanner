import { create } from 'zustand';

import * as api from '@/entities/location/api/LocationApi';

import type {
  Provider,
  Branch,
  City,
  Node,
  RawProvider,
  RawBranch,
  RawCity,
  RawNode,
} from '../mapping/mapper';
import { toDomainProvider, toDomainBranch, toDomainCity, toDomainNode } from '../mapping/mapper';

/**
 * Zustand-хранилище для локаций
 * @property providers — список провайдеров
 * @property branches — список филиалов
 * @property cities — список городов
 * @property nodes — список площадок (узлов)
 * @property loading — флаг загрузки данных
 * @property error — информация об ошибке (если есть)
 * @property load —  загрузка данных
 */
interface LocationState {
  providers: Provider[];
  branches: Branch[];
  cities: City[];
  nodes: Node[];
  loading: boolean;
  error?: Error;
  load: () => Promise<void>;
}

export const useLocationStore = create<LocationState>((set) => ({
  providers: [],
  branches: [],
  cities: [],
  nodes: [],
  loading: false,
  error: undefined,

  /**
   * Загружает сразу все 4 таблицы:
   * providers, branches, cities, nodes
   * @property нет параметров
   */
  load: async () => {
    set({ loading: true, error: undefined });
    try {
      const [rawProv, rawBr, rawCt, rawNd] = await Promise.all([
        /** RawProvider[] */
        api.fetchProviders(),
        /** RawBranch[] */
        api.fetchBranches(),
        /** RawCity[] */
        api.fetchCities(),
        /** RawNode[] */
        api.fetchNodes(),
      ]);

      set({
        providers: (rawProv as RawProvider[]).map(toDomainProvider),
        branches: (rawBr as RawBranch[]).map(toDomainBranch),
        cities: (rawCt as RawCity[]).map(toDomainCity),
        nodes: (rawNd as RawNode[]).map(toDomainNode),
        loading: false,
      });
    } catch (e: any) {
      set({ error: e, loading: false });
      console.error('LocationStore.load error', e);
    }
  },
}));
