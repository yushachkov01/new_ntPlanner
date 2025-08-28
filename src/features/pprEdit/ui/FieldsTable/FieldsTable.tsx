/**
 * Табличное представление введённых значений с возможностью
 * редактирования и удаления строк.
 *
 */
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import React from 'react';

import { usePlannedTaskStore } from '@/entities/PlannedTask/model/store/plannedTaskStore';
import type { FieldCfg } from '@/features/pprEdit/model/types';
import './FieldsTable.css';

interface Props {
  rootFields: FieldCfg[];
  data: Record<string, any>[];
  onEdit: (rowIndex: number) => void;
  /** Передаём и индекс, и __sourceKey, чтобы удалить */
  onDelete: (rowIndex: number, sourceKey?: string) => void;
  onDisplayTableChange?: (
    headers: string[],
    rows: string[][],
    sources: (string | undefined)[],
    colKeys: string[],
  ) => void;
}

/**
 * Возвращает  «id устройства -> отображаемое имя (hostname)».
 * Берёт список устройств из plannedTaskStore, строит карту и мемоизирует функцию.
 * @returns (value) => string — функция, которая по значению id вернёт имя
 */
function makeDeviceLabelResolver() {
  /** Достаём список устройств из стора (ожидается поле device) */
  const devices = usePlannedTaskStore((state) => state.device);

  return React.useMemo(() => {
    /** Карта соответствий: id -> label */
    const deviceLabelMap = new Map<string, string>();

    (devices ?? []).forEach((device) => {
      const deviceId = String((device as any)?.id);
      const deviceLabel = (device as any)?.hostname ?? deviceId;
      if (deviceId) deviceLabelMap.set(deviceId, deviceLabel);
    });

    /**
     * Резолвер id -> отображаемая строка
     * Params
     * - value: любое значение, приводимое к строке id
     */
    return (value: any) => {
      const idString = value == null ? '' : String(value);
      return deviceLabelMap.get(idString) ?? idString;
    };
  }, [devices]);
}

/**
 * Хук-форматтер значения ячейки в читабельный текст.
 * Params
 * - resolveDeviceLabel => — функция, которая по id вернёт имя устройства
 */
function useCellFormatter(resolveDeviceLabel: (v: any) => string) {
  return React.useCallback(
    (rawValue: any, column: Partial<FieldCfg>): string => {
      if (rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)) {
        const hasDeviceName =
          Object.prototype.hasOwnProperty.call(rawValue, 'device') &&
          Object.prototype.hasOwnProperty.call(rawValue, 'name');
        if (hasDeviceName) {
          const deviceLabel = resolveDeviceLabel(rawValue.device);
          const interfaceName = rawValue.name ?? '';
          const vlanId = rawValue.vlan ?? '';
          return [deviceLabel, interfaceName, vlanId ? `vlan ${vlanId}` : '']
            .filter(Boolean)
            .join(' / ');
        }
      }
      // «устройство»
      if (column?.type === '^device') return resolveDeviceLabel(rawValue);

      // Интерфейс с VLAN
      if (column?.type === 'interface_with_vlan') {
        const deviceLabel = rawValue?.device ? resolveDeviceLabel(rawValue.device) : '';
        const interfaceName = rawValue?.name ?? '';
        const vlanId = rawValue?.vlan ?? '';
        if (deviceLabel || interfaceName || vlanId) {
          return [deviceLabel, interfaceName, vlanId ? `vlan ${vlanId}` : '']
            .filter(Boolean)
            .join(' / ');
        }
      }

      // Интерфейс без VLAN
      if (column?.type === 'interface') {
        const deviceLabel = rawValue?.device ? resolveDeviceLabel(rawValue.device) : '';
        const interfaceName = rawValue?.name ?? '';
        if (deviceLabel || interfaceName) {
          return [deviceLabel, interfaceName].filter(Boolean).join(' / ');
        }
      }

      // Группа: объект, значения склеиваем запятыми
      if (
        column?.widget === 'group' &&
        rawValue &&
        typeof rawValue === 'object' &&
        !Array.isArray(rawValue)
      ) {
        return Object.values(rawValue).join(', ');
      }

      // Объект со стандартным видом { label, value }
      if (rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)) {
        if ('label' in rawValue || 'value' in rawValue) {
          return (rawValue as any).label ?? (rawValue as any).value ?? '';
        }
      }

      // Булево -> Да/Нет
      if (typeof rawValue === 'boolean') return rawValue ? 'Да' : 'Нет';

      // Массив значений -> строка через запятую (раскрываем label/value внутри объектов)
      if (Array.isArray(rawValue)) {
        return rawValue
          .map((item) =>
            typeof item === 'object' && item !== null
              ? ((item as any).label ?? (item as any).value ?? '')
              : String(item ?? ''),
          )
          .filter((textPiece) => textPiece !== '')
          .join(', ');
      }
      return rawValue ?? '';
    },
    [resolveDeviceLabel],
  );
}

