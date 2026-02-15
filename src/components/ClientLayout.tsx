"use client";

import { AuthProvider } from "@/context/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGuard>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </AuthGuard>
    </AuthProvider>
  );
}
