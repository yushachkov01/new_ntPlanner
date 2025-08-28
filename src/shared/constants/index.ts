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
