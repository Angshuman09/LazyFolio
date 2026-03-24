"use client";

import { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  LayoutTemplate,
  Github,
  Globe,
  Trash2,
  Pencil,
  Plus,
  ExternalLink,
  Star,
  Copy,
  Check,
  ChevronRight,
  Layers,
  Link2,
  Briefcase,
  Code2,
  Sparkles,
  BookOpen,
  User,
  BarChart3,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab =
  | "overview"
  | "profile"
  | "links"
  | "experience"
  | "projects"
  | "skills"
  | "blogs";

const TEMPLATES = [
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

const NAV: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <BarChart3 size={14} /> },
  { id: "profile", label: "Profile", icon: <User size={14} /> },
  { id: "links", label: "Links", icon: <Link2 size={14} /> },
  { id: "experience", label: "Experience", icon: <Briefcase size={14} /> },
  { id: "projects", label: "Projects", icon: <Code2 size={14} /> },
  { id: "skills", label: "Skills", icon: <Sparkles size={14} /> },
  { id: "blogs", label: "Blogs", icon: <BookOpen size={14} /> },
];

const MOCK_SKILLS = [
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

// ─── Component ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [dark, setDark] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState("minimal");
  const [copied, setCopied] = useState(false);
  const [activeStatus, setActiveStatus] = useState("🔥 Open to work");
  const username = "angshuman09";

  const [mounted, setMounted] = useState(false);

  // Sync theme with localStorage and document class
  useEffect(() => {
    if (typeof document === "undefined") return;
    // Initial mount: Check current class or localStorage
    const isDark = 
      document.documentElement.classList.contains("dark") || 
      localStorage.getItem("lf-theme") === "dark";
    
    setDark(isDark);
    setMounted(true);
  }, []);

  // Update theme whenever 'dark' state changes, but only after mount
  useEffect(() => {
    if (!mounted || typeof document === "undefined") return;
    
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("lf-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("lf-theme", "light");
    }
  }, [dark, mounted]);

  const copyLink = () => {
    navigator.clipboard?.writeText(`lazyfolio.com/${username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-(--lf-bg) text-(--lf-ink) font-sans transition-colors duration-200">
      {/* ═══════════════ DASHBOARD HEADER ═══════════════ */}
      <header className="sticky top-0 z-40 h-[52px] flex items-center justify-between px-6 bg-(--lf-bg)/88 backdrop-blur-lg border-b border-(--lf-border-alpha) transition-colors duration-200">
        <div className="flex items-center">
          <span className="font-serif text-[1.15rem] font-normal tracking-tight text-(--lf-ink) select-none">
            Lazyfolio
          </span>
          <div className="flex items-center gap-[5px] text-[0.75rem] text-(--lf-muted) ml-3">
            <span>Dashboard</span>
            {tab !== "overview" && (
              <>
                <ChevronRight size={11} className="opacity-35" />
                <span className="text-(--lf-ink) font-medium">
                  {NAV.find((n) => n.id === tab)?.label}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Template picker */}
          <button
            className="inline-flex items-center gap-[7px] px-3.5 h-[34px] rounded-lg border border-(--lf-border) bg-(--lf-surface) text-(--lf-muted) text-[0.78rem] font-medium cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans"
            onClick={() => setTemplateOpen(true)}
          >
            <Layers size={13} />
            Templates
            <span className="font-mono text-[0.65rem] text-(--lf-muted) opacity-75 px-1.5 py-px rounded bg-(--lf-border-alpha)">
              {TEMPLATES.find((t) => t.id === activeTemplate)?.label}
            </span>
          </button>

          {/* Theme toggle — same pattern as Navbar */}
          <button
            className="inline-flex items-center justify-center w-[34px] h-[34px] rounded-lg border border-(--lf-border) bg-(--lf-surface) text-(--lf-muted) cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150"
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <button className="inline-flex items-center gap-1.5 px-3 h-[30px] rounded-lg bg-transparent border border-(--lf-border) text-(--lf-muted) text-[0.75rem] font-medium cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans whitespace-nowrap">
            <ExternalLink size={12} />
            Preview
          </button>

          <button className="inline-flex items-center gap-1.5 px-[18px] h-[34px] rounded-[20px] bg-(--lf-ink) text-(--lf-bg) text-[0.78rem] font-semibold border-none cursor-pointer hover:opacity-82 transition-opacity duration-150 font-sans whitespace-nowrap">
            Save changes
          </button>
        </div>
      </header>

      {/* ═══════════════ BODY ═══════════════ */}
      <div className="flex flex-1">
        {/* ─── Sidebar ─── */}
        <aside className="w-[200px] shrink-0 border-r border-(--lf-border-alpha) p-[16px_10px_20px] flex flex-col gap-[2px] sticky top-[52px] h-[calc(100vh-52px)] overflow-y-auto">
          {NAV.map((n) => (
            <button
              key={n.id}
              className={`flex items-center gap-[9px] px-3 py-2 rounded-lg text-[0.82rem] font-medium text-(--lf-muted) cursor-pointer bg-transparent w-full text-left hover:text-(--lf-ink) hover:bg-(--lf-accent-soft) transition-all duration-150 font-sans tracking-tight ${
                tab === n.id
                  ? "text-(--lf-ink) bg-(--lf-accent-soft) font-semibold"
                  : ""
              }`}
              onClick={() => setTab(n.id)}
            >
              <span className={tab === n.id ? "opacity-100" : "opacity-65"}>
                {n.icon}
              </span>
              {n.label}
            </button>
          ))}

          <div className="h-px bg-(--lf-border-alpha) my-2.5 mx-1" />

          <div className="mt-auto border border-(--lf-border) rounded-[10px] p-3.5 bg-(--lf-surface)">
            <div className="text-[0.65rem] text-(--lf-muted) font-mono uppercase tracking-widest mb-1.5">
              Your portfolio
            </div>
            <div className="text-[0.75rem] text-(--lf-ink) font-mono mb-2.5 break-all">
              lazyfolio/{username}
            </div>
            <button
              className="inline-flex items-center gap-1.5 px-3 h-[30px] rounded-lg bg-transparent border border-(--lf-border) text-(--lf-muted) text-[0.75rem] font-medium cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans whitespace-nowrap w-full justify-center"
              onClick={copyLink}
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
        </aside>

        {/* ─── Main ─── */}
        <main className="flex-1 py-8 px-10 max-w-[860px] overflow-y-auto">
          {/* ══ OVERVIEW ══════════════════════════════════════════ */}
          {tab === "overview" && (
            <>
              <h1 className="font-serif text-[1.4rem] font-medium tracking-tight text-(--lf-ink) mb-1">
                Good morning ✦
              </h1>
              <p className="text-[0.78rem] text-(--lf-muted) mb-7">
                Your portfolio is live at lazyfolio/{username}
              </p>

              {/* profile strip */}
              <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-5 flex items-center gap-[18px] transition-colors duration-150 hover:border-(--lf-muted)">
                <div className="w-[62px] h-[62px] rounded-full bg-(--lf-border) flex items-center justify-center font-serif text-[1.5rem] text-(--lf-muted) shrink-0 border-2 border-(--lf-border)">
                  A
                </div>
                <div className="flex-1">
                  <div className="font-serif text-[1rem] font-medium mb-1 text-(--lf-ink)">
                    Angshuman Kalita
                  </div>
                  <div className="text-[0.78rem] text-(--lf-muted) mb-2">
                    Full Stack Developer · Assam, India
                  </div>
                  <div className="flex gap-1.25 flex-wrap">
                    {["Next.js", "TypeScript", "Go"].map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center bg-(--lf-accent-soft) border border-(--lf-border) rounded-[5px] px-2 py-0.5 text-[0.7rem] text-(--lf-muted) font-mono"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-[0.75rem] text-(--lf-muted) px-3.5 py-1.5 rounded-[20px] border border-(--lf-border) whitespace-nowrap">
                  🔥 Open to work
                </div>
              </div>

              {/* stats */}
              <div className="grid grid-cols-4 gap-3 mb-7">
                {[
                  { l: "Links", v: 3 },
                  { l: "Projects", v: 2 },
                  { l: "Experience", v: 2 },
                  { l: "Blogs", v: 2 },
                ].map((s) => (
                  <div
                    key={s.l}
                    className="border border-(--lf-border) rounded-xl px-[18px] py-4 bg-(--lf-surface)"
                  >
                    <div className="font-serif text-[1.9rem] font-medium text-(--lf-ink) leading-none">
                      {s.v}
                    </div>
                    <div className="text-[0.68rem] text-(--lf-muted) mt-1.25 font-mono tracking-widest uppercase">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>

              {/* GitHub */}
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-[0.68rem] font-semibold tracking-widest uppercase text-(--lf-muted) font-mono">
                  GitHub Stats
                </span>
                <span className="text-[0.68rem] text-(--lf-muted) font-mono">
                  synced 2m ago
                </span>
              </div>
              <div className="border border-(--lf-border) rounded-xl px-5 py-[18px] bg-(--lf-surface) mb-6">
                <div className="flex items-center gap-2">
                  <Github size={14} className="text-(--lf-muted)" />
                  <span className="text-[0.8rem] text-(--lf-muted) font-mono">
                    github.com/
                    <strong className="text-(--lf-ink)">{username}</strong>
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-3.5 mt-4">
                  {[
                    { l: "Repos", v: 34 },
                    { l: "Stars", v: 412 },
                    { l: "Forks", v: 89 },
                    { l: "Followers", v: 203 },
                    { l: "Contribs", v: "1.2k" },
                  ].map((s) => (
                    <div key={s.l}>
                      <div className="font-serif text-[1.35rem] font-medium text-(--lf-ink)">
                        {s.v}
                      </div>
                      <div className="text-[0.66rem] text-(--lf-muted) font-mono uppercase tracking-widest mt-[3px]">
                        {s.l}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-[3px] flex-wrap mt-[18px]">
                  {Array.from({ length: 56 }).map((_, i) => {
                    // Use a simple deterministic "random" value based on index to avoid hydration mismatch
                    const seed = (i * 149) % 100;
                    const a = seed > 40 ? ((seed / 100) * 0.55 + 0.15).toFixed(2) : "0.05";
                    return (
                      <div
                        key={i}
                        className="w-2.5 h-2.5 rounded-[2px]"
                        style={{
                          background: `rgba(${dark ? "240,240,235" : "17,17,16"},${a})`,
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* recent projects */}
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-[0.68rem] font-semibold tracking-widest uppercase text-(--lf-muted) font-mono">
                  Recent Projects
                </span>
                <button
                  className="inline-flex items-center gap-1.5 px-3 h-[30px] rounded-lg bg-transparent border border-(--lf-border) text-(--lf-muted) text-[0.75rem] font-medium cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans whitespace-nowrap"
                  onClick={() => setTab("projects")}
                >
                  <ExternalLink size={11} />
                  See all
                </button>
              </div>
              {[
                { t: "LazyFolio", d: "No-deploy portfolio builder", s: 128 },
                { t: "CodeSnap", d: "Code screenshot generator", s: 64 },
              ].map((p) => (
                <div
                  key={p.t}
                  className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted) flex items-center gap-3.5"
                >
                  <Code2 size={15} className="text-(--lf-muted) shrink-0" />
                  <div className="flex-1">
                    <div className="text-[0.85rem] font-semibold">{p.t}</div>
                    <div className="text-[0.75rem] text-(--lf-muted) mt-0.5">
                      {p.d}
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-[0.72rem] text-(--lf-muted) font-mono">
                    <Star size={11} /> {p.s}
                  </span>
                </div>
              ))}
            </>
          )}

          {/* ══ PROFILE ═══════════════════════════════════════════ */}
          {tab === "profile" && (
            <>
              <h1 className="font-serif text-[1.4rem] font-medium tracking-tight text-(--lf-ink) mb-1">
                Profile
              </h1>
              <p className="text-[0.78rem] text-(--lf-muted) mb-7">
                How you appear on your public portfolio page
              </p>

              <div className="grid grid-cols-2 gap-3.5 mb-4">
                <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted)">
                  <div className="text-[0.68rem] font-semibold tracking-widest uppercase text-(--lf-muted) font-mono mb-3.5">
                    Avatar
                  </div>
                  <div className="flex items-center gap-3.5">
                    <div className="w-[62px] h-[62px] rounded-full bg-(--lf-border) flex items-center justify-center font-serif text-[1.5rem] text-(--lf-muted) shrink-0 border-2 border-(--lf-border)">
                      A
                    </div>
                    <div className="flex-1">
                      <button className="inline-flex items-center gap-1.5 px-3 h-[30px] rounded-lg bg-transparent border border-(--lf-border) text-(--lf-muted) text-[0.75rem] font-medium cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans whitespace-nowrap w-full justify-center mb-1.5">
                        Upload photo
                      </button>
                      <div className="text-[0.68rem] text-(--lf-muted) font-mono text-center">
                        PNG · JPG · max 2MB
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted)">
                  <div className="text-[0.68rem] font-semibold tracking-widest uppercase text-(--lf-muted) font-mono mb-3.5">
                    Banner
                  </div>
                  <div className="h-[66px] rounded-lg cursor-pointer bg-(--lf-border) flex items-center justify-center text-[0.75rem] text-(--lf-muted) border-2 border-dashed border-(--lf-border)">
                    Click to upload banner
                  </div>
                </div>
              </div>

              <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) transition-colors duration-150 hover:border-(--lf-muted) mb-7">
                <div className="text-[0.68rem] font-semibold tracking-widest uppercase text-(--lf-muted) font-mono mb-4">
                  Basic Info
                </div>
                <div className="grid grid-cols-2 gap-x-4.5">
                  <div className="flex flex-col gap-1.25 mb-3.5">
                    <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                      Full Name
                    </label>
                    <input
                      className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
                      defaultValue="Angshuman Kalita"
                    />
                  </div>
                  <div className="flex flex-col gap-1.25 mb-3.5">
                    <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                      Username
                    </label>
                    <input
                      className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
                      defaultValue="angshuman09"
                    />
                  </div>
                  <div className="flex flex-col gap-1.25 mb-3.5">
                    <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                      Tagline
                    </label>
                    <input
                      className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
                      defaultValue="Full Stack Developer · Open to work"
                    />
                  </div>
                  <div className="flex flex-col gap-1.25 mb-3.5">
                    <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                      Location
                    </label>
                    <input
                      className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
                      defaultValue="Assam, India"
                    />
                  </div>
                  <div className="flex flex-col gap-1.25 mb-3.5">
                    <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                      GitHub Username
                    </label>
                    <input
                      className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
                      defaultValue="Angshuman09"
                    />
                  </div>
                  <div className="flex flex-col gap-1.25 mb-3.5">
                    <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                      Attached URL
                    </label>
                    <input
                      className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
                      placeholder="https://yoursite.com"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.25 mb-3.5">
                  <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                    Bio
                  </label>
                  <textarea
                    className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted) min-h-[90px] resize-vertical"
                    defaultValue="I build things for the web. Passionate about developer tooling, open source, and shipping fast."
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mb-3.5">
                <span className="text-[0.68rem] font-semibold tracking-widest uppercase text-(--lf-muted) font-mono">
                  Banner Status
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "🔥 Open to work",
                  "🚀 Building in public",
                  "☕ Freelance available",
                  "📚 Currently learning",
                  "🤝 Looking to collab",
                ].map((s) => (
                  <button
                    key={s}
                    className={`border border-(--lf-border) rounded-[20px] px-4 py-1.75 text-[0.8rem] text-(--lf-muted) cursor-pointer bg-(--lf-surface) transition-all duration-120 font-sans ${activeStatus === s ? "border-(--lf-ink) text-(--lf-ink) bg-(--lf-accent-soft) font-medium" : "hover:border-(--lf-muted) hover:text-(--lf-ink)"}`}
                    onClick={() => setActiveStatus(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ══ LINKS ═════════════════════════════════════════════ */}
          {tab === "links" && (
            <>
              <h1 className="font-serif text-[1.4rem] font-medium tracking-tight text-(--lf-ink) mb-1">
                Links
              </h1>
              <p className="text-[0.78rem] text-(--lf-muted) mb-7">
                Add any links to feature on your portfolio
              </p>

              <div className="mb-6">
                {[
                  {
                    Icon: Github,
                    label: "GitHub",
                    url: "https://github.com/angshuman09",
                  },
                  {
                    Icon: Globe,
                    label: "LinkedIn",
                    url: "https://linkedin.com/in/angshuman09",
                  },
                  {
                    Icon: Globe,
                    label: "Twitter / X",
                    url: "https://x.com/angshuman09",
                  },
                ].map((l) => (
                  <div
                    key={l.label}
                    className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted) flex items-center gap-3.5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-(--lf-accent-soft) flex items-center justify-center text-(--lf-muted) shrink-0">
                      <l.Icon size={14} />
                    </div>
                    <div className="flex-1">
                      <div className="text-[0.85rem] font-semibold">
                        {l.label}
                      </div>
                      <div className="text-[0.72rem] text-(--lf-muted) font-mono mt-0.5">
                        {l.url}
                      </div>
                    </div>
                    <button className="inline-flex items-center gap-1.5 px-3 h-[30px] rounded-lg bg-transparent border border-(--lf-border) text-(--lf-muted) text-[0.75rem] font-medium cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans whitespace-nowrap">
                      <Pencil size={11} />
                      Edit
                    </button>
                    <button className="inline-flex items-center gap-[5px] px-2.5 h-[30px] rounded-lg bg-transparent border border-transparent text-(--lf-muted) text-[0.75rem] cursor-pointer hover:text-[#b91c1c] hover:bg-[#b91c1c]/5 hover:border-[#b91c1c]/15 dark:hover:text-[#f87171] dark:hover:bg-[#f87171]/8 dark:hover:border-[#f87171]/20 transition-all duration-150">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted) border-dashed">
                <div className="text-[0.68rem] font-semibold tracking-widest uppercase text-(--lf-muted) font-mono mb-3.5">
                  New Link
                </div>
                <div className="grid grid-cols-[1fr_2fr] gap-3.5">
                  <div className="flex flex-col gap-1.25 mb-3.5">
                    <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                      Label
                    </label>
                    <input
                      className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
                      placeholder="Twitter"
                    />
                  </div>
                  <div className="flex flex-col gap-1.25 mb-3.5">
                    <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                      URL
                    </label>
                    <input
                      className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
                      placeholder="https://x.com/you"
                    />
                  </div>
                </div>
                <button className="inline-flex items-center gap-1.5 px-[18px] h-[34px] rounded-[20px] bg-(--lf-ink) text-(--lf-bg) text-[0.78rem] font-semibold border-none cursor-pointer hover:opacity-82 transition-opacity duration-150 font-sans whitespace-nowrap">
                  <Plus size={12} />
                  Add link
                </button>
              </div>
            </>
          )}

          {/* ══ EXPERIENCE ════════════════════════════════════════ */}
          {tab === "experience" && (
            <>
              <h1 className="font-serif text-[1.4rem] font-medium tracking-tight text-(--lf-ink) mb-1">
                Experience
              </h1>
              <p className="text-[0.78rem] text-(--lf-muted) mb-7">
                Your professional work history
              </p>

              <div className="flex items-center justify-between mb-3.5">
                <span className="text-[0.68rem] font-semibold tracking-widest uppercase text-(--lf-muted) font-mono">
                  Roles
                </span>
                <button className="inline-flex items-center gap-1.5 px-3 h-[30px] rounded-lg bg-transparent border border-(--lf-border) text-(--lf-muted) text-[0.75rem] font-medium cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans whitespace-nowrap">
                  <Plus size={11} />
                  Add role
                </button>
              </div>

              {[
                {
                  role: "Full Stack Developer",
                  company: "Acme Corp",
                  period: "2023 – Present",
                  desc: "Built scalable microservices and React dashboards serving 200k+ users.",
                },
                {
                  role: "Frontend Intern",
                  company: "StartupXYZ",
                  period: "2022 – 2023",
                  desc: "Revamped design system, reducing component duplication by 40%.",
                },
              ].map((e) => (
                <div
                  key={e.role}
                  className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted)"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-[0.9rem]">
                        {e.role}
                      </div>
                      <div className="text-[0.78rem] text-(--lf-muted) mt-0.75">
                        {e.company}
                      </div>
                    </div>
                    <span className="text-[0.7rem] text-(--lf-muted) font-mono whitespace-nowrap">
                      {e.period}
                    </span>
                  </div>
                  <div className="text-[0.78rem] text-(--lf-muted) leading-relaxed mb-3">
                    {e.desc}
                  </div>
                  <div className="flex gap-2">
                    <button className="inline-flex items-center gap-1.5 px-3 h-[30px] rounded-lg bg-transparent border border-(--lf-border) text-(--lf-muted) text-[0.75rem] font-medium cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans whitespace-nowrap">
                      <Pencil size={11} />
                      Edit
                    </button>
                    <button className="inline-flex items-center gap-[5px] px-2.5 h-[30px] rounded-lg bg-transparent border border-transparent text-(--lf-muted) text-[0.75rem] cursor-pointer hover:text-[#b91c1c] hover:bg-[#b91c1c]/5 hover:border-[#b91c1c]/15 dark:hover:text-[#f87171] dark:hover:bg-[#f87171]/8 dark:hover:border-[#f87171]/20 transition-all duration-150">
                      <Trash2 size={11} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ══ PROJECTS ══════════════════════════════════════════ */}
          {tab === "projects" && (
            <>
              <h1 className="font-serif text-[1.4rem] font-medium tracking-tight text-(--lf-ink) mb-1">
                Projects
              </h1>
              <p className="text-[0.78rem] text-(--lf-muted) mb-7">
                Showcase what you've built
              </p>

              <div className="flex items-center justify-between mb-3.5">
                <span className="text-[0.68rem] font-semibold tracking-widest uppercase text-(--lf-muted) font-mono">
                  Projects
                </span>
                <button className="inline-flex items-center gap-1.5 px-3 h-[30px] rounded-lg bg-transparent border border-(--lf-border) text-(--lf-muted) text-[0.75rem] font-medium cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans whitespace-nowrap">
                  <Plus size={11} />
                  Add project
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    t: "LazyFolio",
                    d: "No-deploy portfolio builder with GitHub stats and custom links.",
                    tech: ["Next.js", "Prisma", "Tailwind"],
                    s: 128,
                    url: "github.com/angshuman09/lazyfolio",
                  },
                  {
                    t: "CodeSnap",
                    d: "Code screenshot generator with syntax highlighting.",
                    tech: ["React", "Canvas API"],
                    s: 64,
                    url: "github.com/angshuman09/codesnap",
                  },
                ].map((p) => (
                  <div
                    key={p.t}
                    className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted) flex flex-col gap-2.5"
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-semibold text-[0.9rem]">{p.t}</div>
                      <span className="flex items-center gap-1 text-[0.72rem] text-(--lf-muted) font-mono">
                        <Star size={11} /> {p.s}
                      </span>
                    </div>
                    <div className="text-[0.78rem] text-(--lf-muted) leading-relaxed">
                      {p.d}
                    </div>
                    <div className="flex flex-wrap gap-1.25">
                      {p.tech.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center bg-(--lf-accent-soft) border border-(--lf-border) rounded-[5px] px-2 py-0.5 text-[0.7rem] text-(--lf-muted) font-mono"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="text-[0.68rem] text-(--lf-muted) font-mono">
                      {p.url}
                    </div>
                    <div className="flex gap-2 mt-0.5">
                      <button className="inline-flex items-center gap-1.5 px-3 h-[30px] rounded-lg bg-transparent border border-(--lf-border) text-(--lf-muted) text-[0.75rem] font-medium cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans whitespace-nowrap">
                        <Pencil size={11} />
                        Edit
                      </button>
                      <button className="inline-flex items-center gap-[5px] px-2.5 h-[30px] rounded-lg bg-transparent border border-transparent text-(--lf-muted) text-[0.75rem] cursor-pointer hover:text-[#b91c1c] hover:bg-[#b91c1c]/5 hover:border-[#b91c1c]/15 dark:hover:text-[#f87171] dark:hover:bg-[#f87171]/8 dark:hover:border-[#f87171]/20 transition-all duration-150">
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ══ SKILLS ════════════════════════════════════════════ */}
          {tab === "skills" && (
            <>
              <h1 className="font-serif text-[1.4rem] font-medium tracking-tight text-(--lf-ink) mb-1">
                Skills
              </h1>
              <p className="text-[0.78rem] text-(--lf-muted) mb-7">
                Technologies and tools you work with
              </p>

              <div className="flex items-center justify-between mb-3">
                <span className="text-[0.68rem] font-semibold tracking-widest uppercase text-(--lf-muted) font-mono">
                  Current Skills
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {MOCK_SKILLS.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-[7px] bg-(--lf-surface) border border-(--lf-border) rounded-lg px-3 py-1.5 text-[0.78rem] text-(--lf-ink) font-mono cursor-default transition-colors duration-150 hover:border-(--lf-muted)"
                  >
                    {s}
                    <span className="cursor-pointer text-(--lf-muted) text-[10px] leading-none hover:text-[#b91c1c] dark:hover:text-[#f87171]">
                      ✕
                    </span>
                  </span>
                ))}
              </div>

              <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted) border-dashed">
                <div className="text-[0.68rem] font-semibold tracking-widest uppercase text-(--lf-muted) font-mono mb-3.5">
                  Add a skill
                </div>
                <div className="flex gap-2.5">
                  <div className="flex flex-col gap-1.25 flex-1 mb-0">
                    <input
                      className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
                      placeholder="e.g. Rust, Kubernetes, Figma…"
                    />
                  </div>
                  <button className="inline-flex items-center gap-1.5 px-[18px] h-[34px] rounded-[20px] bg-(--lf-ink) text-(--lf-bg) text-[0.78rem] font-semibold border-none cursor-pointer hover:opacity-82 transition-opacity duration-150 font-sans whitespace-nowrap shrink-0">
                    <Plus size={12} />
                    Add
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ══ BLOGS ═════════════════════════════════════════════ */}
          {tab === "blogs" && (
            <>
              <h1 className="font-serif text-[1.4rem] font-medium tracking-tight text-(--lf-ink) mb-1">
                Blogs
              </h1>
              <p className="text-[0.78rem] text-(--lf-muted) mb-7">
                Articles and posts you've written
              </p>

              <div className="flex items-center justify-between mb-3.5">
                <span className="text-[0.68rem] font-semibold tracking-widest uppercase text-(--lf-muted) font-mono">
                  Posts
                </span>
                <button className="inline-flex items-center gap-1.5 px-3 h-[30px] rounded-lg bg-transparent border border-(--lf-border) text-(--lf-muted) text-[0.75rem] font-medium cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans whitespace-nowrap">
                  <Plus size={11} />
                  Add post
                </button>
              </div>

              {[
                {
                  t: "Why I stopped deploying side projects",
                  url: "dev.to/angshuman09/...",
                  date: "Mar 2026",
                },
                {
                  t: "Building a GitHub stats widget from scratch",
                  url: "dev.to/angshuman09/...",
                  date: "Feb 2026",
                },
              ].map((b) => (
                <div
                  key={b.t}
                  className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted) flex items-center gap-3.5"
                >
                  <BookOpen size={14} className="text-(--lf-muted) shrink-0" />
                  <div className="flex-1">
                    <div className="text-[0.85rem] font-semibold">{b.t}</div>
                    <div className="text-[0.7rem] text-(--lf-muted) font-mono mt-0.75">
                      {b.url} · {b.date}
                    </div>
                  </div>
                  <button className="inline-flex items-center gap-[5px] px-2.5 h-[30px] rounded-lg bg-transparent border border-transparent text-(--lf-muted) text-[0.75rem] cursor-pointer hover:text-[#b91c1c] hover:bg-[#b91c1c]/5 hover:border-[#b91c1c]/15 dark:hover:text-[#f87171] dark:hover:bg-[#f87171]/8 dark:hover:border-[#f87171]/20 transition-all duration-150">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}

              <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted) border-dashed mt-1">
                <div className="text-[0.68rem] font-semibold tracking-widest uppercase text-(--lf-muted) font-mono mb-3.5">
                  New Post
                </div>
                <div className="flex flex-col gap-1.25 mb-3.5">
                  <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                    Title
                  </label>
                  <input
                    className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
                    placeholder="My latest article"
                  />
                </div>
                <div className="flex flex-col gap-1.25 mb-3.5">
                  <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                    URL
                  </label>
                  <input
                    className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
                    placeholder="https://dev.to/you/article"
                  />
                </div>
                <button className="inline-flex items-center gap-1.5 px-[18px] h-[34px] rounded-[20px] bg-(--lf-ink) text-(--lf-bg) text-[0.78rem] font-semibold border-none cursor-pointer hover:opacity-82 transition-opacity duration-150 font-sans whitespace-nowrap">
                  <Plus size={12} />
                  Add post
                </button>
              </div>
            </>
          )}
        </main>
      </div>

      {/* ═══════════════ TEMPLATE MODAL ═══════════════ */}
      {templateOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm transition-opacity duration-200"
          onClick={() => setTemplateOpen(false)}
        >
          <div
            className="bg-(--lf-bg) border border-(--lf-border) rounded-2xl w-full max-w-[420px] shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif text-[1.25rem] font-medium text-(--lf-ink) mb-1.5 leading-tight">
              Choose a template
            </h2>
            <p className="text-[0.82rem] text-(--lf-muted) mb-6 leading-relaxed">
              Pick how your public portfolio page looks. You can change this
              anytime.
            </p>

            <div className="flex flex-col gap-2.5">
              {TEMPLATES.map((t) => (
                <div
                  key={t.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-150 cursor-pointer ${activeTemplate === t.id ? "border-(--lf-ink) bg-(--lf-accent-soft)" : "border-(--lf-border) bg-(--lf-surface) hover:border-(--lf-muted)"}`}
                  onClick={() => setActiveTemplate(t.id)}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${activeTemplate === t.id ? "bg-(--lf-ink) text-(--lf-bg)" : "bg-(--lf-border) text-(--lf-muted)"}`}
                  >
                    {activeTemplate === t.id ? (
                      <Check size={16} />
                    ) : (
                      <span className="text-[1.1rem]">{t.emoji}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-[0.88rem] font-semibold text-(--lf-ink)">
                      {t.label}
                    </div>
                    <div className="text-[0.74rem] text-(--lf-muted) mt-0.5">
                      {t.preview}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-7">
              <button
                className="inline-flex items-center gap-1.5 px-4 h-[36px] rounded-lg bg-transparent border border-(--lf-border) text-(--lf-muted) text-[0.8rem] font-medium cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans whitespace-nowrap"
                onClick={() => setTemplateOpen(false)}
              >
                Cancel
              </button>
              <button
                className="inline-flex items-center gap-2 px-5 h-[36px] rounded-[20px] bg-(--lf-ink) text-(--lf-bg) text-[0.82rem] font-bold border-none cursor-pointer hover:opacity-82 transition-opacity duration-150 font-sans whitespace-nowrap"
                onClick={() => setTemplateOpen(false)}
              >
                <Check size={12} strokeWidth={3} />
                Apply template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
