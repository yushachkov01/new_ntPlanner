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
} from '@/shared/constants';

const { Dragger } = Upload;

export interface ConfigFile {
  /** Уникальный идентификатор файла */
  uid: string;
  /** Оригинальное имя файла */
  name: string;
  /** URL для предпросмотра/скачивания */
  url: string;
}

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
}

const withDots = (arr: string[]) => arr.map((x) => (x.startsWith('.') ? x : `.${x}`));
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
}) => {
  const [inner, setInner] = useState<ConfigFile[]>([]);
  const files = value ?? inner;

  const [lastError, setLastError] = useState<string>('');

  /** Нормализованный список допустимых расширений без точки, в нижнем регистре */
  const normalizedAllowed = useMemo<string[]>(() => {
    if (allowedExtensions && allowedExtensions.length) {
      return allowedExtensions.map((x) => x.replace(/^\./, '').toLowerCase());
    }
    if (accept && accept.length) {
      return accept
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => s.replace(/^\./, '').toLowerCase());
    }
    /** дефолтный набор */
    return [...CONFIG_UPLOADER_DEFAULTS.allowedExtensions];
  }, [allowedExtensions, accept]);

  /** Итоговое значение для Upload.accept */
  const effectiveAccept = useMemo(() => {
    if (accept && accept.length) return accept;
    if (normalizedAllowed.length) return withDots(normalizedAllowed).join(',');
    return CONFIG_UPLOADER_DEFAULTS.accept;
  }, [accept, normalizedAllowed]);

  /** Проверка расширения файла */
  const checkExtension = (fileName: string): { ok: boolean; ext: string } => {
    const ext = (fileName.split('.').pop() || '').toLowerCase();
    const ok = ext !== '' && normalizedAllowed.includes(ext);
    return { ok, ext };
  };

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
    const { ok, ext } = checkExtension(file.name);
    if (!ok) {
      const msg = `${CONFIG_UPLOADER_TEXT.unsupportedPrefix}.${ext || '?'}${CONFIG_UPLOADER_TEXT.unsupportedSuffix}${withDots(
        normalizedAllowed,
      ).join(', ')}`;
      showError(msg);
      return Upload.LIST_IGNORE;
    }
    clearError();
    return false;
  };

  /**
   * Обрабатывает изменение списка загруженных файлов.
   * Берёт только последний файл, создаёт объект ConfigFile и добавляет его в список.
   */
  const handleChange = (arg: UploadChangeParam<UploadFile> | { fileList: UploadFile[] }) => {
    const anyArg: any = arg as any;
    const fromList: UploadFile[] | undefined = anyArg?.fileList;
    const candidate: UploadFile | undefined =
      anyArg?.file ?? (fromList && fromList[fromList.length - 1]);
    if (!candidate) return;

    const originalFile: File | undefined =
      (candidate as any).originFileObj || (candidate as unknown as File | undefined);
    if (!originalFile || typeof originalFile.name !== 'string') return;

    const { ok, ext } = checkExtension(originalFile.name);
    if (!ok) {
      const msg = `${CONFIG_UPLOADER_TEXT.unsupportedPrefix}.${ext || '?'}${CONFIG_UPLOADER_TEXT.unsupportedSuffix}${withDots(
        normalizedAllowed,
      ).join(', ')}`;
      showError(msg);
      return;
    }

    const newConfig: ConfigFile = {
      uid: candidate.uid,
      name: originalFile.name,
      url: URL.createObjectURL(originalFile),
    };

    const next = files.find((f) => f.uid === newConfig.uid) ? files : [...files, newConfig];

    if (onChange) onChange(next);
    else setInner(next);

    clearError();
    try {
      message.success(CONFIG_UPLOADER_TEXT.addedMessage);
    } catch {}
  };

  /** Просмотр в новой вкладке */
  const preview = (rec: ConfigFile) => {
    if (!rec?.url) return;
    window.open(rec.url, '_blank', 'noopener,noreferrer');
  };

  /** Скачивание по клику на имени */
  const download = (event: MouseEvent, configFile: ConfigFile) => {
    event.preventDefault();
    if (!configFile?.url) return;
    const downloadLink = document.createElement('a');
    downloadLink.href = configFile.url;
    downloadLink.download = configFile.name || 'file';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  /** Удаление из списка */
  const remove = (uid: string) => {
    const next = files.filter((file) => file.uid !== uid);
    if (onChange) onChange(next);
    else setInner(next);
  };

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

      {files.length > 0 && (
        <div className="config-uploader__list">
          {files.map((rec) => (
            <div className="config-uploader__item" key={rec.uid}>
              <PaperClipOutlined className="config-uploader__clip" />

              <a
                href={rec.url || '#'}
                className="config-uploader__name"
                onClick={(e) => download(e, rec)}
                download={rec.name}
              >
                {rec.name}
              </a>

              <div className="config-uploader__actions">
                <button
                  type="button"
                  className="config-uploader__view"
                  onClick={() => preview(rec)}
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
