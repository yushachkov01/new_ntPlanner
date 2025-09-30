/* eslint-disable react-hooks/exhaustive-deps */
/**
 * src/pages/PprEditorPage/PprEditorPage.tsx
 * Автовывод таймлайна из mainTemplateRaw (робастный поиск стадий + value на этапы).
 * Ключевые логи: [TL][RAW:head], [TL][RAW], [TL][SCAN:found], [TL][CHAIN], [TL][TIME],
 * [TL][ADD:req], [TL][ADD:call], [TL][AFTER], [TL][ADD:done], [TL][WARN], [TL][ERR].
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import YAML from 'yaml'; // <<< НОВОЕ: фолбэк-парсер YAML

import './PprEditorPage.css';
import { usePlannedTaskStore } from '@/entities/PlannedTask/model/store/plannedTaskStore';
import {
    YAML_BUCKET,
    STEP_ICON_SIZE,
    WS_EVENT_PLANNED_TASK_STATUS,
    PROGRESS_EVENT_NAME,
} from '@/shared/constants';
import { subscribe as wsSubscribe } from '@/shared/ws/wsClient';
import LocationOverview from '@/widgets/layout/LocationOverview/ui/LocationOverview';
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
import { normalizeExec } from '@features/pprEdit/ui/utils/execUtils/execUtils';
import type { ProgressMap } from '@features/pprEdit/ui/utils/requiredUtils/requiredUtils';
import { countRequiredInYaml } from '@features/pprEdit/ui/utils/requiredUtils/requiredUtils';
import { resolveTemplateWithRaw } from '@features/pprEdit/ui/utils/templateRaw/templateRaw';
import PprPage from '@pages/PprPage';

import { Button, Steps, message, Tooltip, Progress, Modal } from 'antd';

import PprDraftAutosave from '@/features/pprEdit/ui/PprDraftAutosave/PprDraftAutosave';
import {
    clearDraftForTask,
    hasDraftForTask,
    loadV2Snapshots,
    patchStageTimeInLocalStorage,
    UnifiedStagesSnapshot,
    rowsFromUnifiedSnapshot,
} from '@/shared/persist/pprDraft';

import { templateStore } from '@entities/template/model/store/templateStore';
import YamlTemplateSelect from '@features/pprEdit/ui/yamlTemplate/YamlTemplateSelect';

/** ------------------------- ЛОГИ ------------------------- */
const TAG = '[PPR UI]';
const ts = () => new Date().toISOString().slice(11, 19);
const log  = (...a: any[]) => console.log(ts(), TAG, ...a);
const warn = (...a: any[]) => console.warn(ts(), TAG, ...a);
const err  = (...a: any[]) => console.error(ts(), TAG, ...a);

/** ------------------------- ХЕЛПЕРЫ ------------------------- */

type AnyTemplate = { key?: string; raw?: any } | undefined;

const safeSetTemplateValues = (key: any, rows: any[]) => {
    const tKey = String(key ?? '').trim();
    if (!tKey) return;
    const tsState = templateStore.getState();
    tsState.setTemplateValues?.(tKey, rows);
};

const getTemplateValuesSafe = (key: any) => {
    const tsState = templateStore.getState();
    return tsState.getTemplateValues?.(String(key ?? '').trim()) ?? [];
};

const buildDefaultRowFromSchema = (schemaRaw: any) => {
    const params = Array.isArray(schemaRaw?.params) ? schemaRaw.params : [];
    const row: Record<string, any> = {};
    for (const p of params) {
        const k = String(p?.key ?? '').trim();
        if (!k) continue;
        row[k] = (p as any)?.defaultValue ?? (p as any)?.default ?? null;
    }
    return row;
};

const ensureAtLeastOneRow = (template: AnyTemplate) => {
    const tKey = (template as any)?.key;
    if (!tKey) return;
    const current = getTemplateValuesSafe(tKey);
    if (Array.isArray(current) && current.length > 0) return;

    const row = buildDefaultRowFromSchema((template as any)?.raw);
    const payload = Object.keys(row).length ? { ...row, __sourceKey: tKey } : { __sourceKey: tKey };
    safeSetTemplateValues(tKey, [payload]);
};

const dedupRows = (rows: any[]) => {
    const seen = new Set<string>();
    const out: any[] = [];
    for (const r of rows) {
        const key = JSON.stringify(r);
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(r);
    }
    return out;
};

