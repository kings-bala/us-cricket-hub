export const SKILL_TAXONOMY = {
  batting: {
    label: "Batting Shots",
    skills: [
      { id: "cover_drive", name: "Cover Drive", desc: "Front foot drive through covers" },
      { id: "straight_drive", name: "Straight Drive", desc: "Drive back past the bowler" },
      { id: "on_drive", name: "On Drive", desc: "Drive through mid-on" },
      { id: "off_drive", name: "Off Drive", desc: "Drive through mid-off" },
      { id: "pull_shot", name: "Pull Shot", desc: "Horizontal bat shot to short pitch" },
      { id: "hook_shot", name: "Hook Shot", desc: "Cross bat shot to bouncer" },
      { id: "cut_shot", name: "Cut Shot", desc: "Horizontal bat shot square of wicket" },
      { id: "sweep", name: "Sweep", desc: "Down on one knee to spin" },
      { id: "reverse_sweep", name: "Reverse Sweep", desc: "Switch hands sweep" },
      { id: "front_foot_defense", name: "Front Foot Defense", desc: "Defensive block on front foot" },
      { id: "back_foot_defense", name: "Back Foot Defense", desc: "Defensive block on back foot" },
      { id: "flick", name: "Flick/Glance", desc: "Wristy shot off the pads" },
      { id: "lofted_shot", name: "Lofted Shot", desc: "Aerial drive over the infield" },
      { id: "scoop", name: "Scoop/Ramp", desc: "Innovative shot over keeper" },
      { id: "stance_only", name: "Stance/Setup", desc: "Batting stance without shot" },
    ],
  },
  bowling: {
    label: "Bowling Actions",
    skills: [
      { id: "fast_delivery", name: "Fast Delivery", desc: "Pace bowling standard delivery" },
      { id: "bouncer", name: "Bouncer", desc: "Short pitched fast delivery" },
      { id: "yorker", name: "Yorker", desc: "Full length at the batsman's feet" },
      { id: "off_spin", name: "Off Spin", desc: "Finger spin turning away from right-hander" },
      { id: "leg_spin", name: "Leg Spin", desc: "Wrist spin turning into right-hander" },
      { id: "googly", name: "Googly", desc: "Wrong'un from leg spinner" },
      { id: "doosra", name: "Doosra", desc: "Wrong'un from off spinner" },
      { id: "arm_ball", name: "Arm Ball", desc: "Delivery that goes straight" },
      { id: "slower_ball", name: "Slower Ball", desc: "Change of pace delivery" },
      { id: "inswinger", name: "Inswinger", desc: "Swing into right-hander" },
      { id: "outswinger", name: "Outswinger", desc: "Swing away from right-hander" },
      { id: "run_up", name: "Run-Up Only", desc: "Approach without delivery" },
    ],
  },
  fielding: {
    label: "Fielding Positions",
    skills: [
      { id: "ground_fielding", name: "Ground Fielding", desc: "Stopping ball along the ground" },
      { id: "catching_high", name: "High Catch", desc: "Catching above head height" },
      { id: "catching_low", name: "Low Catch", desc: "Catching below waist height" },
      { id: "diving_catch", name: "Diving Catch", desc: "Full stretch catch" },
      { id: "throwing", name: "Throwing", desc: "Return throw to keeper/bowler" },
      { id: "run_out_direct", name: "Direct Hit", desc: "Direct hit run-out attempt" },
      { id: "sliding_stop", name: "Sliding Stop", desc: "Sliding to stop the ball" },
      { id: "wicketkeeping", name: "Wicketkeeping", desc: "Keeper stance and take" },
      { id: "ready_position", name: "Ready Position", desc: "Fielding ready stance" },
    ],
  },
} as const;

export type SkillCategory = keyof typeof SKILL_TAXONOMY;
export type SkillId = string;

export interface DatasetLabel {
  analysisId: string;
  fileName: string;
  analysisType: SkillCategory;
  skillId: SkillId;
  skillName: string;
  confidence: "high" | "medium" | "low";
  labeledBy: string;
  labeledAt: string;
  notes: string;
  overallScore: number;
}

const LABELS_KEY = "cricverse360_dataset_labels";

export function getLabels(): DatasetLabel[] {
  try {
    return JSON.parse(localStorage.getItem(LABELS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveLabel(label: DatasetLabel): void {
  const labels = getLabels();
  const idx = labels.findIndex((l) => l.analysisId === label.analysisId);
  if (idx >= 0) {
    labels[idx] = label;
  } else {
    labels.push(label);
  }
  localStorage.setItem(LABELS_KEY, JSON.stringify(labels));
}

export function removeLabel(analysisId: string): void {
  const labels = getLabels().filter((l) => l.analysisId !== analysisId);
  localStorage.setItem(LABELS_KEY, JSON.stringify(labels));
}

export function getLabelForAnalysis(analysisId: string): DatasetLabel | null {
  return getLabels().find((l) => l.analysisId === analysisId) || null;
}

export function getDatasetStats(): {
  total: number;
  byType: Record<string, number>;
  bySkill: Record<string, number>;
  byConfidence: Record<string, number>;
} {
  const labels = getLabels();
  const byType: Record<string, number> = {};
  const bySkill: Record<string, number> = {};
  const byConfidence: Record<string, number> = {};

  for (const l of labels) {
    byType[l.analysisType] = (byType[l.analysisType] || 0) + 1;
    bySkill[l.skillName] = (bySkill[l.skillName] || 0) + 1;
    byConfidence[l.confidence] = (byConfidence[l.confidence] || 0) + 1;
  }

  return { total: labels.length, byType, bySkill, byConfidence };
}

export function exportDataset(): string {
  const labels = getLabels();
  return JSON.stringify(labels, null, 2);
}
