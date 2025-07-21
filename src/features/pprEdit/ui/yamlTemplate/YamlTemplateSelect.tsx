import { Select, Spin, Typography, Button } from 'antd';
import type { FC } from 'react';
import { useEffect, useState, useMemo } from 'react';

import type { Executor } from '@/entities/executor/model/store/executorStore';
import { executorStore } from '@/entities/executor/model/store/executorStore';
import type { Template } from '@/entities/template/model/store/templateStore';
import { useTemplateStore } from '@/entities/template/model/store/templateStore';
import AddExecutorModal from '@/features/pprEdit/ui/AddExecutorModal/AddExecutorModal';
import './YamlTemplateSelect.css';

interface Props {
  /** Имя «бакета» для запроса списка YAML‑шаблонов */
  bucket: string;
  /** Префикс для фильтрации или группировки шаблонов */
  prefix?: string;
  /** Текущее значение (value) Select */
  value?: string;
  /** Колбэк при выборе нового шаблона */
  onChange?: (template: Template) => void;
  /** Список текущих исполнителей для шаблона */
  executors?: Executor[];
  /** Функция добавления исполнителя */
  addExecutor?: (executor: Executor) => void;
  /** Функция удаления исполнителя по ID */
  removeExecutor?: (executorId: number) => void;
}

/**
 * Компонент выбора YAML‑шаблона и управления сопутствующими исполнителями.
 */
const YamlTemplateSelect: FC<Props> = ({
  bucket,
  prefix = '',
  value,
  onChange,
  executors = [],
  addExecutor,
  removeExecutor,
}) => {
  const fetchTemplates = useTemplateStore((store) => store.fetchTemplates);

  /** Состояние списка шаблонов, индикатор загрузки и выбор модалки */
  const [templateList, setTemplateList] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddExecutorModalOpen, setAddExecutorModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const { Text } = Typography;

  /**
   * загрузка списка шаблонов при монтировании и
   * изменении bucket
   */
  useEffect(() => {
    let isActive = true;
    (async () => {
      setIsLoading(true);
      const fetched = await fetchTemplates(bucket, prefix);
      if (isActive) {
        setTemplateList(fetched);
      }
      setIsLoading(false);
    })();
    return () => {
      isActive = false;
    };
  }, [bucket, prefix, fetchTemplates]);

  /**
   * вычисление списка ролей для фильтрации исполнителей
   * на основе настроек выбранного шаблона
   */
  const filterRoles = useMemo(() => {
    if (!selectedTemplate) return [];
    const rawSettings = (selectedTemplate.raw as any).settings;
    if (!rawSettings || typeof rawSettings !== 'object') return [];
    return Object.values(rawSettings)
      .map((setting: any) => setting.engineer)
      .filter((roleName: any) => typeof roleName === 'string');
  }, [selectedTemplate]);

  /**
   * подготовка опций для Select на основе загруженных шаблонов
   */
  const selectOptions = useMemo(
    () =>
      templateList.map((templateItem, index) => ({
        value: `${prefix}${templateItem.templateName}#${index}`,
        label:
          (templateItem.raw as any)?.headline ??
          (templateItem.raw as any)?.name ??
          templateItem.templateName,
        template: templateItem,
      })),
    [templateList, prefix],
  );

  /** Показать индикатор загрузки, пока идёт fetch */
  if (isLoading) {
    return <Spin />;
  }

  return (
    <div className="yaml-select-wrapper">
      <Select
        className="yaml-long-field"
        placeholder="Выберите шаблон"
        showSearch
        optionFilterProp="label"
        options={selectOptions.map((option) => ({
          value: option.value,
          label: option.label,
        }))}
        value={value}
        onChange={(selectedValue) => {
          const option = selectOptions.find((opt) => opt.value === selectedValue)!;
          setSelectedTemplate(option.template);
          onChange?.(option.template);
        }}
      />

      {executors.map((executorItem) => (
        <div key={executorItem.id} className="yaml-executor-row">
          <div className="yaml-executor-field">
            <Text className="executor-role">{executorItem.role}</Text>
            <input className="yaml-executor-input" value={executorItem.author} readOnly />
          </div>
          <Button
            danger
            type="default"
            className="yaml-executor-remove-btn"
            onClick={() => removeExecutor?.(executorItem.id)}
          >
            Удалить
          </Button>
        </div>
      ))}

      <div className="yaml-executor-add-row">
        <Button onClick={() => setAddExecutorModalOpen(true)}>Добавить исполнителя</Button>
      </div>

      <AddExecutorModal
        open={isAddExecutorModalOpen}
        onClose={() => setAddExecutorModalOpen(false)}
        filterRoles={filterRoles}
        onSelect={(executorId) => {
          const foundExecutor = Object.values(executorStore.getState().executors)
            .flat()
            .find((exec) => exec.id === executorId);
          if (foundExecutor) {
            addExecutor?.(foundExecutor);
          }
          setAddExecutorModalOpen(false);
        }}
      />
    </div>
  );
};

export default YamlTemplateSelect;
