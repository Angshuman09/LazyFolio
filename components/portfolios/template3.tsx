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

  const iconProps = { size: 15 };

  if (lowerDomain.includes("github") || lowerLabel === "github") {
    return <Github {...iconProps} />;
  }

  if (
    lowerDomain.includes("x.com") ||
    lowerDomain.includes("twitter") ||
    lowerLabel === "x" ||
    lowerLabel === "twitter"
  ) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }

  if (lowerDomain.includes("linkedin") || lowerLabel === "linkedin") {
    return <Linkedin {...iconProps} />;
  }

  if (lowerDomain.includes("instagram") || lowerLabel === "instagram") {
    return <Instagram {...iconProps} />;
  }

  if (
    lowerDomain.includes("youtube") ||
    lowerDomain.includes("youtu.be") ||
    lowerLabel === "youtube"
  ) {
    return <Youtube {...iconProps} />;
  }

  if (lowerDomain.includes("medium") || lowerLabel === "medium") {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
      </svg>
    );
  }

  if (lowerDomain.includes("leetcode") || lowerLabel === "leetcode") {
    return <Code2 {...iconProps} />;
  }

  if (
    lowerDomain.includes("dev.to") ||
    lowerLabel === "dev.to" ||
    lowerLabel === "dev"
  ) {
    return <BookOpen {...iconProps} />;
  }

  if (
    href.startsWith("mailto:") ||
    lowerLabel === "mail" ||
    lowerLabel === "email"
  ) {
    return <Mail {...iconProps} />;
  }

  if (href.startsWith("tel:") || lowerLabel === "phone") {
    return <Phone {...iconProps} />;
  }

  if (lowerLabel === "resume" || lowerLabel === "cv") {
    return <FileText {...iconProps} />;
  }

  return <Globe {...iconProps} />;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const Divider = () => <div className="w-full h-px bg-slate-200/60 my-12" />;

const SectionHeading = ({ children }: { children: ReactNode }) => (
  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
    {children}
  </h2>
);

const statusStyle: Record<string, string> = {
  Live: "text-emerald-700 bg-emerald-50 border-emerald-200/60",
  WIP: "text-amber-700 bg-amber-50 border-amber-200/60",
  "Open Source": "text-sky-700 bg-sky-50 border-sky-200/60",
};

const fallbackStatusStyle =
  "text-slate-600 bg-slate-50 border-slate-200";

function textValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanUrl(value?: string | null) {
  const url = textValue(value);
  if (!url) return "";
  if (
    url.startsWith("#") ||
    url.startsWith("/") ||
    /^(https?:|mailto:|tel:)/i.test(url)
  ) {
    return url;
  }
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(url)) {
    return `mailto:${url}`;
  }
  return `https://${url}`;
}

function shouldOpenInNewTab(href?: string) {
  return !!href && /^https?:\/\//i.test(href);
}

