import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

export interface JointAngle {
  name: string;
  angle: number;
  ideal: number;
  tolerance: number;
}

export interface TechniqueCheck {
  category: string;
  score: number;
  comment: string;
  suggestion: string;
  angles: JointAngle[];
}

export interface FrameAnalysis {
  timestamp: number;
  landmarks: NormalizedLandmark[];
  checks: TechniqueCheck[];
  overallScore: number;
}

export interface AnalysisSummary {
  type: "batting" | "bowling" | "fielding";
  overallScore: number;
  categories: TechniqueCheck[];
  keyFrames: { timestamp: number; issue: string; score: number }[];
  drills: string[];
}

const LANDMARK = {
  NOSE: 0,
  LEFT_EYE: 1,
  RIGHT_EYE: 2,
  LEFT_EAR: 3,
  RIGHT_EAR: 4,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
} as const;

function calcAngle(
  a: NormalizedLandmark,
  b: NormalizedLandmark,
  c: NormalizedLandmark
): number {
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180) / Math.PI);
  if (angle > 180) angle = 360 - angle;
  return Math.round(angle * 10) / 10;
}

function distance(a: NormalizedLandmark, b: NormalizedLandmark): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function midpoint(
  a: NormalizedLandmark,
  b: NormalizedLandmark
): NormalizedLandmark {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
    z: (a.z + b.z) / 2,
    visibility: Math.min(a.visibility ?? 0, b.visibility ?? 0),
  };
}

function scoreFromAngle(actual: number, ideal: number, tolerance: number): number {
  const diff = Math.abs(actual - ideal);
  if (diff <= tolerance) return 95 + Math.round(Math.random() * 5);
  if (diff <= tolerance * 2) return 75 + Math.round(((tolerance * 2 - diff) / tolerance) * 15);
  if (diff <= tolerance * 3) return 55 + Math.round(((tolerance * 3 - diff) / tolerance) * 15);
  return Math.max(30, 55 - Math.round((diff - tolerance * 3) * 2));
}

