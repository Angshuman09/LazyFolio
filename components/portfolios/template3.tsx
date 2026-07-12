"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  Github,
  ExternalLink,
  ArrowRight,
  MoveUpRight,
  Linkedin,
  Youtube,
  Mail,
  Globe,
  FileText,
  Code2,
  BookOpen,
  Instagram,
  Phone,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

// ─── TYPES ───────────────────────────────────────────────────────────────────
type DateLike = string | Date | null | undefined;

type ProfileLink = {
  id?: string;
  type?: string | null;
  label?: string | null;
  name?: string | null;
  url?: string | null;
  href?: string | null;
};

type ProfileExperience = {
  id?: string;
  companyName?: string | null;
  company?: string | null;
  role?: string | null;
  startdate?: DateLike;
  enddate?: DateLike;
  description?: string | null;
};

type ProfileProject = {
  id?: string;
  title?: string | null;
  name?: string | null;
  description?: string | null;
  githubLink?: string | null;
  projectLink?: string | null;
  github?: string | null;
  demo?: string | null;
  live?: boolean | null;
  techstack?: string[] | null;
  tags?: string[] | null;
  enddate?: DateLike;
  status?: string | null;
};

type ProfileBlog = {
  id?: string;
  title?: string | null;
  description?: string | null;
  blogLink?: string | null;
  url?: string | null;
  enddate?: DateLike;
  readTime?: string | null;
};

type ProfileData = {
  id?: string | null,
  name?: string | null;
  avatar?: string | null;
  banner?: string | null;
  quote?: string | null;
  tagline?: string | null;
  bio?: string | null;
  email?: string | null;
  resume?: string | null;
  bookAcall?: string | null;
  links?: ProfileLink[] | null;
  experiences?: ProfileExperience[] | null;
  projects?: ProfileProject[] | null;
  skills?: string[] | null;
  blogs?: ProfileBlog[] | null;
};

type UserData = {
  name?: string | null;
  image?: string | null;
};

type NormalizedLink = {
  id: string;
  label: string;
  href: string;
};

type PortfolioExperience = {
  id: string;
  company?: string;
  companyUrl?: string;
  role?: string;
  period?: string;
  bullets: string[];
};

type PortfolioProject = {
  id: string;
  name?: string;
  description?: string;
  tags: string[];
  github?: string;
  demo?: string;
  status?: string;
};

type PortfolioBlog = {
  id: string;
  title?: string;
  description?: string;
  readTime?: string;
  url?: string;
};

type StackItem = {
  name: string;
};

type KnownLinkMetadata = {
  type?: string;
  label: string;
  domains: readonly string[];
  labels: readonly string[];
};

const KNOWN_LINKS: readonly KnownLinkMetadata[] = [
  {
    type: "GITHUB",
    label: "GitHub",
    domains: ["github.com", "github.io"],
    labels: ["github"],
  },
  {
    type: "X",
    label: "X",
    domains: ["x.com", "twitter.com"],
    labels: ["x", "twitter"],
  },
  {
    type: "LINKEDIN",
    label: "LinkedIn",
    domains: ["linkedin.com", "lnkd.in"],
    labels: ["linkedin"],
  },
  {
    type: "INSTAGRAM",
    label: "Instagram",
    domains: ["instagram.com"],
    labels: ["instagram"],
  },
  {
    label: "YouTube",
    domains: ["youtube.com", "youtu.be"],
    labels: ["youtube"],
  },
  {
    label: "Medium",
    domains: ["medium.com"],
    labels: ["medium"],
  },
  {
    label: "Dev.to",
    domains: ["dev.to"],
    labels: ["dev.to", "dev"],
  },
  {
    label: "LeetCode",
    domains: ["leetcode.com"],
    labels: ["leetcode"],
  },
  {
    label: "Dribbble",
    domains: ["dribbble.com"],
    labels: ["dribbble"],
  },
  {
    label: "Behance",
    domains: ["behance.net"],
    labels: ["behance"],
  },
];

