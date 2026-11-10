import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ExperienceSchema, SingleExperience } from "@/lib/schemas/experience";
import { verifySessionAndProfile } from "@/lib/auth/auth-api";
import { revalidateProfile } from "@/lib/cache/revalidate";
import { diffCollection } from "@/lib/utils/collection-sync";
import { parseOptionalDate } from "@/lib/utils/date";
import {
  isBlankExperience,
  validateExperience,
} from "@/lib/utils/validate-dashboard";
import { handleApiError } from "@/lib/errors/api";

function toExperienceData(experience: SingleExperience & { order?: number }) {
  return {
    companyName: experience.companyName!.trim(),
    role: experience.role!.trim(),
    startdate: parseOptionalDate(experience.startdate),
    enddate: parseOptionalDate(experience.enddate),
    description: experience.description?.trim() || null,
    isenable: experience.isenable ?? true,
    order: experience.order ?? 0,
  };
}

function sameDate(a: Date | null, b: Date | null) {
  return (a?.getTime() ?? null) === (b?.getTime() ?? null);
}

export async function POST(request: NextRequest) {
  const { errorResponse, profile } = await verifySessionAndProfile();
  if (errorResponse) return errorResponse;

  try {
    const { experiences } = (await request.json()) as {
      experiences?: ExperienceSchema["experiences"];
    };

    const profileId = profile!.id;
    // Array position in the form is the display order.
    const nonBlankExperiences = (experiences ?? [])
      .filter((experience) => !isBlankExperience(experience))
      .map((experience, index) => ({ ...experience, order: index }));

    for (const experience of nonBlankExperiences) {
      const validation = validateExperience(experience);
      if (!validation.ok) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
    }

    const existingExperiences = await prisma.experience.findMany({
      where: { profileId },
    });

    const { creates, updates, removedIds } = diffCollection(
      existingExperiences,
      nonBlankExperiences,
      (existing, experience) => {
        const next = toExperienceData(experience);
        return (
          existing.companyName === next.companyName &&
          existing.role === next.role &&
          sameDate(existing.startdate, next.startdate) &&
          sameDate(existing.enddate, next.enddate) &&
          existing.description === next.description &&
          existing.isenable === next.isenable &&
          existing.order === next.order
        );
      },
    );

    const operations = [
      ...(removedIds.length
        ? [
            prisma.experience.deleteMany({
              where: { profileId, id: { in: removedIds } },
            }),
          ]
        : []),
      ...updates.map((experience) =>
        prisma.experience.update({
          where: { id: experience.id! },
          data: toExperienceData(experience),
        }),
      ),
      ...(creates.length
        ? [
            prisma.experience.createMany({
              data: creates.map((experience) => ({
                profileId,
                ...toExperienceData(experience),
              })),
            }),
          ]
        : []),
    ];

    if (operations.length) {
      await prisma.$transaction(operations);
    }

    revalidateProfile(profile.username);

    return NextResponse.json(
      {
        data: {
          created: creates.length,
          updated: updates.length,
          deleted: removedIds.length,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error, "experiences/save");
  }
}
