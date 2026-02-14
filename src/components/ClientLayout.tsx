"use client";

import { RoleProvider } from "@/context/RoleContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </RoleProvider>
  );
}
