import Link from "next/link";

const sampleAnalysis = {
  player_type: "batsman",
  analysis_type: "batting",
  overall_score: 78,
  summary:
    "Strong batting foundation with good balance and head position. Footwork needs improvement on front-foot drives. Follow-through is clean but could generate more power with better weight transfer.",
  strengths: [
    "Excellent head position — eyes level through the shot",
    "Good base and balance at the crease",
    "Clean bat swing with a straight follow-through",
    "Strong defensive technique",
  ],
  weaknesses: [
    "Front foot not reaching to the pitch of the ball on drives",
    "Weight transfer slightly delayed — staying back too long",
    "Bottom hand grip too tight, limiting wrist play",
  ],
  technical_feedback: {
    stance: "Solid setup. Weight evenly distributed. Bat grounded behind back toe. Suggestion: widen stance slightly for better coverage.",
    footwork: "Back-foot play is good, but front-foot movement is hesitant. Need to commit earlier to driving on front foot.",
    balance: "Good balance overall. Slight tendency to fall toward off side on cut shots.",
    timing: "Timing is generally good on back-foot shots. Front-foot timing needs work — bat arrives late on fuller deliveries.",
    follow_through: "Clean follow-through on most shots. Could extend arms more on drives for better power generation.",
  },
  recommended_drills: [
    {
      name: "Front Foot Drive Shadow Drill",
      purpose: "Improve front-foot commitment and weight transfer",
      instructions: "Without a ball, practice stepping out with front foot toward an imaginary pitch. Focus on transferring weight smoothly. Repeat 50 times daily.",
    },
    {
      name: "Throwdown Drives",
      purpose: "Practice timing on front-foot drives",
      instructions: "Have a partner throw half-volleys from 15 yards. Focus on getting to the pitch of the ball with a full stride. 30 balls per session.",
    },
    {
      name: "Soft Hands Drill",
      purpose: "Loosen bottom-hand grip for better wrist work",
      instructions: "Face throwdowns holding the bat with only your top hand. Add the bottom hand loosely after 10 balls. Focus on guiding rather than gripping.",
    },
  ],
  next_steps: [
    "Focus on front-foot movement for the next 2 weeks",
    "Upload another video after practicing drills to track improvement",
    "Consider working with a batting coach for 1-on-1 footwork sessions",
  ],
};

export default function SampleAnalysisPage() {
  const a = sampleAnalysis;
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <span className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">Sample Analysis</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border-4 border-emerald-500 flex items-center justify-center shrink-0">
          <span className="text-4xl font-bold text-emerald-400">{a.overall_score}</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Batting Analysis</h1>
          <p className="text-slate-400 mb-4 capitalize">Player type: {a.player_type}</p>
          <p className="text-slate-300">{a.summary}</p>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-lg font-bold text-emerald-400 mb-4">Strengths</h2>
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
          <h2 className="text-lg font-bold text-red-400 mb-4">Areas for Improvement</h2>
          <ul className="space-y-3">
            {a.weaknesses.map((w) => (
              <li key={w} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center mt-0.5 shrink-0">
                  <span className="w-2 h-2 bg-red-400 rounded-full" />
                </span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Technical Feedback */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-12">
        <h2 className="text-xl font-bold text-white mb-6">Technical Feedback</h2>
        <div className="space-y-4">
          {Object.entries(a.technical_feedback).map(([key, value]) => (
            <div key={key}>
              <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-1">{key}</h3>
              <p className="text-sm text-slate-300">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Drills */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-6">Recommended Drills</h2>
        <div className="grid gap-4">
          {a.recommended_drills.map((drill) => (
            <div key={drill.name} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-1">{drill.name}</h3>
              <p className="text-sm text-emerald-400 mb-3">{drill.purpose}</p>
              <p className="text-sm text-slate-300">{drill.instructions}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-12">
        <h2 className="text-xl font-bold text-white mb-4">Next Steps</h2>
        <ol className="space-y-2">
          {a.next_steps.map((step, i) => (
            <li key={step} className="flex items-start gap-3 text-sm text-slate-300">
              <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5 shrink-0 text-blue-400 text-xs font-bold">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-emerald-900/50 to-blue-900/50 border border-slate-700/50 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">Want Your Own Analysis?</h2>
        <p className="text-slate-300 mb-6">Upload your batting or bowling video and get personalized AI feedback in minutes.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/analyze" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold transition-colors">
            Upload Your First Video Free
          </Link>
          <Link href="/pricing" className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-semibold border border-white/20 transition-colors">
            View Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
