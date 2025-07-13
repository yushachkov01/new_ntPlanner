/**
 * Рендерит поле по его конфигурации.
 * Если передан onRemove — показываем кнопку ужаления слева в label.
 */
import { DeleteOutlined } from '@ant-design/icons';
import { Form, Input, Select, Switch, Button } from 'antd';
import React from 'react';

import type { FieldCfg } from '@/features/pprEdit/model/types';

import { toArray } from '../helpers/toArray';

const { Option } = Select;
const { TextArea } = Input;

interface Props {
  /**
   * Конфигурация поля, описанная в YAML
   */
  field: FieldCfg;
  /**
   * Текущий путь до поля в форме,
   * используется для корректного имени
   */
  path?: string[];
  /**
   * onRemove — колбэк, вызываемый при клике на иконку удаления поля
   */
  onRemove?: () => void;
}

/**
 * Рендерит отдельное поле на основе его конфигурации.
 *
 * @param field — объект с описанием поля
 * @param path  — массив сегментов пути до этого поля в форме
 * @param onRemove — колбэк, вызываемый при клике на иконку удаления этого поля
 * @returns JSX-элемент соответствующего ant-поле или группу полей
 */
export function FieldRenderer({ field: f, path = [], onRemove }: Props) {
  /**
   * Формируем уникальный ключ и имя для Form.Item
   */
  const namePath = [...path, f.key];
  /**
   * Задаём максимальную ширину инпутов
   */
  const style = { maxWidth: 250 };
  switch (f.widget) {
    case 'input':
      return (
        <Form.Item
          key={namePath.join('.')}
          label={
            onRemove ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Button type="text" icon={<DeleteOutlined />} onClick={onRemove} />
                {f.name}
              </span>
            ) : (
              f.name
            )
          }
          name={namePath}
          initialValue={f.defaultValue}
        >
          <Input style={style} />
        </Form.Item>
      );

    case 'textarea':
      return (
        <Form.Item key={namePath.join('.')} label={f.name} name={namePath}>
          <TextArea rows={3} style={style} />
        </Form.Item>
      );

    case 'dropdown':
      return (
        <Form.Item key={namePath.join('.')} label={f.name} name={namePath}>
          <Select mode="multiple" placeholder={`Выберите ${f.name}`} style={style}>
            {f.options?.map((o) => (
              <Option key={o} value={o}>
                {o}
              </Option>
            ))}
          </Select>
        </Form.Item>
      );

    case 'checkbox':
      return (
        <Form.Item key={namePath.join('.')} label={f.name} name={namePath} valuePropName="checked">
          <Switch />
        </Form.Item>
      );

    case 'group':
      return (
        <div key={namePath.join('.')} className="dyf__group">
          <h4>{f.name}</h4>
          <div className="field-group__row">
            {toArray(f).map((child) => (
              <FieldRenderer key={child.key} field={child} path={namePath} onRemove={onRemove} />
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
}
