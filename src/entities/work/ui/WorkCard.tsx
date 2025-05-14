import { Card, Button } from 'antd';
import type { FC } from 'react';

import StatusBar from '../../../shared/ui/StatusBar/StatusBar.tsx';
import type { Work } from '../model/work.ts';

interface Props {
  work: Work;
  onAction: (id: number) => void;
}

const WorkCard: FC<Props> = ({ work, onAction }) => (
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
