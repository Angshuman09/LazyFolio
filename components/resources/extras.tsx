
export const TEMPLATES = [
  {
    id: "1",
    label: "Minimal Light",
    emoji: "01",
    preview: "Light, simple, minimal",
    description:
      "A clean, paper-white canvas that keeps the focus entirely on your work. Perfect for designers and writers who let their content speak.",
    tags: ["Light", "Minimal", "Clean"],
    image: "/styles/template-2.png",
  },
  {
    id: "2",
    label: "Minimal Dark",
    emoji: "02",
    preview: "Dark, simple, minimal",
    description:
      "Sleek charcoal aesthetic with high contrast typography. The developer's go-to — understated, yet impossibly sharp.",
    tags: ["Dark", "Minimal", "Sharp"],
    image: "/styles/template-1.png",
  },
  {
    id: "3",
    label: "Airy",
    emoji: "03",
    preview: "Clean white layout with muted borders",
    description:
      "Generous white space and muted borders create a calm, open feel. Like a well-lit studio — nothing distracts from you.",
    tags: ["White", "Spacious", "Calm"],
    image: "/styles/template-3.png",
  },
  {
    id: "4",
    label: "Editorial",
    emoji: "04",
    preview: "Serif type, paper texture, oxblood accents",
    description:
      "Inspired by premium print design. Serif headlines, warm paper tones, and deep oxblood accents give your story gravitas.",
    tags: ["Serif", "Warm", "Editorial"],
    image: "/styles/template-4.png",
  },
  {
    id: "5",
    label: "Terminal",
    emoji: "05",
    preview: "Dark code-aesthetic with green accents",
    description:
      "Pure hacker energy. Monospace type, phosphor-green accents, and a deep dark background — built for those who live in the terminal.",
    tags: ["Dark", "Mono", "Techy"],
    image: "/styles/template-5.png",
  },
  {
    id: "6",
    label: "Glass",
    emoji: "06",
    preview: "Frosted surfaces with teal and sky tones",
    description:
      "Translucent frosted panels that shimmer with teal and sky. A design that feels futuristic without feeling cold.",
    tags: ["Glass", "Teal", "Futuristic"],
    image: "/styles/template-6.png",
  },
  {
    id: "7",
    label: "Zine",
    emoji: "07",
    preview: "Bold borders, bright blocks, poster energy",
    description:
      "Thick borders, bold color blocks, and unapologetic type. Your portfolio as a limited-edition zine drop — for those who refuse to blend in.",
    tags: ["Bold", "Colorful", "Expressive"],
    image: "/styles/template-7.png",
  },
  {
    id: "8",
    label: "Graphite",
    emoji: "08",
    preview: "Dark luxury palette with gold details",
    description:
      "Dark luxury meets quiet ambition. Deep graphite surfaces with hairline gold accents — the template for those who mean serious business.",
    tags: ["Dark", "Gold", "Luxury"],
    image: "/styles/template-8.png",
  },
];

export const MOCK_SKILLS = [
  "TypeScript",
  "Next.js",
  "React",
  "Node.js",
  "Go",
  "Prisma",
  "PostgreSQL",
  "Docker",
  "Tailwind CSS",
  "Redis",
  "GraphQL",
  "AWS",
];

export type Tab = "profile" | "links" | "experience" | "projects" | "skills" | "blogs" | "insights";

export const NAV: { id: Tab; label: string}[] = [
  { id: "profile", label: "Profile" },
  { id: "links", label: "Links"},
  { id: "experience", label: "Experience"},
  { id: "projects", label: "Projects"},
  { id: "skills", label: "Skills"},
  { id: "blogs", label: "Blogs"},
  {id: "insights", label: "Insights"},
];

export const PERKS = [
  "Switch templates anytime, for free",
  "All templates are mobile-first",
  "Built-in analytics & insights",
];