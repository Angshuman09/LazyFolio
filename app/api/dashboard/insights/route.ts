import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/auth-api";
import { prisma } from "@/lib/prisma";
import { handleApiError, apiError } from "@/lib/errors/api";

function getMockInsights(rangeKey: string) {
  const days = rangeKey === "7d" ? 7 : rangeKey === "90d" ? 90 : 30;
  return {
    pageviews: 1420,
    uniqueVisitors: 618,
    clicks: [
      { label: "GitHub", count: 96 },
      { label: "X (Twitter)", count: 54 },
      { label: "LinkedIn", count: 38 },
    ],
    countries: [
      { country: "United States", count: 240 },
      { country: "India", count: 180 },
      { country: "Germany", count: 75 },
      { country: "United Kingdom", count: 52 },
    ],
    devices: [
      { device: "Desktop", count: 420 },
      { device: "Mobile", count: 198 },
    ],
    series: Array.from({ length: Math.min(days, 14) }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (Math.min(days, 14) - 1 - i));
      return {
        date: d.toISOString().slice(0, 10),
        views: Math.floor(Math.random() * 50 + 20),
      };
    }),
  };
}

export async function GET(req: NextRequest) {
  const { errorResponse, session } = await verifySession();
  if (errorResponse) return errorResponse;

  const profileId = req.nextUrl.searchParams.get("profileId");
  if (!profileId) {
    return apiError("Missing profileId", 400);
  }

  const profile = await prisma.profile.findFirst({
    where: { id: profileId, userId: session!.user.id },
    select: { id: true },
  });

  if (!profile) {
    return apiError("Profile not found", 404);
  }

  const rangeKey = (req.nextUrl.searchParams.get("range") || "30d") as "7d" | "30d" | "90d";

  const insightsServiceUrl = process.env.INSIGHTS_SERVICE_URL?.replace(/\/+$/, "");

  if (!insightsServiceUrl) {
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json(getMockInsights(rangeKey));
    }
    return apiError("Insights service not configured", 500);
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
      if (process.env.NODE_ENV === "development") {
        return NextResponse.json(getMockInsights(rangeKey));
      }
      const errorText = await response.text();
      console.error(`Insight service error (${response.status}) at ${targetUrl}:`, errorText);
      return apiError("Failed to fetch insights", 502);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json(getMockInsights(rangeKey));
    }
    return handleApiError(error, "insights/fetch");
  }
}
