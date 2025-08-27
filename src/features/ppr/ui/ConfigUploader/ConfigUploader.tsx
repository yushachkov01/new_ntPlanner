import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, message } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { useMemo, useState } from 'react';
import type { FC } from 'react';

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
}

/**
 * Компонент загрузчика конфигураций.
 * Позволяет прикрепить один конфиг-файл и выводит уведомление об успешной загрузке.
 */
const ConfigUploader: FC<Props> = ({ onChange, accept, allowedExtensions }) => {
  /** Список загруженных конфигураций */
  const [configs, setConfigs] = useState<ConfigFile[]>([]);

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
    if (normalizedAllowed.length) {
      return normalizedAllowed.map((x) => `.${x}`).join(',');
    }
    return '.cfg,.conf,.txt';
  }, [accept, normalizedAllowed]);

  /** Проверка расширения файла */
  const checkExtension = (fileName: string): { ok: boolean; ext: string } => {
    const ext = (fileName.split('.').pop() || '').toLowerCase();
    const ok = ext !== '' && normalizedAllowed.includes(ext);
    return { ok, ext };
  };

  /**
   * Перед добавлением в список валидируем расширение.
   */
  const beforeUpload = (file: File) => {
    const { ok, ext } = checkExtension(file.name);
    if (!ok) {
      message.error(
        `Формат ".${ext || '?'}" не поддерживается. Допустимо: ${normalizedAllowed
          .map((x) => `.${x}`)
          .join(', ')}`,
      );
      return Upload.LIST_IGNORE;
    }
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
      message.error(
        `Формат ".${ext || '?'}" не поддерживается. Допустимо: ${normalizedAllowed
          .map((x) => `.${x}`)
          .join(', ')}`,
      );
      return;
    }

    const newConfig: ConfigFile = {
      uid: latestUpload.uid,
      name: originalFile.name,
      url: URL.createObjectURL(originalFile),
    };

    setConfigs((previousConfigs) => {
      /** Если такой UID уже есть — не добавляем */
      if (previousConfigs.find((cfg) => cfg.uid === newConfig.uid)) {
        return previousConfigs;
      }
      const updatedConfigs = [...previousConfigs, newConfig];
      onChange?.(updatedConfigs);
      message.success('Конфигурация добавлена');
      return updatedConfigs;
    });
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <Upload
        accept={effectiveAccept}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />}>Приложить конфигурацию</Button>
      </Upload>
    </div>
  );
};

export default ConfigUploader;
