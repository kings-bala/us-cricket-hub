const PREFIX = "cricverse360_";

function key(name: string): string {
  return `${PREFIX}${name}`;
}

export function getItem<T>(name: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key(name));
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setItem<T>(name: string, value: T): void {
  try {
    localStorage.setItem(key(name), JSON.stringify(value));
  } catch {}
}

export function removeItem(name: string): void {
  try {
    localStorage.removeItem(key(name));
  } catch {}
}

export function getRawItem(name: string): string | null {
  try {
    return localStorage.getItem(key(name));
  } catch {
    return null;
  }
}

export function setRawItem(name: string, value: string): void {
  try {
    localStorage.setItem(key(name), value);
  } catch {}
}
