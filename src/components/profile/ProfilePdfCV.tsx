"use client";

import { useState } from "react";
import type { Player, PlayerProfile } from "@/types";

function generatePdfHtml(player: Player, profile: PlayerProfile): string {
  const statRows = [
    ["Matches", String(player.stats.matches)],
    ["Innings", String(player.stats.innings)],
    ["Runs", String(player.stats.runs)],
    ["Batting Avg", player.stats.battingAverage.toFixed(1)],
    ["Strike Rate", player.stats.strikeRate.toFixed(1)],
    ["50s / 100s", `${player.stats.fifties} / ${player.stats.hundreds}`],
    ["Wickets", String(player.stats.wickets)],
    ["Bowl Avg", player.stats.bowlingAverage.toFixed(1)],
    ["Economy", player.stats.economy.toFixed(1)],
    ["Best Bowling", player.stats.bestBowling],
    ["Catches", String(player.stats.catches)],
  ];

  return `<!DOCTYPE html><html><head><style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', sans-serif; width: 794px; min-height: 1123px; display: flex; color: #1e293b; }
    .sidebar { width: 280px; min-height: 1123px; background: #0f172a; color: #e2e8f0; padding: 40px 24px; display: flex; flex-direction: column; gap: 24px; }
    .main { flex: 1; padding: 40px 32px; background: #fff; }
    .avatar { width: 120px; height: 120px; border-radius: 50%; background: #1e293b; border: 3px solid #10b981; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 40px; color: #10b981; }
    .name-side { text-align: center; font-size: 18px; font-weight: 700; color: #fff; }
    .role-side { text-align: center; font-size: 13px; color: #10b981; margin-top: 4px; }
    .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #10b981; border-bottom: 1px solid rgba(148,163,184,0.2); padding-bottom: 6px; margin-bottom: 10px; }
    .info-row { font-size: 12px; margin-bottom: 6px; color: #cbd5e1; }
    .info-label { color: #94a3b8; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }
    .attr-bar { height: 4px; background: #1e293b; border-radius: 2px; margin-top: 3px; }
    .attr-fill { height: 4px; background: #10b981; border-radius: 2px; }
    h1 { font-size: 28px; color: #0f172a; font-weight: 800; }
    .subtitle { font-size: 14px; color: #64748b; margin-top: 4px; }
    .main-section { margin-top: 24px; }
    .main-section-title { font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #10b981; font-weight: 700; border-bottom: 2px solid #10b981; padding-bottom: 4px; margin-bottom: 12px; }
    .exp-item { margin-bottom: 14px; }
    .exp-team { font-size: 14px; font-weight: 700; color: #0f172a; }
    .exp-role { font-size: 12px; color: #10b981; }
    .exp-period { font-size: 11px; color: #94a3b8; }
    .exp-desc { font-size: 12px; color: #475569; margin-top: 2px; }
    .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
    .stat-item { display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0; border-bottom: 1px solid #f1f5f9; }
    .stat-val { font-weight: 700; color: #0f172a; }
    .achievement-item { font-size: 12px; color: #475569; padding: 3px 0; padding-left: 12px; position: relative; }
    .achievement-item::before { content: "\\2022"; position: absolute; left: 0; color: #10b981; }
    .edu-item { margin-bottom: 10px; }
    .edu-inst { font-size: 13px; font-weight: 600; color: #0f172a; }
    .edu-deg { font-size: 12px; color: #475569; }
    .ref-item { margin-bottom: 10px; }
    .ref-name { font-size: 13px; font-weight: 600; color: #0f172a; }
    .ref-title { font-size: 11px; color: #64748b; }
    .footer { margin-top: auto; padding-top: 20px; border-top: 1px solid rgba(148,163,184,0.2); text-align: center; font-size: 10px; color: #64748b; }
    .footer span { color: #10b981; font-weight: 700; }
  </style></head><body>
    <div class="sidebar">
      <div>
        <div class="avatar">${player.name.split(" ").map(n => n[0]).join("")}</div>
        <div class="name-side">${player.name}</div>
        <div class="role-side">${player.role} &bull; ${player.battingStyle}</div>
      </div>
      <div>
        <div class="section-title">Contact</div>
        <div class="info-row">${profile.contactEmail}</div>
        <div class="info-row">${profile.phone}</div>
        <div class="info-row">${profile.location}</div>
      </div>
      <div>
        <div class="section-title">Details</div>
        <div class="info-row"><div class="info-label">Nationality</div>${profile.nationality}</div>
        <div class="info-row"><div class="info-label">Date of Birth</div>${new Date(profile.dateOfBirth).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
        <div class="info-row"><div class="info-label">Age</div>${player.age}</div>
        <div class="info-row"><div class="info-label">Height</div>${profile.height}</div>
        <div class="info-row"><div class="info-label">Weight</div>${profile.weight}</div>
      </div>
      <div>
        <div class="section-title">Attributes</div>
        <div class="info-row"><div class="info-label">Batting</div>${player.battingStyle}</div>
        <div class="info-row"><div class="info-label">Bowling</div>${player.bowlingStyle}</div>
        <div class="info-row"><div class="info-label">Age Group</div>${player.ageGroup}</div>
      </div>
      <div>
        <div class="section-title">Languages</div>
        <div class="info-row">${profile.languages.join(", ")}</div>
      </div>
      <div class="footer">
        <span>CRICVERSE360</span><br/>cricverse360.com/player/${profile.slug}
      </div>
    </div>
    <div class="main">
      <h1>${player.name}</h1>
      <div class="subtitle">${player.role} &bull; ${player.city}, ${player.country} &bull; ${player.ageGroup}</div>

      <div class="main-section">
        <div class="main-section-title">Career Statistics</div>
        <div class="stat-grid">
          ${statRows.map(([l, v]) => `<div class="stat-item"><span>${l}</span><span class="stat-val">${v}</span></div>`).join("")}
        </div>
      </div>

      <div class="main-section">
        <div class="main-section-title">Experience</div>
        ${profile.experience.map(e => `<div class="exp-item"><div class="exp-team">${e.team}</div><div class="exp-role">${e.role} <span class="exp-period">&bull; ${e.period}</span></div><div class="exp-desc">${e.description}</div></div>`).join("")}
      </div>

      <div class="main-section">
        <div class="main-section-title">Education</div>
        ${profile.education.map(e => `<div class="edu-item"><div class="edu-inst">${e.institution}</div><div class="edu-deg">${e.degree} &bull; ${e.year}</div></div>`).join("")}
      </div>

      <div class="main-section">
        <div class="main-section-title">Achievements</div>
        ${player.achievements.map(a => `<div class="achievement-item">${a}</div>`).join("")}
      </div>

      <div class="main-section">
        <div class="main-section-title">Previous Clubs</div>
        <div style="font-size:12px;color:#475569">${profile.previousClubs.join(" &bull; ")}</div>
      </div>

      <div class="main-section">
        <div class="main-section-title">References</div>
        ${profile.references.map(r => `<div class="ref-item"><div class="ref-name">${r.name}</div><div class="ref-title">${r.title}</div></div>`).join("")}
      </div>
    </div>
  </body></html>`;
}

export default function ProfilePdfCV({ player, profile }: { player: Player; profile: PlayerProfile }) {
  const [generating, setGenerating] = useState(false);

  function handleDownload() {
    setGenerating(true);
    const html = generatePdfHtml(player, profile);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, "_blank");
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          setGenerating(false);
        }, 500);
      };
    } else {
      const a = document.createElement("a");
      a.href = url;
      a.download = `${player.name.replace(/\s+/g, "-").toLowerCase()}-cv.html`;
      a.click();
      setGenerating(false);
    }
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleDownload}
      disabled={generating}
      className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all disabled:opacity-50"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {generating ? "Generating..." : "Download CV"}
    </button>
  );
}
