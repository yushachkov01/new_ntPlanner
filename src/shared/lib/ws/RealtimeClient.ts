import { graphql } from 'react-relay';
import type { Environment } from 'relay-runtime';
import { commitLocalUpdate, createOperationDescriptor } from 'relay-runtime';

import type { Work } from '@/ws-service';

import type { RealtimeClient_WorksPatchQuery$data } from '../../../__generated__/RealtimeClient_WorksPatchQuery.graphql';
import WorksPatchQueryArtifact from '../../../__generated__/RealtimeClient_WorksPatchQuery.graphql';

/**
 * только на этапе компиляции Relay
 */
export const WorksPatchQuery = graphql`
  query RealtimeClient_WorksPatchQuery($id: Int!) {
    works_by_pk(id: $id) {
      id
      date
      project
      site
      description
      timeRange: time_range
      status
      pprHours: ppr_hours
      workHours: work_hours
      overtimeHours: overtime_hours
    }
  }
`;

export function connectRealtime(env: Environment) {
  const ws = new WebSocket('ws://localhost:4000');

  ws.onerror = (err) => console.error('[RT] ws error', err);

  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);

    if (msg.type !== 'work.patch') return;
    const work: Work = msg.payload;

    /**
     * патчим works_by_pk
     */
    const patch: RealtimeClient_WorksPatchQuery$data = {
      works_by_pk: { __typename: 'works', ...work },
    };
    const op = createOperationDescriptor(WorksPatchQueryArtifact, {
      id: work.id,
    });
    (env as any).commitPayload(op, patch);

    commitLocalUpdate(env, (store) => {
      const root = store.getRoot();
      const recordID = `works:${work.id}`;

      /**
       * создаём/обновляем сам объект
       */
      let rec = store.get(recordID);
      if (!rec) rec = store.create(recordID, 'works');
      Object.entries(work).forEach(([k, v]) => rec!.setValue(v as any, k));

      /**
       *  берём текущий список и удаляем  все с тем же id
       */
      const current = root.getLinkedRecords('works') ?? [];
      const cleaned = current.filter((r) => r && r.getDataID() !== recordID);

      /**
       * добавляем свежую запись и сортируем (по дате, свежие сверху)
       */
      const next = [rec, ...cleaned].sort((a, b) =>
        (b!.getValue('date') as string).localeCompare(a!.getValue('date') as string),
      );

      /**
       *  сохраняем список обратно
       */
      root.setLinkedRecords(next, 'works');
    });
  };
}