function getColumnLabel(c: Partial<FieldCfg>): string {
  return String((c as any).label ?? (c as any).name ?? c.key ?? '').trim();
}
/**
 *
 * @param rootFields  — массив конфигураций полей, по которым строятся колонки таблицы
 * @param data        — массив объектов, содержащих значения полей для каждой строки
 * @param onEdit      — колбэк, вызываемый при нажатии на иконку «редактировать»
 * @param onDelete    — колбэк, вызываемый при нажатии на иконку «удалить»
 */
export const FieldsTable: React.FC<Props> = ({
  rootFields,
  data,
  onEdit,
  onDelete,
  onDisplayTableChange,
}) => {
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

  /** Функция для преобразования id устройства -> отображаемое имя */
  const resolveDeviceLabel = makeDeviceLabelResolver();

  /** Форматтер значения ячейки под разные типы колонок */
  const formatCellValue = useCellFormatter(resolveDeviceLabel);

  const displayHeaders = React.useMemo(
    () => sortedRootColumns.map((c) => getColumnLabel(c)),
    [sortedRootColumns],
  );
  const displayColKeys = React.useMemo(
    () => sortedRootColumns.map((c) => String(c.key)),
    [sortedRootColumns],
  );
  const displaySources = React.useMemo(
    () => (data ?? []).map((row) => (row as any)?.__sourceKey as string | undefined),
    [data],
  );
  const displayRows = React.useMemo(() => {
    return (data ?? []).map((rowObj) =>
      sortedRootColumns.map((c) => formatCellValue((rowObj as any)[c.key], c)),
    );
  }, [data, sortedRootColumns, formatCellValue]);

  const cbRef = React.useRef<typeof onDisplayTableChange>();
  React.useEffect(() => {
    cbRef.current = onDisplayTableChange;
  }, [onDisplayTableChange]);

  React.useEffect(() => {
    cbRef.current?.(displayHeaders, displayRows, displaySources, displayColKeys);
  }, [displayHeaders, displayRows, displaySources, displayColKeys]);
  /** Стиль для иконок действий (редактировать/удалить) */
  const actionIconStyle: React.CSSProperties = { cursor: 'pointer', marginRight: 10 };

  return (
    <div className="dyf-table-container">
      <div className="dyf-table-scroll">
        <table className="dyf-table dyf-table--multi">
          <thead>
            <tr>
              <th>#</th>
              {sortedRootColumns.map((column) => (
                <th key={column.key}>{getColumnLabel(column)}</th>
              ))}
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {(data?.length ?? 0) === 0 && (
              <tr>
                <td colSpan={sortedRootColumns.length + 2} style={{ textAlign: 'center' }}>
                  Нет записей
                </td>
              </tr>
            )}
            {data.map((row, rowIndex) => {
              const sourceKey = (row as any).__sourceKey as string | undefined;
              return (
                <tr key={sourceKey ?? rowIndex}>
                  <td>{rowIndex + 1}</td>

                  {sortedRootColumns.map((column) => {
                    const rawValue = formatCellValue((row as any)[column.key], column);
                    return <td key={column.key}>{rawValue}</td>;
                  })}
                  <td className="dyf-cell-actions">
                    <span
                      role="button"
                      title="Редактировать"
                      style={actionIconStyle}
                      onClick={() => onEdit(rowIndex)}
                    >
                      <EditOutlined />
                    </span>

                    <span
                      role="button"
                      title="Удалить"
                      onClick={() => onDelete(rowIndex, sourceKey)}
                      style={{ cursor: 'pointer' }}
                    >
                      <DeleteOutlined />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
