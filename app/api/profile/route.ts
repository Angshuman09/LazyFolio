import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFromCloudinary } from "../upload/route";

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "Missing userId parameter" },
      { status: 400 },
    );
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        experiences: true,
        projects: true,
        blogs: true,
        links: true,
      },
    });
    return NextResponse.json(profile, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      name,
      bio,
      location,
      email,
      avatar,
      banner,
      quote,
      username,
      tagline,
      bookAcall,
      themeId,
    } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 }
      );
    }

    if (username) {
      const existingUser = await prisma.profile.findUnique({
        where: { username },
      });

      if (existingUser && existingUser.userId !== userId) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 409 }
        );
      }
    }

    const existingProfile = await prisma.profile.findUnique({ where: { userId } });

    const newAvatar = optionalString(avatar);
    const newBanner = optionalString(banner);

    if (existingProfile?.avatar) {
      const avatarChanged = newAvatar !== existingProfile.avatar;
      if (avatarChanged) {
        await deleteFromCloudinary(existingProfile.avatar);
      }
    }

    if (existingProfile?.banner) {
      const bannerChanged = newBanner !== existingProfile.banner;
      if (bannerChanged) {
        await deleteFromCloudinary(existingProfile.banner);
      }
    }

    const profileData = {
      name: clearableString(name),
      bio: clearableString(bio),
      location: clearableString(location),
      email: clearableString(email),
      avatar: optionalString(avatar),
      banner: optionalString(banner),
      quote: clearableString(quote),
      username: optionalString(username),
      tagline: clearableString(tagline),
      bookAcall: clearableString(bookAcall),
      themeId: optionalString(themeId),
    };

    const profile = await prisma.profile.upsert({
      where: { userId },
      update: profileData,
      create: {
        userId,
        ...profileData,
      },
    });

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error("Failed to post profile", error);
    return NextResponse.json(
      { error: "Failed to post profile" },
      { status: 500 }
    );
  }
}
