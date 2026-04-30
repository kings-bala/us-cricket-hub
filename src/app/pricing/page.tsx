import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "Try it out",
    features: [
      "1 free video analysis",
      "Basic player profile",
      "Overall score",
      "Top strengths & weaknesses",
    ],
    notIncluded: [
      "Full technical report",
      "Shareable player card",
      "Progress history",
      "Priority processing",
    ],
    cta: "Sign Up Free",
    ctaHref: "/auth",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "/mo",
    description: "For serious players",
    features: [
      "5 video analyses/month",
      "Full technical report",
      "Shareable branded player card",
      "Progress history & tracking",
      "Detailed drill recommendations",
      "Download analysis PDF",
    ],
    notIncluded: [
      "Priority processing",
      "Scout visibility boost",
    ],
    cta: "Get Pro",
    ctaHref: "/auth",
    highlight: true,
  },
  {
    name: "Pro Plus",
    price: "$19.99",
    period: "/mo",
    description: "For academies & professionals",
    features: [
      "15 video analyses/month",
      "Everything in Pro",
      "Priority processing",
      "Scout visibility boost",
      "Advanced improvement plan",
      "Coach matching priority",
      "Academy team management",
    ],
    notIncluded: [],
    cta: "Get Pro Plus",
    ctaHref: "/auth",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-[80vh] py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Start with a free analysis. Upgrade when you need more insights to improve your game.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 ${
                plan.highlight
                  ? "bg-slate-800/80 border-2 border-emerald-500 relative"
                  : "bg-slate-800/50 border border-slate-700/50"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h2 className="text-xl font-bold text-white">{plan.name}</h2>
              <div className="mt-3 mb-1">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                {plan.period && (
                  <span className="text-slate-400">{plan.period}</span>
                )}
              </div>
              <p className="text-sm text-slate-400 mb-6">{plan.description}</p>

              <Link
                href={plan.ctaHref}
                className={`block text-center px-6 py-3 rounded-full font-semibold transition-colors mb-8 ${
                  plan.highlight
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "bg-slate-700 hover:bg-slate-600 text-white"
                }`}
              >
                {plan.cta}
              </Link>

              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center mt-0.5 shrink-0">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                    </span>
                    <span className="text-sm text-slate-300">{feature}</span>
                  </div>
                ))}
                {plan.notIncluded.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 opacity-40">
                    <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center mt-0.5 shrink-0">
                      <span className="w-1.5 h-0.5 bg-slate-500 rounded" />
                    </span>
                    <span className="text-sm text-slate-500">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* One-time purchase */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center max-w-2xl mx-auto mb-16">
          <h3 className="text-xl font-bold text-white mb-2">Just Need One Report?</h3>
          <p className="text-slate-400 mb-4">
            Purchase a single video analysis without a subscription.
          </p>
          <p className="text-3xl font-bold text-white mb-4">
            $4.99 <span className="text-sm font-normal text-slate-400">per analysis</span>
          </p>
          <Link
            href="/auth"
            className="inline-block bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-full font-semibold transition-colors"
          >
            Buy Single Analysis
          </Link>
        </div>

        {/* Feature comparison */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Feature Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left text-slate-400 py-3 pr-4">Feature</th>
                  <th className="text-center text-white py-3 px-4">Free</th>
                  <th className="text-center text-emerald-400 py-3 px-4">Pro</th>
                  <th className="text-center text-white py-3 px-4">Pro Plus</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {[
                  { feature: "Video analyses/month", free: "1 (total)", pro: "5", plus: "15" },
                  { feature: "Overall score", free: "Yes", pro: "Yes", plus: "Yes" },
                  { feature: "Strengths & weaknesses", free: "Basic", pro: "Detailed", plus: "Detailed" },
                  { feature: "Technical feedback", free: "-", pro: "Yes", plus: "Yes" },
                  { feature: "Drill recommendations", free: "-", pro: "Yes", plus: "Yes" },
                  { feature: "Shareable player card", free: "-", pro: "Yes", plus: "Yes" },
                  { feature: "Progress tracking", free: "-", pro: "Yes", plus: "Yes" },
                  { feature: "Priority processing", free: "-", pro: "-", plus: "Yes" },
                  { feature: "Scout visibility boost", free: "-", pro: "-", plus: "Yes" },
                  { feature: "Advanced improvement plan", free: "-", pro: "-", plus: "Yes" },
                  { feature: "Coach matching priority", free: "-", pro: "-", plus: "Yes" },
                ].map((row) => (
                  <tr key={row.feature} className="border-b border-slate-800">
                    <td className="py-3 pr-4">{row.feature}</td>
                    <td className="text-center py-3 px-4">{row.free}</td>
                    <td className="text-center py-3 px-4">{row.pro}</td>
                    <td className="text-center py-3 px-4">{row.plus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
