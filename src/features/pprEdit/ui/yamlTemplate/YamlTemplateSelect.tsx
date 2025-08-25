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
import useTimelineStore, { toRowId as toRow } from '@entities/timeline/model/store/timelineStore';
import type { User } from '@entities/users/model/mapping/mapping';

/** перенос блоков при удалении последнего исполнителя */

import * as jsYaml from 'js-yaml';

const { Text } = Typography;

const ROLE_NET = 'Сетевой инженер';
const ROLE_SMR = 'Инженер СМР';
const ROLE_CUST = 'Представитель Заказчика';
const ROLES_ORDER = [ROLE_NET, ROLE_SMR, ROLE_CUST] as const;

/** Нормализация ФИО/имени так же, как в редакторе */
const normalizeAuthor = (user: any): string => {
  const candidate =
    user?.author ??
    user?.fio ??
    user?.name ??
    `${user?.last_name ?? ''} ${user?.first_name ?? ''}`.trim();
  return candidate && candidate.length > 0 ? candidate : `User ${user?.id ?? ''}`;
};

/** Нормализация роли ( нужна для отображения/логики) */
const normalizeRoleTitle = (user: any, rolesDict: Array<{ id: number; name: string }>): string => {
  if (user?.role?.name) return user.role.name;
  if (typeof user?.role === 'string') return user.role;
  const foundRole = rolesDict?.find((role) => role.id === user?.roleId);
  return foundRole?.name ?? '';
};

/**  аккуратная склейка префикса и имени файла */
const joinKey = (prefix?: string, name?: string) => {
  const cleanedPrefix = (prefix ?? '').replace(/^\/+|\/+$/g, '');
  const cleanedName = (name ?? '').replace(/^\/+/, '');
  return cleanedPrefix ? `${cleanedPrefix}/${cleanedName}` : cleanedName;
};

