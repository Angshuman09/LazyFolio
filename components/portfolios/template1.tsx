"use client";

import { useState } from "react";
import {
  Github,
  Twitter,
  Mail,
  ExternalLink,
  ArrowUpRight,
  Linkedin,
  Globe,
  ChevronRight,
  Layers,
  FileText,
  Code2,
} from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const DATA = {
  name: "Alex Rivers",
  // handle: "@alexrivers",
  role: "Full-Stack Developer",
  tagline:
    "i build fast, ship faster — full-stack dev obsessed with great UX & clean systems.",
  avatar:
    "https://api.dicebear.com/9.x/notionists/svg?seed=alexrivers&backgroundColor=b6e3f4",
  links: {
    github: "https://github.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    email: "mailto:hi@alexrivers.dev",
    website: "https://alexrivers.dev",
  },
  projects: [
    {
      name: "Fynt",
      description:
        "Workflow automation platform to build, run and monitor multi-step pipelines.",
      url: "https://github.com",
      tags: ["Next.js", "TypeScript", "Redis"],
      status: "Live",
    },
    {
      name: "CrabGit",
      description:
        "Git implementation from scratch in Rust with content-addressable storage.",
      url: "https://github.com",
      tags: ["Rust", "CLI"],
      status: "Open Source",
    },
    {
      name: "TempMail",
      description:
        "Disposable email service — secure, no sign-up, self-destructing inboxes.",
      url: "https://github.com",
      tags: ["Next.js", "PostgreSQL", "Tailwind"],
      status: "Live",
    },
    {
      name: "GoDis",
      description:
        "Redis clone built from scratch in Go — pure learning project.",
      url: "https://github.com",
      tags: ["Go", "Networking"],
      status: "Open Source",
    },
  ],
  blogs: [
    {
      title: "Building Git from Scratch in Rust",
      date: "Nov 16, 2025",
      tags: ["Rust", "Git"],
      url: "#",
    },
    {
      title: "My First Solana Smart Contract",
      date: "Jul 21, 2025",
      tags: ["Solana", "Rust"],
      url: "#",
    },
    {
      title: "Why I Switched from Prisma to Drizzle",
      date: "Apr 3, 2025",
      tags: ["TypeScript", "DB"],
      url: "#",
    },
  ],
  stack: [
    "Next.js",
    "TypeScript",
    "React",
    "Rust",
    "Go",
    "Node.js",
    "PostgreSQL",
    "Redis",
    "Tailwind CSS",
    "Docker",
    "AWS",
    "Supabase",
  ],
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const SocialLink = ({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="group flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors duration-200 text-sm"
  >
    <Icon
      size={15}
      className="group-hover:scale-110 transition-transform duration-200"
    />
    <span className="hidden sm:inline">{label}</span>
  </a>
);

const Tag = ({ text }: { text: string }) => (
  <span className="inline-block text-[10px] font-mono tracking-wide uppercase px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/60">
    {text}
  </span>
);

const StatusBadge = ({ status }: { status: string }) => (
  <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
    {status}
  </span>
);

export function Template1({ user, profile }: { user: any; profile: any }) {
  const [activeTab, setActiveTab] = useState<"projects" | "blogs" | "stack">(
    "projects",
  );

  return (
    <main className="relative min-h-screen bg-[#09090b] text-white font-(family-name:--font-geist-sans,ui-sans-serif) z-0">
      <div className="absolute top-0 z-[-1] h-full w-full bg-[#09090b] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pointer-events-none" />

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-5 py-16 sm:py-24">
        <section className="mb-16">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden ring-1 ring-white/10 bg-zinc-900">
                <img
                  src={profile?.avatar || DATA.avatar}
                  alt={profile?.name || DATA.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#0a0a0a]" />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <SocialLink
                href={profile?.github || DATA.links.github}
                icon={Github}
                label="GitHub"
              />
              <SocialLink
                href={profile?.twitter || DATA.links.twitter}
                icon={Twitter}
                label="Twitter"
              />
              <SocialLink
                href={profile?.linkedin || DATA.links.linkedin}
                icon={Linkedin}
                label="LinkedIn"
              />
              <SocialLink
                href={DATA.links.website}
                icon={Globe}
                label="Website"
              />
            </div>
          </div>

          <div className="space-y-2 mb-5">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              {user && user?.name}{" "}
              <span className="text-indigo-400">| {DATA.role}</span>
            </h1>
            {/* <p className="text-zinc-500 text-sm font-mono">
              {profile?.username || DATA.handle}
            </p> */}
            <p className="text-zinc-300 text-sm leading-relaxed max-w-md">
              {profile && profile?.bio}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={profile?.email || DATA.links.email}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-sm font-medium hover:bg-zinc-100 transition-colors duration-200"
            >
              <Mail size={14} />
              Email me
            </a>
            <a
              href={profile?.twitter || DATA.links.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700/60 text-sm font-medium hover:border-zinc-500 hover:bg-zinc-800 transition-all duration-200"
            >
              <Twitter size={14} />
              Twitter DM
            </a>
          </div>
        </section>

        <div className="w-full h-px bg-linear-to-r from-transparent via-zinc-700/50 to-transparent mb-10" />

        <div className="flex items-center gap-1 mb-8 bg-zinc-900/60 border border-zinc-800 rounded-xl p-1 w-fit">
          {(
            [
              { key: "projects", icon: Layers, label: "Projects" },
              { key: "blogs", icon: FileText, label: "Blogs" },
              { key: "stack", icon: Code2, label: "Stack" },
            ] as const
          ).map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === key
                  ? "bg-white text-black shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {activeTab === "projects" && (
          <section className="space-y-3">
            {DATA.projects.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm group-hover:text-indigo-300 transition-colors duration-200">
                        {p.name}
                      </h3>
                      <ArrowUpRight
                        size={13}
                        className="text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                      />
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed mb-3">
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <Tag key={t} text={t} />
                  ))}
                </div>
              </a>
            ))}
          </section>
        )}

        {activeTab === "blogs" && (
          <section className="space-y-2">
            {DATA.blogs.map((b) => (
              <a
                key={b.title}
                href={b.url}
                className="group flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 transition-all duration-200"
              >
                <div className="space-y-1.5 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors duration-200 truncate">
                    {b.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-zinc-600 text-xs font-mono">
                      {b.date}
                    </span>
                    {b.tags.map((t) => (
                      <Tag key={t} text={t} />
                    ))}
                  </div>
                </div>
                <ChevronRight
                  size={15}
                  className="shrink-0 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all duration-200"
                />
              </a>
            ))}
          </section>
        )}

        {activeTab === "stack" && (
          <section>
            <p className="text-zinc-500 text-sm mb-5">
              the tech arsenal behind my builds ⚡
            </p>
            <div className="flex flex-wrap gap-2">
              {DATA.stack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm hover:border-indigo-500/50 hover:text-white hover:bg-zinc-800 transition-all duration-200 cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        )}

        <footer className="mt-20 pt-8 border-t border-zinc-800/60 flex items-center justify-between">
          <p className="text-zinc-600 text-xs font-mono">
            built with <span className="text-indigo-400">lazyfolio</span>
          </p>
          <a
            href={profile?.github || DATA.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-zinc-600 hover:text-zinc-300 text-xs transition-colors duration-200"
          >
            <ExternalLink size={11} />
            source
          </a>
        </footer>
      </div>
    </main>
  );
}
