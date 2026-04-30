const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

interface ApiOptions {
  method?: string;
  body?: unknown;
  token?: string;
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
