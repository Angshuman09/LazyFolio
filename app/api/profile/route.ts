import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
      },
    });
    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
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
      username,
      tagline,
    } = await request.json();
    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 },
      );
    }
    const profile = await prisma.profile.update({
      where: { userId },
      data: {
        name: name ?? undefined,
        bio: bio ?? undefined,
        location: location ?? undefined,
        email: email ?? undefined,
        avatar: avatar ?? undefined,
        banner: banner ?? undefined,
        username: username ?? undefined,
        tagline: tagline ?? undefined,
      },
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
