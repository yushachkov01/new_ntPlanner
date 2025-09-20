import { Button, Form, InputNumber, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { FC } from 'react';
import { useMemo, useEffect, useState, useCallback, useRef } from 'react';

import type { StageField } from '@/entities/template/model/store/templateStore';
import { useTypesStore } from '@/entities/types/model/store/typesStore';

import './StagePanel.css';
import {
  ROLE_TITLES_RU,
  STAGE_PANEL_TEXT as STAGE_PANEL,
  STAGE_PANEL_UI,
  STAGE_PANEL_KEYS,
} from '@/shared/constants';
import type { StageFieldDef } from '@/shared/types/fieldRenderer/types';
import type { RoleKey } from '@/shared/utils/normalizeRoleKey';
import { renderField } from '@/shared/utils/stagePanelUtils';
import {
  isFileFieldGeneric,
  getFormatsGeneric,
  getAcceptGeneric, isFilledValue,
} from '@/shared/utils/TaskDetailUtils';
import useTimelineStore from '@entities/timeline/model/store/timelineStore';
import { getStageMinutes } from '@entities/timeline/model/utils/time';
import { userStore } from '@entities/user/model/store/UserStore';
import type { ConfigFile as BaseConfigFile } from '@features/ppr/ui/ConfigUploader/ConfigUploader';
import ConfigUploader from '@features/ppr/ui/ConfigUploader/ConfigUploader';
import {
  StageFormPersistKey,
  StageFormValues,
  useStageFormStore
} from "@entities/stageFormStore/model/store/stageFormStore";

const { Text } = Typography;

/** Расширяем базовый тип файла конфига — добавляем метаданные загрузки. */
export interface ConfigFile extends BaseConfigFile {
  uploadedAt: string;
  uploadedBy: string;
}

/** Минимально необходимая форма пользователя-исполнителя для рендера. */
export interface SimpleUser {
  id: number | string;
  role: string;
  author: string;
}

export interface StagePanelProps {
  tplIdx?: number;
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

  /**  ДЛЯ ПРОГРЕССА ОБЯЗАТЕЛЬНЫХ  */
  onStageRequiredChange?: (stageKey: string, requiredKeys: string[]) => void;
  onStageFieldFilledChange?: (stageKey: string, fieldKey: string, isFilled: boolean) => void;
}

/**
 * Панель этапа: показывает назначенных исполнителей, динамические поля,
 * таймер и загрузку конфигураций.
 */
export const StagePanel: FC<StagePanelProps> = ({
  tplIdx,
  stageKey,
  meta,
  durationMinutes,
  assignedExecutors,
  onTimerChange,
  columns,
  configs,
  onConfigsChange,
  onStageRequiredChange,
  onStageFieldFilledChange,
}) => {
  /** Текущий пользователь — для подстановки в uploadedBy при отсутствии значения */
  const currentUser = userStore((s) => s.user);
  const currentUserDisplayName = useMemo(() => {
    const u: any = currentUser;
    const candidate =
      u?.author ?? u?.fio ?? u?.name ?? `${u?.last_name ?? ''} ${u?.first_name ?? ''}`.trim();
    return candidate && candidate.length > 0 ? candidate : '';
  }, [currentUser]);

  const setStageFieldValue = useTimelineStore((store) => (store as any).setStageFieldValue);

  //  ids исполнителей
  const getTplExecutorIds = useTimelineStore((s) => s.getTplExecutorIds);
  const tplExecIds = useMemo(
    () => (tplIdx != null && getTplExecutorIds ? getTplExecutorIds(tplIdx) : []),
    [getTplExecutorIds, tplIdx],
  );

  //  фильтрация «глобального» списка по tplExecIds
  const filteredExecutors = useMemo(() => {
    if (tplIdx == null || !tplExecIds.length) return assignedExecutors;
    const idSet = new Set(tplExecIds.map(String));
    return (assignedExecutors ?? []).filter((u) => idSet.has(String(u.id)));
  }, [assignedExecutors, tplExecIds, tplIdx]);
  /** Начальное значение таймера с учётом возможных источников в yaml */
  const timerInitial = useMemo(() => {
    const yamlMinutes = getStageMinutes(meta);
    return Math.max(1, yamlMinutes || durationMinutes || 1);
  }, [meta, durationMinutes]);

  const types = useTypesStore((store) => store.types);
  const loadTypes = useTypesStore((store) => store.load);
  useEffect(() => {
    loadTypes?.();
  }, [loadTypes]);
  /** Плоский список динамических полей, отсортированный по position */
  const stageFields = useMemo(() => {
    const rawFields = (meta as any)?.fields ?? {};
    const entries = Object.entries(rawFields) as [string, StageFieldDef][];
    return entries
      .map(([fieldKey, fieldDef], index) => {
        const dict = (types as any)?.types || (types as any) || {};
        const def: any = dict[String(fieldDef?.type ?? '').trim()];
        const merged: StageFieldDef & { __idx: number } = {
          key: fieldKey,
          ...(fieldDef || {}),
          __idx: index,
        };
        const typeEnum = def?.enum;
        if ((!merged.enum || merged.enum.length === 0) && typeEnum) {
          merged.enum = Array.isArray(typeEnum) ? typeEnum : [typeEnum];
        }
        const typeOptions = def?.options;
        if ((!merged.options || merged.options.length === 0) && typeOptions) {
          merged.options = typeOptions;
        }
        if (!merged.type && def?.type) {
          merged.type = def.type;
        }
        return merged;
      })
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  }, [meta, types]);

  /** поддержка нескольких файловых полей */
  const isFileField = useCallback(
    (fd: StageFieldDef): boolean => isFileFieldGeneric(fd, types as any),
    [types],
  );

  const getFormats = useCallback(
    (fd: StageFieldDef): string[] => getFormatsGeneric(fd, types as any),
    [types],
  );

  const getAccept = useCallback(
    (fd: StageFieldDef): string | undefined => getAcceptGeneric(fd, types as any),
    [types],
  );

  const fileFields = useMemo(
    () => (stageFields ?? []).filter(isFileField),
    [stageFields, isFileField],
  );
  const nonFileFields = useMemo(
    () => (stageFields ?? []).filter((fd) => !isFileField(fd)),
    [stageFields, isFileField],
  );

  /** === ОБЯЗАТЕЛЬНЫЕ ПОЛЯ ЭТАПА === */
  const requiredKeys = useMemo(
    () =>
      [...fileFields, ...nonFileFields]
        .filter((fd) => Boolean(fd.required))
        .map((fd) => String(fd.key)),
    [fileFields, nonFileFields],
  );

  // сообщаем о наборе обязательных полей
  useEffect(() => {
    onStageRequiredChange?.(stageKey, requiredKeys);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageKey, requiredKeys.join('|')]);

  /** По каждому файловому полю храним свой список видимых файлов и ошибки валидатора */
  const [visibleByField, setVisibleByField] = useState<Record<string, ConfigFile[]>>({});
  const [removedByField, setRemovedByField] = useState<Record<string, Set<string>>>({});
  const [uploaderErrorByField, setUploaderErrorByField] = useState<Record<string, boolean>>({});

  /** Показывать секцию конфигов, если есть поле с type: logs или уже есть загруженные файлы */
  const shouldShowConfigsSection = useMemo(() => {
    return fileFields.length > 0 || Object.values(visibleByField).some((l) => (l?.length ?? 0) > 0);
  }, [fileFields, visibleByField]);

  /** Вернуть строковый ключ записи (для удаления/поиска). */
  const getRecordKey = useCallback((record: any): string => {
    return String(
      record?.uid ?? record?.id ?? record?.name ?? record?.path ?? JSON.stringify(record),
    );
  }, []);

  /** при маунте — отметить заполненность НЕ файловых required по дефолтам/значениям */
  const [form] = Form.useForm();

  /** ключ и персист значений формы этапа через Zustand */
  const persistKey: StageFormPersistKey = useMemo(
      () => ({
        plannedTaskId: null,
        templateKey: String(tplIdx ?? '0'),
        stageKey,
        rowId: null,
      }),
      [tplIdx, stageKey],
  );
  const getPersisted = useStageFormStore((stage) => stage.get(persistKey));
  const patchPersisted = useStageFormStore((stage) => stage.patch);
  const setAllPersisted = useStageFormStore((stage) => stage.setAll);
  const isHydratedRef = useRef(false);
  const lastHydratedSavedRef = useRef<StageFormValues | undefined>(undefined);

  /** при маунте — отметить заполненность НЕ файловых required по дефолтам/значениям */
  useEffect(() => {
    const values = form.getFieldsValue();
    requiredKeys.forEach((k) => {
      const isFile = fileFields.some((f) => String(f.key) === k);
      if (!isFile) onStageFieldFilledChange?.(stageKey, k, isFilledValue(values[k]));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, stageKey, requiredKeys.join('|')]);

  /** Гидрация формы из стора + восстановление списка файлов и первичный пересчёт заполненности */
  useEffect(() => {
    const saved = getPersisted as StageFormValues | undefined;
    if (saved && !isHydratedRef.current) {
      lastHydratedSavedRef.current = saved;
      form.setFieldsValue(saved);

      const nextVisible: Record<string, ConfigFile[]> = {};
      for (const fd of fileFields) {
        const key = String(fd.key);
        const list = (saved as any)?.[key];
        if (Array.isArray(list)) {
          nextVisible[key] = (list as BaseConfigFile[]).map((file) => ({
            uploadedAt: (file as any).uploadedAt ?? new Date().toISOString(),
            uploadedBy: (file as any).uploadedBy ?? currentUserDisplayName ?? '',
            ...(file as any),
          }));
        }
      }
      if (Object.keys(nextVisible).length) {
        setVisibleByField((prev) => ({ ...prev, ...nextVisible }));
      }

      isHydratedRef.current = true;
    }
  }, [fileFields.map((field) => String(field.key)).join('|')]);

  /** после гидрации/обновления visibleByField пересчитываем filled для всех required */
  useEffect(() => {
    if (!isHydratedRef.current) return;
    const allValues = form.getFieldsValue();

    requiredKeys.forEach((keys) => {
      const isFile = fileFields.some((field) => String(field.key) === keys);
      if (isFile) {
        const fromVisible = (visibleByField[keys]?.length ?? 0) > 0;
        const fromSaved =
            Array.isArray((lastHydratedSavedRef.current as any)?.[keys]) &&
            ((lastHydratedSavedRef.current as any)[keys] as any[]).length > 0;
        const fromForm =
            Array.isArray((allValues as any)?.[keys]) &&
            ((allValues as any)[keys] as any[]).length > 0;
        const isFilled = fromVisible || fromSaved || fromForm;
        onStageFieldFilledChange?.(stageKey, keys, isFilled);
      } else {
        onStageFieldFilledChange?.(stageKey, keys, isFilledValue((allValues as any)[keys]));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleByField, requiredKeys.join('|')]);

  /** onChange для конкретного файлового поля */
  const handleConfigsChangeFor = useCallback(
    (fieldKey: string) => (files: BaseConfigFile[]) => {
      const normalizedFiles: ConfigFile[] = files.map((file) => ({
        uploadedAt: (file as any).uploadedAt ?? new Date().toISOString(),
        uploadedBy: (file as any).uploadedBy ?? currentUserDisplayName ?? '',
        ...(file as any),
      }));

      setVisibleByField((prev) => {
        const removedSet = removedByField[fieldKey] ?? new Set<string>();
        const filtered = normalizedFiles.filter((rec) => !removedSet.has(getRecordKey(rec)));
        const uniqueMap = new Map<string, ConfigFile>();
        for (const rec of filtered) uniqueMap.set(getRecordKey(rec), rec);
        const uniqueList = Array.from(uniqueMap.values());

        const next: Record<string, ConfigFile[]> = { ...prev, [fieldKey]: uniqueList };

        const flattened = Object.entries(next).flatMap(([, value]) => value ?? []);
        const baseList: BaseConfigFile[] = flattened.map(
          ({ uploadedAt, uploadedBy, ...rest }: any) => rest as BaseConfigFile,
        );
        onConfigsChange?.(baseList);

        try {
          setStageFieldValue?.({ stageKey, fieldKey, value: baseList });
        } catch {}

        // отметить заполненность файлового поля
        onStageFieldFilledChange?.(stageKey, fieldKey, uniqueList.length > 0);

        patchPersisted(persistKey, { [fieldKey]: baseList as unknown });
        return next;
      });
    },
    [
      currentUserDisplayName,
      getRecordKey,
      onConfigsChange,
      removedByField,
      setStageFieldValue,
      stageKey,
      onStageFieldFilledChange,
      patchPersisted,
      persistKey,
    ],
  );

  const handleUploaderErrorFor = useCallback(
    (fieldKey: string) => (hasError: boolean) => {
      setUploaderErrorByField((prev) => ({ ...prev, [fieldKey]: hasError }));
    },
    [],
  );

  return (
    <section className="task-detail__stage">
      {filteredExecutors.map((user) => (
        <div key={`${user.id}`} className="yaml-executor-row">
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
            form={form}
            layout="vertical"
            initialValues={{
              timer: timerInitial,
              ...Object.fromEntries(
                (Object.entries((meta as any)?.fields ?? {}) as [string, StageFieldDef][])
                  .filter(([, def]) => def?.default !== undefined)
                  .map(([key, def]) => [key, def.default]),
              ),
            }}
            onValuesChange={(changedValues, allValues) => {
              if (changedValues.timer != null) {
                onTimerChange?.(stageKey, changedValues.timer as number);
              }
              Object.entries(changedValues).forEach(([changedKey, changedValue]) => {
                if (changedKey === 'timer') return;
                try {
                  setStageFieldValue?.({ stageKey, fieldKey: changedKey, value: changedValue });
                } catch {}
                onStageFieldFilledChange?.(
                  stageKey,
                  changedKey,
                  isFilledValue((allValues as any)[changedKey]),
                );
              });
              setAllPersisted(persistKey, allValues as unknown as StageFormValues);
            }}
           preserve
          >
            {wrapTimer()}
            {nonFileFields.map((fd) => renderField(fd, types as any))}
          </Form>
        </div>

        {shouldShowConfigsSection && (
          <div className="stage-panel__configs">
            {fileFields.map((fd) => {
              const fieldKey = String(fd.key);
              const exts = getFormats(fd);
              const accept = getAccept(fd);
              const isRequired = Boolean(fd.required);
              const title = String(fd.label || STAGE_PANEL.logs.title);
              const hint = exts.length
                ? `${STAGE_PANEL.logs.formatsHintPrefix}${exts.join(', ')}`
                : null;

              const visible = visibleByField[fieldKey] ?? [];
              const hasError = uploaderErrorByField[fieldKey];

              return (
                <div key={fieldKey} className="stage-panel__configs-block">
                  <div className="stage-panel__configs-header">
                    <b>{title}</b>
                    {isRequired && <span className="stage-panel__required-asterisk">*</span>}
                  </div>
                  <div className="stage-panel__uploader-row">
                    <ConfigUploader
                      value={visible}
                      onChange={handleConfigsChangeFor(fieldKey)}
                      allowedExtensions={exts}
                      accept={accept}
                      onErrorChange={handleUploaderErrorFor(fieldKey)}
                    />
                    {!hasError && hint && (
                      <Text className="stage-panel__formats-hint stage-panel__formats-hint--danger">
                        * {hint}
                      </Text>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );

  /**
   * Рендерит поле Таймер (мин)
   */
  function wrapTimer() {
    return (
      <Form.Item
        key={STAGE_PANEL_KEYS.TIMER_ITEM_NAME}
        label={STAGE_PANEL.form.timerLabel}
        name="timer"
        rules={[{ required: true, type: 'number', min: 1 }]}
      >
        <InputNumber style={STAGE_PANEL_UI.INPUT_NUMBER_STYLE} />
      </Form.Item>
    );
  }
};

export default StagePanel;
