import { prisma } from "@/lib/prisma";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { extractBlogImagePublicIds } from "@/lib/utils/blog-images";
import { NextRequest, NextResponse } from "next/server";

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
  const randomHash = Math.random().toString(36).substring(2, 7);
  return `${baseSlug}-${randomHash}`;
}

export async function POST(request: NextRequest) {
  try {
    const { blog, profileId } = (await request.json()) as {
      blog?: BlogInput;
      profileId?: string;
    };

    if (!blog || !profileId) {
      return NextResponse.json(
        { error: "Missing blog or profileId in request body." },
        { status: 400 },
      );
    }

    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      select: { username: true },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found." },
        { status: 404 },
      );
    }

    let slug = blog.slug;
    let blogLink = blog.blogLink?.trim() || null;
    const isInternal = blog.content !== undefined && blog.content !== null;

    if (isInternal) {
      if (blog.id) {
        const existing = await prisma.blog.findUnique({
          where: { id: blog.id },
        });
        slug = existing?.slug || slug || generateSlug(blog.title || "untitled");
      } else {
        slug = slug || generateSlug(blog.title || "untitled");
      }

      if (profile.username && slug) {
        blogLink = `/${profile.username}/blogs/${slug}`;
      }
    }

    const blogData = {
      profile: {
        connect: {
          id: profileId,
        },
      },
      title: blog.title?.trim() || null,
      description: blog.description?.trim() || null,
      blogLink: blogLink,
      enddate: parseOptionalDate(blog.enddate),
      content: blog.content ?? null,
      isPublished: blog.isPublished ?? false,
      ...(typeof blog.isenable === "boolean" ? { isenable: blog.isenable } : {}),
      slug: slug || null,
    };

    if (blog.id) {
      const existingBlog = await prisma.blog.findUnique({
        where: {
          id: blog.id,
        },
        select: {
          content: true,
        },
      });

      const updatedBlog = await prisma.blog.update({
        where: {
          id: blog.id,
        },
        data: blogData,
      });

      const previousIds = extractBlogImagePublicIds(existingBlog?.content);
      const nextIds = extractBlogImagePublicIds(updatedBlog.content);
      const removedIds = previousIds.filter((id) => !nextIds.includes(id));
      await Promise.all(removedIds.map((id) => deleteFromCloudinary(id)));

      return NextResponse.json(
        { data: updatedBlog, message: "Blog updated successfully." },
        { status: 200 },
      );
    }

    // Check if there is an existing blog with the same link (only for external links)
    const existingBlog = (!isInternal && blog.blogLink)
      ? await prisma.blog.findFirst({
          where: {
            blogLink: blog.blogLink,
            profileId,
          },
        })
      : null;

    if (existingBlog) {
      const updatedBlog = await prisma.blog.update({
        where: {
          id: existingBlog.id,
        },
        data: blogData,
      });

      return NextResponse.json(
        { data: updatedBlog, message: "Blog updated successfully." },
        { status: 200 },
      );
    }

    const createdBlog = await prisma.blog.create({
      data: blogData,
    });

    return NextResponse.json(
      { data: createdBlog, message: "Blog created successfully." },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error saving blog:", error);
    return NextResponse.json(
      { error: "An error occurred while saving the blog." },
      { status: 500 },
    );
  }
}
