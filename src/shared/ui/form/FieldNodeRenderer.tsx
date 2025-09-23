import React from 'react';
import { Form, Input, InputNumber, Select, Checkbox, Radio } from 'antd';
import type { FieldNode } from '@/features/pprEdit/model/typeSystem/FieldTreeBuilder';

type Props = {
    node: FieldNode;
    /** для специальных типов вроде ^device */
    deviceOptions?: Array<{ label: string; value: string }>;
};

const FieldNodeRenderer: React.FC<Props> = ({ node, deviceOptions }) => {
    if (node.kind !== 'field') return null;

    // checkbox
    if (node.widget === 'checkbox') {
        return (
            <Form.Item
                key={node.key}
                name={node.key}
                label={node.label}
                rules={node.rules}
                valuePropName="checked"
            >
                <Checkbox />
            </Form.Item>
        );
    }

    // number
    if (node.widget === 'number') {
        return (
            <Form.Item key={node.key} name={node.key} label={node.label} rules={node.rules}>
                <InputNumber
                    min={node.min}
                    max={node.max}
                    step={node.step}
                    placeholder={node.placeholder ?? 'Введите число'}
                    style={{ width: '100%' }}
                />
            </Form.Item>
        );
    }

    // select (+ специальный случай ^device)
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
                />
            </Form.Item>
        );
    }

    // radio
    if (node.widget === 'radio') {
        return (
            <Form.Item key={node.key} name={node.key} label={node.label} rules={node.rules}>
                <Radio.Group
                    options={node.options}
                    optionType="default"
                />
            </Form.Item>
        );
    }

    // textarea
    if (node.widget === 'textarea') {
        return (
            <Form.Item key={node.key} name={node.key} label={node.label} rules={node.rules}>
                <Input.TextArea placeholder={node.placeholder ?? 'Введите текст'} />
            </Form.Item>
        );
    }

    // default: input
    return (
        <Form.Item key={node.key} name={node.key} label={node.label} rules={node.rules}>
            <Input placeholder={node.placeholder ?? 'Введите значение'} />
        </Form.Item>
    );
};

export default FieldNodeRenderer;
