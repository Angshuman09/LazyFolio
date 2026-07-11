import { prisma } from "@/lib/prisma";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { extractBlogImagePublicIds } from "@/lib/utils/blog-images";
import { NextResponse, NextRequest } from "next/server";
import { verifySessionAndProfile } from "@/lib/auth-api";
import crypto from "crypto";

type BlogInput = {
  id?: string;
  title?: string;
  description?: string;
  blogLink?: string;
  enddate?: string;
  content?: string | null;
  isPublished?: boolean;
  isenable?: boolean;
  slug?: string | null;
};

function parseOptionalDate(value: string | null | undefined) {
  if (!value?.trim()) {
    return null;
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

function generateSlug(title: string) {
  const baseSlug = slugify(title || "untitled");
  const randomHash = crypto.randomBytes(4).toString("hex");
  return `${baseSlug}-${randomHash}`;
}

export async function POST(req: NextRequest) {
  const { errorResponse, profile } = await verifySessionAndProfile();
  if (errorResponse) return errorResponse;

  try {
    const { blogs } = (await req.json()) as {
      blogs?: BlogInput[];
    };

    if (!blogs) {
      return NextResponse.json(
        { error: "Fields are missing in the blog form" },
        { status: 400 },
      );
    }

    const profileId = profile!.id;

    const existingBlogs = await prisma.blog.findMany({
      where: { profileId },
    });

    const incomingIds = blogs
      .map((b) => b.id)
      .filter(Boolean) as string[];

    const deletedBlogs = existingBlogs.filter((blog) => !incomingIds.includes(blog.id));
    const deletedImageIds = deletedBlogs.flatMap((blog) =>
      extractBlogImagePublicIds(blog.content),
    );

    // 1. Delete blogs that are not in the incoming list
    await prisma.blog.deleteMany({
      where: {
        profileId,
        NOT: {
          id: { in: incomingIds },
        },
      },
    });

    await Promise.all(deletedImageIds.map((id) => deleteFromCloudinary(id)));

    // 2. Perform updates and creations
    const operations = blogs.map(async (blog) => {
      let slug = blog.slug;
      let blogLink = blog.blogLink?.trim() || null;
      const isInternal = blog.content !== undefined && blog.content !== null;

      let existing: any = null;
      if (blog.id) {
        existing = existingBlogs.find((b) => b.id === blog.id);
        if (!existing) {
          throw new Error("Unauthorized access to blog record: " + blog.id);
        }
      }

      if (isInternal) {
        if (blog.id) {
          slug = existing?.slug || slug || generateSlug(blog.title || "untitled");
        } else {
          slug = slug || generateSlug(blog.title || "untitled");
        }

        if (profile?.username && slug) {
          blogLink = `/${profile.username}/blogs/${slug}`;
        }
      }

      const data = {
        profile: {
          connect: {
            id: profileId,
          },
        },
        title: blog.title?.trim() || null,
        description: blog.description?.trim() || null,
        blogLink,
        enddate: parseOptionalDate(blog.enddate),
        content: blog.content ?? null,
        isPublished: blog.isPublished ?? false,
        isenable: blog.isenable ?? true,
        slug: slug || null,
      };

      if (blog.id) {
        const updatedBlog = await prisma.blog.update({
          where: { id: blog.id },
          data,
        });
        const existing = existingBlogs.find((b) => b.id === blog.id);
        const previousIds = extractBlogImagePublicIds(existing?.content);
        const nextIds = extractBlogImagePublicIds(updatedBlog.content);
        const removedIds = previousIds.filter((id) => !nextIds.includes(id));
        await Promise.all(removedIds.map((id) => deleteFromCloudinary(id)));
        return updatedBlog;
      } else {
        return prisma.blog.create({
          data,
        });
      }
    });

    const results = await Promise.all(operations);

    return NextResponse.json({ data: results }, { status: 200 });
  } catch (error) {
    console.error("Error in create blogs api: ", error);
    return NextResponse.json(
      { error: "Error in create blogs api" },
      { status: 500 },
    );
  }
}
