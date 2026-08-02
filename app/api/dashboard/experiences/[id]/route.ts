import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma';
import { verifySessionAndProfile } from "@/lib/auth/auth-api";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { errorResponse, profile } = await verifySessionAndProfile();
  if (errorResponse) return errorResponse;

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing experience id" }, { status: 400 });
    }

    const experience = await prisma.experience.findFirst({
      where: { id, profileId: profile!.id },
      select: { id: true }
    });

    if (!experience) {
      return NextResponse.json({ error: "Experience not found or unauthorized" }, { status: 403 });
    }

    await prisma.experience.delete({
      where: { id },
      select: { id: true }
    });

    return NextResponse.json({ message: "experience deleted successfully" }, { status: 200 });
  } catch (error) {
    console.log("error in deleting an experience: ", error);
    return NextResponse.json({ message: `error in deleting an experience: ${error}` }, { status: 500 });
  }
}