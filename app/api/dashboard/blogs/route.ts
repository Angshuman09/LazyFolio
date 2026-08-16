import { prisma } from "@/lib/prisma";
import { deleteFromCloudinary } from "@/lib/utils/cloudinary";
import { extractBlogImagePublicIds } from "@/lib/utils/blog-images";
import { NextResponse, NextRequest } from "next/server";
import { verifySessionAndProfile } from "@/lib/auth/auth-api";
import { revalidateProfile } from "@/lib/cache/revalidate";
import { BlogInput } from "@/lib/constants/apis";
import { generateSlug } from "@/lib/utils/blogs";
import {
  isBlankExternalBlog,
  isBlankInternalBlog,
  validateExternalBlog,
  validateInternalBlog,
} from "@/lib/utils/validate-dashboard";

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
    const isInternal = type === "INTERNAL";
    const nonBlankBlogs = blogs.filter((blog) =>
      isInternal ? !isBlankInternalBlog(blog) : !isBlankExternalBlog(blog),
    );

    for (const blog of nonBlankBlogs) {
      const validation = isInternal
        ? validateInternalBlog(blog)
        : validateExternalBlog(blog);

      if (!validation.ok) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
    }

    const existingBlogs = await prisma.blog.findMany({
      where: { profileId, type },
    });

    const incomingIds = nonBlankBlogs
      .map((b) => b.id)
      .filter(Boolean) as string[];

    const deletedBlogs = existingBlogs.filter((blog) => !incomingIds.includes(blog.id));
    const deletedImageIds = deletedBlogs.flatMap((blog) =>
      extractBlogImagePublicIds(blog.content),
    );

    await prisma.blog.deleteMany({
      where: {
        profileId,
        type,
        NOT: {
          id: { in: incomingIds },
        },
      },
    });

    await Promise.all(deletedImageIds.map((id) => deleteFromCloudinary(id)));

    const operations = nonBlankBlogs.map(async (blog) => {
      let slug = blog.slug;
      let blogLink = blog.blogLink?.trim() || null;
      const blogType = blog.type ?? type;
      const isInternal = blogType === "INTERNAL";

      let existing: (typeof existingBlogs)[number] | null = null;
      if (blog.id) {
        existing = existingBlogs.find((b) => b.id === blog.id) ?? null;
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
        type: blogType,
        title: blog.title?.trim() || "Untitled",
        description: blog.description?.trim() || null,
        blogLink,
        content: isInternal ? (blog.content ?? "") : null,
        isPublished: isInternal ? (blog.isPublished ?? false) : true,
        isEnabled: blog.isEnabled ?? blog.isenable ?? true,
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

    revalidateProfile(profile.username);

    return NextResponse.json({ data: results }, { status: 200 });
  } catch (error) {
    console.error("Error in create blogs api: ", error);
    return NextResponse.json(
      { error: "Error in create blogs api" },
      { status: 500 },
    );
  }
}
