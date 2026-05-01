"use client";

import { useState, useMemo } from "react";
import { players } from "@/data/mock";
import { useAuth } from "@/context/AuthContext";

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

const US_REGIONS: USRegion[] = ["All USA", "New Jersey", "California", "Texas", "New York", "Illinois", "Florida", "Georgia", "Virginia", "Massachusetts", "Washington"];

const postTypeLabels: Record<PostType, { label: string; color: string }> = {
  performance: { label: "Performance", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  highlight: { label: "Highlight", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  scorecard: { label: "Scorecard", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  spotlight: { label: "Spotlight", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  general: { label: "Update", color: "bg-slate-500/20 text-slate-400 border-slate-500/30" },
};

// Feed posts will come from real user activity
const mockPosts: FeedPost[] = [];

export default function FeedPage() {
  const { user } = useAuth();
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

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="lg:w-64 shrink-0">
            <div className="sticky top-20">
              <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-5 mb-4">
                <h2 className="text-lg font-bold text-white mb-1">Cricket Feed</h2>
                <p className="text-xs text-slate-400">Your cricket recognition network</p>
              </div>
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

          {/* Main Feed */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {selectedRegion === "All USA" ? "USA Cricket Feed" : selectedRegion + " Cricket"}
                </h1>
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

          {/* Right Sidebar */}
          <div className="lg:w-72 shrink-0">
            <div className="sticky top-20 space-y-4">
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-amber-400 mb-3">Top Performers This Week</h3>
                {topPerformers.map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 w-4">{i + 1}.</span>
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

              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-purple-400 mb-2">About Cricket Feed</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  This is not generic social media. Cricket Feed is a recognition network where real performances get visibility. Post your weekend stats, share highlights, and get discovered by selectors, coaches, agents, and sponsors across USA cricket.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
