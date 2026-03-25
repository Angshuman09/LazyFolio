"use client";

import { useState } from "react";
import {
  Github,
  Twitter,
  Mail,
  Linkedin,
  Globe,
  MapPin,
  ExternalLink,
  ArrowUpRight,
  Youtube,
  Calendar,
  Award,
  BookOpen,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Star,
  Code2,
} from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const DATA = {
  name: "Alex Rivers",
  role: "Design Engineer",
  pronouns: "he/him",
  location: "San Francisco, CA",
  bio: [
    "**Design Engineer** with 5+ years of experience, obsessed with pixel-perfect execution and small details that make big differences.",
    "Skilled in **Next.js**, **React**, **TypeScript**, and modern frontend technologies — building polished, high-quality web apps.",
    "Passionate about bridging the gap between design and engineering, shipping side projects that people actually love.",
  ],
  avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=alex2026&backgroundColor=c0aede",
  email: "hi@alexrivers.dev",
  website: "alexrivers.dev",
  links: {
    github: "https://github.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com",
    email: "mailto:hi@alexrivers.dev",
  },
  currentRoles: [
    { title: "Design Engineer", company: "ShadcnCraft", href: "#experience" },
    { title: "Founder", company: "Quaric", href: "#experience" },
  ],
  stack: [
    { name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript" },
    { name: "React", icon: "https://cdn.simpleicons.org/react" },
    { name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/white" },
    { name: "Tailwind CSS", icon: "https://cdn.simpleicons.org/tailwindcss" },
    { name: "Node.js", icon: "https://cdn.simpleicons.org/nodedotjs" },
    { name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql" },
    { name: "Redis", icon: "https://cdn.simpleicons.org/redis" },
    { name: "Docker", icon: "https://cdn.simpleicons.org/docker" },
    { name: "Figma", icon: "https://cdn.simpleicons.org/figma" },
    { name: "Rust", icon: "https://cdn.simpleicons.org/rust/white" },
    { name: "Go", icon: "https://cdn.simpleicons.org/go" },
    { name: "AWS", icon: "https://cdn.simpleicons.org/amazonaws/white" },
  ],
  experience: [
    {
      id: "shadcncraft",
      company: "ShadcnCraft",
      companyUrl: "https://github.com",
      logo: "SC",
      logoColor: "bg-violet-600",
      isCurrent: true,
      roles: [
        {
          title: "Design Engineer",
          type: "Full-time",
          period: "01.2025 — Present",
          bullets: [
            "Build and maintain a React component registry used by 10k+ developers.",
            "Design and ship Pro application components from Figma to production.",
          ],
          tags: ["TypeScript", "Next.js", "Tailwind CSS", "Figma"],
        },
      ],
    },
    {
      id: "quaric",
      company: "Quaric",
      companyUrl: "https://github.com",
      logo: "Q",
      logoColor: "bg-emerald-600",
      isCurrent: true,
      roles: [
        {
          title: "Founder & Design Engineer",
          type: "Part-time",
          period: "03.2024 — Present",
          bullets: [
            "Founded and bootstrapped a design-engineering studio.",
            "Led product design, UX writing, and brand identity.",
          ],
          tags: ["Next.js", "Strapi", "Docker", "NGINX", "Figma"],
        },
      ],
    },
    {
      id: "simplamo",
      company: "Simplamo",
      companyUrl: "https://github.com",
      logo: "S",
      logoColor: "bg-blue-600",
      isCurrent: false,
      roles: [
        {
          title: "Senior Frontend Developer & UI Lead",
          type: "Full-time",
          period: "10.2022 — 01.2025",
          bullets: [
            "Led UI architecture for the flagship SaaS platform.",
            "Built cross-platform components for web and React Native.",
          ],
          tags: ["TypeScript", "Next.js", "React Native", "MobX", "Figma"],
        },
      ],
    },
    {
      id: "freelance",
      company: "Freelance",
      companyUrl: "#",
      logo: "F",
      logoColor: "bg-zinc-600",
      isCurrent: false,
      roles: [
        {
          title: "Full-stack Developer & Designer",
          type: "Part-time",
          period: "2019 — 2022",
          bullets: [
            "Shipped 20+ client projects across SaaS, e-commerce, and marketing.",
          ],
          tags: ["React", "Laravel", "WordPress", "Figma"],
        },
      ],
    },
  ],
  projects: [
    {
      name: "React Wheel Picker",
      period: "05.2025 — Present",
      description:
        "iOS-like wheel picker for React with smooth inertia scrolling and infinite loop support. Backed by ▲ Vercel OSS Program.",
      url: "https://github.com",
      tags: ["Open Source", "React", "TypeScript", "NPM"],
      logo: "RW",
      logoColor: "bg-sky-600",
    },
    {
      name: "CrabGit",
      period: "11.2024",
      description:
        "Git implementation from scratch in Rust with content-addressable storage — pure learning project.",
      url: "https://github.com",
      tags: ["Rust", "CLI", "Open Source"],
      logo: "CG",
      logoColor: "bg-orange-600",
    },
    {
      name: "TempMail",
      period: "08.2024 — Present",
      description:
        "Disposable email service — secure, no sign-up, self-destructing inboxes at scale.",
      url: "https://github.com",
      tags: ["Next.js", "PostgreSQL", "Redis"],
      logo: "TM",
      logoColor: "bg-teal-600",
    },
  ],
  testimonials: [
    {
      quote: "Awesome work. Love the components, especially the slide-to-unlock. Great job!",
      name: "Guillermo Rauch",
      handle: "@rauchg",
      role: "CEO @Vercel",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=rauchg&backgroundColor=ffd5dc",
      url: "https://twitter.com",
    },
    {
      quote: "You're doing amazing work. Keep shipping.",
      name: "shadcn",
      handle: "@shadcn",
      role: "Creator of shadcn/ui",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=shadcn&backgroundColor=d1f4d1",
      url: "https://twitter.com",
    },
  ],
  awards: [
    { title: "▲ Vercel OSS Program", prize: "Summer 2025 Cohort", year: "2025" },
    { title: "Design & Manufacturing Award", prize: "Bronze Medal", year: "2022" },
    { title: "Startup Competition", prize: "2nd Prize", year: "2019" },
  ],
  blogs: [
    { title: "React Wheel Picker joins Vercel OSS Program", date: "24.07.2025", url: "#" },
    { title: "Building Git from Scratch in Rust", date: "16.11.2024", url: "#" },
    { title: "Why I Switched from Prisma to Drizzle ORM", date: "03.04.2024", url: "#" },
    { title: "Pixel-Perfect Design in Next.js", date: "10.01.2024", url: "#" },
  ],
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
    <span className="flex-1 h-px bg-zinc-800" />
    {children}
    <span className="flex-1 h-px bg-zinc-800" />
  </h2>
);

const Tag = ({ text }: { text: string }) => (
  <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700/50">
    {text}
  </span>
);

function parseBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") ? (
      <strong key={i} className="text-white font-medium">
        {p.slice(2, -2)}
      </strong>
    ) : (
      p
    )
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar() {
  return (
    <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 lg:sticky lg:top-10 lg:self-start space-y-6">
      {/* Profile card */}
      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5">
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-zinc-700 mb-3">
            <img src={DATA.avatar} alt={DATA.name} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-lg font-semibold">{DATA.name}</h1>
          <p className="text-sm text-zinc-400">{DATA.role}</p>
          <p className="text-xs text-zinc-600 mt-0.5">{DATA.pronouns}</p>
        </div>

        {/* Overview */}
        <div className="space-y-2 text-sm text-zinc-400 mb-5">
          {DATA.currentRoles.map((r) => (
            <div key={r.company} className="flex items-center gap-2">
              <Briefcase size={13} className="text-zinc-600 flex-shrink-0" />
              <span>
                {r.title}{" "}
                <a href={r.href} className="text-zinc-300 hover:text-white transition-colors">
                  @{r.company}
                </a>
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <MapPin size={13} className="text-zinc-600 flex-shrink-0" />
            <span>{DATA.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={13} className="text-zinc-600 flex-shrink-0" />
            <a href={DATA.links.email} className="hover:text-white transition-colors truncate">
              {DATA.email}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Globe size={13} className="text-zinc-600 flex-shrink-0" />
            <a
              href={`https://${DATA.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              {DATA.website}
            </a>
          </div>
        </div>

        {/* Social links */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Github, label: "GitHub", href: DATA.links.github },
            { icon: Twitter, label: "Twitter", href: DATA.links.twitter },
            { icon: Linkedin, label: "LinkedIn", href: DATA.links.linkedin },
            { icon: Youtube, label: "YouTube", href: DATA.links.youtube },
            { icon: Mail, label: "Email", href: DATA.links.email },
            { icon: Globe, label: "Website", href: `https://${DATA.website}` },
          ].map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex flex-col items-center gap-1 p-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/40 hover:border-zinc-600 transition-all duration-200 group"
            >
              <Icon size={15} className="text-zinc-400 group-hover:text-white transition-colors" />
              <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300 transition-colors">
                {label}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Stack card */}
      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
          Stack
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {DATA.stack.map((tech) => (
            <div
              key={tech.name}
              title={tech.name}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-700/30 hover:border-zinc-600 transition-all duration-200 cursor-default group"
            >
              <img
                src={tech.icon}
                alt={tech.name}
                className="w-5 h-5 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="text-[9px] text-zinc-600 group-hover:text-zinc-400 transition-colors text-center leading-tight">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ─── EXPERIENCE ITEM ─────────────────────────────────────────────────────────
function ExperienceItem({ exp }: { exp: (typeof DATA.experience)[0] }) {
  return (
    <div id={`experience-${exp.id}`} className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`w-9 h-9 rounded-xl ${exp.logoColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
        >
          {exp.logo}
        </div>
        <div className="w-px flex-1 bg-zinc-800 mt-2" />
      </div>
      <div className="pb-8 flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <a
            href={exp.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-sm hover:text-indigo-300 transition-colors"
          >
            {exp.company}
          </a>
          {exp.isCurrent && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Current
            </span>
          )}
        </div>
        {exp.roles.map((role, i) => (
          <div key={i} className="mb-3">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-sm text-zinc-200">{role.title}</span>
              <span className="text-[10px] text-zinc-500 font-mono">·</span>
              <span className="text-[10px] text-zinc-500 font-mono">{role.type}</span>
            </div>
            <p className="text-[11px] font-mono text-zinc-600 mb-2">{role.period}</p>
            <ul className="space-y-1 mb-2">
              {role.bullets.map((b, j) => (
                <li key={j} className="text-sm text-zinc-400 flex gap-2">
                  <span className="text-zinc-600 flex-shrink-0 mt-0.5">—</span>
                  {b}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-1">
              {role.tags.map((t) => (
                <Tag key={t} text={t} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN CONTENT ─────────────────────────────────────────────────────────────
function MainContent() {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllAwards, setShowAllAwards] = useState(false);

  const visibleProjects = showAllProjects ? DATA.projects : DATA.projects.slice(0, 2);

  return (
    <div className="flex-1 min-w-0 space-y-12">

      {/* ABOUT */}
      <section>
        <SectionTitle>About</SectionTitle>
        <ul className="space-y-2">
          {DATA.bio.map((line, i) => (
            <li key={i} className="flex gap-2 text-sm text-zinc-400 leading-relaxed">
              <span className="text-indigo-500 flex-shrink-0 mt-1">▸</span>
              <span>{parseBold(line)}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* TESTIMONIALS */}
      <section>
        <SectionTitle>Testimonials</SectionTitle>
        <div className="grid sm:grid-cols-2 gap-3">
          {DATA.testimonials.map((t) => (
            <a
              key={t.name}
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all duration-200"
            >
              <p className="text-sm text-zinc-300 mb-4 leading-relaxed">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-2.5">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-7 h-7 rounded-full ring-1 ring-zinc-700"
                />
                <div>
                  <p className="text-xs font-medium text-zinc-200">{t.name}</p>
                  <p className="text-[10px] text-zinc-500">{t.role}</p>
                </div>
                <ArrowUpRight
                  size={13}
                  className="ml-auto text-zinc-700 group-hover:text-indigo-400 transition-colors"
                />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience">
        <SectionTitle>Experience</SectionTitle>
        <div>
          {DATA.experience.map((exp) => (
            <ExperienceItem key={exp.id} exp={exp} />
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section>
        <SectionTitle>Projects</SectionTitle>
        <div className="space-y-3">
          {visibleProjects.map((p) => (
            <div
              key={p.name}
              className="flex gap-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all duration-200 group"
            >
              <div
                className={`w-10 h-10 rounded-xl ${p.logoColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
              >
                {p.logo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-0.5">
                  <h3 className="font-semibold text-sm">{p.name}</h3>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 text-zinc-600 hover:text-indigo-400 transition-colors"
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
                <p className="text-[11px] font-mono text-zinc-600 mb-2">{p.period}</p>
                <p className="text-sm text-zinc-400 mb-2 leading-relaxed">{p.description}</p>
                <div className="flex flex-wrap gap-1">
                  {p.tags.map((t) => (
                    <Tag key={t} text={t} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        {DATA.projects.length > 2 && (
          <button
            onClick={() => setShowAllProjects((v) => !v)}
            className="mt-3 flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {showAllProjects ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showAllProjects ? "Show less" : `Show ${DATA.projects.length - 2} more`}
          </button>
        )}
      </section>

      {/* BLOG */}
      <section>
        <SectionTitle>Blog</SectionTitle>
        <div className="space-y-1">
          {DATA.blogs.map((b) => (
            <a
              key={b.title}
              href={b.url}
              className="group flex items-center justify-between px-3 py-3 rounded-xl hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all duration-200"
            >
              <div className="flex items-center gap-3 min-w-0">
                <BookOpen size={13} className="text-zinc-600 flex-shrink-0" />
                <span className="text-sm text-zinc-300 group-hover:text-white transition-colors truncate">
                  {b.title}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[11px] font-mono text-zinc-600">{b.date}</span>
                <ArrowUpRight
                  size={12}
                  className="text-zinc-700 group-hover:text-indigo-400 transition-colors"
                />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* AWARDS */}
      <section>
        <SectionTitle>Honors & Awards</SectionTitle>
        <div className="space-y-2">
          {(showAllAwards ? DATA.awards : DATA.awards.slice(0, 2)).map((a) => (
            <div
              key={a.title}
              className="flex items-center gap-3 px-3 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800/60"
            >
              <Award size={14} className="text-amber-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-200 truncate">{a.title}</p>
                <p className="text-xs text-zinc-500">{a.prize}</p>
              </div>
              <span className="text-[11px] font-mono text-zinc-600 flex-shrink-0">{a.year}</span>
            </div>
          ))}
        </div>
        {DATA.awards.length > 2 && (
          <button
            onClick={() => setShowAllAwards((v) => !v)}
            className="mt-3 flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {showAllAwards ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showAllAwards ? "Show less" : `Show ${DATA.awards.length - 2} more`}
          </button>
        )}
      </section>

      {/* FOOTER */}
      <footer className="pt-6 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-600">
        <p>
          built with{" "}
          <span className="text-indigo-400 font-medium">lazyfolio</span>
        </p>
        <div className="flex items-center gap-3">
          {[
            { icon: Github, href: DATA.links.github },
            { icon: Twitter, href: DATA.links.twitter },
            { icon: Linkedin, href: DATA.links.linkedin },
          ].map(({ icon: Icon, href }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-300 transition-colors"
            >
              <Icon size={13} />
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────
export function Template2() {
  return (
    <main className="min-h-screen bg-[#0c0c0c] text-white">
      {/* Dot grid bg */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Top glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-indigo-700/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start">
          <Sidebar />
          <MainContent />
        </div>
      </div>
    </main>
  );
}