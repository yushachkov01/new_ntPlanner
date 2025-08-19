import { UserOutlined } from '@ant-design/icons';
import { Tabs, Typography, List, Checkbox, Button, Select } from 'antd';
import React, { useState, useMemo, useEffect } from 'react';

import { usePlannedTaskStore } from '@/entities/PlannedTask/model/store/plannedTaskStore';
import { useUserStore } from '@/entities/users/model/store/userStore';
import AddExecutorModal from '@/features/pprEdit/ui/AddExecutorModal/AddExecutorModal';
import { TimeIntervalModal } from '@/features/pprEdit/ui/timePicker/TimeIntervalModal';
import type { User } from '@entities/users/model/mapping/mapping';
import './PprEditorTabs.css';

const { Text, Link } = Typography;

export const PRESET_TIMES = [
  { value: '23:00–06:00', label: 'Ночная смена 23:00 – 06:00' },
  { value: '00:00–08:00', label: 'Ночная смена 00:00 – 08:00' },
  { value: '09:00–18:00', label: 'День 09:00 – 18:00' },
  { value: '__custom__', label: 'Свой интервал…' },
] as const;

interface Props {
  taskId: string;
  executors: User[];
  addExecutor: (executor: User) => void;
  removeExecutor: (executorId: string) => void;
  onWorkTimeChange: (interval: { start: string; end: string }) => void;
}

/**
 * Компонент с тремя вкладками:
 * 1) Карта работ — описание, проект, ссылки, выбор времени.
 * 2) Сетевое оборудование — список чекбоксов и кнопка «Провести опрос».
 * 3) Исполнители — список текущих исполнителей, кнопки добавления/удаления.
 */
