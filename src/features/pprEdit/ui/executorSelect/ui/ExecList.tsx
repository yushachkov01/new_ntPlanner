import React, { useEffect, useMemo, useState } from "react";
import { List, Spin, Input, Pagination } from "antd";
import "./ExecList.css";

/**
 * модель исполнителя, которую мы выводим в списке
 */
export interface ExecutorLite {
  id: number;
  author: string;
  role: string;
}

export interface ExecListProps {
  /**
   * Массив исполнителей
   */
  data?: ExecutorLite[];
  /**
   * Если data пустая — вызываем onLoad(), чтобы подтянуть данные
   */
  onLoad: () => void;
  /**
   * Клик по строке → возвращаем выбранный id родителю
   */
  onSelect: (id: number) => void;
}

/**
 * Сколько строк показываем на странице
 */
const PAGE_SIZE = 5;

const ExecList: React.FC<ExecListProps> = ({ data, onLoad, onSelect }) => {
  /**
   * Загрузка данных при первом монтировании
   */
  useEffect(() => {
    if (!data) {
      onLoad();
    }
  }, [data, onLoad]);

  /** Текст поиска */
  const [query, setQuery] = useState("");
  /** Номер текущей страницы */
  const [page, setPage] = useState(1);

  /**
   *  нормализовать строку для сравнения
   */
  const clean = (s: string) => s.toLowerCase().replace(/\s+/g, "");

  /**
   * Вычисляем отфильтрованный массив и общее число элементов
   */
  const { total, slice } = useMemo(() => {
    if (!data) {
      return { total: 0, slice: [] as ExecutorLite[] };
    }
    const normalizedQuery = clean(query);
    const filtered = normalizedQuery
        ? data.filter((it) => clean(it.author).includes(normalizedQuery))
        : data;
    const from = (page - 1) * PAGE_SIZE;
    return {
      total: filtered.length,
      slice: filtered.slice(from, from + PAGE_SIZE),
    };
  }, [data, query, page]);

  /**
   * Если после фильтрации на текущей странице нет элементов — сбрасываем на первую
   */
  useEffect(() => {
    if (page > 1 && slice.length === 0) {
      setPage(1);
    }
  }, [slice, page]);

  /**
   * Пока данные ещё не пришли — отображаем спиннер
   */
  if (!data) {
    return <Spin />;
  }

  return (
      <>
        <Input.Search
            placeholder="Поиск исполнителя..."
            allowClear
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            style={{ marginBottom: 12 }}
        />
        <List
            bordered
            dataSource={slice}
            renderItem={(item) => (
                <List.Item
                    onClick={() => onSelect(item.id)}
                    style={{ cursor: "pointer" }}
                >
                  {item.author}
                </List.Item>
            )}
            locale={{ emptyText: "Не найдено" }}
            style={{ marginBottom: 12 }}
        />
        <Pagination
            className="exec-pagination"
            size="small"
            current={page}
            pageSize={PAGE_SIZE}
            total={total}
            onChange={setPage}
            showSizeChanger={false}
            hideOnSinglePage={false}
        />
      </>
  );
};

export default ExecList;
