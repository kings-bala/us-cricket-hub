"use client";

import { useRef, useState } from "react";

interface ShareCardProps {
  playerName: string;
  role: string;
  overallScore: number;
  topStrength: string;
  topImprovement: string;
  analysisType: string;
}

export default function ShareCard({ playerName, role, overallScore, topStrength, topImprovement, analysisType }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const downloadAsImage = async () => {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0f172a",
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `cricverse360-${playerName.replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      alert("Could not generate image. Try a different browser.");
    }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "https://cricverse360.com";

  const shareToWhatsApp = () => {
    const text = `Check out my cricket analysis on CricVerse360! Score: ${overallScore}/100. ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareToTwitter = () => {
    const text = `Just got my cricket ${analysisType} analysis on @CricVerse360! Score: ${overallScore}/100. Get yours free:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const scoreColor = overallScore >= 75 ? "text-emerald-400" : overallScore >= 60 ? "text-amber-400" : "text-red-400";
  const scoreBorder = overallScore >= 75 ? "border-emerald-500" : overallScore >= 60 ? "border-amber-500" : "border-red-500";

  return (
    <div className="space-y-6">
      {/* The Card */}
      <div
        ref={cardRef}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700/50 max-w-md mx-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-sm text-white">CV</div>
            <span className="text-sm font-bold text-white">CricVerse360</span>
          </div>
          <span className="text-xs text-slate-400 capitalize">{analysisType} Analysis</span>
        </div>

        <div className="flex items-center gap-6 mb-6">
          <div className={`w-24 h-24 rounded-full border-4 ${scoreBorder} flex items-center justify-center bg-slate-900/50`}>
            <div className="text-center">
              <span className={`text-3xl font-bold ${scoreColor}`}>{overallScore}</span>
              <span className="block text-xs text-slate-400">/100</span>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{playerName}</h2>
            <p className="text-sm text-slate-400 capitalize">{role?.replace("_", " ")}</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
            <p className="text-xs text-emerald-400 font-semibold mb-0.5">Top Strength</p>
            <p className="text-sm text-white">{topStrength}</p>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
            <p className="text-xs text-amber-400 font-semibold mb-0.5">Focus Area</p>
            <p className="text-sm text-white">{topImprovement}</p>
          </div>
        </div>

        <p className="text-xs text-slate-500 text-center">
          Get your cricket video analyzed at cricverse360.com
        </p>
      </div>

      {/* Share Actions */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={downloadAsImage}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-full text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Download
        </button>
        <button
          onClick={copyLink}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-full text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          {copied ? "Copied!" : "Copy Link"}
        </button>
        <button
          onClick={shareToWhatsApp}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm transition-colors"
        >
          WhatsApp
        </button>
        <button
          onClick={shareToTwitter}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-full text-sm transition-colors"
        >
          Twitter
        </button>
      </div>
    </div>
  );
}
