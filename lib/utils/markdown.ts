import { codeToHtml } from "shiki";
import { isValidImageSrc, stripCloudinaryImageMarkers } from "./blog-images";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttribute(value: string) {
  return value
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function highlightCode(code: string, lang?: string) {
  const language = lang?.trim() || "text";

  try {
    return await codeToHtml(code.trim(), {
      lang: language,
      theme: "github-dark",
    });
  } catch {
    return await codeToHtml(code.trim(), {
      lang: "text",
      theme: "github-dark",
    });
  }
}

export async function parseMarkdown(md: string): Promise<string> {
  if (!md) return "";

  let html = stripCloudinaryImageMarkers(md);
  
  const codeBlocks = Array.from(html.matchAll(/```([\w-]+)?\n?([\s\S]*?)```/g));
  const highlightedBlocks = await Promise.all(
    codeBlocks.map(async ([, lang, code]) => {
      const highlighted = await highlightCode(code, lang);
      return `<div class='shiki-code-block my-6'>${highlighted}</div>`;
    }),
  );

  codeBlocks.forEach((match, index) => {
    html = html.replace(match[0], highlightedBlocks[index]);
  });

  const parts = html.split(/(<div class='shiki-code-block[\s\S]*?<\/div>)/g);
  html = parts.map((part, i) => {
    if (i % 2 === 1) return part;
    return escapeHtml(part);
  }).join("");

  // Headings
  html = html.replace(/^### (.*?)$/gm, "<h3 class='text-lg font-bold font-serif-display mt-6 mb-2 text-(--lf-ink)'>$1</h3>");
  html = html.replace(/^## (.*?)$/gm, "<h2 class='text-xl font-bold font-serif-display mt-8 mb-3 text-(--lf-ink) border-b border-(--lf-border) pb-1'>$1</h2>");
  html = html.replace(/^# (.*?)$/gm, "<h1 class='text-2xl font-bold font-serif-display mt-10 mb-4 text-(--lf-ink)'>$1</h1>");

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold text-(--lf-ink)'>$1</strong>");
  html = html.replace(/__(.*?)__/g, "<strong class='font-bold text-(--lf-ink)'>$1</strong>");

  // Italic
  html = html.replace(/\*(.*?)\*/g, "<em class='italic'>$1</em>");
  html = html.replace(/_(.*?)_/g, "<em class='italic'>$1</em>");

  // Images: ![alt](url)
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, (_, alt, url) => {
    if (!isValidImageSrc(url)) {
      return `<div class='my-6 rounded-xl border border-[#b91c1c]/20 bg-[#b91c1c]/5 px-4 py-3 text-sm text-[#b91c1c] dark:text-[#f87171]'>Invalid image URL: ${url || "empty"}</div>`;
    }

    return `<div class='my-6'><img src='${escapeAttribute(url)}' alt='${escapeAttribute(alt)}' class='rounded-xl max-h-[450px] w-auto mx-auto object-cover border border-(--lf-border) shadow-sm' /><span class='block text-center text-xs text-(--lf-muted) mt-2 italic'>${alt}</span></div>`;
  });

  // Links: [text](url)
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2' target='_blank' rel='noopener noreferrer' class='underline text-indigo-600 dark:text-indigo-400 hover:opacity-80'>$1</a>");

  // Inline code AFTER code blocks
  html = html.replace(/`([^`]+)`/g, "<code class='bg-(--lf-border-alpha) rounded px-1.5 py-0.5 text-sm font-mono text-(--lf-ink)'>$1</code>");

  // Blockquotes
  html = html.replace(/^&gt; (.*?)$/gm, "<blockquote class='border-l-4 border-(--lf-dimmed) pl-4 italic my-4 text-(--lf-muted) bg-(--lf-surface)/40 py-1 pr-2 rounded-r'>$1</blockquote>");

  // Bullet Lists
  html = html.replace(/^\s*-\s+(.*?)$/gm, "<li class='list-disc list-inside ml-4 my-1 text-(--lf-ink) opacity-90'>$1</li>");
  // Numbered Lists
  html = html.replace(/^\s*\d+\.\s+(.*?)$/gm, "<li class='list-decimal list-inside ml-4 my-1 text-(--lf-ink) opacity-90'>$1</li>");

  // Paragraphs
  const paragraphs = html.split(/\n\n+/);
  html = paragraphs
    .map((p) => {
      p = p.trim();
      if (!p) return "";
      if (
        p.startsWith("<h") ||
        p.startsWith("<li") ||
        p.startsWith("<div") ||
        p.startsWith("<pre") ||
        p.startsWith("<blockquote")
      ) {
        return p;
      }
      return `<p class="leading-relaxed mb-5 text-(--lf-ink) opacity-90 text-[0.95rem]">${p.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n");

  return html;
}
