import { SettingOutlined } from '@ant-design/icons';
import type { FC } from 'react';
import React from 'react';
import './StatusBar.css';

interface Props {
  plan?: number;
  ppr?: number;
  request?: number;
  work?: number;
  step: number;
  onStep?: () => void;
  customIcon?: React.ReactNode;
  overtime?: number;
  status?: 'pending' | 'in_progress' | 'done';
}

const StatusBar: FC<Props> = ({ step, onStep, customIcon }) => {
  const segments = [
    { key: 'plan', color: '#00cc00', label: 'План' },
    { key: 'ppr', color: '#009900', label: 'ППР' },
    { key: 'request', color: '#006400', label: 'Заявка' },
    { key: 'work', color: '#ffd700', label: 'Работы' },
  ];

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
        {segments.map((s, i) => (
          <div
            key={s.key}
            className={`status-bar-block ${i < step ? 'status-bar-block--filled' : ''}`}
            style={{ backgroundColor: i < step ? s.color : '#f5f5f5' }}
          />
        ))}
        {customIcon ? (
          <span className="status-bar-network-icon">{customIcon}</span>
        ) : (
          <SettingOutlined className="status-bar-gear" />
        )}
      </div>
      {onStep && (
        <button
          className="status-bar-action"
          onClick={(e) => {
            e.stopPropagation();
            onStep();
          }}
        >
          Приступить
        </button>
      )}
    </div>
  );
};

export default StatusBar;
