import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { SkillsSchema } from "@/lib/schemas/skills";
import { verifySessionAndProfile } from "@/lib/auth/auth-api";
import { revalidateProfile } from "@/lib/cache/revalidate";
import { apiError, handleApiError } from "@/lib/errors/api";

export async function POST(req: NextRequest) {
  const { errorResponse, profile } = await verifySessionAndProfile();
  if (errorResponse) return errorResponse;

  try {
    const { skills } = (await req.json()) as {
      skills?: SkillsSchema["skills"];
    };

    if (!skills) {
      return apiError("fields are missing in the skills form", 400);
    }

    const updatedSkills = await prisma.profile.update({
      where: {
        id: profile!.id,
      },
      data: {
        skills: skills.map((skill) =>
          JSON.stringify({ value: skill.value ?? "", isenable: skill.isenable ?? true }),
        ),
      },
      select: {
        id: true,
        skills: true,
      },
    });

    revalidateProfile(profile.username);

    return NextResponse.json({ data: updatedSkills }, { status: 200 });
  } catch (error) {
    return handleApiError(error, "skills/save");
  }
}
