import type { RoleKey } from '@/shared/utils/normalizeRoleKey';

/** Заголовки ролей для бейджа исполнителя */
export const ROLE_TITLES_RU: Record<RoleKey, string> = {
  engineer: 'Сетевой инженер',
  installer: 'Инженер СМР',
  auditor: 'Представитель Заказчика',
  system: 'Система',
};

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
  },
  booleanOptions: [
    { value: 'true', label: 'true' },
    { value: 'false', label: 'false' },
  ] as const,
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
  TIMER_ITEM_NAME: '__timer__',
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
