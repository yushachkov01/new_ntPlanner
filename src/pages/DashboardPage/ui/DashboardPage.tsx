import { FileDoneOutlined } from '@ant-design/icons';
import { Layout, Space, Empty } from 'antd';
import type { FC } from 'react';
import { useState } from 'react';

import { useWorks } from '../../../features/work/api/useWorks';
import type { RowWithStep } from '../../../widgets/WorkTable/ui/WorkTable';
import WorkTable from '../../../widgets/WorkTable/ui/WorkTable';
import './DashboardPage.css';

const { Content } = Layout;

const DashboardPage: FC = () => {
  const { works, loading, error } = useWorks();
  const [showEstimate] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  if (loading) {
    return <div>Загружаем задачи…</div>;
  }
  if (error) {
    return <div>Ошибка при загрузке: {error.message}</div>;
  }

  const rows: RowWithStep[] = works.map((w) => ({
    ...w,
    plan: w.ppr_hours + w.work_hours + w.overtime_hours,
    ppr: w.ppr_hours,
    request: 1,
    work: w.work_hours,
    step: w.status === 'in_progress' ? 2 : 0,
  }));

  const planRows = rows.filter((r) => r.date >= today);
  const archiveRows = rows.filter((r) => r.date < today);

  const totalPpr = planRows.reduce((s, r) => s + r.ppr, 0);
  const totalWork = planRows.reduce((s, r) => s + r.work, 0);
  const totalOver = planRows.reduce((s, r) => s + (r.plan - r.ppr - r.work), 0);

  return (
    <Layout className="dashboard-page">
      <Content className="dashboard-content">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className="section-banner">
            <FileDoneOutlined className="section-icon" />
            <span className="section-title">План твоих работ:</span>
          </div>

          {planRows.length > 0 ? (
            <>
              <WorkTable data={planRows} isArchive={false} />

              {showEstimate && (
                <div className="time-estimate">
                  Плановая оценка времени:
                  <strong>{totalPpr}ч (ППР)</strong>
                  <strong>{totalWork}ч (Работы)</strong>
                  <strong>{totalOver}ч (Сверхурочные)</strong>
                </div>
              )}
            </>
          ) : (
            <div className="empty-table">
              <Empty description="Нет плановых задач" style={{ padding: 40 }} />
            </div>
          )}

          <div className="section-banner archive">
            <FileDoneOutlined className="section-icon" />
            <span className="section-title">Архив</span>
          </div>
          {archiveRows.length > 0 ? (
            <WorkTable data={archiveRows} isArchive />
          ) : (
            <div className="empty-table">
              <Empty description="Нет архивных задач" style={{ padding: 40 }} />
            </div>
          )}
        </Space>
      </Content>
    </Layout>
  );
};

export default DashboardPage;
