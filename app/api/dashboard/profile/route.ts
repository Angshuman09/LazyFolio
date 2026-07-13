import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth-api";
import { revalidateProfile } from "@/lib/cache/revalidate";
const profileSelect = {
  id: true,
  avatar: true,
  banner: true,
  name: true,
  email: true,
  quote: true,
  userId: true,
  username: true,
  bio: true,
  skills: true,
  themeId: true,
  resume: true,
  tagline: true,
  bookAcall: true,
  createdAt: true,
  updatedAt: true,
  experiences: true,
  projects: true,
  blogs: true,
  links: true,
};

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
    console.error("Failed to fetch profile", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const { errorResponse, session } = await verifySession();
  if (errorResponse) return errorResponse;

  try {
    const {
      userId,
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

    if (username) {
      const existingUser = await prisma.profile.findUnique({
        where: { username },
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
      username: optionalString(username),
      tagline: clearableString(tagline),
      bookAcall: clearableString(bookAcall),
      themeId: optionalString(themeId),
    };

    const profile = await prisma.profile.upsert({
      where: { userId: targetUserId },
      update: profileData,
      create: {
        userId: targetUserId,
        ...profileData,
      },
      select: profileSelect,
    });

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

    revalidateProfile(profile.username);

    return NextResponse.json(
      { ...profile, skillsIsenable: nextSkillsIsenable },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to post profile", error);
    return NextResponse.json(
      { error: "Failed to post profile" },
      { status: 500 }
    );
  }
}
