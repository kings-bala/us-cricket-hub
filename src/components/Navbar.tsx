"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { UserRole } from "@/types";

const roleLabels: Record<UserRole, string> = {
  player: "Player",
  agent: "Agent",
  owner: "T20 Owner",
  sponsor: "Sponsor",
};

const roleColors: Record<UserRole, string> = {
  player: "bg-emerald-500",
  agent: "bg-blue-500",
  owner: "bg-purple-500",
  sponsor: "bg-amber-500",
};

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

const discoverLinks = [
  { href: "/players", label: "Players", desc: "Browse player profiles" },
  { href: "/agents", label: "Agents", desc: "Find player agents" },
  { href: "/coaches", label: "Coaches", desc: "Coach directory" },
  { href: "/sponsors", label: "Sponsors", desc: "Sponsorship opportunities" },
];

const intelligenceLinks = [
  { href: "/rankings", label: "ACPI Rankings", desc: "Performance index rankings" },
  { href: "/form-meter", label: "AI Form Meter", desc: "Rolling match form analysis" },
  { href: "/combine", label: "Combine Assessment", desc: "Athletic metrics & testing" },
  { href: "/performance-feed", label: "Performance Feed", desc: "Daily highlights & alerts" },
];

const toolsLinks = [
  { href: "/squad-builder", label: "Squad Builder", desc: "Build & analyze your XI" },
  { href: "/scouting", label: "Pro Scouting", desc: "Advanced scouting tools" },
  { href: "/analyze", label: "AI Video Analysis", desc: "AI-powered video breakdown" },
  { href: "/dashboard", label: "Dashboard", desc: "Your personalized hub" },
];

const mobileNavGroups = [
  { title: "Discover", links: discoverLinks },
  { title: "AI Intelligence", links: intelligenceLinks },
  { title: "Tools", links: toolsLinks },
];

export default function Navbar() {
  const [role, setRole] = useState<UserRole>("player");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-sm">
              CH
            </div>
            <span className="font-bold text-lg hidden sm:block">CricketHub Global</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <NavDropdown id="discover" label="Discover" links={discoverLinks} open={openDropdown} setOpen={setOpenDropdown} />
            <NavDropdown id="intelligence" label="AI Intelligence" links={intelligenceLinks} open={openDropdown} setOpen={setOpenDropdown} />
            <NavDropdown id="tools" label="Tools" links={toolsLinks} open={openDropdown} setOpen={setOpenDropdown} />
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-slate-400">View as:</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
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
            {mobileNavGroups.map((group) => (
              <div key={group.title}>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{group.title}</p>
                <div className="space-y-1">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-1.5 text-sm text-slate-300 hover:text-white pl-2 border-l-2 border-slate-700 hover:border-emerald-500 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-slate-700">
              <span className="text-xs text-slate-400">View as:</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
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
