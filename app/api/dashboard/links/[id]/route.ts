import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifySessionAndProfile } from "@/lib/auth/auth-api";

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

    return NextResponse.json({
      message: "Link deleted successfully",
      data: {
        id,
      },
    }, { status: 200 });
  } catch (error) {
    console.error("Error deleting link:", error);
    return NextResponse.json(
      { error: "Failed to delete link" },
      { status: 500 }
    );
  }
}