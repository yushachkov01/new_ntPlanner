import { ShareAltOutlined } from '@ant-design/icons';
import { Table, Button, Empty } from 'antd';
import type { ColumnsType } from 'antd/lib/table';

import type { Work } from '../../../entities/work/model/work';
import StatusBar from '../../../shared/ui/StatusBar';

import './WorkTable.css';
import type { FC, MouseEvent } from 'react';
import { useState, useEffect } from 'react';

export interface RowWithStep extends Work {
  plan: number;
  ppr: number;
  request: number;
  work: number;
  step: number;
}

interface Props {
  data: Work[];
  isArchive?: boolean;
}

const WorkTable: FC<Props> = ({ data, isArchive = false }) => {
  const [rows, setRows] = useState<RowWithStep[]>([]);
  const [expandedKey, setExpandedKey] = useState<number | null>(null);

  // для пагинации
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const today = new Date().toISOString().slice(0, 10);
  const SEGMENTS = 4;

  useEffect(() => {
    setRows(
      data.map((w) => ({
        ...w,
        plan: w.pprHours + w.workHours + w.overtimeHours,
        ppr: w.pprHours,
        request: 1,
        work: w.workHours,
        step: w.status === 'in_progress' ? 2 : 0,
      })),
    );
  }, [data]);

  const handleStep = (id: number, e: MouseEvent) => {
    e.stopPropagation();
    setRows((rs) =>
      rs.map((r) => (r.id === id ? { ...r, step: Math.min(SEGMENTS, r.step + 1) } : r)),
    );
  };

  const toggleExpand = (id: number) => {
    setExpandedKey((prev) => (prev === id ? null : id));
  };

  const columns: ColumnsType<RowWithStep> = [
    { title: '#', dataIndex: 'id', key: 'id', width: 50 },
    { title: 'Дата', dataIndex: 'date', key: 'date', width: 120 },
    { title: 'Проект', dataIndex: 'project', key: 'project' },
    { title: 'Площадка', dataIndex: 'site', key: 'site' },
    { title: 'Описание', dataIndex: 'description', key: 'description' },
    {
      title: 'Время проведения работ',
      dataIndex: 'timeRange',
      key: 'timeRange',
      width: 160,
    },
    {
      title: 'Текущий статус',
      key: 'status',
      width: 280,
      render: (_, r) => {
        const isFuture = !isArchive && r.date > today;
        return (
          <StatusBar
            plan={r.plan}
            ppr={r.ppr}
            request={r.request}
            work={r.work}
            step={r.step}
            onStep={r.date === today ? (e) => handleStep(r.id, e as any) : undefined}
            customIcon={
              isFuture ? <ShareAltOutlined className="status-bar-network-icon" /> : undefined
            }
          />
        );
      },
    },
    ...(!isArchive
      ? [
          {
            title: 'Действия',
            key: 'actions',
            width: 160,
            render: (_: any, r: RowWithStep) =>
              r.date === today ? (
                <Button onClick={(e) => handleStep(r.id, e)} type="primary">
                  Приступить
                </Button>
              ) : (
                <div className="action-links">
                  <a onClick={(e) => handleStep(r.id, e)} style={{ paddingRight: '10px' }}>
                    К ППР
                  </a>
                  <a onClick={(e) => handleStep(r.id, e)}>Отменить</a>
                </div>
              ),
          },
        ]
      : []),
  ];
  return (
    <Table<RowWithStep>
      className={`worktable${isArchive ? ' archive' : ''}`}
      tableLayout="fixed"
      sticky={{ offsetHeader: 0 }}
      rowKey="id"
      dataSource={rows}
      columns={columns}
      locale={{
        emptyText: <Empty description={isArchive ? 'Нет архивных задач' : 'Нет задач'} />,
      }}
      expandable={{
        expandedRowRender: (record) => {
          const overtime = record.plan - record.ppr - record.work;
          return (
            <div className="time-estimate-row">
              Плановая оценка времени:&nbsp;
              <strong>{record.ppr}ч (ППР)</strong>,&nbsp;
              <strong>{record.work}ч (Работы)</strong>,&nbsp;
              <strong>{overtime}ч (Сверхурочные)</strong>
            </div>
          );
        },
        expandedRowKeys: expandedKey ? [expandedKey] : [],
        rowExpandable: () => true,
        expandIcon: () => null,
      }}
      rowClassName={(r) => (!isArchive && r.date === today ? 'row-today' : '')}
      pagination={{
        current: currentPage,
        pageSize,
        pageSizeOptions: ['5', '10', '20'],
        showSizeChanger: true,
        showQuickJumper: false,
        onChange: (page, size) => {
          setCurrentPage(page);
          setPageSize(size);
        },
      }}
      onRow={(record) => ({
        onClick: () => toggleExpand(record.id),
      })}
    />
  );
};

export default WorkTable;
