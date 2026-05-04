const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://zig9f1eaqf.execute-api.us-east-1.amazonaws.com/v1";

interface ApiOptions {
  method?: string;
  body?: unknown;
  token?: string;
}

// Singleton refresh promise to avoid concurrent refresh calls
let refreshPromise: Promise<string | null> | null = null;

// Callback to update the in-memory token in the auth context
let tokenUpdateCallback: ((token: string) => void) | null = null;

export function setTokenUpdateCallback(cb: (token: string) => void) {
  tokenUpdateCallback = cb;
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch("/api/auth/session", { credentials: "same-origin" });
    if (res.ok) {
      const data = await res.json();
      if (data.authenticated && data.accessToken) {
        if (tokenUpdateCallback) {
          tokenUpdateCallback(data.accessToken);
        }
        return data.accessToken;
      }
    }
  } catch {
    // Refresh failed — session is dead
  }
  return null;
}

export async function api<T = unknown>(path: string, opts: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, token } = opts;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // On 401, attempt a transparent token refresh and retry once
  if (res.status === 401 && token) {
    // Deduplicate concurrent refresh attempts
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }
    const newToken = await refreshPromise;
    if (newToken) {
      // Retry with the fresh token
      const retryHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${newToken}`,
      };
      const retryRes = await fetch(`${API_BASE}${path}`, {
        method,
        headers: retryHeaders,
        body: body ? JSON.stringify(body) : undefined,
      });
      const retryData = await retryRes.json();
      if (!retryRes.ok) {
        throw new Error(retryData.error || `API error ${retryRes.status}`);
      }
      return retryData as T;
    }
    // Refresh failed — throw the original 401
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `API error ${res.status}`);
  }
  return data as T;
}

export async function apiGet<T = unknown>(path: string, token?: string): Promise<T> {
  return api<T>(path, { token });
}

export async function apiPost<T = unknown>(path: string, body: unknown, token?: string): Promise<T> {
  return api<T>(path, { method: "POST", body, token });
}

export async function apiPut<T = unknown>(path: string, body: unknown, token?: string): Promise<T> {
  return api<T>(path, { method: "PUT", body, token });
}

export async function apiDelete<T = unknown>(path: string, token?: string): Promise<T> {
  return api<T>(path, { method: "DELETE", token });
}
