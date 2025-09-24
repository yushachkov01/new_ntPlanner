import {TIMELINE_CLASSES} from "@/shared/constants";
export type Status =
    | 'pending_manual'
    | 'pending_auto'
    | 'info'
    | 'done_on_time'
    | 'overtime'
    | 'window'
    | string;

/** Маппинг статуса в CSS-класс блока таймлайна */
export function getStatusClass(status: Status): string {
    switch (status) {
        case 'pending_manual':
        case 'pending_auto':
        case 'info':
            return 'timeline-block--info';
        case 'done_on_time':
            return 'timeline-block--ontime';
        case 'overtime':
            return 'timeline-block--overtime';
        case 'window':
            return 'timeline-block--window';
        default:
            return '';
    }
}

/** Класс контейнера по типам исполнителей в стадиях */
export function getContainerRoleClass(stages: Array<{ executorType?: string }>) {
    const types = stages.map((s) => String(s.executorType ?? '').toLowerCase());
    if (types.includes('auditor')) return TIMELINE_CLASSES.ROLE_AUDITOR;
    if (types.includes('installer')) return TIMELINE_CLASSES.ROLE_INSTALLER;
    return '';
}
