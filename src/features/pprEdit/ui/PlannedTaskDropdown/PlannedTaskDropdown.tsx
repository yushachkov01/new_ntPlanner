import { Select, Spin } from 'antd';
import type { FC } from 'react';
import { useEffect } from 'react';

import { usePlannedTaskStore } from '@entities/PlannedTask/model/store/plannedTaskStore.ts';

interface Props {
  value?: string;
  onChange: (id: string) => void;
}

export const PlannedTaskDropdown: FC<Props> = ({ value, onChange }) => {
  const { tasks, load } = usePlannedTaskStore();

  useEffect(() => {
    if (tasks.length === 0) load();
  }, [tasks.length, load]);

  if (tasks.length === 0) return <Spin />;

  return (
    <Select
      placeholder="Список выбранных планируемых работ"
      style={{ width: '30%' }}
      value={value}
      onChange={onChange}
      options={tasks.map((t) => ({ value: t.id, label: t.name }))}
    />
  );
};
