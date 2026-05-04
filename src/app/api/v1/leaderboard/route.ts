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
  const category = url.searchParams.get("category") || "overall";
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 50);

  // Empty — leaderboard will be populated from real user data
  const entries: { rank: number; playerId: string; name: string; score: number; region: string }[] = [];

  return NextResponse.json({
    data: { category, entries: entries.slice(0, limit) },
    pagination: { total: entries.length, limit },
  });
}
