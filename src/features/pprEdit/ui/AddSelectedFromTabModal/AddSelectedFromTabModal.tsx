import { Modal, Tabs, List, Empty, Button } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import '@/features/pprEdit/ui/AddExecutorModal/AddExecutorModal.css';

interface Candidate {
  id: number | string;
  author?: string;
  fio?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  role?: string | { name: string };
  roleId?: number;
}
/**
 * Props для модального окна добавления исполнителя ИЗ таба «Исполнители»
 * @property open — флаг, открыто ли модальное окно
 * @property onClose — колбэк при закрытии окна
 * @property onSelect — колбэк при выборе исполнителя (id)
 * @property candidates — ровно те участники, которых выбрали во вкладке «Исполнители»
 */
interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (id: number | string) => void;
  /** кандидаты — ровно те, что выбраны в табе «Исполнители» */
  candidates: Candidate[];
}

const { TabPane } = Tabs;

const ROLE_NET = 'Сетевой инженер';
const ROLE_SMR = 'Инженер СМР';
const ROLE_CUST = 'Представитель Заказчика';
const ROLES_ORDER = [ROLE_NET, ROLE_SMR, ROLE_CUST] as const;

const normalizeAuthor = (u: Candidate): string => {
  const candidate =
    u?.author ?? u?.fio ?? u?.name ?? `${u?.last_name ?? ''} ${u?.first_name ?? ''}`.trim();
  return candidate && candidate.length > 0 ? candidate : `User ${u?.id ?? ''}`;
};

const normalizeRole = (u: Candidate): string => {
  if (u?.role && typeof u.role === 'object' && 'name' in u.role) {
    return String((u.role as any).name);
  }
  if (typeof u?.role === 'string') return u.role;
  return '';
};
const AddSelectedFromTabModal: React.FC<Props> = ({ open, onClose, onSelect, candidates = [] }) => {
  /** Группировка кандидатов по роли */
  const buckets = useMemo(() => {
    const map: Record<string, Candidate[]> = {
      [ROLE_NET]: [],
      [ROLE_SMR]: [],
      [ROLE_CUST]: [],
    };
    for (const candidate of candidates) {
      const role = normalizeRole(candidate);
      if (role && map[role]) map[role].push(candidate);
    }
    return map;
  }, [candidates]);

  /** активная вкладка с учётом наличия людей */
  const [activeRole, setActiveRole] = useState<string>(ROLE_NET);
  useEffect(() => {
    if (!open) return;
    const firstWithPeople = ROLES_ORDER.find((r) => (buckets[r] ?? []).length > 0) ?? ROLE_NET;
    setActiveRole(firstWithPeople);
  }, [open, buckets]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Добавить исполнителя"
      rootClassName="add-executor-modal"
      destroyOnClose={false}
      maskClosable
    >
      <Tabs activeKey={activeRole} onChange={setActiveRole}>
        {ROLES_ORDER.map((roleName) => {
          const list = buckets[roleName] ?? [];
          return (
            <TabPane tab={roleName} key={roleName}>
              {list.length === 0 ? (
                <Empty description="Нет доступных исполнителей" />
              ) : (
                <List
                  dataSource={list}
                  rowKey={(candidate) => String(candidate.id)}
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
                        {normalizeAuthor(user)}
                      </Button>
                    </List.Item>
                  )}
                />
              )}
            </TabPane>
          );
        })}
      </Tabs>
    </Modal>
  );
};

export default AddSelectedFromTabModal;
