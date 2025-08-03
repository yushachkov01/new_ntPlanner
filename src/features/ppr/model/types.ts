import type { StageField } from '@entities/template/model/store/templateStore.ts';
import type { User } from '@entities/users/model/mapping/mapping';

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
 * Подшаг в составе блока с идентификатором, меткой и флагом только для чтения
 */
export interface SubStep {
  /** Уникальный идентификатор подшага */
  id: number;
  /** Текстовая метка подшага */
  label: string;
  /** Флаг, указывающий, что подшаг только для чтения */
  isReadOnly: boolean;
}

/**
 * Данные для одного блока на временной шкале
 */
export interface BlockData {
  /** Уникальный идентификатор блока */
  id: number;
  /** Время начала в формате "HH:MM" */
  startTime: string;
  /** Время окончания в формате "HH:MM" */
  endTime: string;
  /** Название или метка блока */
  label: string;
  /** Статус выполнения блока */
  status?: Status;
  /** Список подшагов */
  subSteps?: SubStep[];
  /** Ключи этапов, к которым относится блок */
  stageKeys?: string[];
  /** Поля этапов по ключам */
  stagesField?: Record<string, StageField>;
}

/**
 * Данные одного пользователя и его блоков задач
 */
export interface UserData {
  /** Уникальный идентификатор пользователя */
  id: number;
  /** Имя пользователя */
  name: string;
  /** Список блоков задач пользователя */
  blocks: BlockData[];
}

/**
 * Свойства для компонента детализации задачи
 */
export interface TaskDetailProps {
  /** Уникальный идентификатор задачи */
  id: number;
  /** Метка или название задачи */
  label: string;
  /** Время начала задачи */
  startTime: string;
  /** Время окончания задачи */
  endTime: string;
  performer: string;
  /** Статус задачи */
  status?: Status;
  subSteps?: SubStep[];
  /** Колбэк закрытия детализации */
  onClose: () => void;
  /** Список доступных исполнителей */
  executors?: User[];
  /** Функция добавления исполнителя */
  addExecutor?: (executor: User) => void;
  /** Функция удаления исполнителя по ID */
  removeExecutor?: (executorId: number) => void;
  /** Метаданные этапа */
  stage?: StageMeta;
  /** Загрузенные конфигурации */
  configs?: UploadedConfig[];
  /** Колбэк при изменении конфигураций */
  onConfigChange?: (configs: UploadedConfig[]) => void;
  /** Колбэк при изменении таймера этапа */
  onTimerChange?: (newTimer: number) => void;
  /** Колбэк при пометке задачи как выполненной */
  onMarkDone?: (id: number, file: UploadedFile | null, description: string) => void;
}

/**
 * Загруженный файл с именем, типом и URL
 */
export type UploadedFile = {
  /** Оригинальное имя файла */
  name: string;
  type: string;
  /** URL для доступа к файлу */
  url: string;
};

/**
 * Свойства для компонента блока на временной шкале
 */
export interface TimelineBlockProps {
  /** Данные блока */
  block: BlockData;
  /** Общая длительность окна в минутах */
  totalWindowMin: number;
  /** ID раскрытого блока */
  expandedBlockId: number | null;
  /** Колбэк для установки раскрытого блока */
  setExpandedBlockId: (id: number | null) => void;
  /** Колбэк на двойной клик блока */
  onDoubleClickBlock: (id: number) => void;
  /** Флаг, что блок перекрыт другим */
  isCovered: boolean;
}

/**
 * Метаданные одного этапа в шаблоне
 */
export interface StageMeta {
  /** Описание этапа */
  description: string;
  /** Роль инженера этапа */
  engineer: string;
  /** Таймер по умолчанию */
  timer_default: number;
  /** Ключ следующего этапа при успехе */
  if_success?: string;
  /** Ключ следующего этапа при неудаче */
  if_failure?: string;
  /** Флаг ручного запуска команд */
  commands_hand: boolean;
  /** Поля этапа */
  fields: Record<
    string,
    {
      key: string;
      name: string;
      widget: string;
      type: string;
      options?: string[];
      defaultValue?: string | number | boolean;
    }
  >;
}

/**
 * Загруженная конфигурация (MinIO)
 */
export interface UploadedConfig {
  /** Ключ объекта в MinIO */
  key: string;
  /** Оригинальное имя файла */
  filename: string;
  /** URL для скачивания */
  url: string;
}
