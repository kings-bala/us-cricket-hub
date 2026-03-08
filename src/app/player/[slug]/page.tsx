"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { players } from "@/data/mock";
import { getProfileBySlug, playerProfiles } from "@/data/profiles";
import type { Player, PlayerProfile } from "@/types";

const ProfilePdfCV = dynamic(() => import("@/components/profile/ProfilePdfCV"), { ssr: false });
const VideoRecorder = dynamic(() => import("@/components/profile/VideoRecorder"), { ssr: false });
const VideoIntroPlayer = dynamic(() => import("@/components/profile/VideoIntroPlayer"), { ssr: false });

function StatBar({ label, value, max, suffix }: { label: string; value: number; max: number; suffix?: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-400 w-20 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-white w-14 text-right">{value}{suffix}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
      <span className="w-6 h-px bg-emerald-500" />
      {children}
    </h3>
  );
}

export default function PlayerProfilePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [showRecorder, setShowRecorder] = useState(false);
  const [copied, setCopied] = useState(false);

  const profile = useMemo(() => getProfileBySlug(slug), [slug]);
  const player = useMemo(() => {
    if (!profile) return null;
    return players.find(p => p.id === profile.playerId) || null;
  }, [profile]);

  if (!profile || !player) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-white">Player Not Found</h1>
        <p className="text-slate-400">The profile you are looking for does not exist.</p>
        <Link href="/" className="text-emerald-400 hover:text-emerald-300 text-sm">Back to Home</Link>
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : `https://cricverse360.com/player/${slug}`;

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: `${player!.name} - Cricket Profile`, url: shareUrl });
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const initials = player.name.split(" ").map(n => n[0]).join("");
  const age = player.age;

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-blue-900/10" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.06) 0%, transparent 60%)" }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-12">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/" className="text-slate-500 hover:text-emerald-400 text-xs transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            <span className="text-emerald-400 text-xs">{player.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <div className="glass-card rounded-2xl p-6 sticky top-24">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-600/30 to-blue-600/20 border-2 border-emerald-500/40 flex items-center justify-center mb-4">
                    <span className="text-4xl font-bold text-emerald-400">{initials}</span>
                  </div>
                  <h1 className="text-2xl font-bold text-white text-center">{player.name}</h1>
                  <p className="text-emerald-400 text-sm font-semibold mt-1">{player.role}</p>
                  <p className="text-slate-400 text-xs mt-1">{player.city}, {player.country}</p>
                  {player.verified && (
                    <span className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-semibold">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      Verified
                    </span>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Age</span><span className="text-white">{age}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Age Group</span><span className="text-white">{player.ageGroup}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Batting</span><span className="text-white">{player.battingStyle}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Bowling</span><span className="text-white">{player.bowlingStyle}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Height</span><span className="text-white">{profile.height}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Weight</span><span className="text-white">{profile.weight}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Nationality</span><span className="text-white">{profile.nationality}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Languages</span><span className="text-white">{profile.languages.join(", ")}</span>
                  </div>
                </div>

                <div className="section-divider mb-4" />

                <div className="flex flex-col gap-2">
                  <ProfilePdfCV player={player} profile={profile} />
                  <button
                    onClick={() => setShowRecorder(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-600 hover:border-emerald-500 text-white font-semibold text-sm transition-all"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                    Record Video CV
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-600 hover:border-blue-500 text-slate-300 hover:text-white text-sm transition-all"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                    {copied ? "Link Copied!" : "Share Profile"}
                  </button>
                </div>

                {(profile.socialLinks.twitter || profile.socialLinks.instagram || profile.socialLinks.youtube) && (
                  <>
                    <div className="section-divider my-4" />
                    <div className="flex justify-center gap-3">
                      {profile.socialLinks.twitter && (
                        <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all text-xs">X</a>
                      )}
                      {profile.socialLinks.instagram && (
                        <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all text-xs">IG</a>
                      )}
                      {profile.socialLinks.youtube && (
                        <a href={profile.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all text-xs">YT</a>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="glass-card rounded-2xl p-6 animate-fade-up">
                <SectionTitle>About</SectionTitle>
                <p className="text-slate-300 text-sm leading-relaxed">{profile.bio}</p>
              </div>

              <div className="glass-card rounded-2xl p-6 animate-fade-up-delay">
                <SectionTitle>Career Statistics</SectionTitle>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Matches", value: player.stats.matches },
                    { label: "Runs", value: player.stats.runs },
                    { label: "Wickets", value: player.stats.wickets },
                    { label: "Catches", value: player.stats.catches },
                  ].map(s => (
                    <div key={s.label} className="bg-slate-800/40 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-white">{s.value}</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <StatBar label="Bat Avg" value={player.stats.battingAverage} max={60} />
                  <StatBar label="Strike Rate" value={player.stats.strikeRate} max={200} />
                  <StatBar label="Bowl Avg" value={player.stats.bowlingAverage} max={40} />
                  <StatBar label="Economy" value={player.stats.economy} max={10} />
                  <StatBar label="50s / 100s" value={player.stats.fifties + player.stats.hundreds} max={20} />
                </div>
              </div>

              {player.fitnessData && (
                <div className="glass-card rounded-2xl p-6 animate-fade-up-delay-2">
                  <SectionTitle>Fitness & Athletic Data</SectionTitle>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: "Sprint", value: `${player.fitnessData.sprintSpeed}s`, sub: "20m" },
                      { label: "Yo-Yo", value: String(player.fitnessData.yoYoTest), sub: "Level" },
                      { label: "Throw", value: `${player.fitnessData.throwDistance}m`, sub: "Distance" },
                      { label: "Beep", value: String(player.fitnessData.beepTestLevel), sub: "Level" },
                    ].map(f => (
                      <div key={f.label} className="bg-slate-800/40 rounded-xl p-4 text-center">
                        <div className="text-xl font-bold text-white">{f.value}</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">{f.label}</div>
                        <div className="text-[9px] text-slate-500">{f.sub}</div>
                      </div>
                    ))}
                    {player.fitnessData.bowlingSpeed && (
                      <div className="bg-slate-800/40 rounded-xl p-4 text-center">
                        <div className="text-xl font-bold text-white">{player.fitnessData.bowlingSpeed} km/h</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Bowl Speed</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="glass-card rounded-2xl p-6">
                <SectionTitle>Experience</SectionTitle>
                <div className="space-y-4">
                  {profile.experience.map((exp, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-1 rounded-full bg-emerald-500/30 shrink-0" />
                      <div>
                        <div className="text-white font-semibold text-sm">{exp.team}</div>
                        <div className="text-emerald-400 text-xs">{exp.role} &bull; {exp.period}</div>
                        <div className="text-slate-400 text-xs mt-1">{exp.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <SectionTitle>Education</SectionTitle>
                <div className="space-y-3">
                  {profile.education.map((edu, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm">{edu.institution}</div>
                        <div className="text-slate-400 text-xs">{edu.degree} &bull; {edu.year}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {player.achievements.length > 0 && (
                <div className="glass-card rounded-2xl p-6">
                  <SectionTitle>Achievements</SectionTitle>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {player.achievements.map((a, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-emerald-400 mt-0.5 shrink-0">&#9679;</span>
                        <span className="text-slate-300">{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {profile.previousClubs.length > 0 && (
                <div className="glass-card rounded-2xl p-6">
                  <SectionTitle>Previous Clubs</SectionTitle>
                  <div className="flex flex-wrap gap-2">
                    {profile.previousClubs.map((club, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700 text-slate-300 text-xs">{club}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="glass-card rounded-2xl p-6">
                <SectionTitle>Video Introduction</SectionTitle>
                <VideoIntroPlayer player={player} />
              </div>

              {profile.testimonials.length > 0 && (
                <div className="glass-card rounded-2xl p-6">
                  <SectionTitle>Testimonials</SectionTitle>
                  <div className="space-y-4">
                    {profile.testimonials.map((t, i) => (
                      <div key={i} className="bg-slate-800/30 rounded-xl p-4 border-l-2 border-emerald-500/40">
                        <p className="text-slate-300 text-sm italic">&ldquo;{t.quote}&rdquo;</p>
                        <div className="mt-2">
                          <span className="text-white text-xs font-semibold">{t.author}</span>
                          <span className="text-slate-500 text-xs"> &bull; {t.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {profile.references.length > 0 && (
                <div className="glass-card rounded-2xl p-6">
                  <SectionTitle>References</SectionTitle>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {profile.references.map((ref, i) => (
                      <div key={i} className="bg-slate-800/30 rounded-xl p-4">
                        <div className="text-white text-sm font-semibold">{ref.name}</div>
                        <div className="text-slate-400 text-xs mt-1">{ref.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {player.highlights.length > 0 && (
                <div className="glass-card rounded-2xl p-6">
                  <SectionTitle>Video Highlights</SectionTitle>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {player.highlights.map(h => (
                      <div key={h.id} className="bg-slate-800/40 rounded-xl p-3 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#10b981"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                        </div>
                        <div className="min-w-0">
                          <div className="text-white text-xs font-semibold truncate">{h.title}</div>
                          <div className="text-slate-500 text-[10px]">{h.event} &bull; {h.duration}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-600 text-xs">Profile powered by <span className="text-emerald-400 font-semibold">CricVerse360</span></p>
            <div className="mt-3 flex justify-center gap-2">
              {playerProfiles.filter(p => p.slug !== slug).map(p => {
                const pl = players.find(x => x.id === p.playerId);
                return pl ? (
                  <Link key={p.slug} href={`/player/${p.slug}`} className="text-xs text-slate-500 hover:text-emerald-400 transition-colors px-3 py-1 rounded-full border border-slate-800 hover:border-emerald-500/30">
                    {pl.name}
                  </Link>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </div>

      {showRecorder && <VideoRecorder player={player} profile={profile} onClose={() => setShowRecorder(false)} />}
    </div>
  );
}
