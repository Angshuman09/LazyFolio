export function parseMarkdown(md: string): string {
  if (!md) return "";

  let html = md;
  
  html = html.replace(/```(\w+)?\n?([\s\S]*?)```/g, (_, _lang, code) => {
    const escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .trim();
    return `<pre class='bg-(--lf-surface) border border-(--lf-border) rounded-xl p-5 my-6 font-mono text-sm overflow-x-auto text-(--lf-ink) shadow-inner'><code class='block whitespace-pre'>${escaped}</code></pre>`;
  });

  const parts = html.split(/(<pre[\s\S]*?<\/pre>)/g);
  html = parts.map((part, i) => {
    if (i % 2 === 1) return part; // odd indexes are the <pre> blocks, skip
    return part
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
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
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, "<div class='my-6'><img src='$2' alt='$1' class='rounded-xl max-h-[450px] w-auto mx-auto object-cover border border-(--lf-border) shadow-sm' /><span class='block text-center text-xs text-(--lf-muted) mt-2 italic'>$1</span></div>");

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