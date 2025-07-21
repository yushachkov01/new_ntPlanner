/**
 * вкладки: «Карта работ», «Сетевое оборудование», «Исполнители»
 */
import { UserOutlined } from '@ant-design/icons';
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

/** Предустановленные интервалы времени */
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

/**
 * Компонент вкладок редактора PPR:
 * 1) Карта работ
 * 2) Сетевое оборудование
 * 3) Исполнители
 */
const PprEditorTabs: React.FC<Props> = ({ taskId, onWorkTimeChange }) => {
  /** Получаем задачу по ID */
  const selectedTask = PlannedTaskStore((store) => store.tasks.find((task) => task.id === taskId));
  /** Текущий пользователь */
  const currentUser = userStore((store) => store.user);
  if (!selectedTask || !currentUser) return null;

  /** Список добавленных исполнителей */
  const [selectedExecutors, setSelectedExecutors] = useState<Executor[]>([
    { id: currentUser.id, role: currentUser.role, author: currentUser.author },
  ]);
  /** Флаг: открыта ли модалка добавления исполнителя */
  const [isAddExecutorModalVisible, setAddExecutorModalVisible] = useState(false);
  /** Метод добавления исполнителя в стор */
  const addExecutorToStore = executorStore((store) => store.addExecutor);
  /** Все исполнители из стора, сгруппированные по ролям */
  const { executors: allExecutorsByRole } = executorStore();
  /** Текущее выбранное время работ (строка HH:mm–HH:mm) */
  const [selectedTimeInterval, setSelectedTimeInterval] = useState<string>(selectedTask.time_work);
  /** Флаг: открыта ли модалка ввода своего интервала */
  const [isCustomIntervalModalVisible, setCustomIntervalModalVisible] = useState(false);

  /** Опции селекта времени: предустановленные + текущее значение */
  const timeSelectOptions = useMemo(() => {
    const valuesSet = new Set(PRESET_TIMES.map((item) => item.value));
    valuesSet.add(selectedTimeInterval);
    return Array.from(valuesSet).map((value) => {
      const preset = PRESET_TIMES.find((item) => item.value === value);
      return { value, label: preset?.label ?? value };
    });
  }, [selectedTimeInterval]);

  /** Список оборудования из задачи */
  const equipmentList = useMemo(
    () => selectedTask.equipment.split(',').map((equip) => equip.trim()),
    [selectedTask.equipment],
  );
  /** Выбранное оборудование */
  const [currentlySelectedEquipment, setCurrentlySelectedEquipment] =
    useState<string[]>(equipmentList);

  /**
   * Добавление исполнителя
   */
  const handleAddExecutor = (executorId: number) => {
    const found = Object.values(allExecutorsByRole)
      .flat()
      .find((exec) => exec.id === executorId);
    if (found && !selectedExecutors.find((e) => e.id === executorId)) {
      setSelectedExecutors((prev) => [...prev, found]);
      addExecutorToStore(found);
    }
  };
  /** Удаление исполнителя из списка */
  const handleRemoveExecutor = (executorId: number) => {
    setSelectedExecutors((prev) => prev.filter((e) => e.id !== executorId));
  };

  /**
   * Обработка выбора времени из селекта:
   * "__custom__" — открыть модалку,
   * иначе — обновить state и вызвать колбэк.
   */
  const handleTimeSelect = (value: string) => {
    if (value === '__custom__') {
      setCustomIntervalModalVisible(true);
    } else {
      setSelectedTimeInterval(value);
      const [start, end] = value.split('–');
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
                <Text strong>{selectedTask.description}</Text>
              </p>
              <p className="tab-content-project">
                <Text>Проект:&nbsp;</Text>
                {selectedTask.project}
              </p>
              <div className="tab-links">
                <Link href={selectedTask.rm} target="_blank">
                  Перейти к задаче в Redmine
                </Link>
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
                options={timeSelectOptions}
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
                    checked={currentlySelectedEquipment.includes(equipment)}
                    onChange={(evt) =>
                      setCurrentlySelectedEquipment((prev) =>
                        evt.target.checked
                          ? [...prev, equipment]
                          : prev.filter((item) => item !== equipment),
                      )
                    }
                  />
                  <span className="equipment-name">{equipment}</span>
                </li>
              ))}
            </ul>
            <Button
              className="selected-equip-survey"
              type="primary"
              disabled={currentlySelectedEquipment.length === 0}
              onClick={() => console.log('Опрос:', currentlySelectedEquipment)}
            >
              Провести опрос
            </Button>
          </div>
        </TabPane>
        <TabPane tab="Исполнители" key="3">
          <div className="tab-content tab-content--members">
            <p className="members-title">Участники:</p>
            {selectedExecutors.map((executor, index) => (
              <div key={executor.id} className="members-row">
                <UserOutlined className="members-icon" />
                <span className="members-name">
                  {executor.role} — {executor.author}
                </span>
                {index > 0 ? (
                  <Button
                    className="members-remove"
                    onClick={() => handleRemoveExecutor(executor.id)}
                  >
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
        onSelect={(id) => {
          handleAddExecutor(id);
          setAddExecutorModalVisible(false);
        }}
      />

      <TimeIntervalModal
        open={isCustomIntervalModalVisible}
        onCancel={() => setCustomIntervalModalVisible(false)}
        onOk={(value) => {
          setSelectedTimeInterval(value);
          const [start, end] = value.split('–');
          onWorkTimeChange({ start, end });
          setCustomIntervalModalVisible(false);
        }}
      />
    </>
  );
};
export default PprEditorTabs;