/** Диагностика таймлайна (до/после addFromYaml) */
function logTLState(label: string) {
    try {
        const tl = (useTimelineStore as any).getState?.();
        const rows = Array.isArray(tl?.rows) ? tl.rows : [];
        const blocksTotal = rows.reduce((s, r) => s + (Array.isArray(r?.blocks) ? r.blocks.length : 0), 0);
        log(label, { rows: rows.length, blocksTotal });
    } catch (e) {
        warn(label + ' failed', e);
    }
}

/** Поиск stages глубоко (если структура нестандартная) */
function deepFindStagesBundle(root: any): { stagesField?: Record<string, any>, startKey?: string, where?: string } {
    const visited = new Set<any>();
    const queue: Array<{ node: any; path: string }> = [{ node: root, path: '$' }];

    const looksLikeStages = (obj: any) => {
        if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
        const vals = Object.values(obj);
        if (vals.length < 1) return false;
        let hits = 0;
        for (const v of vals) {
            if (v && typeof v === 'object' && !Array.isArray(v)) {
                const keys = Object.keys(v);
                if (keys.some(k => k === 'if_success' || k === 'time' || k === 'executor' || k === 'fields' || k === 'description')) {
                    hits++;
                }
            }
        }
        return hits >= Math.max(1, Math.floor(vals.length / 2));
    };

    while (queue.length) {
        const { node, path } = queue.shift()!;
        if (!node || typeof node !== 'object' || visited.has(node)) continue;
        visited.add(node);

        if (node.stages_field && looksLikeStages(node.stages_field)) {
            const start = node.start || (Array.isArray(node.current_stages) ? node.current_stages[0] : node.current_stages);
            return { stagesField: node.stages_field, startKey: start, where: `${path}.stages_field` };
        }
        if (node.stages && looksLikeStages(node.stages)) {
            const start = node.start || (Array.isArray(node.current_stages) ? node.current_stages[0] : node.current_stages);
            return { stagesField: node.stages, startKey: start, where: `${path}.stages` };
        }
        if (looksLikeStages(node)) {
            return { stagesField: node as Record<string, any>, startKey: undefined, where: path };
        }

        for (const [k, v] of Object.entries(node)) {
            if (v && typeof v === 'object') queue.push({ node: v, path: `${path}.${k}` });
        }
    }
    return {};
}

