/**
 * Автопостроение таймлайна и восстановление из localStorage:
 * 1) При выборе YAML — строим по raw (порядок этапов из схемы).
 * 2) При восстановлении по localStorage — строим по snapshot.stages (приоритет),
 *    прокидывая value/timers/execIds в блоки.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import YAML from 'yaml';

import './PprEditorPage.css';

import { Button, Steps, message, Tooltip, Progress, Modal } from 'antd';

import { usePlannedTaskStore } from '@/entities/PlannedTask/model/store/plannedTaskStore';
import { templateStore } from '@entities/template/model/store/templateStore';
import type { Template } from '@entities/template/model/store/templateStore';
import useTimelineStore from '@entities/timeline/model/store/timelineStore';

import { userStore } from '@entities/user/model/store/UserStore';
import { useUserStore } from '@entities/users/model/store/userStore';
import { WorkTimeStore } from '@entities/workTimeStore/model/store/workTimeStore';

import { isUuid, pickUuid } from '@features/pprEdit/lib/utils/utils';
import { usePprExecutors } from '@features/pprEdit/model/hooks/usePprExecutors';
import { usePprWizard } from '@features/pprEdit/model/hooks/usePprWizard';
import { useTimelineMove } from '@features/pprEdit/model/hooks/useTimelineMove';
import { savePlannedTask } from '@features/pprEdit/model/services/savePlannedTask';

import ConfirmDeleteDialog from '@features/pprEdit/ui/ConfirmDeleteDialog/ConfirmDeleteDialog';
import DynamicYamlForm from '@features/pprEdit/ui/DynamicYamlForm/DynamicYamlForm';
import { PlannedTaskDropdown } from '@features/pprEdit/ui/PlannedTaskDropdown/PlannedTaskDropdown';
import PprEditorTabs from '@features/pprEdit/ui/PprEditorTabs/PprEditorTabs';
import YamlTemplateSelect from '@features/pprEdit/ui/yamlTemplate/YamlTemplateSelect';
import { normalizeExec } from '@features/pprEdit/ui/utils/execUtils/execUtils';
import type { ProgressMap } from '@features/pprEdit/ui/utils/requiredUtils/requiredUtils';
import { countRequiredInYaml } from '@features/pprEdit/ui/utils/requiredUtils/requiredUtils';
import { resolveTemplateWithRaw } from '@features/pprEdit/ui/utils/templateRaw/templateRaw';

import PprPage from '@pages/PprPage';
import LocationOverview from '@/widgets/layout/LocationOverview/ui/LocationOverview';

import {
    YAML_BUCKET,
    STEP_ICON_SIZE,
    WS_EVENT_PLANNED_TASK_STATUS,
    PROGRESS_EVENT_NAME,
} from '@/shared/constants';
import { subscribe as wsSubscribe } from '@/shared/ws/wsClient';

import PprDraftAutosave from '@/features/pprEdit/ui/PprDraftAutosave/PprDraftAutosave';
import {
    clearDraftForTask,
    hasDraftForTask,
    loadV2Snapshots,
    patchStageTimeInLocalStorage,
    rowsFromUnifiedSnapshot,
    type UnifiedStagesSnapshot,
} from '@/shared/persist/pprDraft';


const LOG_PREFIX = '[PPR UI]';
const nowHMS = () => new Date().toISOString().slice(11, 19);
const log = (...args: any[]) => console.log(nowHMS(), LOG_PREFIX, ...args);
const warn = (...args: any[]) => console.warn(nowHMS(), LOG_PREFIX, ...args);
const err = (...args: any[]) => console.error(nowHMS(), LOG_PREFIX, ...args);

type MaybeTemplate = { key?: string; raw?: any } | undefined;

/**
 * Сохраняет табличные значения для шаблона в templateStore, если ключ валиден.
 * @param templateKey Ключ шаблона
 * @param rows Массив строк, которые хотим сохранить
 */
function setTemplateValuesSafe(templateKey: unknown, rows: any[]) {
    const key = String(templateKey ?? '').trim();
    if (!key) return;
    const state = templateStore.getState();
    state.setTemplateValues?.(key, rows);
}

/**
 * Возвращает табличные значения для шаблона из templateStore.
 * @param templateKey Ключ шаблона
 */
function getTemplateValuesSafe(templateKey: unknown) {
    const state = templateStore.getState();
    return state.getTemplateValues?.(String(templateKey ?? '').trim()) ?? [];
}

/**
 * Формирует "пустую" строку значений из YAML-схемы по params (с учетом default).
 * @param schemaRaw YAML-схема шаблона (raw)
 */
function buildDefaultRowFromSchema(schemaRaw: any) {
    const params = Array.isArray(schemaRaw?.params) ? schemaRaw.params : [];
    const row: Record<string, any> = {};
    for (const param of params) {
        const key = String(param?.key ?? '').trim();
        if (!key) continue;
        row[key] = (param as any)?.defaultValue ?? (param as any)?.default ?? null;
    }
    return row;
}

/**
 * Гарантирует наличие хотя бы одной строки для шаблона
 * @param template Шаблон с key/raw
 */
function ensureAtLeastOneRow(template: MaybeTemplate) {
    const templateKey = (template as any)?.key;
    if (!templateKey) return;

    const current = getTemplateValuesSafe(templateKey);
    if (Array.isArray(current) && current.length > 0) return;

    const defaults = buildDefaultRowFromSchema((template as any)?.raw);
    const payload = Object.keys(defaults).length
        ? { ...defaults, __sourceKey: templateKey }
        : { __sourceKey: templateKey };

    setTemplateValuesSafe(templateKey, [payload]);
}

