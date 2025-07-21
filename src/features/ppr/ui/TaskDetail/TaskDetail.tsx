import { Button, Input, InputNumber, Select, Form, Typography, Table } from 'antd';
import type { FC } from 'react';
import { useState, useMemo } from 'react';

import type { StageField } from '@/entities/template/model/store/templateStore';
import { executorStore } from '@entities/executor/model/store/executorStore';
import { userStore } from '@entities/user/model/store/UserStore';
import type { TaskDetailProps } from '@features/ppr/model/types';
import type { ConfigFile as BaseConfigFile } from '@features/ppr/ui/ConfigUploader/ConfigUploader';
import ConfigUploader from '@features/ppr/ui/ConfigUploader/ConfigUploader';
import AddExecutorModal from '@features/pprEdit/ui/AddExecutorModal/AddExecutorModal';
import './TaskDetail.css';

const { Text } = Typography;

/**
 * Расширяем базовый файл конфига, добавляя время и автора загрузки
 */
interface ConfigFile extends BaseConfigFile {
  uploadedAt: string;
  uploadedBy: string;
}

/**
 * Свойства компонента TaskDetail
 */
interface Props extends TaskDetailProps {
  stageKeys?: string[];
  stagesField?: Record<string, StageField>;
  onTimerChange?: (stageKey: string, newTimer: number) => void;
}

/**
 * Детальная форма задачи:
 * отображение этапов, исполнителей, формы полей и конфигов,
 * а также обработка готовности и загрузки файлов.
 */
