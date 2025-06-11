import { Layout, Empty, DatePicker, Popover, Checkbox } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { FC } from 'react';
import React, { useState } from 'react';
import 'dayjs/locale/ru';
import { CalendarOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import ruRU from 'antd/es/date-picker/locale/ru_RU';

import { useGetWorksQuery } from '@features/work/api/workApi';
import type { RowWithStep } from '@widgets/WorkTable/types/RowWithStep';
import WorkTable from '@widgets/WorkTable/ui/WorkTable';
import './DashboardPage.css';

const { Content } = Layout;
const { RangePicker } = DatePicker;

const ALL_COLUMNS = [
  { key: 'id', label: '#' },
  { key: 'date', label: 'Дата' },
  { key: 'project', label: 'Проект' },
  { key: 'site', label: 'Площадка' },
  { key: 'description', label: 'Описание' },
  { key: 'timeRange', label: 'Время проведения работ' },
  { key: 'status', label: 'Текущий статус' },
  { key: 'actions', label: 'Действия' },
] as const;

type TabKey = 'all' | 'plan' | 'archive';

const DashboardPage: FC = () => {
  const { data: works = [], isLoading, error } = useGetWorksQuery();

  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [dateFilterVisible, setDateFilterVisible] = useState(false);
  const [colsVisible, setColsVisible] = useState(false);
  const [visibleCols, setVisibleCols] = useState<string[]>(ALL_COLUMNS.map((c) => c.key));

  if (isLoading) return <div className="loading">Загружаем задачи…</div>;
  if (error) return <div className="error">Ошибка: {String(error)}</div>;

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
  const archRows = rows.filter((r) => r.date < today);
  const allRows = [...planRows, ...archRows];

  function applyDateFilter(data: RowWithStep[]) {
    if (!dateRange) return data;
    const [from, to] = dateRange;
    const f = from.format('YYYY-MM-DD');
    const t = to.format('YYYY-MM-DD');
    return data.filter((r) => r.date >= f && r.date <= t);
  }

  let displayRows = activeTab === 'plan' ? planRows : activeTab === 'archive' ? archRows : allRows;
  displayRows = applyDateFilter(displayRows);

  const toggleCol = (key: string) =>
    setVisibleCols((vc) => (vc.includes(key) ? vc.filter((x) => x !== key) : [...vc, key]));

  return (
    <Layout className="dashboard-page">
      <Content className="dashboard-content">
        <div className="folder-tabs">
          {(['all', 'plan', 'archive'] as TabKey[]).map((tab) => (
            <div
              key={tab}
              className={`folder-tab ${activeTab === tab ? 'active' : 'inactive'}`}
              onClick={() => {
                setActiveTab(tab);
                setDateFilterVisible(false);
                setColsVisible(false);
              }}
            >
              {{ all: 'Все работы', plan: 'План работ', archive: 'Архив' }[tab]}
            </div>
          ))}
          <div className="filter-wrapper">
            <Popover
              content={
                <div className="popover-inner">
                  <div className="popover-title">Фильтр по дате</div>
                  <RangePicker
                    locale={ruRU}
                    allowClear
                    onChange={(vals) => {
                      if (vals && vals[0] && vals[1]) setDateRange(vals as any);
                      else setDateRange(null);
                    }}
                  />
                </div>
              }
              trigger="click"
              visible={dateFilterVisible}
              onVisibleChange={setDateFilterVisible}
              placement="bottom"
            >
              <CalendarOutlined
                className={`calendar-icon ${dateFilterVisible ? 'on' : ''}`}
                onClick={(e) => e.stopPropagation()}
              />
            </Popover>
          </div>
          <div className="filter-wrapper">
            <Popover
              content={
                <div className="popover-inner cols-popover">
                  <div className="popover-title">Настройка колонок</div>
                  <div className="cols-list">
                    {ALL_COLUMNS.map((col) => (
                      <Checkbox
                        key={col.key}
                        checked={visibleCols.includes(col.key)}
                        onChange={() => toggleCol(col.key)}
                      >
                        {col.label}
                      </Checkbox>
                    ))}
                  </div>
                </div>
              }
              trigger="click"
              visible={colsVisible}
              onVisibleChange={setColsVisible}
              placement="bottom"
            >
              <AppstoreAddOutlined
                className={`filter-icon ${colsVisible ? 'on' : ''}`}
                onClick={(e) => e.stopPropagation()}
              />
            </Popover>
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
            <Empty description="Нет задач" />
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default DashboardPage;
