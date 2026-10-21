import { NextResponse } from "next/server";
import { verifySessionAndProfile } from "@/lib/auth/auth-api";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils/blogs";
import { getPortfolioBlogPath } from "@/lib/utils/public-url";
import { handleApiError } from "@/lib/errors/api";
import { revalidateProfile } from "@/lib/cache/revalidate";

export async function POST(req: Request) {
  const { errorResponse, profile } = await verifySessionAndProfile();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json().catch(() => ({}));
    const rawTitle = typeof body.title === "string" ? body.title.trim() : "";
    const title = rawTitle || "Untitled";
    const slug = generateSlug(title);
    const blogLink = getPortfolioBlogPath(slug);

    const blog = await prisma.blog.create({
      data: {
        profileId: profile!.id,
        type: "INTERNAL",
        title: rawTitle,
        content: typeof body.content === "string" ? body.content : "",
        isPublished: Boolean(body.isPublished),
        isEnabled: true,
        slug,
        blogLink,
        description: null,
      },
      select: {
        id: true,
        title: true,
        content: true,
        isPublished: true,
        slug: true,
        description: true,
        isEnabled: true,
        type: true,
        blogLink: true,
      },
    });

    revalidateProfile(profile!.username);

    return NextResponse.json({ blog }, { status: 201 });
  } catch (error) {
    return handleApiError(error, "blogs/create");
  }
}
