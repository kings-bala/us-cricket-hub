"use client";

import { AuthProvider } from "@/context/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SyncStatus from "@/components/SyncStatus";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGuard>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <SyncStatus />
      </AuthGuard>
    </AuthProvider>
  );
}
