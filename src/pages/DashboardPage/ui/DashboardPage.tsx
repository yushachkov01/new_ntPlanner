import { Layout, Empty, DatePicker, Popover } from 'antd';
import { useWorks } from '../../../features/work/api/useWorks';
import './DashboardPage.css';
import type { FC } from 'react';
import React, { useState } from 'react';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { FilterOutlined } from '@ant-design/icons';

import type { RowWithStep } from '../../../widgets/WorkTable/ui/WorkTable';
import WorkTable from '../../../widgets/WorkTable/ui/WorkTable';

const { Content } = Layout;
const { RangePicker } = DatePicker;

type TabKey = 'all' | 'plan' | 'archive';

const DashboardPage: FC = () => {
  const { works, loading, error } = useWorks();
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [filterVisible, setFilterVisible] = useState(false);

  if (loading) return <div className="loading">Загружаем задачи…</div>;
  if (error) return <div className="error">Ошибка: {error.message}</div>;

  const today = dayjs().format('YYYY-MM-DD');
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

  const applyDateFilter = (data: RowWithStep[]) => {
    if (!dateRange) return data;
    const [from, to] = dateRange;
    return data.filter((r) => {
      const d = dayjs(r.date, 'YYYY-MM-DD');
      return d.isSameOrAfter(from, 'day') && d.isSameOrBefore(to, 'day');
    });
  };

  let displayRows =
    activeTab === 'plan' ? planRows : activeTab === 'archive' ? archiveRows : allRows;
  displayRows = applyDateFilter(displayRows);

  return (
    <Layout className="dashboard-page">
      <Content className="dashboard-content">
        <div className="folder-tabs">
          <div
            className={`folder-tab ${activeTab === 'all' ? 'active' : 'inactive'}`}
            onClick={() => {
              setActiveTab('all');
              setFilterVisible(false);
            }}
          >
            Все работы
          </div>
          <div
            className={`folder-tab ${activeTab === 'plan' ? 'active' : 'inactive'}`}
            onClick={() => {
              setActiveTab('plan');
              setFilterVisible(false);
            }}
          >
            План работ
          </div>
          <div
            className={`folder-tab ${activeTab === 'archive' ? 'active' : 'inactive'}`}
            onClick={() => {
              setActiveTab('archive');
              setFilterVisible(false);
            }}
          >
            Архив
          </div>
          <div className="filter-wrapper">
            <Popover
              content={
                <div className="popover-inner">
                  <div className="popover-title">Фильтр по дате</div>
                  <RangePicker
                    allowClear
                    className="light-range-picker"
                    onChange={(vals) => setDateRange(vals as never)}
                  />
                </div>
              }
              trigger="click"
              visible={filterVisible}
              onVisibleChange={setFilterVisible}
              placement="bottom"
            >
              <FilterOutlined
                className={`filter-icon ${filterVisible ? 'on' : ''}`}
                onClick={(e) => e.stopPropagation()}
              />
            </Popover>
          </div>
        </div>
        <div className="folder-content">
          {displayRows.length > 0 ? (
            <WorkTable data={displayRows} isArchive={activeTab === 'archive'} />
          ) : (
            <Empty description="Нет задач" />
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default DashboardPage;
