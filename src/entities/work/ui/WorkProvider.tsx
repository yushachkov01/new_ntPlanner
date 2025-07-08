/**
 * Обёртка над приложением, которая:
 * 1) при монтировании загружает все work из БД в стор;
 * 2) подписывается на WebSocket-сообщения от сервера;
 */
import type { ReactNode } from 'react';
import { useEffect } from 'react';

import { workStore } from '@entities/work/model/store/WorkStore.ts';

type Props = { children: ReactNode };

export function WorkProvider({ children }: Props) {
  const { load, add, update, remove } = workStore();

  useEffect(() => {
    load();
    /**
     * real-time обновления
     */
    const ws = new WebSocket('ws://localhost:4000/');

    ws.onopen = () => console.log('WS opened');
    ws.onerror = (e) => console.error('WS error', e);
    ws.onmessage = (e) => {
      let msg: any;
      try {
        msg = JSON.parse(e.data);
      } catch {
        console.warn('WS: не удалось распарсить сообщение', e.data);
        return;
      }
      const { type, payload } = msg;
      if (!payload || typeof payload !== 'object') return;
      const rawId = payload.idInt ?? payload.id;
      const idInt =
        typeof rawId === 'number' ? rawId : typeof rawId === 'string' ? Number(rawId) : NaN;

      if (Number.isNaN(idInt)) {
        console.warn('WS: не удалось извлечь idInt из payload', payload);
        return;
      }

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
          const exists = workStore.getState().works.some((w) => w.id === normalized.id);

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
