import { SettingOutlined } from '@ant-design/icons';
import type { FC, MouseEvent } from 'react';
import React from 'react';
import './StatusBar.css';

interface Props {
  plan: number;
  ppr: number;
  request: number;
  work: number;
  step: number;
  onStep?: () => void;
  customIcon?: React.ReactNode;
}

const StatusBar: FC<Props> = ({ plan, ppr, request, work, step, onStep, customIcon }) => {
  const segments = [
    { key: 'plan', label: 'План' },
    { key: 'ppr', label: 'ППР' },
    { key: 'request', label: 'Заявка' },
    { key: 'work', label: 'Работы' },
  ];

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    onStep && onStep();
  };

  return (
    <div className="status-bar">
      <div className="status-bar-labels">
        {segments.map((s) => (
          <div key={s.key} className="status-bar-label">
            {s.label}
          </div>
        ))}
      </div>

      <div className="status-bar-main">
        {segments.map((_, i) => (
          <div
            key={i}
            className={i < step ? 'status-bar-block status-bar-block--filled' : 'status-bar-block'}
          />
        ))}

        <div className="status-bar-icon">
          {customIcon ?? <SettingOutlined className="gear-icon" />}
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
