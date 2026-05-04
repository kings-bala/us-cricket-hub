import Link from "next/link";
import type { Metadata } from "next";
import PageViewTracker from "@/components/PageViewTracker";

export const metadata: Metadata = {
  title: "Sample AI Cricket Analysis | CricVerse360",
  description:
    "See a full AI-powered batting analysis report. Understand how CricVerse360 evaluates technique, provides coaching feedback, and helps you improve.",
};

const player = {
  name: "Sample Player",
  age: 22,
  role: "Right-Hand Top-Order Batsman",
  location: "Example Location",
  battingStyle: "Right-Hand Bat",
  bowlingStyle: "Right-Arm Medium",
  academy: "Sample Academy",
  analysis_type: "batting",
  overall_score: 78,
  confidence_score: 85,
};

const report = {
  summary:
    "This player shows a strong batting foundation with excellent head position and natural balance at the crease. Back-foot play is instinctive and powerful. However, front-foot commitment on drives is the biggest weakness, causing mistimed shots and reduced power on fuller deliveries. Grip pressure from the bottom hand is limiting the ability to play late and adjust against both pace and spin.",
  video_quality_notes:
    "Good side-on angle with adequate lighting. Camera distance allows full body tracking. Frame rate suitable for slow-motion analysis.",
  strengths: [
    "Excellent head position -- eyes stay level through the shot, textbook technique that most club players lack",
    "Strong back-foot play with natural weight transfer and powerful hip rotation on pull and cut shots",
    "Clean bat swing with a straight downswing path and consistent follow-through on defensive and attacking shots",
  ],
  weaknesses: [
    "Front foot not reaching to the pitch of the ball on drives -- stride falls 6-8 inches short, causing mistimed contact",
    "Bottom hand grip too tight, limiting wrist play and the ability to adjust shot direction late against pace",
    "Weight transfer delayed on front-foot shots -- body stays back too long, reducing power and timing on fuller deliveries",
  ],
  timestamp_observations: [
    {
      timestamp: "00:03",
      observation: "Initial stance setup -- weight on balls of feet, bat grounded behind back toe",
      coaching_note: "Good base. Widen stance by 2-3 inches for better stability against pace bowling.",
    },
    {
      timestamp: "00:07",
      observation: "Front foot drive attempted -- foot plants 8 inches short of the ball's pitch",
      coaching_note: "This is the #1 issue. Commit to the front foot earlier. Stride should reach within 6 inches of pitch.",
    },
    {
      timestamp: "00:12",
      observation: "Back foot pull shot -- excellent weight transfer and hip rotation",
      coaching_note: "Textbook pull shot. Natural power through the hips. This is the player's strongest shot.",
    },
    {
      timestamp: "00:18",
      observation: "Defensive block -- head perfectly still, bat presented close to pad",
      coaching_note: "Excellent defensive technique. Maintain this head stillness on attacking shots for better timing.",
    },
    {
      timestamp: "00:24",
      observation: "Cover drive -- bat face opens slightly at contact, ball goes through point instead of cover",
      coaching_note: "Front elbow dropping. Keep it higher through the shot to maintain a straighter bat face.",
    },
  ],
  technical_feedback: {
    stance:
      "Solid setup. Weight evenly distributed on balls of feet. Bat grounded behind back toe. Suggestion: widen stance by 2-3 inches for better coverage against pace bowling. Score: 82/100",
    head_position:
      "Excellent. Eyes level through most shots. Slight tendency to look up early on drives. Focus on watching the ball onto the bat on front-foot shots. Score: 88/100",
    footwork:
      "Back-foot play is strong and instinctive. Front-foot movement is hesitant and short. Need to commit earlier to driving. Initial trigger movement is good but follow-through stride is insufficient. Score: 65/100",
    balance:
      "Good overall balance on back-foot and defensive shots. Slight tendency to fall toward off side on cut shots. Weight stays centered on defensive shots. Score: 76/100",
    bat_swing:
      "Clean downswing with a straight path. Bat face alignment is consistent. Bottom hand dominates slightly, reducing wrist flexibility for late adjustments against pace and spin. Score: 80/100",
    timing:
      "Timing is excellent on back-foot shots with natural punch. Front-foot timing needs significant improvement -- bat arrives late on fuller deliveries, especially against pace over 130 km/h. Score: 72/100",
    follow_through:
      "Clean follow-through on most shots. High elbow maintained well. Could extend arms more on front-foot drives for better power generation through the line. Score: 79/100",
  },
  recommended_drills: [
    {
      name: "Front Foot Commitment Drill",
      purpose: "Fix the #1 weakness: short front-foot stride",
      instructions:
        "Place a cone 3 feet in front of your crease. Practice stepping past the cone on every drive. Start without a ball (50 reps daily), then with throwdowns (30 balls, 3x/week). Focus on transferring weight smoothly while keeping head still.",
      duration: "15 min/day",
      frequency: "Daily for 2 weeks",
    },
    {
      name: "Soft Hands Grip Drill",
      purpose: "Loosen bottom-hand grip for better wrist play and late adjustment",
      instructions:
        "Face throwdowns holding the bat with only your top hand for 10 balls. Then add the bottom hand loosely (grip pressure 3/10). Focus on guiding the ball rather than hitting. This builds top-hand dominance and feel.",
      duration: "10 min/session",
      frequency: "3x per week",
    },
    {
      name: "Weight Transfer Balance Board",
      purpose: "Improve front-foot weight transfer and core stability",
      instructions:
        "Stand on a balance board in your batting stance. Practice front-foot drives in slow motion, focusing on smooth weight shift from back to front. Start with 2 minutes, build to 5 minutes. Translates directly to better in-game balance.",
      duration: "5 min/day",
      frequency: "Daily",
    },
  ],
  improvement_plan: [
    { day: "Day 1-2", focus: "Front Foot Commitment", detail: "Shadow drill only. 50 front-foot strides past the cone. No ball needed. Build muscle memory for the longer stride." },
    { day: "Day 3-4", focus: "Soft Hands + Commitment", detail: "Combine grip drill (10 min) with front-foot drill (15 min). Start facing throwdowns with loose bottom hand on drives." },
    { day: "Day 5", focus: "Net Session: Drives Only", detail: "Full net session focusing only on front-foot drives. Film yourself. Compare stride length to Day 1 footage." },
    { day: "Day 6", focus: "Balance + Recovery", detail: "Balance board work (5 min). Light stretching. Review your Day 5 footage and note 3 improvements." },
    { day: "Day 7", focus: "Upload New Video", detail: "Record a new batting session with the same camera angle. Upload to CricVerse360 for AI comparison. Track your score improvement." },
  ],
  fix_first: {
    title: "What to Fix First",
    issue: "Front-foot balance is reducing shot power and causing mistimed drives.",
    explanation: "The front foot consistently lands 6-8 inches short of the ball's pitch. This means drives are played with weight still on the back foot, which reduces power by ~30% and makes timing inconsistent. On 4 of 6 front-foot shots in this video, the ball was hit off the lower half of the bat.",
    fix: "Fix this first to immediately improve timing, power, and control on front-foot shots. The Front Foot Commitment Drill (above) targets this directly.",
    impact: "Expected score improvement: 78 to 85+ within 2 weeks of consistent practice.",
  },
  disclaimer:
    "This AI analysis is for training guidance only and is not a professional scouting or medical assessment. Results are based on visible technique and may not capture all aspects of performance.",
};

