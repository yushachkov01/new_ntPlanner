import { InboxOutlined, PaperClipOutlined, DeleteOutlined } from '@ant-design/icons';
import { Upload, message, Tooltip } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { useMemo, useState } from 'react';
import type { FC, MouseEvent } from 'react';
import './ConfigUploader.css';

import {
  CONFIG_UPLOADER_TEXT,
  CONFIG_UPLOADER_DEFAULTS,
  STAGE_PANEL_TEXT,
  CONFIG_STORAGE_DEFAULTS,
  DEFAULT_CONTENT_TYPE,
  LINK_TARGET_BLANK,
  WINDOW_FEATURES_NOOPENER,
  DEFAULT_DOWNLOAD_NAME,
} from '@/shared/constants';
import { getMinioClient } from '@/shared/minio/getMinioClient';
import {
  resolveNormalizedAllowed,
  resolveEffectiveAccept,
  beforeUploadGuardReturn,
  handleConfigUploaderChangeFlow,
  previewRecord,
  downloadRecord,
  removeFlow,
  hrefOrPlaceholder,
  previewButtonProps,
  sanitizeName,
  yyyymmdd,
  rnd,
} from '@/shared/utils/baseUtils';

const { Dragger } = Upload;

export interface ConfigFile {
  /** Уникальный идентификатор файла */
  uid: string;
  /** Оригинальное имя файла */
  name: string;
}

type RenderItem = ConfigFile & { previewUrl?: string };
/**
 * Пропсы загрузчика конфигураций.
 */
interface Props {
  /** Текущее значение (для контролируемого режима). Если не передано — компонент работает неконтролируемо. */
  value?: ConfigFile[];
  /** Колбэк при изменении списка загруженных файлов */
  onChange?: (files: ConfigFile[]) => void;
  /**
   * Разрешённые форматы (передаются в Upload.accept).
   * Если не задано — используется безопасный дефолт.
   */
  accept?: string;
  /**
   * Список разрешённых расширений без точки.
   * Нужен для жёсткой валидации в beforeUpload. Если не задан,
   * берётся из accept или используется дефолтный набор.
   */
  allowedExtensions?: string[];
  /** Сообщить родителю, есть ли сейчас ошибка у загрузчика */
  onErrorChange?: (hasError: boolean) => void;
  /** параметры хранилища (могут быть переопределены снаружи) */
  bucket?: string;
  prefix?: string;
}

/**
 * Компонент загрузчика конфигураций.
 * Позволяет прикрепить один конфиг-файл и выводит уведомление об успешной загрузке.
 */
