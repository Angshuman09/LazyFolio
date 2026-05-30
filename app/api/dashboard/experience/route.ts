import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ExperienceSchema } from "@/schemas/experience";

function parseOptionalDate(value: string | null | undefined) {
  if (!value?.trim()) {
    return null;
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

export async function POST(request: NextRequest) {
  try {
    const { profileId, experiences } = (await request.json()) as {
      profileId?: string;
      experiences?: ExperienceSchema["experiences"];
    };
    if (!profileId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    await prisma.experience.deleteMany({
      where: {profileId}
    })

    const experience = await prisma.experience.createMany({
      data: (experiences ?? []).map((experience) => ({
        profileId: profileId,
        companyName: experience.companyName,
        role: experience.role,
        startdate: parseOptionalDate(experience.startdate),
        enddate: parseOptionalDate(experience.enddate),
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