export function analyzeBatting(landmarks: NormalizedLandmark[]): TechniqueCheck[] {
  const ls = landmarks[LANDMARK.LEFT_SHOULDER];
  const rs = landmarks[LANDMARK.RIGHT_SHOULDER];
  const le = landmarks[LANDMARK.LEFT_ELBOW];
  const re = landmarks[LANDMARK.RIGHT_ELBOW];
  const lw = landmarks[LANDMARK.LEFT_WRIST];
  const rw = landmarks[LANDMARK.RIGHT_WRIST];
  const lh = landmarks[LANDMARK.LEFT_HIP];
  const rh = landmarks[LANDMARK.RIGHT_HIP];
  const lk = landmarks[LANDMARK.LEFT_KNEE];
  const rk = landmarks[LANDMARK.RIGHT_KNEE];
  const la = landmarks[LANDMARK.LEFT_ANKLE];
  const ra = landmarks[LANDMARK.RIGHT_ANKLE];
  const nose = landmarks[LANDMARK.NOSE];

  const stanceWidth = distance(la, ra);
  const shoulderWidth = distance(ls, rs);
  const stanceRatio = stanceWidth / shoulderWidth;
  const stanceAngle: JointAngle = {
    name: "Stance Width Ratio",
    angle: Math.round(stanceRatio * 100) / 100,
    ideal: 1.3,
    tolerance: 0.3,
  };
  const stanceScore = scoreFromAngle(stanceRatio, 1.3, 0.3);

  const leftKneeAngle = calcAngle(lh, lk, la);
  const rightKneeAngle = calcAngle(rh, rk, ra);
  const kneeAngle: JointAngle = {
    name: "Knee Bend",
    angle: Math.round((leftKneeAngle + rightKneeAngle) / 2),
    ideal: 150,
    tolerance: 15,
  };
  const kneeScore = scoreFromAngle(kneeAngle.angle, 150, 15);

  const topHandElbow = calcAngle(ls, le, lw);
  const bottomHandElbow = calcAngle(rs, re, rw);
  const backliftAngle: JointAngle = {
    name: "Backlift Elbow Angle",
    angle: Math.round((topHandElbow + bottomHandElbow) / 2),
    ideal: 135,
    tolerance: 20,
  };
  const backliftScore = scoreFromAngle(backliftAngle.angle, 135, 20);

  const hipMid = midpoint(lh, rh);
  const shoulderMid = midpoint(ls, rs);
  const headOffset = Math.abs(nose.x - shoulderMid.x) / shoulderWidth;
  const headAngle: JointAngle = {
    name: "Head Alignment Offset",
    angle: Math.round(headOffset * 100) / 100,
    ideal: 0,
    tolerance: 0.1,
  };
  const headScore = scoreFromAngle(headOffset, 0, 0.1);

  const hipShoulder = Math.abs(shoulderMid.x - hipMid.x) / shoulderWidth;
  const balanceAngle: JointAngle = {
    name: "Hip-Shoulder Alignment",
    angle: Math.round(hipShoulder * 100) / 100,
    ideal: 0.05,
    tolerance: 0.1,
  };
  const balanceScore = scoreFromAngle(hipShoulder, 0.05, 0.1);

  return [
    {
      category: "Stance & Setup",
      score: Math.round((stanceScore + kneeScore) / 2),
      comment: stanceScore >= 75
        ? "Good base position with balanced weight distribution."
        : "Stance needs adjustment for better stability.",
      suggestion: stanceScore >= 75
        ? "Maintain this solid base. Ensure feet are shoulder-width apart."
        : "Widen stance slightly and bend knees more for better stability against pace.",
      angles: [stanceAngle, kneeAngle],
    },
    {
      category: "Backlift & Grip",
      score: backliftScore,
      comment: backliftScore >= 75
        ? "Backlift is straight and well-positioned."
        : "Backlift angle needs correction for better shot timing.",
      suggestion: backliftScore >= 75
        ? "Keep the bat face pointing towards second slip at the top of backlift."
        : "Try to bring the bat straighter. Practice with a stump to groove the correct path.",
      angles: [backliftAngle],
    },
    {
      category: "Head Position",
      score: headScore,
      comment: headScore >= 75
        ? "Head is still and well-aligned over the front knee."
        : "Head is falling away from the line of the ball.",
      suggestion: headScore >= 75
        ? "Excellent head position. This is key to good batting."
        : "Focus on keeping your head still and eyes level. Practice shadow batting in front of a mirror.",
      angles: [headAngle],
    },
    {
      category: "Balance & Weight Transfer",
      score: balanceScore,
      comment: balanceScore >= 75
        ? "Good weight distribution between front and back foot."
        : "Weight is too far back/forward, affecting balance.",
      suggestion: balanceScore >= 75
        ? "Maintain this balance through the shot. Transfer weight into drives."
        : "Practice shifting weight forward smoothly. Use front-foot driving drills.",
      angles: [balanceAngle],
    },
    {
      category: "Footwork",
      score: Math.round((kneeScore + stanceScore + balanceScore) / 3),
      comment: kneeScore >= 75
        ? "Good knee bend and active footwork detected."
        : "Limited foot movement and knee bend detected.",
      suggestion: kneeScore >= 75
        ? "Keep driving through the ball with committed footwork."
        : "Practice getting to the pitch of the ball with longer strides. Use cone drills.",
      angles: [kneeAngle, stanceAngle],
    },
  ];
}

