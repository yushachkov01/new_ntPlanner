import { Button, Form, Input, InputNumber, Select, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { FC } from 'react';
import { useMemo, useEffect, useState, useCallback } from 'react';

import type { StageField } from '@/entities/template/model/store/templateStore';
import type { RoleKey } from '@/shared/utils/normalizeRoleKey';
import { getStageMinutes } from '@entities/timeline/model/utils/time';
import { userStore } from '@entities/user/model/store/UserStore';
import type { ConfigFile as BaseConfigFile } from '@features/ppr/ui/ConfigUploader/ConfigUploader';
import ConfigUploader from '@features/ppr/ui/ConfigUploader/ConfigUploader';

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

/** Ключ роли */
const ROLE_TITLES_RU: Record<RoleKey, string> = {
  engineer: 'Сетевой инженер',
  installer: 'Инженер СМР',
  auditor: 'Представитель Заказчика',
  system: 'Система',
};

type StageFieldDef = {
  key?: string;
  label?: string;
  type?: string;
  required?: boolean;
  default?: any;
  enum?: any[];
  position?: number;
  widget?: string;
  options?: any[];
};

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

  /** Теги из шаблона */
  const initialTags: string[] = useMemo(() => {
    const tagsRaw = (meta as any)?.tags;
    return Array.isArray(tagsRaw) ? tagsRaw.map(String) : [];
  }, [meta]);

  /** Плоский список динамических полей, отсортированный по position */
  const stageFields = useMemo(() => {
    const rawFields = (meta as any)?.fields ?? {};
    const entries = Object.entries(rawFields) as [string, StageFieldDef][];
    return entries
      .map(([fieldKey, fieldDef], index) => ({ key: fieldKey, ...(fieldDef || {}), __idx: index }))
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  }, [meta]);

  /** Начальные значения формы */
  const initialFormValues = useMemo(() => {
    const defaultsFromFields: Record<string, any> = {};
    stageFields.forEach((field) => {
      if (field.default !== undefined) defaultsFromFields[field.key] = field.default;
    });
    return {
      timer: timerInitial,
      ...defaultsFromFields,
      tags: initialTags,
    };
  }, [stageFields, timerInitial, initialTags]);

  /**
   * Рендер динамического поля по его описанию.
   */
  const renderDynamicField = (fieldDef: StageFieldDef) => {
    const name = fieldDef.key!;
    const label = fieldDef.label ?? name;
    const type = (fieldDef.type || '').toString().toLowerCase();
    const isRequired = Boolean(fieldDef.required);

    const enumVals: any[] | undefined = Array.isArray(fieldDef.enum) ? fieldDef.enum : undefined;
    const optionsVals: any[] | undefined = Array.isArray(fieldDef.options)
      ? fieldDef.options
      : undefined;
    const asDropdown = fieldDef.widget === 'dropdown' || enumVals || optionsVals;

    if (asDropdown) {
      const options = (enumVals || optionsVals || []).map((optionVal: any) => ({
        value: typeof optionVal === 'object' ? JSON.stringify(optionVal) : String(optionVal),
        label: typeof optionVal === 'object' ? JSON.stringify(optionVal) : String(optionVal),
      }));
      return (
        <Form.Item
          key={name}
          label={label}
          name={name}
          rules={isRequired ? [{ required: true, message: 'Обязательное поле' }] : undefined}
        >
          <Select placeholder="Выберите…" options={options} />
        </Form.Item>
      );
    }

    if (type === 'memo') {
      return (
        <Form.Item
          key={name}
          label={label}
          name={name}
          rules={isRequired ? [{ required: true, message: 'Обязательное поле' }] : undefined}
        >
          <Input.TextArea autoSize={{ minRows: 4, maxRows: 12 }} />
        </Form.Item>
      );
    }

    if (type === 'int' || type === 'integer' || type === 'number') {
      return (
        <Form.Item
          key={name}
          label={label}
          name={name}
          rules={isRequired ? [{ required: true, message: 'Обязательное поле' }] : undefined}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
      );
    }

    if (type === 'boolean' || type === 'bool') {
      return (
        <Form.Item
          key={name}
          label={label}
          name={name}
          rules={isRequired ? [{ required: true, message: 'Обязательное поле' }] : undefined}
        >
          <Select
            options={[
              { value: 'true', label: 'true' },
              { value: 'false', label: 'false' },
            ]}
          />
        </Form.Item>
      );
    }

    return (
      <Form.Item
        key={name}
        label={label}
        name={name}
        rules={isRequired ? [{ required: true, message: 'Обязательное поле' }] : undefined}
      >
        <Input />
      </Form.Item>
    );
  };

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
    const hasLogsField = stageFields.some(
      (field) => String(field.type ?? '').toLowerCase() === 'logs',
    );
    return hasLogsField || (visibleConfigs?.length ?? 0) > 0;
  }, [stageFields, visibleConfigs]);

  /** Вернуть читаемое имя файла из записи. */
  const getDisplayName = useCallback((record: any): string => {
    return (
      record?.name ||
      record?.filename ||
      record?.fileName ||
      record?.title ||
      record?.path ||
      `Файл ${record?.uid ?? ''}`
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
      for (const rec of filteredByRemoved) {
        uniqueMap.set(getRecordKey(rec), rec);
      }
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
          const who = record?.uploadedBy ? ` (${record.uploadedBy})` : '';
          return when ? `Загружено ${when}${who}` : who || '—';
        },
      },
      {
        key: 'actions',
        dataIndex: '__actions__',
        align: 'right',
        width: 220,
        render: (_: any, record: any) => (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button danger size="small" onClick={() => handleRemoveFile(record)}>
              Удалить
            </Button>
            <Button type="primary" size="small" onClick={() => handlePreviewFile(record)}>
              Посмотреть
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

      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: '0 0 360px' }}>
          <Form
            layout="vertical"
            initialValues={initialFormValues}
            onValuesChange={(changedValues) => {
              if (changedValues.timer != null) {
                onTimerChange?.(stageKey, changedValues.timer as number);
              }
            }}
            preserve
          >
            <Form.Item
              key="__timer__"
              label="Таймер (мин)"
              name="timer"
              rules={[{ required: true, type: 'number', min: 1 }]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            {stageFields.map(renderDynamicField)}

            <Form.Item label="Теги" name="tags">
              <Select
                mode="multiple"
                open={false}
                showSearch={false}
                disabled
                options={initialTags.map((tag) => ({ value: tag, label: tag }))}
                value={initialTags}
              />
            </Form.Item>
          </Form>
        </div>

        {shouldShowConfigsSection && (
          <div style={{ flex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <b>Конфигурации</b>
            </div>
            <ConfigUploader onChange={handleConfigsChange} />
            <Table
              dataSource={visibleConfigs}
              columns={effectiveColumns}
              rowKey={(record: any) => record?.uid ?? record?.id ?? record?.name ?? String(record)}
              pagination={false}
              size="small"
              bordered
              locale={{ emptyText: 'Нет данных' }}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default StagePanel;
