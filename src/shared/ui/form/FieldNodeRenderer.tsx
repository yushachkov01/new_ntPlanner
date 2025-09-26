// src/features/pprEdit/ui/form/FieldNodeRenderer.tsx
import React, { useCallback } from 'react';
import { Form, Input, InputNumber, Select, Checkbox, Radio } from 'antd';

type FieldNode = {
    kind: 'field';
    key: string;
    label: string;
    widget: 'input' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio';
    options?: Array<{ label: string; value: any }>;
    multiple?: boolean;
    rawType?: string;
    rules?: any[];
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
};

type Props = {
    node: FieldNode;
    deviceOptions?: Array<{ label: string; value: string }>;
};

const FieldNodeRenderer: React.FC<Props> = ({ node, deviceOptions }) => {
    if (node.kind !== 'field') return null;

    const emitChanged = useCallback(() => {
        document.dispatchEvent(new Event('ntp:form:changed'));
    }, []);

    if (node.widget === 'checkbox') {
        return (
            <Form.Item key={node.key} name={node.key} label={node.label} rules={node.rules} valuePropName="checked">
                <Checkbox onChange={emitChanged} />
            </Form.Item>
        );
    }

    if (node.widget === 'number') {
        return (
            <Form.Item key={node.key} name={node.key} label={node.label} rules={node.rules}>
                <InputNumber
                    min={node.min}
                    max={node.max}
                    step={node.step}
                    placeholder={node.placeholder ?? 'Введите число'}
                    style={{ width: '100%' }}
                    onChange={emitChanged}
                />
            </Form.Item>
        );
    }

    if (node.widget === 'select') {
        if (node.rawType === '^device') {
            return (
                <Form.Item key={node.key} name={node.key} label={node.label} rules={node.rules}>
                    <Select
                        options={deviceOptions}
                        allowClear
                        showSearch
                        optionFilterProp="label"
                        placeholder={node.placeholder ?? 'Выберите устройство'}
                        onChange={emitChanged}
                    />
                </Form.Item>
            );
        }
        return (
            <Form.Item key={node.key} name={node.key} label={node.label} rules={node.rules}>
                <Select
                    mode={node.multiple ? 'multiple' : undefined}
                    options={node.options}
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    placeholder={node.placeholder ?? 'Выберите значение'}
                    onChange={emitChanged}
                />
            </Form.Item>
        );
    }

    if (node.widget === 'radio') {
        return (
            <Form.Item key={node.key} name={node.key} label={node.label} rules={node.rules}>
                <Radio.Group options={node.options} onChange={emitChanged} />
            </Form.Item>
        );
    }

    if (node.widget === 'textarea') {
        return (
            <Form.Item key={node.key} name={node.key} label={node.label} rules={node.rules}>
                <Input.TextArea placeholder={node.placeholder ?? 'Введите текст'} onChange={emitChanged} />
            </Form.Item>
        );
    }

    return (
        <Form.Item key={node.key} name={node.key} label={node.label} rules={node.rules}>
            <Input placeholder={node.placeholder ?? 'Введите значение'} onChange={emitChanged} />
        </Form.Item>
    );
};

export default FieldNodeRenderer;
