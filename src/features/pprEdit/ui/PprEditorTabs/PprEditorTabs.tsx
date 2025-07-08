import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Tabs, Button, Checkbox, Select, Typography } from 'antd';
import React from 'react';

import { usePlannedTaskStore } from '@entities/PlannedTask/model/store/plannedTaskStore';
import { userStore } from '@entities/user/model/store/UserStore';
import './PprEditorTabs.css';

const { TabPane } = Tabs;
const { Text, Link } = Typography;

interface Props {
  /** ID выбранной планируемой задачи */
  taskId: string;
}

/**
 * Компонент табов редактора ППР.
 * Показывает три вкладки: «Карта работ», «Сетевое оборудование», «Исполнители»
 */
const PprEditorTabs: React.FC<Props> = ({ taskId }) => {
  const user = userStore((s) => s.user);
  const { tasks } = usePlannedTaskStore();
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return null; // если вдруг нет — ничего не рендерим

  return (
    <Tabs defaultActiveKey="1" className="ppr-editor-tabs">
      <TabPane tab="Карта работ" key="1">
        <div className="tab-content tab-content--work">
          <div className="tab-content__left">
            <p>
              <Text>Описание: </Text>
              <Text strong>{task.description}</Text>
            </p>
            <p className="tab-content-project">
              <Text>Проект: </Text>
              <Text>{task.project}</Text>
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
              value={task.time_work}
              style={{ width: 160 }}
              options={[{ value: task.time_work, label: task.time_work }]}
            />
          </div>
        </div>
      </TabPane>

      <TabPane tab="Сетевое оборудование" key="2">
        <div className="tab-content tab-content--equipment">
          <p className="equipment-title">Задействовано оборудование:</p>
          <ul className="equipment-list">
            {task.equipment.split(',').map((eq) => (
              <li key={eq.trim()}>
                <Checkbox checked />
                <span>{eq.trim()}</span>
              </li>
            ))}
          </ul>
          <Button type="primary" className="equipment-btn">
            Провести опрос
          </Button>
        </div>
      </TabPane>

      <TabPane tab="Исполнители" key="3">
        <div className="tab-content tab-content--members">
          <p className="members-title">Участники:</p>
          <div className="members-row">
            <UserOutlined className="members-icon" />
            <Text>
              {user?.role} — {user?.author}
            </Text>
            <Button shape="circle" icon={<PlusOutlined />} className="members-add" />
          </div>
        </div>
      </TabPane>
    </Tabs>
  );
};

export default PprEditorTabs;
