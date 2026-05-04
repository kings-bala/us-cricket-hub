"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { jyctInfo, jyctAgeGroups, jyctGrounds } from "@/data/jyct";

type Tab = "grounds" | "schedule" | "registration";

export default function JYCTPage() {
  const [activeTab, setActiveTab] = useState<Tab>("grounds");
  const [expandedGround, setExpandedGround] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
      {/* CricClubs-style Header */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 border-b border-blue-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
              <span className="text-3xl font-black text-white">JYCT</span>
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white">{jyctInfo.name}</h1>
              <p className="text-blue-300 text-sm mt-1">{jyctInfo.tagline}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3">
                <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
                  {jyctInfo.month}
                </span>
                <span className="text-xs bg-white/10 text-blue-200 px-3 py-1 rounded-full border border-white/10">
                  {jyctInfo.ballType}
                </span>
                <span className="text-xs bg-red-500/20 text-red-300 px-3 py-1 rounded-full border border-red-500/30 animate-pulse">
                  {jyctInfo.spotsStatus}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
              <Link
                href="/tournaments/jyct/social"
                className="text-sm bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-5 py-2 rounded-full transition-all font-medium"
              >
                View Instagram
              </Link>
              <a
                href={`mailto:${jyctInfo.email}`}
                className="text-sm bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-5 py-2 rounded-full border border-emerald-500/30 transition-all font-medium"
              >
                Register Now
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - CricClubs style */}
          <div className="lg:col-span-1 space-y-4">
            {/* Tournament Poster */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
              <Image
                src="/jyct-poster.jpg"
                alt="JYCT 2026 Poster"
                width={400}
                height={600}
                className="w-full h-auto"
              />
            </div>

            {/* Quick Info */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Tournament Info</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-xs text-slate-400">Registration Closes</p>
                    <p className="text-sm text-white font-medium">{jyctInfo.registrationCloses}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-xs text-slate-400">Email</p>
                    <a href={`mailto:${jyctInfo.email}`} className="text-sm text-emerald-400 hover:text-emerald-300 break-all">
                      {jyctInfo.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="text-xs text-slate-400">Phone</p>
                    <a href={`tel:${jyctInfo.phone}`} className="text-sm text-white">{jyctInfo.phone}</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Features</h3>
              <div className="space-y-2">
                {jyctInfo.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Links */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Quick Links</h3>
              <div className="space-y-1">
                {[
                  { label: "Grounds", tab: "grounds" as Tab },
                  { label: "Schedule", tab: "schedule" as Tab },
                  { label: "Registration", tab: "registration" as Tab },
                ].map((link) => (
                  <button
                    key={link.tab}
                    onClick={() => setActiveTab(link.tab)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeTab === link.tab
                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
                <Link
                  href="/tournaments/jyct/social"
                  className="block px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  Social Media
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="flex gap-1 bg-slate-800/30 rounded-xl p-1 mb-6">
              {[
                { id: "grounds" as Tab, label: "Grounds", icon: "🏟️" },
                { id: "schedule" as Tab, label: "Schedule & Age Groups", icon: "📅" },
                { id: "registration" as Tab, label: "Registration", icon: "📋" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  <span className="mr-1.5">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Grounds Tab */}
            {activeTab === "grounds" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Tournament Grounds</h2>
                  <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
                    {jyctGrounds.length} Venues
                  </span>
                </div>

                {/* Grounds Table - CricClubs style */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden mb-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-blue-900/40 border-b border-slate-700/50">
                          <th className="text-left text-xs font-semibold text-blue-300 uppercase tracking-wider px-4 py-3">Ground Name</th>
                          <th className="text-left text-xs font-semibold text-blue-300 uppercase tracking-wider px-4 py-3 hidden md:table-cell">City</th>
                          <th className="text-left text-xs font-semibold text-blue-300 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Pitch Type</th>
                          <th className="text-left text-xs font-semibold text-blue-300 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Capacity</th>
                          <th className="text-left text-xs font-semibold text-blue-300 uppercase tracking-wider px-4 py-3">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jyctGrounds.map((ground, idx) => (
                          <tr
                            key={ground.id}
                            className={`border-b border-slate-700/30 hover:bg-slate-700/30 transition-colors cursor-pointer ${
                              idx % 2 === 0 ? "bg-slate-800/20" : ""
                            }`}
                            onClick={() => setExpandedGround(expandedGround === ground.id ? null : ground.id)}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                  {idx + 1}
                                </div>
                                <span className="text-sm text-white font-medium">{ground.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-300 hidden md:table-cell">{ground.city}, {ground.state}</td>
                            <td className="px-4 py-3 hidden lg:table-cell">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                ground.pitchType === "Turf Wicket"
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              }`}>
                                {ground.pitchType}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-300 hidden md:table-cell">{ground.capacity}</td>
                            <td className="px-4 py-3">
                              <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                                {expandedGround === ground.id ? "Hide" : "View"} Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Expanded Ground Detail */}
                {expandedGround && (() => {
                  const ground = jyctGrounds.find((g) => g.id === expandedGround);
                  if (!ground) return null;
                  return (
                    <div className="bg-slate-800/50 border border-blue-500/30 rounded-xl p-6 mb-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-white">{ground.name}</h3>
                          <p className="text-sm text-slate-400 mt-1">{ground.address}</p>
                        </div>
                        <a
                          href={ground.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-colors shrink-0"
                        >
                          View on Map
                        </a>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Ground Info</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-400">Pitch Type</span>
                              <span className="text-white">{ground.pitchType}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-400">Capacity</span>
                              <span className="text-white">{ground.capacity} spectators</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-400">Floodlights</span>
                              <span className="text-white">{ground.floodlights ? "Yes" : "No"}</span>
                            </div>
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Facilities</h4>
                          <div className="flex flex-wrap gap-2">
                            {ground.facilities.map((f) => (
                              <span key={f} className="text-xs bg-slate-700/50 text-slate-300 px-3 py-1.5 rounded-full border border-slate-600/50">
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Grounds Cards for mobile */}
                <div className="grid md:grid-cols-2 gap-4 md:hidden">
                  {jyctGrounds.map((ground, idx) => (
                    <div key={ground.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white font-bold">
                          {idx + 1}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-white">{ground.shortName}</h3>
                          <p className="text-xs text-slate-400">{ground.city}, {ground.state}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{ground.address}</p>
                      <div className="flex flex-wrap gap-1">
                        {ground.facilities.slice(0, 3).map((f) => (
                          <span key={f} className="text-xs bg-slate-700/50 text-slate-400 px-2 py-0.5 rounded">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === "schedule" && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Age Groups & Schedule</h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {jyctAgeGroups.map((group) => (
                    <div
                      key={group.id}
                      className="relative bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all group"
                    >
                      {group.isNew && (
                        <div className="absolute top-3 right-3 z-10">
                          <span className="text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
                            NEW
                          </span>
                        </div>
                      )}
                      <div className={`h-2 bg-gradient-to-r ${group.color}`} />
                      <div className="p-5">
                        <h3 className="text-xl font-bold text-white mb-1">{group.name}</h3>
                        <p className="text-sm text-slate-400 mb-4">{group.overs} Overs Format</p>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm text-slate-300">{group.dates}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-white font-semibold">${group.entryFee.toLocaleString()}</span>
                            <span className="text-xs text-slate-400">Entry Fee</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Schedule Overview */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Tournament Schedule Overview</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-lg">
                      <div className="w-16 text-center shrink-0">
                        <p className="text-xs text-slate-400">Week 1</p>
                        <p className="text-sm font-bold text-amber-400">Aug 18-21</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium">U15 Tournament (30 Overs)</p>
                        <p className="text-xs text-slate-400">Multiple venues across New Jersey</p>
                      </div>
                      <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full">$1,100</span>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-lg">
                      <div className="w-16 text-center shrink-0">
                        <p className="text-xs text-slate-400">Week 2</p>
                        <p className="text-sm font-bold text-blue-400">Aug 25-28</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium">U13, U18 & Girls Tournament</p>
                        <p className="text-xs text-slate-400">U13 (30 overs) | U18 (30 overs) | Girls (25 overs, All Ages)</p>
                      </div>
                      <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">$1,000-$1,200</span>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-lg">
                      <div className="w-16 text-center shrink-0">
                        <p className="text-xs text-slate-400">TBD</p>
                        <p className="text-sm font-bold text-green-400">August</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium">U11 Tournament (25 Overs)</p>
                        <p className="text-xs text-slate-400">Exact dates to be announced</p>
                      </div>
                      <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">$1,000</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Registration Tab */}
            {activeTab === "registration" && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Registration Information</h2>

                {/* Deadline Banner */}
                <div className="bg-gradient-to-r from-red-900/40 to-amber-900/40 border border-red-500/30 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-6 h-6 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-bold text-white">Registration Closes {jyctInfo.registrationCloses}</h3>
                  </div>
                  <p className="text-sm text-slate-300 ml-9">
                    Spots are filling up fast! Email your team details to register before the deadline.
                  </p>
                </div>

                {/* How to Register */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-bold text-white mb-4">How to Register</h3>
                  <div className="space-y-4">
                    {[
                      { step: 1, title: "Prepare Team Details", desc: "Gather your team name, player roster, age group, and contact information." },
                      { step: 2, title: "Email Registration", desc: `Send your team details to ${jyctInfo.email}` },
                      { step: 3, title: "Pay Entry Fee", desc: "Entry fee varies by age group ($1,000 - $1,200). Payment details will be provided upon registration." },
                      { step: 4, title: "Confirmation", desc: "You'll receive a confirmation email with schedule, venue, and match details." },
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {item.step}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                          <p className="text-sm text-slate-400 mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Entry Fees Table */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden mb-6">
                  <div className="bg-blue-900/40 px-4 py-3 border-b border-slate-700/50">
                    <h3 className="text-sm font-semibold text-white">Entry Fees by Age Group</h3>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700/30">
                        <th className="text-left text-xs text-slate-400 uppercase px-4 py-2">Age Group</th>
                        <th className="text-left text-xs text-slate-400 uppercase px-4 py-2">Format</th>
                        <th className="text-left text-xs text-slate-400 uppercase px-4 py-2">Dates</th>
                        <th className="text-right text-xs text-slate-400 uppercase px-4 py-2">Entry Fee</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jyctAgeGroups.map((group, idx) => (
                        <tr key={group.id} className={`border-b border-slate-700/20 ${idx % 2 === 0 ? "bg-slate-800/20" : ""}`}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-white font-medium">{group.name}</span>
                              {group.isNew && (
                                <span className="text-xs bg-pink-500 text-white px-1.5 py-0.5 rounded font-bold">NEW</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-300">{group.overs} Overs</td>
                          <td className="px-4 py-3 text-sm text-slate-300">{group.dates}</td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-sm font-bold text-emerald-400">${group.entryFee.toLocaleString()}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Contact Box */}
                <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-500/20 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-2">Questions?</h3>
                  <p className="text-sm text-slate-300 mb-4">
                    Reach out to us for any registration queries or tournament information.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={`mailto:${jyctInfo.email}`}
                      className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email Us
                    </a>
                    <a
                      href={`tel:${jyctInfo.phone}`}
                      className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Call {jyctInfo.phone}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
