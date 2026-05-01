import { Player, Agent, T20Team, T20League, Sponsor, SponsoredAsset, Tournament, Coach, MatchPerformance, CPIScore, CombineData, FormStatus, PerformanceFeedItem } from "@/types";

export const t20Leagues: T20League[] = [
  { id: "IPL", name: "Indian Premier League", country: "India", region: "South Asia", logo: "/logos/ipl.png", localQuota: 7, localFilled: 5, teams: 10, season: "Mar-May" },
  { id: "BBL", name: "Big Bash League", country: "Australia", region: "Oceania", logo: "/logos/bbl.png", localQuota: 6, localFilled: 4, teams: 8, season: "Dec-Feb" },
  { id: "PSL", name: "Pakistan Super League", country: "Pakistan", region: "South Asia", logo: "/logos/psl.png", localQuota: 7, localFilled: 5, teams: 6, season: "Feb-Mar" },
  { id: "CPL", name: "Caribbean Premier League", country: "West Indies", region: "Caribbean", logo: "/logos/cpl.png", localQuota: 6, localFilled: 3, teams: 6, season: "Aug-Oct" },
  { id: "SA20", name: "SA20", country: "South Africa", region: "Africa", logo: "/logos/sa20.png", localQuota: 7, localFilled: 4, teams: 6, season: "Jan-Feb" },
  { id: "THE100", name: "The Hundred", country: "England", region: "Europe", logo: "/logos/the100.png", localQuota: 5, localFilled: 3, teams: 8, season: "Jul-Aug" },
  { id: "MLC", name: "Major League Cricket", country: "USA", region: "Americas", logo: "/logos/mlc.png", localQuota: 4, localFilled: 2, teams: 6, season: "Jul-Aug" },
  { id: "BPL", name: "Bangladesh Premier League", country: "Bangladesh", region: "South Asia", logo: "/logos/bpl.png", localQuota: 7, localFilled: 5, teams: 7, season: "Jan-Feb" },
  { id: "LPL", name: "Lanka Premier League", country: "Sri Lanka", region: "South Asia", logo: "/logos/lpl.png", localQuota: 7, localFilled: 4, teams: 5, season: "Jul-Aug" },
  { id: "ILT20", name: "International League T20", country: "UAE", region: "Middle East", logo: "/logos/ilt20.png", localQuota: 2, localFilled: 1, teams: 6, season: "Jan-Feb" },
  { id: "SSA", name: "Super Smash", country: "New Zealand", region: "Oceania", logo: "/logos/ssa.png", localQuota: 6, localFilled: 5, teams: 6, season: "Nov-Feb" },
  { id: "GT20", name: "Global T20 Canada", country: "Canada", region: "Americas", logo: "/logos/gt20.png", localQuota: 4, localFilled: 2, teams: 6, season: "Jul-Aug" },
];

// Players array emptied — all entries were fabricated seed data.
// Real player profiles will be populated from the database when users create accounts.
// See docs/SEED_DATA_AUDIT.md for details.
export const players: Player[] = [];

export const agents: Agent[] = [
  {
    id: "a1", name: "Agent — South Asia", agency: "CricVerse360 Partner Network", avatar: "",
    bio: "Player development and league placement services for South Asian youth cricketers. Contact CricVerse360 for introductions.",
    specialization: "T20 League Placement & Contract Negotiation",
    playerIds: [], placements: 0, successRate: 0, rating: 0,
    contactEmail: "info@cricverse360.com", country: "India", region: "South Asia", verified: false,
    leagueConnections: [],
  },
  {
    id: "a2", name: "Agent — Oceania", agency: "CricVerse360 Partner Network", avatar: "",
    bio: "Youth development and academy placement services for Australian and NZ cricketers. Contact CricVerse360 for introductions.",
    specialization: "Youth Development & Academy Placement",
    playerIds: [], placements: 0, successRate: 0, rating: 0,
    contactEmail: "info@cricverse360.com", country: "Australia", region: "Oceania", verified: false,
    leagueConnections: [],
  },
  {
    id: "a3", name: "Agent — Middle East & Africa", agency: "CricVerse360 Partner Network", avatar: "",
    bio: "Sponsorship and brand deal services for cricketers in emerging markets. Contact CricVerse360 for introductions.",
    specialization: "Sponsorship & Brand Deals",
    playerIds: [], placements: 0, successRate: 0, rating: 0,
    contactEmail: "info@cricverse360.com", country: "Pakistan", region: "South Asia", verified: false,
    leagueConnections: [],
  },
  {
    id: "a4", name: "Agent — Americas & Caribbean", agency: "CricVerse360 Partner Network", avatar: "",
    bio: "Connecting Caribbean and Americas talent with cricket opportunities. Contact CricVerse360 for introductions.",
    specialization: "Caribbean & Americas Talent Pipeline",
    playerIds: [], placements: 0, successRate: 0, rating: 0,
    contactEmail: "info@cricverse360.com", country: "West Indies", region: "Caribbean", verified: false,
    leagueConnections: [],
  },
];

