import { prisma } from "@/lib/prisma";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { extractBlogImagePublicIds } from "@/lib/utils/blog-images";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing blog id" },
        { status: 400 },
      );
    }

    const blog = await prisma.blog.findUnique({
      where: {
        id,
      },
      select: {
        content: true,
      },
    });

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
