"use client";

import { useState } from "react";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  FileText,
  ExternalLink,
  ArrowRight,
  MoveUpRight,
} from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const DATA = {
  quote: "You make your own luck if you stay at it long enough.",
  name: "Alex Rivers",
  tagline: "22 · engineer · developer · builder",
  bio: "I build from zero. Whether it's frontend, backend, full-stack applications, or AI-powered experiences, I work across the entire development lifecycle. From UI/UX to deployment to user feedback — I care less about technology debates and more about shipping things people love using.",
  calLink: "https://cal.com",
  avatar:
    "https://api.dicebear.com/9.x/notionists/svg?seed=alexrivers2026&backgroundColor=b6e3f4",

  experience: [
    {
      company: "Acme AI",
      companyUrl: "https://github.com",
      role: "Software Engineering Intern (AI)",
      period: "April 2025 – July 2025",
      bullets: [
        "Built a reminder system using Redis Sorted Sets and a background daemon for time-based task execution.",
        "Integrated Swiggy, Blinkit, and Google APIs into a WhatsApp bot with user-configurable preferences.",
        "Added Azure Blob Storage integration for file handling and WhatsApp message reaction tracking.",
        "Ensured message compliance by chunking outputs that exceeded 4096 characters.",
      ],
    },
    {
      company: "Freelance",
      companyUrl: "#",
      role: "Full Stack Developer",
      period: "2022 – Present",
      bullets: [
        "Shipped 15+ client projects spanning SaaS, marketing, and e-commerce verticals.",
        "Reduced average page load time by 40% through caching and CDN strategies.",
      ],
    },
  ],

  projects: [
    {
      name: "Arc Labs",
      description:
        "AI-powered job tools — resume builder, mock interviews, job tracker.",
      tags: ["Next.js", "TypeScript", "Redis", "Prisma"],
      github: "https://github.com",
      demo: "https://github.com",
      status: "Live",
    },
    {
      name: "ASCII Studio",
      description:
        "Turn videos into ASCII frame animations that play smoothly in sequence.",
      tags: ["Next.js", "TypeScript", "GSAP"],
      github: "https://github.com",
      demo: "https://github.com",
      status: "WIP",
    },
    {
      name: "Pixel Perfect",
      description:
        "A React component library for modern web apps. 160+ GitHub stars.",
      tags: ["Next.js", "Tailwind CSS", "Framer Motion"],
      github: "https://github.com",
      demo: "https://github.com",
      status: "Live",
    },
    {
      name: "Rune Icon",
      description:
        "All-in-one icon library for modern apps — clean, consistent, scalable.",
      tags: ["Next.js", "TypeScript", "Figma"],
      github: "https://github.com",
      demo: null,
      status: "WIP",
    },
    {
      name: "GoDis",
      description: "Redis implementation from scratch in Go.",
      tags: ["Go", "Networking"],
      github: "https://github.com",
      demo: null,
      status: "Open Source",
    },
    {
      name: "CrabGit",
      description:
        "Git built from scratch in Rust with content-addressable storage.",
      tags: ["Rust", "CLI"],
      github: "https://github.com",
      demo: null,
      status: "Open Source",
    },
  ],

  blogs: [
    {
      title:
        "Building a Text-to-Speech System for 25K Users (Without Melting a Server)",
      readTime: "11 min read",
      url: "#",
    },
    {
      title: "How I Choose Problems, Solve Them, and End Up Getting Traction",
      readTime: "4 min read",
      url: "#",
    },
    {
      title: "How to SSH Into Your Server the Right Way",
      readTime: "3 min read",
      url: "#",
    },
  ],

  stack: [
    { name: "JavaScript", icon: "https://cdn.simpleicons.org/javascript" },
    { name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript" },
    { name: "React", icon: "https://cdn.simpleicons.org/react" },
    { name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/white" },
    { name: "Node.js", icon: "https://cdn.simpleicons.org/nodedotjs" },
    { name: "Python", icon: "https://cdn.simpleicons.org/python" },
    { name: "Go", icon: "https://cdn.simpleicons.org/go" },
    { name: "Rust", icon: "https://cdn.simpleicons.org/rust/white" },
    { name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql" },
    { name: "Redis", icon: "https://cdn.simpleicons.org/redis" },
    { name: "MongoDB", icon: "https://cdn.simpleicons.org/mongodb" },
    { name: "Docker", icon: "https://cdn.simpleicons.org/docker" },
    { name: "AWS", icon: "https://cdn.simpleicons.org/amazonaws/white" },
    { name: "Tailwind", icon: "https://cdn.simpleicons.org/tailwindcss" },
    { name: "Figma", icon: "https://cdn.simpleicons.org/figma" },
    { name: "Git", icon: "https://cdn.simpleicons.org/git" },
  ],

  connect: [
    { label: "GitHub", icon: Github, href: "https://github.com" },
    { label: "Twitter", icon: Twitter, href: "https://twitter.com" },
    { label: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
    { label: "Mail", icon: Mail, href: "mailto:hi@alexrivers.dev" },
    { label: "Resume", icon: FileText, href: "#" },
  ],
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const Divider = () => <div className="w-full h-px bg-zinc-800/80 my-10" />;

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-sm font-semibold text-white mb-6 tracking-tight">
    {children}
  </h2>
);

const statusStyle: Record<string, string> = {
  Live: "text-emerald-400 bg-emerald-400/8 border-emerald-400/20",
  WIP: "text-amber-400 bg-amber-400/8 border-amber-400/20",
  "Open Source": "text-sky-400 bg-sky-400/8 border-sky-400/20",
};

// ─── STACK TICKER ─────────────────────────────────────────────────────────────
function StackTicker() {
  const items = [...DATA.stack, ...DATA.stack];
  return (
    <div className="relative overflow-hidden py-1">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 z-10 bg-linear-to-r from-[#0e0e0e] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 z-10 bg-linear-to-l from-[#0e0e0e] to-transparent" />
      <div
        className="flex gap-3 w-max"
        style={{ animation: "ticker 30s linear infinite" }}
      >
        {items.map((tech, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0"
          >
            <img
              src={tech.icon}
              alt={tech.name}
              className="w-3.5 h-3.5 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="text-[11px] text-zinc-500 whitespace-nowrap">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export function Template3() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? DATA.projects : DATA.projects.slice(0, 4);

  return (
    <>
      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      <main className="min-h-screen bg-[#0e0e0e] text-zinc-300 antialiased">
        <div className="max-w-[640px] mx-auto px-5 py-16 sm:py-20">
          {/* QUOTE */}
          <div className="mb-12 border-l-2 border-zinc-700 pl-4">
            <p className="text-xs text-zinc-500 italic leading-relaxed">
              "{DATA.quote}"
            </p>
          </div>

          {/* HERO */}
          <section className="mb-8">
            <h1 className="text-xl font-bold text-white mb-1 tracking-tight">
              {DATA.name}
            </h1>
            <p className="text-xs text-zinc-600 font-mono mb-5">
              {DATA.tagline}
            </p>
            <p className="text-sm text-zinc-400 leading-[1.8]">{DATA.bio}</p>
          </section>

          {/* QUICK LINKS */}
          <div className="flex flex-wrap gap-2 mb-4">
            {DATA.connect.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] text-zinc-500 border border-zinc-800 bg-zinc-900/60 hover:border-zinc-600 hover:text-zinc-200 transition-all duration-150"
              >
                <Icon size={11} />
                {label}
              </a>
            ))}
            <a
              href={DATA.calLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] text-zinc-300 border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 transition-all duration-150 ml-auto"
            >
              Book a call
              <ArrowRight size={10} />
            </a>
          </div>

          <Divider />

          {/* EXPERIENCE */}
          <section>
            <SectionHeading>Professional Experience</SectionHeading>
            <div className="space-y-8">
              {DATA.experience.map((exp) => (
                <div key={exp.company}>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <a
                        href={exp.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1 text-sm font-semibold text-white hover:text-zinc-300 transition-colors"
                      >
                        {exp.company}
                        <MoveUpRight
                          size={10}
                          className="text-zinc-600 group-hover:text-zinc-400 transition-colors"
                        />
                      </a>
                      <p className="text-[11px] text-zinc-600 mt-0.5">
                        {exp.role}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-600 shrink-0 pt-0.5">
                      {exp.period}
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {exp.bullets.map((b, i) => (
                      <li
                        key={i}
                        className="flex gap-2.5 text-[13px] text-zinc-400 leading-relaxed"
                      >
                        <span className="text-zinc-700 shrink-0 select-none mt-0.5">
                          •
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* PROJECTS */}
          <section>
            <SectionHeading>Proof of Work</SectionHeading>
            <div className="space-y-0.5">
              {visible.map((p) => (
                <div
                  key={p.name}
                  className="group flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800/60 transition-all duration-150"
                >
                  {/* Monogram */}
                  <div className="w-7 h-7 rounded-md bg-zinc-800 border border-zinc-700/60 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-zinc-500 select-none">
                      {p.name[0]}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-[13px] font-medium text-zinc-200">
                        {p.name}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${statusStyle[p.status] ?? ""}`}
                      >
                        {p.status}
                      </span>
                    </div>
                    <p className="text-[12px] text-zinc-500 leading-relaxed mb-1.5">
                      {p.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-600"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 mt-0.5">
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-600 hover:text-zinc-300 transition-colors"
                    >
                      <Github size={12} />
                    </a>
                    {p.demo && (
                      <a
                        href={p.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-600 hover:text-zinc-300 transition-colors"
                      >
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowAll((v) => !v)}
              className="mt-3 ml-3 text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              {showAll ? "Show less" : "View All →"}
            </button>
          </section>

          <Divider />

          {/* BLOGS */}
          <section>
            <SectionHeading>Thoughts</SectionHeading>
            <div className="space-y-0.5">
              {DATA.blogs.map((b) => (
                <a
                  key={b.title}
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between px-3 py-3 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800/60 transition-all duration-150"
                >
                  <p className="text-[13px] text-zinc-400 group-hover:text-zinc-200 transition-colors leading-snug pr-4">
                    {b.title}
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-zinc-700">
                      {b.readTime}
                    </span>
                    <ArrowRight
                      size={10}
                      className="text-zinc-700 group-hover:text-zinc-500 group-hover:translate-x-0.5 transition-all"
                    />
                  </div>
                </a>
              ))}
            </div>
            <a
              href="#"
              className="mt-3 ml-3 inline-block text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              View All →
            </a>
          </section>

          <Divider />

          {/* STACK */}
          <section>
            <SectionHeading>Stack I use</SectionHeading>
            <p className="text-[12px] text-zinc-600 mb-4 leading-relaxed">
              Technologies I work with to build products that solve real
              problems.
            </p>
            <StackTicker />
          </section>

          <Divider />

          {/* BOOK A CALL */}
          <section className="mb-2">
            <p className="text-[13px] text-zinc-500 mb-5 leading-relaxed">
              If you've read this far, you might be interested in what I do.
            </p>
            <a
              href={DATA.calLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all duration-200"
            >
              <img
                src={DATA.avatar}
                alt="avatar"
                className="w-6 h-6 rounded-full ring-1 ring-zinc-700"
              />
              <span className="text-[13px] text-zinc-400 group-hover:text-white transition-colors">
                Book a Free Call
              </span>
              <ArrowRight
                size={11}
                className="text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all"
              />
            </a>
          </section>

          <Divider />

          {/* CONNECT */}
          <section>
            <SectionHeading>Let's connect</SectionHeading>
            <p className="text-[12px] text-zinc-600 mb-4">
              Find me on these platforms
            </p>
            <div className="space-y-0.5">
              {DATA.connect.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800/60 transition-all duration-150"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      size={13}
                      className="text-zinc-600 group-hover:text-zinc-400 transition-colors"
                    />
                    <span className="text-[13px] text-zinc-500 group-hover:text-zinc-200 transition-colors">
                      {label}
                    </span>
                  </div>
                  <MoveUpRight
                    size={11}
                    className="text-zinc-700 group-hover:text-zinc-500 transition-colors"
                  />
                </a>
              ))}
            </div>
          </section>

          {/* FOOTER */}
          <div className="mt-14 pt-6 border-t border-zinc-800/60 flex items-center justify-between">
            <p className="text-[11px] text-zinc-700 font-mono">
              © {new Date().getFullYear()} {DATA.name}
            </p>
            <p className="text-[11px] text-zinc-800">
              built with <span className="text-zinc-600">lazyfolio</span>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
