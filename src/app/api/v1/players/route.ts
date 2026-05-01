import { NextRequest, NextResponse } from "next/server";

// Empty — player data will be populated from real user profiles
const MOCK_PLAYERS: { id: string; name: string; country: string; region: string; role: string; ageGroup: string; stats: { matches: number; runs: number; battingAverage: number; wickets: number; economy: number } }[] = [];

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
