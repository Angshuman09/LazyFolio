import { getPublicIdFromCloudinaryUrl } from "@/lib/utils/cloudinary-url";

export type TiptapImageInfo = {
  src: string;
  alt: string;
  publicId: string;
};

/** Returns true if `content` is serialized Tiptap JSON (starts with `{`). */
export function isTiptapJson(content: string | null | undefined): boolean {
  if (!content) return false;
  return content.trimStart().startsWith("{");
}

type TiptapNode = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
};

function walkNodes(
  node: TiptapNode,
  visitor: (node: TiptapNode) => void,
): void {
  visitor(node);
  if (node.content) {
    for (const child of node.content) {
      walkNodes(child, visitor);
    }
  }
}

/** Extract all image nodes from a Tiptap JSON document. */
export function extractImagesFromTiptapJson(
  json: TiptapNode | string,
): TiptapImageInfo[] {
  const images: TiptapImageInfo[] = [];
  let root: TiptapNode;

  try {
    root = typeof json === "string" ? (JSON.parse(json) as TiptapNode) : json;
  } catch {
    return images;
  }

  walkNodes(root, (node) => {
    if (node.type === "image" && node.attrs?.src) {
      const src = node.attrs.src as string;
      const alt = (node.attrs.alt as string) || "";
      const pid = node.attrs["data-public-id"] as string | null | undefined;
      const publicId = pid || getPublicIdFromCloudinaryUrl(src) || "";
      if (publicId) {
        images.push({ src, alt, publicId });
      }
    }
  });

  return images;
}

/** Extract Cloudinary public IDs from Tiptap JSON content string. */
export function extractPublicIdsFromTiptapJson(
  content: string | null | undefined,
): string[] {
  if (!content) return [];
  const images = extractImagesFromTiptapJson(content);
  return Array.from(new Set(images.map((img) => img.publicId)));
}

function extractTextFromTiptapNode(node: TiptapNode): string {
  let text = "";
  if (node.text) text += node.text;
  if (node.content) {
    for (const child of node.content) {
      text += extractTextFromTiptapNode(child);
      // Add space between block-level siblings to prevent words merging
      if (
        child.type === "paragraph" ||
        child.type === "heading" ||
        child.type === "listItem"
      ) {
        text += " ";
      }
    }
  }
  return text;
}

/** Plain text extraction for descriptions/summaries up to maxLength characters. */
export function extractPlainText(
  content: string | null | undefined,
  maxLength = 160,
): string {
  if (!content) return "";

  if (isTiptapJson(content)) {
    try {
      const json = JSON.parse(content) as TiptapNode;
      const text = extractTextFromTiptapNode(json);
      return text.replace(/\s+/g, " ").trim().slice(0, maxLength);
    } catch {
      return "";
    }
  }

  return content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[[^\]]*\]\([^)]*\)/g, "$1")
    .replace(/[#*_~`>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

/** Word count that handles both Tiptap JSON and legacy Markdown content. */
export function getWordCount(content: string | null | undefined): number {
  if (!content) return 0;

  if (isTiptapJson(content)) {
    try {
      const json = JSON.parse(content) as TiptapNode;
      const text = extractTextFromTiptapNode(json);
      return text.split(/\s+/).filter(Boolean).length;
    } catch {
      return 0;
    }
  }

  // Legacy markdown — strip markdown syntax then count
  return content
    .replace(/```[\s\S]*?```/g, "") // code blocks
    .replace(/`[^`]+`/g, "") // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images
    .replace(/\[[^\]]*\]\([^)]*\)/g, "$1") // links (keep text)
    .replace(/[#*_~`>]/g, "") // markdown symbols
    .split(/\s+/)
    .filter(Boolean).length;
}