// ─── ICON RESOLVER ────────────────────────────────────────────────────────────
function getLinkIcon(label: string, href: string): ReactNode {
  const domain = getDomain(href);
  const lowerLabel = label.toLowerCase();
  const lowerDomain = domain.toLowerCase();
  const iconProps = { size: 14, strokeWidth: 1.75 };

  if (lowerDomain.includes("github") || lowerLabel === "github")
    return <Github {...iconProps} />;
  if (lowerDomain.includes("x.com") || lowerDomain.includes("twitter") || lowerLabel === "x" || lowerLabel === "twitter")
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  if (lowerDomain.includes("linkedin") || lowerLabel === "linkedin")
    return <Linkedin {...iconProps} />;
  if (lowerDomain.includes("instagram") || lowerLabel === "instagram")
    return <Instagram {...iconProps} />;
  if (lowerDomain.includes("youtube") || lowerDomain.includes("youtu.be") || lowerLabel === "youtube")
    return <Youtube {...iconProps} />;
  if (lowerDomain.includes("medium") || lowerLabel === "medium")
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
      </svg>
    );
  if (lowerDomain.includes("leetcode") || lowerLabel === "leetcode")
    return <Code2 {...iconProps} />;
  if (lowerDomain.includes("dev.to") || lowerLabel === "dev.to" || lowerLabel === "dev")
    return <BookOpen {...iconProps} />;
  if (href.startsWith("mailto:") || lowerLabel === "mail" || lowerLabel === "email")
    return <Mail {...iconProps} />;
  if (href.startsWith("tel:") || lowerLabel === "phone")
    return <Phone {...iconProps} />;
  if (lowerLabel === "resume" || lowerLabel === "cv")
    return <FileText {...iconProps} />;
  return <Globe {...iconProps} />;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const Divider = () => (
  <div className="w-full h-px bg-slate-100 my-12" />
);

const SectionHeading = ({ children }: { children: ReactNode }) => (
  <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-6">
    {children}
  </h2>
);

// Status: muted, text-only feel — no colorful backgrounds
const statusColors: Record<string, string> = {
  Live:          "text-slate-500 bg-slate-100 border-slate-200",
  WIP:           "text-slate-500 bg-slate-100 border-slate-200",
  "Open Source": "text-slate-500 bg-slate-100 border-slate-200",
};
const fallbackStatusStyle = "text-slate-400 bg-slate-50 border-slate-150";

function textValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
function cleanUrl(value?: string | null) {
  const url = textValue(value);
  if (!url) return "";
  if (url.startsWith("#") || url.startsWith("/") || /^(https?:|mailto:|tel:)/i.test(url)) return url;
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(url)) return `mailto:${url}`;
  return `https://${url}`;
}
function shouldOpenInNewTab(href?: string) {
  return !!href && /^https?:\/\//i.test(href);
}
function getDomain(href?: string) {
  if (!href) return "";
  if (href.startsWith("mailto:")) return "email";
  try { return new URL(href).hostname.replace(/^www\./, ""); } catch { return ""; }
}
function domainToLabel(domain: string) {
  const firstPart = domain.replace(/^www\./, "").split(".")[0] || "Link";
  return firstPart.split(/[-_]/).filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
}
function findKnownLink(type?: string, label?: string, href?: string) {
  const normalizedType = textValue(type).toUpperCase();
  const normalizedLabel = textValue(label).toLowerCase();
  const domain = getDomain(href);
  return KNOWN_LINKS.find((item) => {
    return item.type === normalizedType ||
      item.labels.some((l) => normalizedLabel.includes(l)) ||
      item.domains.some((d) => domain === d || domain.endsWith(`.${d}`));
  });
}
function normalizeLink(link: ProfileLink, index: number): NormalizedLink | null {
  const href = cleanUrl(link.url || link.href);
  if (!href) return null;
  const explicitLabel = textValue(link.label || link.name);
  const known = findKnownLink(link.type || undefined, explicitLabel, href);
  const domain = getDomain(href);
  const isEmail = href.startsWith("mailto:");
  const label = explicitLabel || known?.label || (isEmail ? "Email" : domain ? domainToLabel(domain) : "Link");
  return { id: link.id || `${label}-${index}`, label, href };
}
function normalizeLinks(links?: ProfileLink[] | null) {
  return (links || []).map((l, i) => normalizeLink(l, i)).filter(Boolean) as NormalizedLink[];
}
function addProfileContactLinks(links: NormalizedLink[], profile?: ProfileData | null) {
  const out = [...links];
  const email = textValue(profile?.email);
  const resume = cleanUrl(profile?.resume);
  if (email && !out.some((l) => l.href.startsWith("mailto:") || l.label === "Email"))
    out.unshift({ id: "profile-email", label: "Email", href: `mailto:${email}` });
  if (resume && !out.some((l) => l.href === resume))
    out.push({ id: "profile-resume", label: "Resume", href: resume });
  return out;
}
function formatDate(value: DateLike) {
  if (!value) return "";
  const parsed = value instanceof Date ? value : new Date(value as string);
  if (!Number.isNaN(parsed.getTime()))
    return parsed.toLocaleDateString("en", { month: "short", year: "numeric" });
  return textValue(value);
}
function formatDateRange(startdate: DateLike, enddate: DateLike) {
  const start = formatDate(startdate);
  if (!start && !enddate) return "";
  const end = enddate ? formatDate(enddate) : "Present";
  if (start && end) return `${start} – ${end}`;
  return start || end;
}
function splitDescription(description?: string | null) {
  return textValue(description).split(/\n|•/)
    .map((item) => item.replace(/^[-–]\s*/, "").trim()).filter(Boolean);
}
function normalizeExperiences(experiences?: ProfileExperience[] | null): PortfolioExperience[] {
  return (experiences || []).map((exp, i) => {
    const company = textValue(exp.companyName || exp.company);
    const role = textValue(exp.role);
    const bullets = splitDescription(exp.description);
    if (!company && !role && bullets.length === 0) return null;
    return { id: exp.id || `${company || role}-${i}`, company: company || undefined, role: role || undefined, period: formatDateRange(exp.startdate, exp.enddate), bullets };
  }).filter(Boolean) as PortfolioExperience[];
}
function normalizeProjects(projects?: ProfileProject[] | null): PortfolioProject[] {
  return (projects || []).map((p, i) => {
    const name = textValue(p.title || p.name);
    const description = textValue(p.description);
    const github = cleanUrl(p.githubLink || p.github);
    const demo = cleanUrl(p.projectLink || p.demo);
    const tags = (p.techstack || p.tags || []).map(textValue).filter(Boolean);
    if (!name && !description && !github && !demo && tags.length === 0) return null;
    const status = textValue(p.status) || (p.live || demo ? "Live" : github ? "Open Source" : "");
    return { id: p.id || `${name || "project"}-${i}`, name: name || undefined, description: description || undefined, tags, github, demo, status: status || undefined };
  }).filter(Boolean) as PortfolioProject[];
}
function normalizeBlogs(blogs?: ProfileBlog[] | null): PortfolioBlog[] {
  return (blogs || []).map((b, i) => {
    const title = textValue(b.title);
    const description = textValue(b.description);
    const url = cleanUrl(b.blogLink || b.url);
    if (!title && !description && !url) return null;
    return { id: b.id || `${title || "blog"}-${i}`, title: title || undefined, description: description || undefined, readTime: textValue(b.readTime) || formatDate(b.enddate) || undefined, url };
  }).filter(Boolean) as PortfolioBlog[];
}
function normalizeStack(skills?: string[] | null): StackItem[] {
  return (skills || []).map(textValue).filter(Boolean).map((s) => ({ name: s }));
}
function getBookCallLink(profile?: ProfileData) {
  return cleanUrl(profile?.bookAcall);
}

