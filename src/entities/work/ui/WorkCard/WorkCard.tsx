import { Card, Button } from 'antd';
import type { FC } from 'react';

import type { WorkCardProps } from '@entities/work/ui/WorkCard/WorkCardProps.ts';
import StatusBar from '@widgets/StatusBar/StatusBar.tsx';

const WorkCard: FC<WorkCardProps> = ({ work, onAction }) => (
  <Card title={`${work.date} — ${work.project}`} style={{ marginBottom: 16 }}>
    <p>
      <strong>Площадка:</strong> {work.site}
    </p>
    <p>
      <strong>Описание:</strong> {work.description}
    </p>
    <p>
      <strong>Время:</strong> {work.timeRange}
    </p>
    <StatusBar
      ppr={work.pprHours}
      work={work.workHours}
      overtime={work.overtimeHours}
      status={work.status}
    />
    <Button type="primary" style={{ marginTop: 12 }} onClick={() => onAction(work.id)}>
      {work.status === 'pending' ? 'Приступить' : 'Отменить'}
    </Button>
  </Card>
);

export default WorkCard;
