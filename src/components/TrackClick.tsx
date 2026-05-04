"use client";

import { trackEvent } from "@/lib/analytics";

export default function TrackClick({
  event,
  data,
  children,
  className,
  href,
}: {
  event: string;
  data?: Record<string, unknown>;
  children: React.ReactNode;
  className?: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => trackEvent(event, data || {})}
    >
      {children}
    </a>
  );
}
