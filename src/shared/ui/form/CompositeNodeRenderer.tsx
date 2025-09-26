// src/features/pprEdit/ui/form/CompositeNodeRenderer.tsx
import React, { FC, useEffect, useCallback } from 'react';
import { Col, Form, InputNumber, Select, Typography } from 'antd';

const { Text } = Typography;

type InterfaceNode = {
    kind: 'interface';
    key: string;
    label: string;
    multiple?: boolean;
    withVlan?: boolean;
    requestType?: 'interface' | string;
};

type Props = {
    node: InterfaceNode;
    deviceOptions: Array<{ label: string; value: string }>;
};

// заглушка твоего хука — у тебя уже есть реальный хук, импортни его вместо этого
// import useHasuraInterfaces from '@/features/pprEdit/model/hooks/useHasuraInterfaces';
const useHasuraInterfaces = (_: { requestType: string }) => {
    return {
        selectedDevice: '',
        setSelectedDevice: (_: string) => {},
        ifaceOptions: [],
        isLoading: false,
        refreshButton: null as any,
        namePlaceholder: 'Выберите интерфейс',
    };
};

const CompositeNodeRenderer: FC<Props> = ({ node, deviceOptions }) => {
    const fieldKey = node.key;
    const form = Form.useFormInstance();

    // Если у тебя есть реальный хук, используй его:
    // const { selectedDevice, setSelectedDevice, ifaceOptions, isLoading, refreshButton, namePlaceholder }
    //   = useHasuraInterfaces({ requestType: node.requestType ?? 'interface' });

    const selectedDevice = Form.useWatch([fieldKey, 'device'], form) as string | undefined;
    const setSelectedDevice = (_: string) => {};

    const ifaceOptions: Array<{ label: string; value: string }> = [];
    const isLoading = false;
    const refreshButton = null as any;
    const namePlaceholder = 'Выберите интерфейс';

    useEffect(() => {
        if (!selectedDevice) setSelectedDevice('');
    }, [selectedDevice]);

    const emitChanged = useCallback(() => {
        document.dispatchEvent(new Event('ntp:form:changed'));
    }, []);

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
                        onChange={(v) => {
                            setSelectedDevice(v ? String(v) : '');
                            emitChanged();
                        }}
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
                        disabled={!selectedDevice}
                        placeholder={namePlaceholder}
                        onChange={emitChanged}
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
                        <InputNumber style={{ width: '100%' }} min={1} max={4094} onChange={emitChanged} />
                    </Form.Item>
                </Col>
            )}
        </>
    );
};

export default CompositeNodeRenderer;
