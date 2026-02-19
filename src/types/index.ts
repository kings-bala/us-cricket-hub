export type PlayerRole = "Batsman" | "Bowler" | "All-Rounder" | "Wicket-Keeper";
export type BowlingStyle = "Right-arm Fast" | "Right-arm Medium" | "Left-arm Fast" | "Left-arm Medium" | "Right-arm Off-spin" | "Left-arm Orthodox" | "Left-arm Chinaman" | "Right-arm Leg-spin";
export type BattingStyle = "Right-hand Bat" | "Left-hand Bat";
export type AgeGroup = "U13" | "U15" | "U17" | "U19" | "U21" | "U23" | "Men";
export type ProfileTier = "Free" | "Premium" | "Elite";
export type UserRole = "player" | "agent" | "owner" | "sponsor" | "coach" | "academy_admin";
export type Region = "South Asia" | "Oceania" | "Europe" | "Caribbean" | "Africa" | "Americas" | "Middle East" | "East Asia";
export type T20LeagueId = "IPL" | "BBL" | "CPL" | "PSL" | "SA20" | "BPL" | "LPL" | "ILT20" | "MLC" | "THE100" | "SSA" | "GT20";

export interface T20League {
  id: T20LeagueId;
  name: string;
  country: string;
  region: Region;
  logo: string;
  localQuota: number;
  localFilled: number;
  teams: number;
  season: string;
}

export interface Player {
  id: string;
  name: string;
  age: number;
  ageGroup: AgeGroup;
  country: string;
  countryCode: string;
  region: Region;
  state: string;
  city: string;
  role: PlayerRole;
  battingStyle: BattingStyle;
  bowlingStyle: BowlingStyle;
  profileTier: ProfileTier;
  avatar: string;
  agentId?: string;
  verified: boolean;
  stats: PlayerStats;
  fitnessData: FitnessData;
  highlights: VideoHighlight[];
  achievements: string[];
  showcaseEvents: string[];
  targetLeagues: T20LeagueId[];
  streetCricketer?: boolean;
}

export interface PlayerStats {
  matches: number;
  innings: number;
  runs: number;
  battingAverage: number;
  strikeRate: number;
  fifties: number;
  hundreds: number;
  wickets: number;
  bowlingAverage: number;
  economy: number;
  bestBowling: string;
  catches: number;
  stumpings: number;
}

export interface FitnessData {
  sprintSpeed: number;
  yoYoTest: number;
  bowlingSpeed?: number;
  throwDistance: number;
  beepTestLevel: number;
}

export interface VideoHighlight {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  event: string;
  date: string;
}

export interface Agent {
  id: string;
  name: string;
  agency: string;
  avatar: string;
  bio: string;
  specialization: string;
  playerIds: string[];
  placements: number;
  successRate: number;
  rating: number;
  contactEmail: string;
  country: string;
  region: Region;
  verified: boolean;
  leagueConnections: T20LeagueId[];
}

export interface T20Team {
  id: string;
  name: string;
  city: string;
  country: string;
  league: T20LeagueId;
  logo: string;
  owner: string;
  rosterSize: number;
  localQuota: number;
  localFilled: number;
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  tier: "Gold" | "Silver" | "Bronze";
  country: string;
  sponsoredAssets: SponsoredAsset[];
}

export interface SponsoredAsset {
  id: string;
  type: "leaderboard" | "tournament" | "player" | "showcase";
  name: string;
  description: string;
  price: number;
  available: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  ageGroup: AgeGroup;
  country: string;
  region: Region;
  startDate: string;
  endDate: string;
  venue: string;
  teams: number;
  status: "upcoming" | "live" | "completed";
  sponsorId?: string;
}

export interface Coach {
  id: string;
  name: string;
  country: string;
  region: Region;
  specialization: string;
  experience: number;
  certifications: string[];
  bio: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  currency: string;
  availability: "available" | "limited" | "waitlist";
  languages: string[];
  remote: boolean;
  inPerson: boolean;
  playersDeveloped: number;
  leagueExperience: T20LeagueId[];
  verified: boolean;
}

export interface VideoAnalysis {
  id: string;
  playerId: string;
  videoUrl: string;
  uploadDate: string;
  analysisType: "batting" | "bowling" | "fielding" | "general";
  status: "pending" | "analyzing" | "completed";
  aiScore: number;
  feedback: AIFeedback[];
}

export interface AIFeedback {
  category: string;
  score: number;
  comment: string;
  suggestion: string;
}

export type FormStatus = "Red Hot" | "In Form" | "Steady" | "Cold";

export interface MatchPerformance {
  matchId: string;
  date: string;
  opponent: string;
  venue: string;
  league: string;
  runsScored: number;
  ballsFaced: number;
  wicketsTaken: number;
  oversBowled: number;
  runsConceded: number;
  catches: number;
  runOuts: number;
  stumpings: number;
  manOfMatch: boolean;
}

export interface CPIScore {
  overall: number;
  matchPerformance: number;
  athleticMetrics: number;
  formIndex: number;
  consistency: number;
  nationalRank: number;
  stateRank: number;
  rankChange: number;
}

export interface CombineData {
  yoYoScore: number;
  sprint20m: number;
  bowlingSpeed?: number;
  batSpeed?: number;
  verticalJump: number;
  fieldingEfficiency: number;
  throwAccuracy: number;
  reactionTime: number;
  assessmentDate: string;
  nextAssessmentDate: string;
  verifiedAthlete: boolean;
  history: CombineHistory[];
}

export interface CombineHistory {
  date: string;
  yoYoScore: number;
  sprint20m: number;
  verticalJump: number;
  fieldingEfficiency: number;
}

export interface PerformanceFeedItem {
  id: string;
  playerId: string;
  playerName: string;
  type: "top-score" | "best-bowling" | "fastest-innings" | "form-spike" | "hot-prospect" | "rank-movement";
  title: string;
  description: string;
  value: string;
  date: string;
  state: string;
  league: string;
}

export type AcademySeatPlan = "free" | "starter" | "pro" | "enterprise";

export interface Academy {
  id: string;
  name: string;
  location: string;
  logo: string;
  headCoach: string;
  contactEmail: string;
  adminEmail: string;
  joinCode: string;
  seatPlan: AcademySeatPlan;
  maxSeats: number;
  playerEmails: string[];
  coachEmails: string[];
  createdAt: string;
}

export interface AcademyAttendance {
  date: string;
  playerEmail: string;
  present: boolean;
}

export type StaffRole = "Head Coach" | "Assistant Coach" | "Bowling Coach" | "Batting Coach" | "Fielding Coach" | "Fitness Trainer" | "Physio" | "Manager" | "Analyst" | "Other";

export interface AcademyStaff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  specialization: string;
  joinedAt: string;
  academyId: string;
}
