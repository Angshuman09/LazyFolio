import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

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