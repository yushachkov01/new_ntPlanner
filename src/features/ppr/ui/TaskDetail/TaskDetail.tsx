import { Collapse } from 'antd';
import type { FC } from 'react';
import { useMemo } from 'react';

import type { StageField } from '@/entities/template/model/store/templateStore';
import { normalizeRoleKey, type RoleKey } from '@/shared/utils/normalizeRoleKey';
import {
  buildFullStageOrder,
  buildIncomingTypeMap,
  type IncomingType,
} from '@/shared/utils/stageGraph';
import useTimelineStore from '@entities/timeline/model/store/timelineStore';
import { getStageMinutes } from '@entities/timeline/model/utils/time';
import { userStore } from '@entities/user/model/store/UserStore';
import { useUserStore } from '@entities/users/model/store/userStore';
import type { TaskDetailProps } from '@features/ppr/model/types';
import './TaskDetail.css';
import { useSyncedOpenKeys } from '@features/ppr/model/hooks/useSyncedOpenKeys';
import type { SimpleUser } from '@features/ppr/ui/StagePanel/StagePanel';
import { StagePanel } from '@features/ppr/ui/StagePanel/StagePanel';

/** Цвета бейджа роли исполнителя справа в заголовке панели. */
const ROLE_COLORS: Record<RoleKey, string> = {
  engineer: '#1e90ff',
  installer: '#f97316',
  auditor: '#ef4444',
  system: '#9ca3af',
};

/** Нормализация ФИО/имени  */
const normalizeAuthor = (raw: any): string => {
  const candidate =
    raw?.author ??
    raw?.fio ??
    raw?.name ??
    `${raw?.last_name ?? ''} ${raw?.first_name ?? ''}`.trim();
  return candidate && candidate.length > 0 ? candidate : `User ${raw?.id ?? ''}`;
};

const toCanonicalRole = (roleRaw?: string): RoleKey | undefined => {
  const direct = normalizeRoleKey(roleRaw);
  if (direct) return direct;
  if (roleRaw === 'Сетевой инженер') return 'engineer';
  if (roleRaw === 'Инженер СМР') return 'installer';
  if (roleRaw === 'Представитель Заказчика') return 'auditor';
  if (roleRaw === 'Система') return 'system';
  return undefined;
};

/** прибавить минуты */
const addMinutesToTime = (hhmm: string, minutes: number): string => {
  const [h, m] = (hhmm ?? '00:00').split(':').map((x) => parseInt(x, 10) || 0);
  const total = (((h * 60 + m + Math.max(0, minutes)) % (24 * 60)) + 24 * 60) % (24 * 60);
  const hh = String(Math.floor(total / 60)).padStart(2, '0');
  const mm = String(total % 60).padStart(2, '0');
  return `${hh}:${mm}`;
};

/**
 * Свойства компонента TaskDetail
 */
interface Props extends TaskDetailProps {
  stageKeys?: string[];
  stagesField?: Record<string, StageField>;
  onTimerChange?: (stageKey: string, newTimer: number) => void;
}

/**
 * Контейнер TaskDetail отвечает за:
 * - построение порядка этапов и типов «входа» (success/failure),
 * - управление открытыми панелями Collapse,
 */
const TaskDetail: FC<Props> = ({
  label,
  startTime,
  endTime,
  stageKeys = [],
  stagesField = {},
  onClose,
  onTimerChange,
}) => {
  userStore((state) => state.user);
  useUserStore((s: any) => s.users);

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

  const poolFromAdded: SimpleUser[] = useMemo(() => {
    const normalized = addedExecutors
      .map((e) => {
        const roleKey = toCanonicalRole(e.role);
        if (!roleKey) return null;
        return {
          id: String(e.id),
          author: normalizeAuthor(e),
          role: roleKey,
        } as unknown as SimpleUser;
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
   * Рендер заголовка панели: слева — бейдж направления (ПДС/Rollback),
   * по центру — название, справа — бейдж роли (цвет зависит от исполнителя).
   */
  const makePanelLabel = (stageKey: string) => {
    const title = (stagesField[stageKey] as any)?.description ?? stageKey;

    const roleRequiredKey = toCanonicalRole((stagesField[stageKey] as any)?.executor);
    const color = roleRequiredKey ? ROLE_COLORS[roleRequiredKey] : '#9ca3af';

    /** стартовую стадию всегда маркируем как success */
    const inType: IncomingType = stageKey === startStageKey ? 'success' : incomingType[stageKey];

    const rawTags: any[] = Array.isArray((stagesField[stageKey] as any)?.tags)
      ? ((stagesField[stageKey] as any).tags as any[])
      : [];
    const normTags = rawTags.map((t) => String(t).trim().toLowerCase());

    const tagHasPds = normTags.includes('пдс') || normTags.includes('pds');
    const tagHasRollback = normTags.includes('rollback') || normTags.includes('rallback');

    const hasPds = tagHasPds || inType === 'success';
    const hasRollback = tagHasRollback || inType === 'failure';

    const badgeBase: React.CSSProperties = {
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 4,
      fontSize: 12,
      fontWeight: 600,
      lineHeight: '16px',
    };

    let badgeStyle: React.CSSProperties | undefined;
    let badgeText = '';

    if (hasPds && hasRollback) {
      /** оба — красный и текст "Rollback + ПДС" */
      badgeStyle = { ...badgeBase, background: '#7f1d1d', color: '#fee2e2' };
      badgeText = 'Rollback + ПДС';
    } else if (hasPds) {
      /** только ПДС — зелёный */
      badgeStyle = { ...badgeBase, background: '#0f5132', color: '#e6fffa' };
      badgeText = 'ПДС';
    } else if (hasRollback) {
      /** только Rollback — красный */
      badgeStyle = { ...badgeBase, background: '#7f1d1d', color: '#fee2e2' };
      badgeText = 'Rollback';
    }

    return (
      <div className="td-collapse-title">
        <span className="td-collapse-title__left">
          {badgeText ? <span style={badgeStyle}>{badgeText}</span> : null}
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
      if (inType === 'success') {
        return sum + getStageMinutes(stagesField[key]);
      }
      return sum;
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
