import { Layout, Empty } from 'antd';
import type { FC } from 'react';
import { useState } from 'react';

import { useWorks } from '../../../features/work/api/useWorks';
import type { RowWithStep } from '../../../widgets/WorkTable/ui/WorkTable';
import WorkTable from '../../../widgets/WorkTable/ui/WorkTable';
import './DashboardPage.css';

const { Content } = Layout;
type TabKey = 'all' | 'plan' | 'archive';

const DashboardPage: FC = () => {
  const { works, loading, error } = useWorks();
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const today = new Date().toISOString().slice(0, 10);

  if (loading) return <div className="loading">Загружаем задачи…</div>;
  if (error) return <div className="error">Ошибка: {error.message}</div>;

  const rows: RowWithStep[] = works.map((w) => ({
    ...w,
    plan: w.pprHours + w.workHours + w.overtimeHours,
    ppr: w.pprHours,
    request: 1,
    work: w.workHours,
    step: w.status === 'in_progress' ? 2 : 0,
  }));

  const planRows = rows.filter((r) => r.date >= today);
  const archiveRows = rows.filter((r) => r.date < today);

  const allRows = [...planRows, ...archiveRows];

  return (
    <Layout className="dashboard-page">
      <Content className="dashboard-content">
        {/* === Папки === */}
        <div className="folder-tabs">
          <div
            className={`folder-tab ${activeTab === 'all' ? 'active' : 'inactive'}`}
            onClick={() => setActiveTab('all')}
          >
            Все работы
          </div>
          <div
            className={`folder-tab ${activeTab === 'plan' ? 'active' : 'inactive'}`}
            onClick={() => setActiveTab('plan')}
          >
            План работ
          </div>
          <div
            className={`folder-tab ${activeTab === 'archive' ? 'active' : 'inactive'}`}
            onClick={() => setActiveTab('archive')}
          >
            Архив
          </div>
        </div>

        <div className="folder-content">
          {activeTab === 'all' &&
            (allRows.length > 0 ? (
              <WorkTable data={allRows} isArchive={false} />
            ) : (
              <Empty description="Нет работ" />
            ))}
          {activeTab === 'plan' &&
            (planRows.length > 0 ? (
              <WorkTable data={planRows} isArchive={false} />
            ) : (
              <Empty description="Нет плановых задач" />
            ))}
          {activeTab === 'archive' &&
            (archiveRows.length > 0 ? (
              <WorkTable data={archiveRows} isArchive />
            ) : (
              <Empty description="Нет архивных задач" />
            ))}
        </div>
      </Content>
    </Layout>
  );
};

export default DashboardPage;
