"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getItem, setItem } from "@/lib/storage";

type ProductCategory = "Apparel" | "Accessories" | "Bags" | "Training" | "Drinkware";

interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  description: string;
  rating: number;
  inStock: boolean;
}

interface CartItem {
  productId: string;
  quantity: number;
}

const PRODUCTS: Product[] = [
  { id: "rs1", name: "Rising Star Official Jersey", category: "Apparel", price: 59, description: "Official match-day jersey with embroidered Rising Star crest", rating: 5, inStock: true },
  { id: "rs2", name: "Rising Star Training Tee", category: "Apparel", price: 35, description: "Moisture-wicking training shirt in team colors", rating: 4, inStock: true },
  { id: "rs3", name: "Rising Star Polo Shirt", category: "Apparel", price: 45, description: "Classic polo with Rising Star logo", rating: 5, inStock: true },
  { id: "rs4", name: "Rising Star Hoodie", category: "Apparel", price: 65, description: "Warm fleece hoodie with embroidered logo", rating: 5, inStock: true },
  { id: "rs5", name: "Rising Star Track Pants", category: "Apparel", price: 40, description: "Comfortable training track pants", rating: 4, inStock: true },
  { id: "rs6", name: "Rising Star Cap", category: "Accessories", price: 25, description: "Adjustable cap with embroidered Rising Star logo", rating: 5, inStock: true },
  { id: "rs7", name: "Rising Star Wristband Set", category: "Accessories", price: 12, description: "Pack of 2 sweat-wicking wristbands in team colors", rating: 4, inStock: true },
  { id: "rs8", name: "Rising Star Sunglasses", category: "Accessories", price: 30, description: "UV-protected cricket sunglasses with Rising Star branding", rating: 4, inStock: true },
  { id: "rs9", name: "Rising Star Water Bottle", category: "Drinkware", price: 18, description: "750ml insulated bottle with Rising Star logo", rating: 5, inStock: true },
  { id: "rs10", name: "Rising Star Travel Mug", category: "Drinkware", price: 22, description: "Stainless steel travel mug with team crest", rating: 4, inStock: true },
  { id: "rs11", name: "Rising Star Kit Bag", category: "Bags", price: 85, description: "Large wheelie kit bag with Rising Star branding", rating: 5, inStock: true },
  { id: "rs12", name: "Rising Star Backpack", category: "Bags", price: 55, description: "Padded backpack with bat compartment", rating: 5, inStock: true },
  { id: "rs13", name: "Rising Star Duffle Bag", category: "Bags", price: 45, description: "Compact duffle for training sessions", rating: 4, inStock: true },
  { id: "rs14", name: "Training Cones (12 pack)", category: "Training", price: 20, description: "Bright colored cones for fielding drills", rating: 4, inStock: true },
  { id: "rs15", name: "Resistance Bands Set", category: "Training", price: 28, description: "5-band set for cricket-specific conditioning", rating: 4, inStock: true },
  { id: "rs16", name: "Cricket Bat Sticker Set", category: "Accessories", price: 8, description: "Official Rising Star bat stickers and decals", rating: 4, inStock: true },
];

const CATEGORIES: ProductCategory[] = ["Apparel", "Accessories", "Drinkware", "Bags", "Training"];

const categoryIcons: Record<ProductCategory, string> = {
  Apparel: "\uD83D\uDC55",
  Accessories: "\uD83E\uDDE2",
  Drinkware: "\uD83E\uDD64",
  Bags: "\uD83C\uDF92",
  Training: "\uD83C\uDFCB\uFE0F",
};

