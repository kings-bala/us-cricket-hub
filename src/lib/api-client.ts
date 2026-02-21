const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

let currentUserEmail = "";
let currentUserName = "";

export function setApiUser(email: string, name: string): void {
  currentUserEmail = email;
  currentUserName = name;
}

export function clearApiUser(): void {
  currentUserEmail = "";
  currentUserName = "";
}

function getUserHeaders(): Record<string, string> {
  const h: Record<string, string> = {};
  if (currentUserEmail) h["X-User-Email"] = currentUserEmail;
  if (currentUserName) h["X-User-Name"] = currentUserName;
  return h;
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string;
};

type ApiResponse<T> = {
  ok: boolean;
  data: T;
  offline: boolean;
};

let backendAvailable: boolean | null = null;
let lastCheck = 0;
const CHECK_INTERVAL = 30_000;

async function checkBackend(): Promise<boolean> {
  if (!API_BASE) return false;
  const now = Date.now();
  if (backendAvailable !== null && now - lastCheck < CHECK_INTERVAL) return backendAvailable;
  try {
    const res = await fetch(`${API_BASE}/health`, { method: "GET", signal: AbortSignal.timeout(3000) });
    backendAvailable = res.ok;
  } catch {
    backendAvailable = false;
  }
  lastCheck = now;
  return backendAvailable;
}

export function isBackendConfigured(): boolean {
  return !!API_BASE;
}

export function resetBackendCheck(): void {
  backendAvailable = null;
  lastCheck = 0;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const online = await checkBackend();
  if (!online) {
    return { ok: false, data: null as T, offline: true };
  }
  const { method = "GET", body, token } = options;
  const headers: Record<string, string> = { "Content-Type": "application/json", ...getUserHeaders() };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    return { ok: res.ok, data, offline: false };
  } catch {
    backendAvailable = false;
    return { ok: false, data: null as T, offline: true };
  }
}

export async function isOnline(): Promise<boolean> {
  return checkBackend();
}

const SYNC_QUEUE_KEY = "cricverse360_sync_queue";

type SyncItem = {
  id: string;
  path: string;
  method: string;
  body: unknown;
  createdAt: string;
};

export function queueSync(path: string, method: string, body: unknown): void {
  try {
    const raw = localStorage.getItem(SYNC_QUEUE_KEY);
    const queue: SyncItem[] = raw ? JSON.parse(raw) : [];
    queue.push({ id: crypto.randomUUID(), path, method, body, createdAt: new Date().toISOString() });
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  } catch {}
}

export function getSyncQueueLength(): number {
  try {
    const raw = localStorage.getItem(SYNC_QUEUE_KEY);
    if (!raw) return 0;
    return JSON.parse(raw).length;
  } catch {
    return 0;
  }
}

export async function flushSyncQueue(token?: string): Promise<number> {
  const online = await checkBackend();
  if (!online) return 0;
  try {
    const raw = localStorage.getItem(SYNC_QUEUE_KEY);
    if (!raw) return 0;
    const queue: SyncItem[] = JSON.parse(raw);
    if (queue.length === 0) return 0;
    let synced = 0;
    const failed: SyncItem[] = [];
    for (const item of queue) {
      try {
        const headers: Record<string, string> = { "Content-Type": "application/json", ...getUserHeaders() };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const res = await fetch(`${API_BASE}${item.path}`, {
          method: item.method,
          headers,
          body: item.body ? JSON.stringify(item.body) : undefined,
        });
        if (res.ok) {
          synced++;
        } else {
          failed.push(item);
        }
      } catch {
        failed.push(item);
        break;
      }
    }
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(failed));
    return synced;
  } catch {
    return 0;
  }
}
