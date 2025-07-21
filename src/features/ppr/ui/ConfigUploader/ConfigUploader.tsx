import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, message } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import React, { useState } from 'react';
import type { FC } from 'react';

export interface ConfigFile {
  /** Уникальный идентификатор файла */
  uid: string;
  /** Оригинальное имя файла */
  name: string;
  /** URL для предпросмотра/скачивания */
  url: string;
}

interface Props {
  /** Колбэк при изменении списка загруженных файлов */
  onChange?: (files: ConfigFile[]) => void;
}

/**
 * Компонент загрузчика конфигураций.
 * Позволяет прикрепить один конфиг-файл и выводит уведомление об успешной загрузке.
 */
const ConfigUploader: FC<Props> = ({ onChange }) => {
  /**  список загруженных конфигураций */
  const [configs, setConfigs] = useState<ConfigFile[]>([]);

  /**
   * Обрабатывает изменение списка загруженных файлов.
   * Берёт только последний файл, создаёт объект ConfigFile и добавляет его в список.
   */
  const handleChange = ({ fileList }: { fileList: UploadFile[] }) => {
    const latestUpload = fileList[fileList.length - 1];
    if (!latestUpload) return;

    const originalFile = latestUpload.originFileObj as File;
    if (!originalFile) return;

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
        accept=".cfg,.conf,.txt"
        beforeUpload={() => false}
        onChange={handleChange}
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />}>Приложить конфигурацию</Button>
      </Upload>
    </div>
  );
};

export default ConfigUploader;