export function analyzeBowling(landmarks: NormalizedLandmark[]): TechniqueCheck[] {
  const ls = landmarks[LANDMARK.LEFT_SHOULDER];
  const rs = landmarks[LANDMARK.RIGHT_SHOULDER];
  const le = landmarks[LANDMARK.LEFT_ELBOW];
  const re = landmarks[LANDMARK.RIGHT_ELBOW];
  const lw = landmarks[LANDMARK.LEFT_WRIST];
  const rw = landmarks[LANDMARK.RIGHT_WRIST];
  const lh = landmarks[LANDMARK.LEFT_HIP];
  const rh = landmarks[LANDMARK.RIGHT_HIP];
  const lk = landmarks[LANDMARK.LEFT_KNEE];
  const la = landmarks[LANDMARK.LEFT_ANKLE];

  const bowlingArmAngle = calcAngle(rs, re, rw);
  const armAngle: JointAngle = {
    name: "Bowling Arm Angle",
    angle: bowlingArmAngle,
    ideal: 175,
    tolerance: 15,
  };
  const armScore = scoreFromAngle(bowlingArmAngle, 175, 15);
  const isIllegalAction = bowlingArmAngle < 165;

  const frontArmAngle = calcAngle(ls, le, lw);
  const frontArm: JointAngle = {
    name: "Front Arm Position",
    angle: frontArmAngle,
    ideal: 160,
    tolerance: 20,
  };
  const frontArmScore = scoreFromAngle(frontArmAngle, 160, 20);

  const shoulderMid = midpoint(ls, rs);
  const hipMid = midpoint(lh, rh);
  const trunkAngle = calcAngle(
    { x: shoulderMid.x, y: shoulderMid.y - 0.2, z: 0, visibility: 1 },
    shoulderMid,
    hipMid
  );
  const trunk: JointAngle = {
    name: "Trunk Rotation",
    angle: trunkAngle,
    ideal: 30,
    tolerance: 15,
  };
  const trunkScore = scoreFromAngle(trunkAngle, 30, 15);

  const frontKneeAngle = calcAngle(lh, lk, la);
  const frontKnee: JointAngle = {
    name: "Front Knee Brace",
    angle: frontKneeAngle,
    ideal: 170,
    tolerance: 15,
  };
  const frontKneeScore = scoreFromAngle(frontKneeAngle, 170, 15);

  const hipRotation = Math.abs(lh.x - rh.x) / distance(ls, rs);
  const hipAngle: JointAngle = {
    name: "Hip-Shoulder Separation",
    angle: Math.round(hipRotation * 100) / 100,
    ideal: 0.6,
    tolerance: 0.2,
  };
  const hipScore = scoreFromAngle(hipRotation, 0.6, 0.2);

  return [
    {
      category: "Bowling Arm Action",
      score: armScore,
      comment: isIllegalAction
        ? `Warning: Arm angle is ${bowlingArmAngle}°. ICC allows up to 15° flexion.`
        : "Clean bowling action with good arm extension.",
      suggestion: isIllegalAction
        ? "Your elbow is bending beyond the legal limit. Work with a coach on straightening your arm at release."
        : "Maintain this straight arm. Focus on wrist position at release for movement.",
      angles: [armAngle],
    },
    {
      category: "Front Arm Drive",
      score: frontArmScore,
      comment: frontArmScore >= 75
        ? "Front arm drives well and pulls through effectively."
        : "Front arm collapses too early, reducing power.",
      suggestion: frontArmScore >= 75
        ? "Keep the front arm high and pull it down forcefully for extra pace."
        : "Practice keeping your front arm high and leading with it. Pull it down late into your hip.",
      angles: [frontArm],
    },
    {
      category: "Hip-Shoulder Separation",
      score: hipScore,
      comment: hipScore >= 75
        ? "Good separation between hips and shoulders for power generation."
        : "Limited hip-shoulder separation reduces bowling speed.",
      suggestion: hipScore >= 75
        ? "This counter-rotation is generating good pace. Maintain it."
        : "Work on rotating hips ahead of shoulders. Use resistance band drills.",
      angles: [hipAngle],
    },
    {
      category: "Front Knee Brace",
      score: frontKneeScore,
      comment: frontKneeScore >= 75
        ? "Strong braced front leg at delivery stride."
        : "Front knee collapsing at delivery, losing energy.",
      suggestion: frontKneeScore >= 75
        ? "Excellent brace. This converts run-up momentum into bowling speed."
        : "Focus on landing with a firm front leg. Strengthen quads and glutes.",
      angles: [frontKnee],
    },
    {
      category: "Trunk & Follow-Through",
      score: trunkScore,
      comment: trunkScore >= 75
        ? "Good trunk rotation and complete follow-through."
        : "Incomplete follow-through detected.",
      suggestion: trunkScore >= 75
        ? "Ensure follow-through continues past the front leg to prevent injury."
        : "Follow through fully across your body. Stopping short increases injury risk.",
      angles: [trunk],
    },
  ];
}

