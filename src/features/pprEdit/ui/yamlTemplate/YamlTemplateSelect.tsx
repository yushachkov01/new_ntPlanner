/**
 * YamlTemplateSelect — компонент для выбора YAML-шаблона из MinIO
 */
import { Select, Spin, Typography, Button } from 'antd';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { executorStore } from '@/entities/executor/model/store/executorStore';
import type { Template } from '@/entities/template/model/store/templateStore';
import { useTemplateStore } from '@/entities/template/model/store/templateStore';
import { userStore } from '@/entities/user/model/store/UserStore';
import AddExecutorModal from '@features/pprEdit/ui/AddExecutorModal/AddExecutorModal';
import './YamlTemplateSelect.css';

/**
 * Параметры компонента:
 * @param bucket  имя бакета в MinIO
 * @param prefix  префикс для фильтрации ключей
 * @param value   выбранный ключ шаблона
 * @param onChange callback при выборе шаблона
 */
export const YamlTemplateSelect: FC<{
  bucket: string;
  prefix?: string;
  value?: string;
  onChange?: (tpl: Template) => void;
}> = ({ bucket, prefix = '', value, onChange }) => {
  /** получаем action и кеш из zustand */
  const fetchTemplates = useTemplateStore((s) => s.fetchTemplates);
  /** Список загруженных шаблонов */
  const [templates, setTemplates] = useState<Template[]>([]);
  /** Флаг загрузки шаблонов */
  const [loading, setLoading] = useState(true);
  const { Text } = Typography;
  /** Текущий пользователь — первый исполнитель */
  const user = userStore((s) => s.user);
  /** Список добавленных исполнителей */
  const added = executorStore((s) => s.addedExecutors);
  /** Функция добавления исполнителя */
  const addExecutor = executorStore((s) => s.addExecutor);
  /** Функция удаления исполнителя */
  const removeExecutor = executorStore((s) => s.removeExecutor);
  /** Флаг открытия модалки выбора исполнителя */
  const [modalOpen, setModalOpen] = useState(false);
  /**
   *  загрузка шаблонов с MinIO при монтировании
   */
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchTemplates(bucket, prefix);
        if (alive) setTemplates(data);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [bucket, prefix]);
  /**
   *  автоматически добавляем текущего пользователя как исполнителя
   * при первом получении информации о user
   */
  useEffect(() => {
    if (user && !added.find((e) => e.id === user.id)) {
      addExecutor({ id: user.id, role: user.role, author: user.author });
    }
  }, [user]);

  if (loading) return <Spin />;

  return (
    <div className="yaml-select-wrapper">
      <Select
        className="yaml-long-field"
        placeholder="Выберите шаблон"
        options={templates.map((t) => ({ value: t.key, label: t.name }))}
        value={value}
        onChange={(k) => {
          const tpl = templates.find((t) => t.key === k)!;
          onChange?.(tpl);
        }}
        showSearch
        optionFilterProp="label"
      />
      {added.map((e) => (
        <div key={e.id} className="yaml-executor-row">
          <div className="yaml-executor-field">
            <Text className="executor-role">{e.role}</Text>
            <input className="yaml-executor-input" value={e.author} readOnly />
          </div>

          <Button
            className="yaml-executor-remove-btn"
            danger
            type="default"
            onClick={() => removeExecutor(e.id)}
          >
            Удалить
          </Button>
        </div>
      ))}

      <div className="yaml-executor-add-row">
        <Button className="yaml-executor-add-btn" onClick={() => setModalOpen(true)}>
          Добавить исполнителя
        </Button>
      </div>

      <AddExecutorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={(id) => {
          const all = Object.values(executorStore.getState().executors).flat();
          const found = all.find((x) => x.id === id);
          if (found) addExecutor(found);
          setModalOpen(false);
        }}
      />
    </div>
  );
};

export default YamlTemplateSelect;
