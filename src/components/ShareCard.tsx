"use client";

import { useRef, useState, useEffect } from "react";

interface ShareCardProps {
  playerName: string;
  role: string;
  overallScore: number;
  confidenceScore: number;
  topStrength: string;
  topImprovement: string;
  analysisType: string;
}

function drawCardToCanvas(
  canvas: HTMLCanvasElement,
  props: ShareCardProps
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = 600;
  const h = 800;
  canvas.width = w * 2;
  canvas.height = h * 2;
  ctx.scale(2, 2);

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#0f172a");
  bg.addColorStop(0.5, "#1e293b");
  bg.addColorStop(1, "#0f172a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Subtle border
  ctx.strokeStyle = "rgba(71, 85, 105, 0.5)";
  ctx.lineWidth = 2;
  ctx.roundRect(4, 4, w - 8, h - 8, 16);
  ctx.stroke();

  // Top accent line
  const accent = ctx.createLinearGradient(0, 0, w, 0);
  accent.addColorStop(0, "#10b981");
  accent.addColorStop(1, "#3b82f6");
  ctx.fillStyle = accent;
  ctx.fillRect(40, 4, w - 80, 3);

  // Logo + Brand
  ctx.fillStyle = "#10b981";
  ctx.beginPath();
  ctx.roundRect(40, 36, 36, 36, 8);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("CV", 58, 59);

  ctx.textAlign = "left";
  ctx.font = "bold 18px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("CricVerse360", 86, 58);

  ctx.textAlign = "right";
  ctx.font = "12px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "#94a3b8";
  const typeLabel = props.analysisType.charAt(0).toUpperCase() + props.analysisType.slice(1);
  ctx.fillText(`${typeLabel} Analysis`, w - 40, 58);

  // Score circle
  const cx = w / 2;
  const cy = 170;
  const r = 64;

  // Background circle
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(16, 185, 129, 0.1)";
  ctx.fill();

  // Score arc
  const scorePercent = props.overallScore / 100;
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + scorePercent * Math.PI * 2;

  ctx.beginPath();
  ctx.arc(cx, cy, r, startAngle, endAngle);
  ctx.strokeStyle = props.overallScore >= 75 ? "#10b981" : props.overallScore >= 60 ? "#f59e0b" : "#ef4444";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.stroke();

  // Background arc
  ctx.beginPath();
  ctx.arc(cx, cy, r, endAngle, startAngle + Math.PI * 2);
  ctx.strokeStyle = "rgba(71, 85, 105, 0.3)";
  ctx.lineWidth = 6;
  ctx.stroke();

  // Score text
  ctx.textAlign = "center";
  ctx.font = "bold 48px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = props.overallScore >= 75 ? "#10b981" : props.overallScore >= 60 ? "#f59e0b" : "#ef4444";
  ctx.fillText(`${props.overallScore}`, cx, cy + 14);
  ctx.font = "12px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("/100", cx, cy + 32);

  // Player name
  ctx.font = "bold 28px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "#ffffff";
  const name = props.playerName.length > 24 ? props.playerName.slice(0, 22) + "..." : props.playerName;
  ctx.fillText(name, cx, 280);

  // Role
  ctx.font = "14px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "#94a3b8";
  const roleText = props.role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  ctx.fillText(roleText, cx, 304);

  // Confidence badge
  const confText = `AI Confidence: ${props.confidenceScore}%`;
  ctx.font = "12px system-ui, -apple-system, sans-serif";
  const confW = ctx.measureText(confText).width + 24;
  ctx.fillStyle = "rgba(59, 130, 246, 0.15)";
  ctx.beginPath();
  ctx.roundRect(cx - confW / 2, 320, confW, 26, 13);
  ctx.fill();
  ctx.fillStyle = "#60a5fa";
  ctx.fillText(confText, cx, 338);

  // Divider
  ctx.strokeStyle = "rgba(71, 85, 105, 0.3)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, 370);
  ctx.lineTo(w - 60, 370);
  ctx.stroke();

  // Top Strength box
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(16, 185, 129, 0.08)";
  ctx.beginPath();
  ctx.roundRect(40, 390, w - 80, 80, 12);
  ctx.fill();
  ctx.strokeStyle = "rgba(16, 185, 129, 0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(40, 390, w - 80, 80, 12);
  ctx.stroke();

  ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "#10b981";
  ctx.fillText("TOP STRENGTH", 60, 416);
  ctx.font = "14px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "#e2e8f0";
  const strength = props.topStrength.length > 55 ? props.topStrength.slice(0, 53) + "..." : props.topStrength;
  wrapText(ctx, strength, 60, 440, w - 120, 20);

  // Focus Area box
  ctx.fillStyle = "rgba(245, 158, 11, 0.08)";
  ctx.beginPath();
  ctx.roundRect(40, 490, w - 80, 80, 12);
  ctx.fill();
  ctx.strokeStyle = "rgba(245, 158, 11, 0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(40, 490, w - 80, 80, 12);
  ctx.stroke();

  ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "#f59e0b";
  ctx.fillText("FOCUS AREA", 60, 516);
  ctx.font = "14px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "#e2e8f0";
  const weakness = props.topImprovement.length > 55 ? props.topImprovement.slice(0, 53) + "..." : props.topImprovement;
  wrapText(ctx, weakness, 60, 540, w - 120, 20);

  // Stats row
  const statsY = 610;
  const stats = [
    { label: "Score", value: `${props.overallScore}/100` },
    { label: "Confidence", value: `${props.confidenceScore}%` },
    { label: "Type", value: typeLabel },
  ];
  const statW = (w - 80) / 3;
  stats.forEach((stat, i) => {
    const sx = 40 + i * statW + statW / 2;
    ctx.textAlign = "center";
    ctx.font = "bold 22px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(stat.value, sx, statsY);
    ctx.font = "11px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText(stat.label, sx, statsY + 18);
  });

  // Divider
  ctx.strokeStyle = "rgba(71, 85, 105, 0.3)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, 660);
  ctx.lineTo(w - 60, 660);
  ctx.stroke();

  // CTA bar
  ctx.fillStyle = "rgba(16, 185, 129, 0.1)";
  ctx.beginPath();
  ctx.roundRect(40, 680, w - 80, 50, 12);
  ctx.fill();

  ctx.textAlign = "center";
  ctx.font = "bold 14px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "#10b981";
  ctx.fillText("Get your cricket video analyzed at cricverse360.com", cx, 710);

  // Bottom branding
  ctx.font = "11px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "#475569";
  ctx.fillText("AI-Powered Cricket Analysis", cx, 760);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  let curY = y;
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line.trim(), x, curY);
      line = word + " ";
      curY += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line.trim(), x, curY);
}

