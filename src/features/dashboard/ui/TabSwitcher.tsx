import type { FC } from 'react';

import type { TabKey } from '../types';
import '@/pages/DashboardPage/ui/DashboardPage.css';

interface Props {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

export const TabSwitcher: FC<Props> = ({ active, onChange }) => (
  <div className="folder-tabs">
    {(['all', 'plan', 'archive'] as TabKey[]).map((tab) => (
      <div
        key={tab}
        className={`folder-tab ${active === tab ? 'active' : 'inactive'}`}
        onClick={() => onChange(tab)}
      >
        {{ all: 'Все работы', plan: 'План работ', archive: 'Архив' }[tab]}
      </div>
    ))}
  </div>
);
