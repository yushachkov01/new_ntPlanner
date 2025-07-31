/**
 * вкладки: «Карта работ», «Сетевое оборудование», «Исполнители»
 */
import { UserOutlined } from '@ant-design/icons';
import { Tabs, Select, Typography, Checkbox, Button } from 'antd';
import React, { useState, useMemo } from 'react';

import type { Executor } from '@/entities/executor/model/store/executorStore';
import { usePlannedTaskStore } from '@/entities/PlannedTask/model/store/plannedTaskStore';
import AddExecutorModal from '@/features/pprEdit/ui/AddExecutorModal/AddExecutorModal';
import { TimeIntervalModal } from '@/features/pprEdit/ui/timePicker/TimeIntervalModal';
import './PprEditorTabs.css';
import { useUserStore } from '@/entities/users/model/store/userStore';

const { TabPane } = Tabs;
const { Text, Link } = Typography;

/** Предустановленные интервалы времени */
export const PRESET_TIMES = [
  { value: '23:00–06:00', label: 'Ночная смена 23:00 – 06:00' },
  { value: '00:00–08:00', label: 'Ночная смена 00:00 – 08:00' },
  { value: '09:00–18:00', label: 'День 09:00 – 18:00' },
  { value: '__custom__', label: 'Свой интервал…' },
] as const;

interface Props {
  taskId: string;
  executors: Executor[];
  addExecutor: (executor: Executor) => void;
  removeExecutor: (executorId: number) => void;
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
  const { tasks, timeWorks, projects, rmTasks } = usePlannedTaskStore();
  /** Получаем задачу по ID */
  const selectedTask = tasks.find((t) => t.id === taskId);
  if (!selectedTask) return null;

  const rmTask = rmTasks.find((r) => r.id === selectedTask.rmTaskId);
  const projectName = rmTask ? (projects.find((p) => p.id === rmTask.projectId)?.name ?? '') : '';
  /** Список оборудования из задачи */
  const equipmentList = useMemo(() => {
    const raw = selectedTask.equipment ?? '';
    return raw ? raw.split(',').map((e) => e.trim()) : [];
  }, [selectedTask.equipment]);
  const [currentEquip, setCurrentEquip] = useState<string[]>(equipmentList);
  /** Интервал работ TimeWorks */
  const tw = timeWorks.find((t) => t.id === selectedTask.timeWorkId);
  const defaultInterval = tw
    ? `${tw.startAt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}` +
      `–${tw.endAt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`
    : PRESET_TIMES[0].value;

  /** Состояние выбранного интервала и управления кастомным вводом */
  const [selectedTimeInterval, setSelectedTimeInterval] = useState<string>(defaultInterval);
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

  /** Управление модалкой добавления исполнителя */
  const [isAddExecutorModalVisible, setAddExecutorModalVisible] = useState(false);

  return (
    <>
      <Tabs defaultActiveKey="1" className="ppr-editor-tabs">
        <TabPane tab="Карта работ" key="1">
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
              <Text>Время проведения работ:</Text>
              <Select
                style={{ width: 200 }}
                value={selectedTimeInterval}
                options={timeOptions}
                onSelect={handleTimeSelect}
              />
            </div>
          </div>
        </TabPane>

        <TabPane tab="Сетевое оборудование" key="2">
          <div className="tab-content tab-content--equipment">
            <p className="equipment-title">Задействовано оборудование:</p>
            <ul className="equipment-list">
              {equipmentList.map((equipment) => (
                <li key={equipment} className="equipment-item">
                  <Checkbox
                    checked={currentEquip.includes(eq)}
                    onChange={(e) =>
                      setCurrentEquip((prev) =>
                        e.target.checked ? [...prev, eq] : prev.filter((i) => i !== eq),
                      )
                    }
                  />
                  <span className="equipment-name">{eq}</span>
                </li>
              ))}
            </ul>
            <Button
              type="primary"
              disabled={!currentEquip.length}
              onClick={() => console.log('Опрос:', currentEquip)}
            >
              Провести опрос
            </Button>
          </div>
        </TabPane>
        <TabPane tab="Исполнители" key="3">
          <div className="tab-content tab-content--members">
            <p className="members-title">Участники:</p>
            {executors.map((executor, index) => (
              <div key={executor.id} className="members-row">
                <UserOutlined className="members-icon" />
                <span className="members-name">
                  {executor.role} — {executor.author}
                </span>
                {index > 0 ? (
                  <Button className="members-remove" onClick={() => removeExecutor(executor.id)}>
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
        </TabPane>
      </Tabs>

      <AddExecutorModal
        open={isAddExecutorModalVisible}
        onClose={() => setAddExecutorModalVisible(false)}
        filterRoles={['Сетевой инженер', 'Инженер СМР']}
        onSelect={(id) => {
          const { users } = useUserStore.getState();
          const user = users.find((u) => u.id === id);
          if (user) {
            addExecutor({ id: user.id, author: user.name, role: user.name });
          }
          setAddExecutorModalVisible(false);
        }}
      />

      <TimeIntervalModal
        open={isCustomModal}
        onCancel={() => setCustomModal(false)}
        onOk={(val) => {
          setSelectedTimeInterval(val);
          const [s, e] = val.split('–');
          onWorkTimeChange({ start: s, end: e });
          setCustomModal(false);
        }}
      />
    </>
  );
};
export default PprEditorTabs;
