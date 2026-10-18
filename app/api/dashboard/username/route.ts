import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/auth-api";
import { revalidateProfile } from "@/lib/cache/revalidate";
import { rewriteBlogLinksOnUsernameChange } from "@/lib/db/blog-links";
import { isReservedUsername, isValidUsername } from "@/lib/utils/username";

export async function POST(req: NextRequest) {
  const { errorResponse, session } = await verifySession();
  if (errorResponse) return errorResponse;

  try {
    const { username } = (await req.json()) as {
      username?: string;
    };
    const userId = session!.user.id;
    const normalizedUsername = username?.trim().toLowerCase();

    if (!normalizedUsername) {
      return NextResponse.json(
        { error: "username is required"},
        { status: 400 },
      );
    }

    if (!isValidUsername(normalizedUsername)) {
      return NextResponse.json(
        { error: "Username must be 3-30 lowercase letters, numbers, or hyphens." },
        { status: 400 }
      );
    }

    if (isReservedUsername(normalizedUsername)) {
      return NextResponse.json(
        { error: "username is reserved" },
        { status: 400 }
      );
    }

    const existingUsername = await prisma.profile.findUnique({
      where: {
        username: normalizedUsername,
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

    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
      select: { username: true },
    });
    const oldUsername = existingProfile?.username ?? null;

    const updatedProfile = await prisma.profile.upsert({
      where: {
        userId: userId          
      },
      update: {
        username: normalizedUsername
      },
      create: {
        userId: userId,         
        username: normalizedUsername
      },
      select: {
        id: true,
        username: true,
        userId: true
      }
    });

    const newUsername = updatedProfile.username;
    if (oldUsername && newUsername && oldUsername !== newUsername) {
      await rewriteBlogLinksOnUsernameChange(
        updatedProfile.id,
        oldUsername,
        newUsername,
      );

      revalidateProfile(oldUsername);
    }

    revalidateProfile(newUsername);

    return NextResponse.json({ data: updatedProfile }, { status: 200 });
  } catch (error) {
    console.error("Error handling username request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
