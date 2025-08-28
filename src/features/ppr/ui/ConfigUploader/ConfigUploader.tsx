import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, message } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { useMemo, useState } from 'react';
import type { FC } from 'react';
import './ConfigUploader.css';

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
const ConfigUploader: FC<Props> = ({ onChange, accept, allowedExtensions, onErrorChange }) => {
  /** Список загруженных конфигураций */
  const [configs, setConfigs] = useState<ConfigFile[]>([]);
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
    return ['cfg', 'conf', 'txt'];
  }, [allowedExtensions, accept]);

  /** Итоговое значение для Upload.accept */
  const effectiveAccept = useMemo(() => {
    if (accept && accept.length) return accept;
    if (normalizedAllowed.length) return withDots(normalizedAllowed).join(',');
    return '.cfg,.conf,.txt';
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
      const msg = `Формат ".${ext || '?'}" не поддерживается. Допустимо: ${withDots(normalizedAllowed).join(', ')}`;
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
  const handleChange = ({ fileList }: { fileList: UploadFile[] }) => {
    const latestUpload = fileList[fileList.length - 1];
    if (!latestUpload) return;

    const originalFile = latestUpload.originFileObj as File;
    if (!originalFile) return;

    const { ok, ext } = checkExtension(originalFile.name);
    if (!ok) {
      const msg = `Формат ".${ext || '?'}" не поддерживается. Допустимо: ${withDots(normalizedAllowed).join(', ')}`;
      showError(msg);
      return;
    }

    const newConfig: ConfigFile = {
      uid: latestUpload.uid,
      name: originalFile.name,
      url: URL.createObjectURL(originalFile),
    };

    setConfigs((previousConfigs) => {
      if (previousConfigs.find((cfg) => cfg.uid === newConfig.uid)) return previousConfigs;
      const updated = [...previousConfigs, newConfig];
      onChange?.(updated);
      clearError();
      try {
        message.success('Конфигурация добавлена');
      } catch {}
      return updated;
    });
  };

  return (
    <div className="config-uploader">
      <Upload
        accept={effectiveAccept}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        showUploadList={false}
        multiple={false}
        maxCount={1}
      >
        <Button icon={<UploadOutlined />}>Загрузить файл</Button>
      </Upload>

      {lastError && (
        <div className="config-uploader__error" role="alert" aria-live="polite">
          {lastError}
        </div>
      )}
    </div>
  );
};

export default ConfigUploader;
