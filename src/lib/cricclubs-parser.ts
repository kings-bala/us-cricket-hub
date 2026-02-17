export interface CricClubsStats {
  playerName: string;
  teamName: string;
  league: string;
  totalMatches: string;
  totalRuns: string;
  totalWickets: string;
  battingAverage: string;
  bowlingAverage: string;
  strikeRate: string;
  economy: string;
  innings: string;
  highScore: string;
  hundreds: string;
  fifties: string;
  bestBowling: string;
  overs: string;
}

function clean(val: string): string {
  return val.replace(/[^0-9./\-*]/g, "").trim();
}

function findNumber(text: string, ...labels: string[]): string {
  for (const label of labels) {
    const patterns = [
      new RegExp(label + "\\s*[:\\-]?\\s*([0-9]+\\.?[0-9]*)", "i"),
      new RegExp(label + "\\s+([0-9]+\\.?[0-9]*)", "i"),
    ];
    for (const pat of patterns) {
      const m = text.match(pat);
      if (m) return m[1];
    }
  }
  return "";
}

export function parseUrlMeta(url: string): { league: string; playerId: string; clubId: string } {
  const result = { league: "", playerId: "", clubId: "" };
  try {
    const u = new URL(url);
    const path = u.pathname;
    const leagueMatch = path.match(/^\/([^/]+)\//);
    if (leagueMatch) result.league = leagueMatch[1];
    const pidMatch = u.searchParams.get("playerId");
    if (pidMatch) result.playerId = pidMatch;
    const cidMatch = u.searchParams.get("clubId");
    if (cidMatch) result.clubId = cidMatch;
  } catch {}
  return result;
}

export function parseCricClubsText(text: string): Partial<CricClubsStats> {
  const stats: Partial<CricClubsStats> = {};
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  let battingHeaderIdx = -1;
  let bowlingHeaderIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    const lower = lines[i].toLowerCase();
    if (
      (lower.includes("mat") && lower.includes("inn") && lower.includes("run")) ||
      (lower.includes("matches") && lower.includes("innings") && lower.includes("runs"))
    ) {
      if (battingHeaderIdx === -1 && !lower.includes("wkt") && !lower.includes("overs")) {
        battingHeaderIdx = i;
      }
    }
    if (
      (lower.includes("mat") && (lower.includes("wkt") || lower.includes("wicket")) && (lower.includes("over") || lower.includes("econ"))) ||
      (lower.includes("bowling") && i < lines.length - 1)
    ) {
      bowlingHeaderIdx = i;
    }
  }

  if (battingHeaderIdx >= 0 && battingHeaderIdx + 1 < lines.length) {
    const header = lines[battingHeaderIdx].split(/\s{2,}|\t/);
    const values = lines[battingHeaderIdx + 1].split(/\s{2,}|\t/);
    if (values.length >= 4) {
      const headerMap: Record<string, number> = {};
      header.forEach((h, idx) => {
        headerMap[h.toLowerCase().trim()] = idx;
      });
      const get = (keys: string[]): string => {
        for (const k of keys) {
          const idx = headerMap[k];
          if (idx !== undefined && values[idx]) return clean(values[idx]);
        }
        return "";
      };
      stats.totalMatches = get(["mat", "matches", "m"]) || stats.totalMatches;
      stats.innings = get(["inn", "innings", "i"]) || stats.innings;
      stats.totalRuns = get(["runs", "run", "r"]) || stats.totalRuns;
      stats.highScore = get(["hs", "high score", "highest"]) || stats.highScore;
      stats.battingAverage = get(["avg", "average", "bat avg"]) || stats.battingAverage;
      stats.strikeRate = get(["sr", "strike rate", "s/r"]) || stats.strikeRate;
      stats.hundreds = get(["100", "100s", "centuries"]) || stats.hundreds;
      stats.fifties = get(["50", "50s", "fifties"]) || stats.fifties;
    }
  }

  if (bowlingHeaderIdx >= 0 && bowlingHeaderIdx + 1 < lines.length) {
    const nextLine = lines[bowlingHeaderIdx + 1];
    if (nextLine && /\d/.test(nextLine)) {
      const header = lines[bowlingHeaderIdx].split(/\s{2,}|\t/);
      const values = nextLine.split(/\s{2,}|\t/);
      const headerMap: Record<string, number> = {};
      header.forEach((h, idx) => {
        headerMap[h.toLowerCase().trim()] = idx;
      });
      const get = (keys: string[]): string => {
        for (const k of keys) {
          const idx = headerMap[k];
          if (idx !== undefined && values[idx]) return clean(values[idx]);
        }
        return "";
      };
      stats.totalWickets = get(["wkts", "wickets", "wkt", "w"]) || stats.totalWickets;
      stats.bowlingAverage = get(["avg", "average", "bowl avg"]) || stats.bowlingAverage;
      stats.economy = get(["econ", "economy", "er"]) || stats.economy;
      stats.overs = get(["ov", "overs", "o"]) || stats.overs;
      stats.bestBowling = get(["bbi", "best", "bb"]) || stats.bestBowling;
      if (!stats.totalMatches) {
        stats.totalMatches = get(["mat", "matches", "m"]);
      }
    }
  }

  if (!stats.totalMatches) stats.totalMatches = findNumber(text, "Matches", "Mat", "Total Matches");
  if (!stats.totalRuns) stats.totalRuns = findNumber(text, "Runs", "Total Runs");
  if (!stats.totalWickets) stats.totalWickets = findNumber(text, "Wickets", "Wkts", "Total Wickets");
  if (!stats.battingAverage) stats.battingAverage = findNumber(text, "Batting Average", "Bat Avg", "Average");
  if (!stats.bowlingAverage) stats.bowlingAverage = findNumber(text, "Bowling Average", "Bowl Avg");
  if (!stats.strikeRate) stats.strikeRate = findNumber(text, "Strike Rate", "SR");
  if (!stats.economy) stats.economy = findNumber(text, "Economy", "Econ", "ER");

  const namePatterns = [
    /(?:Player|Name)\s*[:\-]\s*(.+)/i,
    /^([A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s*$/m,
  ];
  for (const pat of namePatterns) {
    const m = text.match(pat);
    if (m) {
      stats.playerName = m[1].trim();
      break;
    }
  }

  const teamPatterns = [
    /(?:Team|Club)\s*[:\-]\s*(.+)/i,
    /(?:Playing for|Plays for)\s*[:\-]?\s*(.+)/i,
  ];
  for (const pat of teamPatterns) {
    const m = text.match(pat);
    if (m) {
      stats.teamName = m[1].trim();
      break;
    }
  }

  return stats;
}

export function parseHtml(html: string): Partial<CricClubsStats> {
  const stats: Partial<CricClubsStats> = {};

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    const title = titleMatch[1].trim();
    const parts = title.split(/[-|]/);
    if (parts.length > 0) stats.playerName = parts[0].trim();
    if (parts.length > 1) stats.teamName = parts[1].trim();
  }

  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let tableMatch;
  while ((tableMatch = tableRegex.exec(html)) !== null) {
    const tableHtml = tableMatch[1];
    const rows: string[][] = [];
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rowMatch;
    while ((rowMatch = rowRegex.exec(tableHtml)) !== null) {
      const cells: string[] = [];
      const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
      let cellMatch;
      while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
        cells.push(cellMatch[1].replace(/<[^>]+>/g, "").trim());
      }
      if (cells.length > 0) rows.push(cells);
    }

    if (rows.length < 2) continue;
    const header = rows[0].map((h) => h.toLowerCase());
    const isBatting = header.some((h) => h === "runs" || h === "run") && header.some((h) => h === "mat" || h === "matches");
    const isBowling = header.some((h) => h === "wkts" || h === "wickets" || h === "wkt") && header.some((h) => h === "mat" || h === "matches");

    for (let r = 1; r < rows.length; r++) {
      const vals = rows[r];
      const get = (keys: string[]): string => {
        for (const k of keys) {
          const idx = header.indexOf(k);
          if (idx >= 0 && vals[idx]) return clean(vals[idx]);
        }
        return "";
      };

      if (isBatting) {
        stats.totalMatches = get(["mat", "matches", "m"]) || stats.totalMatches;
        stats.totalRuns = get(["runs", "run"]) || stats.totalRuns;
        stats.battingAverage = get(["avg", "average"]) || stats.battingAverage;
        stats.strikeRate = get(["sr", "strike rate"]) || stats.strikeRate;
        stats.highScore = get(["hs", "high score"]) || stats.highScore;
        stats.innings = get(["inn", "innings"]) || stats.innings;
      }
      if (isBowling) {
        stats.totalWickets = get(["wkts", "wickets", "wkt"]) || stats.totalWickets;
        stats.bowlingAverage = get(["avg", "average"]) || stats.bowlingAverage;
        stats.economy = get(["econ", "economy"]) || stats.economy;
        stats.overs = get(["ov", "overs"]) || stats.overs;
        if (!stats.totalMatches) stats.totalMatches = get(["mat", "matches", "m"]);
      }
    }
  }

  return stats;
}
