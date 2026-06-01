import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type BlogInput = {
  id?: string;
  title?: string;
  description?: string;
  blogLink?: string;
  enddate?: string;
};

function parseOptionalDate(value: string | null | undefined) {
  if (!value?.trim()) {
    return null;
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
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

    const blogData = {
      profileId,
      title: blog.title?.trim() || null,
      description: blog.description?.trim() || null,
      blogLink: blog.blogLink?.trim() || null,
      enddate: parseOptionalDate(blog.enddate),
    };

    if (blog.id) {
      const updatedBlog = await prisma.blog.update({
        where: {
          id: blog.id,
        },
        data: blogData,
      });

      return NextResponse.json(
        { data: updatedBlog, message: "Blog updated successfully." },
        { status: 200 },
      );
    }

    const existingBlog = blog.blogLink
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
