import { codeToHtml } from "shiki";

/**
 * Post-processes rendered article HTML (from tiptap's `generateHTML`) and
 * server-side syntax-highlights every `<pre><code>…</code></pre>` block with
 * Shiki. Code inside the block is entity-decoded before highlighting; the
 * original classes are discarded in favour of Shiki's output.
 *
 * Blocks that are already highlighted (`<pre class="shiki …">`, produced by
 * the markdown pipeline) are left untouched.
 */

const CODE_BLOCK_RE =
  /<pre><code(?:\s+class="language-([A-Za-z0-9_+.#-]+)")?>([\s\S]*?)<\/code><\/pre>/g;

const ENTITY_MAP: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  "#39": "'",
};

function decodeEntities(value: string): string {
  // Single pass so entities like "&amp;lt;" decode to "&lt;" and are not
  // double-decoded to "<".
  return value.replace(
    /&(amp|lt|gt|quot|#39);/g,
    (match, entity: string) => ENTITY_MAP[entity] ?? match,
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function highlightOne(code: string, lang?: string): Promise<string> {
  const language = (lang ?? "").trim() || "text";

  try {
    return await codeToHtml(code, { lang: language, theme: "github-dark" });
  } catch {
    try {
      // Unknown / unsupported language — fall back to plain text.
      return await codeToHtml(code, { lang: "text", theme: "github-dark" });
    } catch {
      return `<pre><code>${escapeHtml(code)}</code></pre>`;
    }
  }
}

export async function highlightCodeBlocks(html: string): Promise<string> {
  if (!html || !html.includes("<pre><code")) return html;

  const matches = Array.from(html.matchAll(CODE_BLOCK_RE));
  if (matches.length === 0) return html;

  const highlighted = await Promise.all(
    matches.map(([, lang, code]) =>
      highlightOne(decodeEntities(code).replace(/\n+$/, ""), lang),
    ),
  );

  let index = 0;
  return html.replace(CODE_BLOCK_RE, () => highlighted[index++]);
}
