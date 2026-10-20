import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { LinkType } from "@/db/enums";
import { verifySessionAndProfile } from "@/lib/auth/auth-api";
import { revalidateProfile } from "@/lib/cache/revalidate";
import { LinkInput } from "@/lib/constants/apis";
import { diffCollection } from "@/lib/utils/collection-sync";
import { isBlankLink, validateLink } from "@/lib/utils/validate-dashboard";
import { handleApiError } from "@/lib/errors/api";

function toLinkData(link: LinkInput) {
  return {
    type: link.type ?? LinkType.CUSTOM,
    label: link.label.trim(),
    url: link.url.trim(),
    isenable: link.isenable ?? true,
  };
}

export async function POST(req: NextRequest) {
  const { errorResponse, profile } = await verifySessionAndProfile();
  if (errorResponse) return errorResponse;

  try {
    const { links } = (await req.json()) as {
      links?: LinkInput[];
    };
    if (!links) {
      return NextResponse.json(
        { error: "field are missing in links form" },
        { status: 400 },
      );
    }

    const profileId = profile!.id;
    const nonBlankLinks = links.filter((link) => !isBlankLink(link));

    for (const link of nonBlankLinks) {
      const validation = validateLink(link);
      if (!validation.ok) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
    }

    const existingLinks = await prisma.links.findMany({
      where: { profileId },
    });

    const { creates, updates, removedIds } = diffCollection(
      existingLinks,
      nonBlankLinks,
      (existing, link) => {
        const next = toLinkData(link);
        return (
          existing.type === next.type &&
          existing.label === next.label &&
          existing.url === next.url &&
          existing.isenable === next.isenable
        );
      },
    );

    const operations = [
      ...(removedIds.length
        ? [
            prisma.links.deleteMany({
              where: { profileId, id: { in: removedIds } },
            }),
          ]
        : []),
      ...updates.map((link) =>
        prisma.links.update({
          where: { id: link.id! },
          data: toLinkData(link),
        }),
      ),
      ...(creates.length
        ? [
            prisma.links.createMany({
              data: creates.map((link) => ({
                profileId,
                ...toLinkData(link),
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
    return handleApiError(error, "links/save");
  }
}
