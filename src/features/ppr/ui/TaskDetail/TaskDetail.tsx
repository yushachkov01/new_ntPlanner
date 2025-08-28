import { Collapse } from 'antd';
import type { FC } from 'react';
import { useMemo } from 'react';

import type { StageField } from '@/entities/template/model/store/templateStore';
import { ROLE_COLORS, ROLE_SWATCH_DEFAULT_COLOR } from '@/shared/constants';
import Tag from '@/shared/ui/Tag/Tag';
import {
  buildFullStageOrder,
  buildIncomingTypeMap,
  type IncomingType,
} from '@/shared/utils/stageGraph';
import {
  getByPath,
  interpolate,
  extractPlaceholderRoots,
  buildParamsFromSingleRow,
  addMinutesToTime,
  normalizeAuthor,
  toCanonicalRole,
} from '@/shared/utils/TaskDetailUtils';
import useTimelineStore from '@entities/timeline/model/store/timelineStore';
import { getStageMinutes } from '@entities/timeline/model/utils/time';
import { useUserStore } from '@entities/users/model/store/userStore';
import type { TaskDetailProps } from '@features/ppr/model/types';
import './TaskDetail.css';
import { useSyncedOpenKeys } from '@features/ppr/model/hooks/useSyncedOpenKeys';
import type { SimpleUser } from '@features/ppr/ui/StagePanel/StagePanel';
import { StagePanel } from '@features/ppr/ui/StagePanel/StagePanel';

/**
 * Свойства компонента TaskDetail
 */
interface Props extends TaskDetailProps {
  stageKeys?: string[];
  stagesField?: Record<string, StageField>;
  onTimerChange?: (stageKey: string, newTimer: number) => void;

  /** ОДНА строка, принадлежащая текущему блоку */
  displayHeaders?: string[];
  displayRow?: string[];
  displayColKeys?: string[];
}

/**
 * Контейнер TaskDetail отвечает за:
 * - построение порядка этапов и типов «входа» (success/failure),
 * - управление открытыми панелями Collapse,
 */
