/**
 * Табличное представление введённых значений.
 */
import type { FormInstance } from 'antd';
import { Form } from 'antd';
import React from 'react';

import type { FieldCfg } from '@/features/pprEdit/model/types';

interface Props {
  /** флаг режима переключения */
  switching: boolean;
  /** массив групп */
  groups: { key: string; name: string }[];
  /** поля, сгруппированные по ключам групп */
  groupFields: Record<string, FieldCfg[]>;
  /** корневые поля для простого режима */
  rootFields: FieldCfg[];
  /** инстанс формы для получения значений */
  form: FormInstance;
}

/**
 * Компонент отображает таблицу со значениями из формы.
 *
 * @param switching    — Переключение
 * @param groups       — метаданные групп (ключ и отображаемое имя)
 * @param groupFields  — настройки полей по группам
 * @param rootFields   — настройки полей в простом режиме
 * @param form         — инстанс Ant Form для чтения полей
 */
export const FieldsTable: React.FC<Props> = ({
  switching,
  groups,
  groupFields,
  rootFields,
  form,
}) => {
  const allValues = Form.useWatch([], form) as Record<string, any>;

  /**
   * Получает значение в объекте allValue
   * @param path — массив ключей для доступа к значению
   */
  const getVal = (path: string[]) => {
    const raw = path.reduce<any>((acc, k) => (acc ? acc[k] : undefined), allValues);
    if (Array.isArray(raw)) return raw.join(', ');
    return raw ?? '';
  };

  /** режим переключения: две колонки **/
  if (switching && groups.length === 2) {
    const [formGroup, toGroup] = groups;
    const rows = Math.max(groupFields[formGroup.key]?.length || 0, groupFields[toGroup.key]?.length || 0);

    return (
      <table className="dyf-table">
        <thead>
          <tr>
            <th>#</th>
            <th>{`Переключаем с: ${formGroup.name}`}</th>
            <th>{`Переключаем на: ${toGroup.name}`}</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => {
            const fA = groupFields[formGroup.key]?.[i];
            const fB = groupFields[toGroup.key]?.[i];
            return (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{fA ? getVal([formGroup.key, fA.key]) : ''}</td>
                <td>{fB ? getVal([toGroup.key, fB.key]) : ''}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  /** простой режим: одна колонка значений */
  return (
    <table className="dyf-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Значение</th>
        </tr>
      </thead>
      <tbody>
        {rootFields.map((f, i) => (
          <tr key={f.key}>
            <td>{i + 1}</td>
            <td>{getVal([f.key])}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
