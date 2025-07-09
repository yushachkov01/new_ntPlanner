import { List, Spin } from 'antd';
import React, { useEffect } from 'react';

/** «упрощённая» модель исполнителя, которую мы выводим в списке */
export interface ExecutorLite {
  id: number;
  author: string;
  role: string;
}

export interface ExecListProps {
  /** массив исполнителей  */
  data?: ExecutorLite[];
  /** если data пустая — вызываем onLoad(), чтобы подтянуть данные */
  onLoad: () => void;
  /** клик по строке → возвращаем выбранный id родителю */
  onSelect: (id: number) => void;
}
/**
 * Отрисовывает список исполнителей внутри вкладки модалки.
 * Если данных ещё нет — показывает <Spin/>.
 */
const ExecList: React.FC<ExecListProps> = ({ data, onLoad, onSelect }) => {
  /* при первой отрисовке (data === undefined) — подгружаем исполнителей */
  useEffect(() => {
    if (!data) onLoad();
  }, [data, onLoad]);

  if (!data) return <Spin />;

  return (
    <List
      bordered
      dataSource={data}
      style={{ maxHeight: 260, overflowY: 'auto' }}
      renderItem={(item) => (
        <List.Item onClick={() => onSelect(item.id)} style={{ cursor: 'pointer' }}>
          {item.author}
        </List.Item>
      )}
    />
  );
};

export default ExecList;
