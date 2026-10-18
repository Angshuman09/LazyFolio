import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifySessionAndProfile } from "@/lib/auth/auth-api";
import { revalidateProfile } from "@/lib/cache/revalidate";
import { apiError, handleApiError } from "@/lib/errors/api";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { errorResponse, profile } = await verifySessionAndProfile();
  if (errorResponse) return errorResponse;

  try {
    const { id } = await params;

    if (!id) {
      return apiError("Missing project id", 400);
    }

    const project = await prisma.project.findFirst({
      where: { id, profileId: profile!.id },
      select: { id: true }
    });

    if (!project) {
      return apiError("Project not found or unauthorized", 403);
    }

    await prisma.project.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    revalidateProfile(profile.username);

    return NextResponse.json(
      {
        message: "Project deleted successfully",
        data: { id },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, "projects/delete");
  }
}
