import { Form, Button } from 'antd';
import React from 'react';

import type { FieldCfg } from '@/features/pprEdit/model/types';

import { FieldRenderer } from '../FieldRenderer/FieldRenderer';

interface Props {
  groups: { key: string; name: string }[];
  fields: Record<string, FieldCfg[]>;
  onAddClick: (groupKey: string) => void;
}

/**
 * Рендерит две колонки групповых полей и одну кнопку для добавления нового поля.
 *
 * @param groups — массив объектов с ключом и именем группы для переключения.
 * @param fields — словарь, где ключом является идентификатор группы, а значением — массив настроек полей.
 * @param onAddClick — callback, вызываемый при клике на кнопку добавления
 */
export default function SwitchingForm({ groups, fields, onAddClick }: Props) {
  const firstKey = groups[0]?.key || '';
  return (
    <>
      <div className="dyf__columns">
        {groups.map(({ key, name }, idx) => (
          <div key={key} className="dyf__col">
            <h4>
              {idx === 0 ? 'Переключаем с:' : 'Переключаем на:'} {name}
            </h4>
            <Form layout="vertical">
              {(fields[key] || []).map((f) => (
                <FieldRenderer key={f.key} field={f} path={[key]} />
              ))}
            </Form>
          </div>
        ))}
      </div>
      <div className="dyf__btn-wrap">
        <Button type="dashed" className="dyf__add-btn" onClick={() => onAddClick(firstKey)}>
          + Добавить поле
        </Button>
      </div>
    </>
  );
}