// T20 teams emptied — contained real team names without consent.
export const t20Teams: T20Team[] = [];

export const sponsors: Sponsor[] = [];

// Sponsorships emptied — contained fabricated pricing and event names.
export const availableSponsorships: SponsoredAsset[] = [];

// Tournaments emptied — contained fabricated events at real venues.
export const tournaments: Tournament[] = [];

export const coaches: Coach[] = [
  {
    id: "c1", name: "Spin Masters Academy", country: "India", region: "South Asia",
    specialization: "Spin Bowling", experience: 15, certifications: ["BCCI Level 3"],
    bio: "Dedicated spin bowling coaching for aspiring young cricketers. Focus on grip variations, flight, and match-day bowling strategy.",
    rating: 0, reviewCount: 0, hourlyRate: 80, currency: "USD",
    availability: "available", languages: ["English", "Hindi"],
    remote: true, inPerson: true, playersDeveloped: 0, leagueExperience: [], verified: false,
  },
  {
    id: "c2", name: "Pace Academy Australia", country: "Australia", region: "Oceania",
    specialization: "Fast Bowling", experience: 12, certifications: ["Cricket Australia Level 2"],
    bio: "Fast bowling coaching focused on technique, injury prevention, and building sustainable pace for youth cricketers.",
    rating: 0, reviewCount: 0, hourlyRate: 100, currency: "USD",
    availability: "available", languages: ["English"],
    remote: true, inPerson: true, playersDeveloped: 0, leagueExperience: [], verified: false,
  },
  {
    id: "c3", name: "Batting Foundations", country: "Sri Lanka", region: "South Asia",
    specialization: "Batting Technique", experience: 10, certifications: ["SLC Level 2"],
    bio: "Classical batting technique coaching. Helping young batsmen build solid foundations in stance, footwork, and shot selection.",
    rating: 0, reviewCount: 0, hourlyRate: 60, currency: "USD",
    availability: "available", languages: ["English", "Sinhala"],
    remote: true, inPerson: false, playersDeveloped: 0, leagueExperience: [], verified: false,
  },
  {
    id: "c4", name: "Swing & Seam Coaching", country: "Pakistan", region: "South Asia",
    specialization: "Pace & Swing Bowling", experience: 14, certifications: ["PCB Level 2"],
    bio: "Specialized coaching for swing and seam bowling. Developing young pace bowlers with focus on wrist position and seam presentation.",
    rating: 0, reviewCount: 0, hourlyRate: 50, currency: "USD",
    availability: "available", languages: ["English", "Urdu"],
    remote: true, inPerson: true, playersDeveloped: 0, leagueExperience: [], verified: false,
  },
  {
    id: "c5", name: "AllRound Cricket Lab", country: "South Africa", region: "Africa",
    specialization: "360-degree Batting & Fitness", experience: 8, certifications: ["CSA Level 2"],
    bio: "Modern batting and fitness coaching for well-rounded cricketers. Combining shot innovation with athletic conditioning.",
    rating: 0, reviewCount: 0, hourlyRate: 70, currency: "USD",
    availability: "available", languages: ["English"],
    remote: true, inPerson: true, playersDeveloped: 0, leagueExperience: [], verified: false,
  },
  {
    id: "c6", name: "Cricket Analytics NZ", country: "New Zealand", region: "Oceania",
    specialization: "Cricket Strategy & Analytics", experience: 10, certifications: ["NZC Level 2"],
    bio: "Data-driven cricket coaching using video analysis and match analytics to improve decision-making and strategy.",
    rating: 0, reviewCount: 0, hourlyRate: 75, currency: "USD",
    availability: "available", languages: ["English"],
    remote: true, inPerson: false, playersDeveloped: 0, leagueExperience: [], verified: false,
  },
  {
    id: "c7", name: "Caribbean Youth Cricket", country: "West Indies", region: "Caribbean",
    specialization: "Caribbean Flair Batting", experience: 12, certifications: ["CWI Level 2"],
    bio: "Youth cricket development with Caribbean flair. Building confident, attacking batsmen with strong fundamentals.",
    rating: 0, reviewCount: 0, hourlyRate: 65, currency: "USD",
    availability: "available", languages: ["English"],
    remote: true, inPerson: true, playersDeveloped: 0, leagueExperience: [], verified: false,
  },
  {
    id: "c8", name: "Keeper & Captain Academy", country: "Sri Lanka", region: "South Asia",
    specialization: "Wicket-Keeping & Leadership", experience: 11, certifications: ["SLC Level 2"],
    bio: "Specialized wicket-keeping coaching combined with leadership and captaincy development for young players.",
    rating: 0, reviewCount: 0, hourlyRate: 55, currency: "USD",
    availability: "available", languages: ["English", "Sinhala"],
    remote: true, inPerson: false, playersDeveloped: 0, leagueExperience: [], verified: false,
  },
];

