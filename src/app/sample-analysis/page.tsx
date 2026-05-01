import Link from "next/link";
import type { Metadata } from "next";
import PageViewTracker from "@/components/PageViewTracker";

export const metadata: Metadata = {
  title: "Sample AI Cricket Analysis | CricVerse360",
  description:
    "See a full AI-powered batting analysis report. Understand how CricVerse360 evaluates technique, provides coaching feedback, and helps you improve.",
};

const sampleData = {
  playerName: "Rahul Sharma",
  role: "Right-Hand Batsman",
  analysis_type: "batting",
  overall_score: 78,
  confidence_score: 85,
  summary:
    "Strong batting foundation with good balance and head position. Footwork needs improvement on front-foot drives. Follow-through is clean but could generate more power with better weight transfer. Stance is well-balanced with room to widen for better coverage against pace.",
  video_quality_notes:
    "Good side-on angle with adequate lighting. Camera distance allows full body tracking. Frame rate suitable for slow-motion analysis.",
  strengths: [
    "Excellent head position -- eyes level through the shot",
    "Good base and balance at the crease",
    "Clean bat swing with a straight follow-through",
    "Strong defensive technique against spin",
    "Consistent backlift alignment",
  ],
  weaknesses: [
    "Front foot not reaching to the pitch of the ball on drives",
    "Weight transfer slightly delayed -- staying back too long",
    "Bottom hand grip too tight, limiting wrist play",
    "Tendency to fall off-side on cut shots",
  ],
  timestamp_observations: [
    {
      timestamp: "00:03",
      observation: "Initial stance setup -- weight on balls of feet, bat grounded behind back toe",
      coaching_note: "Good setup. Could widen stance 2-3 inches for better stability against pace.",
    },
    {
      timestamp: "00:07",
      observation: "Front foot drive attempted -- foot plants short of the pitch of the ball",
      coaching_note: "Commit earlier to the front foot. Stride should reach within 6 inches of the ball's pitch.",
    },
    {
      timestamp: "00:12",
      observation: "Back foot pull shot -- excellent weight transfer and hip rotation",
      coaching_note: "Strong shot. Good example of natural power generation through the hips.",
    },
    {
      timestamp: "00:18",
      observation: "Defensive block -- head perfectly still, bat close to pad",
      coaching_note: "Textbook defense. Maintain this head position on attacking shots too.",
    },
    {
      timestamp: "00:24",
      observation: "Cover drive -- bat face opens slightly at point of contact",
      coaching_note: "Keep the front elbow higher through the shot to maintain a straighter bat face.",
    },
  ],
  technical_feedback: {
    stance:
      "Solid setup. Weight evenly distributed on balls of feet. Bat grounded behind back toe. Suggestion: widen stance by 2-3 inches for better coverage against pace bowling.",
    head_position:
      "Excellent. Eyes level through most shots. Slight tendency to look up early on drives -- focus on watching the ball onto the bat.",
    footwork:
      "Back-foot play is strong and instinctive. Front-foot movement is hesitant -- need to commit earlier to driving. Initial trigger movement is good but follow-through stride is short.",
    balance:
      "Good overall balance. Slight tendency to fall toward off side on cut shots. Weight stays centered on defensive shots, which is excellent.",
    bat_swing:
      "Clean downswing with a straight path. Bat face alignment is consistent through most shots. Bottom hand dominates slightly, reducing wrist flexibility on late adjustments.",
    timing:
      "Timing is generally good on back-foot shots with natural punch. Front-foot timing needs improvement -- bat arrives late on fuller deliveries, especially against pace.",
    follow_through:
      "Clean follow-through on most shots. High elbow maintained well on drives. Could extend arms more on front-foot drives for better power generation through the line of the ball.",
  },
  recommended_drills: [
    {
      name: "Front Foot Drive Shadow Drill",
      purpose: "Improve front-foot commitment and weight transfer",
      instructions:
        "Without a ball, practice stepping out with front foot toward an imaginary pitch. Focus on transferring weight smoothly from back to front. Keep head still and eyes down. Repeat 50 times daily for 2 weeks.",
    },
    {
      name: "Throwdown Drives",
      purpose: "Practice timing on front-foot drives against pace",
      instructions:
        "Have a partner throw half-volleys from 15 yards at medium pace. Focus on getting to the pitch of the ball with a full stride. Hit through the line, not across. 30 balls per session, 3 sessions per week.",
    },
    {
      name: "Soft Hands Drill",
      purpose: "Loosen bottom-hand grip for better wrist play",
      instructions:
        "Face throwdowns holding the bat with only your top hand for the first 10 balls. Then add the bottom hand loosely. Focus on guiding the ball rather than gripping. This builds top-hand dominance and feel.",
    },
    {
      name: "Balance Board Batting",
      purpose: "Improve weight distribution and core stability",
      instructions:
        "Stand on a balance board in your batting stance. Practice shadow drives while maintaining balance. Start with 2 minutes and build to 5 minutes. This translates directly to better in-game balance.",
    },
  ],
  next_steps: [
    "Focus on front-foot movement and weight transfer for the next 2 weeks",
    "Upload another video after completing the drill program to track improvement",
    "Consider working with a batting coach for 1-on-1 footwork correction sessions",
    "Practice the soft hands drill daily to improve wrist play against spin",
    "Try filming from both side-on and front-on angles for more complete analysis",
  ],
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

function CTABanner({ variant = "primary" }: { variant?: "primary" | "secondary" }) {
  return (
    <div
      className={`rounded-2xl p-8 md:p-10 text-center ${
        variant === "primary"
          ? "bg-gradient-to-r from-emerald-900/60 to-blue-900/60 border border-emerald-500/30"
          : "bg-gradient-to-r from-slate-800 to-slate-800/80 border border-slate-700/50"
      }`}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
        {variant === "primary" ? "Get Your Own AI Analysis" : "Ready to Improve Your Game?"}
      </h2>
      <p className="text-slate-300 mb-6 max-w-lg mx-auto">
        Upload your batting or bowling video and get a personalized AI analysis report like this one in minutes.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/analyze"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold transition-colors text-lg shadow-lg shadow-emerald-500/20"
        >
          Upload Your Video Free
        </Link>
        <Link
          href="/pricing"
          className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-semibold border border-white/20 transition-colors"
        >
          View Pricing
        </Link>
      </div>
      <p className="text-xs text-slate-500 mt-4">No credit card required. First analysis is free.</p>
    </div>
  );
}

export default function SampleAnalysisPage() {
  const a = sampleData;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <PageViewTracker event="sample_analysis_viewed" />
      {/* Top CTA */}
      <CTABanner variant="primary" />

      {/* Badge Row */}
      <div className="mt-10 mb-6 flex items-center gap-3 flex-wrap">
        <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 font-semibold">
          Sample Report
        </span>
        <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
          Confidence: {a.confidence_score}%
        </span>
        <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-400">
          Powered by Gemini AI
        </span>
      </div>

      {/* Embedded Video */}
      <div className="mb-10">
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-800/80 border border-slate-700/50">
          <iframe
            src="https://www.youtube.com/embed/EqHVWZqhSBk?rel=0"
            title="Sample Cricket Batting Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">
          Sample cricket batting video used for this analysis
        </p>
      </div>

      {/* Player Header */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start mb-12">
        <ScoreCircle score={a.overall_score} />
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{a.playerName}</h1>
          <p className="text-slate-400 mb-1 capitalize">{a.role}</p>
          <p className="text-sm text-emerald-400 font-medium capitalize mb-4">{a.analysis_type} Analysis</p>
          <p className="text-slate-300 leading-relaxed">{a.summary}</p>
        </div>
      </div>

      {/* Video Quality */}
      <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 mb-10 flex items-start gap-3">
        <svg className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <div>
          <p className="text-sm font-medium text-white mb-0.5">Video Quality Assessment</p>
          <p className="text-sm text-slate-400">{a.video_quality_notes}</p>
        </div>
      </div>

      {/* Confidence + Score Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: "Overall Score", value: a.overall_score, suffix: "/100" },
          { label: "AI Confidence", value: a.confidence_score, suffix: "%" },
          { label: "Strengths Found", value: a.strengths.length, suffix: "" },
          { label: "Drills Suggested", value: a.recommended_drills.length, suffix: "" },
        ].map((stat) => (
          <div key={stat.label} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">
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
            <h2 className="text-lg font-bold text-emerald-400">Strengths</h2>
          </div>
          <ul className="space-y-3">
            {a.strengths.map((s) => (
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
            <h2 className="text-lg font-bold text-amber-400">Areas for Improvement</h2>
          </div>
          <ul className="space-y-3">
            {a.weaknesses.map((w) => (
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

      {/* Timestamp Observations */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-12">
        <div className="flex items-center gap-2 mb-6">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-white">Timestamp Observations</h2>
        </div>
        <div className="space-y-5">
          {a.timestamp_observations.map((obs, i) => (
            <div key={i} className="flex gap-4 group">
              <div className="flex flex-col items-center">
                <span className="text-emerald-400 font-mono text-sm font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                  {obs.timestamp}
                </span>
                {i < a.timestamp_observations.length - 1 && (
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
        <h2 className="text-xl font-bold text-white mb-6">Technical Breakdown</h2>
        <div className="grid gap-5">
          {Object.entries(a.technical_feedback).map(([key, value]) => (
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
          <h2 className="text-xl font-bold text-white">Recommended Drills</h2>
        </div>
        <div className="grid gap-4">
          {a.recommended_drills.map((drill, i) => (
            <div key={drill.name} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-purple-500/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0 text-purple-400 font-bold text-sm">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{drill.name}</h3>
                  <p className="text-sm text-purple-400 mb-3">{drill.purpose}</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{drill.instructions}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-12">
        <h2 className="text-xl font-bold text-white mb-4">Next Steps</h2>
        <ol className="space-y-3">
          {a.next_steps.map((step, i) => (
            <li key={step} className="flex items-start gap-3 text-sm text-slate-300">
              <span className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5 shrink-0 text-blue-400 text-xs font-bold">
                {i + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-slate-500 text-center mb-10 max-w-2xl mx-auto">
        {a.disclaimer}
      </p>

      {/* Bottom CTA */}
      <CTABanner variant="secondary" />
    </div>
  );
}
