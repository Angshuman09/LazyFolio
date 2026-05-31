import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username, userId } = (await req.json()) as {
      username?: string;
      userId: string;
    };

    if (!username) {
      return NextResponse.json(
        { error: "username is required" },
        { status: 400 },
      );
    }

    const existingUsername = await prisma.profile.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
      },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "username is already taken" },
        { status: 400 },
      );
    }

    const updatedProfile = await prisma.profile.upsert({
    where: {
        userId: userId          
    },
    update: {
        username: username
    },
    create: {
        userId: userId,         
        username: username
    },
    select: {
        id: true,
        username: true,
        userId: true
    }
});

    return NextResponse.json({ data: updatedProfile }, { status: 200 });
  } catch (error) {
    console.error("Error handling username request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