// ─── STACK TICKER ─────────────────────────────────────────────────────────────
function StackTicker({ stack }: { stack: StackItem[] }) {
  const items = [...stack, ...stack];
  return (
    <div className="relative overflow-hidden py-2 bg-white rounded-xl border border-slate-100">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-white to-transparent" />
      <div className="flex gap-2 w-max" style={{ animation: "ticker 40s linear infinite" }}>
        {items.map((tech, i) => (
          <div
            key={`${tech.name}-${i}`}
            className="flex items-center px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 shrink-0"
          >
            <span className="text-[10.5px] text-slate-500 font-medium tracking-wider uppercase">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="pb-5">
      <div className="flex items-center justify-center gap-2 select-none">
        <span className="text-[10px] font-medium text-slate-300  tracking-wide">Built with</span>
        <Link
          href={`http:://${process.env.NEXT_PUBLIC_SITE_URL}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wide text-slate-400 hover:text-slate-700 transition-colors duration-200"
        >
          Lazyfolio
        </Link>
      </div>
    </footer>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export function Template3({
  user,
  profile,
}: {
  user: UserData;
  profile: ProfileData;
}) {
  const [showAll, setShowAll] = useState(false);
  const name = textValue(profile?.name) || textValue(user?.name);
  const quote = textValue(profile?.quote);
  const tagline = textValue(profile?.tagline);
  const bio = textValue(profile?.bio);
  const avatar = cleanUrl(profile?.avatar) || cleanUrl(user?.image);
  const banner = cleanUrl(profile?.banner);
  const links = normalizeLinks(profile?.links);
  const contactLinks = addProfileContactLinks(links, profile);
  const experiences = normalizeExperiences(profile?.experiences);
  const projects = normalizeProjects(profile?.projects);
  const blogs = normalizeBlogs(profile?.blogs);
  const stack = normalizeStack(profile?.skills);
  const bookCallLink = getBookCallLink(profile);
  const visibleProjects = showAll ? projects : projects.slice(0, 4);
  const hasHeroMedia = Boolean(banner || avatar);
  const hasQuickActions = links.length > 0 || Boolean(bookCallLink);

  return (
    <>
      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <main className="relative min-h-screen bg-white text-slate-700 antialiased selection:bg-slate-100 selection:text-slate-900">
        <div className="max-w-[680px] mx-auto px-6 py-10 sm:py-15">

          {/* ── HERO ─────────────────────────────────────────────────── */}
          <section className="mb-10">
            {hasHeroMedia && (
              <div className="relative mb-2">
                {banner && (
                  <div className="relative h-36 sm:h-52 rounded-xl overflow-hidden">
                    <Image
                      src={banner}
                      alt={name ? `${name} banner` : "Portfolio banner"}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    {/* subtle dark overlay for readability */}
                    <div className="absolute inset-0 bg-black/5" />
                  </div>
                )}
                {avatar && (
                  <div
                    className={
                      banner
                        ? "absolute left-5 -bottom-9 ring-1 ring-white border border-[#bfbfbf] bg-white rounded-xl overflow-hidden shadow-sm"
                        : "mb-6 rounded-xl overflow-hidden w-[68px] h-[68px]"
                    }
                  >
                    <Image
                      src={avatar}
                      alt={name || "Profile avatar"}
                      width={banner ? 80 : 68}
                      height={banner ? 80 : 68}
                      unoptimized
                      className="object-cover aspect-square"
                    />
                  </div>
                )}
              </div>
            )}

            <div className={banner ? "pt-12" : "pt-0"}>
              {name && (
                <h1 className="text-[28px] sm:text-[32px] font-bold text-slate-900 tracking-[-0.025em] leading-[1.15] mb-2">
                  {name}
                </h1>
              )}
              {tagline && (
                <p className="text-[12px] font-medium text-slate-400 tracking-wide mb-4">
                  {tagline}
                </p>
              )}
              {bio && (
                <p className="text-[14px] text-slate-500 leading-[1.8] max-w-lg">
                  {bio}
                </p>
              )}
            </div>
          </section>

          {/* ── QUICK LINKS ──────────────────────────────────────────── */}
          {hasQuickActions && (
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {links.map((link) => (
                <Tooltip key={link.id}>
                  <TooltipTrigger asChild>
                    <Link
                      href={link.href}
                      target={shouldOpenInNewTab(link.href) ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      title={link.label}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 border border-slate-200 bg-white hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all duration-150"
                    >
                      {getLinkIcon(link.label, link.href)}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{link.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
              {bookCallLink && (
                <Link
                  href={bookCallLink}
                  target={shouldOpenInNewTab(bookCallLink) ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[10px] text-[11px] font-semibold tracking-wide text-white bg-slate-900 hover:bg-slate-800 transition-colors duration-150 ml-auto"
                >
                  Book a call
                  <ArrowRight size={10} className="stroke-[2.5]" />
                </Link>
              )}
            </div>
          )}

          {/* ── EXPERIENCES ──────────────────────────────────────────── */}
          {experiences.length > 0 && (
            <>
              <Divider />
              <section>
                <SectionHeading>Experience</SectionHeading>
                <div className="space-y-9">
                  {experiences.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 mb-3">
                        <div>
                          {exp.company &&
                            (exp.companyUrl && exp.companyUrl !== "#" ? (
                              <Link
                                href={exp.companyUrl}
                                target={shouldOpenInNewTab(exp.companyUrl) ? "_blank" : undefined}
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[14px] font-semibold text-slate-900 hover:text-slate-600 transition-colors"
                              >
                                {exp.company}
                                <MoveUpRight size={11} className="text-slate-300" />
                              </Link>
                            ) : (
                              <span className="text-[14px] font-semibold text-slate-900">
                                {exp.company}
                              </span>
                            ))}
                          {exp.role && (
                            <p className="text-[12.5px] text-slate-400 mt-0.5">
                              {exp.role}
                            </p>
                          )}
                        </div>
                        {exp.period && (
                          <span className="text-[11px] text-slate-400 font-mono shrink-0">
                            {exp.period}
                          </span>
                        )}
                      </div>

                      {exp.bullets.length > 0 && (
                        <ul className="space-y-2 ml-0">
                          {exp.bullets.map((bullet, i) => (
                            <li
                              key={`${exp.id}-${i}`}
                              className="flex gap-2.5 text-[13px] text-slate-500 leading-relaxed"
                            >
                              <span className="text-slate-300 shrink-0 select-none mt-[4px] text-[10px]">—</span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* ── PROJECTS ─────────────────────────────────────────────── */}
          {projects.length > 0 && (
            <>
              <Divider />
              <section>
                <SectionHeading>Projects</SectionHeading>
                <div className="grid gap-px bg-slate-100 rounded-xl overflow-hidden border border-slate-100">
                  {visibleProjects.map((project) => (
                    <div
                      key={project.id}
                      className="group flex items-start gap-4 p-4 bg-white hover:bg-slate-50 transition-colors duration-150"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[11px] font-bold text-slate-400 select-none uppercase">
                          {project.name?.[0] ?? "·"}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          {project.name && (
                            <span className="text-[13.5px] font-semibold text-slate-900">
                              {project.name}
                            </span>
                          )}
                          {project.status && (
                            <span
                              className={`text-[9px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded border ${statusColors[project.status] ?? fallbackStatusStyle}`}
                            >
                              {project.status}
                            </span>
                          )}
                        </div>
                        {project.description && (
                          <p className="text-[12.5px] text-slate-400 leading-relaxed mb-2">
                            {project.description}
                          </p>
                        )}
                        {project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-500"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {(project.github || project.demo) && (
                        <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-start pt-0.5">
                          {project.github && (
                            <Link
                              href={project.github}
                              target={shouldOpenInNewTab(project.github) ? "_blank" : undefined}
                              rel="noopener noreferrer"
                              className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                              aria-label={project.name ? `${project.name} source` : "Project source"}
                            >
                              <Github size={12} />
                            </Link>
                          )}
                          {project.demo && (
                            <Link
                              href={project.demo}
                              target={shouldOpenInNewTab(project.demo) ? "_blank" : undefined}
                              rel="noopener noreferrer"
                              className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                              aria-label={project.name ? `${project.name} live` : "Project live"}
                            >
                              <ExternalLink size={12} />
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {projects.length > 4 && (
                  <button
                    onClick={() => setShowAll((v) => !v)}
                    className="mt-4 text-[11px] font-medium text-slate-400 hover:text-slate-700 transition-colors cursor-pointer inline-flex items-center gap-1 tracking-wide"
                  >
                    {showAll ? "Show less" : `View all ${projects.length} projects →`}
                  </button>
                )}
              </section>
            </>
          )}

          {/* ── BLOGS ────────────────────────────────────────────────── */}
          {blogs.length > 0 && (
            <>
              <Divider />
              <section>
                <SectionHeading>Writing</SectionHeading>
                <div className="space-y-px">
                  {blogs.map((blog) => {
                    const inner = (
                      <>
                        <div className="min-w-0 flex-1">
                          {blog.title && (
                            <p className="text-[13.5px] font-medium text-slate-800 leading-snug group-hover:text-slate-900 transition-colors">
                              {blog.title}
                            </p>
                          )}
                          {blog.description && (
                            <p className="text-[12px] text-slate-400 leading-relaxed mt-0.5 line-clamp-2">
                              {blog.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0 pl-4">
                          {blog.readTime && (
                            <span className="text-[10.5px] font-mono text-slate-300">
                              {blog.readTime}
                            </span>
                          )}
                          {blog.url && (
                            <ArrowRight size={11} className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all duration-150" />
                          )}
                        </div>
                      </>
                    );

                    return blog.url ? (
                      <Link
                        key={blog.id}
                        href={blog.url}
                        target={shouldOpenInNewTab(blog.url) ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between py-3.5 border-b border-slate-100 last:border-b-0"
                      >
                        {inner}
                      </Link>
                    ) : (
                      <div key={blog.id} className="group flex items-center justify-between py-3.5 border-b border-slate-100 last:border-b-0">
                        {inner}
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          )}

          {/* ── STACK ────────────────────────────────────────────────── */}
          {stack.length > 0 && (
            <>
              <Divider />
              <section>
                <SectionHeading>Stack</SectionHeading>
                {stack.length <= 8 ? (
                  <div className="relative overflow-hidden py-2 bg-white rounded-xl border border-slate-100 flex justify-start flex-wrap gap-2 px-3">
                    {stack.map((tech, i) => (
                      <div
                        key={`${tech.name}-${i}`}
                        className="flex items-center px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 shrink-0"
                      >
                        <span className="text-[10.5px] text-slate-500 font-medium tracking-wider uppercase">
                          {tech.name}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <StackTicker stack={stack} />
                )}
              </section>
            </>
          )}

          {/* ── FOOTER CALL TO ACTION ─────────────────────────────────── */}
          {bookCallLink && (
            <>
              <Divider />
              <section>
                <Link
                  href={bookCallLink}
                  target={shouldOpenInNewTab(bookCallLink) ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all duration-150"
                >
                  {avatar && (
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={avatar}
                        alt={name || "Profile avatar"}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-slate-900">
                      Let's build together
                    </p>
                    <p className="text-[12px] text-slate-400 mt-0.5">
                      Book a slot on my calendar to talk.
                    </p>
                  </div>
                  <ArrowRight size={13} className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all duration-150 shrink-0" />
                </Link>
              </section>
            </>
          )}

          {/* ── QUOTE ─────────────────────────────────────────────────── */}
          {quote && (
            <div className="mt-16 flex flex-col items-start gap-3">
              <p className="text-[14px] md:whitespace-nowrap text-slate-400 italic leading-relaxed max-w-sm border-l-2 border-slate-100 pl-4">
                {quote}
              </p>
            </div>
          )}
        </div>
        <Footer/>
      </main>
    </>
  );
}