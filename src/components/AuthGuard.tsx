"use client";

import { useAuth } from "@/lib/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, Suspense, Component, type ReactNode } from "react";

class RenderBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: ReactNode; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

/*
 * Route classification:
 * PUBLIC  — accessible without auth (homepage, marketing, legal, tools, etc.)
 * PROTECTED — requires auth, redirects to /auth?next=<path> if not logged in
 * ADMIN — requires auth + admin role
 *
 * Any route not matched by a public prefix is treated as protected.
 */
const PUBLIC_PATHS = [
  "/",
  "/auth",
  "/analyze",
  "/coaches",
  "/leaderboard",
  "/pricing",
  "/privacy",
  "/terms",
  "/sample-analysis",
  "/sponsors",
  "/agents",
  "/scouting",
  "/community",
  "/scoring",
  "/strategy",
  "/streaming",
  "/store",
  "/stats",
  "/rankings",
  "/selector",
  "/squad-builder",
  "/player",
  "/processors",
];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublic = isPublicRoute(pathname);
  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    if (isLoading) return;
    if (!user && !isPublic) {
      router.replace(`/auth?next=${encodeURIComponent(pathname)}`);
    } else if (isAdminRoute && (!user || user.role !== "admin")) {
      router.replace("/auth");
    }
  }, [user, isLoading, pathname, router, isPublic, isAdminRoute]);

  // Public routes render immediately — no auth loading gate needed.
  // Wrapped in Suspense + ErrorBoundary so pages that suspend (useSearchParams)
  // or throw (empty mock data) degrade to skeleton instead of failing the build.
  if (isPublic) {
    const fallback = (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center font-bold text-lg text-white mx-auto mb-4 animate-pulse">CV</div>
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
    return (
      <RenderBoundary fallback={fallback}>
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      </RenderBoundary>
    );
  }

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

  if (!user) return null;

  return <>{children}</>;
}
