import React, { useEffect } from 'react';
import { Col, Form, InputNumber, Select, Typography } from 'antd';
import type { FC } from 'react';
import type { FieldNode } from '@/features/pprEdit/model/typeSystem/FieldTreeBuilder';
import useHasuraInterfaces from '@/features/pprEdit/model/hooks/useHasuraInterfaces';

const { Text } = Typography;

type Props = {
    node: Extract<FieldNode, { kind: 'interface' }>; // «интерфейс» и другие композиты рендерим одинаково
    deviceOptions: Array<{ label: string; value: string }>;
};

/**
 * Универсальный рендер композитных узлов (сложных типов), вроде `interface`, `interface_with_vlan`,
 *
 * Логика получения options вынесена в хук `useHasuraInterfaces`, которому пробрасываем `requestType`.
 */
const CompositeNodeRenderer: FC<Props> = ({ node, deviceOptions }) => {
    const fieldKey = node.key;
    const form = Form.useFormInstance();

    const {
        selectedDevice,
        setSelectedDevice,
        ifaceOptions,
        isLoading,
        refreshButton,
        namePlaceholder,
    } = useHasuraInterfaces({ requestType: node.requestType ?? 'interface' });

    const watchedDevice: string | undefined = Form.useWatch([fieldKey, 'device'], form);
    useEffect(() => {
        if (watchedDevice && watchedDevice !== selectedDevice) setSelectedDevice(String(watchedDevice));
        if (!watchedDevice && selectedDevice) setSelectedDevice('');
    }, [watchedDevice, selectedDevice, setSelectedDevice]);

    const isMulti = !!node.multiple;
    const ifaceNameField = isMulti ? 'names' : 'name';

    return (
        <>
            <Col xs={24}>
                <Text style={{ fontWeight: 600 }}>{node.label}</Text>
            </Col>

            <Col xs={24}>
                <Form.Item name={[fieldKey, 'device']} label="Устройство">
                    <Select
                        options={deviceOptions}
                        allowClear
                        showSearch
                        optionFilterProp="label"
                        placeholder="Выберите устройство"
                        onChange={(v) => setSelectedDevice(v ? String(v) : '')}
                    />
                </Form.Item>
            </Col>

            <Col xs={24}>
                <Form.Item name={[fieldKey, ifaceNameField]} label={isMulti ? 'Интерфейсы' : 'Интерфейс'}>
                    <Select
                        mode={isMulti ? 'multiple' : undefined}
                        options={ifaceOptions}
                        allowClear
                        showSearch
                        optionFilterProp="label"
                        loading={isLoading}
                        disabled={!watchedDevice}
                        placeholder={namePlaceholder}
                        dropdownRender={(menu) => (
                            <div>
                                {menu}
                                <div style={{ padding: 8 }}>{refreshButton}</div>
                            </div>
                        )}
                    />
                </Form.Item>
            </Col>

            {node.withVlan && !isMulti && (
                <Col xs={24}>
                    <Form.Item name={[fieldKey, 'vlan']} label="Куда переключаем VLAN">
                        <InputNumber style={{ width: '100%' }} min={1} max={4094} />
                    </Form.Item>
                </Col>
            )}
        </>
    );
};

export default CompositeNodeRenderer;
