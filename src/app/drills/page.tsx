"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api-client";
import { useSubscription } from "@/context/SubscriptionContext";
import { InlineUpgradePrompt } from "@/components/SubscriptionGate";

type DrillCategory = "batting" | "bowling" | "fielding" | "fitness" | "wicketkeeping";
type SkillLevel = "beginner" | "intermediate" | "advanced";
type DrillTab = "browse" | "my-drills" | "upload";

interface Drill {
  id: string;
  title: string;
  description: string;
  video_url: string;
  category: DrillCategory;
  skill_level: SkillLevel;
  duration_minutes: number;
  tags: string[];
  like_count: number;
  comment_count: number;
  share_count: number;
  visibility: string;
  author_name: string;
  author_avatar: string;
  created_at: string;
}

interface DrillComment {
  id: string;
  author_name: string;
  author_avatar: string;
  content: string;
  created_at: string;
}

const CATEGORIES: { value: DrillCategory; label: string; icon: string }[] = [
  { value: "batting", label: "Batting", icon: "\u{1F3CF}" },
  { value: "bowling", label: "Bowling", icon: "\u{1F3B3}" },
  { value: "fielding", label: "Fielding", icon: "\u{1F3C3}" },
  { value: "fitness", label: "Fitness", icon: "\u{1F4AA}" },
  { value: "wicketkeeping", label: "Wicketkeeping", icon: "\u{1F9E4}" },
];

