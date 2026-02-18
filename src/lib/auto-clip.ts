import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

export interface ActionClip {
  startTime: number;
  endTime: number;
  type: "batting" | "bowling" | "fielding" | "unknown";
  confidence: number;
  label: string;
}

interface MotionFrame {
  timestamp: number;
  motion: number;
  landmarks: NormalizedLandmark[];
}

function getMotionScore(prev: NormalizedLandmark[], curr: NormalizedLandmark[]): number {
  const KEY_POINTS = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28];
  let totalMotion = 0;
  let count = 0;

  for (const idx of KEY_POINTS) {
    if (!prev[idx] || !curr[idx]) continue;
    const dx = curr[idx].x - prev[idx].x;
    const dy = curr[idx].y - prev[idx].y;
    totalMotion += Math.sqrt(dx * dx + dy * dy);
    count++;
  }

  return count > 0 ? totalMotion / count : 0;
}

function classifyAction(landmarks: NormalizedLandmark[]): { type: ActionClip["type"]; label: string } {
  const lw = landmarks[15];
  const rw = landmarks[16];
  const ls = landmarks[11];
  const rs = landmarks[12];
  const la = landmarks[27];
  const ra = landmarks[28];

  if (!lw || !rw || !ls || !rs || !la || !ra) return { type: "unknown", label: "Unknown action" };

  const shoulderY = (ls.y + rs.y) / 2;
  const eitherArmHigh = lw.y < shoulderY - 0.05 || rw.y < shoulderY - 0.05;
  const bothArmsUp = lw.y < shoulderY && rw.y < shoulderY;
  const strideDist = Math.abs(la.x - ra.x);
  const shoulderWidth = Math.abs(ls.x - rs.x);

  if (eitherArmHigh && !bothArmsUp && strideDist > shoulderWidth * 0.5) {
    return { type: "bowling", label: "Bowling action" };
  }
  if (bothArmsUp && strideDist < shoulderWidth * 0.6) {
    return { type: "batting", label: "Batting stroke" };
  }
  if (strideDist > shoulderWidth * 0.8 && !eitherArmHigh) {
    return { type: "fielding", label: "Fielding movement" };
  }

  if (eitherArmHigh) return { type: "batting", label: "Batting stance" };
  return { type: "unknown", label: "Movement detected" };
}

export function detectActionClips(
  frames: { landmarks: NormalizedLandmark[]; timestamp: number }[],
  motionThreshold: number = 0.015,
  minClipDuration: number = 0.5,
  mergePadding: number = 1.0
): ActionClip[] {
  if (frames.length < 2) return [];

  const motionFrames: MotionFrame[] = [];
  for (let i = 1; i < frames.length; i++) {
    const motion = getMotionScore(frames[i - 1].landmarks, frames[i].landmarks);
    motionFrames.push({ timestamp: frames[i].timestamp, motion, landmarks: frames[i].landmarks });
  }

  const activeFrames = motionFrames.filter((f) => f.motion > motionThreshold);
  if (activeFrames.length === 0) return [];

  const rawClips: { start: number; end: number; frames: MotionFrame[] }[] = [];
  let currentClip: { start: number; end: number; frames: MotionFrame[] } | null = null;

  for (const frame of activeFrames) {
    if (!currentClip) {
      currentClip = { start: frame.timestamp, end: frame.timestamp, frames: [frame] };
    } else if (frame.timestamp - currentClip.end <= mergePadding) {
      currentClip.end = frame.timestamp;
      currentClip.frames.push(frame);
    } else {
      rawClips.push(currentClip);
      currentClip = { start: frame.timestamp, end: frame.timestamp, frames: [frame] };
    }
  }
  if (currentClip) rawClips.push(currentClip);

  return rawClips
    .filter((c) => c.end - c.start >= minClipDuration)
    .map((c) => {
      const peakFrame = c.frames.reduce((a, b) => (b.motion > a.motion ? b : a));
      const action = classifyAction(peakFrame.landmarks);
      const avgMotion = c.frames.reduce((sum, f) => sum + f.motion, 0) / c.frames.length;
      const confidence = Math.min(1, avgMotion / (motionThreshold * 3));

      return {
        startTime: Math.max(0, c.start - 0.5),
        endTime: c.end + 0.5,
        type: action.type,
        confidence: Math.round(confidence * 100) / 100,
        label: action.label,
      };
    });
}

export function getClipSummary(clips: ActionClip[]): {
  totalDuration: number;
  activeDuration: number;
  deadTime: number;
  clipCount: number;
  breakdown: Record<string, number>;
} {
  const activeDuration = clips.reduce((sum, c) => sum + (c.endTime - c.startTime), 0);
  const totalDuration = clips.length > 0 ? clips[clips.length - 1].endTime - clips[0].startTime : 0;
  const breakdown: Record<string, number> = {};
  for (const c of clips) {
    breakdown[c.type] = (breakdown[c.type] || 0) + 1;
  }

  return {
    totalDuration: Math.round(totalDuration),
    activeDuration: Math.round(activeDuration),
    deadTime: Math.round(Math.max(0, totalDuration - activeDuration)),
    clipCount: clips.length,
    breakdown,
  };
}
