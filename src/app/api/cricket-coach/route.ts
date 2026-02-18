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

export async function POST(req: NextRequest) {
  try {
    const { message, analysisContext } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "no_api_key", message: "Gemini API key not configured. Add GOOGLE_AI_API_KEY to environment." },
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

    return NextResponse.json(
      { error: "llm_error", message: lastError || "All models failed" },
      { status: 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: "llm_error", message }, { status: 200 });
  }
}
