import type { CSSProperties } from "react";

export type BlogThemeVars = CSSProperties &
  Partial<Record<`--lf-article-${string}`, string>>;

export type BlogTheme = {
  key: string;
  noise?: boolean;
  pageClass: string;
  pageStyle?: CSSProperties;
  navClass: string;
  backLinkClass: string;
  authorClass: string;
  authorNameClass: string;
  avatarWrapClass: string;
  avatarFallbackClass: string;
  containerClass: string;
  metaClass: string;
  titleClass: string;
  descriptionClass: string;
  dividerClass: string;
  articleClass: string;
  articleStyle: BlogThemeVars;
  emptyClass: string;
};

const BLOG_THEMES: Record<string, BlogTheme> = {
  // 01 · Minimal Light
  "1": {
    key: "minimal-light",
    pageClass: "min-h-screen bg-[#fbfbfb] text-stone-700 antialiased",
    navClass:
      "sticky top-0 z-40 w-full bg-[#fbfbfb]/80 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex items-center justify-between",
    backLinkClass:
      "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-400 hover:text-stone-900 transition-colors",
    authorClass: "flex items-center gap-2 hover:opacity-80 transition-opacity",
    authorNameClass: "text-xs font-medium text-stone-900",
    avatarWrapClass:
      "relative w-6 h-6 rounded-full overflow-hidden border border-stone-200",
    avatarFallbackClass:
      "w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center text-[10px] font-bold text-stone-600",
    containerClass: "max-w-2xl mx-auto px-6 py-14 sm:py-20",
    metaClass: "flex items-center gap-4 text-xs text-stone-400 font-mono mb-4",
    titleClass:
      "text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 leading-[1.15] mb-5",
    descriptionClass: "text-[1.05rem] text-stone-500 leading-relaxed mb-6 italic",
    dividerClass: "w-full h-px bg-stone-200 mt-8",
    articleClass: "",
    articleStyle: {
      "--lf-article-ink": "#292524",
      "--lf-article-muted": "#78716c",
      "--lf-article-heading-ink": "#1c1917",
      "--lf-article-accent": "#1c1917",
      "--lf-article-border": "#e7e5e4",
      "--lf-article-code-bg": "#f5f5f4",
    },
    emptyClass: "text-center text-stone-400 italic text-sm py-12",
  },

  // 02 · Minimal Dark
  "2": {
    key: "minimal-dark",
    pageClass: "min-h-screen bg-[#0e0e0e] text-zinc-300 antialiased",
    navClass:
      "sticky top-0 z-40 w-full bg-[#0e0e0e]/85 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex items-center justify-between",
    backLinkClass:
      "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-zinc-300 transition-colors",
    authorClass: "flex items-center gap-2 hover:opacity-80 transition-opacity",
    authorNameClass: "text-xs font-medium text-zinc-100",
    avatarWrapClass:
      "relative w-6 h-6 rounded-full overflow-hidden border border-zinc-700",
    avatarFallbackClass:
      "w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-300",
    containerClass: "max-w-2xl mx-auto px-6 py-14 sm:py-20",
    metaClass: "flex items-center gap-4 text-xs text-zinc-600 font-mono mb-4",
    titleClass:
      "text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-100 leading-[1.15] mb-5",
    descriptionClass: "text-[1.05rem] text-zinc-500 leading-relaxed mb-6 italic",
    dividerClass: "w-full h-px bg-zinc-800 mt-8",
    articleClass: "",
    articleStyle: {
      "--lf-article-ink": "#d4d4d8",
      "--lf-article-muted": "#a1a1aa",
      "--lf-article-heading-ink": "#fafafa",
      "--lf-article-accent": "#e4e4e7",
      "--lf-article-border": "#27272a",
      "--lf-article-code-bg": "#18181b",
    },
    emptyClass: "text-center text-zinc-600 italic text-sm py-12",
  },

  // 03 · Airy
  "3": {
    key: "airy",
    pageClass: "min-h-screen bg-white text-slate-700 antialiased",
    navClass:
      "sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between",
    backLinkClass:
      "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-colors",
    authorClass: "flex items-center gap-2 hover:opacity-80 transition-opacity",
    authorNameClass: "text-xs font-medium text-slate-900",
    avatarWrapClass:
      "relative w-6 h-6 rounded-full overflow-hidden border border-slate-200",
    avatarFallbackClass:
      "w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500",
    containerClass: "max-w-2xl mx-auto px-6 py-14 sm:py-20",
    metaClass: "flex items-center gap-4 text-xs text-slate-400 font-mono mb-4",
    titleClass:
      "text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-[1.15] mb-5",
    descriptionClass: "text-[1.05rem] text-slate-400 leading-relaxed mb-6 italic",
    dividerClass: "w-full h-px bg-slate-100 mt-8",
    articleClass: "",
    articleStyle: {
      "--lf-article-ink": "#334155",
      "--lf-article-muted": "#64748b",
      "--lf-article-heading-ink": "#0f172a",
      "--lf-article-accent": "#0f172a",
      "--lf-article-border": "#e2e8f0",
      "--lf-article-code-bg": "#f8fafc",
    },
    emptyClass: "text-center text-slate-400 italic text-sm py-12",
  },

  // 04 · Editorial
  "4": {
    key: "editorial",
    noise: true,
    pageClass: "min-h-screen text-[#25302b] antialiased",
    pageStyle: {
      background: "linear-gradient(180deg, #f7f2e8 0%, #f0f7f3 42%, #f9faf7 100%)",
      fontFamily: "'Lora', Georgia, serif",
    },
    navClass:
      "sticky top-0 z-40 w-full bg-[#f7f2e8]/80 backdrop-blur-md border-b border-[#d8cdbf] px-6 py-4 flex items-center justify-between",
    backLinkClass:
      "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#9b8d80] hover:text-[#7f1d1d] transition-colors",
    authorClass: "flex items-center gap-2 hover:opacity-80 transition-opacity",
    authorNameClass: "text-xs font-medium text-[#25302b]",
    avatarWrapClass:
      "relative w-6 h-6 rounded-full overflow-hidden border border-[#d8cdbf]",
    avatarFallbackClass:
      "w-6 h-6 rounded-full bg-[#e6ddcf] flex items-center justify-center text-[10px] font-bold text-[#6d5f54]",
    containerClass: "max-w-2xl mx-auto px-6 py-14 sm:py-20 relative z-10",
    metaClass: "flex items-center gap-4 text-xs text-[#9b8d80] mb-4",
    titleClass:
      "font-serif-display text-4xl sm:text-5xl font-normal tracking-tight text-[#1d2421] leading-[1.08] mb-5",
    descriptionClass: "text-[1.05rem] text-[#6d5f54] leading-relaxed mb-6 italic",
    dividerClass: "w-full h-px bg-[#d8cdbf] mt-8",
    articleClass: "",
    articleStyle: {
      "--lf-article-ink": "#52645b",
      "--lf-article-muted": "#6d5f54",
      "--lf-article-heading-ink": "#1d2421",
      "--lf-article-heading-font": "'Lora', Georgia, serif",
      "--lf-article-accent": "#7f1d1d",
      "--lf-article-border": "#d8cdbf",
      "--lf-article-code-bg": "#fffdf8",
    },
    emptyClass: "text-center text-[#9b8d80] italic text-sm py-12",
  },

  // 05 · Terminal
  "5": {
    key: "terminal",
    pageClass: "min-h-screen bg-[#07110d] text-[#d7ffe8] antialiased",
    pageStyle: {
      fontFamily:
        "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
    },
    navClass:
      "sticky top-0 z-40 w-full bg-[#07110d]/85 backdrop-blur-md border-b border-[#1f4d36] px-6 py-4 flex items-center justify-between",
    backLinkClass:
      "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4d7a63] hover:text-[#86efac] transition-colors",
    authorClass: "flex items-center gap-2 hover:opacity-80 transition-opacity",
    authorNameClass: "text-xs font-medium text-[#eafff2]",
    avatarWrapClass:
      "relative w-6 h-6 rounded-md overflow-hidden border border-[#2ddf7f]/40",
    avatarFallbackClass:
      "w-6 h-6 rounded-md bg-[#0a1a13] flex items-center justify-center text-[10px] font-bold text-[#86efac]",
    containerClass: "max-w-2xl mx-auto px-6 py-12 sm:py-16",
    metaClass: "flex items-center gap-4 text-xs text-[#4d7a63] mb-4",
    titleClass:
      "text-[30px] sm:text-[42px] font-semibold tracking-tight text-[#eafff2] leading-[1.15] mb-5",
    descriptionClass: "text-[1.05rem] text-[#86efac] leading-relaxed mb-6 italic",
    dividerClass: "w-full h-px bg-[#1f4d36] mt-8",
    articleClass: "",
    articleStyle: {
      "--lf-article-ink": "#b9f5d0",
      "--lf-article-muted": "#6f9b84",
      "--lf-article-heading-ink": "#eafff2",
      "--lf-article-heading-font":
        "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
      "--lf-article-accent": "#2ddf7f",
      "--lf-article-border": "#1f4d36",
      "--lf-article-code-bg": "#0a1a13",
    },
    emptyClass: "text-center text-[#4d7a63] italic text-sm py-12",
  },

  // 06 · Glass (warm green)
  "6": {
    key: "glass",
    pageClass: "min-h-screen bg-[#FDF6EC] text-[#1A3D2B] antialiased",
    pageStyle: { fontFamily: "'DM Sans', system-ui, sans-serif" },
    navClass:
      "sticky top-0 z-40 w-full bg-[#FDF6EC]/85 backdrop-blur-md border-b border-[#D5E5DA] px-6 py-4 flex items-center justify-between",
    backLinkClass:
      "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7A9585] hover:text-[#1A3D2B] transition-colors",
    authorClass: "flex items-center gap-2 hover:opacity-80 transition-opacity",
    authorNameClass: "text-xs font-medium text-[#1A3D2B]",
    avatarWrapClass:
      "relative w-6 h-6 rounded-full overflow-hidden border border-[#D5E5DA]",
    avatarFallbackClass:
      "w-6 h-6 rounded-full bg-[#DCE9E0] flex items-center justify-center text-[10px] font-bold text-[#5b7a68]",
    containerClass: "max-w-2xl mx-auto px-6 py-14 sm:py-20",
    metaClass: "flex items-center gap-4 text-xs text-[#7A9585] mb-4",
    titleClass:
      "text-3xl sm:text-4xl font-bold tracking-tight text-[#1A3D2B] leading-[1.15] mb-5",
    descriptionClass: "text-[1.05rem] text-[#5b7a68] leading-relaxed mb-6 italic",
    dividerClass: "w-full h-px bg-[#D5E5DA] mt-8",
    articleClass: "",
    articleStyle: {
      "--lf-article-ink": "#33584a",
      "--lf-article-muted": "#6d8a79",
      "--lf-article-heading-ink": "#1A3D2B",
      "--lf-article-accent": "#166534",
      "--lf-article-border": "#D5E5DA",
      "--lf-article-code-bg": "#f2f8f1",
    },
    emptyClass: "text-center text-[#7A9585] italic text-sm py-12",
  },

  // 07 · Zine
  "7": {
    key: "zine",
    pageClass: "min-h-screen bg-[#fff7ed] text-[#241513] antialiased",
    pageStyle: {
      fontFamily: "'DM Sans', var(--font-sans), system-ui, sans-serif",
    },
    navClass:
      "sticky top-0 z-40 w-full bg-[#fff7ed] border-b-2 border-[#241513] px-6 py-4 flex items-center justify-between",
    backLinkClass:
      "inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#241513] hover:text-[#ef4444] transition-colors",
    authorClass: "flex items-center gap-2 hover:opacity-80 transition-opacity",
    authorNameClass: "text-xs font-bold uppercase tracking-wide text-[#241513]",
    avatarWrapClass:
      "relative w-6 h-6 rounded-md overflow-hidden border-2 border-[#241513]",
    avatarFallbackClass:
      "w-6 h-6 rounded-md border-2 border-[#241513] bg-[#fecaca] flex items-center justify-center text-[10px] font-black text-[#241513]",
    containerClass: "max-w-2xl mx-auto px-5 py-12 sm:py-16",
    metaClass:
      "flex items-center gap-4 text-xs font-bold uppercase tracking-[0.12em] text-[#a16207] mb-4",
    titleClass:
      "text-[34px] sm:text-[44px] font-black leading-[0.98] text-[#241513] mb-5",
    descriptionClass: "text-[1.05rem] font-semibold text-[#5c2d25] leading-relaxed mb-6",
    dividerClass: "w-full h-[2px] bg-[#241513] mt-8",
    articleClass:
      "rounded-lg border-2 border-[#241513] bg-white p-6 sm:p-8 shadow-[6px_6px_0_#241513]",
    articleStyle: {
      "--lf-article-ink": "#3f2a26",
      "--lf-article-muted": "#6b4a43",
      "--lf-article-heading-ink": "#241513",
      "--lf-article-accent": "#dc2626",
      "--lf-article-border": "#241513",
      "--lf-article-code-bg": "#fef9c3",
    },
    emptyClass: "text-center text-[#6b4a43] italic text-sm py-12",
  },

  // 08 · Graphite
  "8": {
    key: "graphite",
    noise: true,
    pageClass: "min-h-screen text-[#eee7da] antialiased",
    pageStyle: {
      background: "linear-gradient(180deg, #11100e 0%, #191714 50%, #0f0e0c 100%)",
      fontFamily: "var(--font-sans), 'DM Sans', system-ui, sans-serif",
    },
    navClass:
      "sticky top-0 z-40 w-full bg-[#11100e]/85 backdrop-blur-md border-b border-[#3b352c] px-6 py-4 flex items-center justify-between",
    backLinkClass:
      "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#857967] hover:text-[#c9a227] transition-colors",
    authorClass: "flex items-center gap-2 hover:opacity-80 transition-opacity",
    authorNameClass: "text-xs font-medium text-[#fff7df]",
    avatarWrapClass:
      "relative w-6 h-6 rounded-lg overflow-hidden border border-[#3b352c]",
    avatarFallbackClass:
      "w-6 h-6 rounded-lg bg-[#171512] flex items-center justify-center text-[10px] font-bold text-[#d8bd62]",
    containerClass: "max-w-2xl mx-auto px-6 py-14 sm:py-20 relative z-10",
    metaClass: "flex items-center gap-4 text-xs text-[#857967] mb-4",
    titleClass:
      "font-serif-display text-4xl sm:text-5xl font-normal leading-[1.05] text-[#fff7df] mb-5",
    descriptionClass: "text-[1.05rem] text-[#9d927f] leading-relaxed mb-6 italic",
    dividerClass: "w-full h-px bg-[#3b352c] mt-8",
    articleClass: "",
    articleStyle: {
      "--lf-article-ink": "#b8ad99",
      "--lf-article-muted": "#857967",
      "--lf-article-heading-ink": "#fff7df",
      "--lf-article-heading-font":
        "var(--font-serif-display), Georgia, serif",
      "--lf-article-accent": "#d8bd62",
      "--lf-article-border": "#3b352c",
      "--lf-article-code-bg": "#171512",
    },
    emptyClass: "text-center text-[#857967] italic text-sm py-12",
  },

  // 09 · Editorial (parchment)
  "9": {
    key: "editorial-parchment",
    noise: true,
    pageClass: "min-h-screen antialiased font-sans-body",
    pageStyle: {
      background: "#F4F0E9",
      color: "#1C1814",
      fontFamily:
        "var(--font-sans-body), 'Bricolage Grotesque', system-ui, sans-serif",
    },
    navClass:
      "sticky top-0 z-40 w-full bg-[#F4F0E9]/85 backdrop-blur-md border-b border-[#D8D0C5] px-6 py-4 flex items-center justify-between",
    backLinkClass:
      "inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#A0907E] hover:text-[#1C1814] transition-colors",
    authorClass: "flex items-center gap-2 hover:opacity-80 transition-opacity",
    authorNameClass: "text-xs font-medium text-[#1C1814]",
    avatarWrapClass:
      "relative w-6 h-6 rounded-full overflow-hidden border border-[#C8BDB0]",
    avatarFallbackClass:
      "w-6 h-6 rounded-full bg-[#E1D8CA] flex items-center justify-center text-[10px] font-bold text-[#5C5044]",
    containerClass: "max-w-2xl mx-auto px-7 py-14 sm:py-20 relative z-10",
    metaClass:
      "flex items-center gap-4 text-[11px] uppercase tracking-widest text-[#B5A898] mb-4",
    titleClass:
      "text-[34px] sm:text-[44px] font-normal tracking-[-0.02em] leading-[1.05] text-[#1C1814] mb-5",
    descriptionClass: "text-[1.05rem] text-[#5C5044] leading-[1.9] mb-6",
    dividerClass: "w-full h-px bg-[#D8D0C5] mt-8",
    articleClass: "",
    articleStyle: {
      "--lf-article-ink": "#3f352b",
      "--lf-article-muted": "#7a6a58",
      "--lf-article-heading-ink": "#1C1814",
      "--lf-article-heading-font":
        "var(--font-sans-body), 'Bricolage Grotesque', system-ui, sans-serif",
      "--lf-article-accent": "#1C1814",
      "--lf-article-border": "#D8D0C5",
      "--lf-article-code-bg": "#EFE9DF",
    },
    emptyClass: "text-center text-[#A0907E] italic text-sm py-12",
  },

  // 10 · Developer
  "10": {
    key: "developer",
    pageClass: "min-h-screen antialiased",
    pageStyle: {
      background: "#FFFCF9",
      color: "#0F0F0F",
      fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
    },
    navClass:
      "sticky top-0 z-40 w-full bg-[#FFFCF9]/85 backdrop-blur-md border-b border-[#F0ECE8] px-6 py-4 flex items-center justify-between",
    backLinkClass:
      "inline-flex items-center gap-2 text-[12px] font-mono text-[#9CA3AF] hover:text-[#374151] transition-colors",
    authorClass: "flex items-center gap-2 hover:opacity-80 transition-opacity",
    authorNameClass: "text-xs font-medium text-[#0F0F0F]",
    avatarWrapClass:
      "relative w-6 h-6 rounded-full overflow-hidden border border-[#F0EBE5]",
    avatarFallbackClass:
      "w-6 h-6 rounded-full bg-[#F5EFE8] flex items-center justify-center text-[10px] font-bold text-[#9CA3AF]",
    containerClass: "max-w-2xl mx-auto px-6 py-14 sm:py-16",
    metaClass: "flex items-center gap-4 text-xs font-mono text-[#C4B8AC] mb-4",
    titleClass:
      "font-serif-display text-[30px] sm:text-[38px] font-bold tracking-wide leading-tight text-[#333333] mb-5",
    descriptionClass: "text-[1.05rem] text-[#9CA3AF] leading-relaxed mb-6",
    dividerClass: "w-full h-px bg-[#F0ECE8] mt-8",
    articleClass: "rounded-xl border border-[#F0ECE8] bg-white p-6 sm:p-8",
    articleStyle: {
      "--lf-article-ink": "#374151",
      "--lf-article-muted": "#9CA3AF",
      "--lf-article-heading-ink": "#111827",
      "--lf-article-heading-font":
        "var(--font-serif-display), Georgia, serif",
      "--lf-article-accent": "#c026d3",
      "--lf-article-border": "#F0ECE8",
      "--lf-article-code-bg": "#FFFCF9",
    },
    emptyClass: "text-center text-[#C4B8AC] italic text-sm py-12",
  },

  // 11 · Résumé
  "11": {
    key: "resume",
    pageClass: "min-h-screen antialiased",
    pageStyle: {
      background: "#E8EDF4",
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
    navClass:
      "sticky top-0 z-40 w-full bg-[#E8EDF4]/85 backdrop-blur-md px-6 py-4 flex items-center justify-between",
    backLinkClass:
      "inline-flex items-center gap-2 text-[11px] font-mono text-[#94A3B8] hover:text-[#1A1A1A] transition-colors",
    authorClass: "flex items-center gap-2 hover:opacity-80 transition-opacity",
    authorNameClass: "text-xs font-medium text-[#1A1A1A]",
    avatarWrapClass:
      "relative w-6 h-6 rounded-sm overflow-hidden border border-[#E2E8F0]",
    avatarFallbackClass:
      "w-6 h-6 rounded-sm bg-[#F1F5F9] flex items-center justify-center text-[10px] font-bold text-[#64748B]",
    containerClass:
      "max-w-[780px] mx-auto my-8 sm:my-10 bg-white px-8 sm:px-14 py-12 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_8px_32px_rgba(0,0,0,0.06)]",
    metaClass: "flex items-center gap-4 text-xs font-mono text-[#94A3B8] mb-4",
    titleClass:
      "text-[28px] sm:text-[34px] font-bold tracking-tight text-[#1A1A1A] mb-5",
    descriptionClass: "text-[1.05rem] text-[#64748B] leading-relaxed mb-6",
    dividerClass: "w-full h-px bg-[#E2E8F0] mt-8",
    articleClass: "",
    articleStyle: {
      "--lf-article-ink": "#334155",
      "--lf-article-muted": "#64748B",
      "--lf-article-heading-ink": "#1A1A1A",
      "--lf-article-heading-font":
        "system-ui, -apple-system, 'Segoe UI', sans-serif",
      "--lf-article-accent": "#1A1A1A",
      "--lf-article-border": "#E2E8F0",
      "--lf-article-code-bg": "#F8FAFC",
    },
    emptyClass: "text-center text-[#94A3B8] italic text-sm py-12",
  },
};

const DEFAULT_THEME_KEY = "1";

export function getBlogTheme(themeId?: string | null): BlogTheme {
  if (themeId && BLOG_THEMES[themeId]) {
    return BLOG_THEMES[themeId];
  }
  return BLOG_THEMES[DEFAULT_THEME_KEY];
}
