/**
 * реализует единый WebSocket на вкладку.
 * Он используется как простая "шина событий":
 * - Любой компонент/часть приложения может подписаться на сообщения
 * - Поддерживается автоматический reconnect при разрыве
 * - Есть keep-alive
 * - Можно подписываться/отписываться и отправлять сообщения
 */

type Listener = (msg: any) => void;

/** Текущее WebSocket соединение или null */
let socket: WebSocket | null = null;

/** Множество активных слушателей */
const listeners = new Set<Listener>();

/** Флаг — идёт ли сейчас соединение */
let connecting = false;

/** Таймер для keep-alive пинга */
let pingTimer: number | undefined;

/** URL сервера WebSocket */
export const WS_URL = (import.meta as any).env.VITE_WS_URL;

/** Интервал keep-alive */
const PING_EVERY_MS = 15000;

/**
 * Создание и настройка WebSocket-соединения.
 */
function ensureSocket() {
  if (
    socket &&
    (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)
  ) {
    return;
  }
  if (connecting) return;

  connecting = true;
  console.log(`[WS] connecting to ${WS_URL}`);
  socket = new WebSocket(WS_URL);

  /** Событие: соединение открыто */
  socket.onopen = () => {
    connecting = false;
    console.log('[WS] connected ');

    clearInterval(pingTimer);
    pingTimer = window.setInterval(() => {
      try {
        if (socket?.readyState === WebSocket.OPEN) {
          socket.send('{"type":"ping"}');
        }
      } catch {}
    }, PING_EVERY_MS);
  };

  /** Событие: пришло сообщение */
  socket.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      listeners.forEach((l) => l(msg));
    } catch {
      console.warn('[WS] non-JSON message ignored:', event.data);
    }
  };

  /** Событие: ошибка соединения */
  socket.onerror = (err) => {
    console.error('[WS] error:', err);
  };

  /** Событие: соединение закрыто */
  socket.onclose = () => {
    connecting = false;
    console.warn('[WS] disconnected');

    clearInterval(pingTimer);
    pingTimer = undefined;

    setTimeout(() => ensureSocket(), 2000);
  };
}

/**
 * Закрывает соединение, если слушателей больше нет.
 */
function teardownIfUnused() {
  if (listeners.size === 0 && socket) {
    console.log('[WS] no listeners left, closing connection');
    clearInterval(pingTimer);
    pingTimer = undefined;
    try {
      socket.close();
    } catch {}
    socket = null;
  }
}

/**
 * Подписка на сообщения
 */
export function subscribe(fn: Listener) {
  ensureSocket();
  listeners.add(fn);
  console.log('[WS] listener subscribed, total:', listeners.size);

  return () => {
    listeners.delete(fn);
    console.log('[WS] listener unsubscribed, total:', listeners.size);
    teardownIfUnused();
  };
}

/**
 * Отправка сообщения
 */
export function send(msg: any) {
  ensureSocket();
  const serialized = JSON.stringify(msg);

  if (socket?.readyState === WebSocket.OPEN) {
    console.log('[WS] send:', msg);
    socket.send(serialized);
  } else {
    console.log('[WS] queue message until connected:', msg);
    const unsubscribe = subscribe(() => {
      if (socket?.readyState === WebSocket.OPEN) {
        console.log('[WS] send (after connect):', msg);
        socket.send(serialized);
        unsubscribe();
      }
    });
  }
}

/**
 * Поддержка HMR
 */
if ((import.meta as any).hot) {
  (import.meta as any).hot.dispose(() => {
    console.log('[WS] HMR dispose — clear listeners and close socket');
    listeners.clear();
    teardownIfUnused();
  });
}
