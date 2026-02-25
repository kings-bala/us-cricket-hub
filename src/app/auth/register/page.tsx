"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type {
  PlayerRole,
  BattingStyle,
  BowlingStyle,
  AgeGroup,
  Region,
} from "@/types";

type Step = 1 | 2 | 3 | 4;

interface BasicInfo {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: PlayerRole;
  battingStyle: BattingStyle;
  bowlingStyle: BowlingStyle;
  ageGroup: AgeGroup;
  dateOfBirth: string;
  country: string;
  state: string;
  city: string;
  region: Region;
  phone: string;
}

interface CricPlatformInfo {
  cricClubsUrl: string;
  cricClubsTeam: string;
  cricClubsLeague: string;
  cricHeroesUrl: string;
  cricHeroesPlayerId: string;
  totalMatches: string;
  totalRuns: string;
  totalWickets: string;
  battingAverage: string;
  bowlingAverage: string;
  strikeRate: string;
  economy: string;
}

interface CPIMetrics {
  overallCPI: string;
  matchPerformance: string;
  athleticMetrics: string;
  formIndex: string;
  consistency: string;
  nationalRank: string;
  stateRank: string;
  cpiSource: string;
  cpiVerified: boolean;
}

interface CombineAssessment {
  yoYoScore: string;
  sprint20m: string;
  bowlingSpeed: string;
  batSpeed: string;
  verticalJump: string;
  fieldingEfficiency: string;
  throwAccuracy: string;
  reactionTime: string;
  assessmentDate: string;
  assessmentCenter: string;
  combineVerified: boolean;
}

