"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { players } from "@/data/mock";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api-client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type PostType = "performance" | "highlight" | "scorecard" | "spotlight" | "general";
type USRegion = "All USA" | "New Jersey" | "California" | "Texas" | "New York" | "Illinois" | "Florida" | "Georgia" | "Virginia" | "Massachusetts" | "Washington";

interface FeedPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: "player" | "team" | "academy" | "coach" | "fan";
  authorVerified: boolean;
  type: PostType;
  content: string;
  regions: USRegion[];
  images: string[];
  statCard?: {
    runs?: number;
    balls?: number;
    wickets?: number;
    overs?: string;
    economy?: number;
    catches?: number;
    fours?: number;
    sixes?: number;
    strikeRate?: number;
    opponent?: string;
    event?: string;
    date?: string;
    result?: string;
  };
  likes: number;
  comments: FeedComment[];
  shares: number;
  timestamp: string;
  badges: string[];
  isRising?: boolean;
  isTopPerformer?: boolean;
  isVerifiedStat?: boolean;
}

interface FeedComment {
  id: string;
  authorName: string;
  content: string;
  timestamp: string;
}

type LeaderboardEntry = {
  rank: number;
  user_id: string;
  full_name: string;
  email: string;
  academy: string;
  total_ce: number;
  weekly_ce: number;
  level: number;
  level_name: string;
  streak_count: number;
};

type EnergyData = {
  total_ce: number;
  weekly_ce: number;
  level: number;
  level_name: string;
  next_level_ce: number | null;
  next_level_name: string | null;
  streak_count: number;
};

type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  earned_at?: string;
};

const US_REGIONS: USRegion[] = ["All USA", "New Jersey", "California", "Texas", "New York", "Illinois", "Florida", "Georgia", "Virginia", "Massachusetts", "Washington"];

