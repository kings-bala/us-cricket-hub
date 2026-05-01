import Link from "next/link";
import PageViewTracker from "@/components/PageViewTracker";
import TrackClick from "@/components/TrackClick";

export default function Home() {
  return (
    <div>
      <PageViewTracker event="landing_page_viewed" />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-slate-900 to-blue-900/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {"Get Your Cricket Technique Score "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
                {"in 60 Seconds"}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Upload your batting or bowling video and get instant AI feedback on what to fix and how to improve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <TrackClick
                href="/analyze"
                event="hero_cta_clicked"
                data={{ cta: "Upload Your Video Free" }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 rounded-full font-bold transition-colors text-xl shadow-lg shadow-emerald-500/25"
              >
                Upload Your Video Free
              </TrackClick>
              <Link
                href="/sample-analysis"
                className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-full font-semibold border border-slate-700 transition-colors text-lg"
              >
                See Sample Analysis
              </Link>
            </div>
            <p className="text-sm text-slate-400 mt-4">
              Free first analysis. No commitment.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works — 3 Steps */}
      <section className="bg-slate-800/30 border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Get professional cricket analysis in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Upload Your Video",
                desc: "Record your batting or bowling session and upload it. Any format, any angle.",
                color: "from-emerald-500 to-emerald-600",
              },
              {
                step: "2",
                title: "Get AI Analysis",
                desc: "Our AI analyzes your stance, footwork, timing, and follow-through. Instant detailed feedback.",
                color: "from-blue-500 to-blue-600",
              },
              {
                step: "3",
                title: "Improve & Share",
                desc: "Follow personalized drills, track your progress, and share your score with coaches.",
                color: "from-purple-500 to-purple-600",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4`}>
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/analyze"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-bold transition-colors shadow-lg shadow-emerald-500/25"
            >
              Upload Your Video Free
            </Link>
          </div>
        </div>
      </section>

      {/* Sample Report Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-3">See It In Action</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Real AI Analysis Report</h2>
              <p className="text-slate-300 mb-4">
                See exactly what you get — score, strengths, weaknesses, timestamp observations, and personalized drill recommendations.
              </p>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full">Powered by Google Gemini AI</span>
              </div>
              <Link
                href="/sample-analysis"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full font-bold transition-colors self-start shadow-lg shadow-emerald-500/20"
              >
                View Full Sample Report
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
            <div className="bg-slate-800/50 p-6 md:p-8 flex items-center">
              <div className="w-full space-y-3">
                <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Overall Score</span>
                    <span className="text-lg font-bold text-emerald-400">78/100</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full"><div className="h-full bg-emerald-500 rounded-full" style={{ width: "78%" }} /></div>
                </div>
                <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">AI Confidence</span>
                    <span className="text-lg font-bold text-blue-400">85%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full"><div className="h-full bg-blue-500 rounded-full" style={{ width: "85%" }} /></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                    <p className="text-[10px] text-emerald-400 uppercase tracking-wider">Strength</p>
                    <p className="text-sm text-white mt-0.5">Solid base stance</p>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                    <p className="text-[10px] text-amber-400 uppercase tracking-wider">Improve</p>
                    <p className="text-sm text-white mt-0.5">Footwork timing</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-500">This is a preview. Full reports include timestamps, drills, and technical breakdown.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-emerald-900/50 to-blue-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Your Next Level Starts Here</h2>
          <p className="text-slate-300 mb-3 max-w-xl mx-auto">
            Most players never find out what&apos;s holding them back. You don&apos;t have to be one of them.
          </p>
          <p className="text-sm text-emerald-400 font-medium mb-8">
            Upload your video. Get your score. Start improving today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/analyze" className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 rounded-full font-bold transition-colors text-xl shadow-lg shadow-emerald-500/25">
              Upload Your Video Free
            </Link>
            <Link href="/sample-analysis" className="bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-full font-semibold border border-white/20 transition-colors">
              See Sample Analysis
            </Link>
          </div>
          <p className="text-xs text-slate-500 mt-6">
            AI analysis is for training guidance only and does not guarantee selection, scouting, or professional performance outcomes.
          </p>
        </div>
      </section>
    </div>
  );
}
