export type PlayerRole = "Batsman" | "Bowler" | "All-Rounder" | "Wicket-Keeper";
export type BowlingStyle = "Right-arm Fast" | "Right-arm Medium" | "Left-arm Fast" | "Left-arm Medium" | "Right-arm Off-spin" | "Left-arm Orthodox" | "Left-arm Chinaman" | "Right-arm Leg-spin";
export type BattingStyle = "Right-hand Bat" | "Left-hand Bat";
export type AgeGroup = "U15" | "U17" | "U19" | "U21";
export type Zone = "Atlantic" | "Pacific" | "Central" | "Southern" | "Mountain";
export type ProfileTier = "Free" | "Premium" | "Elite";
export type UserRole = "player" | "agent" | "owner" | "sponsor";

export interface Player {
  id: string;
  name: string;
  age: number;
  ageGroup: AgeGroup;
  zone: Zone;
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
  zone: Zone;
  verified: boolean;
}

export interface MiLCTeam {
  id: string;
  name: string;
  city: string;
  zone: Zone;
  logo: string;
  owner: string;
  rosterSize: number;
  homegrownQuota: number;
  homegrownFilled: number;
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  tier: "Gold" | "Silver" | "Bronze";
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
  zone: Zone;
  startDate: string;
  endDate: string;
  venue: string;
  teams: number;
  status: "upcoming" | "live" | "completed";
  sponsorId?: string;
}
