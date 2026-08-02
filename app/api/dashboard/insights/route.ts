// app/api/dashboard/insights/route.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { getInsightData, presetRange } from "@/lib/analytics";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profileId = req.nextUrl.searchParams.get("profileId");
  if (!profileId) {
    return NextResponse.json({ error: "Missing profileId" }, { status: 400 });
  }

  const profile = await prisma.profile.findFirst({
    where: { id: profileId, userId: session.user.id },
    select: { id: true },
  });

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const rangeKey = (req.nextUrl.searchParams.get("range") || "30d") as "7d" | "30d" | "90d";
  const data = await getInsightData(profile.id, presetRange(rangeKey));

  return NextResponse.json(data);
}