export default function ShareCard(props: ShareCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      drawCardToCanvas(canvasRef.current, props);
      setGenerated(true);
    }
  }, [props]);

  const downloadAsImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `cricverse360-${props.playerName.replace(/\s+/g, "-").toLowerCase()}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "https://cricverse360.com";

  const shareToWhatsApp = () => {
    const text = `Check out my cricket analysis on CricVerse360! Score: ${props.overallScore}/100, Confidence: ${props.confidenceScore}%. Get your video analyzed free: ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareToTwitter = () => {
    const text = `Just got my cricket ${props.analysisType} analysis on @CricVerse360! Score: ${props.overallScore}/100. Get yours free:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-6">
      {/* Canvas Card */}
      <div ref={cardRef} className="max-w-md mx-auto">
        <canvas
          ref={canvasRef}
          className="w-full h-auto rounded-2xl"
          style={{ maxWidth: "600px" }}
        />
      </div>

      {/* Share Actions */}
      {generated && (
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={downloadAsImage}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-lg shadow-emerald-500/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download Card
          </button>
          <button
            onClick={copyLink}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <button
            onClick={shareToWhatsApp}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </button>
          <button
            onClick={shareToTwitter}
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Twitter / X
          </button>
        </div>
      )}
    </div>
  );
}
