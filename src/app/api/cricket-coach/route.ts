import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are CricVerse360 AI Cricket Coach — an expert cricket coach who gives concise, actionable advice.

RULES:
- Keep answers under 150 words unless the user asks for detail
- Reference the player's analysis data when provided
- Suggest specific drills with clear instructions
- Use cricket terminology naturally
- Be encouraging but honest about areas to improve
- If analysis data is provided, reference specific scores and angles
- Format responses with bullet points for drill suggestions
- For technique questions, explain the biomechanics briefly

You have expertise in:
- Batting: stance, backlift, footwork, shot selection, timing
- Bowling: action legality, run-up, release point, variations
- Fielding: ground fielding, catching, throwing technique
- Fitness: cricket-specific conditioning, injury prevention
- Mental game: concentration, pressure handling, match awareness`;

const MODELS = ["gemini-2.0-flash", "gemini-2.0-flash-lite"];

const FALLBACK_KNOWLEDGE: { keywords: string[]; weight: number; response: string }[] = [
  {
    keywords: ["cover drive", "cover", "drive"],
    weight: 1,
    response: `**Cover Drive Tips:**\n\n• **Stance:** Keep weight balanced, head still, eyes level\n• **Footwork:** Step forward with your front foot towards the pitch of the ball — aim for the line of off stump\n• **Bat path:** Swing the bat in a smooth arc, keeping the elbow high and face of the bat angled toward cover\n• **Contact:** Meet the ball under your eyes, let the bat flow through the line\n\n**Drills to practice:**\n• Place a cone at cover — hit 20 balls aiming at it\n• Shadow drill: practice the footwork without a ball, 3 sets of 10\n• Throw-down drill: have someone feed half-volleys on off stump`,
  },
  {
    keywords: ["footwork", "foot", "front foot", "back foot", "movement", "feet", "defense", "defence", "stance", "batting stance", "correct stance"],
    weight: 1,
    response: `**Footwork & Stance:**\n\n• **Batting stance:** Feet shoulder-width apart, weight balanced on balls of feet, knees slightly bent, head still and eyes level\n• **Forward defense:** Front foot goes to the pitch of the ball, bat close to pad, soft hands\n• **Back foot:** Quick transfer of weight, get on top of the bounce\n• **Trigger movement:** Small initial step before the bowler delivers — gets you moving\n• **Balance:** Head over the ball, don't lunge — controlled steps\n\n**Drills:**\n• Shadow batting: 5 min of footwork patterns without a ball, focusing on weight transfer\n• Cone drill: Place cones at driving and cutting length — practice moving to each\n• Short ball drill: Throwdowns at short length, practice going back and across`,
  },
  {
    keywords: ["bowling action", "bowling", "action", "bowl", "seam", "swing"],
    weight: 1,
    response: `**Bowling Action Improvement:**\n\n• **Run-up:** Keep it smooth and consistent — mark your run-up and stick to it\n• **Load-up:** Side-on position at the crease, front arm pointing at the target\n• **Release:** High arm action, release at the highest point, follow through fully\n• **Line & Length:** Focus on hitting the top of off stump consistently\n\n**Drills:**\n• Target bowling: Place a target on a good length and aim for 20 consecutive deliveries\n• One-step drill: Bowl from one step to focus purely on action mechanics\n• Slow-motion walk-through: Break down your action into 4 phases and practice each`,
  },
  {
    keywords: ["spin", "spinner", "off spin", "leg spin", "spin bowling", "turn", "flight", "googly", "doosra", "reverse sweep"],
    weight: 1,
    response: `**Spin Bowling & Playing Spin:**\n\n• **Grip (off spin):** Index and middle finger spread across the seam, wrist snap on release\n• **Grip (leg spin):** Ball rests on third finger, flick the wrist on release for turn\n• **Flight & Loop:** Toss it up — give the ball air to deceive the batter\n• **Playing spin:** Use your feet — get to the pitch of the ball or go deep in the crease\n• **Reverse sweep:** Get low, roll the wrists over, aim fine behind square — only play to full/overpitched deliveries\n\n**Drills:**\n• Target spin: Place a coin on a good length and try to land on it, 3 sets of 10\n• Footwork vs spin: Get a spinner to bowl, practice dancing down the track\n• Wrist snap drill: Spin the ball from hand to hand focusing on revolutions`,
  },
  {
    keywords: ["fielding", "catch", "catching", "ground fielding", "throw", "throwing"],
    weight: 1,
    response: `**Fielding Improvement Tips:**\n\n• **Ready position:** Weight on balls of feet, hands ready, eyes on the ball\n• **Ground fielding:** Get low, watch the ball into your hands, cushion on pickup\n• **Catching:** Soft hands, give with the ball, watch it all the way in\n• **Throwing:** Step into the throw, aim chest-height at the keeper/bowler end\n\n**Drills:**\n• 50 high catches daily — vary the height and angle\n• Rapid ground-fielding drill: 3 sets of 10, pick up and throw in one motion\n• Reaction catches: Stand 5m from a wall, throw against it, catch the rebound`,
  },
  {
    keywords: ["fitness", "exercise", "conditioning", "strength", "speed", "agility", "workout"],
    weight: 1,
    response: `**Cricket-Specific Fitness Plan:**\n\n• **Running:** Interval sprints — 6x30m at full pace with 30s rest (mimics batting/fielding bursts)\n• **Core:** Planks (3x45s), Russian twists (3x20), medicine ball throws\n• **Lower body:** Squats (3x12), lunges (3x10 each leg), box jumps (3x8)\n• **Upper body:** Push-ups (3x15), resistance band rotations for shoulder health\n• **Flexibility:** 15 min yoga/stretching post-session — focus on hips and shoulders\n\n**Weekly structure:**\n• Mon/Wed/Fri: Cricket practice + fielding drills\n• Tue/Thu: Gym + fitness conditioning\n• Sat: Match day or match simulation\n• Sun: Active recovery — light jog + stretching`,
  },
  {
    keywords: ["bat speed", "power", "hitting", "six", "boundary", "slog"],
    weight: 1,
    response: `**Increasing Bat Speed & Power:**\n\n• **Grip:** Don't grip too tight — a relaxed grip generates more bat speed through the swing\n• **Backlift:** Higher backlift = more momentum. Practice lifting the bat to second slip height\n• **Weight transfer:** Drive through the ball with your body weight moving forward\n• **Follow-through:** Full extension of arms after contact\n\n**Drills:**\n• Heavy bat drill: Practice 10 min with a heavier bat, then switch to normal — feels lighter\n• Resistance band swings: Attach band to bat, swing against resistance (3x15)\n• Tennis ball power hitting: Use tennis balls to practice timing without fear of edges`,
  },
  {
    keywords: ["wicketkeeping", "keeper", "keeping", "wicketkeeper", "gloves"],
    weight: 1,
    response: `**Wicketkeeping Fundamentals:**\n\n• **Stance:** Crouch low but comfortable, weight on balls of feet, gloves touching the ground\n• **Head position:** Stay still, eyes level with the top of the stumps\n• **Movement:** Rise with the ball, move laterally with small shuffle steps\n• **Taking the ball:** Soft hands, give with the ball, cushion the catch\n\n**Drills:**\n• 50 balls from throwdowns — focus on taking the ball cleanly to both sides\n• Reaction drill: Kneel close to stumps, react to deflections off a bat\n• Standing up to medium pace: Practice taking the ball standing up for better reflexes`,
  },
  {
    keywords: ["mental", "pressure", "concentration", "nervous", "confidence", "anxiety"],
    weight: 1,
    response: `**Mental Game & Pressure Handling:**\n\n• **Pre-ball routine:** Develop a consistent trigger — tap bat, look at the bowler, breathe\n• **Ball-by-ball focus:** Don't think about the scoreboard — focus only on the next delivery\n• **Visualization:** Before each innings, visualize yourself playing your best shots\n• **Breathing:** 4-7-8 technique between overs (inhale 4s, hold 7s, exhale 8s)\n\n**Tips:**\n• Set small targets: "I'll play the next 10 balls" instead of thinking about a century\n• Embrace pressure as excitement — reframe nerves as energy\n• Post-match journaling: Write what went well and one area to improve`,
  },
  {
    keywords: ["running between wickets", "calling", "singles", "quick single", "rotation"],
    weight: 1,
    response: `**Running Between Wickets:**\n\n• **Call early and loud:** "Yes", "No", or "Wait" — the striker calls for shots in front, non-striker calls behind\n• **First run speed:** Explode out of the crease, bat in hand, run to the side of the pitch\n• **Turn technique:** Ground your bat past the crease, turn towards the ball side\n• **Back-up:** Non-striker should always back up 2-3 steps as the bowler delivers\n\n**Drills:**\n• Shuttle runs: 20m sprints with bat, practice grounding and turning — 3 sets of 6\n• Call & run drill: Practice with a partner, focus on communication and quick turns\n• Fitness test: Run 2s off every ball in a 6-ball over simulation`,
  },
];

