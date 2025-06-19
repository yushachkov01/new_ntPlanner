import { AppstoreAddOutlined } from '@ant-design/icons';
import { Popover, Checkbox } from 'antd';
import type { FC } from 'react';

import { ALL_COLUMNS } from '../model/types.ts';
import '@/pages/DashboardPage/ui/DashboardPage.css';

interface Props {
  visible: boolean;
  onVisibleChange: (v: boolean) => void;
  selected: string[];
  onToggle: (key: string) => void;
}

export const ColumnSettings: FC<Props> = ({ visible, onVisibleChange, selected, onToggle }) => (
  <Popover
    content={
      <div className="popover-inner cols-popover">
        <div className="popover-title">Настройка колонок</div>
        <div className="cols-list">
          {ALL_COLUMNS.map((col) => (
            <Checkbox
              key={col.key}
              checked={selected.includes(col.key)}
              onChange={() => onToggle(col.key)}
            >
              {col.label}
            </Checkbox>
          ))}
        </div>
      </div>
    }
    trigger="click"
    visible={visible}
    onVisibleChange={onVisibleChange}
    placement="bottom"
  >
    <AppstoreAddOutlined className={`filter-icon ${visible ? 'on' : ''}`} />
  </Popover>
);
