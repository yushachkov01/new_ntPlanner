
/**
 * DeclarativeFormRenderer — отрисовывает узлы декларативного дерева
 */
import React, { useMemo } from 'react';
import { Col, Row } from 'antd';

import { usePlannedTaskStore } from '@/entities/PlannedTask/model/store/plannedTaskStore';
import type { FieldNode } from '@/features/pprEdit/model/typeSystem/FieldTreeBuilder';
import FieldNodeRenderer from '@/shared/ui/form/FieldNodeRenderer';
import CompositeNodeRenderer from '@/shared/ui/form/CompositeNodeRenderer';

type Props = { nodes: FieldNode[] };

/** Опции устройств для ^device */
function useDeviceOptions() {
    const devices = usePlannedTaskStore((store) => store.device);
    const deviceWhitelist = usePlannedTaskStore((store) => store.deviceWhitelist);

    return useMemo(() => {
        const filtered =
            deviceWhitelist && deviceWhitelist.length
                ? (devices ?? []).filter((d: any) => deviceWhitelist.includes(d?.hostname))
                : (devices ?? []);
        return filtered.map((d: any) => ({ label: d?.hostname, value: String(d?.id) }));
    }, [devices, deviceWhitelist]);
}

export const DeclarativeFormRenderer: React.FC<Props> = ({ nodes }) => {
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
                multiple: (node as any).multiple,
            })),
        );
    }

    return (
        <Row gutter={[16, 8]}>
            {nodes.map((node) => (
                <Col xs={24} key={node.key}>
                    {node.kind === 'interface' ? (
                        <CompositeNodeRenderer node={node} deviceOptions={deviceOptions} />
                    ) : (
                        <FieldNodeRenderer node={node} deviceOptions={deviceOptions} />
                    )}
                </Col>
            ))}
        </Row>
    );
};

export default DeclarativeFormRenderer;
