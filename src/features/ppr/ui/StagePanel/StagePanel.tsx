import { Button, Form, InputNumber, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { FC } from 'react';
import { useMemo, useEffect, useState, useCallback } from 'react';

import type { StageField } from '@/entities/template/model/store/templateStore';
import { useTypesStore } from '@/entities/types/model/store/typesStore';
import { ROLE_TITLES_RU, STAGE_PANEL_TEXT } from '@/shared/constants';
import type { StageFieldDef } from '@/shared/types/fieldRenderer/types';
import { normalizeType, renderFormItem } from '@/shared/utils/fieldRenderer';
import type { RoleKey } from '@/shared/utils/normalizeRoleKey';
import { getStageMinutes } from '@entities/timeline/model/utils/time';
import { userStore } from '@entities/user/model/store/UserStore';
import type { ConfigFile as BaseConfigFile } from '@features/ppr/ui/ConfigUploader/ConfigUploader';
import ConfigUploader from '@features/ppr/ui/ConfigUploader/ConfigUploader';

import './StagePanel.css';

const { Text } = Typography;

/** Расширяем базовый тип файла конфига — добавляем метаданные загрузки. */
export interface ConfigFile extends BaseConfigFile {
  uploadedAt: string;
  uploadedBy: string;
}

/** Минимально необходимая форма пользователя-исполнителя для рендера. */
export interface SimpleUser {
  id: number;
  role: string;
  author: string;
}

export interface StagePanelProps {
  /** Ключ текущей стадии. */
  stageKey: string;
  /** Мета-описание стадии из шаблона. */
  meta: StageField;
  /** Длительность всей задачи (мин), запасной дефолт для таймера. */
  durationMinutes: number;

  /** Исполнители, назначенные на эту стадию (уже отфильтрованы по роли). */
  assignedExecutors: SimpleUser[];
  /** Колбэк на изменение таймера. */
  onTimerChange?: (stageKey: string, newTimer: number) => void;

  columns: ColumnsType<ConfigFile>;
  configs: ConfigFile[];
  /** Обработчик изменения (загрузки) конфигов. */
  onConfigsChange: (files: BaseConfigFile[]) => void;
}

/**
 * Панель этапа: показывает назначенных исполнителей, динамические поля,
 * таймер и загрузку конфигураций.
 * params
 *  - props: StagePanelProps
 */
export const StagePanel: FC<StagePanelProps> = ({
  stageKey,
  meta,
  durationMinutes,
  assignedExecutors,
  onTimerChange,
  columns,
  configs,
  onConfigsChange,
}) => {
  /** Текущий пользователь — для подстановки в uploadedBy при отсутствии значения */
  const currentUser = userStore((s) => s.user);
  const currentUserDisplayName = useMemo(() => {
    const u: any = currentUser;
    const candidate =
      u?.author ?? u?.fio ?? u?.name ?? `${u?.last_name ?? ''} ${u?.first_name ?? ''}`.trim();
    return candidate && candidate.length > 0 ? candidate : '';
  }, [currentUser]);

  /** Начальное значение таймера */
  const timerInitial = useMemo(() => {
    const yamlMinutes = getStageMinutes(meta);
    return Math.max(1, yamlMinutes || durationMinutes || 1);
  }, [meta, durationMinutes]);

  /** Плоский список динамических полей, отсортированный по position */
  const stageFields = useMemo(() => {
    const rawFields = (meta as any)?.fields ?? {};
    const entries = Object.entries(rawFields) as [string, StageFieldDef][];
    return entries
      .map(([fieldKey, fieldDef], index) => ({ key: fieldKey, ...(fieldDef || {}), __idx: index }))
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  }, [meta]);

  const [uploaderHasError, setUploaderHasError] = useState(false);
  /** ДОПУСТИМЫЕ ФОРМАТЫ ИЗ types.yaml */

  const types = useTypesStore((s) => s.types);
  const loadTypes = useTypesStore((s) => s.load);
  useEffect(() => {
    loadTypes?.();
  }, [loadTypes]);
  /** Находим описание поля */
  const logsField = useMemo(() => {
    return stageFields.find((f) => normalizeType(f.type) === 'logs');
  }, [stageFields]);

  /** Является ли обязательным (required: true) */
  const isLogsRequired = Boolean(logsField?.required);

  /** Форматы для поля (например ["txt","pdf"]) */
  const allowedFormats: string[] = useMemo(() => {
    try {
      if (!logsField) return [];
      const t: any = types;
      const def = t?.[String(logsField.type)];
      const fmt = def?.format;
      const arr = Array.isArray(fmt) ? fmt : fmt ? [fmt] : [];
      return arr.map((x: any) => String(x).trim()).filter(Boolean);
    } catch {
      return [];
    }
  }, [logsField, types]);

  /** Для Upload.accept — ".txt,.pdf" */
  const uploadAccept = useMemo(
    () =>
      allowedFormats.length
        ? allowedFormats.map((x) => (x.startsWith('.') ? x : `.${x}`)).join(',')
        : undefined,
    [allowedFormats],
  );

  /** Для жёсткой валидации — ["txt","pdf"] */
  const allowedExtensions = useMemo(
    () => allowedFormats.map((x) => x.replace(/^\./, '').toLowerCase()),
    [allowedFormats],
  );

  /** Подсказка справа от кнопки */
  const formatsHint = useMemo(
    () =>
      allowedFormats.length
        ? `${STAGE_PANEL_TEXT.logs.formatsHintPrefix}${allowedFormats.join(', ')}`
        : null,
    [allowedFormats],
  );
  /** отображаемые конфиги (мгновенно после загрузки) */
  const [visibleConfigs, setVisibleConfigs] = useState<ConfigFile[]>(configs ?? []);

  /** Ключи записей, которые пользователь удалил (не показывать даже если загрузчик пришлёт их снова) */
  const [removedKeys, setRemovedKeys] = useState<Set<string>>(new Set());

  /** Синхронизируем список при изменении пропса configs */
  useEffect(() => {
    const normalized = (configs ?? []).map((rec: any) => ({
      uploadedAt: rec?.uploadedAt ?? new Date().toISOString(),
      uploadedBy: rec?.uploadedBy ?? currentUserDisplayName ?? '',
      ...rec,
    })) as ConfigFile[];
    setVisibleConfigs(normalized);
  }, [configs, currentUserDisplayName]);

  /** Показывать секцию конфигов, если есть поле с type: logs или уже есть загруженные файлы */
  const shouldShowConfigsSection = useMemo(() => {
    const hasLogsField = Boolean(logsField);
    return hasLogsField || (visibleConfigs?.length ?? 0) > 0;
  }, [logsField, visibleConfigs]);

  /** Вернуть читаемое имя файла из записи. */
  const getDisplayName = useCallback((record: any): string => {
    return (
      record?.name ||
      record?.filename ||
      record?.fileName ||
      record?.title ||
      record?.path ||
      `${STAGE_PANEL_TEXT.files.fallbackFilePrefix} ${record?.uid ?? ''}`
    );
  }, []);

  /** Вернуть строковый ключ записи (для удаления/поиска). */
  const getRecordKey = useCallback((record: any): string => {
    return String(
      record?.uid ?? record?.id ?? record?.name ?? record?.path ?? JSON.stringify(record),
    );
  }, []);

  /**
   * Обработчик изменения (загрузки) конфигов.
   * params
   *  - files: исходные записи из загрузчика
   */
  const handleConfigsChange = useCallback(
    (files: BaseConfigFile[]) => {
      const normalizedFiles: ConfigFile[] = files.map((file) => ({
        uploadedAt: (file as any).uploadedAt ?? new Date().toISOString(),
        uploadedBy: (file as any).uploadedBy ?? currentUserDisplayName ?? '',
        ...(file as any),
      }));

      const filteredByRemoved = normalizedFiles.filter(
        (rec) => !removedKeys.has(getRecordKey(rec)),
      );

      const uniqueMap = new Map<string, ConfigFile>();
      for (const rec of filteredByRemoved) uniqueMap.set(getRecordKey(rec), rec);
      const uniqueList = Array.from(uniqueMap.values());

      setVisibleConfigs(uniqueList);

      const baseList: BaseConfigFile[] = uniqueList.map(
        ({ uploadedAt, uploadedBy, ...rest }: any) => rest as BaseConfigFile,
      );
      onConfigsChange?.(baseList);
    },
    [onConfigsChange, removedKeys, getRecordKey, currentUserDisplayName],
  );

  /**
   * Удалить файл из списка
   * params
   *  - record: запись файла
   */
  const handleRemoveFile = useCallback(
    (record: any) => {
      const keyToRemove = getRecordKey(record);

      const nextVisible = visibleConfigs.filter((item) => getRecordKey(item) !== keyToRemove);
      setVisibleConfigs(nextVisible);

      setRemovedKeys((prev) => {
        const next = new Set(prev);
        next.add(keyToRemove);
        return next;
      });

      const nextBase: BaseConfigFile[] = nextVisible.map(
        ({ uploadedAt, uploadedBy, ...rest }: any) => rest as BaseConfigFile,
      );
      onConfigsChange?.(nextBase);
    },
    [visibleConfigs, onConfigsChange, getRecordKey],
  );

  /** Открыть предпросмотр файла в новой вкладке. */
  const handlePreviewFile = useCallback((record: any) => {
    const directUrl = record?.url || record?.href || record?.link;
    if (directUrl) {
      window.open(String(directUrl), '_blank', 'noopener,noreferrer');
      return;
    }
    const blobLike: Blob | undefined = record?.file || record?.blob;
    if (blobLike) {
      const objectUrl = URL.createObjectURL(blobLike);
      window.open(objectUrl, '_blank', 'noopener,noreferrer');
    }
  }, []);

  /** колонки, если снаружи ничего не передали */
  const effectiveColumns: ColumnsType<ConfigFile> = useMemo(() => {
    if (columns && columns.length > 0) return columns;

    const formatDateTime = (isoOrDate: any): string => {
      const date = isoOrDate instanceof Date ? isoOrDate : new Date(isoOrDate);
      if (Number.isNaN(date.getTime())) return '';
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}, ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };

    return [
      {
        key: 'name',
        dataIndex: 'name',
        render: (_: any, record: any) => getDisplayName(record),
      },
      {
        key: 'meta',
        dataIndex: 'uploadedAt',
        render: (_: any, record: any) => {
          const when = record?.uploadedAt ? formatDateTime(record.uploadedAt) : '';
          const who = record?.uploadedBy ? STAGE_PANEL_TEXT.files.byParen(record.uploadedBy) : '';
          return when
            ? `${STAGE_PANEL_TEXT.files.uploadedPrefix}${when}${who}`
            : who || STAGE_PANEL_TEXT.common.emDash;
        },
      },
      {
        key: 'actions',
        dataIndex: '__actions__',
        align: 'right',
        width: 220,
        render: (_: any, record: any) => (
          <div className="stage-panel__actions">
            <Button danger size="small" onClick={() => handleRemoveFile(record)}>
              {STAGE_PANEL_TEXT.files.deleteBtn}
            </Button>
            <Button type="primary" size="small" onClick={() => handlePreviewFile(record)}>
              {STAGE_PANEL_TEXT.files.previewBtn}
            </Button>
          </div>
        ),
      },
    ];
  }, [columns, getDisplayName, handleRemoveFile, handlePreviewFile]);

  return (
    <section className="task-detail__stage">
      <p className="task-detail__header">{meta?.description}</p>
      {assignedExecutors.map((user) => (
        <div key={user.id} className="yaml-executor-row">
          <div className="yaml-executor-field">
            <Text className="executor-role">
              {ROLE_TITLES_RU[user.role as RoleKey] ?? user.role}
            </Text>
            <input className="yaml-executor-input" value={user.author} readOnly />
          </div>
        </div>
      ))}

      <div className="stage-panel__layout">
        <div className="stage-panel__form">
          <Form
            layout="vertical"
            initialValues={{
              timer: timerInitial,
              ...Object.fromEntries(
                (Object.entries((meta as any)?.fields ?? {}) as [string, StageFieldDef][])
                  .filter(([, def]) => def?.default !== undefined)
                  .map(([key, def]) => [key, def.default]),
              ),
            }}
            onValuesChange={(changedValues) => {
              if (changedValues.timer != null) {
                onTimerChange?.(stageKey, changedValues.timer as number);
              }
            }}
            preserve
          >
            <Form.Item
              key="__timer__"
              label={STAGE_PANEL_TEXT.form.timerLabel}
              name="timer"
              rules={[{ required: true, type: 'number', min: 1 }]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            {stageFields.map((fd) => renderFormItem(fd))}
          </Form>
        </div>

        {shouldShowConfigsSection && (
          <div className="stage-panel__configs">
            <div className="stage-panel__configs-header">
              <b>{STAGE_PANEL_TEXT.logs.title}</b>
              {isLogsRequired && <span className="stage-panel__required-asterisk">*</span>}
            </div>
            <div className="stage-panel__uploader-row">
              <ConfigUploader
                onChange={handleConfigsChange}
                accept={uploadAccept}
                allowedExtensions={allowedExtensions}
                onErrorChange={setUploaderHasError}
              />
              {!uploaderHasError && formatsHint && (
                <Text className="stage-panel__formats-hint stage-panel__formats-hint--danger">
                  * {formatsHint}
                </Text>
              )}
            </div>

            <Table
              dataSource={visibleConfigs}
              columns={effectiveColumns}
              rowKey={(record: any) => record?.uid ?? record?.id ?? record?.name ?? String(record)}
              pagination={false}
              size="small"
              bordered
              locale={{ emptyText: STAGE_PANEL_TEXT.files.emptyText }}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default StagePanel;
