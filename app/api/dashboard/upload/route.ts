import { NextRequest } from "next/server";
import { Readable } from "stream";
import {
  cloudinary,
  deleteFromCloudinary,
  userOwnsCloudinaryAsset,
  type UploadApiResponse,
} from "@/lib/utils/cloudinary";
import { verifySession } from "@/lib/auth/auth-api";
import { apiError, handleApiError } from "@/lib/errors/api";
import { prisma } from "@/lib/prisma";
import { isSubscriptionActive, syncSubscriptionWithDodo } from "@/lib/subscription";
import { getDodoConfig } from "@/lib/dodopayments";
import {
  ALLOWED_IMAGE_TYPES_SET,
  MAX_IMAGE_SIZE_BYTES,
} from "@/lib/constants/uploads";

export async function POST(req: NextRequest) {
  const { errorResponse, session } = await verifySession();
  if (errorResponse) return errorResponse;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return apiError("No file uploaded", 400);
    }

    // Image uploads are a supporter feature. Only profile images
    // (avatar/banner) are exempt so free users can still personalize
    // their account.
    if (formData.get("purpose") !== "profile") {
      let subscription = await prisma.subscription.findUnique({
        where: { userId: session!.user.id },
      });

      const { apiKey, environment } = getDodoConfig();
      if (
        apiKey &&
        environment === "test_mode" &&
        isSubscriptionActive(subscription)
      ) {
        const synced = await syncSubscriptionWithDodo(
          session!.user.id,
          session!.user.email,
        );
        if (synced) subscription = synced;
      }

      if (!isSubscriptionActive(subscription)) {
        return apiError(
          "Image uploads are for supporters. Upgrade to upload images to your articles.",
          403,
        );
      }
    }

    if (!ALLOWED_IMAGE_TYPES_SET.has(file.type)) {
      return apiError("Only JPEG, PNG, GIF, or WebP images are allowed", 400);
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return apiError("Image must be 10MB or smaller", 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const apiKey =
      process.env.CLOUDINARY_API_KEY ||
      process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret =
      process.env.CLOUDINARY_API_SECRET ||
      process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

    const isMockCloudinary =
      process.env.NODE_ENV !== "production" &&
      (!apiKey ||
        apiKey === "mock" ||
        apiKey.startsWith("your-") ||
        !apiSecret ||
        apiSecret.startsWith("your-"));

    if (isMockCloudinary) {
      const fs = await import("fs/promises");
      const path = await import("path");
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });

      const MIME_TO_EXT: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/gif": "gif",
        "image/webp": "webp",
      };
      const ext = MIME_TO_EXT[file.type] || "png";
      const publicId = `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const fileName = `${publicId}.${ext}`;
      const filePath = path.join(uploadsDir, fileName);

      await fs.writeFile(filePath, buffer);
      return Response.json({
        url: `/uploads/${fileName}`,
        publicId,
      });
    }

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "lazyfolio",
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );
      Readable.from(buffer).pipe(uploadStream);
    });

    return Response.json({ url: result.url, publicId: result.public_id });
  } catch (error) {
    return handleApiError(error, "upload/create");
  }
}

export async function DELETE(req: NextRequest) {
  const { errorResponse, session } = await verifySession();
  if (errorResponse) return errorResponse;

  try {
    const { publicId } = (await req.json()) as { publicId?: string };

    if (!publicId) {
      return apiError("Missing publicId", 400);
    }

    // Only allow deleting assets the authenticated user actually references
    // (profile avatar/banner or images embedded in their own posts).
    const isOwner = await userOwnsCloudinaryAsset(session!.user.id, publicId);
    if (!isOwner) {
      return apiError("Not authorized to delete this image", 403);
    }

    if (publicId.startsWith("local_") || publicId.startsWith("mock_")) {
      const fs = await import("fs/promises");
      const path = await import("path");
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      const files = await fs.readdir(uploadsDir).catch(() => []);
      const matched = files.find((f) => f.startsWith(publicId));
      if (matched) {
        await fs.unlink(path.join(uploadsDir, matched)).catch(() => {});
      }
      return Response.json({ message: "Image deleted successfully" }, { status: 200 });
    }

    await deleteFromCloudinary(publicId);
    return Response.json({ message: "Image deleted successfully" }, { status: 200 });
  } catch (error) {
    return handleApiError(error, "upload/delete");
  }
}
