"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  category: "Apparel" | "Accessories" | "Drinkware" | "Bags" | "Training";
  price: number;
  description: string;
  rating: number;
};

const productsData: Product[] = [
  { id: "rs1", name: "Rising Star Official Jersey", category: "Apparel", price: 59, description: "Official match-day jersey with embroidered Rising Star crest", rating: 5 },
  { id: "rs2", name: "Rising Star Training Tee", category: "Apparel", price: 35, description: "Moisture-wicking training shirt in team colors", rating: 4 },
  { id: "rs3", name: "Rising Star Polo Shirt", category: "Apparel", price: 45, description: "Classic polo with Rising Star logo", rating: 5 },
  { id: "rs4", name: "Rising Star Hoodie", category: "Apparel", price: 65, description: "Warm fleece hoodie with embroidered logo", rating: 5 },
  { id: "rs5", name: "Rising Star Track Pants", category: "Apparel", price: 40, description: "Comfortable training track pants", rating: 4 },
  { id: "rs6", name: "Rising Star Cap", category: "Accessories", price: 25, description: "Adjustable cap with embroidered Rising Star logo", rating: 5 },
  { id: "rs7", name: "Rising Star Wristband Set", category: "Accessories", price: 12, description: "Pack of 2 sweat-wicking wristbands in team colors", rating: 4 },
  { id: "rs8", name: "Rising Star Sunglasses", category: "Accessories", price: 30, description: "UV-protected cricket sunglasses with Rising Star branding", rating: 4 },
  { id: "rs9", name: "Rising Star Water Bottle", category: "Drinkware", price: 18, description: "750ml insulated bottle with Rising Star logo", rating: 5 },
  { id: "rs10", name: "Rising Star Travel Mug", category: "Drinkware", price: 22, description: "Stainless steel travel mug with team crest", rating: 4 },
  { id: "rs11", name: "Rising Star Kit Bag", category: "Bags", price: 85, description: "Large wheelie kit bag with Rising Star branding", rating: 5 },
  { id: "rs12", name: "Rising Star Backpack", category: "Bags", price: 55, description: "Padded backpack with bat compartment", rating: 5 },
  { id: "rs13", name: "Rising Star Duffle Bag", category: "Bags", price: 45, description: "Compact duffle for training sessions", rating: 4 },
  { id: "rs14", name: "Rising Star Training Cones (12 pack)", category: "Training", price: 20, description: "Bright colored cones for fielding drills", rating: 4 },
  { id: "rs15", name: "Rising Star Resistance Bands Set", category: "Training", price: 28, description: "5-band set for cricket-specific conditioning", rating: 4 },
  { id: "rs16", name: "Rising Star Cricket Bat Sticker Set", category: "Accessories", price: 8, description: "Official Rising Star bat stickers and decals", rating: 4 },
];

const categories: Product["category"][] = ["Apparel", "Accessories", "Drinkware", "Bags", "Training"];

export default function StorePage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Product["category"] | "All">("All");

  const products = useMemo(() => {
    let list = productsData;
    if (cat !== "All") list = list.filter((p) => p.category === cat);
    if (query) list = list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase()));
    return list;
  }, [query, cat]);

  const featured = productsData.filter(p => p.rating === 5).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-3"><Link href="/dashboard" className="text-sm text-slate-400 hover:text-white">&larr; Dashboard</Link></div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">Rising Star Store</h1>
          <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full border border-amber-500/30">Official Merchandise</span>
        </div>
        <p className="text-slate-400">Official Rising Star Cricket League gear and merchandise.</p>
      </div>

      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wide">Featured Products</h2>
            <p className="text-xs text-slate-500">Top-rated Rising Star gear</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {featured.map(p => (
            <div key={p.id} className="bg-slate-800/50 rounded-xl p-3 border border-amber-500/20 hover:border-amber-500/40 transition-all">
              <div className="h-20 rounded-lg bg-gradient-to-br from-amber-900/30 to-orange-900/30 mb-2 flex items-center justify-center">
                <span className="text-2xl">
                  {p.category === "Apparel" ? "\uD83D\uDC55" : p.category === "Bags" ? "\uD83C\uDF92" : p.category === "Drinkware" ? "\uD83E\uDD64" : p.category === "Accessories" ? "\uD83E\uDDE2" : "\uD83C\uDFCF"}
                </span>
              </div>
              <p className="text-xs text-white font-medium truncate">{p.name}</p>
              <p className="text-sm text-amber-400 font-semibold mt-1">${p.price}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Search Rising Star products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value as Product["category"] | "All")}
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
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
          <div key={p.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-amber-500/40 transition-all">
            <div className="h-28 rounded-lg bg-gradient-to-br from-amber-900/20 to-orange-900/20 mb-3 flex items-center justify-center">
              <span className="text-3xl">
                {p.category === "Apparel" ? "\uD83D\uDC55" : p.category === "Bags" ? "\uD83C\uDF92" : p.category === "Drinkware" ? "\uD83E\uDD64" : p.category === "Training" ? "\uD83C\uDFCB\uFE0F" : p.category === "Accessories" ? "\uD83E\uDDE2" : "\uD83C\uDFCF"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white font-medium truncate">{p.name}</p>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{p.description}</p>
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-amber-400 font-semibold">${p.price}</span>
              <span className="text-xs text-slate-400">{"★".repeat(p.rating)}{"☆".repeat(5 - p.rating)}</span>
            </div>
            <button className="mt-3 w-full text-sm bg-amber-600 hover:bg-amber-700 text-white py-1.5 rounded-md transition-colors">Add to Cart</button>
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
