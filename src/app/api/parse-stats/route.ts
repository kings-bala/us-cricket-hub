import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MODELS = ["gemini-2.0-flash", "gemini-2.0-flash-lite"];

const PROMPT = `You are a cricket statistics extractor. Given text copied from a cricket stats website (CricClubs or CricHeroes), extract the player's career statistics.

Return ONLY valid JSON with these fields (use empty string "" if not found):
{
  "playerName": "Full name of the player",
  "teamName": "Current team name",
  "totalMatches": "Total career matches played (number as string)",
  "totalRuns": "Total career runs scored (number as string)",
  "totalWickets": "Total career wickets taken (number as string)",
  "battingAverage": "Career batting average (decimal as string, e.g. '31.80')",
  "bowlingAverage": "Career bowling average (decimal as string, e.g. '16.85')",
  "strikeRate": "Career batting strike rate (decimal as string, e.g. '65.67')",
  "economy": "Career bowling economy rate (decimal as string, e.g. '5.03')",
  "innings": "Total batting innings (number as string)",
  "highScore": "Highest score (number as string)",
  "hundreds": "Total centuries (number as string)",
  "fifties": "Total half-centuries (number as string)",
  "overs": "Total overs bowled (number as string)",
  "bestBowling": "Best bowling figures (e.g. '5/23')"
}

IMPORTANT RULES:
- For totals (matches, runs, wickets): Use the career summary totals shown at the top of the page, NOT format-specific numbers
- For averages and rates: If the page shows per-format data (One Day, Twenty20, etc.), calculate the COMBINED average across all formats
- Batting Average = Total Runs / (Total Innings - Not Outs)
- Strike Rate = (Total Runs / Total Balls Faced) * 100
- Bowling Average = Total Runs Conceded / Total Wickets
- Economy = Total Runs Conceded / Total Overs
- If a player has 0 wickets, bowling average and economy should be "0"
- Return ONLY the JSON object, no markdown, no explanation`;

export async function POST(req: NextRequest) {
  try {
    const { text, source } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "no_api_key", message: "Gemini API key not configured" },
        { status: 200 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const sourceLabel = source === "cricheroes" ? "CricHeroes" : "CricClubs";
    const userContent = `\nSource website: ${sourceLabel}\n\nPlayer page text:\n${text.slice(0, 8000)}`;

    let lastError = "";
    for (const modelName of MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent([PROMPT, userContent]);
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) continue;

        const stats = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ stats, source: sourceLabel, method: "gemini", model: modelName });
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
    return NextResponse.json(
      { error: "llm_error", message },
      { status: 200 }
    );
  }
}
