import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { jsonStorage } from '@/shared/lib/storage/jsonStorage';
import { LS_KEYS, OFFLINE_V } from '@/shared/types/offline';

export interface QueuedMutation {
    id: string;
    key: string; // ключ в реестре TypedDocumentNode
    variables: Record<string, unknown>;
    createdAt: string;
}

type MQState = {
    queue: QueuedMutation[];
    push: (m: QueuedMutation) => void;
    shift: () => QueuedMutation | undefined;
    clear: () => void;
};

export const useMutationQueue = create<MQState>()(
    devtools(
        persist(
            (set, get) => ({
                queue: [],
                push: (m) => set((s) => ({ queue: [...s.queue, m] })),
                shift: () => {
                    const [head, ...tail] = get().queue;
                    set({ queue: tail });
                    return head;
                },
                clear: () => set({ queue: [] }),
            }),
            { name: LS_KEYS.MUTATION_QUEUE, storage: jsonStorage, version: OFFLINE_V },
        ),
    ),
);
