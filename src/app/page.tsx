import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-slate-900 to-blue-900/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-sm text-emerald-400">AI-Powered Cricket Coaching</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              AI Cricket Analysis That Helps Players{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
                Improve and Get Discovered
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Upload your batting or bowling video and receive instant AI-powered feedback,
              improvement tips, and a shareable player profile.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/analyze"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-full font-bold transition-colors text-lg shadow-lg shadow-emerald-500/25"
              >
                Get Your Cricket Score Free
              </Link>
              <Link
                href="/sample-analysis"
                className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3.5 rounded-full font-semibold border border-slate-700 transition-colors text-lg"
              >
                See Sample Analysis
              </Link>
            </div>
            <p className="text-sm text-slate-400 mt-4">
              Upload your video and get instant AI feedback in seconds.
            </p>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Videos Analyzed", value: "500+" },
            { label: "Avg Score Improvement", value: "23%" },
            { label: "Expert Coaches", value: "50+" },
            { label: "Countries", value: "12+" },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-800/80 backdrop-blur border border-slate-700/50 rounded-xl p-4 text-center">
              <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
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
        <div className="mt-10 text-center">
          <Link
            href="/analyze"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-bold transition-colors shadow-lg shadow-emerald-500/25"
          >
            Get Your Cricket Score Free
          </Link>
          <p className="text-sm text-slate-400 mt-3">Upload your video and get instant AI feedback in seconds.</p>
        </div>
      </section>

      {/* For Players */}
      <section className="bg-slate-800/30 border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
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
        </div>
      </section>

      {/* For Coaches */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Batting Coach", location: "Mumbai, India", sessions: "120+", rating: "4.9" },
                { title: "Bowling Coach", location: "Sydney, Australia", sessions: "95+", rating: "4.8" },
                { title: "All-Round Coach", location: "London, UK", sessions: "80+", rating: "4.7" },
                { title: "Fielding Coach", location: "Cape Town, SA", sessions: "60+", rating: "4.9" },
              ].map((coach) => (
                <div key={coach.title} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-emerald-500/50 transition-all">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 mb-3" />
                  <p className="text-white font-semibold text-sm">{coach.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{coach.location}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-emerald-400">{coach.sessions} sessions</span>
                    <span className="text-xs text-yellow-400">{coach.rating}</span>
                  </div>
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
      </section>

      {/* For Academies */}
      <section className="bg-slate-800/30 border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
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
        </div>
      </section>

      {/* CTA before Pricing */}
      <section className="bg-gradient-to-r from-emerald-900/40 to-blue-900/40 border-y border-emerald-500/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Find Out Where You Stand as a Cricketer
          </h2>
          <p className="text-slate-300 mb-6 max-w-lg mx-auto">
            Upload your video and get instant AI feedback in seconds.
          </p>
          <Link
            href="/analyze"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-full font-bold transition-colors text-lg shadow-lg shadow-emerald-500/25"
          >
            Get Your Cricket Score Free
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

      {/* Testimonials placeholder */}
      <section className="bg-slate-800/30 border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">What Players Are Saying</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Arjun P.", role: "U-19 Batsman, Mumbai", quote: "The AI analysis spotted a problem with my backlift that my coaches had missed. My batting average improved by 15 runs in two months." },
              { name: "James W.", role: "Club Bowler, Sydney", quote: "CricVerse360 showed me my front arm was dropping too early. The drill recommendations were spot on. I am bowling faster and more accurately now." },
              { name: "Coach Malik", role: "Academy Director, Lahore", quote: "I use CricVerse360 to give every student objective feedback. The AI analysis saves me hours and helps me focus coaching on what matters most." },
            ].map((t) => (
              <div key={t.name} className="bg-slate-800/80 border border-slate-700/50 rounded-xl p-6">
                <p className="text-slate-300 mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
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
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-emerald-900/50 to-blue-900/50 border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Your Next Level Starts Here</h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            Upload your video and get instant AI feedback in seconds. No credit card. No commitment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/analyze" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-full font-bold transition-colors text-lg shadow-lg shadow-emerald-500/25">
              Get Your Cricket Score Free
            </Link>
            <Link href="/sample-analysis" className="bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-full font-semibold border border-white/20 transition-colors">
              See Sample Analysis
            </Link>
          </div>
          <p className="text-sm text-slate-400 mt-4">Upload your video and get instant AI feedback in seconds.</p>
        </div>
      </section>
    </div>
  );
}
