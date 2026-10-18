// Leaf module for Cloudinary URL parsing. Kept separate from blog-images.ts
// and tiptap-content.ts so both can import it without a circular dependency.
export function getPublicIdFromCloudinaryUrl(url: string): string | null {
  if (!url || !url.includes("res.cloudinary.com")) return null;
  const cleanUrl = url.split("?")[0].split("#")[0];
  const parts = cleanUrl.split("/image/upload/");
  if (parts.length > 1) {
    const pathAfterUpload = parts[1];
    const pathParts = pathAfterUpload.split("/");
    if (pathParts[0] && pathParts[0].match(/^v\d+$/)) {
      pathParts.shift();
    }
    const joined = pathParts.join("/");
    const lastDotIndex = joined.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      return joined.substring(0, lastDotIndex);
    }
    return joined;
  }
  return null;
}