const TaskDetail: FC<Props> = ({
  label,
  startTime,
  endTime,
  stageKeys = [],
  stagesField = {},
  onClose,
  onTimerChange,
}) => {
  /** Текущий пользователь */
  const currentUser = userStore((state) => state.user)!;
  /** Словарь всех исполнителей из стора */
  const executorMap = executorStore((state) => state.executors);
  /** Плоский массив исполнителей */
  const allExecutors = useMemo(() => Object.values(executorMap).flat(), [executorMap]);

  /** Инициализируем отображение исполнителей по этапам */
  const initialExecutorsByStage: Record<string, number[]> = {};
  stageKeys.forEach((stageKey) => {
    initialExecutorsByStage[stageKey] = [currentUser.id];
  });
  const [executorsByStage, setExecutorsByStage] = useState(initialExecutorsByStage);

  /** Состояние для открытия модального выбора исполнителя */
  const [modalStageKey, setModalStageKey] = useState<string | null>(null);
  /** Список конфигураций с метаданными */
  const [configs, setConfigs] = useState<ConfigFile[]>([]);
  /** Расчёт длительности задачи в минутах */
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  const durationMinutes = endHour * 60 + endMinute - (startHour * 60 + startMinute);

  /** Список этапов с их данными для рендера */
  const orderedStages = useMemo(
    () =>
      stageKeys
        .map((stageKey) => ({ key: stageKey, meta: stagesField[stageKey] }))
        .filter((entry): entry is { key: string; meta: StageField } => !!entry.meta),
    [stageKeys, stagesField],
  );

  /** Колонки таблицы конфигов */
  const columns = [
    {
      dataIndex: 'name',
      key: 'name',
      render: (fileName: string) => <span>{fileName}</span>,
    },
    {
      key: 'info',
      render: (_unused: any, record: ConfigFile) => (
        <Text type="secondary">{`Загружено ${record.uploadedAt} (${record.uploadedBy})`}</Text>
      ),
    },
    {
      key: 'actions',
      width: 140,
      render: (_unused: any, record: ConfigFile) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            size="small"
            danger
            onClick={() =>
              setConfigs((previousConfigs) =>
                previousConfigs.filter((config) => config.uid !== record.uid),
              )
            }
          >
            Удалить
          </Button>
          <Button size="small" type="primary" onClick={() => window.open(record.url, '_blank')}>
            Посмотреть
          </Button>
        </div>
      ),
    },
  ];

  /**
   * Обработка изменения списка загруженных конфигов:
   * добавляем дату и автора загрузки
   */
  const handleConfigChange = (files: BaseConfigFile[]) => {
    const currentTimestamp = new Date().toLocaleString();
    setConfigs((previousConfigs) => {
      const updatedConfigs = [...previousConfigs];
      files.forEach((file) => {
        if (!updatedConfigs.find((cfg) => cfg.uid === file.uid)) {
          updatedConfigs.push({
            ...file,
            uploadedAt: currentTimestamp,
            uploadedBy: currentUser.author,
          });
        }
      });
      return updatedConfigs;
    });
  };

  /** Удаление исполнителя из этапа */
  const handleRemoveExecutor = (stageKey: string, executorId: number) => {
    setExecutorsByStage((previousMap) => ({
      ...previousMap,
      [stageKey]: previousMap[stageKey].filter((id) => id !== executorId),
    }));
  };

  /** Добавление исполнителя в этап после выбора в модале */
  const handleSelectExecutor = (executorId: number) => {
    if (!modalStageKey) return;
    setExecutorsByStage((previousMap) => ({
      ...previousMap,
      [modalStageKey]: Array.from(new Set([...(previousMap[modalStageKey] || []), executorId])),
    }));
    setModalStageKey(null);
  };

  return (
    <div className="task-detail">
      <div className="task-detail__header">
        <div className="task-detail__title">{label}</div>
        <div className="task-detail__controls">
          <div className="task-detail__time-text">
            ⏱ {startTime}–{endTime} | {durationMinutes} мин
          </div>
          <button className="task-detail__close" onClick={onClose}>
            ✕
          </button>
        </div>
      </div>

      {orderedStages.map(({ key, meta }) => {
        const assignedExecutors = (executorsByStage[key] || [])
          .map((executorId) =>
            executorId === currentUser.id
              ? currentUser
              : allExecutors.find((exec) => exec.id === executorId),
          )
          .filter((user): user is typeof currentUser => !!user && user.role === meta.engineer);

        return (
          <section key={key} className="task-detail__stage">
            <p className="task-detail__header">{meta.description}</p>
            {assignedExecutors.map((user) => (
              <div key={user.id} className="yaml-executor-row">
                <div className="yaml-executor-field">
                  <Text className="executor-role">{user.role}</Text>
                  <input className="yaml-executor-input" value={user.author} readOnly />
                </div>
                <Button
                  danger
                  type="default"
                  className="yaml-executor-remove-btn"
                  onClick={() => handleRemoveExecutor(key, user.id)}
                >
                  Удалить
                </Button>
              </div>
            ))}

            <div style={{ display: 'flex', gap: 20 }}>
              <div style={{ flex: '0 0 360px' }}>
                <div className="yaml-executor-add-row">
                  <Button onClick={() => setModalStageKey(key)}>Добавить исполнителя</Button>
                </div>
                <Form
                  layout="vertical"
                  initialValues={{
                    timer: meta.timer_default,
                    ...Object.fromEntries(
                      Object.values(meta.fields ?? {}).map((field) => [
                        field.key,
                        field.defaultValue,
                      ]),
                    ),
                  }}
                  onValuesChange={(changedValues) => {
                    if (changedValues.timer != null) {
                      onTimerChange?.(key, changedValues.timer as number);
                    }
                  }}
                >
                  <Form.Item
                    label="Таймер (мин)"
                    name="timer"
                    rules={[{ required: true, type: 'number', min: 1 }]}
                  >
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                  {meta.fields &&
                    Object.values(meta.fields)
                      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
                      .map((field) => (
                        <Form.Item key={field.key} label={field.name} name={field.key}>
                          {field.widget === 'dropdown' ? (
                            <Select
                              placeholder="Выберите…"
                              options={(field.options ?? []).map((option) => ({
                                value: option,
                                label: option,
                              }))}
                            />
                          ) : (
                            <Input />
                          )}
                        </Form.Item>
                      ))}
                </Form>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: 8 }}>
                  <b>Конфигурации</b>
                </div>
                <ConfigUploader onChange={handleConfigChange} />
                <Table
                  dataSource={configs}
                  columns={columns}
                  rowKey="uid"
                  pagination={false}
                  size="small"
                  bordered
                  locale={{ emptyText: 'Нет данных' }}
                />
              </div>
            </div>

            <AddExecutorModal
              open={modalStageKey === key}
              onClose={() => setModalStageKey(null)}
              onSelect={handleSelectExecutor}
              filterRoles={[meta.engineer]}
            />
          </section>
        );
      })}
    </div>
  );
};

export default TaskDetail;
