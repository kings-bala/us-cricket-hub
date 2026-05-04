import { apiPost } from "./api";

export function trackEvent(eventName: string, eventData: Record<string, unknown> = {}, token?: string) {
  try {
    apiPost("/events", { eventName, eventData }, token).catch(() => {});
  } catch {
    // non-critical, silently fail
  }
}