export function analyzeFielding(landmarks: NormalizedLandmark[]): TechniqueCheck[] {
  const ls = landmarks[LANDMARK.LEFT_SHOULDER];
  const rs = landmarks[LANDMARK.RIGHT_SHOULDER];
  const re = landmarks[LANDMARK.RIGHT_ELBOW];
  const lw = landmarks[LANDMARK.LEFT_WRIST];
  const rw = landmarks[LANDMARK.RIGHT_WRIST];
  const lh = landmarks[LANDMARK.LEFT_HIP];
  const rh = landmarks[LANDMARK.RIGHT_HIP];
  const lk = landmarks[LANDMARK.LEFT_KNEE];
  const rk = landmarks[LANDMARK.RIGHT_KNEE];
  const la = landmarks[LANDMARK.LEFT_ANKLE];
  const ra = landmarks[LANDMARK.RIGHT_ANKLE];

  const leftKnee = calcAngle(lh, lk, la);
  const rightKnee = calcAngle(rh, rk, ra);
  const avgKnee = (leftKnee + rightKnee) / 2;
  const kneeAngle: JointAngle = {
    name: "Knee Bend (Ground Fielding)",
    angle: Math.round(avgKnee),
    ideal: 110,
    tolerance: 20,
  };
  const groundScore = scoreFromAngle(avgKnee, 110, 20);

  const throwElbow = calcAngle(rs, re, rw);
  const throwAngle: JointAngle = {
    name: "Throwing Arm Angle",
    angle: throwElbow,
    ideal: 90,
    tolerance: 15,
  };
  const throwScore = scoreFromAngle(throwElbow, 90, 15);

  const hipMid = midpoint(lh, rh);
  const shoulderMid = midpoint(ls, rs);
  const bodyLean = Math.abs(shoulderMid.y - hipMid.y) / distance(ls, rs);
  const leanAngle: JointAngle = {
    name: "Body Position (Low)",
    angle: Math.round(bodyLean * 100) / 100,
    ideal: 0.8,
    tolerance: 0.3,
  };
  const leanScore = scoreFromAngle(bodyLean, 0.8, 0.3);

  const handPos = Math.min(lw.y, rw.y);
  const kneePos = Math.min(lk.y, rk.y);
  const handsLow = handPos > kneePos ? 1 : 0;
  const handAngle: JointAngle = {
    name: "Hands Below Knees",
    angle: handsLow,
    ideal: 1,
    tolerance: 0.5,
  };
  const handScore = handsLow ? 90 : 55;

  return [
    {
      category: "Ground Fielding Position",
      score: Math.round((groundScore + leanScore) / 2),
      comment: groundScore >= 75
        ? "Good low body position for ground fielding."
        : "Body position is too high when fielding ground balls.",
      suggestion: groundScore >= 75
        ? "Maintain this low position. Get your hands under the ball early."
        : "Get lower to the ball. Bend your knees more and keep your head over the ball.",
      angles: [kneeAngle, leanAngle],
    },
    {
      category: "Hand Position",
      score: handScore,
      comment: handScore >= 75
        ? "Hands are in good position below the eye line."
        : "Hands need to be lower and softer when collecting.",
      suggestion: handScore >= 75
        ? "Keep cushioning the ball into your body. Soft hands prevent drops."
        : "Practice picking up with both hands together, fingers pointing down.",
      angles: [handAngle],
    },
    {
      category: "Throwing Technique",
      score: throwScore,
      comment: throwScore >= 75
        ? "Good throwing arm position with proper elbow drive."
        : "Throwing arm angle needs adjustment for accuracy.",
      suggestion: throwScore >= 75
        ? "Focus on aiming at the top of the stumps from various angles."
        : "Bring your elbow to 90° before throwing. Practice target throws from 20-30 meters.",
      angles: [throwAngle],
    },
    {
      category: "Agility & Readiness",
      score: Math.round((groundScore + handScore) / 2),
      comment: groundScore >= 70
        ? "Good ready position with weight on balls of feet."
        : "Stance is too upright for quick lateral movement.",
      suggestion: groundScore >= 70
        ? "Add split-step timing to anticipate the ball better."
        : "Practice the athletic ready position. Add ladder drills and cone exercises.",
      angles: [kneeAngle],
    },
  ];
}

export function analyzeFrame(
  landmarks: NormalizedLandmark[],
  type: "batting" | "bowling" | "fielding",
  timestamp: number
): FrameAnalysis {
  let checks: TechniqueCheck[];
  switch (type) {
    case "batting":
      checks = analyzeBatting(landmarks);
      break;
    case "bowling":
      checks = analyzeBowling(landmarks);
      break;
    case "fielding":
      checks = analyzeFielding(landmarks);
      break;
  }

  const overallScore = Math.round(
    checks.reduce((sum, c) => sum + c.score, 0) / checks.length
  );

  return { timestamp, landmarks, checks, overallScore };
}

