"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { apiGet, apiPost, apiPut } from "@/lib/api";

interface PlayerProfile {
  id: string;
  username: string;
  age: number | null;
  location: string;
  role: string;
  batting_style: string;
  bowling_style: string;
  academy: string;
  bio: string;
  public_profile_enabled: boolean;
  best_score: number;
}

export default function ProfilePage() {
  const { user, tokens, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("batsman");
  const [battingStyle, setBattingStyle] = useState("");
  const [bowlingStyle, setBowlingStyle] = useState("");
  const [academy, setAcademy] = useState("");
  const [bio, setBio] = useState("");
  const [publicProfile, setPublicProfile] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/auth"); return; }
    fetchProfile();
  }, [user, authLoading]);

  const fetchProfile = async () => {
    try {
      const data = await apiGet<PlayerProfile>("/player-profiles", tokens?.accessToken);
      setProfile(data);
      setUsername(data.username);
      setAge(data.age?.toString() || "");
      setLocation(data.location);
      setRole(data.role);
      setBattingStyle(data.batting_style);
      setBowlingStyle(data.bowling_style);
      setAcademy(data.academy);
      setBio(data.bio);
      setPublicProfile(data.public_profile_enabled);
    } catch {
      setIsNew(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      if (isNew) {
        if (!username.trim()) { setError("Username is required"); setSaving(false); return; }
        await apiPost("/player-profiles", {
          username: username.toLowerCase().replace(/[^a-z0-9_-]/g, ""),
          age: age ? parseInt(age) : null,
          location,
          role,
          battingStyle,
          bowlingStyle,
          academy,
          bio,
        }, tokens?.accessToken);
        setSuccess("Profile created! You have 1 free video analysis.");
        setIsNew(false);
        await fetchProfile();
      } else {
        await apiPut("/player-profiles", {
          age: age ? parseInt(age) : null,
          location,
          role,
          battingStyle,
          bowlingStyle,
          academy,
          bio,
          publicProfileEnabled: publicProfile,
        }, tokens?.accessToken);
        setSuccess("Profile updated!");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isNew ? "Create Your Player Profile" : "Edit Player Profile"}
          </h1>
          <p className="text-slate-400 mt-1">
            {isNew ? "Set up your profile to start analyzing your game" : "Update your profile information"}
          </p>
        </div>
        {profile && (
          <Link
            href={`/player/${profile.username}`}
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            View Public Profile
          </Link>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 space-y-5">
        {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</p>}
        {success && <p className="text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">{success}</p>}

        {isNew && (
          <div>
            <label className="text-sm text-slate-400 block mb-1">Username *</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. virat_kohli"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              required
            />
            <p className="text-xs text-slate-500 mt-1">Your public profile URL: cricverse360.com/player/{username || "username"}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-400 block mb-1">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 22"
              min={10}
              max={60}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Mumbai, India"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-400 block mb-1">Player Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="batsman">Batsman</option>
            <option value="bowler">Bowler</option>
            <option value="all_rounder">All-Rounder</option>
            <option value="wicket_keeper">Wicket-Keeper</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-400 block mb-1">Batting Style</label>
            <select
              value={battingStyle}
              onChange={(e) => setBattingStyle(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">Select...</option>
              <option value="right_hand">Right-Hand</option>
              <option value="left_hand">Left-Hand</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-1">Bowling Style</label>
            <select
              value={bowlingStyle}
              onChange={(e) => setBowlingStyle(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">Select...</option>
              <option value="right_arm_fast">Right-Arm Fast</option>
              <option value="left_arm_fast">Left-Arm Fast</option>
              <option value="right_arm_medium">Right-Arm Medium</option>
              <option value="left_arm_medium">Left-Arm Medium</option>
              <option value="off_spin">Off Spin</option>
              <option value="leg_spin">Leg Spin</option>
              <option value="left_arm_spin">Left-Arm Spin</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-400 block mb-1">Academy / Team</label>
          <input
            type="text"
            value={academy}
            onChange={(e) => setAcademy(e.target.value)}
            placeholder="e.g. Mumbai Cricket Academy"
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="text-sm text-slate-400 block mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about your cricket journey..."
            rows={3}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        {!isNew && (
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={publicProfile}
              onChange={(e) => setPublicProfile(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-sm text-slate-300">Make my profile public</span>
          </label>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-2.5 rounded-lg font-semibold transition-colors"
        >
          {saving ? "Saving..." : isNew ? "Create Profile" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
