/**
 * Рендерит поле по его конфигурации.
 * Если передан onRemove — показываем кнопку удаления в label.
 */
import { Form, Input, Select, Switch } from 'antd';

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
 * @param path — массив сегментов пути до этого поля в форме
 * @param onRemove — колбэк, вызываемый при клике на иконку удаления
 */
export function FieldRenderer({ field, path = [], onRemove }: Props) {
  /** Формируем уникальный массив сегментов пути для Form.Item name */
  const namePath = [...path, field.key];
  /** Общий стиль для всех полей */
  const inputStyle = { maxWidth: 250 };
  switch (field.widget) {
    case 'input':
      return (
        <Form.Item
          key={namePath.join('.')}
          label={field.name}
          name={namePath}
          initialValue={field.defaultValue}
        >
          <Input style={inputStyle} />
        </Form.Item>
      );

    case 'textarea':
      return (
        <Form.Item key={namePath.join('.')} label={field.name} name={namePath}>
          <TextArea rows={3} style={inputStyle} />
        </Form.Item>
      );

    case 'dropdown':
      return (
        <Form.Item key={namePath.join('.')} label={field.name} name={namePath}>
          <Select mode="multiple" placeholder={`Выберите ${field.name}`} style={inputStyle}>
            {field.options?.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </Form.Item>
      );

    case 'checkbox':
      return (
        <Form.Item
          key={namePath.join('.')}
          label={field.name}
          name={namePath}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      );

    case 'group':
      return (
        <div key={namePath.join('.')} className="dyf__group">
          <h4>{field.name}</h4>
          <div className="field-group__row">
            {toArray(field).map((childField) => (
              <FieldRenderer
                key={childField.key}
                field={childField}
                path={namePath}
                onRemove={onRemove}
              />
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
}
