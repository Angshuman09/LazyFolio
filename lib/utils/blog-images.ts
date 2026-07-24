export type BlogImage = {
  alt: string;
  url: string;
  publicId: string;
  markdown: string;
};

export function getPublicIdFromUrl(url: string): string | null {
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

export function createCloudinaryImageMarkdown(
  alt: string,
  url: string,
  publicId?: string,
) {
  void publicId;
  return `\n![${alt}](${url})\n`;
}

export function extractBlogImages(content: string | null | undefined): BlogImage[] {
  if (!content) return [];

  const images: BlogImage[] = [];
  const oldPattern = /!\[([^\]]*)\]\(([^)]+)\)\s*<!--\s*cloudinary-public-id:([^>]+?)\s*-->/g;
  const processedIndices = new Set<number>();

  for (const match of content.matchAll(oldPattern)) {
    const alt = match[1];
    const url = match[2];
    const publicId = match[3].trim();
    const startIndex = match.index;
    if (startIndex !== undefined) {
      processedIndices.add(startIndex);
      images.push({
        alt,
        url,
        publicId,
        markdown: match[0],
      });
    }
  }

  const generalPattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
  for (const match of content.matchAll(generalPattern)) {
    const startIndex = match.index;
    if (startIndex !== undefined && !processedIndices.has(startIndex)) {
      const alt = match[1];
      const url = match[2];
      const publicId = getPublicIdFromUrl(url);
      if (publicId) {
        images.push({
          alt,
          url,
          publicId,
          markdown: match[0],
        });
      }
    }
  }

  return images;
}

export function extractBlogImagePublicIds(content: string | null | undefined) {
  return Array.from(
    new Set(extractBlogImages(content).map((image) => image.publicId)),
  );
}

export function removeBlogImage(content: string, image: BlogImage) {
  return content.replace(image.markdown, "").replace(/\n{3,}/g, "\n\n");
}

export function stripCloudinaryImageMarkers(content: string) {
  return content.replace(/<!--\s*cloudinary-public-id:[^>]+?\s*-->/g, "");
}

export function isValidImageSrc(src: string | null | undefined) {
  if (!src) return false;

  if (src.startsWith("/")) {
    return true;
  }

  try {
    const url = new URL(src);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
