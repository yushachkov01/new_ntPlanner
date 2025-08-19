import { Button, Select, Spin, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import type { FC } from 'react';
import YAML from 'yaml';

import type { Template } from '@/entities/template/model/store/templateStore';
import { templateStore } from '@/entities/template/model/store/templateStore';
import { userStore } from '@/entities/user/model/store/UserStore';
import { useUserStore } from '@/entities/users/model/store/userStore';
import './YamlTemplateSelect.css';
import AddSelectedFromTabModal from '@/features/pprEdit/ui/AddSelectedFromTabModal/AddSelectedFromTabModal';
import { getObjectText } from '@/shared/minio/MinioClient';
import useTimelineStore from '@entities/timeline/model/store/timelineStore';
import type { User } from '@entities/users/model/mapping/mapping';

/** перенос блоков при удалении последнего исполнителя */

import * as jsYaml from 'js-yaml';

interface Props {
  bucket: string;
  prefix?: string;
  value?: string;
  onChange?: (template: Template) => void;
  executors?: User[];
  /** кандидаты из вкладки «Исполнители» (ровно то, что выбрал пользователь в табе) */
  tabCandidates?: User[];
  addExecutor?: (executor: User) => void;
  removeExecutor?: (executorId: number) => void;

  /** оставлено для совместимости пропсов, в логике не используется */
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

/**  аккуратная склейка префикса и имени файла */
const joinKey = (prefix?: string, name?: string) => {
  const p = (prefix ?? '').replace(/^\/+|\/+$/g, '');
  const n = (name ?? '').replace(/^\/+/, '');
  return p ? `${p}/${n}` : n;
};

/** из Template пытаемся получить возможные objectKey в MinIO */
const resolveObjectKeyCandidates = (tpl: Template, prefix: string | undefined): string[] => {
  const list: string[] = [];
  const anyTpl = tpl as any;

  if (anyTpl?.objectKey) list.push(String(anyTpl.objectKey));
  if (anyTpl?.key && String(anyTpl.key).includes('/')) list.push(String(anyTpl.key));

  const base = anyTpl?.templateName || anyTpl?.key || '';
  if (base) {
    list.push(joinKey(prefix, `${base}.yaml`));
    list.push(joinKey(prefix, `${base}.yml`));
  }
  return Array.from(new Set(list.filter(Boolean)));
};

const parseYamlToObject = (text: string) => {
  try {
    return YAML.parse(text);
  } catch {}
  try {
    return jsYaml.load(text) as any;
  } catch {}
  return undefined;
};

const YamlTemplateSelect: FC<Props> = ({
  bucket,
  prefix = '',
  value,
  onChange,
  executors = [],
  tabCandidates = [],
  addExecutor,
  removeExecutor,
}) => {
  const fetchTemplates = templateStore((store) => store.fetchTemplates);
  const { users, roles } = useUserStore();
  const me = userStore((store) => store.user);

  /** метод стора таймлайна для переноса блоков */
  const transferRowBlocks = useTimelineStore((store) => store.transferRowBlocks);

  const [templateList, setTemplateList] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const { Text } = Typography;

  /** загрузка списка шаблонов */
  useEffect(() => {
    let isActive = true;
    (async () => {
      setIsLoading(true);
      const fetched = await fetchTemplates(bucket, prefix);
      if (isActive) setTemplateList(fetched);
      setIsLoading(false);
    })();
    return () => {
      isActive = false;
    };
  }, [bucket, prefix, fetchTemplates]);

  /** роли, допустимые для исполнителей, из выбранного шаблона */
  const filterRoles = useMemo(() => {
    if (!selectedTemplate) return [];
    const rawSettings = (selectedTemplate.raw as any)?.settings;
    if (typeof rawSettings !== 'object' || !rawSettings) return [];
    return Object.values(rawSettings)
      .map((s: any) => s?.engineer)
      .filter((r: any) => typeof r === 'string');
  }, [selectedTemplate]);

  /** опции выбора шаблонов */
  const selectOptions = useMemo(
    () =>
      templateList.map((templateItem, index) => ({
        value: `${prefix}${(templateItem as any)?.templateName ?? (templateItem as any)?.key ?? 'tpl'}#${index}`,
        label:
          (templateItem.raw as any)?.headline ||
          (templateItem.raw as any)?.name ||
          templateItem?.templateName ||
          (templateItem as any)?.key,
        template: templateItem,
      })),
    [templateList, prefix],
  );

  /** кандидаты для модалки: из таба, иначе — executors этого шаблона */
  const modalCandidates = useMemo(() => {
    const base = (tabCandidates?.length ? tabCandidates : executors) as any[];
    if (!filterRoles.length) return base;
    return base.filter((u) =>
      filterRoles.includes(typeof u?.role === 'string' ? u.role : u?.role?.name),
    );
  }, [tabCandidates, executors, filterRoles]);

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

  /** при выборе шаблона — гарантированно поднимаем объект с key и raw */
  const handleTemplatePick = async (val: string) => {
    const opt = selectOptions.find((o) => o.value === val);
    if (!opt) return;

    const tpl = opt.template as any;
    const keyFromValue = String(val).split('#')[0].replace(prefix, '');
    const ensuredKey = tpl?.key ?? tpl?.templateName ?? keyFromValue;

    /** если raw уже объект — поднимаем как есть (и гарантируем key) */
    if (tpl?.raw && typeof tpl.raw === 'object') {
      const enriched = { ...tpl, key: ensuredKey } as Template;
      setSelectedTemplate(enriched);
      onChange?.(enriched);
      return;
    }

    /**  Читем YAML из MinIO по кандидатам ключей */
    const candidates = resolveObjectKeyCandidates(tpl as Template, prefix);
    if (!candidates.length) {
      console.error('[YamlTemplateSelect] Не могу определить путь до YAML для шаблона', tpl);
      message.error('Не удалось определить путь до шаблона.');
      return;
    }

    let parsed: any | undefined;
    for (const objectKey of candidates) {
      const text = await getObjectText(bucket, objectKey);
      if (text && String(text).trim().length > 0) {
        parsed = parseYamlToObject(String(text));
        if (parsed && typeof parsed === 'object') {
          tpl.objectKey = objectKey;
          break;
        }
      }
    }

    if (!parsed) {
      console.error(
        '[YamlTemplateSelect] Не удалось прочитать YAML ни по одному пути:',
        candidates,
      );
      message.error('Не удалось загрузить файл шаблона.');
      return;
    }

    /** поднимаем шаблон С KEY и С ОБЪЕКТОМ raw */
    const enriched: Template = { ...(tpl as Template), key: ensuredKey, raw: parsed } as Template;
    setSelectedTemplate(enriched);
    onChange?.(enriched);
  };

  return (
    <div className="yaml-select-wrapper">
      {isLoading ? (
        <Spin />
      ) : (
        <>
          <Select
            className="yaml-long-field"
            placeholder="Выберите шаблон"
            showSearch
            optionFilterProp="label"
            options={selectOptions.map((option) => ({ value: option.value, label: option.label }))}
            value={value}
            onChange={handleTemplatePick}
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
            <Button onClick={() => setModalOpen(true)}>Добавить исполнителя</Button>
          </div>

          <AddSelectedFromTabModal
            open={isModalOpen}
            onClose={() => setModalOpen(false)}
            candidates={modalCandidates}
            onSelect={(id) => {
              const picked =
                (modalCandidates as any[]).find((u) => String(u.id) === String(id)) ||
                (users as any[]).find((u) => String(u.id) === String(id));

              if (picked && addExecutor) {
                const author = normalizeAuthor(picked);
                const roleName = normalizeRole(picked, roles);
                addExecutor({ id: picked.id, author, role: roleName } as User);
              } else {
                message.info('Все выбранные в табе уже добавлены.');
              }
              setModalOpen(false);
            }}
          />
        </>
      )}
    </div>
  );
};

export default YamlTemplateSelect;
