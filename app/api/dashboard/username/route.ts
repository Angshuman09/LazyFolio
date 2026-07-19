import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth-api";
import { revalidateProfile } from "@/lib/cache/revalidate";

export async function POST(req: NextRequest) {
  const { errorResponse, session } = await verifySession();
  if (errorResponse) return errorResponse;

  try {
    const { username } = (await req.json()) as {
      username?: string;
    };
    const userId = session!.user.id;

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

    // Read the current username before upsert so we know if it changed
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

    const newUsername = updatedProfile.username;
    if (oldUsername && newUsername && oldUsername !== newUsername) {
      try {
        // Fetch all blogs for this profile that have a stored blogLink
        const blogsToUpdate = await prisma.blog.findMany({
          where: {
            profileId: updatedProfile.id,
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
        console.error("Failed to update blog links after username change:", error);
      }

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
