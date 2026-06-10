import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing project id" },
        { status: 400 }
      );
    }

    await prisma.project.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json(
      {
        message: "Project deleted successfully",
        data: { id },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
