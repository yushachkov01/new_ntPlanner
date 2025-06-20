import type { Work } from '@entities/work';

/**
 * RowWithStep — расширенная модель для таблицы работ
 *  - Наследует поля доменной модели Work
 */
export interface RowWithStep extends Work {
  plan: number;
  ppr: number;
  request: number;
  work: number;
  step: number;
}

/**
 * PropsWorkTable — интерфейс пропсов для компонента WorkTable
 * @property data - массив строк типа RowWithStep для отображения
 * @property isArchive - флаг, включающий режим архива ( влияет на колонки и стили )
 * @property visibleColumns - список ключей колонок, которые должны быть видимы
 */
export interface PropsWorkTable {
  data: RowWithStep[];
  isArchive?: boolean;
  visibleColumns?: string[];
}
