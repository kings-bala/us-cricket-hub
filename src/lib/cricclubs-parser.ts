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

function isNumeric(s: string): boolean {
  return /^[0-9]+(\.[0-9]+)?[*]?$/.test(s.trim());
}

function splitColumns(line: string): string[] {
  const byTab = line.split(/\t/);
  if (byTab.length >= 4) return byTab.map((s) => s.trim()).filter(Boolean);
  const byMultiSpace = line.split(/\s{2,}/);
  if (byMultiSpace.length >= 4) return byMultiSpace.map((s) => s.trim()).filter(Boolean);
  return line.split(/\s+/).map((s) => s.trim()).filter(Boolean);
}

function mapHeaderToValues(
  headerCols: string[],
  valueCols: string[],
  keys: string[]
): string {
  const lowerHeaders = headerCols.map((h) => h.toLowerCase().trim());
  for (const k of keys) {
    const idx = lowerHeaders.indexOf(k);
    if (idx >= 0 && idx < valueCols.length) {
      const val = clean(valueCols[idx]);
      if (val && val !== "-") return val;
    }
  }
  return "";
}

function findSectionData(
  lines: string[],
  sectionLabel: RegExp,
  headerTest: (lower: string) => boolean
): { header: string[]; values: string[] } | null {
  for (let i = 0; i < lines.length; i++) {
    const lower = lines[i].toLowerCase();
    if (!headerTest(lower)) continue;

    const headerCols = splitColumns(lines[i]);
    if (headerCols.length < 3) continue;

    for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
      const valueCols = splitColumns(lines[j]);
      if (valueCols.length >= 3 && isNumeric(valueCols[0])) {
        return { header: headerCols, values: valueCols };
      }
    }
  }

  for (let i = 0; i < lines.length; i++) {
    if (sectionLabel.test(lines[i].toLowerCase())) {
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const lower = lines[j].toLowerCase();
        if (headerTest(lower)) {
          const headerCols = splitColumns(lines[j]);
          if (headerCols.length < 3) continue;
          for (let k = j + 1; k < Math.min(j + 5, lines.length); k++) {
            const valueCols = splitColumns(lines[k]);
            if (valueCols.length >= 3 && isNumeric(valueCols[0])) {
              return { header: headerCols, values: valueCols };
            }
          }
        }
      }
    }
  }

  return null;
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

  const isBattingHeader = (lower: string): boolean => {
    const hasMatOrInn = lower.includes("mat") || lower.includes("inn");
    const hasRuns = lower.includes("run");
    const hasAvgOrSR = lower.includes("avg") || lower.includes("sr") || lower.includes("strike");
    return hasMatOrInn && hasRuns && hasAvgOrSR;
  };

  const isBowlingHeader = (lower: string): boolean => {
    const hasMat = lower.includes("mat") || lower.includes("inn");
    const hasWkt = lower.includes("wkt") || lower.includes("wicket");
    const hasEconOrOv = lower.includes("econ") || lower.includes("over") || lower.includes("ov ");
    return hasMat && hasWkt && hasEconOrOv;
  };

  const batting = findSectionData(lines, /^batting/i, isBattingHeader);
  if (batting) {
    const { header, values } = batting;
    stats.totalMatches = mapHeaderToValues(header, values, ["mat", "matches", "m"]);
    stats.innings = mapHeaderToValues(header, values, ["inn", "innings", "inns", "i"]);
    stats.totalRuns = mapHeaderToValues(header, values, ["runs", "run", "r"]);
    stats.highScore = mapHeaderToValues(header, values, ["hs", "high score", "highest"]);
    stats.battingAverage = mapHeaderToValues(header, values, ["avg", "average", "bat avg"]);
    stats.strikeRate = mapHeaderToValues(header, values, ["sr", "strike rate", "s/r"]);
    stats.hundreds = mapHeaderToValues(header, values, ["100", "100s", "centuries"]);
    stats.fifties = mapHeaderToValues(header, values, ["50", "50s", "fifties"]);

    const noVal = mapHeaderToValues(header, values, ["no", "not out"]);
    if (
      !stats.battingAverage &&
      stats.totalRuns &&
      stats.innings
    ) {
      const runs = parseFloat(stats.totalRuns);
      const inn = parseFloat(stats.innings);
      const no = noVal ? parseFloat(noVal) : 0;
      const denom = inn - no;
      if (denom > 0) {
        stats.battingAverage = (runs / denom).toFixed(2);
      }
    }
  }

  const bowling = findSectionData(lines, /^bowling/i, isBowlingHeader);
  if (bowling) {
    const { header, values } = bowling;
    stats.totalWickets = mapHeaderToValues(header, values, ["wkts", "wickets", "wkt", "w"]);
    stats.bowlingAverage = mapHeaderToValues(header, values, ["avg", "average", "bowl avg"]);
    stats.economy = mapHeaderToValues(header, values, ["econ", "economy", "er"]);
    stats.overs = mapHeaderToValues(header, values, ["ov", "overs", "o"]);
    stats.bestBowling = mapHeaderToValues(header, values, ["bbi", "best", "bb"]);
    if (!stats.totalMatches) {
      stats.totalMatches = mapHeaderToValues(header, values, ["mat", "matches", "m"]);
    }

    if (!stats.bowlingAverage && stats.totalWickets) {
      const runsConc = mapHeaderToValues(header, values, ["runs", "run"]);
      const wkts = parseFloat(stats.totalWickets);
      const rc = runsConc ? parseFloat(runsConc) : 0;
      if (wkts > 0 && rc > 0) {
        stats.bowlingAverage = (rc / wkts).toFixed(2);
      }
    }
    if (!stats.economy && stats.overs) {
      const runsConc = mapHeaderToValues(header, values, ["runs", "run"]);
      const ov = parseFloat(stats.overs);
      const rc = runsConc ? parseFloat(runsConc) : 0;
      if (ov > 0 && rc > 0) {
        stats.economy = (rc / ov).toFixed(2);
      }
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const kvMatch = line.match(
      /^(matches|mat|runs|wickets|wkts|batting average|bowling average|bat avg|bowl avg|strike rate|economy|econ|sr)\s*[:\-=]\s*([0-9]+\.?[0-9]*)/i
    );
    if (kvMatch) {
      const key = kvMatch[1].toLowerCase();
      const val = kvMatch[2];
      if ((key === "matches" || key === "mat") && !stats.totalMatches) stats.totalMatches = val;
      if (key === "runs" && !stats.totalRuns) stats.totalRuns = val;
      if ((key === "wickets" || key === "wkts") && !stats.totalWickets) stats.totalWickets = val;
      if ((key === "batting average" || key === "bat avg") && !stats.battingAverage) stats.battingAverage = val;
      if ((key === "bowling average" || key === "bowl avg") && !stats.bowlingAverage) stats.bowlingAverage = val;
      if ((key === "strike rate" || key === "sr") && !stats.strikeRate) stats.strikeRate = val;
      if ((key === "economy" || key === "econ") && !stats.economy) stats.economy = val;
    }
  }

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
