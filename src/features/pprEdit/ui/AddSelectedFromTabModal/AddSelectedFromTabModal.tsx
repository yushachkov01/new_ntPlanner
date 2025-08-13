import { Modal, Tabs, List, Button, Empty } from 'antd';
import React, { useMemo } from 'react';
import '@/features/pprEdit/ui/AddExecutorModal/AddExecutorModal.css';

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
  candidates: Array<{
    id: number | string;
    author?: string;
    fio?: string;
    name?: string;
    first_name?: string;
    last_name?: string;
    role?: string | { name: string };
  }>;
}

const { TabPane } = Tabs;

const normalizeAuthor = (u: any): string => {
  const candidate =
    u?.author ?? u?.fio ?? u?.name ?? `${u?.last_name ?? ''} ${u?.first_name ?? ''}`.trim();
  return candidate && candidate.length > 0 ? candidate : `User ${u?.id ?? ''}`;
};

/**
 * Модальное окно выбора из списка исполнителей
 */
const AddSelectedFromTabModal: React.FC<Props> = ({ open, onClose, onSelect, candidates = [] }) => {
  /** Группировка кандидатов по роли */
  const groupedByRole = useMemo(() => {
    const map = new Map<string, any[]>();
    for (const u of candidates) {
      const roleName =
        (typeof (u as any)?.role === 'string' ? (u as any).role : (u as any)?.role?.name) ||
        'Сетевой инженер';
      if (!map.has(roleName)) map.set(roleName, []);
      map.get(roleName)!.push(u);
    }
    return map;
  }, [candidates]);

  const roleTabs = Array.from(groupedByRole.entries());

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Добавить исполнителя"
      rootClassName="add-executor-modal"
    >
      <Tabs>
        {roleTabs.length > 0 ? (
          roleTabs.map(([roleName, list]) => (
            <TabPane tab={roleName} key={roleName}>
              <List
                dataSource={list}
                renderItem={(user: any) => (
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
            </TabPane>
          ))
        ) : (
          <TabPane tab="Исполнители" key="__empty__">
            <Empty description="Нет доступных исполнителей" />
          </TabPane>
        )}
      </Tabs>
    </Modal>
  );
};

export default AddSelectedFromTabModal;