function ScoreCircle({ score, size = "lg" }: { score: number; size?: "sm" | "lg" }) {
  const color = score >= 75 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-red-400";
  const border = score >= 75 ? "border-emerald-500" : score >= 60 ? "border-amber-500" : "border-red-500";
  const bg = score >= 75 ? "from-emerald-500/20" : score >= 60 ? "from-amber-500/20" : "from-red-500/20";
  const dim = size === "lg" ? "w-32 h-32" : "w-20 h-20";
  const textSize = size === "lg" ? "text-5xl" : "text-2xl";
  return (
    <div className={`${dim} rounded-full bg-gradient-to-br ${bg} to-slate-900/50 border-4 ${border} flex items-center justify-center shrink-0`}>
      <div className="text-center">
        <span className={`${textSize} font-bold ${color}`}>{score}</span>
        <span className="block text-xs text-slate-400">/100</span>
      </div>
    </div>
  );
}

function CTASection({ variant = "primary" }: { variant?: "primary" | "mid" | "bottom" }) {
  const headings: Record<string, string> = {
    primary: "Get Your Cricket Score Free",
    mid: "See What Your Coach Might Be Missing",
    bottom: "Ready to Improve Your Game?",
  };
  const subtexts: Record<string, string> = {
    primary: "Upload your batting or bowling video and get a personalized AI report like this one in minutes.",
    mid: "AI catches technique details that the human eye misses. Get objective, data-driven feedback on every shot.",
    bottom: "Upload your first video and get your score completely free. No commitment required.",
  };
  return (
    <div className="rounded-2xl p-8 md:p-10 text-center bg-gradient-to-r from-emerald-900/60 to-blue-900/60 border border-emerald-500/30">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{headings[variant]}</h2>
      <p className="text-slate-300 mb-6 max-w-lg mx-auto">{subtexts[variant]}</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/analyze"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-full font-bold transition-colors text-lg shadow-lg shadow-emerald-500/25"
        >
          Upload Your Video Free
        </Link>
        <Link
          href="/pricing"
          className="bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-full font-semibold border border-white/20 transition-colors"
        >
          View Pricing
        </Link>
      </div>
      <p className="text-xs text-slate-500 mt-4">No credit card required. First analysis is free.</p>
    </div>
  );
}

