"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

type FeeType = "monthly" | "quarterly" | "1on1" | "2on1";
type PlayerLevel = "Beginner" | "Intermediate" | "Advanced";

interface FeeStructure {
  id: FeeType;
  label: string;
  amounts: Record<PlayerLevel, number>;
  description: string;
  interval: string;
}

interface StudentFee {
  studentId: string;
  studentName: string;
  avatar: string;
  feeType: FeeType;
  amount: number;
  dueDate: string;
  status: "paid" | "due" | "overdue" | "upcoming";
  paidDate?: string;
  receiptId?: string;
}

interface PaymentRecord {
  id: string;
  studentName: string;
  feeType: FeeType;
  amount: number;
  date: string;
  status: "succeeded" | "pending" | "failed";
  receiptId: string;
  method: string;
}

const LEVELS: PlayerLevel[] = ["Beginner", "Intermediate", "Advanced"];
const levelColors: Record<PlayerLevel, string> = {
  Beginner: "text-blue-400 bg-blue-500/20 border-blue-500/30",
  Intermediate: "text-amber-400 bg-amber-500/20 border-amber-500/30",
  Advanced: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30",
};

const FEE_STRUCTURES: FeeStructure[] = [
  { id: "monthly", label: "Monthly Training", amounts: { Beginner: 50, Intermediate: 75, Advanced: 100 }, description: "Full access to group training sessions, 4x per week", interval: "month" },
  { id: "quarterly", label: "Quarterly Package", amounts: { Beginner: 130, Intermediate: 200, Advanced: 275 }, description: "3-month training package with combine assessment included", interval: "quarter" },
  { id: "1on1", label: "1:1 Private Session", amounts: { Beginner: 30, Intermediate: 40, Advanced: 55 }, description: "One-on-one coaching session with certified coach (1 hour)", interval: "session" },
  { id: "2on1", label: "2:1 Group Session", amounts: { Beginner: 20, Intermediate: 30, Advanced: 40 }, description: "Two students per coach session for focused training (1 hour)", interval: "session" },
];

const MOCK_STUDENT_FEES: StudentFee[] = [
  { studentId: "p1", studentName: "Arjun Patel", avatar: "/avatars/player1.jpg", feeType: "monthly", amount: 75, dueDate: "2026-02-28", status: "due" },
  { studentId: "p2", studentName: "Jake Thompson", avatar: "", feeType: "monthly", amount: 75, dueDate: "2026-02-28", status: "paid", paidDate: "2026-02-15", receiptId: "REC-2026-0215" },
  { studentId: "p3", studentName: "Rashid Mohammed", avatar: "", feeType: "quarterly", amount: 200, dueDate: "2026-03-01", status: "upcoming" },
  { studentId: "p4", studentName: "Kieron Baptiste", avatar: "", feeType: "monthly", amount: 75, dueDate: "2026-02-15", status: "overdue" },
  { studentId: "p5", studentName: "Sipho Ndlovu", avatar: "", feeType: "1on1", amount: 40, dueDate: "2026-02-20", status: "paid", paidDate: "2026-02-20", receiptId: "REC-2026-0220" },
  { studentId: "p8", studentName: "Rahul Desai", avatar: "", feeType: "monthly", amount: 75, dueDate: "2026-02-28", status: "due" },
  { studentId: "p12", studentName: "Aarav Gupta", avatar: "", feeType: "2on1", amount: 30, dueDate: "2026-02-22", status: "paid", paidDate: "2026-02-22", receiptId: "REC-2026-0222" },
  { studentId: "p13", studentName: "Navjot Gill", avatar: "", feeType: "monthly", amount: 75, dueDate: "2026-02-28", status: "due" },
  { studentId: "p10", studentName: "Neel Sharma", avatar: "", feeType: "monthly", amount: 75, dueDate: "2026-02-28", status: "due" },
  { studentId: "p10", studentName: "Neel Sharma", avatar: "", feeType: "1on1", amount: 40, dueDate: "2026-03-05", status: "upcoming" },
];

