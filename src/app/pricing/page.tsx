"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useSubscription, PLANS, SubscriptionTier } from "@/context/SubscriptionContext";

export default function PricingPage() {
  const { user } = useAuth();
  const { tier, upgrade } = useSubscription();
  const [processing, setProcessing] = useState<SubscriptionTier | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleUpgrade = async (planId: SubscriptionTier) => {
    if (!user) return;
    if (planId === "free") return;
    setProcessing(planId);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: PLANS.find((p) => p.id === planId)?.stripePriceId,
          email: user.email,
          tier: planId,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
    } catch {}
    upgrade(planId);
    setSuccess(`Upgraded to ${planId === "pro" ? "Pro" : "Academy"}!`);
    setProcessing(null);
    setTimeout(() => setSuccess(null), 3000);
  };

  const tierOrder: SubscriptionTier[] = ["free", "pro", "academy"];
  const currentIndex = tierOrder.indexOf(tier);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12 animate-fade-up">
        <p className="text-xs uppercase tracking-widest text-emerald-400 mb-3">Pricing</p>
        <h1 className="text-4xl font-bold text-white mb-3">Choose Your Plan</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Unlock premium features to take your cricket to the next level. Cancel anytime.
        </p>
      </div>

      {success && (
        <div className="max-w-md mx-auto mb-8 bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 text-center">
          <p className="text-emerald-400 font-medium">{success}</p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        {PLANS.map((plan, i) => {
          const isCurrent = plan.id === tier;
          const isDowngrade = i < currentIndex;
          const isUpgrade = i > currentIndex;
          const popular = plan.id === "pro";

          return (
            <div
              key={plan.id}
              className={`relative glass-card border rounded-2xl p-6 flex flex-col ${
                popular
                  ? "border-amber-500/50 shadow-lg shadow-amber-500/10"
                  : isCurrent
                  ? "border-emerald-500/50"
                  : "border-slate-700/50"
              }`}
            >
              {popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">
                    {plan.price === 0 ? "Free" : `$${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-slate-400 text-sm">/month</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <svg
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        popular ? "text-amber-400" : "text-emerald-400"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-slate-300">{f}</span>
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <button
                  disabled
                  className="w-full py-3 rounded-xl text-sm font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default"
                >
                  Current Plan
                </button>
              ) : isDowngrade ? (
                <button
                  disabled
                  className="w-full py-3 rounded-xl text-sm font-semibold bg-slate-700/50 text-slate-500 cursor-not-allowed"
                >
                  Included in your plan
                </button>
              ) : isUpgrade ? (
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={processing === plan.id}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors ${
                    popular
                      ? "bg-amber-500 hover:bg-amber-600 text-white"
                      : "bg-emerald-500 hover:bg-emerald-600 text-white"
                  } ${processing === plan.id ? "opacity-50 cursor-wait" : ""}`}
                >
                  {processing === plan.id ? "Processing..." : `Upgrade to ${plan.name}`}
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-3 rounded-xl text-sm font-semibold bg-slate-700/50 text-slate-400 cursor-default"
                >
                  Free Forever
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Feature Comparison</h2>
        <div className="glass-card rounded-xl overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-6 py-4 text-slate-400 font-medium">Feature</th>
                <th className="text-center px-4 py-4 text-slate-400 font-medium">Free</th>
                <th className="text-center px-4 py-4 text-amber-400 font-medium">Pro</th>
                <th className="text-center px-4 py-4 text-emerald-400 font-medium">Academy</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Player Profile", free: true, pro: true, academy: true },
                { name: "Community Feed", free: true, pro: true, academy: true },
                { name: "Leaderboard", free: true, pro: true, academy: true },
                { name: "Live Streaming (View)", free: true, pro: true, academy: true },
                { name: "Basic Training Videos", free: true, pro: true, academy: true },
                { name: "AI Coach", free: "3/day", pro: true, academy: true },
                { name: "Video Analysis", free: false, pro: true, academy: true },
                { name: "Idol Training Routines", free: false, pro: true, academy: true },
                { name: "Pro Scouting", free: false, pro: true, academy: true },
                { name: "Compare Players", free: false, pro: true, academy: true },
                { name: "Squad Builder", free: false, pro: true, academy: true },
                { name: "Strategy Tools", free: false, pro: true, academy: true },
                { name: "Upload Drills", free: false, pro: true, academy: true },
                { name: "Payment Collection", free: false, pro: false, academy: true },
                { name: "Attendance Tracking", free: false, pro: false, academy: true },
                { name: "Roster Management", free: false, pro: false, academy: true },
                { name: "Progress Reports", free: false, pro: false, academy: true },
              ].map((row) => (
                <tr key={row.name} className="border-b border-slate-700/30">
                  <td className="px-6 py-3 text-slate-300">{row.name}</td>
                  {[row.free, row.pro, row.academy].map((val, ci) => (
                    <td key={ci} className="text-center px-4 py-3">
                      {val === true ? (
                        <svg className="w-5 h-5 text-emerald-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : val === false ? (
                        <span className="text-slate-600">—</span>
                      ) : (
                        <span className="text-amber-400 text-xs font-medium">{val}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-slate-500 text-sm">
          All plans include a 14-day free trial. No credit card required to start.
        </p>
        <p className="text-slate-500 text-sm mt-1">
          Questions?{" "}
          <Link href="/community" className="text-amber-400 hover:text-amber-300">
            Ask in the community
          </Link>
        </p>
      </div>
    </div>
  );
}
