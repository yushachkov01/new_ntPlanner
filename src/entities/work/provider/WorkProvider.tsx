/**
 * Обёртка над приложением, которая:
 * 1) при монтировании загружает все work из БД в стор;
 * 2) подписывается на WebSocket-сообщения от сервера;
 */
import type { ReactNode } from 'react';
import { useEffect } from 'react';

import { useWorkStore } from '@entities/work/store/useWorkStore.ts';

type Props = { children: ReactNode };

export function WorkProvider({ children }: Props) {
  const { load, add, update, remove } = useWorkStore();

  useEffect(() => {
    load();
    /**
     * real-time обновления
     */
    const ws = new WebSocket('ws://localhost:4000/');

    ws.onopen = () => console.log('WS opened');
    ws.onerror = (e) => console.error('WS error', e);
    ws.onmessage = (e) => {
      const { type, payload } = JSON.parse(e.data) as any;

      const idInt: number = payload.idInt != null ? payload.idInt : payload.id;

      const normalized = {
        ...payload,
        idInt,
        id: String(idInt),
      };

      switch (type) {
        case 'work.full':
          add(normalized);
          break;

        case 'work.patch':
          const exists = useWorkStore.getState().works.some((w) => w.id === normalized.id);

          if (exists) {
            update(normalized);
          } else {
            add(normalized);
          }
          break;

        case 'work.delete':
          remove(idInt);
          break;
      }
    };

    return () => {
      ws.close();
    };
  }, [load, add, update, remove]);

  return <>{children}</>;
}
