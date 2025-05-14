import { ShareAltOutlined } from '@ant-design/icons';
import { Table, Button, Empty } from 'antd';
import type { ColumnsType, TableExpandableConfig } from 'antd/lib/table';
import { useState, useEffect } from 'react';
import type { FC, MouseEvent } from 'react';

import type { Work } from '../../../entities/work/model/work';
import StatusBar from '../../../shared/ui/StatusBar/StatusBar.tsx';
import './WorkTable.css';

export interface RowWithStep extends Work {
  plan: number;
  ppr: number;
  request: number;
  work: number;
  step: number;
}

interface Props {
  data: Work[];
  onAction: (id: number) => void;
  isArchive?: boolean;
}

const WorkTable: FC<Props> = ({ data, onAction, isArchive = false }) => {
  const [rows, setRows] = useState<RowWithStep[]>([]);
  const [expandedKey, setExpandedKey] = useState<number | null>(null);
  const today = new Date().toISOString().slice(0, 10);
  const SEGMENTS = 4;

  // 1) Инициализируем локальный стейт
  useEffect(() => {
    setRows(
      data.map((w) => ({
        ...w,
        plan: w.pprHours + w.workHours + w.overtimeHours,
        ppr: w.pprHours,
        request: 1,
        work: w.workHours,
        step: 0,
      })),
    );
    setExpandedKey(null);
  }, [data]);

  // 2) По клику на кнопку инкрементим step и зовём внешний onAction
  const handleStep = (id: number, e?: MouseEvent) => {
    e?.stopPropagation();
    setRows((rs) =>
      rs.map((r) => (r.id === id ? { ...r, step: Math.min(SEGMENTS, r.step + 1) } : r)),
    );
    onAction(id);
  };

  // 3) Суммарная оценка (тот же глобальный расчёт)
  const totalPpr = rows.reduce((s, r) => s + r.ppr, 0);
  const totalWork = rows.reduce((s, r) => s + r.work, 0);
  const totalOver = rows.reduce((s, r) => s + r.overtimeHours, 0);

  // 4) Конфиг «расскрывашки»
  const expandable: TableExpandableConfig<RowWithStep> = {
    expandIconColumnIndex: -1,
    expandRowByClick: false,
    expandedRowKeys: expandedKey ? [expandedKey] : [],
    expandedRowRender: () => (
      <div className="time-summary-inline">
        Плановая оценка времени:&nbsp;
        <strong>{totalPpr}ч (ППР)</strong>&nbsp;/&nbsp;
        <strong>{totalWork}ч (Работ)</strong>&nbsp;/&nbsp;
        <strong>{totalOver}ч (сверхурочные)</strong>
      </div>
    ),
  };

  // 5) Колонки
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
            onStep={r.date === today ? () => handleStep(r.id) : undefined}
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
            render: (_, _r) => {
              const r = _r as RowWithStep;
              return r.date === today ? (
                <Button type="primary" onClick={(e) => handleStep(r.id, e)}>
                  Приступить
                </Button>
              ) : (
                <div className="action-links">
                  <a onClick={(e) => handleStep(r.id, e)}>К ППР</a>
                  <a onClick={(e) => handleStep(r.id, e)}>Отменить</a>
                </div>
              );
            },
          },
        ]
      : []),
  ];

  return (
    <Table<RowWithStep>
      className="worktable"
      tableLayout="fixed"
      sticky={!isArchive ? { offsetHeader: 64 } : undefined}
      rowKey="id"
      dataSource={rows}
      columns={columns}
      expandable={expandable}
      onRow={(record) => ({
        onClick: (e) => {
          const t = e.target as HTMLElement;
          if (t.closest('.ant-btn') || t.closest('.status-bar-action')) return;
          setExpandedKey((cur) => (cur === record.id ? null : record.id));
        },
      })}
      pagination={false}
      locale={{
        emptyText: <Empty description={isArchive ? 'Нет архивных задач' : 'Нет задач'} />,
      }}
      rowClassName={(r) => (!isArchive && r.date === today ? 'row-today' : '')}
    />
  );
};

export default WorkTable;
