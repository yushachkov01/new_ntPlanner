import type { RoleKey } from '@/shared/utils/normalizeRoleKey';

/** Бакет для YAML в MinIO */
export const YAML_BUCKET = 'yamls' as const;

/** Значения по умолчанию для planned_tasks */
export const PLANNED_TASKS_KIND = 'planned_tasks' as const;
export const DEFAULT_TASK_NAME = 'Без названия' as const;
export const PLANNED_TASK_STATUS = {
  ON_REVIEW: 'on_review' as const,
} as const;

/** Заголовки ролей для бейджа исполнителя */
export const ROLE_TITLES_RU: Record<RoleKey, string> = {
  engineer: 'Сетевой инженер',
  installer: 'Инженер СМР',
  auditor: 'Представитель Заказчика',
  system: 'Система',
};

/** Цвета бейджа роли исполнителя (справа в заголовке панели) */
export const ROLE_COLORS: Record<RoleKey, string> = {
  engineer: '#1e90ff',
  installer: '#f97316',
  auditor: '#ef4444',
  system: '#9ca3af',
};

/** Цвет бейджа роли по умолчанию */
export const ROLE_SWATCH_DEFAULT_COLOR = '#9ca3af';

/** Текстовые константы и подписи StagePanel */
export const STAGE_PANEL_TEXT = {
  common: {
    requiredField: 'Обязательное поле',
    emDash: '—',
  },
  form: {
    timerLabel: 'Таймер (мин)',
    selectPlaceholder: 'Выберите…',
  },
  logs: {
    title: 'Конфигурации',
    formatsHintPrefix: 'допустимо: ',
  },
  files: {
    deleteBtn: 'Удалить',
    previewBtn: 'Посмотреть',
    emptyText: 'Нет данных',
    uploadedPrefix: 'Загружено ',
    byParen: (who: string) => ` (${who})`,
    fallbackFilePrefix: 'Файл ',
    uploadError: 'Не удалось загрузить файл',
    /** добавлено для ConfigUploader: подсказка, когда превью ещё недоступно */
    availableAfterUpload: 'Доступно сразу после загрузки',
  },
  errors: {
    noBucket:
      'Bucket не найден в MinIO. Убедитесь, что существует bucket ppr-files и у него есть политика на запись.',
  },
  booleanOptions: [
    { value: 'true', label: 'true' },
    { value: 'false', label: 'false' },
  ] as const,
} as const;

/** UI-константы StagePanel  */
export const STAGE_PANEL_UI = {
  /** InputNumber во всю ширину */
  INPUT_NUMBER_STYLE: { width: '100%' } as const,
  /** Автовысота для textarea */
  TEXTAREA_AUTOSIZE: { minRows: 4, maxRows: 12 } as const,
  /** Ширина колонки с действиями в таблице файлов */
  TABLE_ACTIONS_WIDTH: 220,
} as const;

/** Ключи/имена, используемые в StagePanel */
export const STAGE_PANEL_KEYS = {
  /** Имя/ключ элемента формы таймера */
  TIMER_ITEM_NAME: 'timer',
  /** dataIndex для колонки с действиями */
  ACTIONS_DATA_INDEX: '__actions__',
} as const;

/** Единые настройки таблиц в StagePanel */
export const STAGE_PANEL_TABLE = {
  SIZE: 'small' as const,
  PAGINATION: false as const,
  BORDERED: true as const,
  ACTIONS_ALIGN: 'right' as const,
} as const;

/**
 *   Константы ConfigUploader
 */
export const CONFIG_UPLOADER_TEXT = {
  dragText: 'Перетащите файлы сюда',
  dragHint: 'или нажмите для выбора',
  addedMessage: 'Конфигурация добавлена',
  /** Префикс/суффикс для сообщения об ошибке неподдерживаемого формата */
  unsupportedPrefix: 'Формат "',
  unsupportedSuffix: '" не поддерживается. Допустимо: ',
} as const;

export const CONFIG_UPLOADER_DEFAULTS = {
  /** Дефолтный whitelist расширений (без точки) */
  allowedExtensions: ['cfg', 'conf', 'txt'] as const,
  /** Дефолтное значение accept */
  accept: '.cfg,.conf,.txt',
} as const;

/** Значения по умолчанию для клиентского хранилища конфигов */
export const CONFIG_STORAGE_DEFAULTS = {
  bucket: 'ppr-files',
  prefixManualConfig: 'config/manual_config',
} as const;

/** Доп. константы для ссылок/контента */
export const DEFAULT_CONTENT_TYPE = 'application/octet-stream' as const;
export const LINK_TARGET_BLANK = '_blank' as const;
export const WINDOW_FEATURES_NOOPENER = 'noopener,noreferrer' as const;
export const DEFAULT_DOWNLOAD_NAME = 'file' as const;

/** Диаметр кольца прогресса в иконке шага мастера (AntD Steps) */
export const STEP_ICON_SIZE = 35 as const;

/** События/каналы */
export const WS_EVENT_PLANNED_TASK_STATUS = 'planned_tasks.status' as const;
/** Кастомное DOM-событие прогресса стадий формы */
export const PROGRESS_EVENT_NAME = 'ppr:stage-progress' as const;
/** ID закреплённой строки «Все шаблоны/Все задачи» */
export const ALL_TASKS_ROW_ID = 0 as const;

/** Композитные (интерфейс-подобные) типы — идут в CompositeNodeRenderer */
export const COMPOSITE_TYPE_SET = new Set<string>(['interface', 'interface_with_vlan', 'routing']);
/** Количество минут в сутках */
export const MINUTES_IN_DAY = 1440 as const;
export const TEMPLATE_IDX_MODULO = 1000 as const;
/** CSS-классы для блоков таймлайна */
export const TIMELINE_CLASSES = {
  BASE: 'timeline-block',
  INFO: 'timeline-block--info',
  ONTIME: 'timeline-block--ontime',
  OVERTIME: 'timeline-block--overtime',
  WINDOW: 'timeline-block--window',
  COVERED: 'timeline-block--covered',
  ACTIVE: 'timeline-block--active',
  ROLE_AUDITOR: 'timeline-block--auditor',
  ROLE_INSTALLER: 'timeline-block--installer',
} as const;
/** Имя файла с типами  */
export const TYPES_FILENAME = 'types.yaml' as const;
/** Ключ для сохранения templateStore в localStorage */
export const TEMPLATES_STORE_PERSIST_KEY = 'templates-store' as const;
export const TEMPLATES_STORE_PERSIST_VERSION = 9 as const;