const TaskDetail: FC<Props> = ({
  label,
  startTime,
  stageKeys = [],
  stagesField = {},
  onClose,
  onTimerChange,
  displayHeaders = [],
  displayRow = [],
  displayColKeys = [],
}) => {
  /** актуальные строки таймлайна */
  const rows = useTimelineStore((s) => s.rows ?? []);
  /** справочник пользователей */
  const allUsers = useUserStore((s: any) => s.users ?? []);
  /** явно выбранные исполнители */
  const addedExecutors = useUserStore((s: any) => s.addedExecutors ?? []) as Array<{
    id: string | number;
    author?: string;
    fio?: string;
    name?: string;
    last_name?: string;
    first_name?: string;
    role?: string;
  }>;

  /** Расчёт длительности задачи в минутах */
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const endTime = '00:00';
  const [endHour, endMinute] = endTime.split(':').map(Number);
  const durationMinutes = endHour * 60 + endMinute - (startHour * 60 + startMinute);

  /** Порядок стадий для отображения (детерминированный). */
  const fullStageOrder = useMemo(() => buildFullStageOrder(stagesField), [stagesField]);
  /** Тип «входа» в каждую стадию (success/failure) — для иконки слева. */
  const incomingType = useMemo(() => buildIncomingTypeMap(stagesField), [stagesField]);
  /** Первая (стартовая) стадия — помечаем как success. */
  const startStageKey = fullStageOrder[0];

  /**
   * Управление открытыми панелями Collapse:
   * - поддерживаем мульти-раскрытие,
   * - синхронизируемся с внешним `stageKeys[0]` (клик на таймлайне).
   */
  const [openKeys, setOpenKeys] = useSyncedOpenKeys(fullStageOrder, stageKeys?.[0]);

  /**  контекст подстановки для текущего блока  */
  const placeholderRoots = useMemo(() => extractPlaceholderRoots(stagesField), [stagesField]);

  const paramsContext = useMemo(
    () => buildParamsFromSingleRow(placeholderRoots, displayColKeys, displayHeaders, displayRow),
    [placeholderRoots, displayColKeys, displayHeaders, displayRow],
  );

  const interpCtx = useMemo(() => ({ ...paramsContext, params: paramsContext }), [paramsContext]);

  /** исполнители: добавленные вручную */
  const poolFromAdded: SimpleUser[] = useMemo(() => {
    const normalized = addedExecutors
      .map((e) => {
        const roleKey = toCanonicalRole(e.role);
        if (!roleKey) return null;
        return {
          id: String(e.id),
          author: normalizeAuthor(e),
          role: roleKey,
        } as SimpleUser;
      })
      .filter((x): x is SimpleUser => !!x);

    const uniq = new Map<string, SimpleUser>();
    normalized.forEach((u) => {
      const k = `${u.id}|${u.role}`;
      if (!uniq.has(k)) uniq.set(k, u);
    });
    return Array.from(uniq.values());
  }, [addedExecutors]);

  /**
   * Дополняем пулом из базовых строк таймлайна
   */
  const poolFromRows: SimpleUser[] = useMemo(() => {
    const collected: SimpleUser[] = [];

    for (const row of rows) {
      if (!row || row.id === 0 || row.isExtra) continue;
      const author = String(row.author ?? '').trim();
      if (!author) continue;

      const found = (allUsers as any[]).find((u) => normalizeAuthor(u) === author);

      const rawRole: string =
        (found?.role?.name as string) ?? (found?.role as string) ?? (row.role as string) ?? '';

      const roleKey = toCanonicalRole(rawRole);
      if (!roleKey) continue;

      const userId = String(found?.id ?? row.id);
      collected.push({ id: userId, author, role: roleKey });
    }

    const uniq = new Map<string, SimpleUser>();
    collected.forEach((u) => {
      const k = `${u.id}|${u.role}`;
      if (!uniq.has(k)) uniq.set(k, u);
    });
    return Array.from(uniq.values());
  }, [rows, allUsers]);

  /**
   * Итоговый список исполнителей
   */
  const selectedPool: SimpleUser[] = useMemo(() => {
    const merged = [...poolFromAdded, ...poolFromRows];
    const uniq = new Map<string, SimpleUser>();
    for (const u of merged) {
      const k = `${u.id}|${u.role}`;
      if (!uniq.has(k)) uniq.set(k, u);
    }
    return Array.from(uniq.values());
  }, [poolFromAdded, poolFromRows]);

  /**
   * Рендер заголовка панели: слева — бейджи направления (ПДС/Rollback),
   * по центру — название, справа — бейдж роли.
   */
  const makePanelLabel = (stageKey: string) => {
    const rawTitle = (stagesField[stageKey] as any)?.description ?? stageKey;
    const title = interpolate(String(rawTitle), interpCtx);

    const roleRequiredKey = toCanonicalRole((stagesField[stageKey] as any)?.executor);
    const color = roleRequiredKey ? ROLE_COLORS[roleRequiredKey] : ROLE_SWATCH_DEFAULT_COLOR;

    /** стартовую стадию всегда маркируем как success */
    const inType: IncomingType = stageKey === startStageKey ? 'success' : incomingType[stageKey];

    /** все теги этапа, которые заданы в YAML */
    const rawTags = Array.isArray((stagesField[stageKey] as any)?.tags)
      ? ((stagesField[stageKey] as any).tags as unknown[])
      : [];
    const tags: string[] = rawTags.map((t) => String(t).trim()).filter(Boolean);

    /** единый цвет для всех тегов текущего этапа */
    const tagVariant = inType === 'failure' ? 'danger' : 'success';

    return (
      <div className="td-collapse-title">
        <span className="td-collapse-title__left" style={{ display: 'inline-flex', gap: 8 }}>
          {tags.map((tag, idx) => (
            <Tag key={`${tag}-${idx}`} thin variant={tagVariant}>
              {tag}
            </Tag>
          ))}
        </span>

        <span className="td-collapse-title__text">{title}</span>

        <span className="td-collapse-title__right">
          <i className="role-swatch" style={{ backgroundColor: color }} />
        </span>
      </div>
    );
  };

  /** сумма минут только по этапам с входом success (отображаются на таймлайне) */
  const successMinutes = useMemo(() => {
    return fullStageOrder.reduce((sum, key) => {
      const inType: IncomingType = key === startStageKey ? 'success' : incomingType[key];
      return inType === 'success' ? sum + getStageMinutes(stagesField[key]) : sum;
    }, 0);
  }, [fullStageOrder, stagesField, incomingType, startStageKey]);

  /** корректный конец интервала в шапке: start + successMinutes */
  const endTimeBySuccess = useMemo(
    () => addMinutesToTime(startTime, successMinutes),
    [startTime, successMinutes],
  );

  return (
    <div className="task-detail">
      <div className="task-detail__header">
        <div className="task-detail__title">{label}</div>
        <div className="task-detail__controls">
          <div className="task-detail__time-text">
            ⏱ {startTime}–{endTimeBySuccess} | {successMinutes} мин
          </div>
          <button className="task-detail__close" onClick={onClose}>
            ✕
          </button>
        </div>
      </div>
      <Collapse
        className="task-detail__collapse"
        activeKey={openKeys}
        onChange={(keys) => {
          const arr = Array.isArray(keys) ? (keys as string[]) : keys ? ([keys] as string[]) : [];
          setOpenKeys(arr);
        }}
        destroyInactivePanel={false}
        items={fullStageOrder.map((stageKey) => {
          const meta = stagesField[stageKey]!;
          const roleRequiredKey = toCanonicalRole((meta as any)?.executor);

          const assignedExecutors: SimpleUser[] = roleRequiredKey
            ? selectedPool.filter((u) => u.role === roleRequiredKey)
            : [];

          return {
            key: stageKey,
            label: makePanelLabel(stageKey),
            children: (
              <StagePanel
                stageKey={stageKey}
                meta={meta}
                durationMinutes={durationMinutes}
                assignedExecutors={assignedExecutors}
                onTimerChange={onTimerChange}
                columns={[]}
                configs={[]}
                onConfigsChange={() => {}}
              />
            ),
          };
        })}
      />
    </div>
  );
};

export default TaskDetail;
