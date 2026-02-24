"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { players } from "@/data/mock";

type Product = {
  id: string;
  name: string;
  category: "Bats" | "Balls" | "Gloves" | "Pads" | "Helmets" | "Bags" | "Kits" | "Accessories";
  price: number;
  brand: string;
  rating: number;
};

const productsData: Product[] = [
  { id: "p1", name: "Pro English Willow Bat", category: "Bats", price: 349, brand: "CH Pro", rating: 5 },
  { id: "p2", name: "Club Kashmir Willow Bat", category: "Bats", price: 119, brand: "StreetX", rating: 4 },
  { id: "p3", name: "Match Leather Ball (6 pack)", category: "Balls", price: 89, brand: "SeamPro", rating: 4 },
  { id: "p4", name: "Training Tennis Ball (12 pack)", category: "Balls", price: 24, brand: "PlayOn", rating: 4 },
  { id: "p5", name: "Pro Batting Gloves", category: "Gloves", price: 69, brand: "GripMax", rating: 5 },
  { id: "p6", name: "Leg Guards (Youth)", category: "Pads", price: 79, brand: "ShieldX", rating: 4 },
  { id: "p7", name: "Lightweight Helmet", category: "Helmets", price: 99, brand: "GuardPro", rating: 5 },
  { id: "p8", name: "Wheelie Kit Bag", category: "Bags", price: 119, brand: "CarryAll", rating: 4 },
  { id: "p9", name: "Starter Kit (Bat+Pads+Gloves)", category: "Kits", price: 229, brand: "StreetX", rating: 4 },
  { id: "p10", name: "Grip & Tape Set", category: "Accessories", price: 19, brand: "GripMax", rating: 4 },
];

const categories: Product["category"][] = ["Bats", "Balls", "Gloves", "Pads", "Helmets", "Bags", "Kits", "Accessories"];

const roleRecommendations: Record<string, Product["category"][]> = {
  Batsman: ["Bats", "Gloves", "Pads"],
  Bowler: ["Balls", "Accessories"],
  "All-Rounder": ["Bats", "Balls", "Gloves", "Accessories"],
  "Wicket Keeper": ["Gloves", "Pads", "Helmets"],
};

export default function StorePage() {
  const { user } = useAuth();
  const playerRole = players.find(p => p.name.toLowerCase().includes((user?.name || "").split(" ")[0]?.toLowerCase()))?.role || "All-Rounder";
  const recCats = roleRecommendations[playerRole] || ["Bats", "Balls", "Gloves"];
  const recommended = productsData.filter(p => recCats.includes(p.category)).slice(0, 4);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Product["category"] | "All">("All");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardAnswers, setWizardAnswers] = useState<string[]>([]);
  const wizardQuestions = [
    { q: "What's your primary role?", opts: ["Batsman", "Bowler", "All-Rounder", "Wicket Keeper"] },
    { q: "What's your level?", opts: ["Beginner", "Intermediate", "Advanced", "Professional"] },
    { q: "What's your budget?", opts: ["Under $50", "$50-$150", "$150-$300", "$300+"] },
  ];
  const wizardResults = useMemo(() => {
    if (wizardAnswers.length < 3) return [];
    const roleCats = roleRecommendations[wizardAnswers[0]] || ["Bats", "Balls"];
    const budgetMax = wizardAnswers[2] === "Under $50" ? 50 : wizardAnswers[2] === "$50-$150" ? 150 : wizardAnswers[2] === "$150-$300" ? 300 : 9999;
    const budgetMin = wizardAnswers[2] === "$300+" ? 300 : 0;
    return productsData.filter(p => roleCats.includes(p.category) && p.price >= budgetMin && p.price <= budgetMax);
  }, [wizardAnswers]);

  const products = useMemo(() => {
    let list = productsData;
    if (cat !== "All") list = list.filter((p) => p.category === cat);
    if (query) list = list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase()));
    return list;
  }, [query, cat]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-3"><Link href="/players?tab=store" className="text-sm text-slate-400 hover:text-white">← Back to Store</Link></div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">Merchandise Store</h1>
          <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/30">Cricket bats, balls & equipment</span>
        </div>
        <p className="text-slate-400">Browse gear for every level from street to elite.</p>
      </div>

      <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide">Recommended for You</h2>
            <p className="text-xs text-slate-500">Based on your role: {playerRole}</p>
          </div>
          <button onClick={() => { setWizardOpen(!wizardOpen); setWizardStep(0); setWizardAnswers([]); }} className="text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-lg transition-colors">
            {wizardOpen ? "Close" : "Not sure what to get?"}
          </button>
        </div>
        {wizardOpen ? (
          <div className="bg-slate-900/50 rounded-xl p-4">
            {wizardStep < 3 ? (
              <div>
                <p className="text-sm text-white font-medium mb-3">{wizardQuestions[wizardStep].q}</p>
                <div className="flex flex-wrap gap-2">
                  {wizardQuestions[wizardStep].opts.map(opt => (
                    <button key={opt} onClick={() => { setWizardAnswers([...wizardAnswers.slice(0, wizardStep), opt]); setWizardStep(wizardStep + 1); }} className="text-xs bg-slate-700/50 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 px-3 py-1.5 rounded-lg border border-slate-600/50 hover:border-emerald-500/30 transition-all">{opt}</button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-emerald-400 font-medium mb-2">We recommend:</p>
                {wizardResults.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {wizardResults.map(p => (
                      <div key={p.id} className="bg-slate-800/80 rounded-lg p-3 border border-emerald-500/20">
                        <p className="text-xs text-white font-medium truncate">{p.name}</p>
                        <p className="text-xs text-emerald-400 font-semibold">${p.price}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No exact matches — try adjusting your budget.</p>
                )}
                <button onClick={() => { setWizardStep(0); setWizardAnswers([]); }} className="mt-2 text-xs text-slate-400 hover:text-white">Start Over</button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {recommended.map(p => (
              <div key={p.id} className="bg-slate-800/50 rounded-xl p-3 border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full">Coach Pick</span>
                </div>
                <p className="text-xs text-white font-medium truncate">{p.name}</p>
                <p className="text-[10px] text-slate-500">{p.brand}</p>
                <p className="text-sm text-emerald-400 font-semibold mt-1">${p.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value as Product["category"] | "All")}
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <p className="text-sm text-slate-500 self-center">Showing {products.length} item(s)</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-emerald-500/40 transition-all">
            <div className="h-28 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 mb-3 flex items-center justify-center text-slate-300 text-sm">{p.category}</div>
            <div className="min-w-0">
              <p className="text-white font-medium truncate">{p.name}</p>
              <p className="text-xs text-slate-500">{p.brand}</p>
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-emerald-400 font-semibold">${p.price}</span>
              <span className="text-xs text-slate-400">{"★".repeat(p.rating)}{"☆".repeat(5 - p.rating)}</span>
            </div>
            <button className="mt-3 w-full text-sm bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded-md">Add to Cart</button>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-500">No items found</p>
        </div>
      )}
    </div>
  );
}