/**
 * Удаляет дубликаты строк по JSON-представлению.
 * @param rows Список строк
 */
function deduplicateRows(rows: any[]) {
    const seen = new Set<string>();
    const out: any[] = [];
    for (const row of rows) {
        const key = JSON.stringify(row);
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(row);
    }
    return out;
}

/**
 * Короткая сводка состояния таймлайна в лог.
 * @param label Метка
 */
function logTimelineState(label: string) {
    try {
        const state = (useTimelineStore as any).getState?.();
        const rows = Array.isArray(state?.rows) ? state.rows : [];
        const blocksTotal = rows.reduce(
            (acc, r) => acc + (Array.isArray(r?.blocks) ? r.blocks.length : 0),
            0,
        );
        log(label, { rows: rows.length, blocksTotal });
    } catch (e) {
        warn(`${label} failed`, e);
    }
}

/**
 * Глубокий поиск структуры stages в произвольном JSON/YAML-объекте.
 * Возвращает поле stages и ключ старта (если удаётся).
 * @param root Корневой объект
 */
function deepFindStages(root: any): { stagesField?: Record<string, any>; startKey?: string } {
    const queue: any[] = [{ node: root }];
    const visited = new Set<any>();

    const looksLikeStages = (obj: any) => {
        if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
        const values = Object.values(obj);
        if (!values.length) return false;

        let hits = 0;
        for (const v of values) {
            if (v && typeof v === 'object' && !Array.isArray(v)) {
                const keys = Object.keys(v);
                if (keys.some((k) => ['if_success', 'time', 'executor', 'fields', 'description'].includes(k))) {
                    hits++;
                }
            }
        }
        return hits >= Math.max(1, Math.floor(values.length / 2));
    };

    while (queue.length) {
        const current = queue.shift()!.node;
        if (!current || typeof current !== 'object' || visited.has(current)) continue;
        visited.add(current);

        if (current.stages_field && looksLikeStages(current.stages_field)) {
            return {
                stagesField: current.stages_field,
                startKey: current.start || current.current_stages?.[0] || current.current_stages,
            };
        }
        if (current.stages && looksLikeStages(current.stages)) {
            return {
                stagesField: current.stages,
                startKey: current.start || current.current_stages?.[0] || current.current_stages,
            };
        }
        if (looksLikeStages(current)) return { stagesField: current };

        for (const v of Object.values(current)) {
            if (v && typeof v === 'object') queue.push({ node: v });
        }
    }
    return {};
}

/**
 * Извлекает цепочку ключей стадий и карту stages из raw.
 * Стартовый ключ определяется явно (start) или по нулевой входной степени.
 * @param mainRawIn YAML/JSON raw
 */
function getStageChainFromRaw(mainRawIn: any) {
    let raw = mainRawIn;

    if (typeof raw === 'string') {
        try {
            raw = JSON.parse(raw);
        } catch {
            try {
                raw = YAML.parse(raw);
            } catch { }
        }
    }
    if (!raw || typeof raw !== 'object') {
        return { stageKeys: [] as string[], stagesField: {} as Record<string, any> };
    }

    const found = raw.stages_field ?? raw.stages ?? deepFindStages(raw).stagesField;
    let stagesField: Record<string, any> | undefined = found;

    let startKey: string | undefined =
        (raw.start && stagesField?.[raw.start]) ? raw.start : raw.current_stages?.[0];

    if (!stagesField) return { stageKeys: [], stagesField: {} };

    if (!startKey) {
        const keys = Object.keys(stagesField);
        const indegree = new Map(keys.map((k) => [k, 0]));
        for (const k of keys) {
            const to = stagesField[k]?.if_success;
            const next = Array.isArray(to) ? to?.[0] : to;
            if (next && indegree.has(next)) indegree.set(next, (indegree.get(next) || 0) + 1);
        }
        startKey = keys.find((k) => (indegree.get(k) || 0) === 0) || keys[0];
    }

    const stageKeys: string[] = [];
    let cursor = startKey;
    let guard = 0;
    while (cursor && cursor !== 'exit' && stagesField[cursor] && guard < 1000) {
        stageKeys.push(cursor);
        const to = stagesField[cursor]?.if_success;
        cursor = Array.isArray(to) ? to?.[0] : to;
        guard++;
    }

    return { stageKeys, stagesField, startKey };
}

/**
 * Добавляет "value" на каждый этап (используется для addFromYaml),
 * вытягивая значимые значения из stageFieldEdits.
 * @param stagesField Карта стадий
 * @param stageFieldEdits Редакции полей по строкам
 * @param rowIdx Индекс строки (обычно 0)
 */
function decorateStagesWithValue(
    stagesField: Record<string, any>,
    stageFieldEdits: any,
    rowIdx = 0,
) {
    const result: Record<string, any> = {};
    const row = stageFieldEdits?.[rowIdx] ?? {};

    for (const [stageKey, stageDef] of Object.entries(stagesField || {})) {
        const clone = { ...(stageDef as any) };
        const editedFields = row?.[stageKey]?.value || {};

        let stageValue: any = null;
        for (const value of Object.values(editedFields)) {
            if (value === undefined || value === null) continue;
            if (['string', 'number', 'boolean'].includes(typeof value)) {
                stageValue = value;
                break;
            }
            if (typeof value === 'object' && value && 'value' in (value as any)) {
                const unwrapped = (value as any).value;
                if (unwrapped !== undefined && unwrapped !== null) {
                    stageValue = unwrapped;
                    break;
                }
            }
        }
        (clone as any).value = stageValue ?? null;
        result[stageKey] = clone;
    }
    return result;
}

