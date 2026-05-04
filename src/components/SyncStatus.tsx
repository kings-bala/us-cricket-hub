"use client";

import { useState, useEffect, useCallback } from "react";
import { isBackendConfigured, isOnline, getSyncQueueLength, flushSyncQueue } from "@/lib/api-client";

export default function SyncStatus() {
  const [online, setOnline] = useState<boolean | null>(null);
  const [pending, setPending] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const configured = isBackendConfigured();

  const check = useCallback(async () => {
    if (!configured) return;
    const status = await isOnline();
    setOnline(status);
    setPending(getSyncQueueLength());
  }, [configured]);

  useEffect(() => {
    check();
    const interval = setInterval(check, 30_000);
    return () => clearInterval(interval);
  }, [check]);

  const handleSync = async () => {
    setSyncing(true);
    const synced = await flushSyncQueue();
    setPending(getSyncQueueLength());
    setSyncing(false);
    if (synced > 0) {
      setOnline(true);
    }
  };

  if (!configured) return null;
  if (online === null) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium shadow-lg ${online ? "bg-green-900/80 text-green-200 border border-green-700" : "bg-yellow-900/80 text-yellow-200 border border-yellow-700"}`}>
        <span className={`w-2 h-2 rounded-full ${online ? "bg-green-400" : "bg-yellow-400 animate-pulse"}`} />
        {online ? "Online" : "Offline Mode"}
        {pending > 0 && (
          <button onClick={handleSync} disabled={syncing} className="ml-1 px-2 py-0.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
            {syncing ? "Syncing..." : `Sync ${pending}`}
          </button>
        )}
      </div>
    </div>
  );
}