/** из Template пытаемся получить возможные objectKey в MinIO */
const resolveObjectKeyCandidates = (
  templateItem: Template,
  prefix: string | undefined,
): string[] => {
  const candidates: string[] = [];
  const templateAny = templateItem as any;
  if (templateAny?.objectKey) candidates.push(String(templateAny.objectKey));
  if (templateAny?.key && String(templateAny.key).includes('/'))
    candidates.push(String(templateAny.key));
  const baseName = templateAny?.templateName || templateAny?.key || '';
  if (baseName) {
    candidates.push(joinKey(prefix, `${baseName}.yaml`));
    candidates.push(joinKey(prefix, `${baseName}.yml`));
  }
  return Array.from(new Set(candidates.filter(Boolean)));
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
  const fetchTemplates = templateStore((state) => state.fetchTemplates);
  const { users, roles } = useUserStore();
  const me = userStore((state) => state.user);

  const [templateList, setTemplateList] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);

  /** загрузка списка шаблонов */
  useEffect(() => {
    let isActive = true;
    (async () => {
      setIsLoading(true);
      const fetchedTemplates = await fetchTemplates(bucket, prefix);
      if (isActive) setTemplateList(fetchedTemplates);
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
    const roleTitle = (user: any) => normalizeRoleTitle(user, roles);
    return {
      [ROLE_NET]: executors.filter((executor) => roleTitle(executor) === ROLE_NET),
      [ROLE_SMR]: executors.filter((executor) => roleTitle(executor) === ROLE_SMR),
      [ROLE_CUST]: executors.filter((executor) => roleTitle(executor) === ROLE_CUST),
    };
  }, [executors, roles]);

  const modalCandidates = useMemo(() => tabCandidates ?? [], [tabCandidates]);

  /** Удаление исполнителя с автоподстановкой текущего пользователя + перенос блоков */
  const handleRemoveExecutor = (executorId: number) => {
    const currentList = executors ?? [];
    const targetExecutor = currentList.find(
      (executor) => String(executor.id) === String(executorId),
    );
    const isNetwork = targetExecutor
      ? normalizeRoleTitle(targetExecutor, roles) === ROLE_NET
      : false;
    const netCount = currentList.filter(
      (executor) => normalizeRoleTitle(executor, roles) === ROLE_NET,
    ).length;

    if (isNetwork && netCount <= 1) {
      message.info('Должен остаться хотя бы один Сетевой инженер.');
      return;
    }
    removeExecutor?.(executorId as any);
  };
  const handleTemplatePick = async (selectedValue: string) => {
    const selectedOption = selectOptions.find((option) => option.value === selectedValue);
    if (!selectedOption) return;

    const templateItem = selectedOption.template as any;
    const keyFromValue = String(selectedValue).split('#')[0].replace(prefix, '');
    const ensuredKey = templateItem?.key ?? templateItem?.templateName ?? keyFromValue;

    if (templateItem?.raw && typeof templateItem.raw === 'object') {
      const enrichedExisting = { ...templateItem, key: ensuredKey } as Template;
      onChange?.(enrichedExisting);
      return;
    }
    /**  Читем YAML из MinIO по кандидатам ключей */
    const candidates = resolveObjectKeyCandidates(templateItem as Template, prefix);
    if (!candidates.length) {
      message.error('Не удалось определить путь до шаблона.');
      return;
    }

    let parsedYaml: any | undefined;
    for (const objectKey of candidates) {
      const fileText = await getObjectText(bucket, objectKey);
      if (fileText && String(fileText).trim().length > 0) {
        parsedYaml = parseYamlToObject(String(fileText));
        if (parsedYaml && typeof parsedYaml === 'object') {
          (templateItem as any).objectKey = objectKey;
          break;
        }
      }
    }
    if (!parsedYaml) {
      message.error('Не удалось загрузить файл шаблона.');
      return;
    }

    const enrichedTemplate: Template = {
      ...(templateItem as Template),
      key: ensuredKey,
      raw: parsedYaml,
    } as Template;
    onChange?.(enrichedTemplate);
  };

  /**
   * Подписка на изменения таймлайна: отслеживаем переносы блоков между строками
   */
  useEffect(() => {
    const timelineApi = useTimelineStore as any;

    const placementOf = (rows?: any[]) => {
      const placementMap = new Map<number, number>();
      (rows ?? []).forEach((row) =>
        (row.blocks ?? []).forEach((block: any) => placementMap.set(block.id, row.id)),
      );
      return placementMap;
    };

    let lastPlacement = placementOf(timelineApi.getState()?.rows);
    console.log('[YAML][SUB] init placement size:', lastPlacement.size);

    const unsubscribe = timelineApi.subscribe((state: any) => {
      const nextPlacement = placementOf(state?.rows);
      const blockMoves: Array<{ blockId: number; fromRowId: number; toRowId: number }> = [];

      for (const [blockId, fromRowId] of lastPlacement.entries()) {
        const toRowIdNow = nextPlacement.get(blockId);
        if (toRowIdNow != null && toRowIdNow !== fromRowId) {
          blockMoves.push({ blockId, fromRowId, toRowId: toRowIdNow });
        }
      }

      if (blockMoves.length) {
        const uniquePairs = Array.from(
          new Map(
            blockMoves.map((move) => [
              `${move.fromRowId}->${move.toRowId}`,
              { from: move.fromRowId, to: move.toRowId },
            ]),
          ).values(),
        );

        const isNet = (executor: User) => normalizeRoleTitle(executor, roles) === ROLE_NET;

        for (const { from, to } of uniquePairs) {
          const indexFrom = executors.findIndex(
            (executor) => toRow(executor.id) === from && isNet(executor),
          );
          if (indexFrom === -1) continue;

          const byRow = (arr?: any[]) => (arr ?? []).find((user) => toRow(user.id) === to);
          const toUser =
            byRow(users as any[]) ||
            byRow(tabCandidates as any[]) ||
            (me && toRow(me.id) === to ? me : null);

          if (!toUser) continue;

          const alreadyExists = executors.some(
            (executor) => isNet(executor) && toRow(executor.id) === to,
          );
          if (!alreadyExists) {
            try {
              addExecutor?.({
                id: (toUser as any).id,
                author: normalizeAuthor(toUser),
                role: ROLE_NET,
              } as User);
            } catch (err) {}
          }

          try {
            removeExecutor?.(executors[indexFrom].id as any);
          } catch (err) {}
        }
      }

      lastPlacement = nextPlacement;
    });

    return () => {
      try {
        unsubscribe?.();
      } catch {}
    };
  }, [executors, roles, users, tabCandidates, me, addExecutor, removeExecutor, roleBuckets]);

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

        {list.map((executor) => (
          <div key={`${roleTitle}-${executor.id}`} className="yaml-executor-row">
            <div className="yaml-executor-field">
              <input className="yaml-executor-input" value={normalizeAuthor(executor)} readOnly />
            </div>
            <Button
              danger
              type="default"
              className="yaml-executor-remove-btn"
              onClick={() => handleRemoveExecutor(executor.id as any)}
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
            onSelect={(selectedId) => {
              const pickedUser =
                (modalCandidates as any[]).find((u) => String(u.id) === String(selectedId)) ||
                (users as any[]).find((u) => String(u.id) === String(selectedId));

              if (!pickedUser) {
                message.warning('Не удалось найти выбранного исполнителя.');
                return;
              }

              if (
                executors.some((executor) => String(executor.id) === String((pickedUser as any).id))
              ) {
                message.info('Этот исполнитель уже добавлен.');
                return;
              }

              const author = normalizeAuthor(pickedUser);
              const roleName = normalizeRoleTitle(pickedUser, roles);
              addExecutor?.({ id: (pickedUser as any).id, author, role: roleName } as User);
            }}
          />
        </>
      )}
    </div>
  );
};

export default YamlTemplateSelect;
