/**
 * Компонент рендеринга формы
 */
import { Form, Input, InputNumber, Checkbox, Select, Row, Col, Typography } from 'antd';
import React, { useMemo, useEffect } from 'react';

import { usePlannedTaskStore } from '@/entities/PlannedTask/model/store/plannedTaskStore';
import type { FieldNode } from '@/features/pprEdit/model/typeSystem/FieldTreeBuilder';
import useHasuraInterfaces from '@features/pprEdit/model/hooks/useHasuraInterfaces';

const { Text } = Typography;

/**
 * Пропсы для компонента DeclarativeFormRenderer
 * @property nodes — массив узлов декларативного дерева (FieldNode[])
 */
type Props = { nodes: FieldNode[] };

/**
 * Хук получения списка устройств для ^device.
 * Использует store plannedTaskStore и фильтрует устройства
 *
 * @returns массив опций { label, value } для Select
 */
function useDeviceOptions() {
  /** Все устройства из стора */
  const devices = usePlannedTaskStore((store) => store.device);

  /** Белый список хостов, выбранный во вкладке «Сетевое оборудование» */
  const deviceWhitelist = usePlannedTaskStore((store) => store.deviceWhitelist);

  /** Опции для селекта устройств */
  const options = useMemo(() => {
    const filteredDevices =
      deviceWhitelist && deviceWhitelist.length
        ? devices.filter((device: any) => deviceWhitelist.includes(device.hostname))
        : devices;

    return (filteredDevices ?? []).map((device: any) => ({
      label: device.hostname,
      value: String(device.id),
    }));
  }, [devices, deviceWhitelist]);

  if (import.meta.env && (import.meta as any).env?.DEV) {
    console.debug('[DYF] device options', options, {
      whitelist: deviceWhitelist,
      devicesCount: devices?.length ?? 0,
    });
  }

  return options;
}

/**
 * Декларативный рендерер формы.
 * Рендерит поля по массиву FieldNode: обычные поля или составные (interface).
 *
 * @param nodes — массив узлов для рендера
 */
export const DeclarativeFormRenderer: React.FC<Props> = ({ nodes }) => {
  /** Опции устройств для селекта ^device */
  const deviceOptions = useDeviceOptions();

  if (import.meta.env && (import.meta as any).env?.DEV) {
    console.debug(
      '[DYF/Renderer] nodes',
      nodes.map((node) => ({
        key: (node as any).key,
        kind: node.kind,
        widget: (node as any).widget,
        rawType: (node as any).rawType,
        label: (node as any).label,
      })),
    );
  }

  return (
    <Row gutter={[16, 8]}>
      {nodes.map((node) => {
        if (node.kind === 'interface') {
          return <InterfaceField key={node.key} node={node} deviceOptions={deviceOptions} />;
        }
        if (node.kind === 'field') {
          if (node.widget === 'select') {
            if (node.rawType === '^device') {
              return (
                <Col xs={24} key={node.key}>
                  <Form.Item name={node.key} label={node.label} rules={node.rules}>
                    <Select
                      placeholder="Выберите устройство"
                      options={deviceOptions}
                      showSearch
                      optionFilterProp="label"
                      allowClear
                    />
                  </Form.Item>
                </Col>
              );
            }

            return (
              <Col xs={24} key={node.key}>
                <Form.Item name={node.key} label={node.label} rules={node.rules}>
                  <Select
                    placeholder="Выберите значение"
                    options={(node as any).options}
                    showSearch
                    optionFilterProp="label"
                    allowClear
                  />
                </Form.Item>
              </Col>
            );
          }

          if (node.widget === 'number') {
            return (
              <Col xs={24} key={node.key}>
                <Form.Item name={node.key} label={node.label} rules={node.rules}>
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            );
          }

          // checkbox
          if (node.widget === 'checkbox') {
            return (
              <Col xs={24} key={node.key}>
                <Form.Item name={node.key} valuePropName="checked">
                  <Checkbox>{node.label}</Checkbox>
                </Form.Item>
              </Col>
            );
          }

          // string (input)
          return (
            <Col xs={24} key={node.key}>
              <Form.Item name={node.key} label={node.label} rules={node.rules}>
                <Input />
              </Form.Item>
            </Col>
          );
        }

        return null;
      })}
    </Row>
  );
};

/**
 * Компонент для рендера составного поля interface.
 *
 * @param node — описание узла
 * @param deviceOptions — список устройств для селекта
 */
const InterfaceField: React.FC<{
  node: Extract<FieldNode, { kind: 'interface' }>;
  deviceOptions: Array<{ label: string; value: string }>;
}> = ({ node, deviceOptions }) => {
  /** Ключ узла */
  const fieldKey = node.key;

  /** Экземпляр формы AntD */
  const formInstance = Form.useFormInstance();

  /**
   * Хук получения интерфейсов устройства из Hasura
   * selectedDevice — выбранное устройство
   * setSelectedDevice — метод установки выбранного устройства
   * ifaceOptions — опции интерфейсов для селекта
   * isLoading — индикатор загрузки
   * refreshButton — кнопка обновления
   * namePlaceholder — плейсхолдер для селекта интерфейсов
   */
  const {
    selectedDevice,
    setSelectedDevice,
    ifaceOptions,
    isLoading,
    refreshButton,
    namePlaceholder,
  } = useHasuraInterfaces({ requestType: node.requestType ?? 'interface' });

  /**
   * Следим за значением device в форме и синхронизируем с хуком useHasuraInterfaces
   */
  const watchedDevice: string | undefined = Form.useWatch([fieldKey, 'device'], formInstance);
  useEffect(() => {
    if (watchedDevice && watchedDevice !== selectedDevice) setSelectedDevice(String(watchedDevice));
    if (!watchedDevice && selectedDevice) setSelectedDevice('');
  }, [watchedDevice, selectedDevice]);

  /** Флаг блокировки селекта name, если устройство не выбрано */
  const isNameDisabled = !watchedDevice;

  return (
    <>
      <Col xs={24}>
        <Text style={{ fontWeight: 600 }}>{node.label}</Text>
      </Col>

      <Col xs={24}>
        <Form.Item name={[fieldKey, 'device']} label="Устройство">
          <Select
            placeholder="Выберите устройство"
            options={deviceOptions}
            showSearch
            optionFilterProp="label"
            allowClear
            onChange={(value) => setSelectedDevice(value ? String(value) : '')}
          />
        </Form.Item>
      </Col>

      <Col xs={24}>
        <Form.Item name={[fieldKey, 'name']} label="Интерфейс">
          <Select
            placeholder={namePlaceholder}
            loading={isLoading}
            options={ifaceOptions}
            showSearch
            optionFilterProp="label"
            disabled={isNameDisabled}
            allowClear
            dropdownRender={(menu) => (
              <div>
                {menu}
                <div style={{ padding: 8 }}>{refreshButton}</div>
              </div>
            )}
          />
        </Form.Item>
      </Col>

      {node.withVlan && (
        <Col xs={24}>
          <Form.Item name={[fieldKey, 'vlan']} label="Куда переключаем VLAN">
            <InputNumber style={{ width: '100%' }} min={1} max={4094} />
          </Form.Item>
        </Col>
      )}
    </>
  );
};

export default DeclarativeFormRenderer;
