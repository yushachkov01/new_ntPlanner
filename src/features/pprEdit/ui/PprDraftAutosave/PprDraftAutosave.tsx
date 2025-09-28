/**
 * src/features/pprEdit/ui/PprDraftAutosave/PprDraftAutosave.tsx
 *
 * Невидимый мост-компонент: включает персистентность по текущему taskId
 * и передаёт в хук те данные, которых нет в глобальных сто́рах (mainTemplate, executorsByTemplate).
 */

import { memo } from 'react';
import { usePprDraftPersistence } from '@/shared/persist/pprDraft';
import { usePprWizard } from '@/features/pprEdit/model/hooks/usePprWizard';

type Props = {
    /** Явный taskId; если не передан — берём из мастера */
    taskId?: string;
    /** Текущий основной шаблон (у тебя уже есть его key и raw) */
    mainTemplate?: any;
    /** Матрица исполнителей по шаблонам (как у тебя на странице) */
    executorsByTemplate?: any[][];
};

const PprDraftAutosave = memo(({ taskId, mainTemplate, executorsByTemplate }: Props) => {
    const wizard = usePprWizard();
    const effectiveTaskId = taskId ?? wizard.selectedTaskId;

    // Включаем гидрацию/автосохранение + пробрасываем данные для «единого среза»
    usePprDraftPersistence(effectiveTaskId, { mainTemplate, executorsByTemplate });

    return null;
});

export default PprDraftAutosave;