const PprEditorTabs: React.FC<Props> = ({
  taskId,
  executors,
  addExecutor,
  removeExecutor,
  onWorkTimeChange,
}) => {
  const { tasks, timeWorks, projects, rmTasks, device, load } = usePlannedTaskStore();
  useEffect(() => {
    load();
  }, [load]);

  const selectedTask = tasks.find((t) => t.id === taskId);
  if (!selectedTask) return null;

  const rmTask = rmTasks.find((r) => r.id === selectedTask.rmTaskId);
  const projectName = rmTask ? (projects.find((p) => p.id === rmTask.projectId)?.name ?? '') : '';
  /** Список оборудования из задачи */
  const equipmentList = useMemo(() => {
    return device.map((d) => d.hostname);
  }, [device]);

  const [currentEquip, setCurrentEquip] = useState<string[]>([]);
  const setDeviceWhitelist = usePlannedTaskStore((s) => s.setDeviceWhitelist);
  useEffect(() => {
    if (equipmentList.length) {
      setCurrentEquip(equipmentList);
      setDeviceWhitelist(equipmentList);
    } else {
      setCurrentEquip([]);
      setDeviceWhitelist([]);
    }
  }, [equipmentList, setDeviceWhitelist]);

  /** Интервал работ TimeWorks */
  const tw = timeWorks.find((t) => t.id === selectedTask.timeWorkId);
  const defaultInterval = tw
    ? `${tw.startAt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}–${tw.endAt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`
    : PRESET_TIMES[0].value;

  const [selectedTimeInterval, setSelectedTimeInterval] = useState(defaultInterval);
  const [isCustomModal, setCustomModal] = useState(false);

  /**
   * Формирует список опций для селекта времени:
   * включает все PRESET_TIMES и текущий выбранный, если он кастомный.
   */
  const timeOptions = useMemo(() => {
    const vals = new Set(PRESET_TIMES.map((i) => i.value));
    vals.add(selectedTimeInterval);
    return Array.from(vals).map((v) => {
      const preset = PRESET_TIMES.find((i) => i.value === v);
      return { value: v, label: preset?.label ?? v };
    });
  }, [selectedTimeInterval]);

  /**
   * Обработка выбора времени из селекта:
   * "__custom__" — открыть модалку,
   * иначе — обновить state и вызвать колбэк.
   */
  const handleTimeSelect = (value: string) => {
    if (value === '__custom__') {
      setCustomModal(true);
      return;
    }
    setSelectedTimeInterval(value);
    const [start, end] = value.split('–');
    onWorkTimeChange({ start, end });
  };

  const { users, roles: userRoles, load: loadUsers } = useUserStore();
  /** Управление модалкой добавления исполнителя */
  const [isAddExecutorModalVisible, setAddExecutorModalVisible] = useState(false);
  useEffect(() => {
    if (users.length === 0) loadUsers();
  }, [users.length, loadUsers]);

  const items = [
    {
      key: 'work',
      label: 'Карта работ',
      children: (
        <div className="tab-content tab-content--work">
          <div>
            <p>
              <Text>Описание:&nbsp;</Text>
              <Text strong>{selectedTask.description}</Text>
            </p>
            <p className="tab-content-project">
              <Text>Проект:&nbsp;</Text>
              <Text strong>{projectName}</Text>
            </p>
            <div className="tab-links">
              {rmTask && (
                <Link href={selectedTask.rm} target="_blank">
                  Перейти к задаче в Redmine
                </Link>
              )}
              <Link href={selectedTask.rd} target="_blank">
                Перейти к РД
              </Link>
            </div>
          </div>
          <div className="tab-content__right">
            <Text>Время работ:</Text>
            <Select
              style={{ width: 200 }}
              value={selectedTimeInterval}
              options={timeOptions}
              onSelect={handleTimeSelect}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'equip',
      label: 'Сетевое оборудование',
      children: (
        <div className="tab-content tab-content--equipment">
          <p className="equipment-title">Оборудование:</p>
          {equipmentList.length === 0 ? (
            <Text type="secondary">Нет оборудования</Text>
          ) : (
            <List
              bordered
              dataSource={equipmentList}
              renderItem={(eq) => (
                <List.Item>
                  <Checkbox
                    checked={currentEquip.includes(eq)}
                    onChange={(e) => {
                      setCurrentEquip((prev) => {
                        const next = e.target.checked
                          ? Array.from(new Set([...prev, eq]))
                          : prev.filter((i) => i !== eq);
                        setDeviceWhitelist(next);
                        return next;
                      });
                    }}
                  >
                    {eq}
                  </Checkbox>
                </List.Item>
              )}
            />
          )}
          <Button
            className="tab-content--equipment--tabs"
            type="primary"
            disabled={!currentEquip.length}
            onClick={() => console.log('Опрос:', currentEquip)}
          >
            Провести опрос
          </Button>
        </div>
      ),
    },
    {
      key: 'exec',
      label: 'Исполнители',
      children: (
        <div className="tab-content tab-content--members">
          <p className="members-title">Участники:</p>
          {executors.map((exe, idx) => (
            <div key={exe.id} className="members-row">
              <UserOutlined className="members-icon" />
              <span className="members-name">
                {exe.role} — {exe.author}
              </span>
              {idx > 0 ? (
                <Button className="members-remove" onClick={() => removeExecutor(exe.id)}>
                  Удалить
                </Button>
              ) : (
                <Button
                  className="yaml-executor-add-btn"
                  onClick={() => setAddExecutorModalVisible(true)}
                >
                  Добавить исполнителя
                </Button>
              )}
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <>
      <Tabs items={items} className="ppr-editor-tabs" />

      <AddExecutorModal
        open={isAddExecutorModalVisible}
        onClose={() => setAddExecutorModalVisible(false)}
        onSelect={(id) => {
          const user = users.find((u) => u.id === id);
          if (!user) return;
          const roleName = userRoles.find((r) => r.id === user.roleId)?.name ?? '';
          addExecutor({ id: user.id, author: user.name, role: roleName });
          setAddExecutorModalVisible(false);
        }}
        filterRoles={['Сетевой инженер', 'Инженер СМР', 'Представитель Заказчика']}
      />

      <TimeIntervalModal
        open={isCustomModal}
        onCancel={() => setCustomModal(false)}
        onOk={(val) => {
          setSelectedTimeInterval(val);
          const [start, end] = val.split('–');
          onWorkTimeChange({ start, end });
          setCustomModal(false);
        }}
      />
    </>
  );
};
export default PprEditorTabs;
