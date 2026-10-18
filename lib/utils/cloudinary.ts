import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { prisma } from "@/lib/prisma";
import { extractBlogImagePublicIds } from "@/lib/utils/blog-images";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export { cloudinary };
export type { UploadApiResponse };

export async function deleteFromCloudinary(publicId: string) {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
}

// A publicId is considered owned by a user when it is referenced by their
// profile avatar/banner or embedded in one of their blog posts. This guards
// destructive operations (e.g. asset deletion) so one account cannot remove
// another account's media.
export async function userOwnsCloudinaryAsset(
  userId: string,
  publicId: string,
): Promise<boolean> {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: {
      avatarPublicId: true,
      bannerPublicId: true,
      blogs: { select: { content: true } },
    },
  });

  if (!profile) return false;

  if (publicId === profile.avatarPublicId || publicId === profile.bannerPublicId) {
    return true;
  }

  return profile.blogs.some((blog) =>
    extractBlogImagePublicIds(blog.content).includes(publicId),
  );
}