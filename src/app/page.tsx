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
              Get Your Cricket Technique Score{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
                in 60 Seconds
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

      {/* Stats bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "AI-Powered Analysis", value: "Gemini", icon: "\u{1F3AF}" },
            { label: "Batting & Bowling", value: "Video", icon: "\u{1F4C8}" },
            { label: "Instant Reports", value: "< 60s", icon: "\u{1F3CB}" },
            { label: "Available", value: "Worldwide", icon: "\u{1F30D}" },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-800/80 backdrop-blur border border-slate-700/50 rounded-xl p-4 text-center">
              <span className="text-lg block mb-1">{stat.icon}</span>
              <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {[
            { icon: "\u{1F512}", text: "Secure Video Upload" },
            { icon: "\u{1F3AF}", text: "AI Training Guidance" },
            { icon: "\u{1F3CF}", text: "Built for Aspiring Players" },
            { icon: "\u{1F4B0}", text: "First Analysis Free" },
            { icon: "\u{2716}", text: "Cancel Anytime" },
            { icon: "\u{1F6E1}", text: "No Selection Guarantees" },
          ].map((badge) => (
            <div key={badge.text} className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Player Journey — 5 Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <span className="text-xs text-emerald-400 font-semibold uppercase tracking-widest">Your Journey</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-3">
            Improve Faster. Get Noticed. Know What to Fix.
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">Five steps from unknown to discovered</p>
        </div>
        <div className="grid md:grid-cols-5 gap-6">
          {[
            {
              step: "1",
              title: "Know Your Score",
              desc: "Upload any batting or bowling video. Get an objective AI score out of 100 with confidence rating.",
              icon: (
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ),
              color: "border-emerald-500/30 bg-emerald-500/5",
            },
            {
              step: "2",
              title: "Fix Your Biggest Mistake",
              desc: "AI pinpoints your #1 technical issue and tells you exactly how to fix it with specific drills.",
              icon: (
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              color: "border-red-500/30 bg-red-500/5",
            },
            {
              step: "3",
              title: "Track Your Improvement",
              desc: "Upload again after training. See your score change over time with visual progress charts.",
              icon: (
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ),
              color: "border-blue-500/30 bg-blue-500/5",
            },
            {
              step: "4",
              title: "Share Your Player Card",
              desc: "Get a branded player card with your score. Share it on WhatsApp, Twitter, or send to coaches.",
              icon: (
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              ),
              color: "border-purple-500/30 bg-purple-500/5",
            },
            {
              step: "5",
              title: "Get Ranked",
              desc: "Appear on the leaderboard. Get discovered by coaches, academies, and scouts worldwide.",
              icon: (
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              ),
              color: "border-yellow-500/30 bg-yellow-500/5",
            },
          ].map((item) => (
            <div key={item.step} className={`rounded-2xl border ${item.color} p-6 text-center hover:scale-105 transition-transform`}>
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center mx-auto mb-3">
                {item.icon}
              </div>
              <div className="text-xs font-bold text-slate-500 mb-2">STEP {item.step}</div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400">{item.desc}</p>
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
          <p className="text-sm text-slate-400 mt-3">Free first analysis. No commitment.</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-800/30 border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Get professional cricket analysis in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Upload Your Video",
                desc: "Record your batting or bowling session and upload it to CricVerse360. Any format, any angle.",
                color: "from-emerald-500 to-emerald-600",
              },
              {
                step: "2",
                title: "Get AI Analysis",
                desc: "Our AI analyzes your stance, footwork, timing, follow-through, and more. Instant detailed feedback.",
                color: "from-blue-500 to-blue-600",
              },
              {
                step: "3",
                title: "Improve & Share",
                desc: "Follow personalized drills, track your progress, and share your branded player card to get discovered.",
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
          <div className="text-center mt-8">
            <Link href="/sample-analysis" className="text-emerald-400 hover:text-emerald-300 font-semibold text-sm transition-colors">
              See a full sample analysis report &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* For Players — Score Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm text-emerald-400 font-semibold uppercase tracking-wide">For Players</span>
            <h2 className="text-3xl font-bold text-white mt-2 mb-4">Know Exactly Where You Stand</h2>
            <p className="text-slate-300 mb-6">
              Stop guessing about your technique. Get objective, data-driven feedback on every aspect of your game.
            </p>
            <ul className="space-y-3">
              {[
                "AI-powered batting & bowling analysis",
                "Overall performance score out of 100",
                "Specific strengths and weaknesses identified",
                "Personalized drill recommendations",
                "Shareable player card for scouts and coaches",
                "Track your improvement over time",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center mt-0.5 shrink-0">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/analyze" className="inline-block mt-6 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-full font-semibold transition-colors">
              Try Free Analysis
            </Link>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6">
            <div className="text-center mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border-4 border-emerald-500 flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl font-bold text-emerald-400">78</span>
              </div>
              <p className="text-white font-semibold">Overall Score</p>
              <p className="text-sm text-slate-400">Batting Analysis</p>
            </div>
            <div className="space-y-2">
              {[
                { label: "Stance", score: 85, color: "bg-emerald-500" },
                { label: "Footwork", score: 72, color: "bg-blue-500" },
                { label: "Timing", score: 68, color: "bg-yellow-500" },
                { label: "Follow-through", score: 82, color: "bg-purple-500" },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{m.label}</span>
                    <span className="text-white font-semibold">{m.score}</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full ${m.color} rounded-full`} style={{ width: `${m.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sample Report Preview */}
      <section className="bg-slate-800/30 border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-3">See It In Action</span>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Real AI Analysis Report</h2>
                <p className="text-slate-300 mb-4">
                  See exactly what you get before signing up. Our sample report shows a real batting analysis with score, strengths, weaknesses, timestamp observations, and personalized drill recommendations.
                </p>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-yellow-400">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                  <span className="text-sm text-slate-400">4.8/5 average satisfaction rating</span>
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
        </div>
      </section>

      {/* CTA: Emotional mid-page */}
      <section className="bg-gradient-to-r from-emerald-900/40 to-blue-900/40 border-y border-emerald-500/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Find Out Where You Stand as a Cricketer
          </h2>
          <p className="text-slate-300 mb-2 max-w-lg mx-auto">
            Upload your video and get instant AI feedback in seconds.
          </p>
          <p className="text-sm text-slate-400 mb-6">
            Upload your video now and start improving today.
          </p>
          <Link
            href="/analyze"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-full font-bold transition-colors text-lg shadow-lg shadow-emerald-500/25"
          >
            Upload Your Video Free
          </Link>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Simple, Transparent Pricing</h2>
          <p className="text-slate-400">Start free. Upgrade when you need more.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white">Free</h3>
            <p className="text-3xl font-bold text-white mt-2">$0</p>
            <p className="text-sm text-slate-400 mb-6">Get started</p>
            <ul className="space-y-2 text-sm text-slate-300 mb-6">
              <li>1 free video analysis</li>
              <li>Basic player profile</li>
              <li>Basic score</li>
            </ul>
            <Link href="/auth" className="block text-center bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-full font-semibold transition-colors">
              Sign Up Free
            </Link>
          </div>
          <div className="bg-slate-800/50 border-2 border-emerald-500 rounded-2xl p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              Most Popular
            </div>
            <h3 className="text-lg font-semibold text-white">Pro</h3>
            <p className="text-3xl font-bold text-white mt-2">$9.99<span className="text-sm font-normal text-slate-400">/mo</span></p>
            <p className="text-sm text-slate-400 mb-6">For serious players</p>
            <ul className="space-y-2 text-sm text-slate-300 mb-6">
              <li>5 video analyses/month</li>
              <li>Full technical report</li>
              <li>Shareable player card</li>
              <li>Progress history</li>
            </ul>
            <Link href="/pricing" className="block text-center bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full font-semibold transition-colors">
              Get Pro
            </Link>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white">Pro Plus</h3>
            <p className="text-3xl font-bold text-white mt-2">$19.99<span className="text-sm font-normal text-slate-400">/mo</span></p>
            <p className="text-sm text-slate-400 mb-6">For academies & pros</p>
            <ul className="space-y-2 text-sm text-slate-300 mb-6">
              <li>15 analyses/month</li>
              <li>Priority processing</li>
              <li>Scout visibility boost</li>
              <li>Advanced improvement plan</li>
            </ul>
            <Link href="/pricing" className="block text-center bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-full font-semibold transition-colors">
              Get Pro Plus
            </Link>
          </div>
        </div>
        <p className="text-center text-sm text-slate-400 mt-6">
          Need just one report? <Link href="/pricing" className="text-emerald-400 hover:underline">$4.99 per analysis</Link> available.
        </p>
        <div className="text-center mt-4">
          <Link href="/sample-analysis" className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors">
            Preview a sample analysis before you sign up &rarr;
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-800/30 border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">How It Helps</h2>
            <p className="text-sm text-slate-400">Here&apos;s what CricVerse360 AI analysis can do for you</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "\u{1F3AF}", title: "Spot Hidden Technique Issues", desc: "AI analyzes your stance, footwork, backlift, and follow-through frame by frame. Get feedback your coach might miss in real-time." },
              { icon: "\u{1F4CB}", title: "Personalized Drill Plans", desc: "Every report includes recommended drills and a 7-day improvement plan tailored to your specific weaknesses." },
              { icon: "\u{1F4C8}", title: "Track Your Progress", desc: "Upload multiple videos over time to see your scores improve. Pro users get full trend charts and repeated weakness analysis." },
              { icon: "\u{1F3AC}", title: "Timestamp Coaching Notes", desc: "See exactly which moments in your video need attention, with specific observations at each timestamp." },
              { icon: "\u{1F4E2}", title: "Shareable Player Cards", desc: "Generate a branded player card with your score and share it on WhatsApp, X, or download it to show your coach." },
              { icon: "\u{1F3C6}", title: "Get Ranked on the Leaderboard", desc: "Your scores appear on the CricVerse360 leaderboard. Compete with players worldwide and get noticed." },
            ].map((item) => (
              <div key={item.title} className="bg-slate-800/80 border border-slate-700/50 rounded-xl p-6">
                <span className="text-2xl mb-3 block">{item.icon}</span>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Discovered — Prominent Section */}
      <section className="bg-gradient-to-br from-yellow-900/20 via-slate-900 to-emerald-900/20 border-y border-yellow-500/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-lg">{"\u{1F3C6}"}</span>
              <span className="text-sm text-yellow-400 font-semibold">Get Discovered</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Get Discovered on the CricVerse360 Leaderboard
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Upload your video, earn your score, and appear among top players of the week. Coaches and scouts are watching.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
            {[
              { rank: 1, emoji: "\u{1F947}", border: "border-yellow-500/40", bg: "bg-yellow-500/10", label: "1st Place" },
              { rank: 2, emoji: "\u{1F948}", border: "border-slate-400/40", bg: "bg-slate-400/10", label: "2nd Place" },
              { rank: 3, emoji: "\u{1F949}", border: "border-amber-600/40", bg: "bg-amber-600/10", label: "3rd Place" },
            ].map((p) => (
              <div key={p.rank} className={`${p.bg} border ${p.border} rounded-2xl p-6 text-center`}>
                <span className="text-3xl mb-2 block">{p.emoji}</span>
                <div className={`w-16 h-16 rounded-full border-3 border-slate-600 flex items-center justify-center mx-auto mb-3 bg-slate-900/50`}>
                  <span className="text-xl font-bold text-slate-500">?</span>
                </div>
                <h3 className="text-lg font-bold text-slate-500">{p.label}</h3>
                <p className="text-sm text-slate-500">Could be you</p>
                <Link
                  href="/analyze"
                  className="inline-block mt-3 text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                >
                  Upload to Compete &rarr;
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center space-y-4">
            <Link
              href="/analyze"
              className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-full font-bold transition-colors text-lg shadow-lg shadow-emerald-500/25"
            >
              Upload Your Video to Get Ranked
            </Link>
            <div>
              <Link href="/leaderboard" className="text-yellow-400 hover:text-yellow-300 font-semibold text-sm transition-colors">
                View Full Leaderboard &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* For Coaches — moved lower */}
      <section className="bg-slate-800/30 border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: "Batting Coaches", desc: "Technique, stance, footwork" },
                  { title: "Bowling Coaches", desc: "Pace, spin, swing" },
                  { title: "All-Round Coaches", desc: "Complete game development" },
                  { title: "Fielding Coaches", desc: "Catching, throwing, agility" },
                ].map((coach) => (
                  <div key={coach.title} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-emerald-500/50 transition-all">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 mb-3" />
                    <p className="text-white font-semibold text-sm">{coach.title}</p>
                    <p className="text-xs text-slate-400 mt-1">{coach.desc}</p>
                    <p className="text-xs text-emerald-400 mt-2">Available worldwide</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 md:order-2">
              <span className="text-sm text-blue-400 font-semibold uppercase tracking-wide">For Coaches</span>
              <h2 className="text-3xl font-bold text-white mt-2 mb-4">Reach Players Worldwide</h2>
              <p className="text-slate-300 mb-6">
                List your coaching services on CricVerse360. Connect with players looking for expert guidance to improve their game.
              </p>
              <ul className="space-y-3">
                {[
                  "Create your professional coach profile",
                  "Receive coaching session requests",
                  "Set your own rates and availability",
                  "Build your reputation with reviews",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5 shrink-0">
                      <span className="w-2 h-2 bg-blue-400 rounded-full" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/coaches" className="inline-block mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-full font-semibold transition-colors">
                Browse Coaches
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* For Academies — moved lower */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm text-purple-400 font-semibold uppercase tracking-wide">For Academies</span>
          <h2 className="text-3xl font-bold text-white mt-2 mb-4">Manage Your Academy, Develop Your Players</h2>
          <p className="text-slate-300 mb-8">
            Track attendance, manage rosters, run drills, and use AI analysis to give your students data-driven feedback. All in one platform.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { title: "Roster Management", desc: "Track players, skill levels, and attendance across your academy." },
            { title: "AI Video Analysis", desc: "Use AI-powered analysis to give students objective technique feedback." },
            { title: "Drill Library", desc: "Create, share, and assign drills. Track completion and engagement." },
          ].map((feature) => (
            <div key={feature.title} className="bg-slate-800/80 border border-slate-700/50 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Academy trust bar — moved lower */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">Built for cricket players worldwide</p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {[
              "Youth Academies",
              "Club Players",
              "School Teams",
              "Private Coaches",
              "Self-Training Players",
            ].map((audience) => (
              <span key={audience} className="text-sm text-slate-500 font-medium">{audience}</span>
            ))}
          </div>
          <p className="text-xs text-slate-600 mt-3">Upload your first video free</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-800/30 border-y border-slate-700/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "How does the AI analysis work?", a: "Upload a video of your batting or bowling. Our AI analyzes your technique including stance, footwork, timing, and follow-through, then generates a detailed report with scores, strengths, weaknesses, and personalized drill recommendations." },
              { q: "What video format should I use?", a: "Any common video format works (MP4, MOV, AVI). Record from a side angle for best results. Even a smartphone video works great." },
              { q: "Is the free analysis really free?", a: "Yes! Every new user gets one free video analysis with no credit card required. Try it out and upgrade if you want more." },
              { q: "Can I share my results?", a: "Pro and Pro Plus members get a branded player card they can download and share on social media, WhatsApp, or anywhere. Great for getting noticed by scouts and coaches." },
              { q: "How accurate is the AI?", a: "Our AI uses advanced computer vision and is trained on professional cricket technique. Each report includes a confidence score. For the best results, record from a clear side angle with good lighting." },
              { q: "Can coaches use CricVerse360?", a: "Absolutely. Coaches can list their services on the marketplace, and academies can use AI analysis to give students data-driven feedback at scale." },
            ].map((faq) => (
              <details key={faq.q} className="group bg-slate-800/50 border border-slate-700/50 rounded-xl">
                <summary className="cursor-pointer p-5 text-white font-semibold flex items-center justify-between">
                  {faq.q}
                  <span className="text-slate-400 group-open:rotate-45 transition-transform text-xl">+</span>
                </summary>
                <p className="px-5 pb-5 text-slate-400 text-sm">{faq.a}</p>
              </details>
            ))}
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
