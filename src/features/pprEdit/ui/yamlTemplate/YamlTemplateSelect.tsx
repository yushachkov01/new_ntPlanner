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

const { Text } = Typography;

const ROLE_NET = 'Сетевой инженер';
const ROLE_SMR = 'Инженер СМР';
const ROLE_CUST = 'Представитель Заказчика';
const ROLES_ORDER = [ROLE_NET, ROLE_SMR, ROLE_CUST] as const;

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

interface Props {
  bucket: string;
  prefix?: string;
  value?: string;
  onChange?: (template: Template) => void;

  /** общий пул уже добавленных исполнителей (каждый со своей ролью) */
  executors?: User[];
  /** кандидаты из вкладки «Исполнители» (ровно то, что выбрал пользователь в табе) */
  tabCandidates?: User[];
  addExecutor?: (executor: User) => void;
  removeExecutor?: (executorId: number) => void;

  minOneExecutorRequired?: boolean;
  hasRows?: boolean;
}

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

  /* executors by role */
  const roleBuckets = useMemo(() => {
    const toRoleName = (user: any) => normalizeRole(user, roles);
    return {
      [ROLE_NET]: executors.filter((user) => toRoleName(user) === ROLE_NET),
      [ROLE_SMR]: executors.filter((user) => toRoleName(user) === ROLE_SMR),
      [ROLE_CUST]: executors.filter((user) => toRoleName(user) === ROLE_CUST),
    };
  }, [executors, roles]);

  const modalCandidates = useMemo(() => tabCandidates ?? [], [tabCandidates]);

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
    } catch {}
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
      message.error('Не удалось загрузить файл шаблона.');
      return;
    }

    const enriched: Template = { ...(tpl as Template), key: ensuredKey, raw: parsed } as Template;
    setSelectedTemplate(enriched);
    onChange?.(enriched);
  };

  /** маппинг роли в класс цветного индикатора (те же цвета, что на таймлайне) */
  const roleChipClass = (roleTitle: (typeof ROLES_ORDER)[number]) => {
    if (roleTitle === ROLE_NET) return 'yaml-role-chip--engineer';
    if (roleTitle === ROLE_SMR) return 'yaml-role-chip--installer';
    if (roleTitle === ROLE_CUST) return 'yaml-role-chip--auditor';
    return '';
  };

  /** колонка роли: заголовок + список исполнителей этой роли */
  const renderRoleColumn = (roleTitle: (typeof ROLES_ORDER)[number]) => {
    const list = roleBuckets[roleTitle] || [];

    /** если исполнителей этой роли нет — ничего не показываем */
    if (list.length === 0) return null;

    return (
      <div className="yaml-role-col" key={roleTitle}>
        <div className="yaml-executor-row">
          <div className="yaml-executor-field">
            <Text className="executor-role">
              {roleTitle}
              <span className={`yaml-role-chip ${roleChipClass(roleTitle)}`} />
            </Text>
          </div>
        </div>

        {list.map((exe) => (
          <div key={`${roleTitle}-${exe.id}`} className="yaml-executor-row">
            <div className="yaml-executor-field">
              <input className="yaml-executor-input" value={normalizeAuthor(exe)} readOnly />
            </div>
            <Button
              danger
              type="default"
              className="yaml-executor-remove-btn"
              onClick={() => handleRemoveExecutor(exe.id)}
            >
              Удалить
            </Button>
          </div>
        ))}
      </div>
    );
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

          <div className="yaml-roles-inline">{ROLES_ORDER.map(renderRoleColumn)}</div>

          <div className="yaml-executor-add-row">
            <Button
              onClick={() => setModalOpen(true)}
              disabled={(modalCandidates ?? []).length === 0}
            >
              Добавить исполнителя
            </Button>
          </div>

          <AddSelectedFromTabModal
            open={isModalOpen}
            onClose={() => setModalOpen(false)}
            candidates={modalCandidates}
            onSelect={(id) => {
              const picked =
                (modalCandidates as any[]).find((u) => String(u.id) === String(id)) ||
                (users as any[]).find((u) => String(u.id) === String(id));

              if (!picked) {
                message.warning('Не удалось найти выбранного исполнителя.');
                return;
              }

              if (executors.some((e) => String(e.id) === String(picked.id))) {
                message.info('Этот исполнитель уже добавлен.');
                return;
              }

              const author = normalizeAuthor(picked);
              const roleName = normalizeRole(picked, roles);
              addExecutor?.({ id: (picked as any).id, author, role: roleName } as User);
            }}
          />
        </>
      )}
    </div>
  );
};

export default YamlTemplateSelect;
