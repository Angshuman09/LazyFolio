import { prisma } from "@/lib/prisma";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { extractBlogImagePublicIds } from "@/lib/utils/blog-images";
import { NextRequest, NextResponse } from "next/server";
import { verifySessionAndProfile } from "@/lib/auth-api";

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

    return NextResponse.json(
      { message: "Blog deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 },
    );
  }
}
