import { Layout, Empty } from 'antd';
import type { FC } from 'react';
import { Suspense } from 'react';

import { ColumnSettings } from '@/features/dashboard/ui/ColumnSettings';
import { DateFilter } from '@/features/dashboard/ui/DateFilter';
import { TabSwitcher } from '@/features/dashboard/ui/TabSwitcher';
import { useDashboardData } from '@features/dashboard/model/useDashboardData';
import WorkTable from '@widgets/WorkTable/ui/WorkTable';
import './DashboardPage.css';

const { Content } = Layout;

const DashboardInner: FC = () => {
  const {
    displayRows,
    state: { activeTab, dateFilterVisible, colsVisible, visibleCols },
    handlers: {
      setActiveTab,
      setDateRange,
      toggleDateFilterVisible,
      toggleColsVisible,
      setVisibleCols,
    },
  } = useDashboardData();

  return (
    <Layout className="dashboard-page">
      <Content className="dashboard-content">
        <div className="folder-tabs">
          <TabSwitcher
            active={activeTab}
            onChange={(tab) => {
              setActiveTab(tab);
              toggleDateFilterVisible(false);
              toggleColsVisible(false);
            }}
          />

          <div className="filter-wrapper">
            <DateFilter
              visible={dateFilterVisible}
              onVisibleChange={toggleDateFilterVisible}
              onDateChange={setDateRange}
            />
          </div>

          <div className="filter-wrapper">
            <ColumnSettings
              visible={colsVisible}
              onVisibleChange={toggleColsVisible}
              selected={visibleCols}
              onToggle={setVisibleCols}
            />
          </div>
        </div>

        <div className="folder-content">
          {displayRows.length > 0 ? (
            <WorkTable
              data={displayRows}
              isArchive={activeTab === 'archive'}
              visibleColumns={visibleCols}
            />
          ) : (
            <Empty description={activeTab === 'archive' ? 'Нет архивных задач' : 'Нет задач'} />
          )}
        </div>
      </Content>
    </Layout>
  );
};

const DashboardPage: FC = () => (
  <Suspense fallback={<div className="loading">Загружаем задачи…</div>}>
    <DashboardInner />
  </Suspense>
);

export default DashboardPage;
