import type { ReactNode } from 'react';
import { useEffect } from 'react';

import type { WorkDto } from '@/entities/work/model/work.types';
import { useWorkStore } from '@/entities/work/store/useWorkStore';

type Props = { children: ReactNode };

export function WorkProvider({ children }: Props) {
  const { load, add, update } = useWorkStore();

  useEffect(() => {
    /**
     * initial GraphQL fetch
     */
    load();

    /**
     * WS real-time updates
     */
    const ws = new WebSocket('ws://localhost:4000');
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data) as { type: string; payload: any };
      if (msg.type === 'work.patch') {
        const dto = msg.payload as WorkDto;
        // payload может быть частичным или полным:
        if (Object.keys(dto).length === 10) {
          // полный объект
          add(dto);
        } else {
          // частичный патч
          update(dto);
        }
      }
    };
  }, [load, add, update]);

  return <>{children}</>;
}
