import type { RequestParameters, Variables } from 'relay-runtime';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';

const fetchRelay = async <V extends Variables>(params: RequestParameters, variables: V) => {
  const res = await fetch(import.meta.env.VITE_HASURA_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': import.meta.env.VITE_HASURA_ADMIN_SECRET,
    },
    body: JSON.stringify({
      query: params.text,
      variables,
    }),
  });

  return res.json();
};

/**
 * Единая схема ключей (dataID) для Relay-Store
 *  *    – нормализованный кэш ←→ патчи через WS
 * @param obj
 */
const dataIDFromObject = (obj: Record<string, unknown>) => {
  if (obj.__typename === 'works' && obj.id != null) {
    return `works:${obj.id}`; // ← ВСЕГДА такой же ключ
  }
  return undefined;
};

/**
 * Singleton Environment
 */
export const RelayEnvironment = new Environment({
  network: Network.create(fetchRelay),
  store: new Store(new RecordSource(), { gcReleaseBufferSize: 10 }),
  log: console.log,
  dataIDFromObject,
});
