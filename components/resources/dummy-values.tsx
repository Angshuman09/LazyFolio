import   {Link2,
  Briefcase,
  Code2,
  Sparkles,
  BookOpen,
  User} from "lucide-react";

export const TEMPLATES = [
  {
    id: "1",
    label: "Minimal dark",
    emoji: "01",
    preview: "Dark, simple, minimal",
    image: "/styles/template1.png",
  },
  {
    id: "2",
    label: "Minimal light",
    emoji: "02",
    preview: "Light, simple, minimal",
    image: "/styles/template2.png",
  },
  {
    id: "3",
    label: "Airy",
    emoji: "03",
    preview: "Clean white layout with muted borders",
    image: "/styles/template3.png",
  },
  {
    id: "4",
    label: "Editorial",
    emoji: "04",
    preview: "Serif type, paper texture, oxblood accents",
    image: "/styles/template4.png",
  },
  {
    id: "5",
    label: "Terminal",
    emoji: "05",
    preview: "Dark code-aesthetic with green accents",
    image: "/styles/template5.png",
  },
  {
    id: "6",
    label: "Glass",
    emoji: "06",
    preview: "Frosted surfaces with teal and sky tones",
    image: "/styles/template6.png",
  },
  {
    id: "7",
    label: "Zine",
    emoji: "07",
    preview: "Bold borders, bright blocks, poster energy",
    image: "/styles/template7.png",
  },
  {
    id: "8",
    label: "Graphite",
    emoji: "08",
    preview: "Dark luxury palette with gold details",
    image: "/styles/template8.png",
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
