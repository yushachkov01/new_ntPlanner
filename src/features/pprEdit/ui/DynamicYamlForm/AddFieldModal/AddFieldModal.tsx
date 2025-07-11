import { Modal, Form, Select, Input, Radio } from 'antd';
import React from 'react';

import type { Widget } from '@features/pprEdit/model/types.ts';

const { Option } = Select;

interface Props {
  open: boolean;
  targetGroup: string;
  groups: { key: string; name: string }[];
  draft: { widget?: Widget; key?: string; name?: string; options?: string };
  onChange: (upd: Partial<typeof draft>) => void;
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
        <Form.Item label="Тип поля" required>
          <Select value={draft.widget} onChange={(w) => onChange({ widget: w as Widget })}>
            {['input', 'textarea', 'dropdown', 'checkbox'].map((w) => (
              <Option key={w} value={w}>
                {w}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="key" required>
          <Input value={draft.key} onChange={(e) => onChange({ key: e.target.value })} />
        </Form.Item>
        <Form.Item label="name" required>
          <Input value={draft.name} onChange={(e) => onChange({ name: e.target.value })} />
        </Form.Item>
        {draft.widget === 'dropdown' && (
          <Form.Item label="options (через запятую)" required>
            <Input value={draft.options} onChange={(e) => onChange({ options: e.target.value })} />
          </Form.Item>
        )}

        {groups.length > 0 && (
          <Form.Item label="Куда добавить?">
            <Radio.Group value={targetGroup}>
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
