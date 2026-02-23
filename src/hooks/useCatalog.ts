"use client";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api-client";
import * as mock from "@/data/mock";
import type {
  Player, Agent, T20Team, T20League, Sponsor, SponsoredAsset,
  Tournament, Coach, MatchPerformance, CombineData, PerformanceFeedItem,
} from "@/types";

type CatalogMap = {
  players: Player[];
  agents: Agent[];
  teams: T20Team[];
  leagues: T20League[];
  tournaments: Tournament[];
  sponsors: Sponsor[];
  available_sponsorships: SponsoredAsset[];
  coaches: Coach[];
  match_history: Record<string, MatchPerformance[]>;
  combine_data: Record<string, CombineData>;
  performance_feed: PerformanceFeedItem[];
};

const MOCK_FALLBACKS: CatalogMap = {
  players: mock.players,
  agents: mock.agents,
  teams: mock.t20Teams,
  leagues: mock.t20Leagues,
  tournaments: mock.tournaments,
  sponsors: mock.sponsors,
  available_sponsorships: mock.availableSponsorships,
  coaches: mock.coaches,
  match_history: mock.playerMatchHistory,
  combine_data: mock.playerCombineData,
  performance_feed: mock.performanceFeedItems,
};

const cache: Partial<CatalogMap> = {};

export function useCatalog<K extends keyof CatalogMap>(category: K): { data: CatalogMap[K]; loading: boolean } {
  const [data, setData] = useState<CatalogMap[K]>(cache[category] as CatalogMap[K] ?? MOCK_FALLBACKS[category]);
  const [loading, setLoading] = useState(!cache[category]);

  useEffect(() => {
    if (cache[category]) { setData(cache[category] as CatalogMap[K]); setLoading(false); return; }
    let cancelled = false;
    const slug = category.replace(/_/g, "-");
    apiRequest<CatalogMap[K]>(`/catalog/${slug}`).then((res) => {
      if (cancelled) return;
      if (res.ok && res.data) {
        cache[category] = res.data as CatalogMap[K];
        setData(res.data);
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [category]);

  return { data, loading };
}

export function useCatalogMulti<K extends keyof CatalogMap>(...categories: K[]): { data: Pick<CatalogMap, K>; loading: boolean } {
  const [results, setResults] = useState<Pick<CatalogMap, K>>(() => {
    const init = {} as Pick<CatalogMap, K>;
    for (const k of categories) init[k] = (cache[k] ?? MOCK_FALLBACKS[k]) as CatalogMap[K];
    return init;
  });
  const [loading, setLoading] = useState(categories.some((k) => !cache[k]));

  useEffect(() => {
    let cancelled = false;
    const toFetch = categories.filter((k) => !cache[k]);
    if (toFetch.length === 0) { setLoading(false); return; }
    Promise.all(
      toFetch.map((k) => {
        const slug = (k as string).replace(/_/g, "-");
        return apiRequest<CatalogMap[K]>(`/catalog/${slug}`).then((res) => {
          if (res.ok && res.data) cache[k] = res.data as CatalogMap[K];
        });
      })
    ).then(() => {
      if (cancelled) return;
      const out = {} as Pick<CatalogMap, K>;
      for (const k of categories) out[k] = (cache[k] ?? MOCK_FALLBACKS[k]) as CatalogMap[K];
      setResults(out);
      setLoading(false);
    });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories.join(",")]);

  return { data: results, loading };
}
