import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

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

  const insightsServiceUrl = process.env.INSIGHTS_SERVICE_URL?.replace(/\/+$/, "");

  if (!insightsServiceUrl) {
    return NextResponse.json({ error: "Insights service not configured" }, { status: 500 });
  }

  const endpointBase = insightsServiceUrl.endsWith("/api/v1")
    ? insightsServiceUrl
    : `${insightsServiceUrl}/api/v1`;

  const targetUrl = `${endpointBase}/insights?profileId=${profile.id}&range=${rangeKey}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "x-service-secret": process.env.INSIGHTS_SERVICE_SECRET || "",
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Insight service error (${response.status}) at ${targetUrl}:`, errorText);
      return NextResponse.json(
        {
          error: "Failed to fetch from insight service",
          serviceStatus: response.status,
          serviceError: errorText,
          targetUrl,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("error in connecting insight service: ", error);
    return NextResponse.json(
      { error: "internal server error", details: String(error) },
      { status: 500 }
    );
  }
}