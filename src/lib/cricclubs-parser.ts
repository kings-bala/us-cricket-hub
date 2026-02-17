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

function nextNumber(lines: string[], startIdx: number, maxLook: number = 3): string {
  for (let j = startIdx; j < Math.min(startIdx + maxLook, lines.length); j++) {
    if (/^\d+(\.\d+)?$/.test(lines[j].trim())) return lines[j].trim();
  }
  return "";
}

function extractSection(lines: string[], startMarker: RegExp, endMarker: RegExp): string[] {
  let startIdx = -1;
  let endIdx = lines.length;
  for (let i = 0; i < lines.length; i++) {
    if (startIdx === -1 && startMarker.test(lines[i])) {
      startIdx = i;
    } else if (startIdx >= 0 && endMarker.test(lines[i])) {
      endIdx = i;
      break;
    }
  }
  if (startIdx === -1) return [];
  return lines.slice(startIdx, endIdx);
}

interface FormatRow {
  format: string;
  values: Record<string, string>;
}

function parseTableSection(
  sectionLines: string[],
  headerTest: (line: string) => boolean
): { headers: string[]; rows: FormatRow[] } {
  let headerIdx = -1;
  for (let i = 0; i < sectionLines.length; i++) {
    if (headerTest(sectionLines[i].toLowerCase())) {
      headerIdx = i;
      break;
    }
  }
  if (headerIdx === -1) return { headers: [], rows: [] };

  let headerLine = sectionLines[headerIdx];
  if (headerIdx + 1 < sectionLines.length) {
    const nextLine = sectionLines[headerIdx + 1];
    const nextTrimmed = nextLine.trim();
    if (nextTrimmed && !/^\d/.test(nextTrimmed) && !/^(one day|twenty20|t20|test|odi|t10|other|list a)/i.test(nextTrimmed)) {
      headerLine += "\t" + nextTrimmed;
    }
  }

  const headers = headerLine.split(/\t/).map((h) => h.trim()).filter(Boolean);

  const formatNames = /^(one day|twenty20|t20|test|odi|t10|other|list a|first class|limited overs)/i;
  const rows: FormatRow[] = [];
  let dataStart = headerIdx + 1;
  if (headerIdx + 1 < sectionLines.length && !formatNames.test(sectionLines[headerIdx + 1].trim()) && !/^\d/.test(sectionLines[headerIdx + 1].trim())) {
    dataStart = headerIdx + 2;
  }

  let currentFormat = "";
  let currentValues: string[] = [];

  const flushRow = () => {
    if (currentFormat && currentValues.length > 0) {
      const mapped: Record<string, string> = {};
      for (let h = 0; h < headers.length && h < currentValues.length; h++) {
        mapped[headers[h].toLowerCase()] = currentValues[h];
      }
      rows.push({ format: currentFormat, values: mapped });
    }
    currentValues = [];
  };

  for (let i = dataStart; i < sectionLines.length; i++) {
    const line = sectionLines[i].trim();
    if (!line) continue;

    if (formatNames.test(line)) {
      flushRow();
      currentFormat = line;
      continue;
    }

    const tabParts = line.split(/\t/).map((s) => s.trim()).filter(Boolean);

    if (tabParts.length >= 3) {
      currentValues.push(...tabParts);
    } else if (/^[\d./\-*]+$/.test(line)) {
      currentValues.push(line);
    }
  }
  flushRow();

  return { headers, rows };
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

  for (let i = 0; i < lines.length; i++) {
    if (/^Matches$/i.test(lines[i])) {
      const v = nextNumber(lines, i + 1);
      if (v) stats.totalMatches = v;
    }
    if (/^Runs$/i.test(lines[i]) && !(lines[i - 1]?.toLowerCase().includes("conceded"))) {
      const v = nextNumber(lines, i + 1);
      if (v) stats.totalRuns = v;
    }
    if (/^Wickets$/i.test(lines[i])) {
      const v = nextNumber(lines, i + 1);
      if (v) stats.totalWickets = v;
    }
  }

  const currentTeamMatch = text.match(/Current Team:\s*\n?\s*(.+)/i);
  if (currentTeamMatch) {
    const team = currentTeamMatch[1].trim();
    if (team && team !== "-" && team !== "Teams:") stats.teamName = team;
  }

  const titleMatch = text.match(/^(.+?)\s*[-–—]\s*.+$/m);
  if (titleMatch) {
    const name = titleMatch[1].trim();
    if (name.length > 2 && name.length < 60 && /[A-Z]/.test(name)) {
      stats.playerName = name;
    }
  }

  const battingSection = extractSection(
    lines,
    /^Batting Statistics$/i,
    /^(Bowling Statistics|Fielding Statistics)$/i
  );

  if (battingSection.length > 0) {
    const isBatHeader = (lower: string): boolean =>
      (lower.includes("mat") || lower.includes("inn")) &&
      (lower.includes("run") || lower.includes("ball")) &&
      (lower.includes("avg") || lower.includes("sr"));

    const { rows } = parseTableSection(battingSection, isBatHeader);

    if (rows.length > 0) {
      let totalInnings = 0;
      let totalNO = 0;
      let totalRuns = 0;
      let totalBalls = 0;
      let bestHS = "";
      let totalHundreds = 0;
      let totalFifties = 0;

      for (const row of rows) {
        const v = row.values;
        const inn = parseFloat(v["inns"] || v["inn"] || v["innings"] || "0");
        const no = parseFloat(v["no"] || "0");
        const runs = parseFloat(v["runs"] || v["run"] || "0");
        const balls = parseFloat(v["ball"] || v["balls"] || "0");
        const hs = v["hs"] || v["high score"] || "";
        const hundreds = parseFloat(v["100s"] || v["100"] || "0");
        const fifties = parseFloat(v["50s"] || v["50"] || "0");

        totalInnings += isNaN(inn) ? 0 : inn;
        totalNO += isNaN(no) ? 0 : no;
        totalRuns += isNaN(runs) ? 0 : runs;
        totalBalls += isNaN(balls) ? 0 : balls;
        totalHundreds += isNaN(hundreds) ? 0 : hundreds;
        totalFifties += isNaN(fifties) ? 0 : fifties;

        const hsNum = parseFloat(clean(hs));
        const bestHSNum = parseFloat(clean(bestHS));
        if (!isNaN(hsNum) && (isNaN(bestHSNum) || hsNum > bestHSNum)) {
          bestHS = hs;
        }
      }

      stats.innings = String(totalInnings);
      stats.highScore = bestHS ? clean(bestHS) : undefined;
      stats.hundreds = String(totalHundreds);
      stats.fifties = String(totalFifties);

      if (!stats.totalRuns && totalRuns > 0) {
        stats.totalRuns = String(totalRuns);
      }

      const denom = totalInnings - totalNO;
      if (denom > 0) {
        stats.battingAverage = (totalRuns / denom).toFixed(2);
      }
      if (totalBalls > 0 && totalRuns > 0) {
        stats.strikeRate = ((totalRuns / totalBalls) * 100).toFixed(2);
      }
    }
  }

  const bowlingSection = extractSection(
    lines,
    /^Bowling Statistics$/i,
    /^(Fielding Statistics|Recent Matches|Batting Analytics)$/i
  );

  if (bowlingSection.length > 0) {
    const isBowlHeader = (lower: string): boolean =>
      (lower.includes("mat") || lower.includes("inn")) &&
      (lower.includes("wkt") || lower.includes("wicket")) &&
      (lower.includes("econ") || lower.includes("over"));

    const { rows } = parseTableSection(bowlingSection, isBowlHeader);

    if (rows.length > 0) {
      let totalOvers = 0;
      let totalRunsConceded = 0;
      let totalWickets = 0;
      let bestBBF = "";

      for (const row of rows) {
        const v = row.values;
        const overs = parseFloat(v["overs"] || v["ov"] || "0");
        const runs = parseFloat(v["runs"] || v["run"] || "0");
        const wkts = parseFloat(v["wkts"] || v["wickets"] || v["wkt"] || "0");
        const bbf = v["bbf"] || v["bbi"] || v["best"] || v["bb"] || "";

        totalOvers += isNaN(overs) ? 0 : overs;
        totalRunsConceded += isNaN(runs) ? 0 : runs;
        totalWickets += isNaN(wkts) ? 0 : wkts;

        if (bbf && !bestBBF) bestBBF = bbf;
      }

      if (!stats.totalWickets && totalWickets > 0) {
        stats.totalWickets = String(totalWickets);
      }

      stats.overs = String(totalOvers);
      stats.bestBowling = bestBBF ? clean(bestBBF) : undefined;

      if (totalWickets > 0 && totalRunsConceded > 0) {
        stats.bowlingAverage = (totalRunsConceded / totalWickets).toFixed(2);
      }
      if (totalOvers > 0 && totalRunsConceded > 0) {
        stats.economy = (totalRunsConceded / totalOvers).toFixed(2);
      }
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
