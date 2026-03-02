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

  const entries = [
    { rank: 1, playerId: "p1", name: "Arjun Patel", score: 892, region: "Americas" },
    { rank: 2, playerId: "p3", name: "Rashid Mohammed", score: 845, region: "Americas" },
    { rank: 3, playerId: "p2", name: "Jake Thompson", score: 801, region: "Americas" },
  ];

  return NextResponse.json({
    data: { category, entries: entries.slice(0, limit) },
    pagination: { total: entries.length, limit },
  });
}
