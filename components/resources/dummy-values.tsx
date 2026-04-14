import   {Link2,
  Briefcase,
  Code2,
  Sparkles,
  BookOpen,
  User} from "lucide-react";

export const TEMPLATES = [
  {
    id: "minimal",
    label: "Minimal",
    emoji: "◻",
    preview: "Clean lines, white space, typography-first",
  },
  {
    id: "grid",
    label: "Grid",
    emoji: "⊞",
    preview: "Bento-style card grid layout",
  },
  {
    id: "terminal",
    label: "Terminal",
    emoji: "⌨",
    preview: "Code-aesthetic, monospace, dark",
  },
  {
    id: "magazine",
    label: "Magazine",
    emoji: "◈",
    preview: "Editorial, large type, bold sections",
  },
  {
    id: "glassmorphic",
    label: "Glass",
    emoji: "◉",
    preview: "Frosted glass, blurs, soft gradients",
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