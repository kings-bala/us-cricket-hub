"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const publicPaths = ["/", "/auth", "/auth/register"];
  const isPublic = publicPaths.includes(pathname);

  useEffect(() => {
    if (!isLoading && !user && !isPublic) {
      router.replace("/auth");
    }
  }, [user, isLoading, pathname, router, isPublic]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center font-bold text-lg text-white mx-auto mb-4 animate-pulse">CV</div>
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && !isPublic) return null;

  return <>{children}</>;
}
