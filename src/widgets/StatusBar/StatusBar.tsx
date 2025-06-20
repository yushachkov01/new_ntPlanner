import { SettingOutlined } from '@ant-design/icons';
import type { FC } from 'react';
import { MouseEvent } from 'react';

import type { Props } from '@/shared/types/props.ts';
import './StatusBar.css';

/**
 * StatusBar — отображает прогресс по этапам задачи
 */
const StatusBar: FC<Props> = ({ step, onStep, customIcon }) => {
  /** Описания сегментов прогресса */
  const segments = [
    { key: 'plan', label: 'План' },
    { key: 'ppr', label: 'ППР' },
    { key: 'request', label: 'Заявка' },
    { key: 'work', label: 'Работы' },
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