function getDomain(href?: string) {
  if (!href) return "";
  if (href.startsWith("mailto:")) return "email";
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function domainToLabel(domain: string) {
  const firstPart = domain.replace(/^www\./, "").split(".")[0] || "Link";
  return firstPart
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function findKnownLink(type?: string, label?: string, href?: string) {
  const normalizedType = textValue(type).toUpperCase();
  const normalizedLabel = textValue(label).toLowerCase();
  const domain = getDomain(href);

  return KNOWN_LINKS.find((item) => {
    const typeMatches = item.type === normalizedType;
    const labelMatches = item.labels.some((itemLabel) =>
      normalizedLabel.includes(itemLabel),
    );
    const domainMatches = item.domains.some(
      (itemDomain) =>
        domain === itemDomain || domain.endsWith(`.${itemDomain}`),
    );
    return typeMatches || labelMatches || domainMatches;
  });
}

function normalizeLink(
  link: ProfileLink,
  index: number,
): NormalizedLink | null {
  const href = cleanUrl(link.url || link.href);
  if (!href) return null;

  const explicitLabel = textValue(link.label || link.name);
  const known = findKnownLink(link.type || undefined, explicitLabel, href);
  const domain = getDomain(href);
  const isEmail = href.startsWith("mailto:");
  const label =
    explicitLabel ||
    known?.label ||
    (isEmail ? "Email" : domain ? domainToLabel(domain) : "Link");

  return { id: link.id || `${label}-${index}`, label, href };
}

function normalizeLinks(links?: ProfileLink[] | null) {
  return (links || [])
    .map((link, index) => normalizeLink(link, index))
    .filter(Boolean) as NormalizedLink[];
}

function addProfileContactLinks(
  links: NormalizedLink[],
  profile?: ProfileData | null,
) {
  const contactLinks = [...links];
  const email = textValue(profile?.email);
  const resume = cleanUrl(profile?.resume);

  if (
    email &&
    !contactLinks.some(
      (link) => link.href.startsWith("mailto:") || link.label === "Email",
    )
  ) {
    contactLinks.unshift({
      id: "profile-email",
      label: "Email",
      href: `mailto:${email}`,
    });
  }

  if (resume && !contactLinks.some((link) => link.href === resume)) {
    contactLinks.push({ id: "profile-resume", label: "Resume", href: resume });
  }

  return contactLinks;
}

function formatDate(value: DateLike) {
  if (!value) return "";
  if (value instanceof Date || typeof value === "string") {
    const parsed = value instanceof Date ? value : new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString("en", {
        month: "short",
        year: "numeric",
      });
    }
  }
  return textValue(value);
}

function formatDateRange(startdate: DateLike, enddate: DateLike) {
  const start = formatDate(startdate);
  if (!start && !enddate) return "";
  const end = enddate ? formatDate(enddate) : "Present";
  if (start && end) return `${start} - ${end}`;
  return start || end;
}

function splitDescription(description?: string | null) {
  return textValue(description)
    .split(/\n|•/)
    .map((item) => item.replace(/^[-–]\s*/, "").trim())
    .filter(Boolean);
}

function normalizeExperiences(
  experiences?: ProfileExperience[] | null,
): PortfolioExperience[] {
  return (experiences || [])
    .map((experience, index) => {
      const company = textValue(experience.companyName || experience.company);
      const role = textValue(experience.role);
      const bullets = splitDescription(experience.description);
      if (!company && !role && bullets.length === 0) return null;
      return {
        id: experience.id || `${company || role}-${index}`,
        company: company || undefined,
        role: role || undefined,
        period: formatDateRange(experience.startdate, experience.enddate),
        bullets,
      };
    })
    .filter(Boolean) as PortfolioExperience[];
}

function normalizeProjects(
  projects?: ProfileProject[] | null,
): PortfolioProject[] {
  return (projects || [])
    .map((project, index) => {
      const name = textValue(project.title || project.name);
      const description = textValue(project.description);
      const github = cleanUrl(project.githubLink || project.github);
      const demo = cleanUrl(project.projectLink || project.demo);
      const tags = (project.techstack || project.tags || [])
        .map(textValue)
        .filter(Boolean);
      if (!name && !description && !github && !demo && tags.length === 0)
        return null;
      const status =
        textValue(project.status) ||
        (project.live || demo ? "Live" : github ? "Open Source" : "");
      return {
        id: project.id || `${name || "project"}-${index}`,
        name: name || undefined,
        description: description || undefined,
        tags,
        github,
        demo,
        status: status || undefined,
      };
    })
    .filter(Boolean) as PortfolioProject[];
}

function normalizeBlogs(blogs?: ProfileBlog[] | null): PortfolioBlog[] {
  return (blogs || [])
    .map((blog, index) => {
      const title = textValue(blog.title);
      const description = textValue(blog.description);
      const url = cleanUrl(blog.blogLink || blog.url);
      if (!title && !description && !url) return null;
      return {
        id: blog.id || `${title || "blog"}-${index}`,
        title: title || undefined,
        description: description || undefined,
        readTime:
          textValue(blog.readTime) || formatDate(blog.enddate) || undefined,
        url,
      };
    })
    .filter(Boolean) as PortfolioBlog[];
}

function normalizeStack(skills?: string[] | null): StackItem[] {
  return (skills || [])
    .map(textValue)
    .filter(Boolean)
    .map((skill) => ({ name: skill }));
}

function getBookCallLink(profile?: ProfileData) {
  return cleanUrl(profile?.bookAcall);
}

// ─── STACK TICKER ─────────────────────────────────────────────────────────────
function StackTicker({ stack }: { stack: StackItem[] }) {
  const items = [...stack, ...stack];
  return (
    <div className="relative overflow-hidden py-2 bg-slate-50/50 rounded-xl border border-slate-100/80">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-[#fdfcfb] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-[#fdfcfb] to-transparent" />
      <div
        className="flex gap-4 w-max"
        style={{ animation: "ticker 40s linear infinite" }}
      >
        {items.map((tech, i) => (
          <div
            key={`${tech.name}-${i}`}
            className="flex items-center px-4 py-2 rounded-lg bg-white shadow-xs border border-slate-200/60 shrink-0"
          >
            <span className="text-xs text-slate-600 font-medium tracking-wide">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
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
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <main className="min-h-screen bg-[#fdfcfb] text-slate-700 antialiased selection:bg-emerald-100 selection:text-emerald-900">
        <div className="max-w-190 mx-auto px-6 py-16 sm:py-24">
          
          {/* QUOTE */}
          {quote && (
            <div className="mb-14 border-l-3 border-emerald-500/80 pl-5 py-0.5">
              <p className="text-sm text-slate-500 font-serif italic leading-relaxed">
                &ldquo;{quote}&rdquo;
              </p>
            </div>
          )}

          {/* HERO */}
          <section className="mb-10">
            {hasHeroMedia && (
              <div className="relative mb-10">
                {banner && (
                  <div className="relative h-36 sm:h-56 rounded-2xl overflow-hidden shadow-xs">
                    <Image
                      src={banner}
                      alt={name ? `${name} banner` : "Portfolio banner"}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                    />
                  </div>
                )}
                {avatar && (
                  <div className={
                    banner
                      ? "absolute left-6 -bottom-10 shadow-md rounded-2xl overflow-hidden p-1"
                      : "mb-6 rounded-2xl overflow-hidden w-24 h-24 shadow-sm p-1"
                  }>
                    <Image
                      src={avatar}
                      alt={name || "Profile avatar"}
                      width={banner ? 84 : 96}
                      height={banner ? 84 : 96}
                      unoptimized
                      className="rounded-xl object-cover aspect-square"
                    />
                  </div>
                )}
              </div>
            )}
            
            <div className={banner ? "pt-12" : "pt-2"}>
              {name && (
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                  {name}
                </h1>
              )}
              {tagline && (
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 font-mono mb-6">
                  {tagline}
                </p>
              )}
              {bio && <p className="text-[15px] text-slate-600 leading-relaxed font-normal max-w-2xl">{bio}</p>}
            </div>
          </section>

          {/* QUICK LINKS */}
          {hasQuickActions && (
            <div className="flex flex-wrap items-center gap-2.5 mb-6">
              {links.map((link) => (
                <Tooltip key={link.id}>
                  <TooltipTrigger asChild>
                    <Link
                      href={link.href}
                      target={shouldOpenInNewTab(link.href) ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      title={link.label}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 border border-slate-200 bg-white shadow-xs hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50/40 transition-all duration-200"
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-emerald-800 shadow-sm hover:shadow transition-all duration-200 ml-auto"
                >
                  Book a call
                  <ArrowRight size={12} className="stroke-[2.5]" />
                </Link>
              )}
            </div>
          )}

          {/* EXPERIENCES */}
          {experiences.length > 0 && (
            <>
              <Divider />
              <section>
                <SectionHeading>Professional Experience</SectionHeading>
                <div className="space-y-10 relative before:absolute before:inset-y-1 before:left-3 before:w-px before:bg-slate-200/60 pl-2">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="relative pl-8 group">
                      <div className="absolute left-[9px] top-1.5 w-2 h-2 rounded-full bg-slate-300 border border-white group-hover:bg-emerald-500 group-hover:scale-125 transition-all duration-200" />
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                        <div>
                          {exp.company &&
                            (exp.companyUrl && exp.companyUrl !== "#" ? (
                              <a
                                href={exp.companyUrl}
                                target={shouldOpenInNewTab(exp.companyUrl) ? "_blank" : undefined}
                                rel="noopener noreferrer"
                                className="group/link inline-flex items-center gap-1.5 text-base font-bold text-slate-900 hover:text-emerald-700 transition-colors"
                              >
                                {exp.company}
                                <MoveUpRight
                                  size={12}
                                  className="text-slate-400 group-hover/link:text-emerald-600 transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                                />
                              </a>
                            ) : (
                              <span className="text-base font-bold text-slate-900">
                                {exp.company}
                              </span>
                            ))}
                          {exp.role && (
                            <p className="text-xs font-medium text-slate-500 mt-0.5">
                              {exp.role}
                            </p>
                          )}
                        </div>
                        {exp.period && (
                          <span className="text-[11px] font-semibold text-slate-400 sm:text-right font-mono self-start sm:self-center pt-0.5">
                            {exp.period}
                          </span>
                        )}
                      </div>
                      
                      {exp.bullets.length > 0 && (
                        <ul className="space-y-2">
                          {exp.bullets.map((bullet, i) => (
                            <li
                              key={`${exp.id}-${i}`}
                              className="flex gap-3 text-[13px] text-slate-600 leading-relaxed"
                            >
                              <span className="text-slate-300 shrink-0 select-none mt-1">
                                —
                              </span>
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

          {/* PROJECTS */}
          {projects.length > 0 && (
            <>
              <Divider />
              <section>
                <SectionHeading>Proof of Work</SectionHeading>
                <div className="grid gap-3">
                  {visibleProjects.map((project) => (
                    <div
                      key={project.id}
                      className="group flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200/70 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200"
                    >
                      {project.name && (
                        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center shrink-0 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors">
                          <span className="text-xs font-extrabold text-slate-500 group-hover:text-emerald-700 select-none uppercase">
                            {project.name[0]}
                          </span>
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        {(project.name || project.status) && (
                          <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                            {project.name && (
                              <span className="text-[14px] font-bold text-slate-900">
                                {project.name}
                              </span>
                            )}
                            {project.status && (
                              <span
                                className={`text-[10px] font-bold tracking-wide font-mono px-2 py-0.5 rounded-md border ${statusStyle[project.status] ?? fallbackStatusStyle}`}
                              >
                                {project.status}
                              </span>
                            )}
                          </div>
                        )}
                        {project.description && (
                          <p className="text-[13px] text-slate-500 leading-relaxed mb-3">
                            {project.description}
                          </p>
                        )}
                        {project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {(project.github || project.demo) && (
                        <div className="flex gap-2 shrink-0 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 self-start pt-1">
                          {project.github && (
                            <a
                              href={project.github}
                              target={shouldOpenInNewTab(project.github) ? "_blank" : undefined}
                              rel="noopener noreferrer"
                              className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition-all"
                              aria-label={project.name ? `${project.name} source` : "Project source"}
                            >
                              <Github size={13} />
                            </a>
                          )}
                          {project.demo && (
                            <Link
                              href={project.demo}
                              target={shouldOpenInNewTab(project.demo) ? "_blank" : undefined}
                              rel="noopener noreferrer"
                              className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all"
                              aria-label={project.name ? `${project.name} live link` : "Project live link"}
                            >
                              <ExternalLink size={13} />
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {projects.length > 4 && (
                  <button
                    onClick={() => setShowAll((value) => !value)}
                    className="mt-4 ml-1 text-xs font-bold text-slate-400 hover:text-emerald-700 transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    {showAll ? "Show less" : "View All Proof of Work →"}
                  </button>
                )}
              </section>
            </>
          )}

          {/* BLOGS */}
          {blogs.length > 0 && (
            <>
              <Divider />
              <section>
                <SectionHeading>Thoughts</SectionHeading>
                <div className="grid gap-2">
                  {blogs.map((blog) => {
                    const content = (
                      <>
                        <div className="min-w-0 pr-4">
                          {blog.title && (
                            <p className="text-[14px] font-bold text-slate-800 group-hover:text-emerald-800 transition-colors leading-snug">
                              {blog.title}
                            </p>
                          )}
                          {blog.description && (
                            <p className="text-xs text-slate-400 leading-relaxed mt-1 line-clamp-2 font-normal">
                              {blog.description}
                            </p>
                          )}
                        </div>
                        {(blog.readTime || blog.url) && (
                          <div className="flex items-center gap-2.5 shrink-0">
                            {blog.readTime && (
                              <span className="text-[11px] font-mono text-slate-400">
                                {blog.readTime}
                              </span>
                            )}
                            {blog.url && (
                              <ArrowRight
                                size={12}
                                className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all duration-200"
                              />
                            )}
                          </div>
                        )}
                      </>
                    );

                    return blog.url ? (
                      <Link
                        key={blog.id}
                        href={blog.url}
                        target={shouldOpenInNewTab(blog.url) ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200/50 hover:border-slate-300 shadow-xs hover:shadow transition-all duration-200"
                      >
                        {content}
                      </Link>
                    ) : (
                      <div
                        key={blog.id}
                        className="group flex items-center justify-between p-3.5 rounded-xl border border-slate-100/60"
                      >
                        {content}
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          )}

          {/* STACK */}
          {stack.length > 0 && (
            <>
              <Divider />
              <section>
                <SectionHeading>Stack I use</SectionHeading>
                <StackTicker stack={stack} />
              </section>
            </>
          )}

          {/* FOOTER CALL TO ACTION */}
          {bookCallLink && (
            <>
              <Divider />
              <section className="mb-2">
                <Link
                  href={bookCallLink}
                  target={shouldOpenInNewTab(bookCallLink) ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all duration-300"
                >
                  {avatar && (
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-inner shrink-0 border border-slate-100">
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
                    <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                      Let's build together
                    </p>
                    <p className="text-xs text-slate-400">
                      Grab a spot on my calendar to talk collaboration.
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center border border-slate-200/60 group-hover:border-emerald-100 shrink-0 transition-all duration-300">
                    <ArrowRight size={13} className="text-slate-400 group-hover:text-emerald-600 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </section>
            </>
          )}

        </div>
      </main>
    </>
  );
}