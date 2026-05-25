import   {Link2,
  Briefcase,
  Code2,
  Sparkles,
  BookOpen,
  User} from "lucide-react";

export const TEMPLATES = [
  {
    id: "1",
    label: "Minimal",
    emoji: "01",
    preview: "Dark, focused, typography-first",
  },
  {
    id: "2",
    label: "Warm",
    emoji: "02",
    preview: "Soft stone palette with compact sections",
  },
  {
    id: "3",
    label: "Airy",
    emoji: "03",
    preview: "Clean white layout with muted borders",
  },
  {
    id: "4",
    label: "Editorial",
    emoji: "04",
    preview: "Serif type, paper texture, oxblood accents",
  },
  {
    id: "5",
    label: "Terminal",
    emoji: "05",
    preview: "Dark code-aesthetic with green accents",
  },
  {
    id: "6",
    label: "Glass",
    emoji: "06",
    preview: "Frosted surfaces with teal and sky tones",
  },
  {
    id: "7",
    label: "Zine",
    emoji: "07",
    preview: "Bold borders, bright blocks, poster energy",
  },
  {
    id: "8",
    label: "Graphite",
    emoji: "08",
    preview: "Dark luxury palette with gold details",
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

export type Tab = "profile" | "links" | "experience" | "projects" | "skills" | "blogs";

export const NAV: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "profile", label: "Profile", icon: <User size={14} /> },
  { id: "links", label: "Links", icon: <Link2 size={14} /> },
  { id: "experience", label: "Experience", icon: <Briefcase size={14} /> },
  { id: "projects", label: "Projects", icon: <Code2 size={14} /> },
  { id: "skills", label: "Skills", icon: <Sparkles size={14} /> },
  { id: "blogs", label: "Blogs", icon: <BookOpen size={14} /> },
];
