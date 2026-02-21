"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

type FeeType = "monthly" | "quarterly" | "1on1" | "2on1";

interface FeeStructure {
  id: FeeType;
  label: string;
  amount: number;
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

const FEE_STRUCTURES: FeeStructure[] = [
  { id: "monthly", label: "Monthly Training", amount: 75, description: "Full access to group training sessions, 4x per week", interval: "month" },
  { id: "quarterly", label: "Quarterly Package", amount: 200, description: "3-month training package with combine assessment included", interval: "quarter" },
  { id: "1on1", label: "1:1 Private Session", amount: 40, description: "One-on-one coaching session with certified coach (1 hour)", interval: "session" },
  { id: "2on1", label: "2:1 Group Session", amount: 30, description: "Two students per coach session for focused training (1 hour)", interval: "session" },
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
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "history" | "settings">(isAdmin ? "overview" : "overview");
  const [selectedFee, setSelectedFee] = useState<StudentFee | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showReceipt, setShowReceipt] = useState<PaymentRecord | null>(null);

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

  if (!isAdmin && !hasAcademy) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-lg font-semibold">Academy Members Only</p>
          <p className="text-sm text-slate-400 mt-2">Payments are available for players enrolled in an academy. Ask your academy admin for an invite code to join.</p>
          <Link href="/" className="mt-4 inline-block text-sm px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">&larr; Back to Home</Link>
        </div>
      </div>
    );
  }

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
    const stripeKey = typeof window !== "undefined" ? localStorage.getItem("cricverse360_stripe_pk") : null;
    if (!stripeKey) {
      alert("Stripe is not configured yet. Please ask your academy admin to set up Stripe keys in Settings.");
      return;
    }
    setSelectedFee(fee);
    initiateStripeCheckout(fee, stripeKey);
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

  const sendReminder = (fee: StudentFee) => {
    alert(`Reminder sent to ${fee.studentName}'s parent for $${fee.amount} ${feeTypeLabels[fee.feeType]} fee due ${fee.dueDate}`);
  };

  const tabs = isAdmin
    ? [
        { id: "overview" as const, label: "Overview" },
        { id: "students" as const, label: "Student Fees" },
        { id: "history" as const, label: "Payment History" },
        { id: "settings" as const, label: "Settings" },
      ]
    : [
        { id: "overview" as const, label: "My Fees" },
        { id: "history" as const, label: "Payment History" },
      ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              {isAdmin ? "Fee Management" : "My Payments"}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {isAdmin ? "Manage academy fees, track payments, and send reminders" : "View and pay your academy fees"}
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

        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  {isAdmin ? "Total Collected" : "Total Paid"}
                </p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">${isAdmin ? totalCollected : MOCK_PAYMENTS.filter(p => p.studentName === user.name).reduce((s, p) => s + p.amount, 0)}</p>
                <p className="text-[10px] text-slate-500 mt-1">{isAdmin ? "This billing cycle" : "All time"}</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <p className="text-xs text-slate-500 uppercase tracking-wide">Outstanding</p>
                <p className="text-2xl font-bold text-amber-400 mt-1">${isAdmin ? totalDue : myFees.filter(f => f.status === "due").reduce((s, f) => s + f.amount, 0)}</p>
                <p className="text-[10px] text-slate-500 mt-1">{isAdmin ? `${myFees.filter(f => f.status === "due").length} students` : "Due this month"}</p>
              </div>
              {isAdmin && (
                <>
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Overdue</p>
                    <p className="text-2xl font-bold text-red-400 mt-1">{overdueCount}</p>
                    <p className="text-[10px] text-slate-500 mt-1">Need follow-up</p>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Paid This Month</p>
                    <p className="text-2xl font-bold text-emerald-400 mt-1">{paidCount}/{myFees.length}</p>
                    <p className="text-[10px] text-slate-500 mt-1">Students up to date</p>
                  </div>
                </>
              )}
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Fee Schedule</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                {FEE_STRUCTURES.map(fee => (
                  <div key={fee.id} className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">{fee.label}</span>
                    </div>
                    <p className="text-2xl font-bold text-white">${fee.amount}<span className="text-xs text-slate-500 font-normal">/{fee.interval}</span></p>
                    <p className="text-xs text-slate-400 mt-2">{fee.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {!isAdmin && (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
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
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Quick Actions</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      const overdue = myFees.filter(f => f.status === "overdue");
                      if (overdue.length === 0) { alert("No overdue fees!"); return; }
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
                      if (due.length === 0) { alert("No fees due!"); return; }
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
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
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
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
            <table className="w-full">
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

        {activeTab === "settings" && isAdmin && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
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

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Fee Amounts</h3>
              <p className="text-xs text-slate-400 mb-4">Customize fee amounts for your academy. Changes apply to new invoices only.</p>
              <div className="grid md:grid-cols-2 gap-4">
                {FEE_STRUCTURES.map(fee => (
                  <div key={fee.id} className="flex items-center justify-between bg-slate-900/50 border border-slate-700/30 rounded-xl p-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{fee.label}</p>
                      <p className="text-xs text-slate-400">{fee.description}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">$</span>
                      <input
                        type="number"
                        defaultValue={fee.amount}
                        className="w-20 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white text-right focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-xs px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors">
                Save Changes
              </button>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
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