/** Чтение цепочки стадий из mainTemplateRaw: JSON → YAML → deep scan */
function getStageChainFromMainRaw(mainRawIn: any): {
    stageKeys: string[];
    stagesField: Record<string, any>;
    startKey?: string;
} {
    let raw = mainRawIn;

    // Диаг: короткая "голова" сырья
    try {
        const head =
            typeof raw === 'string'
                ? raw.slice(0, 120).replace(/\n/g, '\\n')
                : JSON.stringify(raw)?.slice(0, 120);
        log('[TL][RAW:head]', { type: typeof raw, head });
    } catch {}

    // 1) Если строка — пробуем JSON, затем YAML
    if (typeof raw === 'string') {
        let parsed: any = null;
        let jsonErr: any = null;
        try { parsed = JSON.parse(raw); }
        catch (e) { jsonErr = e; }

        if (!parsed) {
            try { parsed = YAML.parse(raw); }
            catch (yamlErr) {
                warn('[TL][WARN] mainTemplateRaw строка, JSON.parse и YAML.parse не удались', {
                    jsonErr: jsonErr?.message,
                    yamlErr: (yamlErr as any)?.message,
                });
            }
        }
        if (parsed) {
            raw = parsed;
            log('[TL][INFO] mainTemplateRaw распарсен (string → object)');
        }
    }

    // 2) В снапшоте может лежать под полем mainTemplateRaw
    if (raw && typeof raw === 'object' && raw.mainTemplateRaw && typeof raw.mainTemplateRaw === 'object') {
        raw = raw.mainTemplateRaw;
    }

    // Диагностика структуры
    try {
        const keys = raw && typeof raw === 'object' ? Object.keys(raw) : [];
        const types: Record<string, string> = {};
        for (const k of keys) types[k] = typeof (raw as any)[k];
        log('[TL][RAW]', {
            keys,
            types,
            hasStages: !!raw?.stages,
            hasStagesField: !!raw?.stages_field,
            hasStart: !!raw?.start,
            hasCurrent: !!raw?.current_stages,
        });
    } catch {}

    if (!raw || typeof raw !== 'object') return { stageKeys: [], stagesField: {} };

    // Основные места хранения стадий
    let stagesField: Record<string, any> | undefined =
        (raw.stages_field && typeof raw.stages_field === 'object') ? raw.stages_field :
            (raw.stages && typeof raw.stages === 'object') ? raw.stages : undefined;

    let startKey: string | undefined =
        (raw.start && stagesField?.[raw.start]) ? raw.start : undefined;

    if (!startKey && raw.current_stages) {
        const arr = Array.isArray(raw.current_stages) ? raw.current_stages : [raw.current_stages];
        const cand = arr?.[0];
        if (cand && stagesField?.[cand]) startKey = cand;
    }

    // Если не нашли — скан по объекту
    if (!stagesField) {
        const found = deepFindStagesBundle(raw);
        if (found.stagesField) {
            stagesField = found.stagesField;
            startKey = found.startKey || startKey;
            log('[TL][SCAN:found]', { where: found.where, count: Object.keys(found.stagesField || {}).length, startKey });
        }
    }

    if (!stagesField) return { stageKeys: [], stagesField: {} };

    // Автовычисление старта, если не задан
    if (!startKey) {
        const keys = Object.keys(stagesField);
        const indeg = new Map<string, number>(keys.map(k => [k, 0]));
        for (const k of keys) {
            const next = stagesField[k]?.if_success;
            const nextKey = Array.isArray(next) ? next?.[0] : next;
            if (nextKey && indeg.has(nextKey)) indeg.set(nextKey, (indeg.get(nextKey) || 0) + 1);
        }
        const zeroIn = keys.find(k => (indeg.get(k) || 0) === 0);
        startKey = zeroIn || keys[0];
    }

    // Строим линейную цепочку
    const stageKeys: string[] = [];
    let cursor = startKey;
    let guard = 0;
    while (cursor && cursor !== 'exit' && stagesField[cursor] && guard < 1000) {
        stageKeys.push(cursor);
        const next = stagesField[cursor]?.if_success;
        cursor = Array.isArray(next) ? next?.[0] : next;
        guard++;
    }

    return { stageKeys, stagesField, startKey };
}

/** value на этапы на основе правок */
function decorateStagesWithStageValue(
    stagesField: Record<string, any>,
    stageFieldEdits: any,
    rowIdx = 0
) {
    const out: Record<string, any> = {};
    const row = stageFieldEdits?.[rowIdx] ?? {};
    for (const [stageKey, stageDef] of Object.entries(stagesField || {})) {
        const cloned = { ...(stageDef as any) };
        const editedFields = row?.[stageKey]?.value || {};
        let stageValue: any = null;
        for (const v of Object.values(editedFields)) {
            if (v === undefined || v === null) continue;
            if (['string', 'number', 'boolean'].includes(typeof v)) { stageValue = v; break; }
            if (typeof v === 'object' && v && 'value' in (v as any)) {
                const vv = (v as any).value;
                if (vv !== undefined && vv !== null) { stageValue = vv; break; }
            }
        }
        (cloned as any).value = stageValue === undefined ? null : stageValue;
        out[stageKey] = cloned;
    }
    return out;
}

/** ------------------------- КОМПОНЕНТ ------------------------- */