const stepLabels = ["Basic Info", "CricClubs / CricHeroes", "CPI Metrics", "Combine Assessment"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [saving, setSaving] = useState(false);

  const [basic, setBasic] = useState<BasicInfo>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Batsman",
    battingStyle: "Right-hand Bat",
    bowlingStyle: "Right-arm Medium",
    ageGroup: "U15",
    dateOfBirth: "",
    country: "",
    state: "",
    city: "",
    region: "South Asia",
    phone: "",
  });

  const [cric, setCric] = useState<CricPlatformInfo>({
    cricClubsUrl: "",
    cricClubsTeam: "",
    cricClubsLeague: "",
    cricHeroesUrl: "",
    cricHeroesPlayerId: "",
    totalMatches: "",
    totalRuns: "",
    totalWickets: "",
    battingAverage: "",
    bowlingAverage: "",
    strikeRate: "",
    economy: "",
  });

  const [cpi, setCpi] = useState<CPIMetrics>({
    overallCPI: "",
    matchPerformance: "",
    athleticMetrics: "",
    formIndex: "",
    consistency: "",
    nationalRank: "",
    stateRank: "",
    cpiSource: "",
    cpiVerified: false,
  });

  const [combine, setCombine] = useState<CombineAssessment>({
    yoYoScore: "",
    sprint20m: "",
    bowlingSpeed: "",
    batSpeed: "",
    verticalJump: "",
    fieldingEfficiency: "",
    throwAccuracy: "",
    reactionTime: "",
    assessmentDate: "",
    assessmentCenter: "",
    combineVerified: false,
  });

  const [errors, setErrors] = useState<string[]>([]);

  const validateStep = (s: Step): string[] => {
    const errs: string[] = [];
    if (s === 1) {
      if (!basic.fullName.trim()) errs.push("Full name is required");
      if (!basic.email.trim()) errs.push("Email is required");
      if (!basic.password) errs.push("Password is required");
      if (basic.password.length < 6) errs.push("Password must be at least 6 characters");
      if (basic.password !== basic.confirmPassword) errs.push("Passwords do not match");
      if (!basic.country.trim()) errs.push("Country is required");
    }
    return errs;
  };

  const handleNext = () => {
    const errs = validateStep(step);
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    setErrors([]);
    if (step < 4) setStep((step + 1) as Step);
  };

  const handleBack = () => {
    setErrors([]);
    if (step > 1) setStep((step - 1) as Step);
  };

  const handleSubmit = () => {
    setSaving(true);
    const profile = { basic, cric, cpi, combine, createdAt: new Date().toISOString() };
    try {
      const existing = JSON.parse(localStorage.getItem("cricverse_profiles") || "[]");
      existing.push(profile);
      localStorage.setItem("cricverse_profiles", JSON.stringify(existing));
      localStorage.setItem(
        "cricverse_auth_user",
        JSON.stringify({
          email: basic.email,
          name: basic.fullName,
          role: "player",
          playerId: `reg_${Date.now()}`,
        })
      );
    } catch {}
    setTimeout(() => {
      router.push("/players?tab=profile");
    }, 500);
  };

  const inputClass =
    "w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors";
  const selectClass =
    "w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors";
  const labelClass = "text-sm text-slate-400 block mb-1";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center font-bold text-lg text-white mx-auto mb-4">
            CV
          </div>
          <h1 className="text-2xl font-bold text-white">Create Your Player Profile</h1>
          <p className="text-slate-400 mt-1">
            Connect your cricket data from trusted sources
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {stepLabels.map((label, i) => {
            const s = (i + 1) as Step;
            const active = step === s;
            const done = step > s;
            return (
              <div key={label} className="flex items-center gap-2">
                {i > 0 && (
                  <div
                    className={`w-8 h-px ${done ? "bg-emerald-500" : "bg-slate-700"}`}
                  />
                )}
                <button
                  onClick={() => {
                    if (done) {
                      setErrors([]);
                      setStep(s);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    active
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : done
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-pointer"
                        : "bg-slate-800/50 text-slate-500 border border-slate-700/50"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      active
                        ? "bg-emerald-500 text-white"
                        : done
                          ? "bg-emerald-500/30 text-emerald-400"
                          : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {done ? "\u2713" : s}
                  </span>
                  <span className="hidden sm:inline">{label}</span>
                </button>
              </div>
            );
          })}
        </div>

        {errors.length > 0 && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            {errors.map((e, i) => (
              <p key={i} className="text-red-400 text-sm">
                {e}
              </p>
            ))}
          </div>
        )}

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white mb-1">Basic Information</h2>
              <p className="text-sm text-slate-400 -mt-4">
                Tell us about yourself to set up your cricket profile
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={basic.fullName}
                    onChange={(e) => setBasic({ ...basic, fullName: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={basic.email}
                    onChange={(e) => setBasic({ ...basic, email: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    value={basic.password}
                    onChange={(e) => setBasic({ ...basic, password: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Re-enter password"
                    value={basic.confirmPassword}
                    onChange={(e) =>
                      setBasic({ ...basic, confirmPassword: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Player Role</label>
                  <select
                    value={basic.role}
                    onChange={(e) =>
                      setBasic({ ...basic, role: e.target.value as PlayerRole })
                    }
                    className={selectClass}
                  >
                    <option value="Batsman">Batsman</option>
                    <option value="Bowler">Bowler</option>
                    <option value="All-Rounder">All-Rounder</option>
                    <option value="Wicket-Keeper">Wicket-Keeper</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Batting Style</label>
                  <select
                    value={basic.battingStyle}
                    onChange={(e) =>
                      setBasic({
                        ...basic,
                        battingStyle: e.target.value as BattingStyle,
                      })
                    }
                    className={selectClass}
                  >
                    <option value="Right-hand Bat">Right-hand Bat</option>
                    <option value="Left-hand Bat">Left-hand Bat</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Bowling Style</label>
                  <select
                    value={basic.bowlingStyle}
                    onChange={(e) =>
                      setBasic({
                        ...basic,
                        bowlingStyle: e.target.value as BowlingStyle,
                      })
                    }
                    className={selectClass}
                  >
                    <option value="Right-arm Fast">Right-arm Fast</option>
                    <option value="Right-arm Medium">Right-arm Medium</option>
                    <option value="Left-arm Fast">Left-arm Fast</option>
                    <option value="Left-arm Medium">Left-arm Medium</option>
                    <option value="Right-arm Off-spin">Right-arm Off-spin</option>
                    <option value="Left-arm Orthodox">Left-arm Orthodox</option>
                    <option value="Left-arm Chinaman">Left-arm Chinaman</option>
                    <option value="Right-arm Leg-spin">Right-arm Leg-spin</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Age Group</label>
                  <select
                    value={basic.ageGroup}
                    onChange={(e) =>
                      setBasic({ ...basic, ageGroup: e.target.value as AgeGroup })
                    }
                    className={selectClass}
                  >
                    <option value="U13">U13</option>
                    <option value="U15">U15</option>
                    <option value="U17">U17</option>
                    <option value="U19">U19</option>
                    <option value="U21">U21</option>
                    <option value="U23">U23</option>
                    <option value="Men">Men</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Date of Birth</label>
                  <input
                    type="date"
                    value={basic.dateOfBirth}
                    onChange={(e) =>
                      setBasic({ ...basic, dateOfBirth: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={basic.phone}
                    onChange={(e) => setBasic({ ...basic, phone: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Country <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. USA, India, Australia"
                    value={basic.country}
                    onChange={(e) => setBasic({ ...basic, country: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Region</label>
                  <select
                    value={basic.region}
                    onChange={(e) =>
                      setBasic({ ...basic, region: e.target.value as Region })
                    }
                    className={selectClass}
                  >
                    <option value="South Asia">South Asia</option>
                    <option value="Oceania">Oceania</option>
                    <option value="Americas">Americas</option>
                    <option value="Caribbean">Caribbean</option>
                    <option value="Africa">Africa</option>
                    <option value="Europe">Europe</option>
                    <option value="Middle East">Middle East</option>
                    <option value="East Asia">East Asia</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>State / Province</label>
                  <input
                    type="text"
                    placeholder="e.g. California, Maharashtra"
                    value={basic.state}
                    onChange={(e) => setBasic({ ...basic, state: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input
                    type="text"
                    placeholder="e.g. San Jose, Mumbai"
                    value={basic.city}
                    onChange={(e) => setBasic({ ...basic, city: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white mb-1">
                CricClubs & CricHeroes
              </h2>
              <p className="text-sm text-slate-400 -mt-4">
                Link your existing cricket platform profiles to import verified stats
              </p>

              <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-400">Trusted Source Integration</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Stats imported from CricClubs and CricHeroes are automatically verified and marked as trusted on your profile. Scouts and coaches can see these are real match stats.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-slate-700/50 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded bg-orange-500/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-orange-400">CC</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white">CricClubs</h3>
                  <span className="text-xs bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/20">
                    cricclubs.com
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>CricClubs Profile URL</label>
                    <input
                      type="url"
                      placeholder="https://cricclubs.com/player/..."
                      value={cric.cricClubsUrl}
                      onChange={(e) => setCric({ ...cric, cricClubsUrl: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Team Name</label>
                    <input
                      type="text"
                      placeholder="Your CricClubs team"
                      value={cric.cricClubsTeam}
                      onChange={(e) => setCric({ ...cric, cricClubsTeam: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>League / Tournament</label>
                    <input
                      type="text"
                      placeholder="e.g. NorCal Cricket Association, USCA T20"
                      value={cric.cricClubsLeague}
                      onChange={(e) =>
                        setCric({ ...cric, cricClubsLeague: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              <div className="border border-slate-700/50 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded bg-green-500/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-green-400">CH</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white">CricHeroes</h3>
                  <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">
                    cricheroes.com
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>CricHeroes Profile URL</label>
                    <input
                      type="url"
                      placeholder="https://cricheroes.com/player/..."
                      value={cric.cricHeroesUrl}
                      onChange={(e) =>
                        setCric({ ...cric, cricHeroesUrl: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>CricHeroes Player ID</label>
                    <input
                      type="text"
                      placeholder="Your CricHeroes player ID"
                      value={cric.cricHeroesPlayerId}
                      onChange={(e) =>
                        setCric({ ...cric, cricHeroesPlayerId: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              <div className="border border-slate-700/50 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white">Match Statistics</h3>
                <p className="text-xs text-slate-500 -mt-3">
                  Enter your career stats or they will be auto-imported from linked platforms
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className={labelClass}>Total Matches</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={cric.totalMatches}
                      onChange={(e) =>
                        setCric({ ...cric, totalMatches: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Total Runs</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={cric.totalRuns}
                      onChange={(e) => setCric({ ...cric, totalRuns: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Total Wickets</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={cric.totalWickets}
                      onChange={(e) =>
                        setCric({ ...cric, totalWickets: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Batting Average</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={cric.battingAverage}
                      onChange={(e) =>
                        setCric({ ...cric, battingAverage: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Bowling Average</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={cric.bowlingAverage}
                      onChange={(e) =>
                        setCric({ ...cric, bowlingAverage: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Strike Rate</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={cric.strikeRate}
                      onChange={(e) =>
                        setCric({ ...cric, strikeRate: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Economy Rate</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={cric.economy}
                      onChange={(e) => setCric({ ...cric, economy: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white mb-1">
                CPI (Cricket Performance Index)
              </h2>
              <p className="text-sm text-slate-400 -mt-4">
                Connect your CPI scores from trusted assessment providers
              </p>

              <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-400">What is CPI?</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Cricket Performance Index is a composite score (0-100) that combines match performance, athletic metrics, form consistency, and fitness data. Scouts and franchise owners use CPI to evaluate talent objectively.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>CPI Source / Provider</label>
                  <input
                    type="text"
                    placeholder="e.g. USCA, Cricket Australia, BCCI"
                    value={cpi.cpiSource}
                    onChange={(e) => setCpi({ ...cpi, cpiSource: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white cursor-pointer w-full">
                    <input
                      type="checkbox"
                      checked={cpi.cpiVerified}
                      onChange={(e) =>
                        setCpi({ ...cpi, cpiVerified: e.target.checked })
                      }
                      className="rounded border-slate-600"
                    />
                    Verified by trusted source
                  </label>
                </div>
              </div>

              <div className="border border-slate-700/50 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white">CPI Scores</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="col-span-2 md:col-span-4">
                    <label className={labelClass}>Overall CPI Score (0-100)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="e.g. 78"
                      value={cpi.overallCPI}
                      onChange={(e) =>
                        setCpi({ ...cpi, overallCPI: e.target.value })
                      }
                      className={inputClass}
                    />
                    {cpi.overallCPI && (
                      <div className="mt-2">
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              Number(cpi.overallCPI) >= 80
                                ? "bg-emerald-500"
                                : Number(cpi.overallCPI) >= 60
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            }`}
                            style={{
                              width: `${Math.min(100, Math.max(0, Number(cpi.overallCPI)))}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Match Performance</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0-100"
                      value={cpi.matchPerformance}
                      onChange={(e) =>
                        setCpi({ ...cpi, matchPerformance: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Athletic Metrics</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0-100"
                      value={cpi.athleticMetrics}
                      onChange={(e) =>
                        setCpi({ ...cpi, athleticMetrics: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Form Index</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0-100"
                      value={cpi.formIndex}
                      onChange={(e) =>
                        setCpi({ ...cpi, formIndex: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Consistency</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0-100"
                      value={cpi.consistency}
                      onChange={(e) =>
                        setCpi({ ...cpi, consistency: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              <div className="border border-slate-700/50 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white">Rankings</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>National Rank</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 42"
                      value={cpi.nationalRank}
                      onChange={(e) =>
                        setCpi({ ...cpi, nationalRank: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>State / Province Rank</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 5"
                      value={cpi.stateRank}
                      onChange={(e) =>
                        setCpi({ ...cpi, stateRank: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white mb-1">
                Combine Assessment
              </h2>
              <p className="text-sm text-slate-400 -mt-4">
                Enter your latest combine / athletic assessment results
              </p>

              <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-amber-400">Verified Combine Data</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Assessment results from certified combine centers are marked as verified on your profile. This includes Yo-Yo tests, sprint times, bowling speed, bat speed, and more.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Assessment Center</label>
                  <input
                    type="text"
                    placeholder="e.g. USCA Combine, NCA Bangalore"
                    value={combine.assessmentCenter}
                    onChange={(e) =>
                      setCombine({ ...combine, assessmentCenter: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Assessment Date</label>
                  <input
                    type="date"
                    value={combine.assessmentDate}
                    onChange={(e) =>
                      setCombine({ ...combine, assessmentDate: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={combine.combineVerified}
                  onChange={(e) =>
                    setCombine({ ...combine, combineVerified: e.target.checked })
                  }
                  className="rounded border-slate-600"
                />
                Results verified by assessment center
              </label>

              <div className="border border-slate-700/50 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white">Athletic Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className={labelClass}>Yo-Yo Score (/20)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="20"
                      placeholder="e.g. 18.5"
                      value={combine.yoYoScore}
                      onChange={(e) =>
                        setCombine({ ...combine, yoYoScore: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>20m Sprint (sec)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g. 2.95"
                      value={combine.sprint20m}
                      onChange={(e) =>
                        setCombine({ ...combine, sprint20m: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Bowling Speed (km/h)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 130"
                      value={combine.bowlingSpeed}
                      onChange={(e) =>
                        setCombine({ ...combine, bowlingSpeed: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Bat Speed (km/h)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 105"
                      value={combine.batSpeed}
                      onChange={(e) =>
                        setCombine({ ...combine, batSpeed: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Vertical Jump (cm)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 55"
                      value={combine.verticalJump}
                      onChange={(e) =>
                        setCombine({ ...combine, verticalJump: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Fielding Efficiency (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="e.g. 82"
                      value={combine.fieldingEfficiency}
                      onChange={(e) =>
                        setCombine({
                          ...combine,
                          fieldingEfficiency: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Throw Accuracy (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="e.g. 78"
                      value={combine.throwAccuracy}
                      onChange={(e) =>
                        setCombine({ ...combine, throwAccuracy: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Reaction Time (sec)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g. 0.24"
                      value={combine.reactionTime}
                      onChange={(e) =>
                        setCombine({ ...combine, reactionTime: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700/50">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2"
              >
                Back
              </button>
            ) : (
              <Link
                href="/auth"
                className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2"
              >
                Already have an account? Sign in
              </Link>
            )}

            {step < 4 ? (
              <button
                onClick={handleNext}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors"
              >
                {saving ? "Creating Profile..." : "Create Profile"}
              </button>
            )}
          </div>

          <p className="text-xs text-slate-600 text-center mt-4">
            Steps 2-4 are optional. You can skip them now and fill in later from your profile.
          </p>
        </div>
      </div>
    </div>
  );
}
