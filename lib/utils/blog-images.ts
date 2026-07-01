export type BlogImage = {
  alt: string;
  url: string;
  publicId: string;
  markdown: string;
};

const cloudinaryImagePattern =
  /!\[([^\]]*)\]\(([^)]+)\)\s*<!--\s*cloudinary-public-id:([^>]+?)\s*-->/g;

export function createCloudinaryImageMarkdown(
  alt: string,
  url: string,
  publicId: string,
) {
  return `\n![${alt}](${url})\n<!-- cloudinary-public-id:${publicId} -->\n`;
}

export function extractBlogImages(content: string | null | undefined) {
  if (!content) return [];

  return Array.from(content.matchAll(cloudinaryImagePattern), (match) => ({
    alt: match[1],
    url: match[2],
    publicId: match[3].trim(),
    markdown: match[0],
  }));
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
