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
    const newUsername = profile.username;
    if (
      oldUsername &&
      newUsername &&
      oldUsername !== newUsername
    ) {
      try {
        // Fetch all blogs for this profile that have a stored blogLink
        const blogsToUpdate = await prisma.blog.findMany({
          where: {
            profileId: profile.id,
            blogLink: { startsWith: `/${oldUsername}/blogs/` },
          },
          select: { id: true, blogLink: true },
        });

        // Replace the old username prefix with the new one in each blogLink
        await Promise.all(
          blogsToUpdate.map((blog) =>
            prisma.blog.update({
              where: { id: blog.id },
              data: {
                blogLink: blog.blogLink!.replace(
                  `/${oldUsername}/blogs/`,
                  `/${newUsername}/blogs/`
                ),
              },
            })
          )
        );
      } catch (error) {
        // Non-critical — log and continue
        console.error("Failed to update blog links after username change", error);
      }
    }

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

    // Revalidate both old and new usernames so stale caches are purged
    if (oldUsername && oldUsername !== profile.username) {
      revalidateProfile(oldUsername);
    }
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
