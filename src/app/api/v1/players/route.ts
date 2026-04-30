import { NextRequest, NextResponse } from "next/server";

const MOCK_PLAYERS = [
  { id: "p1", name: "Arjun Patel", country: "USA", region: "Americas", role: "Batsman", ageGroup: "U19", stats: { matches: 45, runs: 1247, battingAverage: 34.6, wickets: 0, economy: 0 } },
  { id: "p2", name: "Jake Thompson", country: "USA", region: "Americas", role: "All-Rounder", ageGroup: "U17", stats: { matches: 38, runs: 890, battingAverage: 28.7, wickets: 42, economy: 6.2 } },
  { id: "p3", name: "Rashid Mohammed", country: "USA", region: "Americas", role: "Bowler", ageGroup: "U19", stats: { matches: 40, runs: 312, battingAverage: 12.0, wickets: 68, economy: 5.8 } },
];

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing x-api-key header. Get your key at /developers" },
      { status: 401 }
    );
  }

  const url = new URL(req.url);
  const role = url.searchParams.get("role");
  const region = url.searchParams.get("region");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 100);
  const offset = parseInt(url.searchParams.get("offset") || "0");

  let results = [...MOCK_PLAYERS];
  if (role) results = results.filter((p) => p.role.toLowerCase() === role.toLowerCase());
  if (region) results = results.filter((p) => p.region.toLowerCase() === region.toLowerCase());

  const total = results.length;
  results = results.slice(offset, offset + limit);

  return NextResponse.json({
    data: results,
    pagination: { total, limit, offset, hasMore: offset + limit < total },
  });
}
