"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { getItem, setItem } from "@/lib/storage";

export type SubscriptionTier = "free" | "pro" | "academy";

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: number;
  interval: "month";
  features: string[];
  stripePriceId: string;
}

export interface UserSubscription {
  tier: SubscriptionTier;
  status: "active" | "canceled" | "past_due" | "trialing";
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export const PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    interval: "month",
    stripePriceId: "",
    features: [
      "Basic player profile",
      "Community feed & leaderboard",
      "View live streaming",
      "Basic training videos",
      "3 AI Coach messages/day",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 9.99,
    interval: "month",
    stripePriceId: "price_pro_monthly",
    features: [
      "Everything in Free",
      "Unlimited AI Coach",
      "Advanced video analysis",
      "Idol training routines",
      "Pro scouting dashboard",
      "Compare players",
      "Squad builder & strategy tools",
      "Upload & share drills",
      "Priority support",
    ],
  },
  {
    id: "academy",
    name: "Academy",
    price: 29.99,
    interval: "month",
    stripePriceId: "price_academy_monthly",
    features: [
      "Everything in Pro",
      "Payment collection & tracking",
      "Attendance management",
      "Roster & staff management",
      "Progress reports",
      "Bulk player invites",
      "Academy branding",
      "Dedicated support",
    ],
  },
];

export type Feature =
  | "ai_coach_unlimited"
  | "video_analysis"
  | "idol_training"
  | "pro_scouting"
  | "compare_players"
  | "squad_builder"
  | "strategy_tools"
  | "drills_upload"
  | "payment_management"
  | "attendance"
  | "roster_management"
  | "reports"
  | "bulk_invites"
  | "selector_tools";

const PRO_FEATURES: Feature[] = [
  "ai_coach_unlimited",
  "video_analysis",
  "idol_training",
  "pro_scouting",
  "compare_players",
  "squad_builder",
  "strategy_tools",
  "drills_upload",
  "selector_tools",
];

const ACADEMY_FEATURES: Feature[] = [
  ...PRO_FEATURES,
  "payment_management",
  "attendance",
  "roster_management",
  "reports",
  "bulk_invites",
];

type SubscriptionContextType = {
  subscription: UserSubscription;
  hasFeature: (feature: Feature) => boolean;
  tier: SubscriptionTier;
  upgrade: (tier: SubscriptionTier) => void;
  cancelSubscription: () => void;
  isProOrAbove: boolean;
  isAcademy: boolean;
  aiCoachUsesToday: number;
  incrementAiCoachUse: () => void;
  canUseAiCoach: boolean;
};

const defaultSubscription: UserSubscription = {
  tier: "free",
  status: "active",
  currentPeriodEnd: "",
  cancelAtPeriodEnd: false,
};

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscription: defaultSubscription,
  hasFeature: () => false,
  tier: "free",
  upgrade: () => {},
  cancelSubscription: () => {},
  isProOrAbove: false,
  isAcademy: false,
  aiCoachUsesToday: 0,
  incrementAiCoachUse: () => {},
  canUseAiCoach: true,
});

const AI_COACH_FREE_LIMIT = 3;

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription>(defaultSubscription);
  const [aiCoachUsesToday, setAiCoachUsesToday] = useState(0);

  useEffect(() => {
    if (!user) {
      setSubscription(defaultSubscription);
      return;
    }
    const key = `sub_${user.email}`;
    const saved = getItem<UserSubscription | null>(key, null);
    if (saved) {
      setSubscription(saved);
    } else {
      const isAcademyRole = user.role === "academy_admin";
      const isCoachWithAcademy = user.role === "coach" && !!user.academyId;
      const initialTier: SubscriptionTier = isAcademyRole ? "academy" : isCoachWithAcademy ? "pro" : "free";
      const initial: UserSubscription = {
        tier: initialTier,
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
        cancelAtPeriodEnd: false,
      };
      setSubscription(initial);
      setItem(key, initial);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const today = new Date().toISOString().slice(0, 10);
    const usageKey = `ai_coach_usage_${user.email}_${today}`;
    const usage = getItem<number>(usageKey, 0);
    setAiCoachUsesToday(usage);
  }, [user]);

  const hasFeature = useCallback(
    (feature: Feature): boolean => {
      if (subscription.tier === "academy") return ACADEMY_FEATURES.includes(feature);
      if (subscription.tier === "pro") return PRO_FEATURES.includes(feature);
      return false;
    },
    [subscription.tier]
  );

  const upgrade = useCallback(
    (newTier: SubscriptionTier) => {
      if (!user) return;
      const updated: UserSubscription = {
        ...subscription,
        tier: newTier,
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
        cancelAtPeriodEnd: false,
      };
      setSubscription(updated);
      setItem(`sub_${user.email}`, updated);
    },
    [user, subscription]
  );

  const cancelSubscription = useCallback(() => {
    if (!user) return;
    const updated: UserSubscription = {
      ...subscription,
      cancelAtPeriodEnd: true,
    };
    setSubscription(updated);
    setItem(`sub_${user.email}`, updated);
  }, [user, subscription]);

  const incrementAiCoachUse = useCallback(() => {
    if (!user) return;
    const today = new Date().toISOString().slice(0, 10);
    const usageKey = `ai_coach_usage_${user.email}_${today}`;
    const newCount = aiCoachUsesToday + 1;
    setAiCoachUsesToday(newCount);
    setItem(usageKey, newCount);
  }, [user, aiCoachUsesToday]);

  const canUseAiCoach = subscription.tier !== "free" || aiCoachUsesToday < AI_COACH_FREE_LIMIT;
  const isProOrAbove = subscription.tier === "pro" || subscription.tier === "academy";
  const isAcademy = subscription.tier === "academy";

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        hasFeature,
        tier: subscription.tier,
        upgrade,
        cancelSubscription,
        isProOrAbove,
        isAcademy,
        aiCoachUsesToday,
        incrementAiCoachUse,
        canUseAiCoach,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}
