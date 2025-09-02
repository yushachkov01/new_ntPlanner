/**
 * WS-сервис: Hasura <-> Browser
 * ─ /hasura-hook  -> ретранслятор Event Trigger Hasura
 */
import 'dotenv/config';
import bodyParser from 'body-parser';
import express from 'express';
import { WebSocketServer } from 'ws';
import { z } from 'zod';

const HTTP_PORT = Number(process.env.HTTP_PORT ?? 3001);
const WS_PORT = Number(process.env.WS_PORT ?? 4000);

//  секрет для вебхука Hasura
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

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
const wss = new WebSocketServer({ port: WS_PORT });

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

setInterval(() => broadcast({ type: 'ping', t: Date.now() }), 15_000);
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

/** Healthcheck */
app.get('/health', (_req, res) => res.status(200).json({ ok: true }));

/**
 * Обработчик запроса от Hasura Event Trigger.
 * Преобразует входящие данные в события WebSocket.
 */
app.post('/hasura-hook', (req, res) => {
  try {
    // проверка секрета
    if (WEBHOOK_SECRET && req.get('x-webhook-secret') !== WEBHOOK_SECRET) {
      console.warn('[/hasura-hook] invalid secret');
      return res.status(401).end();
    }

    const { table, event } = HasuraHookBody.parse(req.body);
    const fqn = `${table.schema}.${table.name}`;

    /**
     * Реалтайм для интерфейсов (public7.query)
     */
    if (fqn === 'public7.query') {
      if (event.op === 'DELETE') {
        broadcast({ type: 'iface.ping', table: fqn, op: event.op, t: Date.now() });
      } else {
        const row = (event.data as any).new;
        broadcast({
          type: 'iface.data',
          table: fqn,
          deviceId: row.device,
          requestType: row.request_type,
          interfaces: row?.result?.interfaces ?? [],
          t: Date.now(),
        });
      }
    }

    if (fqn === 'public7.devices') {
      if (event.op === 'DELETE') {
        const oldRow = (event.data as any).old;
        broadcast({ type: 'device.delete', table: fqn, id: oldRow?.id, t: Date.now() });
      } else {
        const newRow = (event.data as any).new;
        broadcast({
          type: 'device.patch',
          table: fqn,
          device: { id: newRow?.id, hostname: newRow?.hostname },
          t: Date.now(),
        });
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('[/hasura-hook] parse error:', err);
    res.status(400).end();
  }
});

/** Запуск */
app.listen(HTTP_PORT, () => {
  console.log(`HTTP  :${HTTP_PORT}  /hasura-hook /health`);
  console.log(`WS    :${WS_PORT}`);
});
