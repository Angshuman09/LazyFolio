
export const TEMPLATES = [
  {
    id: "1",
    label: "Minimal Light",
    emoji: "01",
    description:
      "A clean, paper-white canvas that keeps the focus entirely on your work.",
    tags: ["Light", "Minimal", "Clean"],
    image: "/styles/template-1.webp",
  },
  {
    id: "2",
    label: "Minimal Dark",
    emoji: "02",
    description:
      "Sleek charcoal aesthetic with high contrast typography.",
    tags: ["Dark", "Minimal", "Sharp"],
    image: "/styles/template-2.webp",
  },
  {
    id: "3",
    label: "Airy",
    emoji: "03",
    description:
      "Generous white space and muted borders create a calm, open feel.",
    tags: ["White", "Spacious", "Calm"],
    image: "/styles/template-3.webp",
  },
  {
    id: "4",
    label: "Editorial",
    emoji: "04",
    description:
      "A focused personal site with a readable introduction, a light project gallery, and quiet details.",
    tags: ["Light", "Gallery", "Minimal"],
    image: "/styles/template-4.webp",
  },
  {
    id: "5",
    label: "Terminal",
    emoji: "05",
    description:
      "Pure hacker energy. Monospace type, phosphor-green accents, and a deep dark background.",
    tags: ["Dark", "Mono", "Techy"],
    image: "/styles/template-5.webp",
  },
  {
    id: "6",
    label: "Glass",
    emoji: "06",
    description:
      "Translucent frosted panels that shimmer with teal and sky. A design that feels futuristic without feeling cold.",
    tags: ["Glass", "Teal", "Futuristic"],
    image: "/styles/template-6.webp",
  },
  {
    id: "7",
    label: "Zine",
    emoji: "07",
    description:
      "Thick borders, bold color blocks, and unapologetic type.",
    tags: ["Bold", "Colorful", "Expressive"],
    image: "/styles/template-7.webp",
  },
  {
    id: "8",
    label: "Graphite",
    emoji: "08",
    description:
      "A light technical profile with dot-grid space, ruled sections, pixel type, and concise records.",
    tags: ["Light", "Mono", "Grid"],
    image: "/styles/template-8.webp",
  },
  {
    id: "9",
    label: "Editorial",
    emoji: "09",
    description:
      "Pure editorial restraint. Large serif name, text-only project rows, newspaper article list. Typography-first, zero decoration.",
    tags: ["Minimal", "Serif", "Editorial"],
    image: "/styles/template-9.webp",
  },
  {
    id: "10",
    label: "Developer",
    emoji: "10",
    description:
      "Centered developer portfolio. Project cards with hover lift, social link pills, and a clean white/gray hierarchy.",
    tags: ["Cards", "Bold", "Developer"],
    image: "/styles/template-10.webp",
  },
  {
    id: "11",
    label: "Résumé",
    emoji: "11",
    description:
      "Left sidebar for contact & links. Right column for experience, projects, writing. Suitable for printing as a résumé.",
    tags: ["Resume", "Two-column", "Professional"],
    image: "/styles/template-11.webp",
  },
];

export type Tab = "profile" | "links" | "experience" | "projects" | "skills" | "blogs" | "articles" | "insights";

export const NAV: { id: Tab; label: string}[] = [
  { id: "profile", label: "Profile" },
  { id: "links", label: "Links"},
  { id: "experience", label: "Experience"},
  { id: "projects", label: "Projects"},
  { id: "skills", label: "Skills"},
  { id: "blogs", label: "Blogs"},
  { id: "articles", label: "Write Article"},
  {id: "insights", label: "Insights"},
];

export const PERKS = [
  "Switch templates anytime, for free",
  "All templates are mobile-first",
  "Built-in analytics & insights",
];
