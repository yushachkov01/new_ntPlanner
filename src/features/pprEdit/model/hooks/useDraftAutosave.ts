import { useCallback, useEffect, useMemo } from 'react';

import { useDraftsStore } from '@/entities/PlannedTask/model/store/draftsStore';
import type { PlannedTaskDraft, UUID } from '@/shared/types/offline';

/**
 * Универсальный авто-сейв черновика.
 * @param taskId UUID задачи
 * @param payloadSupplier функция, возвращающая полезную нагрузку черновика (без id/updatedAt/version)
 * @returns утилиты для восстановления
 */
export function useDraftAutosave(
    taskId: UUID,
    payloadSupplier: () => Omit<PlannedTaskDraft, 'id' | 'updatedAt' | 'version'>,
) {
    const upsertDraft = useDraftsStore((s) => s.upsertDraft);
    const getDraft = useDraftsStore((s) => s.getDraft);

    // мемоизация снапшота, чтобы не дергать localStorage при каждом ререндере
    const restoredDraft = useMemo(() => getDraft(taskId), [getDraft, taskId]);

    // Автосохранение (дебаунс через requestIdleCallback + таймер fallback)
    useEffect(() => {
        let t: number | undefined;
        const run = () => {
            const base = payloadSupplier();
            upsertDraft({ id: taskId, ...base, version: 1, updatedAt: new Date().toISOString() });
        };

        const schedule = () => {
            if ('requestIdleCallback' in window) {
                (window as any).requestIdleCallback(run, { timeout: 1000 });
            } else {
                t = window.setTimeout(run, 400);
            }
        };

        // Сохраняем на видимые изменения документа
        const onChange = () => {
            if (t) window.clearTimeout(t);
            schedule();
        };

        document.addEventListener('ntp:form:changed', onChange);
        document.addEventListener('ntp:timeline:changed', onChange);

        return () => {
            document.removeEventListener('ntp:form:changed', onChange);
            document.removeEventListener('ntp:timeline:changed', onChange);
            if (t) window.clearTimeout(t);
        };
    }, [payloadSupplier, taskId, upsertDraft]);

    const loadDraft = useCallback(() => getDraft(taskId), [getDraft, taskId]);

    return { restoredDraft, loadDraft };
}
