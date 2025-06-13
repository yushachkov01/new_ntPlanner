export interface Work {
    /**
     * первичный ключ таблицы works
     */
    id: number;

    /**
     *  ISO-дата «YYYY-MM-DD»
     */
    date: string;

    project: string;
    site: string;
    description: string;

    /**
     *  строка "09:00–16:00" (UI парсит/рисует как есть)
     */
    timeRange: string;

    /**
     * pending | in_progress | done  — или расширенный список, если понадобится
     */
    status: string;

    pprHours:      number;
    workHours:     number;
    overtimeHours: number;
}

/**
 * тип сообщения, которое летит по WebSocket
 */
export interface WorkPatchMessage {
    type: 'work.patch';
    payload: Work;
}