export default function StorePage() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<ProductCategory | "All">("All");
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    return getItem<CartItem[]>("store_cart", []);
  });
  const [showCart, setShowCart] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "shipping" | "confirmation">("cart");

  const products = useMemo(() => {
    let list: Product[] = PRODUCTS;
    if (cat !== "All") list = list.filter((p) => p.category === cat);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return list;
  }, [query, cat]);

  const featured = PRODUCTS.filter((p) => p.rating === 5).slice(0, 4);

  const addToCart = useCallback(
    (productId: string) => {
      const updated = [...cart];
      const existing = updated.find((c) => c.productId === productId);
      if (existing) {
        existing.quantity++;
      } else {
        updated.push({ productId, quantity: 1 });
      }
      setCart(updated);
      setItem("store_cart", updated);
    },
    [cart]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      const updated = cart.filter((c) => c.productId !== productId);
      setCart(updated);
      setItem("store_cart", updated);
    },
    [cart]
  );

  const updateQuantity = useCallback(
    (productId: string, qty: number) => {
      if (qty < 1) return removeFromCart(productId);
      const updated = cart.map((c) => (c.productId === productId ? { ...c, quantity: qty } : c));
      setCart(updated);
      setItem("store_cart", updated);
    },
    [cart, removeFromCart]
  );

  const cartTotal = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const product = PRODUCTS.find((p) => p.id === item.productId);
        return sum + (product?.price || 0) * item.quantity;
      }, 0),
    [cart]
  );

  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const placeOrder = () => {
    setCart([]);
    setItem("store_cart", []);
    setCheckoutStep("confirmation");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-3">
        <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white">&larr; Dashboard</Link>
      </div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">Rising Star Store</h1>
            <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full border border-amber-500/30">Official Merchandise</span>
          </div>
          <p className="text-slate-400">Official Rising Star Cricket League gear and merchandise.</p>
        </div>
        <button
          onClick={() => { setShowCart(true); setCheckoutStep("cart"); }}
          className="relative flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
        >
          <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <span className="text-sm text-white">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-500 rounded-full text-xs font-bold text-white flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wide">Featured Products</h2>
            <p className="text-xs text-slate-500">Top-rated Rising Star gear</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {featured.map((p) => (
            <div key={p.id} className="bg-slate-800/50 rounded-xl p-3 border border-amber-500/20 hover:border-amber-500/40 transition-all cursor-pointer" onClick={() => addToCart(p.id)}>
              <div className="h-20 rounded-lg bg-gradient-to-br from-amber-900/30 to-orange-900/30 mb-2 flex items-center justify-center">
                <span className="text-2xl">{categoryIcons[p.category]}</span>
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
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value as ProductCategory | "All")}
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
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
              <span className="text-3xl">{categoryIcons[p.category]}</span>
            </div>
            <div className="min-w-0">
              <p className="text-white font-medium truncate">{p.name}</p>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{p.description}</p>
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-amber-400 font-semibold">${p.price}</span>
              <span className="text-xs text-slate-400">{"\u2605".repeat(p.rating)}{"\u2606".repeat(5 - p.rating)}</span>
            </div>
            <button
              onClick={() => addToCart(p.id)}
              className="mt-3 w-full text-sm bg-amber-600 hover:bg-amber-700 text-white py-1.5 rounded-md transition-colors"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-500">No items found</p>
        </div>
      )}

      {showCart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowCart(false)}>
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-lg w-full mx-4 shadow-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {checkoutStep === "cart" ? "Shopping Cart" : checkoutStep === "shipping" ? "Checkout" : "Order Confirmed"}
              </h3>
              <button onClick={() => setShowCart(false)} className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6">
              {checkoutStep === "confirmation" ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Order Placed!</h4>
                  <p className="text-slate-400 text-sm">Order #{Date.now().toString(36).toUpperCase()}</p>
                  <p className="text-slate-400 text-sm mt-1">You&apos;ll receive a confirmation email shortly.</p>
                  <button onClick={() => setShowCart(false)} className="mt-6 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors">
                    Continue Shopping
                  </button>
                </div>
              ) : checkoutStep === "shipping" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                    <input type="text" defaultValue={user?.name || ""} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Email</label>
                    <input type="email" defaultValue={user?.email || ""} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Shipping Address</label>
                    <textarea rows={3} placeholder="Street, City, State, ZIP" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none" />
                  </div>
                  <div className="border-t border-slate-700 pt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Subtotal</span>
                      <span className="text-white">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Shipping</span>
                      <span className="text-emerald-400">Free</span>
                    </div>
                    <div className="flex justify-between text-base font-semibold mt-2 pt-2 border-t border-slate-700">
                      <span className="text-white">Total</span>
                      <span className="text-amber-400">${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setCheckoutStep("cart")} className="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-400 text-sm hover:bg-slate-700/50 transition-colors">Back</button>
                    <button onClick={placeOrder} className="flex-1 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors">
                      Place Order
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-500">Your cart is empty</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 mb-4">
                        {cart.map((item) => {
                          const product = PRODUCTS.find((p) => p.id === item.productId);
                          if (!product) return null;
                          return (
                            <div key={item.productId} className="flex items-center gap-3 bg-slate-900/50 rounded-lg p-3">
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-900/30 to-orange-900/30 flex items-center justify-center shrink-0">
                                <span className="text-lg">{categoryIcons[product.category]}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-medium truncate">{product.name}</p>
                                <p className="text-sm text-amber-400">${product.price}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-7 h-7 rounded bg-slate-700 text-white text-sm flex items-center justify-center hover:bg-slate-600">-</button>
                                <span className="text-sm text-white w-6 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-7 h-7 rounded bg-slate-700 text-white text-sm flex items-center justify-center hover:bg-slate-600">+</button>
                              </div>
                              <button onClick={() => removeFromCart(item.productId)} className="text-red-400 hover:text-red-300">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                      <div className="border-t border-slate-700 pt-4">
                        <div className="flex justify-between text-base font-semibold mb-4">
                          <span className="text-white">Total</span>
                          <span className="text-amber-400">${cartTotal.toFixed(2)}</span>
                        </div>
                        <button onClick={() => setCheckoutStep("shipping")} className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors">
                          Proceed to Checkout
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
