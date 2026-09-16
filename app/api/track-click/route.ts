import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profileId, label } = body ?? {};

    if (typeof profileId !== "string" || typeof label !== "string") {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    const rawUrl = process.env.INSIGHTS_SERVICE_URL?.replace(/\/+$/, "");
    if (!rawUrl) {
      return NextResponse.json({ ok: true });
    }

    const endpoint = rawUrl.endsWith("/api/v1")
    ? `${rawUrl}/track`
    : `${rawUrl}/api/v1/track`;

    await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profileId,
        eventType: "click",
        label,
      }),
    });

    return NextResponse.json({ ok: true });
  } catch(err) {
    console.error("failed to forward link click:", err);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
