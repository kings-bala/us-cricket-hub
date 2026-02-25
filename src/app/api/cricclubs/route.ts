import { NextRequest, NextResponse } from "next/server";
import { parseHtml, parseUrlMeta } from "@/lib/cricclubs-parser";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!url.includes("cricclubs.com")) {
      return NextResponse.json({ error: "Not a valid CricClubs URL" }, { status: 400 });
    }

    const meta = parseUrlMeta(url);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });

      clearTimeout(timeout);

      if (!res.ok) {
        return NextResponse.json(
          {
            error: "cloudflare",
            message:
              "CricClubs is protected by Cloudflare. Please use the paste method instead.",
            meta,
          },
          { status: 200 }
        );
      }

      const html = await res.text();
      if (html.includes("Performing security verification") || html.includes("cf-challenge")) {
        return NextResponse.json(
          {
            error: "cloudflare",
            message:
              "CricClubs is protected by Cloudflare. Please use the paste method instead.",
            meta,
          },
          { status: 200 }
        );
      }

      const stats = parseHtml(html);
      return NextResponse.json({ stats, meta });
    } catch {
      clearTimeout(timeout);
      return NextResponse.json(
        {
          error: "cloudflare",
          message:
            "Could not reach CricClubs. Please use the paste method instead.",
          meta,
        },
        { status: 200 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