const PprEditorPage: React.FC = () => {
    const {
        selectedTaskId,
        setSelectedTaskId,
        tabsConfirmed,
        setTabsConfirmed,
        paramsConfirmed,
        setParamsConfirmed,
        mainTemplate,
        setMainTemplate,
        currentStep,
        step3Done,
        step5Done,
    } = usePprWizard();

    const currentUser = userStore((s) => s.user)!;
    const workTimeStore = WorkTimeStore() as any;
    const { timelineWindow, setTimelineWindow } = workTimeStore;
    const selectedTimeWorkId: string | undefined = workTimeStore?.selectedTimeWorkId;

    const addedExecutors = useUserStore((s) => s.addedExecutors);

    const tasks = usePlannedTaskStore((s) => s.tasks);
    const selectedTask = useMemo(
        () => tasks.find((t) => t.id === selectedTaskId),
        [tasks, selectedTaskId],
    );

    const {
        executorsByTemplate,
        setExecutorsByTemplate,
        tabExecutors,
        setTabExecutors,
        pprExecutors,
        addExecutor,
        removeExecutor,
        normalizeExecId,
    } = usePprExecutors(currentUser, mainTemplate);

    const addFromYaml = useTimelineStore((s) => s.addFromYaml);
    const removeBySourcePrefix = useTimelineStore((s) => (s as any).removeBySourcePrefix);
    const updateTplStageDuration = useTimelineStore((s) => (s as any).updateTplStageDuration);
    const getMergedStageOverrides = useTimelineStore((s) => (s as any).getMergedStageOverrides);
    const getTimelineState = (useTimelineStore as any).getState;

    const [additionalTemplates, setAdditionalTemplates] = useState<Template[]>([]);
    const [hiddenExtraSlots, setHiddenExtraSlots] = useState<Set<number>>(new Set());

    const handleMoveBetweenExecutors = useTimelineMove({
        executorsByTemplate,
        setExecutorsByTemplate,
        tabExecutors,
        setTabExecutors,
        mainTemplate,
        additionalTemplates,
    });

    const liveRowsCount = useTimelineStore((s) => s.rows?.length ?? 0);
    useEffect(() => {
        if (liveRowsCount > 0) setParamsConfirmed(true);
    }, [liveRowsCount, setParamsConfirmed]);

    const paramsRef = useRef<HTMLDivElement | null>(null);
    const [tplReadyTick, setTplReadyTick] = useState(0);
    useEffect(() => {
        if ((mainTemplate as any)?.raw) setTplReadyTick((t) => t + 1);
    }, [mainTemplate]);

    const mainFormValuesRef = useRef<any>(null);

    const [reviewForId, setReviewForId] = useState<string | null>(null);
    const [statusVerified, setStatusVerified] = useState(false);
    const editingLocked = !!reviewForId && !statusVerified;

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

    const addTemplate = () => {
        if (editingLocked) return;
        const meExec = normalizeExec(currentUser);
        const newIndex = additionalTemplates.length;
        setAdditionalTemplates((prev) => [...prev, {} as Template]);
        setExecutorsByTemplate((prev) => [...prev, currentUser ? [meExec] : []]);
        const next = new Set(hiddenExtraSlots);
        next.delete(newIndex);
        setHiddenExtraSlots(next);
        setAllowStep5(false);
    };

    const changeTemplate = async (index: number, newTemplate: Template) => {
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
        const next = new Set(hiddenExtraSlots);
        next.delete(index);
        setHiddenExtraSlots(next);

        ensureAtLeastOneRow(resolved);
        setAllowStep5(false);
    };

    const [confirmState, setConfirmState] = useState<
        { open: true; kind: 'main' | 'extra'; index?: number } | { open: false }
    >({ open: false });

    const timelineExecutors = useMemo(() => {
        const list = (pprExecutors as any[]) ?? [];
        if (list.length > 0) return list;
        return (tabExecutors ?? []).map(normalizeExec);
    }, [pprExecutors, tabExecutors]);

    const authorUuid =
        pickUuid((currentUser as any)?.id, (currentUser as any)?.uuid) ??
        pickUuid(...(addedExecutors ?? []).map((v) => v.id)) ??
        pickUuid((selectedTask as any)?.authorId, (selectedTask as any)?.author_id);

    const timeWorkUuid =
        (selectedTimeWorkId && isUuid(selectedTimeWorkId) ? selectedTimeWorkId : undefined) ??
        pickUuid((selectedTask as any)?.timeWorkId, (selectedTask as any)?.time_work_id);

    const [saving, setSaving] = useState(false);
    const templateChosen = Boolean((mainTemplate as any)?.key);

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
                (acc, v) => ({ filled: acc.filled + (v?.filled ?? 0), required: acc.required + (v?.required ?? 0) }),
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

    const handleSave = async () => {
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
                getMergedStageOverrides,
                getTimelineState,
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
    };

    /** ====== DIAG: уже есть блоки с префиксом? (учитываем несколько полей) ====== */
    const timelineHasBlocksFor = (prefix: string) => {
        const tl = (useTimelineStore as any).getState?.();
        if (!tl || !Array.isArray(tl.rows)) return false;
        for (const row of tl.rows) {
            const blocks = Array.isArray(row?.blocks) ? row.blocks : [];
            if (
                blocks.some((b: any) => {
                    const sk = String(b?.sourceKey ?? '');
                    const tk = String((b as any)?.templateKey ?? '');
                    const label = String((b as any)?.label ?? '');
                    return sk.startsWith(prefix) || tk.startsWith(prefix) || label.includes(prefix);
                })
            ) return true;
        }
        return false;
    };

    /** ref на mainTemplateRaw */
    const mainRawForTimelineRef = useRef<any>(null);
    useEffect(() => {
        if ((mainTemplate as any)?.raw) {
            mainRawForTimelineRef.current = (mainTemplate as any).raw;
        }
    }, [mainTemplate]);

    /** ====== АВТОПОСТРОЕНИЕ ДЛЯ ГЛАВНОГО ШАБЛОНА ====== */
    useEffect(() => {
        const tKey = (mainTemplate as any)?.key;
        const rawCandidate = mainRawForTimelineRef.current || (mainTemplate as any)?.raw;
        const hasExec = (executorsByTemplate?.[0]?.length ?? 0) > 0;
        if (!tKey || !rawCandidate || !hasExec) return;

        const already = timelineHasBlocksFor(String(tKey));
        log('[autoBuild] check:', { tKey, hasExec, already });
        if (already) return;

        const { stageKeys, stagesField, startKey } = getStageChainFromMainRaw(rawCandidate);

        log('[TL][CHAIN]', { start: startKey, stages: Object.keys(stagesField || {}).length, stageKeys });

        const timeDiag = stageKeys.map((k) => {
            const t = String(stagesField?.[k]?.time ?? '').trim();
            const mm = Math.max(0, parseInt(t.replace(/\D+/g, ''), 10) || 0);
            return { key: k, time: t, mm };
        });
        log('[TL][TIME]', timeDiag);

        const tlState = (useTimelineStore as any).getState?.() || {};
        const edits = tlState?.stageFieldEdits || {};
        const decoratedStages = decorateStagesWithStageValue(stagesField, edits, 0);

        const execIds = (executorsByTemplate?.[0] ?? []).map((e) => String((e as any)?.id ?? e));
        log('[TL][ADD:req]', { sourceKey: tKey, execIds, keys: stageKeys.length });

        if (!stageKeys.length) {
            warn('[TL][WARN] stageKeys пуст — не из чего строить таймлайн');
            return;
        }

        try {
            logTLState('[TL][BEFORE]');
            const addFnType = typeof addFromYaml;
            log('[TL][ADD:call]', { addFromYaml: addFnType, hasStore: !!(useTimelineStore as any).getState, execIdsLen: execIds.length });

            if (addFnType !== 'function') {
                err('[TL][ERR] addFromYaml отсутствует или не функция');
                return;
            }

            addFromYaml({
                label: (rawCandidate as any)?.headline || (rawCandidate as any)?.description || tKey,
                stageKeys,
                stagesField: decoratedStages,
                execIds,
                sourceKey: tKey,
            });

            setTimeout(() => {
                logTLState('[TL][AFTER]');
                const tl = (useTimelineStore as any).getState?.();
                const rows = Array.isArray(tl?.rows) ? tl.rows : [];
                const blocksByKey = rows
                    .flatMap((r: any) => r?.blocks || [])
                    .filter((b: any) => String(b?.sourceKey ?? '').startsWith(String(tKey))).length;
                log('[TL][ADD:done]', { rows: rows.length, blocksBySourceKey: blocksByKey });
            }, 0);
        } catch (e) {
            err('[TL][ERR] addFromYaml threw', e);
        }
    }, [tplReadyTick, JSON.stringify(executorsByTemplate?.[0] ?? [])]);

    /** ======== ВОССТАНОВЛЕНИЕ ИЗ localStorage (V2 only) ======== */

    const applySnapshotToTimeline = (
        tplIdx: number,
        snap: UnifiedStagesSnapshot | undefined,
        templateKey: string | undefined,
        execIdsForSlot: string[] = [],
    ) => {
        if (!snap || !templateKey) return;

        try { removeBySourcePrefix?.({ prefix: String(templateKey), execIds: execIdsForSlot }); } catch {}

        const raw = snap.mainTemplateRaw || snap.mainTemplateRaw;
        if (tplIdx === 0 && raw) mainRawForTimelineRef.current = raw;

        const { stageKeys, stagesField, startKey } = getStageChainFromMainRaw(raw);
        log('[TL][CHAIN][restore]', { tplIdx, start: startKey, stages: Object.keys(stagesField || {}).length, stageKeys });

        if (stageKeys.length) {
            const tlState = (useTimelineStore as any).getState?.() || {};
            const edits = tlState?.stageFieldEdits || {};
            const decoratedStages = decorateStagesWithStageValue(stagesField, edits, 0);

            log('[TL][ADD:req][restore]', { tplIdx, sourceKey: templateKey, execIds: execIdsForSlot, keys: stageKeys.length });

            try {
                logTLState('[TL][BEFORE][restore]');
                const addFnType = typeof addFromYaml;
                log('[TL][ADD:call][restore]', { addFromYaml: addFnType, execIdsLen: execIdsForSlot.length });

                if (addFnType !== 'function') {
                    err('[TL][ERR][restore] addFromYaml отсутствует или не функция');
                    return;
                }

                addFromYaml({
                    label: (raw as any)?.headline || (raw as any)?.description || templateKey,
                    stageKeys,
                    stagesField: decoratedStages,
                    execIds: execIdsForSlot,
                    sourceKey: templateKey,
                });

                setTimeout(() => {
                    logTLState('[TL][AFTER][restore]');
                    const tl = (useTimelineStore as any).getState?.();
                    const rows = Array.isArray(tl?.rows) ? tl.rows : [];
                    const blocksByKey = rows
                        .flatMap((r: any) => r?.blocks || [])
                        .filter((b: any) => String(b?.sourceKey ?? '').startsWith(String(templateKey))).length;
                    log('[TL][ADD:done][restore]', { rows: rows.length, blocksBySourceKey: blocksByKey });
                }, 0);
            } catch (e) {
                err('[TL][ERR][restore] addFromYaml threw', e);
            }
        }

        if (snap?.stages) {
            for (const [stageKey, stage] of Object.entries(snap.stages)) {
                const timeStr = (stage as any)?.time;
                if (!timeStr || typeof timeStr !== 'string') continue;
                const mm = Math.max(0, parseInt(String(timeStr).replace(/\D+/g, ''), 10) || 0);
                try { updateTplStageDuration?.({ tplIdx, stageKey, minutes: mm }); } catch {}
            }
        }

        const tl = (useTimelineStore as any).getState?.();
        const setStageFieldEdits = tl?.setStageFieldEdits ?? tl?.mergeStageFieldEdits;
        if (typeof setStageFieldEdits === 'function' && snap?.stages) {
            const perRow: Record<string, Record<string, any>> = { '0': {} };
            for (const [stageKey, stage] of Object.entries(snap.stages)) {
                const srcFields = ((stage as any)?.fields) || {};
                const payload: Record<string, any> = {};
                for (const [fieldKey, f] of Object.entries(srcFields)) {
                    const v = f && typeof f === 'object' && 'value' in (f as any) ? (f as any).value : f;
                    if (v !== undefined) payload[fieldKey] = v;
                }
                if (Object.keys(payload).length > 0) perRow['0'][stageKey] = { value: payload };
            }
            try { setStageFieldEdits({ tplIdx, perRow }); } catch { try { setStageFieldEdits(perRow); } catch {} }
        }

        try {
            const setRows = (useTimelineStore as any).getState?.().setRows;
            const rows = (useTimelineStore as any).getState?.().rows ?? [];
            if (typeof setRows === 'function') setRows([...rows]);
        } catch {}
    };

    const restoreFromLocalStorage = async (taskId: string) => {
        const v2 = loadV2Snapshots(taskId);
        if (!v2.length) return;

        const uniqueKeys: string[] = Array.from(new Set(v2.map((x) => x.templateKey))).filter(Boolean);

        const resolved = await Promise.all(
            uniqueKeys.map((k) => resolveTemplateWithRaw({ key: k } as any, YAML_BUCKET)),
        );
        const [resolvedMain, ...resolvedExtras] = (resolved.filter(Boolean) as any[]) as Template[];
        if (!resolvedMain) {
            warn('restoreFromLocalStorage: cannot resolve main template');
            return;
        }

        setMainTemplate(resolvedMain);
        ensureAtLeastOneRow(resolvedMain);

        setAdditionalTemplates(resolvedExtras);
        resolvedExtras.forEach((tpl) => ensureAtLeastOneRow(tpl));

        const withExec = v2.find((x) => Array.isArray(x.snapshot?.executorsByTemplate));
        if (withExec?.snapshot?.executorsByTemplate?.length) {
            setExecutorsByTemplate(withExec.snapshot.executorsByTemplate);
            setTabExecutors((prev) =>
                prev.length ? prev : withExec.snapshot.executorsByTemplate[0] || [],
            );
        }

        uniqueKeys.forEach((tKey) => {
            const snapForKey = v2.find((x) => x.templateKey === tKey)?.snapshot;
            if (!snapForKey) return;
            const rows = rowsFromUnifiedSnapshot(snapForKey);
            const prev = getTemplateValuesSafe(tKey);
            const merged = dedupRows([...(Array.isArray(prev) ? prev : []), ...rows]);
            safeSetTemplateValues(tKey, merged);
        });

        const mainSnap = v2.find((x) => x.templateKey === (resolvedMain as any).key)?.snapshot;
        if (mainSnap?.mainTemplateRaw) mainRawForTimelineRef.current = mainSnap.mainTemplateRaw;

        setTplReadyTick((t) => t + 1);

        const ebt =
            (executorsByTemplate?.length ? executorsByTemplate : withExec?.snapshot?.executorsByTemplate) || [];
        const allTemplates: Template[] = [resolvedMain, ...resolvedExtras];
        allTemplates.forEach((tpl, i) => {
            const tKey = (tpl as any)?.key;
            if (!tKey) return;
            const execIdsForSlot = (ebt[i] ?? []).map((e: any) => String(e?.id ?? e));
            const firstId = execIdsForSlot[0];
            const found =
                (firstId && v2.find((x) => x.templateKey === tKey && x.executorId === firstId)) ||
                v2.find((x) => x.templateKey === tKey);
            applySnapshotToTimeline(i, found?.snapshot, tKey, execIdsForSlot);
        });

        setTabsConfirmed(true);
        setParamsConfirmed(true);
        setAllowStep5(true);

        (useTimelineStore as any).getState?.()?.rebuildAll?.();
        setTimeout(() => (useTimelineStore as any).getState?.()?.rebuildAll?.(), 0);
    };

    // steps / прогресс
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
                    <Button type="primary" onClick={handleSave} loading={saving} disabled={!canSave || editingLocked}>
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
                                            : [...prev, normalizeExec(executorToAdd)],
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
                                    onClick={() => {
                                        setTabsConfirmed(true);
                                    }}
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

                            const prevMainKey = (mainTemplate as any)?.key;
                            const execIds = (executorsByTemplate[0] ?? []).map(normalizeExecId);
                            if (prevMainKey) {
                                removeBySourcePrefix?.({ execIds, prefix: String(prevMainKey) });
                            }

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
                            setTimeout(() => paramsRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
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
                <div
                    ref={paramsRef}
                    style={editingLocked ? { pointerEvents: 'none', opacity: 0.6 } : undefined}
                >
                    {(mainTemplate as any)?.key && (mainTemplate as any)?.raw && (
                        <DynamicYamlForm
                            key={`main-${(mainTemplate as any)?.key}-${tplReadyTick}`}
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
                                    changeTemplate(templateIndex, newTemplate);
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
                                onClick={() =>
                                    setConfirmState({ open: true, kind: 'extra', index: templateIndex })
                                }
                            >
                                Удалить шаблон
                            </Button>
                        </div>

                        {(templateItem as any)?.key && (templateItem as any)?.raw && (
                            <DynamicYamlForm
                                key={`extra-${templateIndex}-${(templateItem as any)?.key}-${tplReadyTick}`}
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
                    <Button type="dashed" onClick={addTemplate} style={{ marginTop: 12 }} disabled={editingLocked}>
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
                                updateTplStageDuration?.({
                                    tplIdx: templateIdx,
                                    stageKey,
                                    minutes: Number(newTimerMinutes) || 0,
                                });

                                if (selectedTaskId) {
                                    patchStageTimeInLocalStorage({
                                        taskId: selectedTaskId,
                                        tplIdx: templateIdx,
                                        stageKey,
                                        minutes: Number(newTimerMinutes) || 0,
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

export default PprEditorPage;
