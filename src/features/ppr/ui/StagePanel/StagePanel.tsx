import { Button, Form, Input, InputNumber, Select, Table, Typography } from 'antd';
import React from 'react';
import type { FC } from 'react';

import type { StageField } from '@/entities/template/model/store/templateStore';
import { parseDurationToMinutesSafe } from '@/shared/utils/parseDuration';
import type { ConfigFile as BaseConfigFile } from '@features/ppr/ui/ConfigUploader/ConfigUploader';
import ConfigUploader from '@features/ppr/ui/ConfigUploader/ConfigUploader';
import AddExecutorModal from '@features/pprEdit/ui/AddExecutorModal/AddExecutorModal';

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

/**
 * Пропсы панели одного этапа (содержимое Collapse).
 */
export interface StagePanelProps {
  /** Ключ текущей стадии. */
  stageKey: string;
  /** Мета-описание стадии из шаблона. */
  meta: StageField;
  /** Длительность всей задачи (мин), запасной дефолт для таймера. */
  durationMinutes: number;

  /** Исполнители, назначенные на эту стадию (уже отфильтрованы по роли). */
  assignedExecutors: SimpleUser[];

  /** Открыть модалку выбора исполнителя для этой стадии. */
  onOpenAddExecutor: (stageKey: string) => void;
  /** Удалить исполнителя из стадии. */
  onRemoveExecutor: (stageKey: string, executorId: number) => void;

  /** Колбэк на изменение таймера. */
  onTimerChange?: (stageKey: string, newTimer: number) => void;

  /** Табличные колонки для списка конфигов (передаём из контейнера). */
  columns: any[];
  /** Текущий список конфигов (общий на форму). */
  configs: ConfigFile[];
  /** Обработчик изменения (загрузки) конфигов. */
  onConfigsChange: (files: BaseConfigFile[]) => void;

  /** Управление модалкой добавления исполнителя. */
  modalStageKey: string | null;
  onCloseModal: () => void;
  onSelectExecutor: (executorId: number) => void;

  /** Роль, которой разрешён выбор в модалке (из meta). */
  filterRole: string;
}

/**
 * StagePanel — UI одного этапа
 */
export const StagePanel: FC<StagePanelProps> = ({
  stageKey,
  meta,
  durationMinutes,
  assignedExecutors,
  onOpenAddExecutor,
  onRemoveExecutor,
  onTimerChange,

  columns,
  configs,
  onConfigsChange,

  modalStageKey,
  onCloseModal,
  onSelectExecutor,
  filterRole,
}) => {
  /** Начальное значение таймера из YAML */
  const yamlMinutes =
    parseDurationToMinutesSafe((meta as any)?.time) ??
    parseDurationToMinutesSafe((meta as any)?.duration) ??
    parseDurationToMinutesSafe((meta as any)?.timer_default);

  const timerInitial = Math.max(1, yamlMinutes ?? durationMinutes ?? 1);

  return (
    <section className="task-detail__stage">
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
            onClick={() => onRemoveExecutor(stageKey, user.id)}
          >
            Удалить
          </Button>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: '0 0 360px' }}>
          <div className="yaml-executor-add-row">
            <Button onClick={() => onOpenAddExecutor(stageKey)}>Добавить исполнителя</Button>
          </div>

          <Form
            layout="vertical"
            initialValues={{
              timer: timerInitial,
              ...Object.fromEntries(
                Object.values((meta as any).fields ?? {}).map((field: any) => [
                  field.key,
                  field.defaultValue,
                ]),
              ),
            }}
            onValuesChange={(changed) => {
              if (changed.timer != null) {
                onTimerChange?.(stageKey, changed.timer as number);
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

            {(meta as any).fields &&
              Object.values((meta as any).fields)
                .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
                .map((field: any) => (
                  <Form.Item key={field.key} label={field.name} name={field.key}>
                    {field.widget === 'dropdown' ? (
                      <Select
                        placeholder="Выберите…"
                        options={(field.options ?? []).map((option: any) => ({
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
          <ConfigUploader onChange={onConfigsChange} />
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
        open={modalStageKey === stageKey}
        onClose={onCloseModal}
        onSelect={onSelectExecutor}
        filterRoles={[filterRole]}
      />
    </section>
  );
};