const MOCK_PAYMENTS: PaymentRecord[] = [
  { id: "pay_1", studentName: "Aarav Gupta", feeType: "2on1", amount: 30, date: "2026-02-22", status: "succeeded", receiptId: "REC-2026-0222", method: "Visa ****4242" },
  { id: "pay_2", studentName: "Sipho Ndlovu", feeType: "1on1", amount: 40, date: "2026-02-20", status: "succeeded", receiptId: "REC-2026-0220", method: "Mastercard ****8888" },
  { id: "pay_3", studentName: "Jake Thompson", feeType: "monthly", amount: 75, date: "2026-02-15", status: "succeeded", receiptId: "REC-2026-0215", method: "Visa ****1234" },
  { id: "pay_4", studentName: "Arjun Patel", feeType: "monthly", amount: 75, date: "2026-01-28", status: "succeeded", receiptId: "REC-2026-0128", method: "Amex ****5678" },
  { id: "pay_5", studentName: "Rashid Mohammed", feeType: "quarterly", amount: 200, date: "2026-01-01", status: "succeeded", receiptId: "REC-2026-0101", method: "Visa ****9012" },
  { id: "pay_6", studentName: "Navjot Gill", feeType: "monthly", amount: 75, date: "2026-01-28", status: "succeeded", receiptId: "REC-2026-0128B", method: "Visa ****3456" },
  { id: "pay_7", studentName: "Neel Sharma", feeType: "monthly", amount: 75, date: "2026-01-28", status: "succeeded", receiptId: "REC-2026-0128C", method: "Visa ****7890" },
];

const statusConfig: Record<StudentFee["status"], { label: string; color: string; bg: string }> = {
  paid: { label: "Paid", color: "text-emerald-400", bg: "bg-emerald-500/20 border-emerald-500/30" },
  due: { label: "Due", color: "text-amber-400", bg: "bg-amber-500/20 border-amber-500/30" },
  overdue: { label: "Overdue", color: "text-red-400", bg: "bg-red-500/20 border-red-500/30" },
  upcoming: { label: "Upcoming", color: "text-blue-400", bg: "bg-blue-500/20 border-blue-500/30" },
};

const feeTypeLabels: Record<FeeType, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  "1on1": "1:1 Session",
  "2on1": "2:1 Session",
};

