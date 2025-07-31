import { Select, Spin } from 'antd';
import type { FC } from 'react';
import { useEffect } from 'react';

import type { PlannedTask } from '@/entities/PlannedTask/model/store/plannedTaskStore';
import { usePlannedTaskStore } from '@/entities/PlannedTask/model/store/plannedTaskStore';

interface Props {
  value?: string;

  /**
   * Колбэк при смене выбора задачи
   * @param id - идентификатор выбранной задачи
   */
  onChange: (id: string) => void;
}

/**
 * Выпадающий список с выбором планируемой задачи
 * загружает список задач при монтировании
 * показывает спиннер во время загрузки
 * обрабатывает ошибку и отсутствие задач
 */
export const PlannedTaskDropdown: FC<Props> = ({ value, onChange }) => {
  /**
   * Состояние стора планируемых задач:
   * tasks - массив задач
   * loading - флаг загрузки
   * error - объект ошибки
   * load - метод загрузки задач
   */
  const { tasks, loading, error, load } = usePlannedTaskStore();

  /**
   * Загружаем задачи при первом рендере
   */
  useEffect(() => {
    load();
  }, [load]);

  /**
   *  Показываем индикатор загрузки, если запрос в процессе
   */
  if (loading) return <Spin />;

  /**
   *  Отображаем ошибку при неудачной загрузке
   */
  if (error) return <div style={{ color: 'red' }}>{error.message}</div>;

  /**
   *  Если задач нет — выводим сообщение
   */
  if (!tasks.length) return <div>Нет задач</div>;

  /**
   * Формируем опции для Select: value=id, label=name
   */
  const options = tasks.map((t: PlannedTask) => ({ value: t.id, label: t.name }));

  return (
    <Select
      placeholder="Список выбранных планируемых работ"
      value={value}
      style={{ width: '30%' }}
      onChange={onChange}
      options={options}
    />
  );
};
