"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { UserRole } from "@/types";

const roleLabels: Record<UserRole, string> = {
  player: "Player",
  agent: "Agent",
  owner: "T20 Owner",
  sponsor: "Sponsor",
  coach: "Coach",
};

const roleColors: Record<UserRole, string> = {
  player: "bg-emerald-500",
  agent: "bg-blue-500",
  owner: "bg-purple-500",
  sponsor: "bg-amber-500",
  coach: "bg-teal-500",
};

type NavLink = { href: string; label: string; desc: string };
type NavGroup = { title: string; id: string; links: NavLink[] };

interface NavDropdownProps {
  label: string;
  links: { href: string; label: string; desc: string }[];
  open: string | null;
  setOpen: (v: string | null) => void;
  id: string;
}

function NavDropdown({ label, links, open, setOpen, id }: NavDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        if (open === id) setOpen(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, id, setOpen]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(open === id ? null : id)}
        className="flex items-center gap-1 text-sm text-slate-300 hover:text-white transition-colors"
      >
        {label}
        <svg className={`w-3.5 h-3.5 transition-transform ${open === id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open === id && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-2 z-50">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(null)}
              className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              {link.label}
              <span className="block text-xs text-slate-500 mt-0.5">{link.desc}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const personaGroups: Record<UserRole, NavGroup[]> = {
  player: [
    { title: "Essentials", id: "essentials", links: [
      { href: "/dashboard", label: "My Profile", desc: "Your profile & settings" },
      { href: "/performance-feed", label: "Performance Feed", desc: "Live insights" },
      { href: "/analyze", label: "Full Track AI", desc: "Video + AI insights" },
    ]},
    { title: "Stats", id: "stats", links: [
      { href: "/players", label: "Cricinfo", desc: "Stats & records" },
      { href: "/rankings", label: "CPI Metrics", desc: "Cricket Performance Index" },
      { href: "/combine", label: "Combine Assessment", desc: "Athletic testing" },
    ]},
    { title: "Training", id: "training", links: [
      { href: "/dashboard", label: "Idol Capture", desc: "Mirror routines & goals" },
      { href: "/dashboard", label: "Track Exercises", desc: "Planned workouts" },
      { href: "/coaches", label: "Connect with Coach", desc: "Find a coach" },
    ]},
    { title: "Store", id: "store", links: [
      { href: "/store", label: "Merchandise Store", desc: "Cricket gear & equipment" },
    ]},
  ],
  agent: [
    { title: "Stats", id: "stats", links: [
      { href: "/players", label: "Cricinfo", desc: "Stats & records" },
      { href: "/rankings", label: "CPI Metrics", desc: "Cricket Performance Index" },
      { href: "/combine", label: "Combine Assessment", desc: "Athletic testing" },
    ]},
    { title: "Tools", id: "tools", links: [
      { href: "/squad-builder", label: "Squad Builder", desc: "Build & analyze XI" },
      { href: "/scouting", label: "Pro Scouting", desc: "Advanced scouting" },
      { href: "/analyze", label: "AI Video Analysis", desc: "AI breakdowns" },
    ]},
  ],
  owner: [
    { title: "Stats", id: "stats", links: [
      { href: "/players", label: "Cricinfo", desc: "Stats & records" },
      { href: "/rankings", label: "CPI Metrics", desc: "Cricket Performance Index" },
      { href: "/combine", label: "Combine Assessment", desc: "Athletic testing" },
    ]},
    { title: "Tools", id: "tools", links: [
      { href: "/squad-builder", label: "Squad Builder", desc: "Build & analyze XI" },
      { href: "/scouting", label: "Pro Scouting", desc: "Advanced scouting" },
      { href: "/analyze", label: "AI Video Analysis", desc: "AI breakdowns" },
    ]},
  ],
  sponsor: [
    { title: "Discover", id: "discover", links: [
      { href: "/players", label: "Player Registry", desc: "Browse player profiles" },
    ]},
    { title: "Sponsorships", id: "sponsorships", links: [
      { href: "/sponsors", label: "Bat Sponsor", desc: "Partner with talent" },
      { href: "/sponsors", label: "Kit Sponsor", desc: "Team apparel" },
      { href: "/sponsors", label: "Training Sponsor", desc: "Academy & coaching" },
    ]},
  ],
  coach: [
    { title: "Stats", id: "stats", links: [
      { href: "/players", label: "Cricinfo", desc: "Stats & records" },
      { href: "/rankings", label: "CPI Metrics", desc: "Cricket Performance Index" },
      { href: "/combine", label: "Combine Assessment", desc: "Athletic testing" },
    ]},
    { title: "Tools", id: "tools", links: [
      { href: "/squad-builder", label: "Squad Builder", desc: "Build & analyze XI" },
      { href: "/scouting", label: "Pro Scouting", desc: "Advanced scouting" },
      { href: "/analyze", label: "AI Video Analysis", desc: "AI breakdowns" },
    ]},
  ],
};

export default function Navbar() {
  const [role, setRole] = useState<UserRole>("player");
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // load + persist persona
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("persona") : null;
    if (saved && ["player","agent","owner","sponsor","coach"].includes(saved)) setRole(saved as UserRole);
  }, []);
  useEffect(() => {
    try { localStorage.setItem("persona", role); } catch {}
  }, [role]);

  const groups = personaGroups[role];
  const flatLinks: { href: string; label: string }[] =
    role === "player"
      ? [
          { href: "/players?tab=profile", label: "Home" },
          { href: "/players?tab=mystats", label: "My Stats" },
          { href: "/players?tab=training", label: "Training" },
          { href: "/players?tab=ai", label: "Full Track AI" },
          { href: "/players?tab=store", label: "Store" },
        ]
      : groups.flatMap((g) => g.links.map(({ href, label }) => ({ href, label })));
  const pathname = usePathname();
  const search = useSearchParams();
  const currentPlayerTab = pathname === "/players" ? (search.get("tab") || "profile") : null;
  const showTabs = role === "player" ? pathname === "/players" : pathname === "/";

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-sm">
              CV
            </div>
            <span className="font-bold text-lg hidden sm:block">Cricket Verse</span>
          </Link>

                    {showTabs && (
                      <div className="hidden md:flex items-center gap-4">
                        {flatLinks.map((l) => {
                          const isActive = role === "player"
                            ? !!currentPlayerTab && l.href.includes(`tab=${currentPlayerTab}`)
                            : pathname === l.href || pathname.startsWith(l.href + "/");
                          return (
                            <Link
                              key={l.href}
                              href={l.href}
                              className={`text-sm px-1.5 pb-0.5 border-b-2 transition-colors ${
                                isActive ? "text-white border-emerald-500" : "text-slate-300 border-transparent hover:text-white"
                              }`}
                            >
                              {l.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-slate-400">View as:</span>
              <select
                value={role}
                onChange={(e) => { const r = e.target.value as UserRole; setRole(r); setMobileOpen(false); router.push("/"); }}
                className={`text-xs px-2 py-1 rounded-full text-white border-0 cursor-pointer ${roleColors[role]}`}
              >
                {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                  <option key={r} value={r} className="bg-slate-800">
                    {roleLabels[r]}
                  </option>
                ))}
              </select>
            </div>
            <Link
              href="/auth"
              className="text-sm bg-emerald-500 hover:bg-emerald-600 px-4 py-1.5 rounded-full transition-colors"
            >
              Sign In
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-700 pb-4">
          <div className="px-4 pt-3 space-y-4">
            {showTabs && (
              <div className="space-y-1">
                {flatLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-1.5 text-sm text-slate-300 hover:text-white pl-2 border-l-2 border-slate-700 hover:border-emerald-500 transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
            <div className="pt-2 border-t border-slate-700">
              <span className="text-xs text-slate-400">View as:</span>
              <select
                value={role}
                onChange={(e) => { const r = e.target.value as UserRole; setRole(r); setMobileOpen(false); router.push("/"); }}
                className={`ml-2 text-xs px-2 py-1 rounded-full text-white border-0 ${roleColors[role]}`}
              >
                {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                  <option key={r} value={r} className="bg-slate-800">
                    {roleLabels[r]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
