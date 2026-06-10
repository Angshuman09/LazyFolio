import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing experience id" }, { status: 400 });
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