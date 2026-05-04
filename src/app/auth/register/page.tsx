"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/auth");
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-slate-400">Redirecting to sign up...</p>
    </div>
  );
}
