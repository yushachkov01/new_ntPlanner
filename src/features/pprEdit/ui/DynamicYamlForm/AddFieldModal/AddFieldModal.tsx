/**
 * Модалка добавления нового поля (input only) с выбором группы.
 */
import { Modal, Form, Input, Radio } from 'antd';
import React from 'react';

interface Props {
  open: boolean;
  targetGroup: string;
  groups: { key: string; name: string }[];
  draft: { key?: string; name?: string };
  onChange: (upd: Partial<typeof draft>) => void;
  onGroupChange: (groupKey: string) => void;
  onAdd: () => void;
  onClose: () => void;
}

/**
 * Общая модалка для добавления нового поля в форму.
 *
 * @param open            — флаг, открыта ли модалка
 * @param targetGroup     — ключ группы, в которую добавится поле
 * @param groups          — массив доступных групп { key, name }
 * @param draft           — текущие значения формы (widget, key, name, options)
 * @param onChange        — при изменении любого поля формы draft
 * @param onAdd           — колбэк при подтверждении добавления (OK)
 * @param onClose         — колбэк при закрытии модалки (Cancel или клик по крестику)
 */
export function AddFieldModal({
  open,
  targetGroup,
  groups,
  draft,
  onChange,
  onGroupChange,
  onAdd,
  onClose,
}: Props) {
  return (
    <Modal
      title="Параметры нового поля"
      open={open}
      onOk={onAdd}
      okText="Добавить"
      cancelText="Отмена"
      onCancel={onClose}
    >
      <Form layout="vertical">
        <Form.Item label="Заголовок" required>
          <Input
            value={draft.key}
            onChange={(e) => onChange({ key: e.target.value })}
            placeholder="Введите заголовок"
          />
        </Form.Item>
        <Form.Item label="Название" required>
          <Input
            value={draft.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Введите значение по умолчанию"
          />
        </Form.Item>

        {groups.length > 0 && (
          <Form.Item label="Куда добавить?">
            <Radio.Group value={targetGroup} onChange={(e) => onGroupChange(e.target.value)}>
              {groups.map((g) => (
                <Radio key={g.key} value={g.key}>
                  {g.name}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}
