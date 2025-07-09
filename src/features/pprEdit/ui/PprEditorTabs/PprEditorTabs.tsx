/**
 * вкладки: «Карта работ», «Сетевое оборудование», «Исполнители»
 */

import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Tabs, Select, Typography, Checkbox, Button } from 'antd';
import React, { useState, useMemo } from 'react';

import { userStore } from '@/entities/user/model/store/UserStore';
import './PprEditorTabs.css';
import type { Executor } from '@entities/executor/model/store/executorStore.ts';
import { executorStore } from '@entities/executor/model/store/executorStore.ts';
import { PlannedTaskStore } from '@entities/PlannedTask/model/store/plannedTaskStore.ts';
import AddExecutorModal from '@features/pprEdit/ui/AddExecutorModal/AddExecutorModal.tsx';
import { TimeIntervalModal } from '@features/pprEdit/ui/timePicker/TimeIntervalModal.tsx';

const { TabPane } = Tabs;
const { Text, Link } = Typography;

const PRESET_TIMES = [
  { value: '23:00–06:00', label: 'Ночная смена 23:00 – 06:00' },
  { value: '00:00–08:00', label: 'Ночная смена 00:00 – 08:00' },
  { value: '09:00–18:00', label: 'День 09:00 – 18:00' },
  { value: '__custom__', label: 'Свой интервал…' },
] as const;

interface Props {
  taskId: string;
}

export const PprEditorTabs: React.FC<Props> = ({ taskId }) => {
  /**
   *  Запрашиваем выбранную план-задачу по её id из zustand-стора
   */
  const task = PlannedTaskStore((s) => s.tasks.find((t) => t.id === taskId));
  /**
   *  Берём текущего залогиненного пользователя
   */
  const user = userStore((s) => s.user);
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
  /**
   * добавить исполнителя (если ещё нет в списке)
   */
  const addExec = (id: number) => {
    const found = Object.values(executors)
      .flat()
      .find((e) => e.id === id);
    if (found && !added.find((a) => a.id === id)) {
      setAdded((prev) => [...prev, found]);
    }
  };

  if (!task || !user) return null;

  /** список опций Select c уникальными value */
  const timeOptions = useMemo(() => {
    const set = new Set<string>(PRESET_TIMES.map((t) => t.value));
    set.add(interval);
    return Array.from(set).map((v) => {
      const preset = PRESET_TIMES.find((p) => p.value === v);
      return {
        value: v,
        label: preset?.label ?? v,
      };
    });
  }, [interval]);

  const equipmentItems = useMemo(
    () => task.equipment.split(',').map((s) => s.trim()),
    [task.equipment],
  );
  const [selectedEquip, setSelectedEquip] = useState<string[]>(equipmentItems);

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
                style={{ width: 210 }}
                placeholder="Окно работ"
                value={interval}
                options={timeOptions}
                onSelect={(val) => {
                  if (val === '__custom__') setModalOpen(true);
                  else setInterval(val as string);
                }}
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
                {i === 0 && (
                  <Button
                    className="members-add"
                    shape="circle"
                    icon={<PlusOutlined />}
                    onClick={() => setModal(true)}
                  />
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
          setModalOpen(false);
        }}
      />
    </>
  );
};
export default PprEditorTabs;
