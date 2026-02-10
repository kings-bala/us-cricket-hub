import { sponsors, availableSponsorships, tournaments } from "@/data/mock";

const typeIcons: Record<string, string> = {
  leaderboard: "📊",
  tournament: "🏆",
  player: "⭐",
  showcase: "🎪",
};

const typeColors: Record<string, string> = {
  leaderboard: "bg-blue-500/20 text-blue-400",
  tournament: "bg-amber-500/20 text-amber-400",
  player: "bg-emerald-500/20 text-emerald-400",
  showcase: "bg-purple-500/20 text-purple-400",
};

export default function SponsorsPage() {
  const upcomingTournaments = tournaments.filter((t) => t.status === "upcoming");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">Sponsor Hub</h1>
          <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full border border-amber-500/30">For Brands</span>
        </div>
        <p className="text-slate-400">
          Invest in the future of American cricket. Sponsor tournaments, leaderboards, and rising stars.
        </p>
      </div>

      <div className="bg-gradient-to-r from-amber-900/30 to-emerald-900/30 border border-amber-500/20 rounded-xl p-6 mb-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">$2.5B+</p>
            <p className="text-sm text-slate-400 mt-1">US Cricket Market Value by 2028</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">5M+</p>
            <p className="text-sm text-slate-400 mt-1">Cricket Fans in the US</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">18-34</p>
            <p className="text-sm text-slate-400 mt-1">Primary Age Demographic</p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-2">Current Sponsors</h2>
        <p className="text-slate-400 mb-6">Brands already investing in youth cricket development</p>
        <div className="grid md:grid-cols-3 gap-4">
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                  {sponsor.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${sponsor.tier === "Gold" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : sponsor.tier === "Silver" ? "bg-slate-400/20 text-slate-300 border border-slate-400/30" : "bg-orange-500/20 text-orange-400 border border-orange-500/30"}`}>
                  {sponsor.tier} Tier
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{sponsor.name}</h3>
              <div className="space-y-2">
                {sponsor.sponsoredAssets.map((asset) => (
                  <div key={asset.id} className="flex items-center gap-2 text-sm">
                    <span>{typeIcons[asset.type]}</span>
                    <span className="text-slate-300">{asset.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-2">Available Sponsorship Opportunities</h2>
        <p className="text-slate-400 mb-6">Claim your digital real estate in the US cricket ecosystem</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableSponsorships.map((asset) => (
            <div key={asset.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-amber-500/50 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs px-2 py-1 rounded-full ${typeColors[asset.type]}`}>
                  {typeIcons[asset.type]} {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
                </span>
                <span className="text-lg font-bold text-emerald-400">${asset.price.toLocaleString()}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors">
                {asset.name}
              </h3>
              <p className="text-sm text-slate-400 mb-4">{asset.description}</p>
              <button className="w-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Inquire Now
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-2">Upcoming Sponsorable Events</h2>
        <p className="text-slate-400 mb-6">Showcase series and tournaments open for sponsorship</p>
        <div className="grid md:grid-cols-2 gap-4">
          {upcomingTournaments.map((t) => (
            <div key={t.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{t.name}</h3>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">{t.ageGroup}</span>
                </div>
                <p className="text-sm text-slate-400">📍 {t.venue}</p>
                <p className="text-sm text-slate-400">📅 {t.startDate}</p>
              </div>
              <button className="shrink-0 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Sponsor
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-900/50 to-orange-900/50 border border-amber-500/20 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">Custom Sponsorship Packages</h2>
        <p className="text-slate-300 mb-6 max-w-xl mx-auto">
          Looking for a bespoke sponsorship package? We create tailored partnerships that align with your brand and marketing goals.
        </p>
        <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-full font-semibold transition-colors">
          Contact Our Partnerships Team
        </button>
      </div>
    </div>
  );
}