/**
 * Проверяет, есть ли на таймлайне блоки с данным префиксом sourceKey.
 * @param prefix Префикс (обычно templateKey)
 */
function timelineHasBlocksFor(prefix: string) {
    const state = (useTimelineStore as any).getState?.();
    if (!state || !Array.isArray(state?.rows)) return false;

    for (const row of state.rows) {
        const blocks = Array.isArray(row?.blocks) ? row.blocks : [];
        if (blocks.some((b: any) => String(b?.sourceKey ?? '').startsWith(prefix))) return true;
    }
    return false;
}

const PprEditorPage: React.FC = () => {
    // Шаги мастера и основные выбранные сущности
    const {
        selectedTaskId, setSelectedTaskId,
        tabsConfirmed, setTabsConfirmed,
        paramsConfirmed, setParamsConfirmed,
        mainTemplate, setMainTemplate,
        currentStep, step3Done, step5Done,
    } = usePprWizard();

    // Пользователь, смена/окно таймлайна
    const currentUser = userStore((s) => s.user)!;
    const workTimeStore = WorkTimeStore() as any;
    const { timelineWindow, setTimelineWindow } = workTimeStore;
    const selectedTimeWorkId: string | undefined = workTimeStore?.selectedTimeWorkId;

    // Кандидаты-исполнители (из таба) и задачи
    const addedExecutors = useUserStore((s) => s.addedExecutors);
    const tasks = usePlannedTaskStore((s) => s.tasks);
    const selectedTask = useMemo(
        () => tasks.find((t) => t.id === selectedTaskId),
        [tasks, selectedTaskId],
    );

    // Исполнители: по шаблонам, в табе и нормализация идентификаторов
    const {
        executorsByTemplate, setExecutorsByTemplate,
        tabExecutors, setTabExecutors,
        pprExecutors, addExecutor, removeExecutor, normalizeExecId,
    } = usePprExecutors(currentUser, mainTemplate);

    // Операции таймлайна
    const addFromYaml = useTimelineStore((s) => s.addFromYaml);
    const removeBySourcePrefix = useTimelineStore((s) => (s as any).removeBySourcePrefix);
    const updateTplStageDuration = useTimelineStore((s) => (s as any).updateTplStageDuration);

    // Шаблоны: дополнительные и скрытые слоты
    const [additionalTemplates, setAdditionalTemplates] = useState<Template[]>([]);
    const [hiddenExtraSlots, setHiddenExtraSlots] = useState<Set<number>>(new Set());

    // Движение блоков между исполнителями
    const handleMoveBetweenExecutors = useTimelineMove({
        executorsByTemplate,
        setExecutorsByTemplate,
        tabExecutors,
        setTabExecutors,
        mainTemplate,
        additionalTemplates,
    });

    // Если появились блоки — считаем, что параметры заполнены
    const liveRowsCount = useTimelineStore((s) => s.rows?.length ?? 0);
    useEffect(() => {
        if (liveRowsCount > 0) setParamsConfirmed(true);
    }, [liveRowsCount, setParamsConfirmed]);

    // Флаги готовности/редактирования/проверки
    const paramsAnchorRef = useRef<HTMLDivElement | null>(null);
    const [templateReadyTick, setTemplateReadyTick] = useState(0);
    useEffect(() => {
        if ((mainTemplate as any)?.raw) setTemplateReadyTick((t) => t + 1);
    }, [mainTemplate]);

    const mainFormValuesRef = useRef<any>(null);
    const [reviewForId, setReviewForId] = useState<string | null>(null);
    const [statusVerified, setStatusVerified] = useState(false);
    const editingLocked = !!reviewForId && !statusVerified;

    // Подписка на изменение статуса заявки (verify)
    useEffect(() => {
        const unsubscribe = wsSubscribe((msg: any) => {
            if (!msg || msg.type !== WS_EVENT_PLANNED_TASK_STATUS) return;
            const incomingId = String(msg.id ?? '');
            const incomingStatus = String(msg.status ?? '');
            if (reviewForId && incomingId === reviewForId) {
                if (incomingStatus.toLowerCase() === 'verified') {
                    setStatusVerified(true);
                    setReviewForId(null);
                    message.success('Заявка утверждена тимлидом');
                }
            }
        });
        return () => unsubscribe?.();
    }, [reviewForId]);

    /**
     * Добавляет слот для дополнительного шаблона и автора-исполнителя.
     */
    function addTemplateSlot() {
        if (editingLocked) return;
        const meExec = normalizeExec(currentUser);
        const newIndex = additionalTemplates.length;

        setAdditionalTemplates((prev) => [...prev, {} as Template]);
        setExecutorsByTemplate((prev) => [...prev, currentUser ? [meExec] : []]);

        const nextHidden = new Set(hiddenExtraSlots);
        nextHidden.delete(newIndex);
        setHiddenExtraSlots(nextHidden);

        setAllowStep5(false);
    }

    /**
     * Меняет дополнительный шаблон по индексу, пересобирает блоки и строки.
     * @param index Индекс слота
     * @param newTemplate Новый выбранный шаблон
     */
    async function changeExtraTemplate(index: number, newTemplate: Template) {
        if (editingLocked) return;

        const prevKey = (additionalTemplates[index] as any)?.key;
        const execIds = (executorsByTemplate[index + 1] ?? []).map(normalizeExecId);

        if (prevKey) removeBySourcePrefix?.({ execIds, prefix: String(prevKey) });

        const resolved = await resolveTemplateWithRaw(newTemplate as Template, YAML_BUCKET);
        if (!resolved) {
            err('Не удалось загрузить YAML шаблона (extra).');
            return message.error('Не удалось загрузить YAML шаблона.');
        }

        setAdditionalTemplates((prev) => prev.map((t, i) => (i === index ? resolved : t)));

        const nextHidden = new Set(hiddenExtraSlots);
        nextHidden.delete(index);
        setHiddenExtraSlots(nextHidden);

        ensureAtLeastOneRow(resolved);
        setAllowStep5(false);
    }

    // Итоговые исполнители для отрисовки PprPage
    const timelineExecutors = useMemo(() => {
        const explicit = (pprExecutors as any[]) ?? [];
        if (explicit.length > 0) return explicit;
        return (tabExecutors ?? []).map(normalizeExec);
    }, [pprExecutors, tabExecutors]);

    // UUID автора и выбранной смены
    const authorUuid =
        pickUuid((currentUser as any)?.id, (currentUser as any)?.uuid) ??
        pickUuid(...(addedExecutors ?? []).map((v) => v.id)) ??
        pickUuid((selectedTask as any)?.authorId, (selectedTask as any)?.author_id);

    const timeWorkUuid =
        (selectedTimeWorkId && isUuid(selectedTimeWorkId) ? selectedTimeWorkId : undefined) ??
        pickUuid((selectedTask as any)?.timeWorkId, (selectedTask as any)?.time_work_id);

    // Сохранение
    const [saving, setSaving] = useState(false);
    const templateChosen = Boolean((mainTemplate as any)?.key);

    // Прогресс обязательных полей
    const [progressMap, setProgressMap] = useState<ProgressMap>({});
    useEffect(() => {
        const handler = (event: Event) => {
            const { id, filled, required } =
            (event as CustomEvent<{ id: string; filled: number; required: number }>).detail || ({} as any);
            if (!id) return;
            setProgressMap((prev) => ({ ...prev, [id]: { filled, required } }));
        };
        window.addEventListener(PROGRESS_EVENT_NAME, handler as EventListener);
        return () => window.removeEventListener(PROGRESS_EVENT_NAME, handler as EventListener);
    }, []);

    const totals = useMemo(
        () =>
            Object.values(progressMap).reduce(
                (acc, v) => ({
                    filled: acc.filled + (v?.filled ?? 0),
                    required: acc.required + (v?.required ?? 0),
                }),
                { filled: 0, required: 0 },
            ),
        [progressMap],
    );

    const yamlRequiredTotal = useMemo(() => {
        let sum = 0;
        const mainRaw = (mainTemplate as any)?.raw;
        if (mainRaw) sum += countRequiredInYaml(mainRaw);
        for (const t of additionalTemplates) {
            const raw = (t as any)?.raw;
            if (raw) sum += countRequiredInYaml(raw);
        }
        return sum;
    }, [mainTemplate, additionalTemplates]);

    const effectiveRequired = useMemo(
        () => Math.max(totals.required, yamlRequiredTotal),
        [totals.required, yamlRequiredTotal],
    );

    const totalPercent = useMemo(() => {
        if (effectiveRequired <= 0) return 0;
        const clamped = Math.min(totals.filled, effectiveRequired);
        return Math.round((clamped / effectiveRequired) * 100);
    }, [totals.filled, effectiveRequired]);

    const isParamsComplete = effectiveRequired === 0 ? true : totals.filled >= effectiveRequired;

    const [allowStep5, setAllowStep5] = useState(false);

    const canSave =
        isParamsComplete && templateChosen && Boolean(selectedTaskId && authorUuid && timeWorkUuid);

    const saveTooltip =
        !isParamsComplete
            ? 'Заполните все обязательные поля (100%)'
            : !templateChosen
                ? 'Выберите шаблон YAML'
                : !selectedTaskId
                    ? 'Выберите задачу'
                    : !authorUuid
                        ? 'Нет author_id (UUID пользователя/исполнителя)'
                        : !timeWorkUuid
                            ? 'Нет time_work_id (выберите смену/интервал)'
                            : undefined;

    /**
     * Сохранение PPR: создаёт/обновляет заявку и переводит в режим "на проверке".
     */
    async function handleSave() {
        if (saving || editingLocked) return;
        if (!templateChosen) return message.error('Не выбран YAML-шаблон (шаг «Шаблон»).');
        if (!isParamsComplete) return message.error('Заполните все обязательные поля (100%).');

        setAllowStep5(true);
        setSaving(true);
        setStatusVerified(false);

        try {
            const result = await savePlannedTask({
                mainTemplate,
                selectedTask,
                executorsByTemplate,
                getMergedStageOverrides: (useTimelineStore as any).getState?.().getMergedStageOverrides,
                getTimelineState: (useTimelineStore as any).getState,
                mainFormValues: mainFormValuesRef.current,
                createNew: true,
                selectedTaskId: selectedTaskId ?? undefined,
                authorUuid: authorUuid ?? undefined,
                timeWorkUuid: timeWorkUuid ?? undefined,
            });

            if (result?.createdId) setReviewForId(result.createdId);
            if (result?.updatedId) setReviewForId(result.updatedId);
        } catch (e: any) {
            err('save error:', e);
            err(`Не удалось сохранить: ${e?.response?.errors?.[0]?.message ?? e?.message ?? 'unknown error'}`);
        } finally {
            setSaving(false);
        }
    }

    // raw главного шаблона для автопостроения
    const mainRawForTimelineRef = useRef<any>(null);
    useEffect(() => {
        if ((mainTemplate as any)?.raw) mainRawForTimelineRef.current = (mainTemplate as any).raw;
    }, [mainTemplate]);

    /**
     * Автопостроение таймлайна при выборе YAML (только если блоков для ключа ещё нет).
     */
    useEffect(() => {
        const templateKey = (mainTemplate as any)?.key;
        const rawCandidate = mainRawForTimelineRef.current || (mainTemplate as any)?.raw;
        const hasExecutors = (executorsByTemplate?.[0]?.length ?? 0) > 0;
        if (!templateKey || !rawCandidate || !hasExecutors) return;

        // Не дублируем блоки
        if (timelineHasBlocksFor(String(templateKey))) return;

        const { stageKeys, stagesField } = getStageChainFromRaw(rawCandidate);
        if (!stageKeys.length) {
            warn('[TL] stageKeys пуст');
            return;
        }

        const timelineState = (useTimelineStore as any).getState?.() || {};
        const edits = timelineState?.stageFieldEdits || {};
        const stagesWithValue = decorateStagesWithValue(stagesField, edits, 0);

        const execIds = (executorsByTemplate?.[0] ?? []).map((e) => String((e as any)?.id ?? e));

        try {
            logTimelineState('[TL][BEFORE]');
            addFromYaml({
                label: (rawCandidate as any)?.headline || (rawCandidate as any)?.description || templateKey,
                stageKeys,
                stagesField: stagesWithValue,
                execIds,
                sourceKey: templateKey,
            });
            setTimeout(() => logTimelineState('[TL][AFTER]'), 0);
        } catch (e) {
            err('[TL] addFromYaml threw', e);
        }
    }, [templateReadyTick, JSON.stringify(executorsByTemplate?.[0] ?? [])]);

    /**
     * Применяет снапшот к таймлайну: чистит старые блоки и добавляет новые с таймерами.
     * @param tplIdx Индекс шаблона (0 — главный)
     * @param snap Снапшот V2
     * @param templateKey Ключ шаблона
     * @param execIdsForSlot Исполнители слота
     */
    function applySnapshotToTimeline(
        tplIdx: number,
        snap: UnifiedStagesSnapshot | undefined,
        templateKey: string | undefined,
        execIdsForSlot: string[] = [],
    ) {
        if (!snap || !templateKey) return;

        // 1) удалить старые блоки для этого шаблона/исполнителей
        try {
            (useTimelineStore as any).getState?.().removeBySourcePrefix?.({
                prefix: templateKey,
                execIds: execIdsForSlot,
            });
        } catch {}

        // 2) порядок из raw, данные из snapshot.stages
        const raw = snap.mainTemplateRaw || {};
        if (tplIdx === 0 && raw) mainRawForTimelineRef.current = raw;

        const { stageKeys, stagesField } = getStageChainFromRaw(raw);
        const mergedStages: Record<string, any> = { ...stagesField };

        for (const [k, v] of Object.entries(snap.stages ?? {})) {
            mergedStages[k] = { ...(mergedStages[k] ?? {}), ...(v as any) };
        }

        const decorated = decorateStagesWithValue(
            mergedStages,
            (useTimelineStore as any).getState?.().stageFieldEdits,
            0,
        );

        // добавить блоки
        if (stageKeys.length) {
            try {
                logTimelineState('[TL][BEFORE][restore]');
                addFromYaml({
                    label: (raw as any)?.headline || (raw as any)?.description || templateKey,
                    stageKeys,
                    stagesField: decorated,
                    execIds: execIdsForSlot,
                    sourceKey: templateKey,
                });
                setTimeout(() => logTimelineState('[TL][AFTER][restore]'), 0);
            } catch (e) {
                err('[TL][ERR][restore] addFromYaml threw', e);
            }
        }

        // таймеры точным патчем
        if (snap?.stages) {
            for (const [stageKey, stage] of Object.entries(snap.stages)) {
                const timeStr = (stage as any)?.time;
                if (!timeStr || typeof timeStr !== 'string') continue;
                const minutes = Math.max(0, parseInt(String(timeStr).replace(/\D+/g, ''), 10) || 0);
                try {
                    updateTplStageDuration?.({ tplIdx, stageKey, minutes });
                } catch {}
            }
        }
    }

    /**
     * Восстанавливает состояние по V2-снапшотам из localStorage.
     * @param taskId Идентификатор задачи
     */
    async function restoreFromLocalStorage(taskId: string) {
        const snapshots = loadV2Snapshots(taskId);
        if (!snapshots.length) return;

        // Все уникальные ключи шаблонов
        const uniqueTemplateKeys: string[] = Array.from(
            new Set(snapshots.map((x) => x.templateKey)),
        ).filter(Boolean) as string[];

        // Подтянем RAW для каждого ключа
        const resolvedTemplates = await Promise.all(
            uniqueTemplateKeys.map((k) => resolveTemplateWithRaw({ key: k } as any, YAML_BUCKET)),
        );

        const [resolvedMain, ...resolvedExtras] = (resolvedTemplates.filter(Boolean) as any[]) as Template[];
        if (!resolvedMain) {
            warn('restoreFromLocalStorage: cannot resolve main template');
            return;
        }

        // Установим шаблоны и обеспечим строки
        setMainTemplate(resolvedMain);
        ensureAtLeastOneRow(resolvedMain);

        setAdditionalTemplates(resolvedExtras);
        resolvedExtras.forEach((tpl) => ensureAtLeastOneRow(tpl));

        // Восстановим исполнителей (если есть в снапшоте)
        const withExec = snapshots.find((x) => Array.isArray(x.snapshot?.executorsByTemplate));
        if (withExec?.snapshot?.executorsByTemplate?.length) {
            setExecutorsByTemplate(withExec.snapshot.executorsByTemplate);
            setTabExecutors((prev) =>
                prev.length ? prev : withExec.snapshot.executorsByTemplate[0] || [],
            );
        }

        // Табличные значения
        uniqueTemplateKeys.forEach((tKey) => {
            const snapForKey = snapshots.find((x) => x.templateKey === tKey)?.snapshot;
            if (!snapForKey) return;

            const rows = rowsFromUnifiedSnapshot(snapForKey);
            const prev = getTemplateValuesSafe(tKey);
            const merged = deduplicateRows([...(Array.isArray(prev) ? prev : []), ...rows]);

            setTemplateValuesSafe(tKey, merged);
        });

        // Обновим ref на RAW главного
        const mainSnap = snapshots.find((x) => x.templateKey === (resolvedMain as any).key)?.snapshot;
        if (mainSnap?.mainTemplateRaw) mainRawForTimelineRef.current = mainSnap.mainTemplateRaw;

        // Дёрнем пересборку RAW-ветки
        setTemplateReadyTick((t) => t + 1);

        // Фактическая отрисовка блоков по snapshot.stages
        const execsFromSnap =
            (withExec?.snapshot?.executorsByTemplate?.length
                ? withExec!.snapshot!.executorsByTemplate
                : executorsByTemplate) || [];

        const allTemplates: Template[] = [resolvedMain, ...resolvedExtras];

        allTemplates.forEach((tpl, i) => {
            const tKey = (tpl as any)?.key;
            if (!tKey) return;

            const execIdsForSlot = (execsFromSnap[i] ?? []).map((e: any) => String(e?.id ?? e));

            const firstId = execIdsForSlot[0];
            const found =
                (firstId &&
                    snapshots.find((x) => x.templateKey === tKey && x.executorId === firstId)) ||
                snapshots.find((x) => x.templateKey === tKey);

            applySnapshotToTimeline(i, found?.snapshot, tKey, execIdsForSlot);
        });

        // Разрешаем шаги
        setTabsConfirmed(true);
        setParamsConfirmed(true);
        setAllowStep5(true);

        (useTimelineStore as any).getState?.()?.rebuildAll?.();
        setTimeout(() => (useTimelineStore as any).getState?.()?.rebuildAll?.(), 0);
    }

    // Текущий шаг с учётом прогресса и статуса
    const computedStepsCurrent = (() => {
        let computed = currentStep;
        if (statusVerified) computed = Math.max(computed, 5);
        else if (editingLocked) computed = Math.max(computed, 4);

        if (computed >= 3) {
            if (!isParamsComplete) return 3;
            if (!allowStep5) return 3;
        }
        return computed;
    })();

    const showStep4Progress = currentStep >= 3;
    const paramsStepIcon = showStep4Progress ? (
        <span className="ppr-steps__progress-icon" style={{ display: 'flex' }}>
      <Progress
          type="circle"
          percent={totalPercent}
          size={STEP_ICON_SIZE}
          strokeLinecap="round"
          status={totalPercent === 100 ? 'success' : 'normal'}
          format={(p) => `${p ?? 0}%`}
      />
    </span>
    ) : undefined;

    return (
        <section className="ppr-editor-card">
            <PprDraftAutosave
                taskId={selectedTaskId}
                mainTemplate={mainTemplate}
                executorsByTemplate={executorsByTemplate}
                templates={[mainTemplate, ...additionalTemplates]}
            />

            <div style={{ padding: '8px 16px 0 16px' }}>
                <Steps
                    current={computedStepsCurrent}
                    items={[
                        { title: 'Задача' },
                        { title: 'Значения (в табе)' },
                        { title: 'Шаблон' },
                        { title: 'Параметры шаблона', icon: paramsStepIcon },
                        { title: 'На проверке' },
                        { title: 'Заявка готова' },
                    ]}
                />
            </div>

            <header className="ppr-editor-card__header">
                <div className="ppr-location-divider" />
                <LocationOverview />
                <div className="ppr-location-divider" />
            </header>

            <div
                className="ppr-editor-card__controls"
                style={{ display: 'flex', gap: 12, alignItems: 'center' }}
            >
                <div className="ppr-editor-card__controls-left" style={{ width: '100%' }}>
                    <PlannedTaskDropdown
                        className="ppr-editor-card__select"
                        placeholder="Список выбранных планируемых работ"
                        value={selectedTaskId}
                        disabled={editingLocked}
                        onChange={async (taskId) => {
                            if (editingLocked) return;

                            const proceedOpen = async () => {
                                setSelectedTaskId(taskId);
                                setTabsConfirmed(false);
                                setMainTemplate(undefined);
                                setParamsConfirmed(false);
                                setAllowStep5(false);
                            };

                            if (taskId && hasDraftForTask(taskId)) {
                                Modal.confirm({
                                    title: 'Вы желаете продолжить редактирование?',
                                    content: 'Найден сохранённый черновик в этом браузере.',
                                    okText: 'Продолжить',
                                    cancelText: 'Начать заново',
                                    okButtonProps: { type: 'primary' },
                                    cancelButtonProps: { danger: true },
                                    onOk: async () => {
                                        await proceedOpen();
                                        await restoreFromLocalStorage(taskId);
                                    },
                                    onCancel: async () => {
                                        clearDraftForTask(taskId);
                                        await proceedOpen();
                                    },
                                });
                            } else {
                                await proceedOpen();
                            }
                        }}
                    />
                </div>

                <Tooltip title={saveTooltip || (editingLocked ? 'Заявка на проверке' : undefined)}>
                    <Button
                        type="primary"
                        onClick={handleSave}
                        loading={saving}
                        disabled={!canSave || editingLocked}
                    >
                        Сохранить
                    </Button>
                </Tooltip>
            </div>

            {!!selectedTaskId && (
                <div style={{ marginTop: 12 }}>
                    <div
                        className="ppr-editor-card__controls-right"
                        style={{ ...(editingLocked ? { pointerEvents: 'none', opacity: 0.6 } : {}) }}
                    >
                        <div className="ppr-editor-card__tabs">
                            <PprEditorTabs
                                taskId={selectedTaskId}
                                onWorkTimeChange={(w) => setTimelineWindow(w)}
                                executors={tabExecutors}
                                addExecutor={(executorToAdd) =>
                                    setTabExecutors((prev) =>
                                        prev.some((e) => String(e.id) === String((executorToAdd as any).id))
                                            ? prev
                                            : [normalizeExec(executorToAdd), ...prev],
                                    )
                                }
                                removeExecutor={(executorId) =>
                                    setTabExecutors((prev) => prev.filter((e) => String(e.id) !== String(executorId)))
                                }
                            />
                        </div>

                        {!tabsConfirmed && (
                            <div style={{ marginTop: 12 }}>
                                <Button
                                    type="primary"
                                    onClick={() => setTabsConfirmed(true)}
                                    disabled={editingLocked}
                                >
                                    Перейти к выбору шаблона
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {tabsConfirmed && (
                <div
                    className="ppr-template-wrap"
                    style={{ marginTop: 16, ...(editingLocked ? { pointerEvents: 'none', opacity: 0.6 } : {}) }}
                >
                    <YamlTemplateSelect
                        bucket={YAML_BUCKET}
                        value={(mainTemplate as any)?.key}
                        disabled={editingLocked as any}
                        onChange={async (selectedTemplate) => {
                            if (editingLocked) return;

                            // Удалим старые блоки главного шаблона
                            const prevMainKey = (mainTemplate as any)?.key;
                            const execIds = (executorsByTemplate[0] ?? []).map(normalizeExecId);
                            if (prevMainKey) removeBySourcePrefix?.({ execIds, prefix: String(prevMainKey) });

                            // Гарантируем наличие автора в слоте главного шаблона
                            if (currentUser) {
                                const meExec = normalizeExec(currentUser);
                                setExecutorsByTemplate((prev) => {
                                    const next = [...prev];
                                    const mainList = next[0] ?? [];
                                    const hasMe = mainList.some((e) => String(e.id) === String(meExec.id));
                                    next[0] = hasMe ? mainList : [meExec, ...mainList];
                                    return next;
                                });
                                setTabExecutors((prev) =>
                                    prev.some((e) => String(e.id) === String(meExec.id)) ? prev : [meExec, ...prev],
                                );
                            }

                            // Загрузим YAML raw
                            const resolved = await resolveTemplateWithRaw(selectedTemplate as Template, YAML_BUCKET);
                            if (!resolved) {
                                err('Не удалось загрузить YAML шаблона (main).');
                                return message.error('Не удалось загрузить YAML шаблона.');
                            }

                            setMainTemplate(resolved);
                            mainRawForTimelineRef.current = (resolved as any)?.raw || null;

                            setParamsConfirmed(false);
                            setAllowStep5(false);

                            ensureAtLeastOneRow(resolved);
                            setTimeout(() => paramsAnchorRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
                        }}
                        executors={(executorsByTemplate[0] ?? []).map(normalizeExec)}
                        addExecutor={(executor) => addExecutor(0, executor)}
                        removeExecutor={(executorId) => removeExecutor(0, executorId)}
                        tabCandidates={tabExecutors}
                    />
                    <Button
                        className="ppr-template-wrap__delete"
                        danger
                        ghost
                        disabled={editingLocked || !(mainTemplate as any)?.key}
                        onClick={() => setConfirmState({ open: true, kind: 'main' })}
                    >
                        Удалить шаблон
                    </Button>
                </div>
            )}

            {step3Done && (
                <div ref={paramsAnchorRef} style={editingLocked ? { pointerEvents: 'none', opacity: 0.6 } : undefined}>
                    {(mainTemplate as any)?.key && (mainTemplate as any)?.raw && (
                        <DynamicYamlForm
                            key={`main-${(mainTemplate as any)?.key}-${templateReadyTick}`}
                            schema={(mainTemplate as any)?.raw}
                            templateKey={(mainTemplate as any)?.key}
                            executors={(executorsByTemplate[0] ?? []).map(normalizeExec)}
                            onRowCountChange={(rowCount: number) => {
                                if (!paramsConfirmed && rowCount > 0) setParamsConfirmed(true);
                            }}
                            onValuesChange={(formValues: any) => {
                                if (editingLocked) return;
                                mainFormValuesRef.current = formValues;
                                setAllowStep5(false);
                            }}
                        />
                    )}
                </div>
            )}

            {additionalTemplates.map((templateItem, templateIndex) => {
                if (hiddenExtraSlots.has(templateIndex)) return null;
                return (
                    <React.Fragment key={templateIndex}>
                        <div
                            className="ppr-template-wrap"
                            style={{ marginTop: 12, ...(editingLocked ? { pointerEvents: 'none', opacity: 0.6 } : {}) }}
                        >
                            <YamlTemplateSelect
                                bucket={YAML_BUCKET}
                                value={(templateItem as any).key}
                                disabled={editingLocked as any}
                                onChange={(newTemplate) => {
                                    changeExtraTemplate(templateIndex, newTemplate);
                                    setAllowStep5(false);
                                }}
                                executors={(executorsByTemplate[templateIndex + 1] ?? []).map(normalizeExec)}
                                addExecutor={(executor) => addExecutor(templateIndex + 1, executor)}
                                removeExecutor={(executorId) => removeExecutor(templateIndex + 1, executorId)}
                                tabCandidates={tabExecutors}
                            />
                            <Button
                                className="ppr-template-wrap__delete"
                                danger
                                ghost
                                disabled={editingLocked || !(templateItem as any)?.key}
                                onClick={() => setConfirmState({ open: true, kind: 'extra', index: templateIndex })}
                            >
                                Удалить шаблон
                            </Button>
                        </div>

                        {(templateItem as any)?.key && (templateItem as any)?.raw && (
                            <DynamicYamlForm
                                key={`extra-${templateIndex}-${(templateItem as any)?.key}-${templateReadyTick}`}
                                schema={(templateItem as any)?.raw}
                                templateKey={(templateItem as any)?.key}
                                executors={(executorsByTemplate[templateIndex + 1] ?? []).map(normalizeExec)}
                                onRowCountChange={() => {}}
                            />
                        )}
                    </React.Fragment>
                );
            })}

            {step5Done && (
                <>
                    <Button type="dashed" onClick={addTemplateSlot} style={{ marginTop: 12 }} disabled={editingLocked}>
                        Добавить шаблон
                    </Button>

                    <div
                        className="ppr-editor-card__timeline"
                        style={editingLocked ? { pointerEvents: 'none', opacity: 0.6 } : undefined}
                    >
                        <PprPage
                            gridStart={timelineWindow.start}
                            gridEnd={timelineWindow.end}
                            executors={timelineExecutors}
                            executorsByTemplate={executorsByTemplate}
                            onBlockClick={() => {}}
                            onTimerChange={(templateIdx, stageKey, newTimerMinutes) => {
                                if (editingLocked) return;

                                const minutes = Number(newTimerMinutes) || 0;
                                updateTplStageDuration?.({ tplIdx: templateIdx, stageKey, minutes });

                                if (selectedTaskId) {
                                    patchStageTimeInLocalStorage({
                                        taskId: selectedTaskId,
                                        tplIdx: templateIdx,
                                        stageKey,
                                        minutes,
                                        mainTemplate,
                                        executorsByTemplate,
                                        templates: [mainTemplate, ...additionalTemplates],
                                    });
                                }
                                setAllowStep5(false);
                            }}
                            onMoveBetweenExecutors={handleMoveBetweenExecutors}
                        />
                    </div>
                </>
            )}

            {/* Диалог удаления шаблонов */}
            <ConfirmDeleteDialog
                open={!!confirmState.open}
                kind={confirmState.open ? confirmState.kind : undefined}
                index={confirmState.open ? confirmState.index : undefined}
                mainTemplate={mainTemplate}
                additionalTemplates={additionalTemplates}
                executorsByTemplate={executorsByTemplate}
                normalizeExecId={normalizeExecId}
                removeBySourcePrefix={removeBySourcePrefix}
                setMainTemplate={setMainTemplate}
                setParamsConfirmed={setParamsConfirmed}
                setTabsConfirmed={setTabsConfirmed}
                setAdditionalTemplates={setAdditionalTemplates}
                setHiddenExtraSlots={setHiddenExtraSlots}
                onCancel={() => setConfirmState({ open: false })}
            />
        </section>
    );
};

/** Состояние диалога подтверждения удаления шаблона */
type ConfirmState =
    | { open: true; kind: 'main' | 'extra'; index?: number }
    | { open: false };

const [confirmState, setConfirmState] = ((): [
    ConfirmState,
    React.Dispatch<React.SetStateAction<ConfirmState>>,
] => {
    return [{ open: false }, () => void 0] as any;
})();

export default PprEditorPage;