const ConfigUploader: FC<Props> = ({
  value,
  onChange,
  accept,
  allowedExtensions,
  onErrorChange,
  bucket = CONFIG_STORAGE_DEFAULTS.bucket,
  prefix = CONFIG_STORAGE_DEFAULTS.prefixManualConfig,
}) => {
  const [inner, setInner] = useState<ConfigFile[]>([]);
  const files = value ?? inner;

  const [lastError, setLastError] = useState('');
  const [previewByUid, setPreviewByUid] = useState<Record<string, string>>({});

  /** Нормализованный список допустимых расширений без точки, в нижнем регистре */
  const normalizedAllowed = useMemo<string[]>(() => {
    return resolveNormalizedAllowed(
      allowedExtensions,
      accept,
      CONFIG_UPLOADER_DEFAULTS.allowedExtensions,
    );
  }, [allowedExtensions, accept]);

  /** Итоговое значение для Upload.accept */
  const effectiveAccept = useMemo(() => {
    return resolveEffectiveAccept(accept, normalizedAllowed, CONFIG_UPLOADER_DEFAULTS.accept);
  }, [accept, normalizedAllowed]);

  const showError = (msg: string) => {
    setLastError(msg);
    onErrorChange?.(true);
    try {
      message.error(msg);
    } catch {}
  };

  const clearError = () => {
    if (lastError) setLastError('');
    onErrorChange?.(false);
  };

  /**
   * Перед добавлением в список валидируем расширение.
   */
  const beforeUpload = (file: File) => {
    return beforeUploadGuardReturn(file.name, normalizedAllowed, CONFIG_UPLOADER_TEXT, showError);
  };

  /** Сохранение в MinIO -> { uid, name } */
  const persistToMinio = async (file: File): Promise<ConfigFile & { key: string }> => {
    const safeName = sanitizeName(file.name);
    const key = `${prefix}/${yyyymmdd()}/${Date.now()}-${rnd()}-${safeName}`;
    const { putObjectBytes } = await getMinioClient();
    await putObjectBytes(bucket, key, file, file.type || DEFAULT_CONTENT_TYPE);

    const uid =
      (globalThis.crypto as any)?.randomUUID?.() ??
      `${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}`;

    return { uid, name: file.name, key };
  };

  /**
   * Обрабатывает изменение списка загруженных файлов.
   * Берёт только последний файл, создаёт объект ConfigFile и добавляет его в список.
   */
  const handleChange = async (arg: UploadChangeParam<UploadFile> | { fileList: UploadFile[] }) => {
    await handleConfigUploaderChangeFlow<ConfigFile, ConfigFile & { key: string }>(
      arg,
      normalizedAllowed,
      files,
      onChange,
      (next) => setInner(next),
      setPreviewByUid,
      showError,
      persistToMinio,
      CONFIG_UPLOADER_TEXT,
      STAGE_PANEL_TEXT,
      clearError,
    );
  };

  /** Просмотр в новой вкладке */
  const preview = (rec: RenderItem) => {
    return previewRecord(rec, LINK_TARGET_BLANK, WINDOW_FEATURES_NOOPENER);
  };

  /** Скачивание по клику на имени */
  const download = (event: MouseEvent, configFile: RenderItem) => {
    return downloadRecord(event as any, configFile, DEFAULT_DOWNLOAD_NAME);
  };

  /** Удаление из списка */
  const remove = (uid: string) => {
    return removeFlow(files, uid, onChange, setInner);
  };

  const renderList: RenderItem[] = (files ?? []).map((f) => ({
    ...f,
    previewUrl: previewByUid[f.uid],
  }));

  return (
    <div className="config-uploader">
      <Dragger
        multiple
        accept={effectiveAccept}
        beforeUpload={beforeUpload}
        onChange={handleChange as any}
        showUploadList={false}
        openFileDialogOnClick
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{CONFIG_UPLOADER_TEXT.dragText}</p>
        <p className="ant-upload-hint">{CONFIG_UPLOADER_TEXT.dragHint}</p>
      </Dragger>

      {lastError && (
        <div className="config-uploader__error" role="alert" aria-live="polite">
          {lastError}
        </div>
      )}

      {renderList.length > 0 && (
        <div className="config-uploader__list">
          {renderList.map((rec) => (
            <div className="config-uploader__item" key={rec.uid}>
              <PaperClipOutlined className="config-uploader__clip" />

              <a
                href={hrefOrPlaceholder(rec.previewUrl)}
                className="config-uploader__name"
                onClick={(e) => download(e as any, rec)}
                download={rec.name}
              >
                {rec.name}
              </a>

              <div className="config-uploader__actions">
                <button
                  type="button"
                  className="config-uploader__view"
                  onClick={() => preview(rec)}
                  {...previewButtonProps(rec.previewUrl, STAGE_PANEL_TEXT)}
                >
                  {STAGE_PANEL_TEXT.files.previewBtn}
                </button>

                <Tooltip title={STAGE_PANEL_TEXT.files.deleteBtn}>
                  <button
                    type="button"
                    className="config-uploader__delete"
                    onClick={() => remove(rec.uid)}
                    aria-label={STAGE_PANEL_TEXT.files.deleteBtn}
                  >
                    <DeleteOutlined />
                  </button>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConfigUploader;
