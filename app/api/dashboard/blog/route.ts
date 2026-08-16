import { prisma } from "@/lib/prisma";
import { deleteFromCloudinary } from "@/lib/utils/cloudinary";
import { extractBlogImagePublicIds } from "@/lib/utils/blog-images";
import { NextRequest, NextResponse } from "next/server";
import { verifySessionAndProfile } from "@/lib/auth/auth-api";
import { revalidateProfile } from "@/lib/cache/revalidate";
import { BlogInput } from "@/lib/constants/apis";
import { generateSlug } from "@/lib/utils/blogs";
import {
  validateExternalBlog,
  validateInternalBlog,
} from "@/lib/utils/validate-dashboard";


export async function POST(request: NextRequest) {
  const { errorResponse, profile } = await verifySessionAndProfile();
  if (errorResponse) return errorResponse;

  try {
    const { blog } = (await request.json()) as {
      blog?: BlogInput;
    };

    if (!blog) {
      return NextResponse.json(
        { error: "Missing blog in request body." },
        { status: 400 },
      );
    }

    const profileId = profile!.id;
    const blogType =
      blog.type ??
      (blog.content !== undefined && blog.content !== null
        ? "INTERNAL"
        : "EXTERNAL");
    const validation =
      blogType === "INTERNAL"
        ? validateInternalBlog(blog)
        : validateExternalBlog(blog);

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    let existing: Awaited<ReturnType<typeof prisma.blog.findFirst>> = null;
    if (blog.id) {
      existing = await prisma.blog.findFirst({
        where: { id: blog.id, profileId },
      });
      if (!existing) {
        return NextResponse.json(
          { error: "Blog not found or unauthorized." },
          { status: 403 },
        );
      }
    }

    let slug = blog.slug;
    let blogLink = blog.blogLink?.trim() || null;
    const isInternal = blogType === "INTERNAL";

    if (isInternal) {
      if (blog.id) {
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
      type: blogType,
      title: blog.title?.trim() || "Untitled",
      description: blog.description?.trim() || null,
      blogLink: blogLink,
      content: isInternal ? (blog.content ?? "") : null,
      isPublished: isInternal ? (blog.isPublished ?? false) : true,
      ...(typeof blog.isEnabled === "boolean"
        ? { isEnabled: blog.isEnabled }
        : typeof blog.isenable === "boolean"
          ? { isEnabled: blog.isenable }
          : {}),
      slug: slug || null,
    };

    if (blog.id) {

      const updatedBlog = await prisma.blog.update({
        where: {
          id: blog.id,
        },
        data: blogData,
      });

      const previousIds = extractBlogImagePublicIds(existing?.content);
      const nextIds = extractBlogImagePublicIds(updatedBlog.content);
      const removedIds = previousIds.filter((id) => !nextIds.includes(id));
      await Promise.all(removedIds.map((id) => deleteFromCloudinary(id)));

      revalidateProfile(profile.username);

      return NextResponse.json(
        { data: updatedBlog, message: "Blog updated successfully." },
        { status: 200 },
      );
    }

    const existingBlog = (!isInternal && blog.blogLink)
      ? await prisma.blog.findFirst({
          where: {
            blogLink: blog.blogLink,
            profileId,
            type: "EXTERNAL",
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

      revalidateProfile(profile.username);

      return NextResponse.json(
        { data: updatedBlog, message: "Blog updated successfully." },
        { status: 200 },
      );
    }

    const createdBlog = await prisma.blog.create({
      data: blogData,
    });

    revalidateProfile(profile.username);

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