export const regionColors: Record<string, string> = {
  "South Asia": "bg-orange-100 text-orange-800",
  "Oceania": "bg-blue-100 text-blue-800",
  "Europe": "bg-purple-100 text-purple-800",
  "Caribbean": "bg-green-100 text-green-800",
  "Africa": "bg-yellow-100 text-yellow-800",
  "Americas": "bg-red-100 text-red-800",
  "Middle East": "bg-teal-100 text-teal-800",
  "East Asia": "bg-pink-100 text-pink-800",
};

export const roleIcons: Record<string, string> = {
  Batsman: "B",
  Bowler: "W",
  "All-Rounder": "AR",
  "Wicket-Keeper": "WK",
};

export const countryFlags: Record<string, string> = {
  India: "IN",
  Australia: "AU",
  Pakistan: "PK",
  "West Indies": "WI",
  "South Africa": "ZA",
  England: "EN",
  "Sri Lanka": "LK",
  Bangladesh: "BD",
  USA: "US",
  "New Zealand": "NZ",
  UAE: "AE",
  Canada: "CA",
};

// Player match history emptied — fabricated match data.
export const playerMatchHistory: Record<string, MatchPerformance[]> = {};

export function calculateCPI(player: Player, matches: MatchPerformance[]): CPIScore {
  const last5 = matches.slice(0, 5);

  let matchPerfScore = 0;
  if (player.role === "Bowler") {
    const totalWickets = last5.reduce((s, m) => s + m.wicketsTaken, 0);
    const avgEconomy = last5.reduce((s, m) => m.oversBowled > 0 ? s + (m.runsConceded / m.oversBowled) : s, 0) / Math.max(last5.filter(m => m.oversBowled > 0).length, 1);
    matchPerfScore = Math.min(100, (totalWickets * 8) + Math.max(0, (6 - avgEconomy) * 10));
  } else if (player.role === "Batsman" || player.role === "Wicket-Keeper") {
    const totalRuns = last5.reduce((s, m) => s + m.runsScored, 0);
    const avgSR = last5.reduce((s, m) => m.ballsFaced > 0 ? s + (m.runsScored / m.ballsFaced * 100) : s, 0) / Math.max(last5.filter(m => m.ballsFaced > 0).length, 1);
    matchPerfScore = Math.min(100, (totalRuns / 3) + (avgSR > 100 ? (avgSR - 100) * 0.3 : 0));
  } else {
    const totalRuns = last5.reduce((s, m) => s + m.runsScored, 0);
    const totalWickets = last5.reduce((s, m) => s + m.wicketsTaken, 0);
    matchPerfScore = Math.min(100, (totalRuns / 4) + (totalWickets * 6));
  }

  const athleticScore = Math.min(100,
    (player.fitnessData.yoYoTest / 20 * 30) +
    (Math.max(0, 10 - player.fitnessData.sprintSpeed) * 8) +
    (player.fitnessData.beepTestLevel / 14 * 20) +
    ((player.fitnessData.bowlingSpeed || 0) / 150 * 20)
  );

  const recentScores = last5.map(m => {
    if (player.role === "Bowler") return m.wicketsTaken * 15 + (m.oversBowled > 0 ? Math.max(0, 6 - m.runsConceded / m.oversBowled) * 5 : 0);
    return m.runsScored + (m.wicketsTaken * 10);
  });
  const avgRecent = recentScores.reduce((s, v) => s + v, 0) / Math.max(recentScores.length, 1);
  const formScore = Math.min(100, avgRecent * 1.2);

  const variance = recentScores.length > 1 ? Math.sqrt(recentScores.reduce((s, v) => s + Math.pow(v - avgRecent, 2), 0) / recentScores.length) : 0;
  const consistencyScore = Math.min(100, Math.max(0, 100 - variance * 1.5));

  const overall = Math.round(
    matchPerfScore * 0.4 +
    athleticScore * 0.3 +
    formScore * 0.2 +
    consistencyScore * 0.1
  );

  return {
    overall,
    matchPerformance: Math.round(matchPerfScore),
    athleticMetrics: Math.round(athleticScore),
    formIndex: Math.round(formScore),
    consistency: Math.round(consistencyScore),
    nationalRank: 0,
    stateRank: 0,
    rankChange: 0,
  };
}

