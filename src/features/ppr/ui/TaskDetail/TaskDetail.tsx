import {
  UploadOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  FileImageOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { Modal, Upload, Button, Input, message } from 'antd';
import type { FC } from 'react';
import { useState } from 'react';

import './TaskDetail.css';
import { ALLOWED_UPLOAD_TYPES } from '@features/ppr/lib/constants.ts';
import { getDesc } from '@features/ppr/lib/getDesc.ts';
import type { TaskDetailProps, UploadedFile } from '@features/ppr/model/types.ts';

const TaskDetail: FC<TaskDetailProps> = ({
  id,
  label,
  startTime,
  endTime,
  performer,
  status = 'info',
  subSteps,
  onClose,
  onMarkDone,
}) => {
  //длительность
  const [sH, sM] = startTime.split(':').map(Number);
  const [eH, eM] = endTime.split(':').map(Number);
  const duration = eH * 60 + eM - (sH * 60 + sM);
  const needsUpload = status === 'done';
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [workDescription, setWorkDescription] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [showSubs, setShowSubs] = useState(false);

  const beforeUpload = (file: File) => {
    if (!ALLOWED_UPLOAD_TYPES.includes(file.type)) {
      message.error('Разрешённые форматы: JPEG, PNG, PDF, DOC/DOCX, XLS/XLSX');
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const handleUploadChange = (info: any) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1);
    setFileList(newFileList);
  };

  const openModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const handleOk = () => {
    if (fileList.length === 0) {
      message.error('Пожалуйста, прикрепите файл выполненной работы.');
      return;
    }
    if (!workDescription.trim()) {
      message.error('Пожалуйста, опишите выполненную работу.');
      return;
    }
    const file = fileList[0].originFileObj as File;
    const objectUrl = URL.createObjectURL(file);
    const uploaded: UploadedFile = {
      name: file.name,
      type: file.type,
      url: objectUrl,
    };
    setUploadedFile(uploaded);
    setIsCompleted(true);
    setIsModalVisible(false);

    onMarkDone && onMarkDone(id, uploaded, workDescription);
  };

  const renderFileWithDescription = () => {
    if (!uploadedFile) return null;
    const { type, name, url } = uploadedFile;
    const getIcon = () => {
      if (type.startsWith('image/'))
        return <FileImageOutlined className="task-detail__file-icon" />;
      if (type.includes('pdf')) return <FilePdfOutlined className="task-detail__file-icon" />;
      if (type.includes('msword') || type.includes('wordprocessingml'))
        return <FileWordOutlined className="task-detail__file-icon" />;
      if (type.includes('excel') || type.includes('spreadsheetml'))
        return <FileExcelOutlined className="task-detail__file-icon" />;
      return <FilePdfOutlined className="task-detail__file-icon" />;
    };
    return (
      <div className="task-detail__uploaded-wrapper">
        <a href={url} download={name} className="task-detail__file-link">
          {getIcon()}
          <span className="task-detail__file-name">{name}</span>
        </a>
        <div className="task-detail__file-description">{workDescription}</div>
      </div>
    );
  };

  return (
    <div className="task-detail">
      <div className="task-detail__header">
        <div className="task-detail__title">{label}</div>
        <div className="task-detail__controls">
          <div className="task-detail__time-text">
            ⏱ {startTime} – {endTime} | {duration} мин
          </div>
          <button className="task-detail__toggle-full" onClick={() => {}}>
            <span className="toggle-arrow up" />
          </button>
          <button className="task-detail__close" onClick={onClose}>
            ✕
          </button>
        </div>
      </div>

      {/* ───────── Основной контент ───────── */}
      <div className="task-detail__body--fullinfo">
        <div className="task-detail__main-row">
          <div className="task-detail__left-col">
            <div className="task-detail__type-row">
              <strong>Тип работы:</strong>
              <span className="task-detail__type-value">Физика</span>
            </div>
            <div className="task-detail__perform-duration-row">
              <div className="task-detail__performer">
                <strong>Исполнитель:</strong>
                <span className="task-detail__performer-value">{performer}</span>
              </div>
              <div className="task-detail__duration">
                <strong>Продолжительность:</strong>
                <span className="task-detail__duration-value">{duration} мин</span>
              </div>
            </div>
          </div>
          <div className="task-detail__right-col">
            <div className="task-detail__description-full">
              <strong>Описание задачи:</strong>
              <div className="task-detail__description-text">{getDesc(id, label)}</div>
            </div>
          </div>
        </div>

        <div className="task-detail__info-row task-detail__button-row">
          {!isCompleted && needsUpload ? (
            <button className="task-detail__done-btn" onClick={openModal}>
              Готово
            </button>
          ) : isCompleted ? (
            <div className="task-detail__completed-block">
              <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
              Выполнено
            </div>
          ) : null}
        </div>

        {isCompleted && renderFileWithDescription()}
      </div>

      {subSteps && subSteps.length > 0 && (
        <div className="task-detail__substeps-toggle">
          <button className="show-substeps-btn" onClick={() => setShowSubs((prev) => !prev)}>
            {showSubs ? 'Скрыть подэтапы' : 'Показать подэтапы'}
          </button>
        </div>
      )}

      {showSubs && subSteps && (
        <div className="task-detail__substeps">
          {subSteps.map((ss, i) => {
            const ml = i * 1.5;
            return (
              <div
                key={ss.id}
                className={`subtask-item level-${i + 1}`}
                style={{
                  marginLeft: `${ml}rem`,
                  width: `calc(100% - ${ml}rem)`,
                }}
              >
                <div className="subtask-item__left">
                  <span className="subtask-item__icon">○</span>
                  <span className="subtask-item__label">“{ss.label}”</span>
                </div>
                <div className="subtask-item__right">
                  <button className="subtask-item__comments">Комментарии…</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        title="Прикрепить фото/файл и описание"
        open={isModalVisible}
        onCancel={handleCancel}
        width={600}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Отмена
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Отправить
          </Button>,
        ]}
      >
        <div style={{ marginBottom: 16 }}>
          <strong>Прикрепите файл (JPEG, PNG, PDF, DOC/DOCX, XLS/XLSX):</strong>
          <Upload
            accept=".jpeg,.jpg,.png,.pdf,.doc,.docx,.xls,.xlsx"
            beforeUpload={beforeUpload}
            fileList={fileList}
            onChange={handleUploadChange}
            multiple={false}
            maxCount={1}
            showUploadList={{ showRemoveIcon: true }}
          >
            <Button icon={<UploadOutlined />}>Выбрать файл</Button>
          </Upload>
        </div>
        <div>
          <strong>Описание выполненной работы:</strong>
          <Input.TextArea
            rows={4}
            value={workDescription}
            onChange={(e) => setWorkDescription(e.target.value)}
            placeholder="Опишите, что было сделано"
          />
        </div>
      </Modal>
    </div>
  );
};

export default TaskDetail;
