import { Button, Select, Spin, Typography, message } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import type { FC } from 'react';

import type { Template } from '@/entities/template/model/store/templateStore';
import { templateStore } from '@/entities/template/model/store/templateStore';
import { userStore } from '@/entities/user/model/store/UserStore';
import { useUserStore } from '@/entities/users/model/store/userStore';
import AddExecutorModal from '@/features/pprEdit/ui/AddExecutorModal/AddExecutorModal';
import './YamlTemplateSelect.css';
import useTimelineStore from '@entities/timeline/model/store/timelineStore';
import type { User } from '@entities/users/model/mapping/mapping';

/** перенос блоков при удалении последнего исполнителя */

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
  executors?: User[];
  /** Функция добавления исполнителя */
  addExecutor?: (executor: User) => void;
  /** Функция удаления исполнителя по ID */
  removeExecutor?: (executorId: number) => void;
  minOneExecutorRequired?: boolean;
  hasRows?: boolean;
}

/** Нормализация ФИО/имени так же, как в редакторе */
const normalizeAuthor = (u: any): string => {
  const candidate =
    u?.author ?? u?.fio ?? u?.name ?? `${u?.last_name ?? ''} ${u?.first_name ?? ''}`.trim();
  return candidate && candidate.length > 0 ? candidate : `User ${u?.id ?? ''}`;
};

/** Нормализация роли (если нужна для отображения/логики) */
const normalizeRole = (u: any, rolesDict: Array<{ id: number; name: string }>): string => {
  if (u?.role?.name) return u.role.name;
  if (typeof u?.role === 'string') return u.role;
  const found = rolesDict?.find((r) => r.id === u?.roleId);
  return found?.name ?? '';
};

const YamlTemplateSelect: FC<Props> = ({
  bucket,
  prefix = '',
  value,
  onChange,
  executors = [],
  addExecutor,
  removeExecutor,
}) => {
  const fetchTemplates = templateStore((store) => store.fetchTemplates);
  const { users, roles } = useUserStore();
  const me = userStore((s) => s.user);

  /** метод стора таймлайна для переноса блоков */
  const transferRowBlocks = useTimelineStore((store) => store.transferRowBlocks);

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
    const rawSettings = (selectedTemplate.raw as any)?.settings;
    if (typeof rawSettings !== 'object' || !rawSettings) return [];
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
          (templateItem.raw as any)?.headline ||
          (templateItem.raw as any)?.name ||
          templateItem.templateName,
        template: templateItem,
      })),
    [templateList, prefix],
  );

  /** Показать индикатор загрузки, пока идёт fetch */
  if (isLoading) return <Spin />;

  /** Удаление исполнителя с автоподстановкой текущего пользователя + перенос блоков */
  const handleRemoveExecutor = (executorId: number) => {
    const isLast = executors.length <= 1;

    if (!isLast) {
      removeExecutor?.(executorId);
      return;
    }

    /** если единственный — текущий пользователь, ничего не меняем (оставляем его)*/
    if (me && String(executorId) === String(me.id)) {
      message.info('Нельзя удалить единственного исполнителя — остаётся текущий пользователь.');
      return;
    }

    if (!me) {
      message.warning('Не найден текущий пользователь. Удаление последнего исполнителя запрещено.');
      return;
    }

    const author = normalizeAuthor(me);
    const roleName = normalizeRole(me, roles);

    if (!executors.some((ex) => String(ex.id) === String(me.id))) {
      addExecutor?.({ id: me.id, author, role: roleName } as User);
    }

    try {
      transferRowBlocks({ fromExecId: executorId, toExecId: me.id });
    } catch (e) {
      console.warn('[YamlTemplateSelect] transferRowBlocks failed:', e);
    }

    /** удаляем выбранного исполнителя из списка */
    removeExecutor?.(executorId);
  };

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
            <Text className="executor-role">Сетевой инженер</Text>
            <Text className="yaml-executor-input">{normalizeAuthor(executorItem)}</Text>
          </div>
          <Button
            danger
            type="default"
            className="yaml-executor-remove-btn"
            onClick={() => handleRemoveExecutor(executorItem.id)}
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
          const foundExecutor = users.find((u) => u.id === executorId);
          if (foundExecutor && addExecutor) {
            const author = normalizeAuthor(foundExecutor);
            const roleName = normalizeRole(foundExecutor, roles);
            addExecutor({ id: foundExecutor.id, author, role: roleName } as User);
          }
          setAddExecutorModalOpen(false);
        }}
      />
    </div>
  );
};

export default YamlTemplateSelect;