export function getFormStatus(matches: MatchPerformance[], role: string): FormStatus {
  if (matches.length === 0) return "Cold";
  const last5 = matches.slice(0, 5);
  const weights = [0.35, 0.25, 0.2, 0.12, 0.08];

  const weightedScore = last5.reduce((sum, match, i) => {
    let perf = 0;
    if (role === "Bowler") {
      perf = match.wicketsTaken * 20 + (match.oversBowled > 0 ? Math.max(0, 6 - match.runsConceded / match.oversBowled) * 8 : 0);
    } else if (role === "Batsman" || role === "Wicket-Keeper") {
      perf = match.runsScored * 1.2 + (match.ballsFaced > 0 && match.runsScored / match.ballsFaced > 1 ? 15 : 0);
    } else {
      perf = match.runsScored + match.wicketsTaken * 15;
    }
    if (match.manOfMatch) perf += 20;
    return sum + perf * (weights[i] || 0.08);
  }, 0);

  if (weightedScore >= 60) return "Red Hot";
  if (weightedScore >= 35) return "In Form";
  if (weightedScore >= 15) return "Steady";
  return "Cold";
}

// Player combine data emptied — fabricated fitness data.
export const playerCombineData: Record<string, CombineData> = {};

export function generateCPIRankings(): (Player & { cpiScore: CPIScore; formStatus: FormStatus })[] {
  const ranked = players.map((player) => {
    const matches = playerMatchHistory[player.id] || [];
    const cpiScore = calculateCPI(player, matches);
    const formStatus = getFormStatus(matches, player.role);
    return { ...player, cpiScore, formStatus };
  });

  ranked.sort((a, b) => b.cpiScore.overall - a.cpiScore.overall);

  ranked.forEach((p, i) => {
    p.cpiScore.nationalRank = i + 1;
    p.cpiScore.rankChange = Math.floor(Math.random() * 7) - 3;
  });

  const stateGroups: Record<string, typeof ranked> = {};
  ranked.forEach((p) => {
    if (!stateGroups[p.state]) stateGroups[p.state] = [];
    stateGroups[p.state].push(p);
  });
  Object.values(stateGroups).forEach((group) => {
    group.forEach((p, i) => { p.cpiScore.stateRank = i + 1; });
  });

  return ranked;
}

// Performance feed items emptied — fabricated match performance data.
export const performanceFeedItems: PerformanceFeedItem[] = [];
