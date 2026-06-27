import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

type BlogInput = {
  id?: string;
  title?: string;
  description?: string;
  blogLink?: string;
  enddate?: string;
  content?: string | null;
  isPublished?: boolean;
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
  const randomHash = Math.random().toString(36).substring(2, 7);
  return `${baseSlug}-${randomHash}`;
}

export async function POST(req: NextRequest) {
  try {
    const { profileId, blogs } = (await req.json()) as {
      profileId?: string;
      blogs?: BlogInput[];
    };

    if (!profileId || !blogs) {
      return NextResponse.json(
        { error: "Fields are missing in the blog form" },
        { status: 400 },
      );
    }

    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      select: { username: true },
    });

    const existingBlogs = await prisma.blog.findMany({
      where: { profileId },
    });

    const incomingIds = blogs
      .map((b) => b.id)
      .filter(Boolean) as string[];

    // 1. Delete blogs that are not in the incoming list
    await prisma.blog.deleteMany({
      where: {
        profileId,
        NOT: {
          id: { in: incomingIds },
        },
      },
    });

    // 2. Perform updates and creations
    const operations = blogs.map(async (blog) => {
      let slug = blog.slug;
      let blogLink = blog.blogLink?.trim() || null;
      const isInternal = blog.content !== undefined && blog.content !== null;

      if (isInternal) {
        if (blog.id) {
          const existing = existingBlogs.find((b) => b.id === blog.id);
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
        slug: slug || null,
      };

      if (blog.id) {
        return prisma.blog.update({
          where: { id: blog.id },
          data,
        });
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
