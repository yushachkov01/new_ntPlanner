import { Modal, Spin, Tabs, List, Button } from 'antd';
import React, { useEffect, useMemo } from 'react';

import { useUserStore } from '@/entities/users/model/store/userStore';
import './AddExecutorModal.css';

/**
 * Props для модального окна добавления исполнителя
 * @property open — флаг, открыто ли модальное окно
 * @property onClose — колбэк при закрытии окна
 * @property onSelect — колбэк при выборе исполнителя (id)
 * @property filterRoles — список ролей, которые нужно отобразить (если не задано — все)
 */
interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
  filterRoles?: string[];
}

const { TabPane } = Tabs;
/**
 * Модальное окно для выбора исполнителя по ролям
 */
const AddExecutorModal: React.FC<Props> = ({ open, onClose, onSelect, filterRoles = [] }) => {
  /** Загрузка ролей и исполнителей из zustand-стора */
  const { users, roles, load, loading, error } = useUserStore();

  /**
   * загрузить список ролей
   */
  useEffect(() => {
    if (open && roles.length === 0) {
      load();
    }
  }, [open, roles.length, load]);

  /**
   * Мемоизированный список ролей для вкладок
   * если передан filterRoles — показываем только эти роли,
   * иначе — все роли из стора.
   */
  const visibleRoles = useMemo(
    () => (filterRoles.length > 0 ? roles.filter((r) => filterRoles.includes(r.name)) : roles),
    [roles, filterRoles],
  );

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Добавить исполнителя"
      rootClassName="add-executor-modal"
    >
      {loading ? (
        <Spin />
      ) : error ? (
        <div style={{ color: 'red' }}>{error.message}</div>
      ) : (
        <Tabs>
          {visibleRoles.map((role) => (
            <TabPane tab={role.name} key={role.id}>
              <List
                dataSource={users.filter((u) => u.roleId === role.id)}
                renderItem={(user) => (
                  <List.Item>
                    <Button
                      type="text"
                      className="add-executor-modal__tabs"
                      onClick={() => {
                        onSelect(user.id);
                        onClose();
                      }}
                    >
                      {user.name}
                    </Button>
                  </List.Item>
                )}
              />
            </TabPane>
          ))}
        </Tabs>
      )}
    </Modal>
  );
};

export default AddExecutorModal;
