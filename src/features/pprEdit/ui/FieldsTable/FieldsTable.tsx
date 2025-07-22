/**
 * Табличное представление введённых значений с возможностью
 * редактирования и удаления строк.
 *
 */
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import React from 'react';

import type { FieldCfg } from '@/features/pprEdit/model/types';
import './FieldsTable.css';

interface Props {
  rootFields: FieldCfg[];
  data: Record<string, any>[];
  onEdit: (rowIndex: number) => void;
  onDelete: (rowIndex: number) => void;
}

/**
 *
 * @param rootFields  — массив конфигураций полей, по которым строятся колонки таблицы
 * @param data        — массив объектов, содержащих значения полей для каждой строки
 * @param onEdit      — колбэк, вызываемый при нажатии на иконку «редактировать»
 * @param onDelete    — колбэк, вызываемый при нажатии на иконку «удалить»
 */

export const FieldsTable: React.FC<Props> = ({ rootFields, data, onEdit, onDelete }) => {
  /**
   * Формирует уникальный и отсортированный список колонок для таблицы.
   *  Сортирует поля по значению `position` (возрастание).
   *  Убирает дубликаты по `key`, оставляя только первое встреченное.
   * @param rootFields — исходный массив конфигураций полей
   * @returns массив уникальных значений, отсортированных по `position`
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

  return (
    <div className="dyf-table-container">
      <div className="dyf-table-scroll">
        <table className="dyf-table dyf-table--multi">
          <thead>
            <tr>
              <th>#</th>
              {sortedRootColumns.map((col) => (
                <th key={col.key}>{col.name}</th>
              ))}
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={sortedRootColumns.length + 2} style={{ textAlign: 'center' }}>
                  Нет записей
                </td>
              </tr>
            )}
            {data.map((row, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                {sortedRootColumns.map((col) => {
                  const rawValue = row[col.key];
                  if (col.widget === 'group') {
                    const groupObj = rawValue as Record<string, any> | undefined;
                    const text = groupObj ? Object.values(groupObj).join(', ') : '';
                    return <td key={col.key}>{text}</td>;
                  }
                  if (Array.isArray(rawValue)) {
                    return <td key={col.key}>{(rawValue as any[]).join(', ')}</td>;
                  }
                  return <td key={col.key}>{rawValue ?? ''}</td>;
                })}
                <td className="dyf-cell-actions">
                  <EditOutlined onClick={() => onEdit(idx)} />
                  <DeleteOutlined onClick={() => onDelete(idx)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
