/**
 * Табличное представление введённых значений.
 */
import type { FormInstance } from 'antd';
import { Form } from 'antd';
import React from 'react';

import type { FieldCfg } from '@/features/pprEdit/model/types';
import { toArray } from '@/features/pprEdit/ui/DynamicYamlForm/helpers/toArray';

/**
 * Информация о группе для заголовков колонок
 */
interface GroupInfo {
  key: string;
  name: string;
}

/**
 * Свойства компонента FieldsTable
 * @property groups — массив групп { key, name }
 * @property groupFields — объект, где для каждой группы — массив конфигов полей
 * @property rootFields — массив корневых полей
 * @property form — экземпляр FormInstance для чтения значений
 */
interface Props {
  groups: GroupInfo[];
  groupFields: Record<string, FieldCfg[]>;
  /** корневые поля для простого режима */
  rootFields: FieldCfg[];
  /** инстанс формы для получения значений */
  form: FormInstance;
}

/**
 * Компонент для табличного отображения введённых значений.
 */
const FieldsTable: React.FC<Props> = ({ groups, groupFields, rootFields, form }) => {
  const allFormValues = Form.useWatch([], form) ?? {};

  /**
   * Отсортированные колонки (поле) для простого режима:
   * убираем дубликаты по key, сортируем по position
   */
  const sortedRootColumns = React.useMemo(() => {
    const uniqueColumns = new Map<string, FieldCfg>();
    [...rootFields]
      .sort((fieldA, fieldB) => (fieldA.position ?? 0) - (fieldB.position ?? 0))
      .forEach((fieldConfig) => {
        if (!uniqueColumns.has(fieldConfig.key)) {
          uniqueColumns.set(fieldConfig.key, fieldConfig);
        }
      });
    return [...uniqueColumns.values()];
  }, [rootFields]);

  /**
   * Максимальное число строк:
   * смотрим, какая из групп длиннее
   */
  const maxSimpleRows = React.useMemo(
    () =>
      groups.reduce((maxCount, groupInfo) => {
        const lengthForGroup = groupFields[groupInfo.key]?.length ?? 0;
        return Math.max(maxCount, lengthForGroup);
      }, 0),
    [groups, groupFields],
  );

  /**
   * Получает значение из allFormValues по пути namePath
   * @param namePath — массив ключей вложенности
   */
  const getValueByPath = (namePath: string[]): string => {
    const rawValue = namePath.reduce<any>(
      (accumulator, key) => (accumulator ? accumulator[key] : undefined),
      allFormValues,
    );
    return Array.isArray(rawValue) ? rawValue.join(', ') : (rawValue ?? '');
  };

  /**
   * Формирует строку для ячейки:
   * если поле — группа, объединяет значения её дочерних полей,
   * иначе — просто выводит значение
   */
  const getCellValue = (columnConfig: FieldCfg): string =>
    columnConfig.widget === 'group'
      ? toArray(columnConfig)
          .map((childField) => getValueByPath([columnConfig.key, childField.key]))
          .filter(Boolean)
          .join(', ')
      : getValueByPath([columnConfig.key]);

  return (
    <div className="dyf-table-container">
      <div className="dyf-table-scroll">
        <table className="dyf-table dyf-table--multi">
          <thead>
            <tr>
              <th>#</th>
              {sortedRootColumns.map((colCfg) => (
                <th key={colCfg.key}>{colCfg.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.max(1, maxSimpleRows) }).map((_, rowIdx) => (
              <tr key={rowIdx}>
                <td>{rowIdx + 1}</td>
                {sortedRootColumns.map((colCfg) => (
                  <td key={colCfg.key}>{rowIdx === 0 ? getCellValue(colCfg) : ''}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { FieldsTable };