export default function PaymentsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "academy_admin";
  const hasAcademy = !!user?.academyId;
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "history" | "settings" | "card">(isAdmin ? "overview" : "overview");
  const [selectedFee, setSelectedFee] = useState<StudentFee | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showReceipt, setShowReceipt] = useState<PaymentRecord | null>(null);
  const [paymentConfirm, setPaymentConfirm] = useState<StudentFee | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [feeAmounts, setFeeAmounts] = useState<Record<FeeType, Record<PlayerLevel, number>>>(() => {
    const defaults: Record<FeeType, Record<PlayerLevel, number>> = {} as Record<FeeType, Record<PlayerLevel, number>>;
    FEE_STRUCTURES.forEach(f => { defaults[f.id] = { ...f.amounts }; });
    return defaults;
  });
  const [feeSaveMsg, setFeeSaveMsg] = useState("");
  const [reminderMsg, setReminderMsg] = useState("");
  const [autoPay, setAutoPay] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("cv360_auto_pay") === "true";
  });
  const [autoPayToast, setAutoPayToast] = useState("");
  const [savedCards, setSavedCards] = useState<{id: string; brand: string; last4: string; expMonth: number; expYear: number; isDefault: boolean}[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("cv360_saved_cards");
    if (stored) try { return JSON.parse(stored); } catch { return []; }
    return [];
  });
  const [cardForm, setCardForm] = useState({ number: "", expiry: "", cvc: "", name: "" });
  const [cardSaving, setCardSaving] = useState(false);
  const [cardMsg, setCardMsg] = useState("");
  const toggleAutoPay = () => {
    const next = !autoPay;
    setAutoPay(next);
    try { localStorage.setItem("cv360_auto_pay", String(next)); } catch {}
    setAutoPayToast(next ? "Auto-pay enabled — your card will be charged on the due date" : "Auto-pay disabled");
    setTimeout(() => setAutoPayToast(""), 3000);
  };

  const flashReminderMsg = useCallback((msg: string) => {
    setReminderMsg(msg);
    setTimeout(() => setReminderMsg(""), 2500);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("cricverse360_fee_amounts");
    if (saved) {
      try { setFeeAmounts(JSON.parse(saved)); } catch {}
    }
  }, []);

  const handleFeeChange = useCallback((feeId: FeeType, level: PlayerLevel, value: number) => {
    setFeeAmounts(prev => ({ ...prev, [feeId]: { ...prev[feeId], [level]: value } }));
  }, []);

  const saveFeeAmounts = useCallback(() => {
    localStorage.setItem("cricverse360_fee_amounts", JSON.stringify(feeAmounts));
    setFeeSaveMsg("Saved!");
    setTimeout(() => setFeeSaveMsg(""), 2000);
  }, [feeAmounts]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">Please sign in to view payments</p>
          <Link href="/auth" className="mt-4 inline-block text-sm px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors">Sign In</Link>
        </div>
      </div>
    );
  }

  const saveCard = () => {
    if (!cardForm.number || !cardForm.expiry || !cardForm.cvc) { setCardMsg("Please fill all card fields"); setTimeout(() => setCardMsg(""), 2500); return; }
    setCardSaving(true);
    setTimeout(() => {
      const last4 = cardForm.number.replace(/\s/g, "").slice(-4);
      const [mm, yy] = cardForm.expiry.split("/");
      const brand = cardForm.number.startsWith("4") ? "Visa" : cardForm.number.startsWith("5") ? "Mastercard" : cardForm.number.startsWith("3") ? "Amex" : "Card";
      const newCard = { id: `card_${Date.now()}`, brand, last4, expMonth: Number(mm), expYear: 2000 + Number(yy), isDefault: savedCards.length === 0 };
      const updated = [...savedCards, newCard];
      setSavedCards(updated);
      try { localStorage.setItem("cv360_saved_cards", JSON.stringify(updated)); } catch {}
      setCardForm({ number: "", expiry: "", cvc: "", name: "" });
      setCardSaving(false);
      setCardMsg("Card saved successfully!");
      setTimeout(() => setCardMsg(""), 2500);
    }, 1500);
  };

  const removeCard = (cardId: string) => {
    const updated = savedCards.filter(c => c.id !== cardId);
    if (updated.length > 0 && !updated.some(c => c.isDefault)) updated[0].isDefault = true;
    setSavedCards(updated);
    try { localStorage.setItem("cv360_saved_cards", JSON.stringify(updated)); } catch {}
  };

  const setDefaultCard = (cardId: string) => {
    const updated = savedCards.map(c => ({ ...c, isDefault: c.id === cardId }));
    setSavedCards(updated);
    try { localStorage.setItem("cv360_saved_cards", JSON.stringify(updated)); } catch {}
  };

  const myFees = useMemo(() => {
    if (isAdmin) return MOCK_STUDENT_FEES;
    return MOCK_STUDENT_FEES.filter(f => f.studentId === user.playerId);
  }, [isAdmin, user.playerId]);

  const totalCollected = useMemo(() => MOCK_PAYMENTS.reduce((sum, p) => sum + (p.status === "succeeded" ? p.amount : 0), 0), []);
  const totalDue = useMemo(() => myFees.filter(f => f.status === "due" || f.status === "overdue").reduce((sum, f) => sum + f.amount, 0), [myFees]);
  const overdueCount = useMemo(() => myFees.filter(f => f.status === "overdue").length, [myFees]);
  const paidCount = useMemo(() => myFees.filter(f => f.status === "paid").length, [myFees]);

  const filteredFees = useMemo(() => {
    if (filterStatus === "all") return myFees;
    return myFees.filter(f => f.status === filterStatus);
  }, [myFees, filterStatus]);

  const handlePayNow = (fee: StudentFee) => {
    setPaymentConfirm(fee);
  };

  const confirmPayment = () => {
    if (!paymentConfirm) return;
    setPaymentProcessing(true);
    setTimeout(() => {
      setPaymentProcessing(false);
      setPaymentConfirm(null);
      setPaymentSuccess(`Payment of $${paymentConfirm.amount} for ${feeTypeLabels[paymentConfirm.feeType]} processed successfully! Receipt: REC-${Date.now().toString(36).toUpperCase()}`);
      setTimeout(() => setPaymentSuccess(null), 5000);
    }, 2000);
  };

  const initiateStripeCheckout = async (fee: StudentFee, _publishableKey: string) => {
    try {
      const backendUrl = typeof window !== "undefined" ? localStorage.getItem("cricverse360_api") : null;
      if (!backendUrl) {
        alert("Backend not configured. Payment processing requires the CricVerse360 backend.");
        return;
      }
      const res = await fetch(`${backendUrl}/payments/create-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: fee.studentId,
          studentName: fee.studentName,
          feeType: fee.feeType,
          amount: fee.amount,
          dueDate: fee.dueDate,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("Unable to connect to payment server. Please try again later.");
    }
    setSelectedFee(null);
  };

  const sendReminder = useCallback(async (fee: StudentFee) => {
    const backendUrl = typeof window !== "undefined" ? localStorage.getItem("cricverse360_api") : null;
    if (!backendUrl) {
      flashReminderMsg("Backend not configured. Set API URL in Settings.");
      return;
    }
    try {
      const res = await fetch(`${backendUrl}/payments/send-reminder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: fee.studentId,
          studentName: fee.studentName,
          feeType: fee.feeType,
          amount: fee.amount,
          dueDate: fee.dueDate,
        }),
      });
      if (res.ok) {
        flashReminderMsg(`Reminder sent to ${fee.studentName}`);
      } else {
        flashReminderMsg("Failed to send reminder.");
      }
    } catch {
      flashReminderMsg("Failed to send reminder.");
    }
  }, [flashReminderMsg]);

  const tabs = isAdmin
    ? [
        { id: "overview" as const, label: "Overview" },
        { id: "students" as const, label: "Student Fees" },
        { id: "history" as const, label: "Payment History" },
        { id: "settings" as const, label: "Settings" },
      ]
    : hasAcademy
    ? [
        { id: "overview" as const, label: "My Fees" },
        { id: "card" as const, label: "Payment Methods" },
        { id: "history" as const, label: "Payment History" },
      ]
    : [
        { id: "overview" as const, label: "Subscription" },
        { id: "card" as const, label: "Payment Methods" },
      ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6 animate-fade-up">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-400 mb-2">Billing</p>
            <h1 className="text-2xl font-bold">
              {isAdmin ? "Fee Management" : "My Payments"}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {isAdmin ? "Manage academy fees, track payments, and send reminders" : hasAcademy ? "View and pay your academy fees" : "Subscribe to CricVerse360 services"}
            </p>
          </div>
          <Link href={isAdmin ? "/admin" : "/players?tab=profile"} className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors">
            &larr; Back
          </Link>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`text-sm px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === t.id ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && !isAdmin && !hasAcademy && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-1">Individual Player Subscription</h2>
              <p className="text-sm text-slate-400">Choose a plan to access training sessions, AI analysis, and more.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: "Basic", price: 29, interval: "month", features: ["Group training 2x/week", "Community access", "Basic stats tracking", "Store discounts"] },
                { name: "Pro", price: 59, interval: "month", features: ["Group training 4x/week", "Full Track AI analysis", "1 private session/month", "Priority support", "Community access", "Advanced stats"] },
                { name: "Elite", price: 99, interval: "month", features: ["Unlimited group training", "Unlimited AI analysis", "2 private sessions/month", "Match strategy tools", "Scouting reports", "Priority support", "All Pro features"] },
              ].map(plan => (
                <div key={plan.name} className={`bg-slate-800/50 border rounded-xl p-5 flex flex-col ${plan.name === "Pro" ? "border-emerald-500/50 ring-1 ring-emerald-500/20" : "border-slate-700/50"}`}>
                  {plan.name === "Pro" && <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold mb-2">Most Popular</span>}
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <div className="mt-2 mb-4">
                    <span className="text-3xl font-bold text-white">${plan.price}</span>
                    <span className="text-sm text-slate-400">/{plan.interval}</span>
                  </div>
                  <ul className="space-y-2 flex-1 mb-4">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                        <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setActiveTab("card")}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${plan.name === "Pro" ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-slate-700 hover:bg-slate-600 text-slate-300"}`}
                  >
                    {savedCards.length > 0 ? "Subscribe" : "Add Card & Subscribe"}
                  </button>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Fee Schedule — Per-Session Rates</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left text-xs uppercase tracking-wider text-slate-400 pb-3 pr-4">Session Type</th>
                      {LEVELS.map(l => (
                        <th key={l} className="text-center text-xs uppercase tracking-wider pb-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full border ${levelColors[l]}`}>{l}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {FEE_STRUCTURES.filter(f => f.id === "1on1" || f.id === "2on1").map(fee => (
                      <tr key={fee.id} className="border-b border-slate-700/30">
                        <td className="py-3 pr-4">
                          <p className="text-sm font-semibold text-white">{fee.label}</p>
                          <p className="text-xs text-slate-400">{fee.description}</p>
                        </td>
                        {LEVELS.map(l => (
                          <td key={l} className="py-3 px-3 text-center">
                            <span className="text-lg font-bold text-white">${feeAmounts[fee.id]?.[l] ?? fee.amounts[l]}</span>
                            <span className="text-xs text-slate-500">/{fee.interval}</span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "overview" && (isAdmin || hasAcademy) && (
          <div className="space-y-6">
            {overdueCount > 0 && !isAdmin && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-400">You have {overdueCount} overdue payment{overdueCount > 1 ? "s" : ""}</p>
                  <p className="text-xs text-slate-400">Please settle outstanding fees to avoid service interruption.</p>
                </div>
              </div>
            )}

            {!isAdmin && (
              <div className="glass-card rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {autoPay ? (
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center">
                      <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">Auto-Pay {autoPay ? <span className="text-emerald-400 text-xs ml-1 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">Active</span> : null}</p>
                    <p className="text-xs text-slate-400">{autoPay ? "Your card will be charged automatically on due dates" : "Enable to never miss a payment"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {autoPayToast && <span className="text-xs text-emerald-400">{autoPayToast}</span>}
                  <button onClick={toggleAutoPay} className={`relative w-11 h-6 rounded-full transition-colors ${autoPay ? "bg-emerald-500" : "bg-slate-700"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${autoPay ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-card rounded-xl p-5">
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  {isAdmin ? "Total Collected" : "Total Paid"}
                </p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">${isAdmin ? totalCollected : MOCK_PAYMENTS.filter(p => p.studentName === user.name).reduce((s, p) => s + p.amount, 0)}</p>
                <p className="text-[10px] text-slate-500 mt-1">{isAdmin ? "This billing cycle" : "All time"}</p>
              </div>
              <div className="glass-card rounded-xl p-5">
                <p className="text-xs text-slate-500 uppercase tracking-wide">Outstanding</p>
                <p className="text-2xl font-bold text-amber-400 mt-1">${isAdmin ? totalDue : myFees.filter(f => f.status === "due").reduce((s, f) => s + f.amount, 0)}</p>
                <p className="text-[10px] text-slate-500 mt-1">{isAdmin ? `${myFees.filter(f => f.status === "due").length} students` : "Due this month"}</p>
              </div>
              {isAdmin && (
                <>
                  <div className="glass-card rounded-xl p-5">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Overdue</p>
                    <p className="text-2xl font-bold text-red-400 mt-1">{overdueCount}</p>
                    <p className="text-[10px] text-slate-500 mt-1">Need follow-up</p>
                  </div>
                  <div className="glass-card rounded-xl p-5">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Paid This Month</p>
                    <p className="text-2xl font-bold text-emerald-400 mt-1">{paidCount}/{myFees.length}</p>
                    <p className="text-[10px] text-slate-500 mt-1">Students up to date</p>
                  </div>
                </>
              )}
            </div>

            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Fee Schedule</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left text-xs uppercase tracking-wider text-slate-400 pb-3 pr-4">Fee Type</th>
                      {LEVELS.map(l => (
                        <th key={l} className="text-center text-xs uppercase tracking-wider pb-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full border ${levelColors[l]}`}>{l}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {FEE_STRUCTURES.map(fee => (
                      <tr key={fee.id} className="border-b border-slate-700/30">
                        <td className="py-3 pr-4">
                          <p className="text-sm font-semibold text-white">{fee.label}</p>
                          <p className="text-xs text-slate-400">{fee.description}</p>
                        </td>
                        {LEVELS.map(l => (
                          <td key={l} className="py-3 px-3 text-center">
                            <span className="text-lg font-bold text-white">${feeAmounts[fee.id]?.[l] ?? fee.amounts[l]}</span>
                            <span className="text-xs text-slate-500">/{fee.interval}</span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {!isAdmin && (
              <div className="glass-card rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Current Fees</h3>
                <div className="space-y-3">
                  {myFees.map((fee, i) => {
                    const sc = statusConfig[fee.status];
                    return (
                      <div key={i} className="flex items-center justify-between bg-slate-900/50 border border-slate-700/30 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                            {fee.studentName.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{feeTypeLabels[fee.feeType]}</p>
                            <p className="text-xs text-slate-400">Due: {fee.dueDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${sc.bg} ${sc.color}`}>{sc.label}</span>
                          <span className="text-lg font-bold text-white">${fee.amount}</span>
                          {(fee.status === "due" || fee.status === "overdue") && (
                            <button
                              onClick={() => handlePayNow(fee)}
                              disabled={!!selectedFee}
                              className="text-xs px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors disabled:opacity-50"
                            >
                              {selectedFee?.studentId === fee.studentId ? "Processing..." : "Pay Now"}
                            </button>
                          )}
                          {fee.status === "paid" && fee.receiptId && (
                            <button
                              onClick={() => setShowReceipt(MOCK_PAYMENTS.find(p => p.receiptId === fee.receiptId) || null)}
                              className="text-xs px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                            >
                              Receipt
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {isAdmin && (
              <div className="glass-card rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Quick Actions</h3>
                  {reminderMsg && <span className="text-xs text-slate-400">{reminderMsg}</span>}
                </div>
                <div className="grid md:grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      const overdue = myFees.filter(f => f.status === "overdue");
                      if (overdue.length === 0) { flashReminderMsg("No overdue fees."); return; }
                      overdue.forEach(f => sendReminder(f));
                    }}
                    className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-red-400">Send Overdue Reminders</p>
                      <p className="text-xs text-slate-400">{overdueCount} student{overdueCount !== 1 ? "s" : ""} overdue</p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      const due = myFees.filter(f => f.status === "due");
                      if (due.length === 0) { flashReminderMsg("No fees due."); return; }
                      due.forEach(f => sendReminder(f));
                    }}
                    className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl hover:bg-amber-500/20 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-amber-400">Send Due Reminders</p>
                      <p className="text-xs text-slate-400">{myFees.filter(f => f.status === "due").length} fees coming due</p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      const csv = ["Student,Fee Type,Amount,Due Date,Status,Paid Date"];
                      myFees.forEach(f => csv.push(`${f.studentName},${feeTypeLabels[f.feeType]},$${f.amount},${f.dueDate},${f.status},${f.paidDate || ""}`));
                      const blob = new Blob([csv.join("\n")], { type: "text/csv" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `cricverse360-fees-${new Date().toISOString().slice(0, 10)}.csv`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-blue-400">Export Report</p>
                      <p className="text-xs text-slate-400">Download CSV of all fees</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "students" && isAdmin && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs text-slate-400">Filter:</span>
              {["all", "due", "overdue", "paid", "upcoming"].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    filterStatus === s ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-slate-800/50 text-slate-400 border-slate-700/50 hover:text-white"
                  }`}
                >
                  {s === "all" ? "All" : statusConfig[s as StudentFee["status"]].label}
                </button>
              ))}
            </div>
            <div className="glass-card rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left text-xs text-slate-500 uppercase tracking-wide px-5 py-3">Student</th>
                    <th className="text-left text-xs text-slate-500 uppercase tracking-wide px-5 py-3">Fee Type</th>
                    <th className="text-left text-xs text-slate-500 uppercase tracking-wide px-5 py-3">Amount</th>
                    <th className="text-left text-xs text-slate-500 uppercase tracking-wide px-5 py-3">Due Date</th>
                    <th className="text-left text-xs text-slate-500 uppercase tracking-wide px-5 py-3">Status</th>
                    <th className="text-right text-xs text-slate-500 uppercase tracking-wide px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFees.map((fee, i) => {
                    const sc = statusConfig[fee.status];
                    return (
                      <tr key={i} className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            {fee.avatar ? (
                              <img src={fee.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                                {fee.studentName.split(" ").map(n => n[0]).join("")}
                              </div>
                            )}
                            <span className="text-sm text-white">{fee.studentName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-300">{feeTypeLabels[fee.feeType]}</td>
                        <td className="px-5 py-3 text-sm font-semibold text-white">${fee.amount}</td>
                        <td className="px-5 py-3 text-sm text-slate-400">{fee.dueDate}</td>
                        <td className="px-5 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${sc.bg} ${sc.color}`}>{sc.label}</span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {(fee.status === "due" || fee.status === "overdue") && (
                              <button onClick={() => sendReminder(fee)} className="text-xs px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors">
                                Remind
                              </button>
                            )}
                            {fee.status === "paid" && fee.receiptId && (
                              <button
                                onClick={() => setShowReceipt(MOCK_PAYMENTS.find(p => p.receiptId === fee.receiptId) || null)}
                                className="text-xs px-3 py-1 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
                              >
                                Receipt
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="glass-card rounded-xl overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left text-xs text-slate-500 uppercase tracking-wide px-5 py-3">Date</th>
                  {isAdmin && <th className="text-left text-xs text-slate-500 uppercase tracking-wide px-5 py-3">Student</th>}
                  <th className="text-left text-xs text-slate-500 uppercase tracking-wide px-5 py-3">Description</th>
                  <th className="text-left text-xs text-slate-500 uppercase tracking-wide px-5 py-3">Amount</th>
                  <th className="text-left text-xs text-slate-500 uppercase tracking-wide px-5 py-3">Method</th>
                  <th className="text-left text-xs text-slate-500 uppercase tracking-wide px-5 py-3">Status</th>
                  <th className="text-right text-xs text-slate-500 uppercase tracking-wide px-5 py-3">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {(isAdmin ? MOCK_PAYMENTS : MOCK_PAYMENTS.filter(p => p.studentName === user.name)).map(payment => (
                  <tr key={payment.id} className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3 text-sm text-slate-400">{payment.date}</td>
                    {isAdmin && <td className="px-5 py-3 text-sm text-white">{payment.studentName}</td>}
                    <td className="px-5 py-3 text-sm text-slate-300">{feeTypeLabels[payment.feeType]}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-white">${payment.amount}</td>
                    <td className="px-5 py-3 text-sm text-slate-400">{payment.method}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${
                        payment.status === "succeeded" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                        payment.status === "pending" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                        "bg-red-500/20 text-red-400 border-red-500/30"
                      }`}>
                        {payment.status === "succeeded" ? "Paid" : payment.status === "pending" ? "Pending" : "Failed"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => setShowReceipt(payment)}
                        className="text-xs px-3 py-1 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "card" && !isAdmin && (
          <div className="space-y-6">
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Saved Cards</h3>
                {cardMsg && <span className={`text-xs ${cardMsg.includes("success") ? "text-emerald-400" : "text-red-400"}`}>{cardMsg}</span>}
              </div>
              {savedCards.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-700/50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>
                  </div>
                  <p className="text-sm text-slate-400">No saved cards yet</p>
                  <p className="text-xs text-slate-500 mt-1">Add a card below to enable payments</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedCards.map(card => (
                    <div key={card.id} className={`flex items-center justify-between p-4 rounded-xl border ${card.isDefault ? "bg-emerald-500/5 border-emerald-500/30" : "bg-slate-900/50 border-slate-700/30"}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${card.brand === "Visa" ? "bg-blue-500/20 text-blue-400" : card.brand === "Mastercard" ? "bg-orange-500/20 text-orange-400" : card.brand === "Amex" ? "bg-indigo-500/20 text-indigo-400" : "bg-slate-700/50 text-slate-400"}`}>
                          {card.brand === "Visa" ? "VISA" : card.brand === "Mastercard" ? "MC" : card.brand === "Amex" ? "AMEX" : "CARD"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{card.brand} ****{card.last4}</p>
                          <p className="text-xs text-slate-400">Expires {String(card.expMonth).padStart(2, "0")}/{card.expYear}</p>
                        </div>
                        {card.isDefault && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Default</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        {!card.isDefault && (
                          <button onClick={() => setDefaultCard(card.id)} className="text-xs px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors">
                            Set Default
                          </button>
                        )}
                        <button onClick={() => removeCard(card.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Add New Card</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardForm.name}
                    onChange={e => setCardForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Card Number</label>
                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    value={cardForm.number}
                    onChange={e => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                      const formatted = v.replace(/(\d{4})(?=\d)/g, "$1 ");
                      setCardForm(prev => ({ ...prev, number: formatted }));
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      placeholder="12/28"
                      value={cardForm.expiry}
                      onChange={e => {
                        let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                        if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                        setCardForm(prev => ({ ...prev, expiry: v }));
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">CVC</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cardForm.cvc}
                      onChange={e => setCardForm(prev => ({ ...prev, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>
                <button
                  onClick={saveCard}
                  disabled={cardSaving}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors disabled:opacity-50 mt-2"
                >
                  {cardSaving ? "Saving..." : "Save Card"}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-3">Card details are stored securely. In production, this uses Stripe for PCI-compliant storage.</p>
            </div>
          </div>
        )}

        {activeTab === "settings" && isAdmin && (
          <div className="space-y-6">
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Stripe Configuration</h3>
              <p className="text-xs text-slate-400 mb-4">
                Connect your Stripe account to accept payments. As a nonprofit, apply at{" "}
                <a href="https://stripe.com/nonprofits" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300">
                  stripe.com/nonprofits
                </a>{" "}
                for fee waivers.
              </p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Stripe Publishable Key</label>
                  <input
                    type="text"
                    placeholder="pk_live_..."
                    defaultValue={typeof window !== "undefined" ? localStorage.getItem("cricverse360_stripe_pk") || "" : ""}
                    onChange={e => localStorage.setItem("cricverse360_stripe_pk", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Backend API URL</label>
                  <input
                    type="text"
                    placeholder="https://your-api.execute-api.us-east-1.amazonaws.com"
                    defaultValue={typeof window !== "undefined" ? localStorage.getItem("cricverse360_api") || "" : ""}
                    onChange={e => localStorage.setItem("cricverse360_api", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">The backend creates Stripe Checkout sessions securely using your secret key</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Fee Amounts</h3>
              <p className="text-xs text-slate-400 mb-4">Customize fee amounts by player level. Changes apply to new invoices only.</p>
              <div className="space-y-4">
                {FEE_STRUCTURES.map(fee => (
                  <div key={fee.id} className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-4">
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-white">{fee.label}</p>
                      <p className="text-xs text-slate-400">{fee.description}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {LEVELS.map(level => (
                        <div key={level}>
                          <label className={`block text-xs mb-1 font-medium ${levelColors[level].split(" ")[0]}`}>{level}</label>
                          <div className="flex items-center gap-1">
                            <span className="text-slate-500">$</span>
                            <input
                              type="number"
                              value={feeAmounts[fee.id]?.[level] ?? fee.amounts[level]}
                              onChange={e => handleFeeChange(fee.id, level, Number(e.target.value))}
                              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white text-right focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-4">
                <button onClick={saveFeeAmounts} className="text-xs px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors">
                  Save Changes
                </button>
                {feeSaveMsg && <span className="text-xs text-emerald-400 font-medium">{feeSaveMsg}</span>}
              </div>
            </div>

            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Reminder Settings</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm text-white">Auto-send due reminders</p>
                    <p className="text-xs text-slate-400">Send email 3 days before due date</p>
                  </div>
                  <div className="w-10 h-6 bg-emerald-500 rounded-full relative">
                    <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full" />
                  </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm text-white">Auto-send overdue reminders</p>
                    <p className="text-xs text-slate-400">Send email on day after due date</p>
                  </div>
                  <div className="w-10 h-6 bg-emerald-500 rounded-full relative">
                    <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full" />
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {paymentSuccess && (
          <div className="fixed top-4 right-4 z-50 bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 max-w-sm shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-sm text-emerald-400">{paymentSuccess}</p>
            </div>
          </div>
        )}

        {paymentConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Confirm Payment</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm"><span className="text-slate-400">Fee Type</span><span className="text-white font-medium">{feeTypeLabels[paymentConfirm.feeType]}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Amount</span><span className="text-emerald-400 font-bold text-lg">${paymentConfirm.amount}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Due Date</span><span className="text-white">{paymentConfirm.dueDate}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Student</span><span className="text-white">{paymentConfirm.studentName}</span></div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-3 mb-4">
                <p className="text-xs text-slate-400">Payment will be processed via your saved card ending in ****4242</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setPaymentConfirm(null)} disabled={paymentProcessing} className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors disabled:opacity-50">Cancel</button>
                <button onClick={confirmPayment} disabled={paymentProcessing} className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors disabled:opacity-50">
                  {paymentProcessing ? "Processing..." : "Confirm & Pay"}
                </button>
              </div>
            </div>
          </div>
        )}

        {showReceipt && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowReceipt(null)}>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Payment Receipt</h3>
                <button onClick={() => setShowReceipt(null)} className="text-slate-400 hover:text-white">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Receipt ID</span>
                  <span className="text-white font-mono">{showReceipt.receiptId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date</span>
                  <span className="text-white">{showReceipt.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Student</span>
                  <span className="text-white">{showReceipt.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Description</span>
                  <span className="text-white">{feeTypeLabels[showReceipt.feeType]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Method</span>
                  <span className="text-white">{showReceipt.method}</span>
                </div>
                <div className="border-t border-slate-700 pt-3 flex justify-between">
                  <span className="text-slate-400 font-semibold">Total</span>
                  <span className="text-emerald-400 font-bold text-lg">${showReceipt.amount}</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700/30 text-center">
                <p className="text-[10px] text-slate-500">CricVerse360 - NorCal Cricket Academy</p>
                <p className="text-[10px] text-slate-500">501(c)(3) Nonprofit Organization</p>
              </div>
              <button
                onClick={() => {
                  const text = `CricVerse360 Receipt\n${showReceipt.receiptId}\nDate: ${showReceipt.date}\nStudent: ${showReceipt.studentName}\nFee: ${feeTypeLabels[showReceipt.feeType]}\nAmount: $${showReceipt.amount}\nMethod: ${showReceipt.method}\nStatus: Paid`;
                  const blob = new Blob([text], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${showReceipt.receiptId}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="w-full mt-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors"
              >
                Download Receipt
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