export default function SampleAnalysisPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <PageViewTracker event="sample_analysis_viewed" />

      {/* Top CTA */}
      <CTASection variant="primary" />

      {/* Sample Report Banner */}
      <div className="mt-10 mb-4 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 text-center">
        <p className="text-sm text-amber-400 font-semibold">This is a sample report</p>
        <p className="text-xs text-amber-400/70">Upload your own video to get a personalized analysis</p>
      </div>

      {/* Badge Row */}
      <div className="mb-6 flex items-center gap-3 flex-wrap">
        <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 font-semibold">Sample Report</span>
        <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400">Confidence: {player.confidence_score}%</span>
        <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-400">Powered by Gemini AI</span>
        <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-400">Full Premium Report</span>
      </div>

      {/* Video Source Indicator */}
      <div className="mb-10">
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 flex flex-col items-center justify-center">
          <svg className="w-16 h-16 text-emerald-500/60 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className="text-white font-semibold text-lg mb-1">Batting Video Analyzed</p>
          <p className="text-slate-400 text-sm">Side-on angle &middot; 45 seconds &middot; Outdoor nets</p>
          <p className="text-xs text-slate-500 mt-3">AI analyzed stance, footwork, backlift, shot execution, and follow-through</p>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">Sample cricket batting video analyzed by CricVerse360 AI</p>
      </div>

      {/* Player Profile Card */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl p-6 md:p-8 mb-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
          <ScoreCircle score={player.overall_score} />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{player.name}</h1>
            <p className="text-slate-400 mb-3">{player.role}</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
              <span className="text-xs bg-slate-700/80 text-slate-300 px-2.5 py-1 rounded-full">{player.age} years old</span>
              <span className="text-xs bg-slate-700/80 text-slate-300 px-2.5 py-1 rounded-full">{player.location}</span>
              <span className="text-xs bg-slate-700/80 text-slate-300 px-2.5 py-1 rounded-full">{player.battingStyle}</span>
              <span className="text-xs bg-slate-700/80 text-slate-300 px-2.5 py-1 rounded-full">{player.bowlingStyle}</span>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full">{player.academy}</span>
            </div>
            <p className="text-emerald-400 font-semibold text-sm capitalize mb-4">{player.analysis_type} Analysis</p>
            <p className="text-slate-300 leading-relaxed">{report.summary}</p>
          </div>
        </div>
      </div>

      {/* Video Quality */}
      <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 mb-10 flex items-start gap-3">
        <svg className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <div>
          <p className="text-sm font-medium text-white mb-0.5">Video Quality Assessment</p>
          <p className="text-sm text-slate-400">{report.video_quality_notes}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: "Overall Score", value: `${player.overall_score}`, suffix: "/100", color: "text-emerald-400" },
          { label: "AI Confidence", value: `${player.confidence_score}`, suffix: "%", color: "text-blue-400" },
          { label: "Strengths Found", value: `${report.strengths.length}`, suffix: "", color: "text-emerald-400" },
          { label: "Issues Found", value: `${report.weaknesses.length}`, suffix: "", color: "text-amber-400" },
          { label: "Timestamps Analyzed", value: `${report.timestamp_observations.length}`, suffix: "", color: "text-blue-400" },
          { label: "Drills Suggested", value: `${report.recommended_drills.length}`, suffix: "", color: "text-purple-400" },
          { label: "Technical Areas", value: `${Object.keys(report.technical_feedback).length}`, suffix: "", color: "text-cyan-400" },
          { label: "Day Improvement Plan", value: "7", suffix: "", color: "text-pink-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
              <span className="text-sm text-slate-400">{stat.suffix}</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-lg font-bold text-emerald-400">Strengths ({report.strengths.length})</h2>
          </div>
          <ul className="space-y-3">
            {report.strengths.map((s) => (
              <li key={s} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center mt-0.5 shrink-0">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                </span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-lg font-bold text-amber-400">Areas to Fix ({report.weaknesses.length})</h2>
          </div>
          <ul className="space-y-3">
            {report.weaknesses.map((w) => (
              <li key={w} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center mt-0.5 shrink-0">
                  <span className="w-2 h-2 bg-amber-400 rounded-full" />
                </span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* FIX FIRST -- Before/After Framing */}
      <div className="bg-gradient-to-br from-red-900/30 to-amber-900/20 border border-red-500/30 rounded-2xl p-6 md:p-8 mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">{report.fix_first.title}</h2>
        </div>
        <div className="bg-slate-900/60 rounded-xl p-5 mb-4 border border-slate-700/50">
          <p className="text-red-400 font-semibold text-lg mb-2">Main issue: {report.fix_first.issue}</p>
          <p className="text-slate-300 text-sm leading-relaxed">{report.fix_first.explanation}</p>
        </div>
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
          </svg>
          <div>
            <p className="text-emerald-400 font-semibold text-sm">{report.fix_first.fix}</p>
            <p className="text-amber-400 text-sm mt-2 font-medium">{report.fix_first.impact}</p>
          </div>
        </div>
      </div>

      {/* Mid-page CTA */}
      <div className="mb-12">
        <CTASection variant="mid" />
      </div>

      {/* Timestamp Observations */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-12">
        <div className="flex items-center gap-2 mb-6">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-white">Timestamp Observations ({report.timestamp_observations.length})</h2>
        </div>
        <div className="space-y-5">
          {report.timestamp_observations.map((obs, i) => (
            <div key={i} className="flex gap-4 group">
              <div className="flex flex-col items-center">
                <span className="text-emerald-400 font-mono text-sm font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                  {obs.timestamp}
                </span>
                {i < report.timestamp_observations.length - 1 && (
                  <div className="w-px h-full bg-slate-700 mt-2" />
                )}
              </div>
              <div className="pb-4">
                <p className="text-sm text-slate-200 font-medium">{obs.observation}</p>
                <p className="text-xs text-blue-400 mt-1.5 flex items-start gap-1.5">
                  <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  {obs.coaching_note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Breakdown */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-12">
        <h2 className="text-xl font-bold text-white mb-6">Full Technical Breakdown</h2>
        <div className="grid gap-5">
          {Object.entries(report.technical_feedback).map(([key, value]) => (
            <div key={key} className="border-l-2 border-emerald-500/40 pl-4">
              <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-1.5">
                {key.replace(/_/g, " ")}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Drills */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <h2 className="text-xl font-bold text-white">Recommended Drills ({report.recommended_drills.length})</h2>
        </div>
        <div className="grid gap-4">
          {report.recommended_drills.map((drill, i) => (
            <div key={drill.name} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-purple-500/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0 text-purple-400 font-bold text-sm">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{drill.name}</h3>
                  <p className="text-sm text-purple-400 mb-3">{drill.purpose}</p>
                  <p className="text-sm text-slate-300 leading-relaxed mb-3">{drill.instructions}</p>
                  <div className="flex gap-3">
                    <span className="text-xs bg-slate-700/80 text-slate-300 px-2.5 py-1 rounded-full">{drill.duration}</span>
                    <span className="text-xs bg-slate-700/80 text-slate-300 px-2.5 py-1 rounded-full">{drill.frequency}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Improvement Plan */}
      <div className="bg-gradient-to-br from-slate-800/80 to-indigo-900/20 border border-indigo-500/30 rounded-2xl p-6 md:p-8 mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">7-Day Improvement Plan</h2>
            <p className="text-sm text-slate-400">Personalized weekly plan to go from 78 to 85+</p>
          </div>
        </div>
        <div className="space-y-3">
          {report.improvement_plan.map((day) => (
            <div key={day.day} className="flex gap-4 items-start bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
              <div className="w-20 shrink-0">
                <span className="text-indigo-400 font-bold text-sm">{day.day}</span>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{day.focus}</p>
                <p className="text-slate-400 text-sm mt-1">{day.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Signals */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {[
          { icon: "\u{1F512}", text: "Secure Video Upload" },
          { icon: "\u{1F3CF}", text: "Built for Aspiring Players" },
          { icon: "\u{1F4B0}", text: "First Analysis Free" },
          { icon: "\u{1F6E1}", text: "No Selection Guarantees" },
        ].map((b) => (
          <div key={b.text} className="flex items-center gap-1.5 bg-slate-800/50 border border-slate-700/50 rounded-full px-3 py-1.5">
            <span className="text-sm">{b.icon}</span>
            <span className="text-xs text-slate-400">{b.text}</span>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-slate-500 text-center mb-4 max-w-2xl mx-auto">
        {report.disclaimer}
      </p>
      <p className="text-xs text-slate-500 text-center mb-10 max-w-2xl mx-auto">
        CricVerse360 AI analysis is for cricket training guidance only. It does not guarantee selection, scouting, or professional outcomes.
      </p>

      {/* Bottom CTA */}
      <CTASection variant="bottom" />
    </div>
  );
}
