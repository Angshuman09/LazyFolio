import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth/auth-api";
import { revalidateProfile } from "@/lib/cache/revalidate";
import { handleApiError } from "@/lib/errors/api";
import { profileSelect } from "@/lib/constants/apis";
import { rewriteBlogLinksOnUsernameChange } from "@/lib/db/blog-links";
import { isReservedUsername, isValidUsername } from "@/lib/utils/username";


function optionalString(value: string | null | undefined) {
  if (typeof value !== "string") {
    return value ?? undefined;
  }

  const trimmedValue = value.trim();
  return trimmedValue === "" ? undefined : trimmedValue;
}

function clearableString(value: string | null | undefined) {
  if (typeof value !== "string") {
    return value ?? undefined;
  }

  const trimmedValue = value.trim();
  return trimmedValue === "" ? null : trimmedValue;
}

async function getSkillsIsenable(profileId?: string | null) {
  if (!profileId) {
    return true;
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      select: { skillsIsenable: true },
    });
    return profile?.skillsIsenable ?? true;
  } catch (error) {
    console.error("Failed to read skills visibility", error);
    return true;
  }
}

export async function GET(request: NextRequest) {
  const { errorResponse, session } = await verifySession();
  if (errorResponse) return errorResponse;

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "Missing userId parameter" },
      { status: 400 },
    );
  }

  if (userId !== session!.user.id) {
    return NextResponse.json(
      { error: "Forbidden: You do not own this profile" },
      { status: 403 },
    );
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: profileSelect,
    });
    if (!profile) {
      return NextResponse.json(profile, { status: 200 });
    }

    const skillsIsenable = await getSkillsIsenable(profile.id);
    return NextResponse.json({ ...profile, skillsIsenable }, { status: 200 });
  } catch (error) {
    return handleApiError(error, "profile/get");
  }
}

export async function POST(request: NextRequest) {
  const { errorResponse, session } = await verifySession();
  if (errorResponse) return errorResponse;

  try {
    const {
      name,
      bio,
      email,
      quote,
      username,
      tagline,
      bookAcall,
      themeId,
      skillsIsenable,
    } = await request.json();

    const targetUserId = session!.user.id;

    const normalizedUsername = username?.trim().toLowerCase();

    if (normalizedUsername) {
      if (!isValidUsername(normalizedUsername)) {
        return NextResponse.json(
          { error: "Username must be 3-30 lowercase letters, numbers, or hyphens." },
          { status: 400 }
        );
      }

      if (isReservedUsername(normalizedUsername)) {
        return NextResponse.json(
          { error: "Username is reserved" },
          { status: 400 }
        );
      }

      const existingUser = await prisma.profile.findUnique({
        where: { username: normalizedUsername },
        select: { userId: true },
      });

      if (existingUser && existingUser.userId !== targetUserId) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 409 }
        );
      }
    }

    const profileData = {
      name: clearableString(name),
      bio: clearableString(bio),
      email: clearableString(email),
      quote: clearableString(quote),
      username: optionalString(normalizedUsername),
      tagline: clearableString(tagline),
      bookAcall: clearableString(bookAcall),
      themeId: optionalString(themeId),
    };

    // Read the current username before the upsert so we know if it changed
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: targetUserId },
      select: { username: true },
    });
    const oldUsername = existingProfile?.username ?? null;

    const profile = await prisma.profile.upsert({
      where: { userId: targetUserId },
      update: profileData,
      create: {
        userId: targetUserId,
        ...profileData,
      },
      select: profileSelect,
    });

    // If the username changed, rewrite internal blog link URLs so old posts
    // remain accessible under the new username path.
    await rewriteBlogLinksOnUsernameChange(
      profile.id,
      oldUsername,
      profile.username,
    );

    if (typeof skillsIsenable === "boolean") {
      try {
        await prisma.profile.update({
          where: { id: profile.id },
          data: { skillsIsenable },
        });
      } catch (error) {
        console.error("Failed to update skills visibility", error);
      }
    }

    const nextSkillsIsenable =
      typeof skillsIsenable === "boolean"
        ? skillsIsenable
        : await getSkillsIsenable(profile.id);

    if (oldUsername && oldUsername !== profile.username) {
      revalidateProfile(oldUsername);
    }
    revalidateProfile(profile.username);

    return NextResponse.json(
      { ...profile, skillsIsenable: nextSkillsIsenable },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error, "profile/save");
  }
}
