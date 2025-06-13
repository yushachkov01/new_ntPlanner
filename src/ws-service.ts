/**
 * WS-сервис: Hasura ⇄ Browser
 * ─ POST /works      → insert/patch и WS-патч в браузер
 * ─ /hasura-hook     → ретранслятор Event Trigger-ов Hasura
 */

import 'dotenv/config';
import bodyParser from 'body-parser';
import express from 'express';
import fetch from 'node-fetch';
import { WebSocketServer } from 'ws';
import { z } from 'zod';

/* ──────────────── schema ──────────────── */

const DbWork = z.object({
  id: z.number(), // serial PK
  date: z.string(),
  project: z.string(),
  site: z.string(),
  description: z.string(),
  time_range: z.string(),
  status: z.string(),
  ppr_hours: z.number(),
  work_hours: z.number(),
  overtime_hours: z.number(),
});
type DbWork = z.infer<typeof DbWork>;

const DbWorkInsert = DbWork.omit({ id: true });
type DbWorkInsert = z.infer<typeof DbWorkInsert>;

const DbWorkPatch = DbWork.partial().omit({ id: true });
type DbWorkPatch = z.infer<typeof DbWorkPatch>;

/**
 * DB-row (snake) → Work (camel)
 */
const toWork = (r: DbWork | (DbWorkInsert & { id: number })) => ({
  id: String(r.id),
  date: r.date,
  project: r.project,
  site: r.site,
  description: r.description,
  timeRange: r.time_range,
  status: r.status,
  pprHours: r.ppr_hours,
  workHours: r.work_hours,
  overtimeHours: r.overtime_hours,
});

/**
 * WebSocket
 */
const wss = new WebSocketServer({ port: 4000 });
const logClients = () => console.log(`WS clients connected: ${wss.clients.size}`);

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'hello', t: Date.now() }));
  logClients();
  ws.on('close', logClients);
});

const broadcast = (d: unknown) => {
  const msg = JSON.stringify(d);
  wss.clients.forEach((c) => c.readyState === 1 && c.send(msg));
};

/**
 * helpers: insert / patch через Hasura GraphQL
 */
const GRAPHQL = 'http://localhost:8080/v1/graphql';
const HEADERS = {
  'Content-Type': 'application/json',
  'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET ?? '',
};

async function gql<T>(query: string, variables: unknown): Promise<T> {
  const res = await fetch(GRAPHQL, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(JSON.stringify(json, null, 2));
  return json.data as T;
}

async function insertWork(row: DbWorkInsert): Promise<number> {
  const q = `mutation ($obj:works_insert_input!){
    insert_works_one(object:$obj,on_conflict:{constraint:works_pkey,update_columns:[]}){id}
  }`;
  const { insert_works_one } = await gql<{ insert_works_one: { id: number } }>(q, { obj: row });
  return insert_works_one.id;
}

async function updateWork(id: number, patch: DbWorkPatch): Promise<void> {
  const q = `mutation ($id:Int!,$set:works_set_input!){
    update_works_by_pk(pk_columns:{id:$id},_set:$set){id}
  }`;
  await gql(q, { id, set: patch });
}

/**
 *  HTTP API
 */
const app = express();
app.use(bodyParser.json());

/**
 * POST /works — вставка
 */
app.post('/works', async (req, res) => {
  try {
    const row = DbWorkInsert.parse(req.body);
    const id = await insertWork(row);
    broadcast({ type: 'work.patch', payload: toWork({ ...row, id }) });
    res.sendStatus(200);
  } catch (e) {
    console.error('[POST /works] ❌', e);
    res.status(400).end();
  }
});

/**
 * PATCH /works/:id — редактирование
 */
app.patch('/works/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const patch = DbWorkPatch.parse(req.body);
    await updateWork(id, patch);
    broadcast({ type: 'work.patch', payload: { id, ...patch } });
    res.sendStatus(200);
  } catch (e) {
    console.error('[PATCH /works]', e);
    res.status(400).end();
  }
});

/**
 * Event Trigger от Hasura
 */
app.post('/hasura-hook', (req, res) => {
  try {
    const row = DbWork.parse(req.body.event.data.new);
    broadcast({ type: 'work.patch', payload: toWork(row) });
    res.sendStatus(200);
  } catch (e) {
    console.error('[HOOK]', e);
    res.status(400).end();
  }
});

/**
 * start
 */
app.listen(3001, () =>
  console.log('HTTP :3001  POST /works  |  PATCH /works/:id  |  /hasura-hook   WS :4000'),
);
