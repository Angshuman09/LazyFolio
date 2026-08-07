import { NextRequest, NextResponse } from "next/server";
import { trackLinkClick } from "@/lib/utils/analytics";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profileId, label } = body ?? {};

    if (typeof profileId !== "string" || typeof label !== "string") {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    await trackLinkClick(profileId, label);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
