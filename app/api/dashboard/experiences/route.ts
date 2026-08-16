import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ExperienceSchema } from "@/lib/schemas/experience";
import { verifySessionAndProfile } from "@/lib/auth/auth-api";
import { revalidateProfile } from "@/lib/cache/revalidate";
import { parseOptionalDate } from "@/lib/utils/blogs";
import { isBlankExperience, validateExperience } from "@/lib/utils/validate-dashboard";


export async function POST(request: NextRequest) {
  const { errorResponse, profile } = await verifySessionAndProfile();
  if (errorResponse) return errorResponse;

  try {
    const { experiences } = (await request.json()) as {
      experiences?: ExperienceSchema["experiences"];
    };

    const profileId = profile!.id;
    const nonBlankExperiences = (experiences ?? []).filter(
      (experience) => !isBlankExperience(experience),
    );

    for (const experience of nonBlankExperiences) {
      const validation = validateExperience(experience);
      if (!validation.ok) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
    }

    await prisma.experience.deleteMany({
      where: {profileId}
    })

    const experience = await prisma.experience.createMany({
      data: nonBlankExperiences.map((experience) => ({
        profileId: profileId,
        companyName: experience.companyName!.trim(),
        role: experience.role!.trim(),
        startdate: parseOptionalDate(experience.startdate),
        enddate: parseOptionalDate(experience.enddate),
        description: experience.description?.trim() || null,
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
