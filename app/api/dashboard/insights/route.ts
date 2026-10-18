import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/auth-api";
import { prisma } from "@/lib/prisma";
import { handleApiError, apiError } from "@/lib/errors/api";

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
      const errorText = await response.text();
      console.error(`Insight service error (${response.status}) at ${targetUrl}:`, errorText);
      return apiError("Failed to fetch insights", 502);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error, "insights/fetch");
  }
}