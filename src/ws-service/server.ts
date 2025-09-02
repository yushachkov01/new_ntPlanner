/**
 * WS-сервис: Hasura <-> Browser
 * ─ /hasura-hook  -> ретранслятор Event Trigger Hasura
 */
import 'dotenv/config';
import bodyParser from 'body-parser';
import express from 'express';
import { WebSocketServer } from 'ws';
import { z } from 'zod';

/**
 * Схема таблицы из Hasura Event Trigger
 * @property schema - схема таблицы  (public7)
 * @property name - имя таблицы ( query )
 */
const HasuraTable = z.object({ schema: z.string(), name: z.string() });
/**
 * Схема события Hasura (INSERT, UPDATE, DELETE)
 * @property op - тип операции
 * @property data - старые/новые данные записи
 */
const HasuraEvent = z.object({
  op: z.enum(['INSERT', 'UPDATE', 'DELETE']),
  data: z.object({ old: z.any().optional(), new: z.any().optional() }),
});
/**
 * Схема тела запроса от Hasura Event Trigger
 * @property table - описание таблицы (schema + name)
 * @property event - событие (INSERT/UPDATE/DELETE)
 */
const HasuraHookBody = z.object({ table: HasuraTable, event: HasuraEvent });

/**
 * WebSocket-сервер для трансляции событий Hasura клиентам
 */
const wss = new WebSocketServer({ port: 4000 });

/**
 * Широковещательная рассылка сообщения всем подключённым клиентам.
 * @param message - объект для отправки
 */
const broadcast = (message: unknown) => {
  const payload = JSON.stringify(message);
  wss.clients.forEach((client: any) => {
    if (client.readyState === 1) client.send(payload);
  });
};

setInterval(() => broadcast({ type: 'ping', t: Date.now() }), 15000);

/**
 * Логируем количество клиентов при подключении/отключении.
 */
wss.on('connection', (socket) => {
  console.log(`[WS] client connected. Total: ${wss.clients.size}`);
  socket.on('close', () => console.log(`[WS] client disconnected. Total: ${wss.clients.size}`));
});

/**
 * для обработки входящих Event Trigger от Hasura.
 */
const app = express();
app.use(bodyParser.json());

/**
 * Обработчик запроса от Hasura Event Trigger.
 * Преобразует входящие данные в события WebSocket.
 */
app.post('/hasura-hook', (req, res) => {
  try {
    const parsed = HasuraHookBody.safeParse(req.body);
    if (!parsed.success) {
      console.error('[/hasura-hook] zod parse failed:', parsed.error.flatten());
      return res.status(400).end();
    }

    const { table, event } = parsed.data;
    const fullQualifiedTableName = `${table.schema}.${table.name}`;

    // Общее логирование — один раз, чтобы видеть, что хук вообще приходит
    console.log(
      `[HOOK] ${event.op} ${fullQualifiedTableName} old=${!!event.data.old} new=${!!event.data.new}`,
    );

    /**
     * Реалтайм для интерфейсов (public7.query)
     */
    if (table.name === 'query') {
      if (event.op === 'DELETE') {
        broadcast({
          type: 'iface.ping',
          table: fullQualifiedTableName,
          op: event.op,
          t: Date.now(),
        });
      } else {
        const newRow: any = event.data.new ?? {};
        broadcast({
          type: 'iface.data',
          table: fullQualifiedTableName,
          deviceId: newRow.device,
          requestType: newRow.request_type,
          interfaces: newRow?.result?.interfaces ?? [],
          t: Date.now(),
        });
      }
    }

    /**
     * Реалтайм для устройств (public7.devices)
     */
    if (table.name === 'devices') {
      if (event.op === 'DELETE') {
        const or: any = event.data.old ?? {};
        broadcast({
          type: 'device.delete',
          table: fullQualifiedTableName,
          id: or?.id,
          t: Date.now(),
        });
      } else {
        const nr: any = event.data.new ?? {};
        broadcast({
          type: 'device.patch',
          table: fullQualifiedTableName,
          device: { id: nr?.id, hostname: nr?.hostname },
          t: Date.now(),
        });
      }
    }
    if (table.name === 'planned_tasks') {
      if (event.op === 'INSERT' || event.op === 'UPDATE') {
        const nr: any = event.data.new ?? {};
        broadcast({
          type: 'planned_tasks.status',
          table: fullQualifiedTableName,
          id: nr?.id,
          status: nr?.status ?? null,
          t: Date.now(),
        });
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('[/hasura-hook] unhandled error:', err);
    res.status(500).end();
  }
});

/** Запуск */
app.listen(3001, () => {
  console.log('HTTP  :3001  /hasura-hook');
  console.log('WS    :4000');
});
