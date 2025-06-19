/**
 * Zustand-store для “Works”
 * ─ хранит доменные объекты <Work>
 * ─ общается с бэком через сгенер-DTO
 * ─ собирает/раскладывает данные через мапперы (dtoToDomain / domain→DTO)
 */

import { create } from 'zustand';

import { domainPatchToDto, domainToInsert, dtoToDomain } from '@entities/work/lib/work.mappers.ts';

import type {
  Works,
  Works_Insert_Input as InsertDTO,
  Works_Set_Input as PatchDTO,
} from '../../api/fetchWorks.generated';
import * as api from '../../api/WorkApi';
/**
 * типы, которые сгенерировал codegen
 */
import type { Work } from '../work.types';

type Store = {
  works: Work[];

  /**
   * Загрузить все записи
   */
  load: () => Promise<void>;

  /**
   * Создать новую запись
   */
  insert(domain: Omit<Work, 'id'>): Promise<void>;

  /**
   *  Отправить обновление на сервер
   */
  patch(idInt: number, changes: Partial<Omit<Work, 'id'>>): Promise<void>;

  /**
   * Вставить/заменить запись
   */
  add(dto: Works): void;

  /**
   *   Обновить запись
   */
  update(dto: Works): void;

  /**
   *  Удалить запись на сервере
   */
  remove(idInt: number): Promise<void>;
};

export const useWorkStore = create<Store>((set, get) => ({
  works: [],

  async load() {
    const rows = await api.fetchWorks();
    set({ works: rows.map(dtoToDomain) }); // dto -> domain
  },
  /**
   * CREATE
   * @param domain
   */
  async insert(domain) {
    const dto: InsertDTO = domainToInsert(domain);
    const idInt = await api.insertWork(dto);
    get().add({ ...dto, idInt, __typename: 'works' });
  },
  /**
   * UPDATE
   * @param idInt
   * @param changes
   */
  async patch(idInt, changes) {
    /**
     * Domain ➜ DTO
     */
    const patchDto: PatchDTO = domainPatchToDto(changes);
    const updatedRow = await api.updateWork(idInt, patchDto);
    get().update(updatedRow);
  },
  /**
   * WS-события
   * @param dto
   */
  add(dto) {
    const work = dtoToDomain(dto);
    set((s) => ({
      works: [work, ...s.works.filter((w) => w.id !== work.id)],
    }));
  },
  /**
   * Update
   * @param dto
   */

  update(dto) {
    const work = dtoToDomain(dto);
    set((s) => ({
      works: s.works.map((w) => (w.id === work.id ? work : w)),
    }));
  },
  /**
   * DELETE
   * @param idInt
   */
  async remove(idInt) {
    await api.deleteWork({ idInt: { _eq: idInt } });
    await get().load();
  },
}));
