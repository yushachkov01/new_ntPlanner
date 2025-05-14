import { FileDoneOutlined, ExceptionOutlined } from '@ant-design/icons';
import { Layout, Space, Empty } from 'antd';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

import type { Work } from '../../../entities/work/model/work';
import { fetchWorks } from '../../../features/work/api/workApi';
import Header from '../../../shared/ui/Header/Header.tsx';
import type { RowWithStep } from '../../../widgets/WorkTable/ui/WorkTable';
import WorkTable from '../../../widgets/WorkTable/ui/WorkTable';
import './DashboardPage.css';

const { Content } = Layout;

const DashboardPage: FC = () => {
  const [works, setWorks] = useState<Work[]>([]);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    fetchWorks().then(setWorks);
  }, []);

  // приводим к RowWithStep
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

  const handleAction = (id: number) => {
    console.log('action on', id);
    // сюда логика по клику
  };

  return (
    <Layout className="dashboard-page">
      <Header />
      <Content className="dashboard-content">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className="section-banner">
            <ExceptionOutlined className="section-icon" />
            <span className="section-title">План твоих работ:</span>
          </div>
          {planRows.length > 0 ? (
            <WorkTable data={planRows} onAction={handleAction} />
          ) : (
            <Empty description="Нет плановых задач" style={{ padding: 40 }} />
          )}
          <div className="section-banner archive">
            <FileDoneOutlined className="section-icon" />
            <span className="section-title">Архив</span>
          </div>
          {archiveRows.length > 0 ? (
            <WorkTable data={archiveRows} onAction={handleAction} isArchive />
          ) : (
            <Empty description="Нет архивных задач" style={{ padding: 40 }} />
          )}
        </Space>
      </Content>
    </Layout>
  );
};

export default DashboardPage;
