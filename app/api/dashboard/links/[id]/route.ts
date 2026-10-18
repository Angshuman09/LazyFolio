import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifySessionAndProfile } from "@/lib/auth/auth-api";
import { revalidateProfile } from "@/lib/cache/revalidate";
import { handleApiError } from "@/lib/errors/api";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { errorResponse, profile } = await verifySessionAndProfile();
  if (errorResponse) return errorResponse;

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing link id" },
        { status: 400 }
      );
    }

    const link = await prisma.links.findFirst({
      where: { id, profileId: profile!.id },
      select: { id: true }
    });

    if (!link) {
      return NextResponse.json(
        { error: "Link not found or unauthorized" },
        { status: 403 }
      );
    }

    await prisma.links.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    revalidateProfile(profile.username);

    return NextResponse.json({
      message: "Link deleted successfully",
      data: {
        id,
      },
    }, { status: 200 });
  } catch (error) {
    return handleApiError(error, "links/delete");
  }
}