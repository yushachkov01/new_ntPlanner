/**
 * YamlTemplateSelect — компонент для выбора YAML-шаблона из MinIO
 */
import { Select, Spin, Typography, Button } from 'antd';
import yaml from 'js-yaml';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { executorStore } from '@/entities/executor/model/store/executorStore';
import { userStore } from '@/entities/user/model/store/UserStore';
import { listObjects, getObjectText } from '@/shared/minio/MinioClient';
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
  onChange?: (tpl: any) => void;
}> = ({ bucket, prefix = '', value, onChange }) => {
  /** Список загруженных шаблонов */
  const [templates, setTemplates] = useState<any[]>([]);
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
    (async () => {
      setLoading(true);
      try {
        const objs = await listObjects(bucket, prefix);
        const parsed = await Promise.all(
          objs
            .filter((o) => o.Key?.endsWith('.yaml'))
            .map(async (o) => {
              const key = o.Key!;
              const raw = yaml.load(await getObjectText(bucket, key)) as any;
              return { key, name: raw.name ?? key, raw };
            }),
        );
        setTemplates(parsed);
      } finally {
        setLoading(false);
      }
    })();
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
