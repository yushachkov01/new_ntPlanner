/**
 *  статусы задачи
 */
export type Status =
  | 'done'
  | 'done_on_time'
  | 'overtime'
  | 'pending_manual'
  | 'pending_auto'
  | 'info'
  | 'window';

/**
 * Подшаг в составе блока с идентификатором и меткой
 */
export interface SubStep {
  id: number;
  label: string;
  readonly;
}

/**
 *
 * Данные для временного блока
 */
export interface BlockData {
  id: number;
  startTime: string;
  endTime: string;
  label: string;
  status?: Status;
  subSteps?: SubStep[];
}

/**
 * Данные пользователя с задачами/блоками
 */
export interface UserData {
  id: number;
  name: string;
  blocks: BlockData[];
}

/**
 * Свойства для компонента деталей задачи
 */
export interface TaskDetailProps {
  id: number;
  label: string;
  startTime: string;
  endTime: string;
  performer: string;
  status?: Status;
  subSteps?: SubStep[];
  onClose: () => void;
  onMarkDone?: (id: number, file: UploadedFile | null, description: string) => void;
}

/**
 * Загруженный файл с именем, типом и URL
 */
export type UploadedFile = {
  name: string;
  type: string;
  url: string;
};

/**
 * Свойства для блока на временной шкале
 */
export interface TimelineBlockProps {
  block: BlockData;
  totalWindowMin: number;
  expandedBlockId: number | null;
  setExpandedBlockId: (id: number | null) => void;
  onDoubleClickBlock: (id: number) => void;
  isCovered: boolean;
}
