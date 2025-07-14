/**
 * вкладки: «Карта работ», «Сетевое оборудование», «Исполнители»
 */

import { PlusOutlined, UserOutlined, CloseOutlined } from '@ant-design/icons';
import { Tabs, Select, Typography, Checkbox, Button } from 'antd';
import React, { useState, useMemo } from 'react';

import type { Executor } from '@/entities/executor/model/store/executorStore';
import { executorStore } from '@/entities/executor/model/store/executorStore';
import { PlannedTaskStore } from '@/entities/PlannedTask/model/store/plannedTaskStore';
import { userStore } from '@/entities/user/model/store/UserStore';
import AddExecutorModal from '@/features/pprEdit/ui/AddExecutorModal/AddExecutorModal';
import { TimeIntervalModal } from '@/features/pprEdit/ui/timePicker/TimeIntervalModal';
import './PprEditorTabs.css';

const { TabPane } = Tabs;
const { Text, Link } = Typography;

export const PRESET_TIMES = [
  { value: '23:00–06:00', label: 'Ночная смена 23:00 – 06:00' },
  { value: '00:00–08:00', label: 'Ночная смена 00:00 – 08:00' },
  { value: '09:00–18:00', label: 'День 09:00 – 18:00' },
  { value: '__custom__', label: 'Свой интервал…' },
] as const;

interface Props {
  taskId: string;
  /** Колбэк для передачи выбранного окна в родительский компонент */
  onWorkTimeChange: (interval: { start: string; end: string }) => void;
}

const PprEditorTabs: React.FC<Props> = ({ taskId, onWorkTimeChange }) => {
  /**
   *  Запрашиваем выбранную план-задачу по её id из zustand-стора
   */
  const task = PlannedTaskStore((s) => s.tasks.find((t) => t.id === taskId));
  /**
   *  Берём текущего залогиненного пользователя
   */
  const user = userStore((s) => s.user);
  if (!task || !user) return null;

  /**
   * список исполнителей
   */
  const [added, setAdded] = useState<Executor[]>([
    { id: user.id, role: user.role, author: user.author },
  ]);
  /**
   *  Флаг-state: открыта ли модалка «Добавить исполнителя»
   */
  const [modal, setModal] = useState(false);
  const addToStore = executorStore((s) => s.addExecutor);
  /**
   *  исполнители, сгруппированные по ролям
   */
  const { executors } = executorStore();
  /**
   * текущее «окно работ» (строкой HH:mm–HH:mm)
   */
  const [interval, setInterval] = useState<string>(task.time_work);
  /**
   * Флаг-state: открыта ли модалка «Свой интервал…»
   */
  const [modalOpen, setModalOpen] = useState(false);
  const timeOptions = useMemo(() => {
    const setVals = new Set(PRESET_TIMES.map((t) => t.value));
    setVals.add(interval);
    return Array.from(setVals).map((v) => {
      const preset = PRESET_TIMES.find((p) => p.value === v);
      return { value: v, label: preset?.label ?? v };
    });
  }, [interval]);

  const equipmentItems = useMemo(
    () => task.equipment.split(',').map((s) => s.trim()),
    [task.equipment],
  );
  const [selectedEquip, setSelectedEquip] = useState<string[]>(equipmentItems);

  /**
   * добавить исполнителя
   */
  const addExec = (id: number) => {
    const found = Object.values(executors)
      .flat()
      .find((e) => e.id === id);
    if (found && !added.find((a) => a.id === id)) {
      setAdded((prev) => [...prev, found]);
      addToStore(found);
    }
  };
  const delExec = (id: number) => setAdded((prev) => prev.filter((e) => e.id !== id));

  /** при выборе селекта времени */
  const handleTimeSelect = (val: string) => {
    if (val === '__custom__') {
      setModalOpen(true);
    } else {
      setInterval(val);
      const [start, end] = (val as string).split('–');
      onWorkTimeChange({ start, end });
    }
  };

  return (
    <>
      <Tabs defaultActiveKey="1" className="ppr-editor-tabs">
        <TabPane tab="Карта работ" key="1">
          <div className="tab-content tab-content--work">
            <div>
              <p>
                <Text>Описание:&nbsp;</Text>
                <Text strong>{task.description}</Text>
              </p>
              <p className="tab-content-project">
                <Text>Проект:&nbsp;</Text>
                {task.project}
              </p>
              <div className="tab-links">
                <Link href={task.rm} target="_blank">
                  Перейти к задаче в Redmine
                </Link>
                <Link href={task.rd} target="_blank">
                  Перейти к РД
                </Link>
              </div>
            </div>
            <div className="tab-content__right">
              <p>Время проведения работ:</p>
              <Select
                style={{ width: 200 }}
                value={interval}
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
              {equipmentItems.map((eq) => (
                <li key={eq} className="equipment-item">
                  <Checkbox
                    checked={selectedEquip.includes(eq)}
                    onChange={(e) =>
                      setSelectedEquip((prev) =>
                        e.target.checked ? [...prev, eq] : prev.filter((i) => i !== eq),
                      )
                    }
                  />
                  <span className="equipment-name">{eq}</span>
                </li>
              ))}
            </ul>

            <Button
              className="selected-equip-survey"
              type="primary"
              disabled={selectedEquip.length === 0}
              onClick={() => console.log('Опрос:', selectedEquip)}
            >
              Провести опрос
            </Button>
          </div>
        </TabPane>
        <TabPane tab="Исполнители" key="3">
          <div className="tab-content tab-content--members">
            <p className="members-title">Участники:</p>
            {added.map((exec, i) => (
              <div key={exec.id} className="members-row">
                <UserOutlined className="members-icon" />

                <span className="members-name">
                  {exec.role} — {exec.author}
                </span>

                {i > 0 && (
                  <Button className="members-remove" onClick={() => delExec(exec.id)}>
                    Удалить
                  </Button>
                )}
                {i === 0 && (
                  <Button className="yaml-executor-add-btn" onClick={() => setModal(true)}>
                    Добавить исполнителя
                  </Button>
                )}
              </div>
            ))}
          </div>
        </TabPane>
      </Tabs>
      <AddExecutorModal
        open={modal}
        onClose={() => setModal(false)}
        onSelect={(id) => {
          addExec(id);
          setModal(false);
        }}
      />
      <TimeIntervalModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={(value) => {
          setInterval(value);
          const [start, end] = value.split('–');
          onWorkTimeChange({ start, end });
          setModalOpen(false);
        }}
      />
    </>
  );
};
export default PprEditorTabs;