const SKILL_LEVELS: { value: SkillLevel; label: string; color: string }[] = [
  { value: "beginner", label: "Beginner", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  { value: "intermediate", label: "Intermediate", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  { value: "advanced", label: "Advanced", color: "bg-red-500/20 text-red-400 border-red-500/30" },
];

const TAG_SUGGESTIONS = [
  "Power Hitting", "Defense", "Footwork", "Spin", "Pace", "Yorker",
  "Short Ball", "Catching", "Ground Fielding", "Throwing", "Cardio",
  "Strength", "Agility", "Net Session", "Match Prep", "Warm Up",
];

const MOCK_DRILLS: Drill[] = [
  {
    id: "d1", title: "Front Foot Drive Masterclass", description: "Step-by-step drill to perfect the front foot cover drive. Focus on head position, weight transfer, and follow-through. Great for beginners learning proper technique.", video_url: "https://www.youtube.com/watch?v=example1", category: "batting", skill_level: "beginner", duration_minutes: 15, tags: ["Footwork", "Defense", "Net Session"], like_count: 42, comment_count: 8, share_count: 12, visibility: "public", author_name: "Arjun Patel", author_avatar: "/avatars/player1.jpg", created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "d2", title: "Yorker Bowling Practice", description: "Practice routine for consistently bowling yorkers at the death. Includes target placement drills and variations.", video_url: "https://www.youtube.com/watch?v=example2", category: "bowling", skill_level: "advanced", duration_minutes: 20, tags: ["Yorker", "Pace", "Match Prep"], like_count: 67, comment_count: 15, share_count: 23, visibility: "public", author_name: "Rashid Mohammed", author_avatar: "/avatars/player3.jpg", created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "d3", title: "Slip Catching Routine", description: "Daily slip catching routine used by professional teams. Start close and gradually increase distance. 50 catches minimum per session.", video_url: "", category: "fielding", skill_level: "intermediate", duration_minutes: 30, tags: ["Catching", "Ground Fielding", "Warm Up"], like_count: 31, comment_count: 5, share_count: 8, visibility: "public", author_name: "Jake Thompson", author_avatar: "/avatars/player2.jpg", created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "d4", title: "Cricket-Specific HIIT Workout", description: "High intensity interval training designed for cricketers. Improves sprint speed between wickets and fielding agility. 4 rounds, 30 seconds on, 15 seconds rest.", video_url: "https://www.youtube.com/watch?v=example4", category: "fitness", skill_level: "intermediate", duration_minutes: 25, tags: ["Cardio", "Agility", "Strength"], like_count: 89, comment_count: 22, share_count: 45, visibility: "public", author_name: "Coach Yashwant", author_avatar: "", created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "d5", title: "Pull Shot Against Short Ball", description: "Learn to play the pull and hook shot safely and effectively. Covers positioning, shot selection, and when to duck vs play.", video_url: "https://www.youtube.com/watch?v=example5", category: "batting", skill_level: "advanced", duration_minutes: 20, tags: ["Short Ball", "Power Hitting", "Net Session"], like_count: 55, comment_count: 11, share_count: 19, visibility: "public", author_name: "Rahul Desai", author_avatar: "/avatars/player8.jpg", created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: "d6", title: "Leg Spin Basics for Beginners", description: "Introduction to leg spin bowling. Covers grip, wrist position, release point, and basic leg break delivery. Practice with a tennis ball first.", video_url: "", category: "bowling", skill_level: "beginner", duration_minutes: 15, tags: ["Spin", "Net Session", "Warm Up"], like_count: 38, comment_count: 9, share_count: 14, visibility: "public", author_name: "Neel Sharma", author_avatar: "", created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];

const PREMIUM_PACKS = [
  { id: "pp1", name: "Elite Batting Masterclass", price: 14.99, drillCount: 12, description: "Pro-level batting drills from international coaches", level: "advanced" as SkillLevel },
  { id: "pp2", name: "Fast Bowling Toolkit", price: 12.99, drillCount: 10, description: "Speed, accuracy, and variation drills for pace bowlers", level: "intermediate" as SkillLevel },
  { id: "pp3", name: "Fielding Fundamentals Pack", price: 9.99, drillCount: 8, description: "Catching, throwing, and ground fielding essentials", level: "beginner" as SkillLevel },
];

const AFFILIATE_GEAR = [
  { name: "SG Cricket Bat - English Willow", price: 189, url: "https://www.amazon.com/dp/B0EXAMPLE1?tag=cricverse360-20", category: "batting" as DrillCategory },
  { name: "Kookaburra Bowling Machine Ball (6pk)", price: 24, url: "https://www.amazon.com/dp/B0EXAMPLE2?tag=cricverse360-20", category: "bowling" as DrillCategory },
  { name: "Fielding Training Rebound Net", price: 45, url: "https://www.amazon.com/dp/B0EXAMPLE3?tag=cricverse360-20", category: "fielding" as DrillCategory },
  { name: "Agility Ladder + Cones Set", price: 29, url: "https://www.amazon.com/dp/B0EXAMPLE4?tag=cricverse360-20", category: "fitness" as DrillCategory },
];

export default function DrillsPage() {
  const { user } = useAuth();
  const { hasFeature } = useSubscription();
  const [tab, setTab] = useState<DrillTab>("browse");
  const [drills, setDrills] = useState<Drill[]>(MOCK_DRILLS);
  const [filterCategory, setFilterCategory] = useState<DrillCategory | "all">("all");
  const [filterLevel, setFilterLevel] = useState<SkillLevel | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [likedDrills, setLikedDrills] = useState<Set<string>>(new Set());
  const [expandedDrill, setExpandedDrill] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [drillComments, setDrillComments] = useState<Record<string, DrillComment[]>>({});

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newCategory, setNewCategory] = useState<DrillCategory>("batting");
  const [newLevel, setNewLevel] = useState<SkillLevel>("beginner");
  const [newDuration, setNewDuration] = useState("");
  const [newTags, setNewTags] = useState<string[]>([]);
  const [newVisibility, setNewVisibility] = useState<"public" | "academy" | "private">("public");
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const filteredDrills = useMemo(() => {
    let result = drills;
    if (tab === "my-drills") {
      result = result.filter(d => d.author_name === user?.name);
    }
    if (filterCategory !== "all") {
      result = result.filter(d => d.category === filterCategory);
    }
    if (filterLevel !== "all") {
      result = result.filter(d => d.skill_level === filterLevel);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [drills, tab, filterCategory, filterLevel, searchQuery, user?.name]);

  const toggleLike = (drillId: string) => {
    const wasLiked = likedDrills.has(drillId);
    setLikedDrills(prev => {
      const next = new Set(prev);
      if (next.has(drillId)) next.delete(drillId);
      else next.add(drillId);
      return next;
    });
    setDrills(prev => prev.map(d => d.id === drillId ? { ...d, like_count: wasLiked ? d.like_count - 1 : d.like_count + 1 } : d));
    apiRequest(`/drills/${drillId}/like`, { method: "POST" }).catch(() => {});
  };

  const shareDrill = (drillId: string) => {
    setDrills(prev => prev.map(d => d.id === drillId ? { ...d, share_count: d.share_count + 1 } : d));
    apiRequest(`/drills/${drillId}/share`, { method: "POST" }).catch(() => {});
  };

  const addComment = (drillId: string) => {
    const text = commentInputs[drillId]?.trim();
    if (!text) return;
    const newComment: DrillComment = {
      id: "dc-" + Date.now(),
      author_name: user?.name || "You",
      author_avatar: user?.avatar || "",
      content: text,
      created_at: new Date().toISOString(),
    };
    setDrillComments(prev => ({
      ...prev,
      [drillId]: [...(prev[drillId] || []), newComment],
    }));
    setDrills(prev => prev.map(d => d.id === drillId ? { ...d, comment_count: d.comment_count + 1 } : d));
    setCommentInputs(prev => ({ ...prev, [drillId]: "" }));
    apiRequest(`/drills/${drillId}/comments`, { method: "POST", body: { content: text } }).catch(() => {});
  };

  const toggleTag = (tag: string) => {
    setNewTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const submitDrill = async () => {
    if (!newTitle.trim()) { setUploadStatus("Title is required"); return; }
    const drill: Drill = {
      id: "d-" + Date.now(),
      title: newTitle.trim(),
      description: newDescription.trim(),
      video_url: newVideoUrl.trim(),
      category: newCategory,
      skill_level: newLevel,
      duration_minutes: parseInt(newDuration) || 0,
      tags: newTags,
      like_count: 0,
      comment_count: 0,
      share_count: 0,
      visibility: newVisibility,
      author_name: user?.name || "You",
      author_avatar: user?.avatar || "",
      created_at: new Date().toISOString(),
    };
    setDrills(prev => [drill, ...prev]);
    setUploadStatus("Drill uploaded successfully!");

    apiRequest("/drills", {
      method: "POST",
      body: {
        title: drill.title,
        description: drill.description,
        videoUrl: drill.video_url,
        category: drill.category,
        skillLevel: drill.skill_level,
        durationMinutes: drill.duration_minutes,
        tags: drill.tags,
        visibility: drill.visibility,
      },
    }).catch(() => {});

    setNewTitle("");
    setNewDescription("");
    setNewVideoUrl("");
    setNewCategory("batting");
    setNewLevel("beginner");
    setNewDuration("");
    setNewTags([]);
    setNewVisibility("public");
    setTimeout(() => { setUploadStatus(""); setTab("my-drills"); }, 1500);
  };

  const deleteDrill = (drillId: string) => {
    setDrills(prev => prev.filter(d => d.id !== drillId));
    apiRequest(`/drills/${drillId}`, { method: "DELETE" }).catch(() => {});
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  const getCategoryColor = (cat: DrillCategory) => {
    const colors: Record<DrillCategory, string> = {
      batting: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      bowling: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      fielding: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      fitness: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      wicketkeeping: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    };
    return colors[cat];
  };

  if (!user) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Training Drills</h1>
          <p className="text-slate-400">Please log in to access drills</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-up">
          <p className="text-xs uppercase tracking-widest text-emerald-400 mb-2">Training</p>
          <h1 className="text-3xl font-bold mb-2">Training Drills</h1>
          <p className="text-slate-400">Upload, share, and discover training drills from the community</p>
        </div>

        {!hasFeature("drills_upload") && (
          <div className="mb-6">
            <InlineUpgradePrompt feature="drills_upload" message="Upgrade to Pro to upload & share your own drills with the community" />
          </div>
        )}

        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wide">Premium Drill Packs</h2>
              <p className="text-xs text-slate-500">Curated by professional coaches</p>
            </div>
            <Link href="/pricing" className="text-xs text-blue-400 hover:text-blue-300">View all plans &rarr;</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {PREMIUM_PACKS.map((pack) => (
              <div key={pack.id} className="glass-card rounded-xl p-4 border border-blue-500/20 hover:border-blue-500/40 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${SKILL_LEVELS.find(l => l.value === pack.level)?.color}`}>{pack.level}</span>
                  <span className="text-xs text-slate-500">{pack.drillCount} drills</span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{pack.name}</h3>
                <p className="text-xs text-slate-400 mb-3">{pack.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-400 font-semibold">${pack.price}</span>
                  <button className="text-xs px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">Buy Pack</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filterCategory !== "all" && (
          <div className="glass-card rounded-xl p-4 mb-6">
            <h3 className="text-sm font-semibold text-amber-400 mb-3">Recommended Gear for {CATEGORIES.find(c => c.value === filterCategory)?.label}</h3>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {AFFILIATE_GEAR.filter(g => g.category === filterCategory).map((gear) => (
                <a key={gear.name} href={gear.url} target="_blank" rel="noopener noreferrer" className="shrink-0 bg-slate-900/50 border border-slate-700/50 rounded-lg p-3 hover:border-amber-500/40 transition-all w-52">
                  <p className="text-xs text-white font-medium truncate">{gear.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-amber-400 text-sm font-semibold">${gear.price}</span>
                    <span className="text-xs text-slate-500">View on Amazon</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-6 border-b border-slate-800 pb-4">
          {(["browse", "my-drills", "upload"] as DrillTab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {t === "browse" ? "Browse Drills" : t === "my-drills" ? "My Drills" : "Upload Drill"}
            </button>
          ))}
        </div>

        {tab === "upload" ? (
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <h2 className="text-xl font-bold mb-6">Upload New Drill</h2>

            {uploadStatus && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${uploadStatus.includes("success") ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                {uploadStatus}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Drill Title *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Front Foot Drive Practice"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Describe the drill, what it focuses on, and how to perform it..."
                  rows={4}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Video URL (YouTube or direct link)</label>
                <input
                  type="url"
                  value={newVideoUrl}
                  onChange={e => setNewVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <p className="text-xs text-slate-500 mt-1">Paste a YouTube link or any video URL</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as DrillCategory)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Skill Level</label>
                  <select
                    value={newLevel}
                    onChange={e => setNewLevel(e.target.value as SkillLevel)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {SKILL_LEVELS.map(l => (
                      <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={e => setNewDuration(e.target.value)}
                    placeholder="e.g. 15"
                    min="1"
                    max="180"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Tags (click to add)</label>
                <div className="flex flex-wrap gap-2">
                  {TAG_SUGGESTIONS.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        newTags.includes(tag)
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                          : "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                {newTags.length > 0 && (
                  <p className="text-xs text-slate-500 mt-2">Selected: {newTags.join(", ")}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Visibility</label>
                <div className="flex gap-3">
                  {(["public", "academy", "private"] as const).map(v => (
                    <button
                      key={v}
                      onClick={() => setNewVisibility(v)}
                      className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                        newVisibility === v
                          ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/50"
                          : "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600"
                      }`}
                    >
                      {v === "public" ? "Public" : v === "academy" ? "Academy Only" : "Private"}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={submitDrill}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-lg transition-colors"
              >
                Upload Drill
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-3 mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search drills..."
                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 w-full md:w-64"
              />
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value as DrillCategory | "all")}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                ))}
              </select>
              <select
                value={filterLevel}
                onChange={e => setFilterLevel(e.target.value as SkillLevel | "all")}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Levels</option>
                {SKILL_LEVELS.map(l => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>

            {filteredDrills.length === 0 ? (
              <div className="text-center py-16 bg-slate-900 rounded-xl border border-slate-800">
                <div className="text-4xl mb-3">{tab === "my-drills" ? "\u{1F4DD}" : "\u{1F50D}"}</div>
                <h3 className="text-lg font-medium mb-1">
                  {tab === "my-drills" ? "No drills uploaded yet" : "No drills found"}
                </h3>
                <p className="text-slate-400 text-sm">
                  {tab === "my-drills"
                    ? "Upload your first drill to share with the community!"
                    : "Try adjusting your filters or search query"}
                </p>
                {tab === "my-drills" && (
                  <button
                    onClick={() => setTab("upload")}
                    className="mt-4 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition-colors"
                  >
                    Upload Your First Drill
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDrills.map(drill => (
                  <div key={drill.id} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold">
                            {drill.author_avatar ? (
                              <img src={drill.author_avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              drill.author_name.charAt(0)
                            )}
                          </div>
                          <div>
                            <span className="font-medium text-sm">{drill.author_name}</span>
                            <span className="text-slate-500 text-xs ml-2">{formatDate(drill.created_at)}</span>
                          </div>
                        </div>
                        {drill.author_name === user?.name && tab === "my-drills" && (
                          <button
                            onClick={() => deleteDrill(drill.id)}
                            className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded border border-red-500/30 hover:bg-red-500/10 transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>

                      <h3 className="text-lg font-bold mb-2">{drill.title}</h3>
                      <p className="text-slate-400 text-sm mb-3 leading-relaxed">{drill.description}</p>

                      {drill.video_url && (
                        <a
                          href={drill.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg text-sm text-emerald-400 hover:bg-slate-700 transition-colors mb-3"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                          Watch Video
                        </a>
                      )}

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(drill.category)}`}>
                          {CATEGORIES.find(c => c.value === drill.category)?.icon} {drill.category}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${SKILL_LEVELS.find(l => l.value === drill.skill_level)?.color}`}>
                          {drill.skill_level}
                        </span>
                        {drill.duration_minutes > 0 && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                            {drill.duration_minutes} min
                          </span>
                        )}
                        {drill.tags.map(tag => (
                          <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs bg-slate-800 text-slate-400 border border-slate-700">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 pt-3 border-t border-slate-800">
                        <button
                          onClick={() => toggleLike(drill.id)}
                          className={`flex items-center gap-1.5 text-sm transition-colors ${likedDrills.has(drill.id) ? "text-red-400" : "text-slate-400 hover:text-red-400"}`}
                        >
                          <svg className="w-4 h-4" fill={likedDrills.has(drill.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          {drill.like_count}
                        </button>
                        <button
                          onClick={() => setExpandedDrill(expandedDrill === drill.id ? null : drill.id)}
                          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-blue-400 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {drill.comment_count}
                        </button>
                        <button
                          onClick={() => shareDrill(drill.id)}
                          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                          {drill.share_count}
                        </button>
                      </div>
                    </div>

                    {expandedDrill === drill.id && (
                      <div className="border-t border-slate-800 bg-slate-900/50 p-4">
                        {(drillComments[drill.id] || []).map(c => (
                          <div key={c.id} className="flex gap-3 mb-3">
                            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                              {c.author_name.charAt(0)}
                            </div>
                            <div>
                              <span className="text-sm font-medium">{c.author_name}</span>
                              <p className="text-sm text-slate-400">{c.content}</p>
                            </div>
                          </div>
                        ))}
                        <div className="flex gap-2 mt-2">
                          <input
                            type="text"
                            value={commentInputs[drill.id] || ""}
                            onChange={e => setCommentInputs(prev => ({ ...prev, [drill.id]: e.target.value }))}
                            onKeyDown={e => e.key === "Enter" && addComment(drill.id)}
                            placeholder="Add a comment..."
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                          />
                          <button
                            onClick={() => addComment(drill.id)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition-colors"
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