const postTypeLabels: Record<PostType, { label: string; color: string }> = {
  performance: { label: "Performance", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  highlight: { label: "Highlight", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  scorecard: { label: "Scorecard", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  spotlight: { label: "Spotlight", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  general: { label: "Update", color: "bg-slate-500/20 text-slate-400 border-slate-500/30" },
};

const LEVEL_COLORS: Record<number, string> = {
  1: "from-slate-500 to-slate-600",
  2: "from-blue-500 to-blue-600",
  3: "from-emerald-500 to-emerald-600",
  4: "from-purple-500 to-purple-600",
  5: "from-amber-500 to-amber-600",
  6: "from-red-500 to-red-600",
  7: "from-yellow-400 to-yellow-500",
};

const BADGE_ICONS: Record<string, string> = {
  footprints: "\u{1F463}",
  flame: "\u{1F525}",
  shield: "\u{1F6E1}\uFE0F",
  trophy: "\u{1F3C6}",
  video: "\u{1F4F9}",
  book: "\u{1F4DA}",
  target: "\u{1F3AF}",
  star: "\u2B50",
  users: "\u{1F465}",
  "trending-up": "\u{1F4C8}",
  crown: "\u{1F451}",
};

const mockPosts: FeedPost[] = [
  {
    id: "fp1", authorName: "Rahul Desai", authorAvatar: "/avatars/player8.jpg", authorRole: "player", authorVerified: true,
    type: "performance",
    content: "Unbeaten 142 off 98 balls against Michigan XI in the MLC Development League! Feeling great about my form heading into the national squad trials. Thanks to my coaches at Chicago Cricket Academy for the preparation.",
    regions: ["All USA", "Illinois"], images: [],
    statCard: { runs: 142, balls: 98, fours: 14, sixes: 6, strikeRate: 144.9, opponent: "Michigan XI", event: "MLC Development League", date: "2025-10-05", result: "Won by 45 runs" },
    likes: 234, comments: [
      { id: "c1", authorName: "Coach Martinez", content: "Outstanding knock! Keep it up champ.", timestamp: "2h ago" },
      { id: "c2", authorName: "Arjun Patel", content: "What an innings! See you at the trials.", timestamp: "1h ago" },
    ], shares: 45, timestamp: "3h ago", badges: ["Century Maker", "Match Winner"], isTopPerformer: true, isVerifiedStat: true,
  },
  {
    id: "fp2", authorName: "Garden State Cricket Academy", authorAvatar: "", authorRole: "academy", authorVerified: true,
    type: "spotlight",
    content: "Player Spotlight: Congratulations to Vikram Singh on being named Player of the Month! 3 fifties in 4 matches with a batting average of 67.5. Vikram has been training with us for 2 years and his growth has been incredible.",
    regions: ["All USA", "New Jersey"], images: [],
    statCard: { runs: 270, balls: 220, fours: 28, sixes: 8, strikeRate: 122.7, event: "NJ Premier League", date: "2025-11-15" },
    likes: 189, comments: [{ id: "c3", authorName: "Vikram Singh", content: "Thank you GSCA! Grateful for the support.", timestamp: "5h ago" }],
    shares: 32, timestamp: "6h ago", badges: ["Player Spotlight", "Rising Star"], isRising: true, isVerifiedStat: true,
  },
  {
    id: "fp3", authorName: "Texas Cricket United", authorAvatar: "", authorRole: "team", authorVerified: true,
    type: "scorecard",
    content: "What a match! Texas Cricket United defeats Houston Hurricanes by 6 wickets in the South Central T20 Championship semi-final. On to the finals!",
    regions: ["All USA", "Texas"], images: [],
    statCard: { opponent: "Houston Hurricanes", event: "South Central T20 Championship", date: "2025-11-20", result: "Won by 6 wickets" },
    likes: 312, comments: [
      { id: "c4", authorName: "Cricket Fan TX", content: "Let's go Texas! Finals bound!", timestamp: "1h ago" },
      { id: "c5", authorName: "Raj Patel", content: "Dominant performance by the whole team!", timestamp: "45m ago" },
    ], shares: 78, timestamp: "2h ago", badges: ["Match Result"], isVerifiedStat: true,
  },
  {
    id: "fp4", authorName: "Aditya Krishnan", authorAvatar: "", authorRole: "player", authorVerified: false,
    type: "performance",
    content: "5 wickets for 22 runs in the weekend league! My best bowling figures yet. Working on my yorkers at the nets has really paid off. Looking for opportunities to trial with MLC development squads.",
    regions: ["All USA", "California"], images: [],
    statCard: { wickets: 5, overs: "4", economy: 5.5, opponent: "Bay Area XI", event: "CA Weekend League", date: "2025-11-18", result: "Won by 32 runs" },
    likes: 156, comments: [{ id: "c6", authorName: "SF Cricket Club", content: "Impressive spell! Come trial with us.", timestamp: "3h ago" }],
    shares: 28, timestamp: "8h ago", badges: ["5-Wicket Haul"], isRising: true,
  },
  {
    id: "fp5", authorName: "NYC Cricket Association", authorAvatar: "", authorRole: "academy", authorVerified: true,
    type: "highlight",
    content: "Weekend recap: 12 matches played across NYC leagues. Top performers this week - Sameer Khan (89* off 52 balls), Priya Reddy (4/18), and Omar Hassan (3 catches + 67 runs). The talent in NYC is on fire!",
    regions: ["All USA", "New York"], images: [],
    likes: 267, comments: [
      { id: "c7", authorName: "Sameer Khan", content: "Thanks for the recognition! More to come.", timestamp: "4h ago" },
      { id: "c8", authorName: "Cricket NYC Fan", content: "NYC cricket is growing so fast!", timestamp: "2h ago" },
    ], shares: 56, timestamp: "5h ago", badges: ["Weekly Recap"],
  },
  {
    id: "fp6", authorName: "Florida Cricket Hub", authorAvatar: "", authorRole: "team", authorVerified: true,
    type: "general",
    content: "Registration now open for the Florida Winter T20 Championship 2025! 32-team tournament starting January 15th. $5000 prize pool. Open to all skill levels.",
    regions: ["All USA", "Florida"], images: [],
    likes: 145, comments: [{ id: "c9", authorName: "Miami Strikers", content: "Count us in! Defending champs coming back.", timestamp: "1h ago" }],
    shares: 89, timestamp: "1d ago", badges: ["Tournament"],
  },
  {
    id: "fp7", authorName: "Coach Venkat Raman", authorAvatar: "", authorRole: "coach", authorVerified: true,
    type: "spotlight",
    content: "After watching 200+ players across 3 states this month, here are my top 5 rising talents to watch in US cricket: 1) Rahul Desai (IL), 2) Aditya K (CA), 3) Sameer Khan (NY), 4) David Williams (TX), 5) Vikram Singh (NJ). Selectors, take note!",
    regions: ["All USA"], images: [],
    likes: 478, comments: [
      { id: "c10", authorName: "USA Cricket Official", content: "Noted! Great insights coach.", timestamp: "12h ago" },
      { id: "c11", authorName: "Cricket Analyst", content: "Agreed on Rahul Desai. The kid is special.", timestamp: "8h ago" },
    ], shares: 134, timestamp: "1d ago", badges: ["Coach Picks", "Talent Watch"], isTopPerformer: true,
  },
  {
    id: "fp8", authorName: "Nikhil Sharma", authorAvatar: "", authorRole: "player", authorVerified: true,
    type: "performance",
    content: "Back-to-back fifties in the Georgia Premier League! 67(41) and 53(38) this weekend. Working hard on my power hitting and it is paying off.",
    regions: ["All USA", "Georgia"], images: [],
    statCard: { runs: 120, balls: 79, fours: 12, sixes: 5, strikeRate: 151.9, event: "Georgia Premier League", date: "2025-11-22", result: "Won both matches" },
    likes: 198, comments: [{ id: "c13", authorName: "ATL Cricket Club", content: "Proud of you Nikhil!", timestamp: "7h ago" }],
    shares: 41, timestamp: "10h ago", badges: ["Consistent Performer"], isVerifiedStat: true,
  },
  {
    id: "fp9", authorName: "DMV Cricket League", authorAvatar: "", authorRole: "team", authorVerified: true,
    type: "scorecard",
    content: "Season recap: 48 matches, 15 teams, 600+ players. Congratulations to Northern Virginia CC for winning the DMV T20 Championship!",
    regions: ["All USA", "Virginia"], images: [],
    likes: 356, comments: [{ id: "c14", authorName: "NVCC Captain", content: "What a season! Grateful to the whole squad.", timestamp: "2d ago" }],
    shares: 92, timestamp: "2d ago", badges: ["Season Recap", "Champions"],
  },
  {
    id: "fp10", authorName: "Boston Cricket Academy", authorAvatar: "", authorRole: "academy", authorVerified: true,
    type: "highlight",
    content: "Our U19 squad just completed an unbeaten season in the New England Youth League! 8 wins from 8 matches. Special mention to captain Arjun Mehta (347 runs, avg 69.4) and pace spearhead Dev Patel (19 wickets, avg 11.2).",
    regions: ["All USA", "Massachusetts"], images: [],
    statCard: { event: "New England Youth League", date: "2025-11-25", result: "Unbeaten Season - 8/8 wins" },
    likes: 289, comments: [{ id: "c15", authorName: "Arjun Mehta", content: "Team effort all the way! Proud to lead this group.", timestamp: "1d ago" }],
    shares: 67, timestamp: "1d ago", badges: ["Unbeaten Season", "Youth Excellence"], isTopPerformer: true,
  },
];

const SEED_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, user_id: "p1", full_name: "Arjun Patel", email: "arjun@cricverse360.com", academy: "Rising Star Cricket Academy", total_ce: 820, weekly_ce: 145, level: 4, level_name: "Rising Star", streak_count: 12 },
  { rank: 2, user_id: "p10", full_name: "Neel Sharma", email: "neel@risingstar.com", academy: "Rising Star Cricket Academy", total_ce: 710, weekly_ce: 120, level: 4, level_name: "Rising Star", streak_count: 9 },
  { rank: 3, user_id: "p3", full_name: "Rashid Mohammed", email: "rashid@cricverse360.com", academy: "Rising Star Cricket Academy", total_ce: 520, weekly_ce: 95, level: 3, level_name: "Prospect", streak_count: 7 },
  { rank: 4, user_id: "p2", full_name: "Jake Thompson", email: "jake@cricverse360.com", academy: "Rising Star Cricket Academy", total_ce: 450, weekly_ce: 80, level: 3, level_name: "Prospect", streak_count: 5 },
  { rank: 5, user_id: "p8", full_name: "Rahul Desai", email: "rahul@cricverse360.com", academy: "Rising Star Cricket Academy", total_ce: 310, weekly_ce: 65, level: 3, level_name: "Prospect", streak_count: 4 },
];

const SEED_BADGES: Badge[] = [
  { id: "badge_first_step", name: "First Step", description: "Attend your 1st session", icon: "footprints", category: "attendance" },
  { id: "badge_consistent", name: "Consistent", description: "7-day attendance streak", icon: "flame", category: "attendance" },
  { id: "badge_iron_will", name: "Iron Will", description: "30-day attendance streak", icon: "shield", category: "attendance" },
  { id: "badge_unstoppable", name: "Unstoppable", description: "90-day attendance streak", icon: "trophy", category: "attendance" },
  { id: "badge_analyst", name: "Analyst", description: "Upload 5 videos for AI analysis", icon: "video", category: "skill" },
  { id: "badge_learner", name: "Learner", description: "Ask AI Coach 10 questions", icon: "book", category: "skill" },
  { id: "badge_sharpshooter", name: "Sharpshooter", description: "Score 80+ on any AI analysis", icon: "target", category: "skill" },
  { id: "badge_all_rounder", name: "All-Rounder", description: "Score 80+ on both batting & bowling", icon: "star", category: "skill" },
  { id: "badge_team_player", name: "Team Player", description: "Attend 10 group sessions", icon: "users", category: "social" },
  { id: "badge_rising_star", name: "Rising Star", description: "Reach top 10 on leaderboard", icon: "trending-up", category: "social" },
  { id: "badge_champion", name: "Champion", description: "Reach #1 on leaderboard", icon: "crown", category: "social" },
];

function getSeedEnergyForUser(email: string): EnergyData {
  const entry = SEED_LEADERBOARD.find((e) => e.email === email);
  if (entry) {
    const nextLevels: Record<number, { ce: number; name: string }> = { 1: { ce: 101, name: "Starter" }, 2: { ce: 301, name: "Prospect" }, 3: { ce: 601, name: "Rising Star" }, 4: { ce: 1001, name: "Pro" }, 5: { ce: 2001, name: "Elite" }, 6: { ce: 5001, name: "Legend" } };
    const next = nextLevels[entry.level];
    return { total_ce: entry.total_ce, weekly_ce: entry.weekly_ce, level: entry.level, level_name: entry.level_name, next_level_ce: next?.ce || null, next_level_name: next?.name || null, streak_count: entry.streak_count };
  }
  return { total_ce: 0, weekly_ce: 0, level: 1, level_name: "Rookie", next_level_ce: 101, next_level_name: "Starter", streak_count: 0 };
}

function getSeedBadgesForUser(email: string): string[] {
  const map: Record<string, string[]> = {
    "arjun@cricverse360.com": ["badge_first_step", "badge_consistent", "badge_iron_will", "badge_analyst", "badge_team_player", "badge_rising_star"],
    "neel@risingstar.com": ["badge_first_step", "badge_consistent", "badge_analyst", "badge_learner", "badge_team_player"],
    "rashid@cricverse360.com": ["badge_first_step", "badge_consistent", "badge_sharpshooter", "badge_team_player"],
    "jake@cricverse360.com": ["badge_first_step", "badge_consistent", "badge_analyst"],
    "rahul@cricverse360.com": ["badge_first_step", "badge_consistent"],
  };
  return map[email] || ["badge_first_step"];
}

export default function CommunityPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "leaderboard" ? "leaderboard" : "feed";
  const [activeTab, setActiveTab] = useState<"feed" | "leaderboard">(initialTab);

  const [selectedRegion, setSelectedRegion] = useState<USRegion>("All USA");
  const [selectedType, setSelectedType] = useState<PostType | "all">("all");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState<FeedPost[]>(mockPosts);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostType, setNewPostType] = useState<PostType>("general");
  const [newPostRegions, setNewPostRegions] = useState<USRegion[]>(["All USA"]);
  const [newPostRuns, setNewPostRuns] = useState("");
  const [newPostBalls, setNewPostBalls] = useState("");
  const [newPostWickets, setNewPostWickets] = useState("");
  const [newPostOvers, setNewPostOvers] = useState("");
  const [newPostOpponent, setNewPostOpponent] = useState("");
  const [newPostEvent, setNewPostEvent] = useState("");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const [scope, setScope] = useState<"weekly" | "alltime">("weekly");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(SEED_LEADERBOARD);
  const [myEnergy, setMyEnergy] = useState<EnergyData | null>(null);
  const [myBadges, setMyBadges] = useState<string[]>([]);
  const [allBadges] = useState<Badge[]>(SEED_BADGES);
  const [lbLoading, setLbLoading] = useState(true);
  const [awardEmail, setAwardEmail] = useState("");
  const [awardAmount, setAwardAmount] = useState("10");
  const [awardReason, setAwardReason] = useState("");
  const [awardMsg, setAwardMsg] = useState("");

  const isCoach = user?.role === "coach";
  const isAdmin = user?.role === "admin";
  const isPlayer = user?.role === "player";

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (selectedRegion !== "All USA") {
      result = result.filter(p => p.regions.includes(selectedRegion) || p.regions.includes("All USA"));
    }
    if (selectedType !== "all") {
      result = result.filter(p => p.type === selectedType);
    }
    return result;
  }, [posts, selectedRegion, selectedType]);

  const topPerformers = useMemo(() => {
    return players.slice(0, 5).map((p, i) => ({
      name: p.name,
      stat: p.role === "Bowler" ? p.stats.wickets + " wkts" : p.stats.runs + " runs",
      region: p.state,
      trend: i < 3 ? ("up" as const) : ("stable" as const),
    }));
  }, []);

  const regionStats = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach(p => {
      p.regions.forEach(r => {
        if (r !== "All USA") counts[r] = (counts[r] || 0) + 1;
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [posts]);

  const toggleLike = (postId: string) => {
    const wasLiked = likedPosts.has(postId);
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: wasLiked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  const addComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    setPosts(prev => prev.map(p => p.id === postId ? {
      ...p,
      comments: [...p.comments, { id: "c-" + Date.now(), authorName: user?.name || "You", content: text, timestamp: "Just now" }],
    } : p));
    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
  };

  const toggleRegion = (region: USRegion) => {
    if (region === "All USA") { setNewPostRegions(["All USA"]); return; }
    setNewPostRegions(prev => {
      const filtered = prev.filter(r => r !== "All USA");
      if (filtered.includes(region)) {
        const result = filtered.filter(r => r !== region);
        return result.length === 0 ? ["All USA"] : result;
      }
      return [...filtered, region];
    });
  };

  const createPost = () => {
    if (!newPostContent.trim()) return;
    const hasStats = newPostRuns || newPostWickets;
    const newPost: FeedPost = {
      id: "fp-" + Date.now(),
      authorName: user?.name || "Anonymous",
      authorAvatar: user?.avatar || "",
      authorRole: "player",
      authorVerified: !!user,
      type: newPostType,
      content: newPostContent,
      regions: newPostRegions,
      images: [],
      statCard: hasStats ? {
        runs: newPostRuns ? parseInt(newPostRuns) : undefined,
        balls: newPostBalls ? parseInt(newPostBalls) : undefined,
        wickets: newPostWickets ? parseInt(newPostWickets) : undefined,
        overs: newPostOvers || undefined,
        opponent: newPostOpponent || undefined,
        event: newPostEvent || undefined,
        date: new Date().toISOString().split("T")[0],
      } : undefined,
      likes: 0, comments: [], shares: 0, timestamp: "Just now", badges: hasStats ? ["New Post"] : [], isVerifiedStat: false,
    };
    setPosts(prev => [newPost, ...prev]);
    setShowCreatePost(false);
    setNewPostContent(""); setNewPostType("general"); setNewPostRegions(["All USA"]);
    setNewPostRuns(""); setNewPostBalls(""); setNewPostWickets(""); setNewPostOvers("");
    setNewPostOpponent(""); setNewPostEvent("");
  };

  const loadLeaderboard = useCallback(async () => {
    const sorted = [...SEED_LEADERBOARD].sort((a, b) => scope === "weekly" ? b.weekly_ce - a.weekly_ce : b.total_ce - a.total_ce);
    setLeaderboard(sorted);
    if (user) {
      setMyEnergy(getSeedEnergyForUser(user.email));
      setMyBadges(getSeedBadgesForUser(user.email));
    }
    setLbLoading(false);

    const timeout = <T,>(p: Promise<T>, ms: number): Promise<T | null> =>
      Promise.race([p, new Promise<null>((r) => setTimeout(() => r(null), ms))]);

    try {
      const lbRes = await timeout(apiRequest<{ leaderboard: LeaderboardEntry[]; myRank: LeaderboardEntry | null }>(`/energy/leaderboard?scope=${scope}`), 4000);
      if (lbRes && lbRes.ok) {
        const apiData = lbRes.data?.leaderboard || [];
        if (apiData.some((e) => e.total_ce > 0)) setLeaderboard(apiData);
      }
    } catch { /* keep seed data */ }

    if (user) {
      try {
        const eRes = await timeout(apiRequest<EnergyData>("/energy/me"), 3000);
        if (eRes && eRes.ok && eRes.data?.total_ce !== undefined) setMyEnergy(eRes.data);
      } catch { /* keep seed */ }
      try {
        const bRes = await timeout(apiRequest<Badge[]>("/energy/my-badges"), 3000);
        if (bRes && bRes.ok && Array.isArray(bRes.data) && bRes.data.length > 0) setMyBadges(bRes.data.map((b) => b.id));
      } catch { /* keep seed */ }
    }
  }, [scope, user]);

  useEffect(() => { loadLeaderboard(); }, [loadLeaderboard]);

  const handleAwardCe = async () => {
    if (!awardEmail || !awardAmount) return;
    setAwardMsg("");
    try {
      const res = await apiRequest<{ message: string }>("/energy/award", {
        method: "POST",
        body: { action: "coach_bonus", targetEmail: awardEmail, ceAmount: Number(awardAmount), details: awardReason || "Coach bonus" },
      });
      if (res.ok) {
        setAwardMsg(res.data?.message || `+${awardAmount} CE awarded!`);
        setAwardEmail("");
        setAwardAmount("10");
        setAwardReason("");
        loadLeaderboard();
      } else {
        setAwardMsg("Failed to award CE \u2014 backend may be offline. Demo data shown.");
      }
    } catch {
      setAwardMsg("Failed to award CE \u2014 backend may be offline. Demo data shown.");
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Community Hub</h1>
          <p className="text-slate-400 mb-6">Sign in to view the community feed and leaderboard</p>
          <Link href="/auth" className="bg-emerald-500 hover:bg-emerald-600 px-6 py-2 rounded-full text-sm font-medium transition-colors">Sign In</Link>
        </div>
      </main>
    );
  }

  const myRankEntry = leaderboard.find((e) => e.email === user.email);
  const progressPct = myEnergy && myEnergy.next_level_ce ? Math.min(100, Math.round((myEnergy.total_ce / myEnergy.next_level_ce) * 100)) : 100;

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400">Community</span> Hub
            </h1>
            <p className="text-sm text-slate-400 mt-1">Feed & Leaderboard in one place</p>
          </div>
          <div className="flex bg-slate-800/80 border border-slate-700/50 rounded-xl p-1">
            <button
              onClick={() => setActiveTab("feed")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "feed" ? "bg-emerald-500 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
            >
              Cricket Feed
              <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === "feed" ? "bg-white/20" : "bg-slate-700 text-slate-400"}`}>{posts.length}</span>
            </button>
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "leaderboard" ? "bg-emerald-500 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
            >
              Leaderboard
            </button>
          </div>
        </div>

        {activeTab === "feed" ? (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-64 shrink-0">
              <div className="sticky top-20">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-4">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Region</h3>
                  <div className="space-y-1">
                    {US_REGIONS.map(r => (
                      <button key={r} onClick={() => setSelectedRegion(r)}
                        className={"w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors " + (selectedRegion === r ? "bg-emerald-500/20 text-emerald-400" : "text-slate-400 hover:text-white hover:bg-slate-700/50")}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-4">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Post Type</h3>
                  <div className="space-y-1">
                    <button onClick={() => setSelectedType("all")}
                      className={"w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors " + (selectedType === "all" ? "bg-emerald-500/20 text-emerald-400" : "text-slate-400 hover:text-white hover:bg-slate-700/50")}>
                      All Posts
                    </button>
                    {(Object.keys(postTypeLabels) as PostType[]).map(t => (
                      <button key={t} onClick={() => setSelectedType(t)}
                        className={"w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors " + (selectedType === t ? "bg-emerald-500/20 text-emerald-400" : "text-slate-400 hover:text-white hover:bg-slate-700/50")}>
                        {postTypeLabels[t].label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Active Regions</h3>
                  {regionStats.map(([region, count]) => (
                    <div key={region} className="flex items-center justify-between py-1.5">
                      <span className="text-sm text-slate-300">{region}</span>
                      <span className="text-xs text-emerald-400">{count} posts</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {selectedRegion === "All USA" ? "USA Cricket Feed" : selectedRegion + " Cricket"}
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">{filteredPosts.length} posts</p>
                </div>
                {user && (
                  <button onClick={() => setShowCreatePost(true)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors">
                    + Create Post
                  </button>
                )}
              </div>

              {showCreatePost && (
                <div className="bg-slate-800/80 border border-slate-700/50 rounded-xl p-5 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Create Post</h3>
                    <button onClick={() => setShowCreatePost(false)} className="text-slate-400 hover:text-white text-xl">&times;</button>
                  </div>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {(Object.keys(postTypeLabels) as PostType[]).map(t => (
                      <button key={t} onClick={() => setNewPostType(t)}
                        className={"px-3 py-1 rounded-full text-xs font-medium border transition-colors " + (newPostType === t ? postTypeLabels[t].color : "bg-slate-700/50 text-slate-400 border-slate-600 hover:text-white")}>
                        {postTypeLabels[t].label}
                      </button>
                    ))}
                  </div>
                  <textarea value={newPostContent} onChange={e => setNewPostContent(e.target.value)}
                    placeholder="Share your cricket performance, highlights, or updates..."
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none" rows={4} />
                  {(newPostType === "performance" || newPostType === "scorecard") && (
                    <div className="mt-4 bg-slate-900/30 border border-slate-700/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-slate-300 mb-3">Add Stats (optional)</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs text-slate-500 block mb-1">Runs</label>
                          <input type="number" value={newPostRuns} onChange={e => setNewPostRuns(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 block mb-1">Balls</label>
                          <input type="number" value={newPostBalls} onChange={e => setNewPostBalls(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 block mb-1">Wickets</label>
                          <input type="number" value={newPostWickets} onChange={e => setNewPostWickets(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 block mb-1">Overs</label>
                          <input type="text" value={newPostOvers} onChange={e => setNewPostOvers(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 block mb-1">Opponent</label>
                          <input type="text" value={newPostOpponent} onChange={e => setNewPostOpponent(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 block mb-1">Event/League</label>
                          <input type="text" value={newPostEvent} onChange={e => setNewPostEvent(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Publish to Regions</h4>
                    <div className="flex gap-2 flex-wrap">
                      {US_REGIONS.map(r => (
                        <button key={r} onClick={() => toggleRegion(r)}
                          className={"px-3 py-1 rounded-full text-xs border transition-colors " + (newPostRegions.includes(r) ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-slate-700/50 text-slate-400 border-slate-600 hover:text-white")}>
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button onClick={createPost} disabled={!newPostContent.trim()}
                      className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors">
                      Post
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {filteredPosts.map(post => (
                  <div key={post.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600/50 transition-all">
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {post.authorName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white text-sm">{post.authorName}</span>
                              {post.authorVerified && (
                                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              )}
                              <span className={"text-xs px-2 py-0.5 rounded-full border " + postTypeLabels[post.type].color}>
                                {postTypeLabels[post.type].label}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-slate-500">{post.timestamp}</span>
                              <span className="text-xs text-slate-600">in</span>
                              {post.regions.map(r => (
                                <span key={r} className="text-xs text-emerald-400/70">{r}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                          {post.isRising && <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/30">Rising</span>}
                          {post.isTopPerformer && <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">Top Performer</span>}
                          {post.isVerifiedStat && <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">Verified Stats</span>}
                        </div>
                      </div>

                      <p className="text-sm text-slate-300 leading-relaxed mb-3">{post.content}</p>

                      {post.badges.length > 0 && (
                        <div className="flex gap-1.5 mb-3 flex-wrap">
                          {post.badges.map(b => (
                            <span key={b} className="text-xs bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded-full">{b}</span>
                          ))}
                        </div>
                      )}

                      {post.statCard && (
                        <div className="bg-gradient-to-r from-slate-900/80 to-slate-800/80 border border-slate-700/50 rounded-lg p-4 mb-3">
                          <div className="flex items-center justify-between mb-2">
                            {post.statCard.event && <span className="text-xs text-emerald-400 font-medium">{post.statCard.event}</span>}
                            {post.statCard.date && <span className="text-xs text-slate-500">{post.statCard.date}</span>}
                          </div>
                          {post.statCard.opponent && (
                            <p className="text-xs text-slate-400 mb-2">vs {post.statCard.opponent} {post.statCard.result && <span className="text-emerald-400 ml-1">{post.statCard.result}</span>}</p>
                          )}
                          {!post.statCard.opponent && post.statCard.result && <p className="text-xs text-emerald-400 mb-2">{post.statCard.result}</p>}
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                            {post.statCard.runs !== undefined && <div className="text-center"><p className="text-lg font-bold text-white">{post.statCard.runs}</p><p className="text-xs text-slate-500">Runs</p></div>}
                            {post.statCard.balls !== undefined && <div className="text-center"><p className="text-lg font-bold text-slate-300">{post.statCard.balls}</p><p className="text-xs text-slate-500">Balls</p></div>}
                            {post.statCard.fours !== undefined && <div className="text-center"><p className="text-lg font-bold text-emerald-400">{post.statCard.fours}</p><p className="text-xs text-slate-500">4s</p></div>}
                            {post.statCard.sixes !== undefined && <div className="text-center"><p className="text-lg font-bold text-amber-400">{post.statCard.sixes}</p><p className="text-xs text-slate-500">6s</p></div>}
                            {post.statCard.strikeRate !== undefined && <div className="text-center"><p className="text-lg font-bold text-blue-400">{post.statCard.strikeRate}</p><p className="text-xs text-slate-500">SR</p></div>}
                            {post.statCard.wickets !== undefined && <div className="text-center"><p className="text-lg font-bold text-red-400">{post.statCard.wickets}</p><p className="text-xs text-slate-500">Wickets</p></div>}
                            {post.statCard.overs !== undefined && <div className="text-center"><p className="text-lg font-bold text-slate-300">{post.statCard.overs}</p><p className="text-xs text-slate-500">Overs</p></div>}
                            {post.statCard.economy !== undefined && <div className="text-center"><p className="text-lg font-bold text-purple-400">{post.statCard.economy}</p><p className="text-xs text-slate-500">Econ</p></div>}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4 pt-3 border-t border-slate-700/30">
                        <button onClick={() => toggleLike(post.id)}
                          className={"flex items-center gap-1.5 text-sm transition-colors " + (likedPosts.has(post.id) ? "text-red-400" : "text-slate-400 hover:text-red-400")}>
                          <svg className="w-4 h-4" fill={likedPosts.has(post.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          {post.likes}
                        </button>
                        <button onClick={() => toggleComments(post.id)} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-blue-400 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {post.comments.length}
                        </button>
                        <button className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                          {post.shares}
                        </button>
                      </div>

                      {expandedComments.has(post.id) && (
                        <div className="mt-3 pt-3 border-t border-slate-700/30">
                          {post.comments.map(c => (
                            <div key={c.id} className="flex gap-2 mb-2">
                              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-300 shrink-0 mt-0.5">{c.authorName[0]}</div>
                              <div>
                                <span className="text-xs font-medium text-slate-300">{c.authorName}</span>
                                <span className="text-xs text-slate-500 ml-2">{c.timestamp}</span>
                                <p className="text-sm text-slate-400">{c.content}</p>
                              </div>
                            </div>
                          ))}
                          {user && (
                            <div className="flex gap-2 mt-2">
                              <input type="text" value={commentInputs[post.id] || ""}
                                onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                onKeyDown={e => e.key === "Enter" && addComment(post.id)}
                                placeholder="Add a comment..."
                                className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
                              <button onClick={() => addComment(post.id)}
                                className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/30 transition-colors">
                                Post
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-slate-500 text-lg mb-2">No posts in this feed yet</p>
                  <p className="text-slate-600 text-sm">Be the first to share a cricket update!</p>
                </div>
              )}
            </div>

            <div className="lg:w-72 shrink-0">
              <div className="sticky top-20 space-y-4">
                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-amber-400">{"\u{1F3C6}"} Top 5</h3>
                    <button onClick={() => setActiveTab("leaderboard")} className="text-[10px] text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded hover:bg-emerald-500/10 transition-colors">
                      Full Board {"\u2192"}
                    </button>
                  </div>
                  {topPerformers.map((p, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs w-4 font-bold ${i === 0 ? "text-yellow-400" : i === 1 ? "text-slate-400" : i === 2 ? "text-amber-600" : "text-slate-500"}`}>{i + 1}</span>
                        <span className="text-sm text-white">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-400">{p.stat}</span>
                        {p.trend === "up" && <span className="text-emerald-400 text-xs">&#9650;</span>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-slate-300 mb-3">Rising Players</h3>
                  {posts.filter(p => p.isRising).slice(0, 3).map(p => (
                    <div key={p.id} className="flex items-center gap-2 py-1.5">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold">{p.authorName[0]}</div>
                      <div>
                        <p className="text-sm text-white">{p.authorName}</p>
                        <p className="text-xs text-slate-500">{p.regions.filter(r => r !== "All USA")[0] || "USA"}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-slate-300 mb-3">Trending Topics</h3>
                  <div className="space-y-2">
                    {["MLC Development", "Youth Nationals", "Weekend League", "T20 Championship", "Training Camps"].map(t => (
                      <span key={t} className="inline-block text-xs bg-slate-700/50 text-slate-300 px-2.5 py-1 rounded-full mr-1.5 mb-1"># {t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-3xl">{"\u{1F3C6}"}</span> Leaderboard
                </h2>
                <p className="text-slate-400 mt-1">Earn Cricket Energy by following your routine</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setScope("weekly")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${scope === "weekly" ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>Weekly</button>
                <button onClick={() => setScope("alltime")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${scope === "alltime" ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>All-Time</button>
              </div>
            </div>

            {isPlayer && myEnergy && (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${LEVEL_COLORS[myEnergy.level] || LEVEL_COLORS[1]} flex items-center justify-center text-2xl font-bold shadow-lg`}>
                      {myEnergy.level}
                    </div>
                    <div>
                      <div className="text-lg font-bold">{user.name}</div>
                      <div className="text-sm text-slate-400">
                        <span className="text-emerald-400 font-medium">{myEnergy.level_name}</span>
                        {myRankEntry && <span className="ml-2 text-slate-500">#{myRankEntry.rank}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-amber-400">{"\u26A1"} {myEnergy.total_ce}</div>
                      <div className="text-xs text-slate-500">Total CE</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-emerald-400">{myEnergy.weekly_ce}</div>
                      <div className="text-xs text-slate-500">This Week</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-orange-400">{"\u{1F525}"} {myEnergy.streak_count}</div>
                      <div className="text-xs text-slate-500">Day Streak</div>
                    </div>
                  </div>
                </div>
                {myEnergy.next_level_ce && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>{myEnergy.level_name}</span>
                      <span>{myEnergy.total_ce} / {myEnergy.next_level_ce} CE to {myEnergy.next_level_name}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2.5">
                      <div className={`h-2.5 rounded-full bg-gradient-to-r ${LEVEL_COLORS[myEnergy.level] || LEVEL_COLORS[1]}`} style={{ width: `${progressPct}%` }} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {lbLoading ? (
              <div className="text-center py-16">
                <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-slate-400">Loading leaderboard...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-700/50">
                      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                        {isAdmin ? "All Academies" : "Top Players"} &mdash; {scope === "weekly" ? "This Week" : "All Time"}
                      </h2>
                    </div>
                    <div className="divide-y divide-slate-700/30">
                      {leaderboard.map((entry) => {
                        const isMe = entry.email === user.email;
                        const ceVal = scope === "weekly" ? entry.weekly_ce : entry.total_ce;
                        return (
                          <div key={entry.user_id} className={`flex items-center gap-4 px-6 py-4 transition-colors ${isMe ? "bg-emerald-500/10 border-l-2 border-emerald-500" : "hover:bg-slate-700/20"}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              entry.rank === 1 ? "bg-yellow-500/20 text-yellow-400" :
                              entry.rank === 2 ? "bg-slate-400/20 text-slate-300" :
                              entry.rank === 3 ? "bg-amber-600/20 text-amber-500" :
                              "bg-slate-700/50 text-slate-400"
                            }`}>
                              {entry.rank <= 3 ? ["\u{1F947}", "\u{1F948}", "\u{1F949}"][entry.rank - 1] : `#${entry.rank}`}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`font-medium ${isMe ? "text-emerald-400" : "text-white"}`}>{entry.full_name}</span>
                                {isMe && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">YOU</span>}
                              </div>
                              <div className="text-xs text-slate-500 flex items-center gap-2">
                                <span className={`bg-gradient-to-r ${LEVEL_COLORS[entry.level] || LEVEL_COLORS[1]} bg-clip-text text-transparent font-medium`}>{entry.level_name}</span>
                                {isAdmin && entry.academy && <span className="text-slate-600">&middot; {entry.academy}</span>}
                                {entry.streak_count > 0 && <span>{"\u{1F525}"} {entry.streak_count}d</span>}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-amber-400">{"\u26A1"} {ceVal}</div>
                              <div className="text-[10px] text-slate-500">{scope === "weekly" ? "this week" : "total"}</div>
                            </div>
                          </div>
                        );
                      })}
                      {leaderboard.length === 0 && (
                        <div className="px-6 py-12 text-center text-slate-500">No players yet. Start earning Cricket Energy!</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {isPlayer && (
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
                      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
                        My Badges ({myBadges.length}/{allBadges.length})
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        {allBadges.map((badge) => {
                          const earned = myBadges.includes(badge.id);
                          return (
                            <div key={badge.id} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${earned ? "bg-slate-700/50" : "opacity-30"}`} title={badge.description}>
                              <span className="text-2xl">{BADGE_ICONS[badge.icon] || "\u2B50"}</span>
                              <span className="text-[10px] text-center leading-tight text-slate-300">{badge.name}</span>
                              {!earned && <span className="text-[9px] text-slate-600">{"\u{1F512}"}</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">How to Earn CE</h3>
                    <div className="space-y-2 text-xs">
                      {[
                        { action: "Attend practice", ce: 20 },
                        { action: "Complete drills", ce: 15 },
                        { action: "Upload AI analysis", ce: 10 },
                        { action: "Ask AI Coach", ce: 5 },
                        { action: "Daily login", ce: 5 },
                        { action: "7-day streak bonus", ce: 50 },
                        { action: "30-day streak bonus", ce: 200 },
                        { action: "Improve AI score", ce: 25 },
                      ].map((item) => (
                        <div key={item.action} className="flex justify-between text-slate-400">
                          <span>{item.action}</span>
                          <span className="text-amber-400 font-medium">+{item.ce} CE</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {(isCoach || isAdmin) && (
                    <div className="bg-slate-800/50 border border-purple-500/30 rounded-2xl p-5">
                      <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-4">
                        {isAdmin ? "Admin: Award CE" : "Coach: Award Bonus CE"}
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-slate-500 block mb-1">Player Email</label>
                          <input type="email" value={awardEmail} onChange={(e) => setAwardEmail(e.target.value)} placeholder="player@example.com" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500" />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 block mb-1">CE Amount</label>
                          <input type="number" value={awardAmount} onChange={(e) => setAwardAmount(e.target.value)} min="1" max="100" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500" />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 block mb-1">Reason (optional)</label>
                          <input type="text" value={awardReason} onChange={(e) => setAwardReason(e.target.value)} placeholder="Great effort today!" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500" />
                        </div>
                        <button onClick={handleAwardCe} className="w-full bg-purple-500 hover:bg-purple-600 text-white text-xs font-medium py-2 rounded-lg transition-colors">
                          Award CE {"\u26A1"}
                        </button>
                        {awardMsg && <p className="text-xs text-center text-emerald-400">{awardMsg}</p>}
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Levels</h3>
                    <div className="space-y-2">
                      {[
                        { level: 1, name: "Rookie", range: "0\u2013100 CE" },
                        { level: 2, name: "Starter", range: "101\u2013300 CE" },
                        { level: 3, name: "Prospect", range: "301\u2013600 CE" },
                        { level: 4, name: "Rising Star", range: "601\u20131000 CE" },
                        { level: 5, name: "Pro", range: "1001\u20132000 CE" },
                        { level: 6, name: "Elite", range: "2001\u20135000 CE" },
                        { level: 7, name: "Legend", range: "5000+ CE" },
                      ].map((l) => (
                        <div key={l.level} className={`flex items-center gap-2 text-xs ${myEnergy && myEnergy.level === l.level ? "text-white" : "text-slate-500"}`}>
                          <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${LEVEL_COLORS[l.level]} flex items-center justify-center text-[10px] font-bold text-white`}>{l.level}</div>
                          <span className="flex-1">{l.name}</span>
                          <span className="text-slate-600">{l.range}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
