import { Modal, Spin, Tabs } from 'antd';
import React, { useEffect, useMemo } from 'react';

import { executorStore } from '@/entities/executor/model/store/executorStore';
import ExecList from '@features/pprEdit/ui/executorSelect/ui/ExecList';
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
  onSelect: (id: number) => void;
  filterRoles?: string[];
}

/**
 * Модальное окно для выбора исполнителя по ролям
 */
const AddExecutorModal: React.FC<Props> = ({ open, onClose, onSelect, filterRoles = [] }) => {
  /** Загрузка ролей и исполнителей из zustand-стора */
  const { roles, executors, loadRoles, loadByRole } = executorStore();

  /**
   * загрузить список ролей
   */
  useEffect(() => {
    if (open && roles.length === 0) {
      loadRoles();
    }
  }, [open, roles, loadRoles]);

  /**
   * Мемоизированный список ролей для вкладок:
   * если передан filterRoles — показываем только эти роли,
   * иначе — все роли из стора.
   */
  const visibleRoles = useMemo(() => {
    return filterRoles.length ? roles.filter((roleName) => filterRoles.includes(roleName)) : roles;
  }, [roles, filterRoles]);

  /**
   * при открытии окна и наличии видимых ролей —
   * автоматически подгружаем исполнителей первой вкладки
   */
  useEffect(() => {
    if (open && visibleRoles.length > 0) {
      loadByRole(visibleRoles[0]);
    }
  }, [open, visibleRoles, loadByRole]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Добавить исполнителя"
      rootClassName="add-executor-modal"
    >
      {visibleRoles.length === 0 ? (
        <Spin />
      ) : (
        <Tabs
          onChange={loadByRole}
          items={visibleRoles.map((role) => ({
            key: role,
            label: role,
            children: (
              <ExecList
                data={executors[role]}
                onLoad={() => loadByRole(role)}
                onSelect={onSelect}
              />
            ),
          }))}
        />
      )}
    </Modal>
  );
};

export default AddExecutorModal;
