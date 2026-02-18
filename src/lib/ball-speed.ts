import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

export interface SpeedEstimate {
  speedKph: number;
  speedMph: number;
  confidence: "high" | "medium" | "low";
  method: string;
}

const PITCH_LENGTH_M = 20.12;

export function estimateBallSpeed(
  frames: { landmarks: NormalizedLandmark[]; timestamp: number }[],
  fps: number = 30
): SpeedEstimate | null {
  if (frames.length < 2) return null;

  const wristPositions: { x: number; y: number; t: number }[] = [];
  for (const frame of frames) {
    const rw = frame.landmarks[16];
    const lw = frame.landmarks[15];
    if (!rw || !lw) continue;

    const higherWrist = rw.y < lw.y ? rw : lw;
    wristPositions.push({ x: higherWrist.x, y: higherWrist.y, t: frame.timestamp });
  }

  if (wristPositions.length < 2) return null;

  let maxSpeed = 0;
  let bestPair = { i: 0, j: 1 };

  for (let i = 0; i < wristPositions.length - 1; i++) {
    const j = i + 1;
    const dt = wristPositions[j].t - wristPositions[i].t;
    if (dt <= 0) continue;

    const dx = wristPositions[j].x - wristPositions[i].x;
    const dy = wristPositions[j].y - wristPositions[i].y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const realDist = dist * PITCH_LENGTH_M * 0.8;
    const speedMs = realDist / dt;
    const speedKph = speedMs * 3.6;

    if (speedKph > maxSpeed && speedKph < 170 && speedKph > 40) {
      maxSpeed = speedKph;
      bestPair = { i, j };
    }
  }

  if (maxSpeed === 0) return null;

  const dt = wristPositions[bestPair.j].t - wristPositions[bestPair.i].t;
  let confidence: "high" | "medium" | "low" = "low";
  if (dt > 0 && dt < 0.5 && maxSpeed > 60 && maxSpeed < 160) confidence = "high";
  else if (maxSpeed > 50 && maxSpeed < 165) confidence = "medium";

  return {
    speedKph: Math.round(maxSpeed),
    speedMph: Math.round(maxSpeed * 0.621371),
    confidence,
    method: "wrist-velocity",
  };
}

export function classifyPace(speedKph: number): { label: string; color: string } {
  if (speedKph >= 145) return { label: "Express Pace", color: "text-red-400" };
  if (speedKph >= 135) return { label: "Fast", color: "text-orange-400" };
  if (speedKph >= 125) return { label: "Fast-Medium", color: "text-amber-400" };
  if (speedKph >= 115) return { label: "Medium-Fast", color: "text-yellow-400" };
  if (speedKph >= 100) return { label: "Medium", color: "text-emerald-400" };
  if (speedKph >= 80) return { label: "Medium-Slow", color: "text-blue-400" };
  return { label: "Slow/Spin", color: "text-purple-400" };
}
