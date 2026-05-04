"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export default function PageViewTracker({ event, data }: { event: string; data?: Record<string, unknown> }) {
  useEffect(() => {
    trackEvent(event, data || {});
  }, [event, data]);
  return null;
}
