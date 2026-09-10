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

  const insightsServiceUrl = process.env.INSIGHTS_SERVICE_URL;

  if(!insightsServiceUrl){
    return NextResponse.json({error:"Insights service not configured"},{ status: 500 });
  }

  try {
    const response = await fetch(`${insightsServiceUrl}/api/v1/insights?profileId=${profile.id}&range=${rangeKey}`,{
      headers:{
        "x-service-secret": process.env.INSIGHTS_SERVICE_SECRET || ""
      },
      next: {revalidate: 60}
    });

    if(!response.ok){
      return NextResponse.json({error:"Failed to fetch from insight service"},{status: response.status});
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("error in connecting insight service: ", error);
    return NextResponse.json({error:"internal server error "},{status: 500});
  }
}