export function summarizeAnalysis(
  frames: FrameAnalysis[],
  type: "batting" | "bowling" | "fielding"
): AnalysisSummary {
  if (frames.length === 0) {
    return {
      type,
      overallScore: 0,
      categories: [],
      keyFrames: [],
      drills: [],
    };
  }

  const categoryMap = new Map<string, { totalScore: number; count: number; best: TechniqueCheck }>();

  for (const frame of frames) {
    for (const check of frame.checks) {
      const existing = categoryMap.get(check.category);
      if (existing) {
        existing.totalScore += check.score;
        existing.count += 1;
        if (check.score < existing.best.score) {
          existing.best = check;
        }
      } else {
        categoryMap.set(check.category, {
          totalScore: check.score,
          count: 1,
          best: check,
        });
      }
    }
  }

  const categories: TechniqueCheck[] = [];
  categoryMap.forEach((val) => {
    categories.push({
      ...val.best,
      score: Math.round(val.totalScore / val.count),
    });
  });

  const overallScore = Math.round(
    categories.reduce((sum, c) => sum + c.score, 0) / categories.length
  );

  const sortedFrames = [...frames].sort((a, b) => a.overallScore - b.overallScore);
  const keyFrames = sortedFrames.slice(0, 5).map((f) => {
    const worstCheck = [...f.checks].sort((a, b) => a.score - b.score)[0];
    return {
      timestamp: f.timestamp,
      issue: worstCheck ? `${worstCheck.category}: ${worstCheck.comment}` : "Minor issues detected",
      score: f.overallScore,
    };
  });

  const drills = getDrills(type, categories);

  return { type, overallScore, categories, keyFrames, drills };
}

function getDrills(type: "batting" | "bowling" | "fielding", categories: TechniqueCheck[]): string[] {
  const weakCategories = categories.filter((c) => c.score < 75);
  const drills: string[] = [];

  if (type === "batting") {
    if (weakCategories.some((c) => c.category.includes("Stance")))
      drills.push("Shadow batting with wide base for 10 minutes daily");
    if (weakCategories.some((c) => c.category.includes("Backlift")))
      drills.push("Backlift groove drill: Tap bat on ground, lift to second slip 50 times");
    if (weakCategories.some((c) => c.category.includes("Head")))
      drills.push("Mirror drill: Shadow bat watching your head stays still in reflection");
    if (weakCategories.some((c) => c.category.includes("Footwork")))
      drills.push("Cone drill: Place cones at good-length, practice stepping to each");
    if (weakCategories.some((c) => c.category.includes("Balance")))
      drills.push("Single-leg balance drill: Stand on one leg while shadow driving");
    if (drills.length === 0) drills.push("Maintain form with throwdown sessions focusing on timing");
  } else if (type === "bowling") {
    if (weakCategories.some((c) => c.category.includes("Arm")))
      drills.push("Wall drill: Stand side-on to wall, bowl with arm brushing the wall");
    if (weakCategories.some((c) => c.category.includes("Front Arm")))
      drills.push("Front arm pull-through: Practice with resistance band");
    if (weakCategories.some((c) => c.category.includes("Hip")))
      drills.push("Hip rotation drill: Bowl from standing position focusing on hip drive");
    if (weakCategories.some((c) => c.category.includes("Knee")))
      drills.push("Brace leg drill: Jump and land on firm front leg repeatedly");
    if (weakCategories.some((c) => c.category.includes("Trunk")))
      drills.push("Follow-through drill: Bowl and touch opposite ankle after release");
    if (drills.length === 0) drills.push("Maintain action with target bowling at single stump");
  } else {
    if (weakCategories.some((c) => c.category.includes("Ground")))
      drills.push("Low pickup drill: Roll ball along ground, collect with long barrier");
    if (weakCategories.some((c) => c.category.includes("Hand")))
      drills.push("Soft hands drill: Catch tennis ball with one hand, cushion into body");
    if (weakCategories.some((c) => c.category.includes("Throwing")))
      drills.push("Target throws: Aim at single stump from 20m, 30m, 40m");
    if (weakCategories.some((c) => c.category.includes("Agility")))
      drills.push("Ladder drills and T-drill for lateral movement speed");
    if (drills.length === 0) drills.push("Maintain sharpness with 50 pickups and throws per session");
  }

  return drills;
}
