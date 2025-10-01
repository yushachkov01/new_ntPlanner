/**
 * src/features/pprEdit/ui/PprDraftAutosave/PprDraftAutosave.tsx
 *
 * Невидимый мост-компонент: включает персистентность по текущему taskId
 * и передаёт в хук те данные, которых нет в глобальных сто́рах.
 */
import { memo } from 'react';
import { usePprDraftPersistence } from '@/shared/persist/pprDraft';
import { usePprWizard } from '@/features/pprEdit/model/hooks/usePprWizard';

type Props = {
    /** Явный taskId; если не передан — берём из мастера */
    taskId?: string;
    /** Текущий основной шаблон (с key и raw) */
    mainTemplate?: any;
    /** Матрица исполнителей по шаблонам */
    executorsByTemplate?: any[][];
    /** ВАЖНО: все шаблоны (основной + дополнительные) для мультисейва */
    templates?: Array<any | undefined>;
};

const PprDraftAutosave = memo(({ taskId, mainTemplate, executorsByTemplate, templates }: Props) => {
    const wizard = usePprWizard();
    const effectiveTaskId = taskId ?? wizard.selectedTaskId;

    // Подключаем автосейв — теперь с полным списком шаблонов
    usePprDraftPersistence(effectiveTaskId, { mainTemplate, executorsByTemplate, templates });

    return null;
});

export default PprDraftAutosave;
