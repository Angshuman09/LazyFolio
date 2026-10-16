import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { profileId } = body ?? {};

    if (typeof profileId !== "string" || !profileId) {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    const rawUrl = process.env.INSIGHTS_SERVICE_URL?.replace(/\/+$/, "");
    if (!rawUrl) {
      return NextResponse.json({ ok: true });
    }

    const endpoint = rawUrl.endsWith("/api/v1")
      ? `${rawUrl}/track`
      : `${rawUrl}/api/v1/track`;

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip");
    const country = req.headers.get("x-vercel-ip-country");
    const userAgent = req.headers.get("user-agent");

    // Use a short timeout (1.5s) so background tracking never blocks or hangs
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);

    await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(ip ? { "x-real-ip": ip } : {}),
        ...(userAgent ? { "user-agent": userAgent } : {}),
        ...(country ? { "x-vercel-ip-country": country } : {}),
      },
      body: JSON.stringify({
        profileId,
        eventType: "pageview",
      }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    return NextResponse.json({ ok: true });
  } catch {
    // Graceful swallow so tracking errors never impact the user experience
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