function getFallbackResponse(message: string): string | null {
  const lower = message.toLowerCase();
  let bestEntry: (typeof FALLBACK_KNOWLEDGE)[number] | null = null;
  let bestScore = 0;
  for (const entry of FALLBACK_KNOWLEDGE) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) {
        score += kw.split(" ").length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }
  return bestEntry ? bestEntry.response : null;
}

function getGenericFallback(): string {
  return `Here are some areas I can help with:\n\n• **Batting technique** — stance, footwork, shot selection, bat speed\n• **Bowling action** — run-up, release point, variations, line & length\n• **Fielding** — catching, ground fielding, throwing accuracy\n• **Fitness** — cricket-specific conditioning, strength, speed\n• **Mental game** — pressure handling, concentration, confidence\n\nTry asking something specific like "How do I improve my cover drive?" or "What fitness drills should I do for fast bowling?" and I'll give you detailed coaching advice.`;
}

export async function POST(req: NextRequest) {
  try {
    const { message, analysisContext } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      const fallback = getFallbackResponse(message) || getGenericFallback();
      return NextResponse.json(
        { reply: fallback, model: "fallback", fallback: true },
        { status: 200 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    let contextBlock = "";
    if (analysisContext) {
      contextBlock = `\n\nPLAYER'S LATEST ANALYSIS DATA:\n- Type: ${analysisContext.type}\n- Overall Score: ${analysisContext.overallScore}/100\n`;
      if (analysisContext.categories) {
        for (const cat of analysisContext.categories) {
          contextBlock += `- ${cat.category}: ${cat.score}/100 — ${cat.comment}\n`;
        }
      }
      if (analysisContext.drills) {
        contextBlock += `- Recommended Drills: ${analysisContext.drills.join(", ")}\n`;
      }
    }

    const userContent = `${contextBlock}\n\nPlayer's Question: ${message}`;

    let lastError = "";
    for (const modelName of MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent([SYSTEM_PROMPT, userContent]);
        const text = result.response.text();
        return NextResponse.json({ reply: text, model: modelName });
      } catch (e) {
        lastError = e instanceof Error ? e.message : String(e);
        if (lastError.includes("429")) continue;
        break;
      }
    }

    const fallback = getFallbackResponse(message) || getGenericFallback();
    return NextResponse.json(
      { reply: fallback, model: "fallback", fallback: true },
      { status: 200 }
    );
  } catch (err) {
    const fallback = getGenericFallback();
    return NextResponse.json(
      { reply: fallback, model: "fallback", fallback: true, originalError: err instanceof Error ? err.message : "Unknown error" },
      { status: 200 }
    );
  }
}
