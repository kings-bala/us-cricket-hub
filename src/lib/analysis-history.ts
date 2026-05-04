import type { AnalysisSummary } from "./cricket-analysis";

export interface SavedAnalysis {
  id: string;
  date: string;
  fileName: string;
  summary: AnalysisSummary;
}

const STORAGE_KEY = "crickethub_analysis_history";

export function saveAnalysis(
  fileName: string,
  summary: AnalysisSummary
): SavedAnalysis {
  const entry: SavedAnalysis = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    date: new Date().toISOString(),
    fileName,
    summary,
  };

  const history = getHistory();
  history.unshift(entry);
  if (history.length > 50) history.length = 50;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // localStorage full or unavailable
  }

  return entry;
}

export function getHistory(): SavedAnalysis[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedAnalysis[];
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
