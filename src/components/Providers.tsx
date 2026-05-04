"use client";

import { AuthProvider } from "@/lib/auth";
import AuthGuard from "@/components/AuthGuard";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AuthGuard>{children}</AuthGuard>
    </AuthProvider>
  );
}
