"use client";

import { useEffect } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SyncStatus from "@/components/SyncStatus";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <AuthGuard>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <SyncStatus />
          <PWAInstallPrompt />
        </AuthGuard>
      </SubscriptionProvider>
    </AuthProvider>
  );
}
