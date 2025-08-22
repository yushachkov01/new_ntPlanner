import { CheckOutlined, RollbackOutlined } from '@ant-design/icons';
import { Button, Collapse, Typography } from 'antd';
import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';

import type { StageField } from '@/entities/template/model/store/templateStore';
import {
  buildFullStageOrder,
  buildIncomingTypeMap,
  type IncomingType,
} from '@/shared/utils/stageGraph';
import { userStore } from '@entities/user/model/store/UserStore';
import { useUserStore } from '@entities/users/model/store/userStore';
import { useSyncedOpenKeys } from '@features/ppr/model/hooks/useSyncedOpenKeys';
import type { TaskDetailProps } from '@features/ppr/model/types';
import type { ConfigFile as BaseConfigFile } from '@features/ppr/ui/ConfigUploader/ConfigUploader';
import './TaskDetail.css';
import type { ConfigFile, SimpleUser } from '@features/ppr/ui/StagePanel/StagePanel';
import { StagePanel } from '@features/ppr/ui/StagePanel/StagePanel';

const { Text } = Typography;

/** Цвета бейджа роли исполнителя справа в заголовке панели. */
const ROLE_COLORS: Record<string, string> = {
  engineer: '#1e90ff',
  installer: '#f97316',
  auditor: '#ef4444',
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
  /** Текущий пользователь. */
  const currentUser = userStore((state) => state.user)!;

  /**
   * Исполнители из стора пользователей.
   * Хук может вернуть массив или словарь — нормализуем к массиву.
   */
  const rawUsers = useUserStore((s: any) => s.users ?? s.executors ?? s.list ?? s);
  const allExecutors: SimpleUser[] = useMemo(() => {
    if (!rawUsers) return [];
    return Array.isArray(rawUsers)
      ? (rawUsers as SimpleUser[])
      : (Object.values(rawUsers) as SimpleUser[]);
  }, [rawUsers]);

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

  /**
   * Инициализация исполнительских списков на каждую стадию.
   * По умолчанию назначаем текущего юзера.
   */
  const initialExecutorsByStage: Record<string, number[]> = useMemo(() => {
    const init: Record<string, number[]> = {};
    fullStageOrder.forEach((stageKey) => {
      init[stageKey] = [currentUser.id];
    });
    return init;
  }, [fullStageOrder, currentUser.id]);

  const [executorsByStage, setExecutorsByStage] = useState(initialExecutorsByStage);

  /** Системно чистим состояние при смене набора стадий */
  useEffect(() => {
    setExecutorsByStage((prev) => {
      const next: Record<string, number[]> = {};
      for (const k of fullStageOrder) {
        next[k] = prev[k] ?? [currentUser.id];
      }
      return next;
    });
  }, [fullStageOrder, currentUser.id]);

  /** Модалка добавления исполнителя — к какой стадии сейчас открыта. */
  const [modalStageKey, setModalStageKey] = useState<string | null>(null);

  /** Конфиги загруженных файлов (общие для формы). */
  const [configs, setConfigs] = useState<ConfigFile[]>([]);

  /** Колонки таблицы конфигов */
  const columns = [
    {
      dataIndex: 'name',
      key: 'name',
      render: (fileName: string) => <span>{fileName}</span>,
    },
    {
      key: 'info',
      render: (_unused: any, record: ConfigFile) => (
        <Text type="secondary">{`Загружено ${record.uploadedAt} (${record.uploadedBy})`}</Text>
      ),
    },
    {
      key: 'actions',
      width: 140,
      render: (_unused: any, record: ConfigFile) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            size="small"
            danger
            onClick={() =>
              setConfigs((previousConfigs) =>
                previousConfigs.filter((config) => config.uid !== record.uid),
              )
            }
          >
            Удалить
          </Button>
          <Button size="small" type="primary" onClick={() => window.open(record.url, '_blank')}>
            Посмотреть
          </Button>
        </div>
      ),
    },
  ];

  /**
   * Обработка изменения списка загруженных конфигов:
   * добавляем дату и автора загрузки
   */
  const handleConfigChange = (files: BaseConfigFile[]) => {
    const currentTimestamp = new Date().toLocaleString();
    setConfigs((previousConfigs) => {
      const updatedConfigs = [...previousConfigs];
      files.forEach((file) => {
        if (!updatedConfigs.find((cfg) => cfg.uid === file.uid)) {
          updatedConfigs.push({
            ...file,
            uploadedAt: currentTimestamp,
            uploadedBy: currentUser.author,
          } as ConfigFile);
        }
      });
      return updatedConfigs;
    });
  };

  /** Удаление исполнителя из этапа */
  const handleRemoveExecutor = (stageKey: string, executorId: number) => {
    setExecutorsByStage((previousMap) => ({
      ...previousMap,
      [stageKey]: previousMap[stageKey].filter((id) => id !== executorId),
    }));
  };

  /** Добавление исполнителя в этап после выбора в модале */
  const handleSelectExecutor = (executorId: number) => {
    if (!modalStageKey) return;
    setExecutorsByStage((previousMap) => ({
      ...previousMap,
      [modalStageKey]: Array.from(new Set([...(previousMap[modalStageKey] || []), executorId])),
    }));
    setModalStageKey(null);
  };

  /**
   * Рендер заголовка панели: слева — иконка направления (success/failure),
   * по центру — название, справа — бейдж роли (цвет зависит от исполнителя).
   */
  const makePanelLabel = (stageKey: string) => {
    const title = (stagesField[stageKey] as any)?.description ?? stageKey;

    const role: string | undefined = (stagesField[stageKey] as any)?.executor;
    const color = (role && ROLE_COLORS[role]) || '#9ca3af';

    /** стартовую стадию всегда маркируем как success */
    const inType: IncomingType = stageKey === startStageKey ? 'success' : incomingType[stageKey];

    return (
      <div className="td-collapse-title">
        <span className="td-collapse-title__left">
          {inType === 'success' && <CheckOutlined className="td-dir-icon success" />}
          {inType === 'failure' && <RollbackOutlined className="td-dir-icon failure" />}
        </span>

        <span className="td-collapse-title__text">{title}</span>

        <span className="td-collapse-title__right">
          <i className="role-swatch" style={{ backgroundColor: color }} />
        </span>
      </div>
    );
  };

  return (
    <div className="task-detail">
      <div className="task-detail__header">
        <div className="task-detail__title">{label}</div>
        <div className="task-detail__controls">
          <div className="task-detail__time-text">
            ⏱ {startTime}–{endTime} | {durationMinutes} мин
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
          const roleRequired = (meta as any)?.executor;

          const assignedExecutors: SimpleUser[] = (executorsByStage[stageKey] || [])
            .map((id) =>
              id === currentUser.id ? currentUser : allExecutors.find((e) => e.id === id),
            )
            .filter((u): u is any => !!u && u.role === roleRequired);

          return {
            key: stageKey,
            label: makePanelLabel(stageKey),
            children: (
              <StagePanel
                stageKey={stageKey}
                meta={meta}
                durationMinutes={durationMinutes}
                assignedExecutors={assignedExecutors}
                onOpenAddExecutor={(k) => setModalStageKey(k)}
                onRemoveExecutor={handleRemoveExecutor}
                onTimerChange={onTimerChange}
                columns={columns}
                configs={configs}
                onConfigsChange={handleConfigChange}
                modalStageKey={modalStageKey}
                onCloseModal={() => setModalStageKey(null)}
                onSelectExecutor={handleSelectExecutor}
                filterRole={roleRequired}
              />
            ),
          };
        })}
      />
    </div>
  );
};

export default TaskDetail;
