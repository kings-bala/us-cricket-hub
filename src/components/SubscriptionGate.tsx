"use client";

import Link from "next/link";
import { useSubscription, Feature, PLANS } from "@/context/SubscriptionContext";

interface SubscriptionGateProps {
  feature: Feature;
  children: React.ReactNode;
  fallbackMessage?: string;
}

const featureLabels: Record<Feature, string> = {
  ai_coach_unlimited: "Unlimited AI Coach",
  video_analysis: "Advanced Video Analysis",
  idol_training: "Idol Training Routines",
  pro_scouting: "Pro Scouting Dashboard",
  compare_players: "Compare Players",
  squad_builder: "Squad Builder",
  strategy_tools: "Match Strategy Tools",
  drills_upload: "Upload & Share Drills",
  payment_management: "Payment Management",
  attendance: "Attendance Tracking",
  roster_management: "Roster Management",
  reports: "Progress Reports",
  bulk_invites: "Bulk Invites",
  selector_tools: "Selector Tools",
};

const featureMinTier: Record<Feature, "pro" | "academy"> = {
  ai_coach_unlimited: "pro",
  video_analysis: "pro",
  idol_training: "pro",
  pro_scouting: "pro",
  compare_players: "pro",
  squad_builder: "pro",
  strategy_tools: "pro",
  drills_upload: "pro",
  selector_tools: "pro",
  payment_management: "academy",
  attendance: "academy",
  roster_management: "academy",
  reports: "academy",
  bulk_invites: "academy",
};

export default function SubscriptionGate({ feature, children, fallbackMessage }: SubscriptionGateProps) {
  const { hasFeature } = useSubscription();

  if (hasFeature(feature)) {
    return <>{children}</>;
  }

  const requiredTier = featureMinTier[feature];
  const plan = PLANS.find((p) => p.id === requiredTier);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">{featureLabels[feature]}</h2>
        <p className="text-slate-400 mb-6">
          {fallbackMessage || `This feature requires a ${plan?.name} subscription. Upgrade to unlock ${featureLabels[feature].toLowerCase()} and more.`}
        </p>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors"
        >
          View Plans
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        <p className="text-xs text-slate-500 mt-4">
          Starting at ${plan?.price}/month
        </p>
      </div>
    </div>
  );
}

export function InlineUpgradePrompt({ feature, message }: { feature: Feature; message?: string }) {
  const { hasFeature } = useSubscription();
  if (hasFeature(feature)) return null;

  const requiredTier = featureMinTier[feature];
  const plan = PLANS.find((p) => p.id === requiredTier);

  return (
    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-amber-400">
          {message || `Upgrade to ${plan?.name} to unlock this feature`}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">Starting at ${plan?.price}/month</p>
      </div>
      <Link
        href="/pricing"
        className="shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors"
      >
        Upgrade
      </Link>
    </div>
  );
}
