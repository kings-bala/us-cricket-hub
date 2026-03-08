"use client";

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import type { Player } from "@/types";

export interface VideoIntroProps {
  playerName: string;
  role: string;
  team: string;
  country: string;
  battingStyle: string;
  bowlingStyle: string;
  matches: number;
  runs: number;
  wickets: number;
  battingAvg: number;
  bowlingAvg: number;
  ageGroup: string;
}

export function videoIntroPropsFromPlayer(player: Player): VideoIntroProps {
  return {
    playerName: player.name,
    role: player.role,
    team: `${player.city}, ${player.state}`,
    country: player.country,
    battingStyle: player.battingStyle,
    bowlingStyle: player.bowlingStyle,
    matches: player.stats.matches,
    runs: player.stats.runs,
    wickets: player.stats.wickets,
    battingAvg: player.stats.battingAverage,
    bowlingAvg: player.stats.bowlingAverage,
    ageGroup: player.ageGroup,
  };
}

export default function VideoIntroComposition(props: VideoIntroProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, from: 0, to: 1, durationInFrames: 30 });
  const roleSpring = spring({ frame: frame - 15, fps, from: 0, to: 1, durationInFrames: 25 });
  const statsSpring = spring({ frame: frame - 40, fps, from: 0, to: 1, durationInFrames: 30 });
  const detailSpring = spring({ frame: frame - 60, fps, from: 0, to: 1, durationInFrames: 25 });

  const bgGradientAngle = interpolate(frame, [0, 150], [135, 180]);

  const statItems = [
    { label: "Matches", value: String(props.matches) },
    { label: "Runs", value: String(props.runs) },
    { label: "Wickets", value: String(props.wickets) },
    { label: "Bat Avg", value: props.battingAvg.toFixed(1) },
  ];

  const initials = props.playerName.split(" ").map(n => n[0]).join("");

  return (
    <AbsoluteFill style={{ background: `linear-gradient(${bgGradientAngle}deg, #030712, #0f172a, #030712)` }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at 30% 50%, rgba(16,185,129,0.08) 0%, transparent 60%)" }} />

      <div style={{ position: "absolute", top: 24, left: 32, display: "flex", alignItems: "center", gap: 8, opacity: interpolate(frame, [0, 20], [0, 0.6]) }}>
        <span style={{ color: "#10b981", fontSize: 14, fontWeight: 800, fontFamily: "Inter, sans-serif", letterSpacing: 3 }}>CRICVERSE360</span>
      </div>

      <div style={{ position: "absolute", right: 60, top: "50%", transform: `translateY(-50%) scale(${interpolate(titleSpring, [0, 1], [0.8, 1])})`, opacity: titleSpring }}>
        <div style={{
          width: 200, height: 200, borderRadius: "50%", border: "4px solid #10b981",
          background: "linear-gradient(135deg, #1e293b, #0f172a)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 60px rgba(16,185,129,0.2)",
        }}>
          <span style={{ fontSize: 64, fontWeight: 800, color: "#10b981", fontFamily: "Inter, sans-serif" }}>{initials}</span>
        </div>
      </div>

      <div style={{ position: "absolute", left: 60, top: "50%", transform: "translateY(-50%)", maxWidth: "55%" }}>
        <div style={{ opacity: titleSpring, transform: `translateX(${interpolate(titleSpring, [0, 1], [-40, 0])}px)` }}>
          <div style={{ fontSize: 48, fontWeight: 900, color: "#fff", fontFamily: "Inter, sans-serif", lineHeight: 1.1, textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
            {props.playerName}
          </div>
        </div>

        <div style={{ opacity: roleSpring, transform: `translateX(${interpolate(roleSpring, [0, 1], [-30, 0])}px)`, marginTop: 8 }}>
          <span style={{ fontSize: 20, color: "#10b981", fontWeight: 700, fontFamily: "Inter, sans-serif" }}>{props.role}</span>
          <span style={{ fontSize: 16, color: "#94a3b8", fontFamily: "Inter, sans-serif" }}> &bull; {props.ageGroup} &bull; {props.country}</span>
        </div>

        <div style={{ opacity: detailSpring, transform: `translateX(${interpolate(detailSpring, [0, 1], [-20, 0])}px)`, marginTop: 6 }}>
          <span style={{ fontSize: 14, color: "#64748b", fontFamily: "Inter, sans-serif" }}>{props.battingStyle} &bull; {props.bowlingStyle}</span>
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 28, opacity: statsSpring, transform: `translateY(${interpolate(statsSpring, [0, 1], [20, 0])}px)` }}>
          {statItems.map((s, i) => (
            <div key={i} style={{
              background: "rgba(15,23,42,0.8)", border: "1px solid rgba(148,163,184,0.15)",
              borderRadius: 12, padding: "12px 18px", textAlign: "center", minWidth: 80,
              backdropFilter: "blur(8px)",
            }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: "Inter, sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, fontFamily: "Inter, sans-serif", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, #10b981 ${interpolate(frame, [0, 135], [0, 100])}%, transparent ${interpolate(frame, [0, 135], [0, 100])}%)` }} />
    </AbsoluteFill>
  );
}
