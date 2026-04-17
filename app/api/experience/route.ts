import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { profileId, experiences } = await request.json();
    if (!profileId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const experience = await prisma.experience.createMany({
      data: experiences.map((experience: any) => ({
        profileId: profileId,
        company: experience.company,
        role: experience.role,
        startdate: experience.startdate,
        enddate: experience.enddate,
        description: experience.description,
      })),
    });

    return NextResponse.json(experience, { status: 200 });
  } catch (error) {
    console.log("Error in experience route", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
