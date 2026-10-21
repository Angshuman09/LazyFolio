import { prisma } from "@/lib/prisma";
import { deleteFromCloudinary } from "@/lib/utils/cloudinary";
import { extractBlogImagePublicIds } from "@/lib/utils/blog-images";
import { NextRequest, NextResponse } from "next/server";
import { verifySessionAndProfile } from "@/lib/auth/auth-api";
import { revalidateProfile } from "@/lib/cache/revalidate";
import { handleApiError } from "@/lib/errors/api";
import { generateSlug } from "@/lib/utils/blogs";
import { getPortfolioBlogPath } from "@/lib/utils/public-url";
import { extractPlainText } from "@/lib/utils/tiptap-content";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { errorResponse, profile } = await verifySessionAndProfile();
  if (errorResponse) return errorResponse;

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing blog id" }, { status: 400 });
    }

    const blog = await prisma.blog.findFirst({
      where: { id, profileId: profile!.id },
      select: {
        id: true,
        title: true,
        content: true,
        isPublished: true,
        slug: true,
        description: true,
        isEnabled: true,
        type: true,
      },
    });

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found or unauthorized" },
        { status: 403 },
      );
    }

    return NextResponse.json({ blog });
  } catch (error) {
    return handleApiError(error, "blogs/get");
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { errorResponse, profile } = await verifySessionAndProfile();
  if (errorResponse) return errorResponse;

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing blog id" }, { status: 400 });
    }

    const existing = await prisma.blog.findFirst({
      where: { id, profileId: profile!.id },
      select: { id: true, slug: true, title: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Blog not found or unauthorized" },
        { status: 403 },
      );
    }

    const body = (await request.json()) as {
      title?: string;
      content?: string;
      isPublished?: boolean;
    };

    // Validate: don't save if both title and content are trivially empty
    // (Allow isPublished-only saves to pass through)
    const isContentOnlySave = body.isPublished === undefined;
    if (isContentOnlySave) {
      const titleEmpty = body.title !== undefined && body.title.trim() === "";
      const EMPTY_TIPTAP = ['{"type":"doc","content":[{"type":"paragraph"}]}', '{"type":"doc","content":[]}'];
      const contentEmpty =
        body.content !== undefined &&
        (body.content.trim() === "" || EMPTY_TIPTAP.includes(body.content.trim()));
      const bothEmpty =
        (body.title === undefined || titleEmpty) &&
        (body.content === undefined || contentEmpty);
      if (bothEmpty) {
        return NextResponse.json({ error: "Cannot save a blank article." }, { status: 400 });
      }
    }

    const title = body.title !== undefined ? body.title : existing.title;
    const slug = existing.slug || generateSlug(title);
    const blogLink = getPortfolioBlogPath(slug);
    const description =
      body.content !== undefined ? extractPlainText(body.content) : undefined;

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.isPublished !== undefined && { isPublished: body.isPublished }),
        ...(description !== undefined && { description }),
        slug,
        blogLink,
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

    return NextResponse.json({ blog: updatedBlog });
  } catch (error) {
    return handleApiError(error, "blogs/patch");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { errorResponse, profile } = await verifySessionAndProfile();
  if (errorResponse) return errorResponse;

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing blog id" },
        { status: 400 },
      );
    }

    const blog = await prisma.blog.findFirst({
      where: {
        id,
        profileId: profile!.id,
      },
      select: {
        content: true,
      },
    });

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found or unauthorized" },
        { status: 403 },
      );
    }

    await prisma.blog.delete({
      where: {
        id,
      },
    });

    const publicIds = extractBlogImagePublicIds(blog?.content);
    await Promise.all(publicIds.map((publicId) => deleteFromCloudinary(publicId)));

    revalidateProfile(profile.username);

    return NextResponse.json(
      { message: "Blog deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error, "blogs/delete");
  }
}
