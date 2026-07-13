import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ExperienceSchema } from "@/lib/schemas/experience";
import { verifySessionAndProfile } from "@/lib/auth-api";
import { revalidateProfile } from "@/lib/cache/revalidate";

function parseOptionalDate(value: string | null | undefined) {
  if (!value?.trim()) {
    return null;
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

export async function POST(request: NextRequest) {
  const { errorResponse, profile } = await verifySessionAndProfile();
  if (errorResponse) return errorResponse;

  try {
    const { experiences } = (await request.json()) as {
      experiences?: ExperienceSchema["experiences"];
    };

    const profileId = profile!.id;

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
        isenable: experience.isenable ?? true,
      })),
    });

    revalidateProfile(profile.username);

    return NextResponse.json(experience, { status: 200 });
  } catch (error) {
    console.log("Error in experience route", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
