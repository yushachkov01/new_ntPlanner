import { ShareAltOutlined } from '@ant-design/icons';
import { Table, Button, Empty } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import React, { useState, useEffect } from 'react';
import type { FC, MouseEvent } from 'react';

import StatusBar from '../../../shared/ui/StatusBar';

import './WorkTable.css';
import type { PropsWorkTable, RowWithStep } from '@widgets/WorkTable/types/RowWithStep.ts';

const WorkTable: FC<PropsWorkTable> = ({
  data,
  isArchive = false,
  visibleColumns = [
    'id',
    'date',
    'project',
    'site',
    'description',
    'timeRange',
    'status',
    'actions',
  ],
}) => {
  const [rows, setRows] = useState<RowWithStep[]>([]);
  const [expandedKey, setExpandedKey] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);

  const today = new Date().toISOString().slice(0, 10);
  const SEGMENTS = 4;

  useEffect(() => {
    setRows(data);
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
  const baseCols: ColumnsType<RowWithStep> = [
    { title: '#', dataIndex: 'id', key: 'id', width: 80 },
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
            customIcon={isFuture ? <ShareAltOutlined /> : undefined}
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
            render: (_: any, r) =>
              r.date === today ? (
                <Button type="primary" onClick={(e) => handleStep(r.id, e)}>
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
  const columnsToRender = baseCols.filter((col) => visibleColumns!.includes(col.key as string));
  return (
    <Table<RowWithStep>
      className={`worktable${isArchive ? ' archive' : ''}`}
      tableLayout="fixed"
      sticky={{ offsetHeader: 0 }}
      rowKey="id"
      dataSource={rows}
      columns={columnsToRender}
      expandable={{
        expandIconColumnIndex: -1,
        expandedRowRender: (rec) => {
          const ot = rec.plan - rec.ppr - rec.work;
          return (
            <div className="time-estimate-row">
              Плановая оценка времени:&nbsp;
              <strong>{rec.ppr}ч (ППР)</strong>,&nbsp;
              <strong>{rec.work}ч (Работы)</strong>,&nbsp;
              <strong>{ot}ч (Сверхурочные)</strong>
            </div>
          );
        },
        expandedRowKeys: expandedKey ? [expandedKey] : [],
        rowExpandable: () => true,
        expandIcon: () => null,
      }}
      rowClassName={(r) => (!isArchive && r.date === today ? 'row-today' : '')}
      pagination={{
        current: page,
        pageSize: size,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '20'],
        onChange: (p, s) => {
          setPage(p);
          setSize(s);
        },
      }}
      onRow={(rec) => ({ onClick: () => toggleExpand(rec.id) })}
      locale={{
        emptyText: <Empty description={isArchive ? 'Нет архивных задач' : 'Нет задач'} />,
      }}
    />
  );
};

export default WorkTable;
