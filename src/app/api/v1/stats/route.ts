import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing x-api-key header. Get your key at /developers" },
      { status: 401 }
    );
  }

  const url = new URL(req.url);
  const playerId = url.searchParams.get("playerId");

  if (!playerId) {
    return NextResponse.json({ error: "playerId query parameter is required" }, { status: 400 });
  }

  return NextResponse.json({
    data: {
      playerId,
      matches: 45,
      innings: 42,
      runs: 1247,
      battingAverage: 34.6,
      strikeRate: 128.4,
      fifties: 8,
      hundreds: 2,
      wickets: 12,
      bowlingAverage: 32.1,
      economy: 7.2,
      catches: 18,
    },
  });
}
