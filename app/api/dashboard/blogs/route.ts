import { prisma } from "@/lib/prisma";
import { deleteFromCloudinary } from "@/lib/utils/cloudinary";
import { extractBlogImagePublicIds } from "@/lib/utils/blog-images";
import { NextResponse, NextRequest } from "next/server";
import { verifySessionAndProfile } from "@/lib/auth/auth-api";
import { revalidateProfile } from "@/lib/cache/revalidate";
import { BlogInput } from "@/lib/constants/apis";
import { generateSlug } from "@/lib/utils/blogs";
import { getPortfolioBlogPath } from "@/lib/utils/public-url";
import { handleApiError, ApiError } from "@/lib/errors/api";
import type { Blog } from "@/db/client";
import type { BlogType } from "@/db/enums";
import {
  isBlankExternalBlog,
  isBlankInternalBlog,
  validateExternalBlog,
  validateInternalBlog,
} from "@/lib/utils/validate-dashboard";

type BlogWriteData = {
  type: BlogType;
  title: string;
  description: string | null;
  blogLink: string | null;
  content: string | null;
  isPublished: boolean;
  isEnabled: boolean;
  slug: string | null;
};

function blogMatches(existing: Blog, next: BlogWriteData) {
  return (
    existing.type === next.type &&
    existing.title === next.title &&
    (existing.description ?? null) === next.description &&
    (existing.blogLink ?? null) === next.blogLink &&
    (existing.content ?? null) === next.content &&
    existing.isPublished === next.isPublished &&
    existing.isEnabled === next.isEnabled &&
    (existing.slug ?? null) === next.slug
  );
}

export async function POST(req: NextRequest) {
  const { errorResponse, profile } = await verifySessionAndProfile();
  if (errorResponse) return errorResponse;

  try {
    const { blogs, type = "EXTERNAL" } = (await req.json()) as {
      blogs?: BlogInput[];
      type?: "INTERNAL" | "EXTERNAL";
    };

    if (!blogs) {
      return NextResponse.json(
        { error: "Fields are missing in the blog form" },
        { status: 400 },
      );
    }

    const profileId = profile!.id;
    const isInternalSection = type === "INTERNAL";
    const nonBlankBlogs = blogs.filter((blog) =>
      isInternalSection
        ? !isBlankInternalBlog(blog)
        : !isBlankExternalBlog(blog),
    );

    for (const blog of nonBlankBlogs) {
      const validation = isInternalSection
        ? validateInternalBlog(blog)
        : validateExternalBlog(blog);

      if (!validation.ok) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
    }

    const existingBlogs = await prisma.blog.findMany({
      where: { profileId, type },
    });
    const existingById = new Map(existingBlogs.map((blog) => [blog.id, blog]));

    // Validate ownership before deleting anything, otherwise a stale id could
    // wipe the collection and then fail while saving.
    const incomingIds = new Set<string>();
    for (const blog of nonBlankBlogs) {
      const id = blog.id?.trim();
      if (!id) continue;

      if (!existingById.has(id)) {
        throw new ApiError(
          "One or more blogs no longer exist or do not belong to this profile.",
          403,
        );
      }

      incomingIds.add(id);
    }

    const deletedBlogs = existingBlogs.filter(
      (blog) => !incomingIds.has(blog.id),
    );
    const removedImageIds = deletedBlogs.flatMap((blog) =>
      extractBlogImagePublicIds(blog.content),
    );

    if (deletedBlogs.length) {
      await prisma.blog.deleteMany({
        where: {
          profileId,
          type,
          id: { in: deletedBlogs.map((blog) => blog.id) },
        },
      });
    }

    const operations = nonBlankBlogs.map(async (blog) => {
      const existing = blog.id ? existingById.get(blog.id.trim()) : undefined;
      let slug = blog.slug;
      let blogLink = blog.blogLink?.trim() || null;
      const blogType = blog.type ?? type;
      const isInternal = blogType === "INTERNAL";

      if (isInternal) {
        if (existing) {
          slug =
            existing.slug || slug || generateSlug(blog.title || "untitled");
        } else {
          slug = slug || generateSlug(blog.title || "untitled");
        }

        blogLink = getPortfolioBlogPath(slug);
      }

      const data: BlogWriteData = {
        type: blogType,
        title: blog.title?.trim() || "Untitled",
        description: blog.description?.trim() || null,
        blogLink,
        content: isInternal ? (blog.content ?? "") : null,
        isPublished: isInternal ? (blog.isPublished ?? false) : true,
        isEnabled: blog.isEnabled ?? blog.isenable ?? true,
        slug: slug || null,
      };

      if (existing) {
        if (blogMatches(existing, data)) {
          return existing;
        }

        const updatedBlog = await prisma.blog.update({
          where: { id: existing.id },
          data: {
            ...data,
            profile: { connect: { id: profileId } },
          },
        });
        const previousIds = extractBlogImagePublicIds(existing.content);
        const nextIds = extractBlogImagePublicIds(updatedBlog.content);
        removedImageIds.push(
          ...previousIds.filter((id) => !nextIds.includes(id)),
        );
        return updatedBlog;
      }

      return prisma.blog.create({
        data: {
          ...data,
          profile: { connect: { id: profileId } },
        },
      });
    });

    const results = await Promise.all(operations);

    await Promise.all(removedImageIds.map((id) => deleteFromCloudinary(id)));

    revalidateProfile(profile.username);

    return NextResponse.json({ data: results }, { status: 200 });
  } catch (error) {
    return handleApiError(error, "blogs/save");
  }
}
