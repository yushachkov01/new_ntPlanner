/**
 * Модалка «Добавить исполнителя»
 */
import { Modal, Spin, Tabs } from 'antd';
import React, { useEffect } from 'react';

import { executorStore } from '@/entities/executor/model/store/executorStore';
import ExecList from '@features/pprEdit/ui/executorSelect/ui/ExecList.tsx';
import './AddExecutorModal.css';

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (id: number) => void;
}

const AddExecutorModal: React.FC<Props> = ({ open, onClose, onSelect }) => {
  const { roles, executors, loadRoles, loadByRole } = executorStore();
  /**
   * загружаем роли один раз при открытии
   */
  useEffect(() => {
    if (open && roles.length === 0) loadRoles();
  }, [open]);
  /**
   * если есть роли – подтягиваем первую вкладку
   */
  useEffect(() => {
    if (open && roles[0]) loadByRole(roles[0]);
  }, [open, roles]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Добавить исполнителя"
      rootClassName="add-executor-modal"
    >
      {roles.length === 0 ? (
        <Spin />
      ) : (
        <Tabs
          items={roles.map((role) => ({
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
