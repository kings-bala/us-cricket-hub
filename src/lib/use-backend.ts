"use client";

import { useState, useEffect, useCallback } from "react";
import { apiRequest, queueSync, isBackendConfigured } from "./api-client";
import { getItem, setItem } from "./storage";

type UseBackendDataOptions<T> = {
  apiPath: string;
  localKey: string;
  fallback: T;
  token?: string;
};

type UseBackendDataResult<T> = {
  data: T;
  setData: (val: T) => void;
  loading: boolean;
  offline: boolean;
  save: (val: T, method?: string) => Promise<void>;
};

export function useBackendData<T>(opts: UseBackendDataOptions<T>): UseBackendDataResult<T> {
  const { apiPath, localKey, fallback, token } = opts;
  const [data, setDataState] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const local = getItem<T>(localKey, fallback);
      if (!cancelled) setDataState(local);

      if (isBackendConfigured()) {
        const res = await apiRequest<T>(apiPath, { token });
        if (!cancelled) {
          if (res.ok && res.data) {
            setDataState(res.data);
            setItem(localKey, res.data);
            setOffline(false);
          } else {
            setOffline(res.offline);
          }
        }
      }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [apiPath, localKey, fallback, token]);

  const setData = useCallback((val: T) => {
    setDataState(val);
    setItem(localKey, val);
  }, [localKey]);

  const save = useCallback(async (val: T, method = "POST") => {
    setDataState(val);
    setItem(localKey, val);
    if (isBackendConfigured()) {
      const res = await apiRequest(apiPath, { method, body: val, token });
      if (res.offline) {
        queueSync(apiPath, method, val);
        setOffline(true);
      } else {
        setOffline(false);
      }
    }
  }, [apiPath, localKey, token]);

  return { data, setData, loading, offline, save };
}
