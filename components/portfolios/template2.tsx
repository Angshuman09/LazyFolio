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

  const iconProps = { size: 14 };

  // GitHub
  if (lowerDomain.includes("github") || lowerLabel === "github") {
    return <Github {...iconProps} />;
  }

  // X / Twitter
  if (
    lowerDomain.includes("x.com") ||
    lowerDomain.includes("twitter") ||
    lowerLabel === "x" ||
    lowerLabel === "twitter"
  ) {
    // X logo as SVG since lucide doesn't have it
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }

  // LinkedIn
  if (lowerDomain.includes("linkedin") || lowerLabel === "linkedin") {
    return <Linkedin {...iconProps} />;
  }

  // Instagram
  if (lowerDomain.includes("instagram") || lowerLabel === "instagram") {
    return <Instagram {...iconProps} />;
  }

  // YouTube
  if (
    lowerDomain.includes("youtube") ||
    lowerDomain.includes("youtu.be") ||
    lowerLabel === "youtube"
  ) {
    return <Youtube {...iconProps} />;
  }

  // Medium
  if (lowerDomain.includes("medium") || lowerLabel === "medium") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
      </svg>
    );
  }

  // LeetCode
  if (lowerDomain.includes("leetcode") || lowerLabel === "leetcode") {
    return <Code2 {...iconProps} />;
  }

  // Dev.to
  if (
    lowerDomain.includes("dev.to") ||
    lowerLabel === "dev.to" ||
    lowerLabel === "dev"
  ) {
    return <BookOpen {...iconProps} />;
  }

  // Mail
  if (
    href.startsWith("mailto:") ||
    lowerLabel === "mail" ||
    lowerLabel === "email"
  ) {
    return <Mail {...iconProps} />;
  }

  // Phone
  if (href.startsWith("tel:") || lowerLabel === "phone") {
    return <Phone {...iconProps} />;
  }

  // Resume
  if (lowerLabel === "resume" || lowerLabel === "cv") {
    return <FileText {...iconProps} />;
  }

  // Fallback
  return <Globe {...iconProps} />;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const Divider = () => <div className="w-full h-px bg-stone-200/80 my-10" />;

const SectionHeading = ({ children }: { children: ReactNode }) => (
  <h2 className="text-sm font-semibold text-stone-900 mb-6 tracking-tight">
    {children}
  </h2>
);

const statusStyle: Record<string, string> = {
  Live: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
  WIP: "text-amber-600 bg-amber-500/10 border-amber-500/20",
  "Open Source": "text-sky-600 bg-sky-500/10 border-sky-500/20",
};

const fallbackStatusStyle =
  "text-stone-500 bg-stone-500/10 border-stone-500/20";

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
  const normalized = (experiences || [])
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

  return normalized;
}

function normalizeProjects(
  projects?: ProfileProject[] | null,
): PortfolioProject[] {
  const normalized = (projects || [])
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

  return normalized;
}

function normalizeBlogs(blogs?: ProfileBlog[] | null): PortfolioBlog[] {
  const normalized = (blogs || [])
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

  return normalized;
}

function normalizeStack(skills?: string[] | null): StackItem[] {
  const normalized = (skills || [])
    .map(textValue)
    .filter(Boolean)
    .map((skill) => ({ name: skill }));
  return normalized;
}

function getBookCallLink(profile?: ProfileData) {
  return cleanUrl(profile?.bookAcall);
}

// ─── STACK TICKER ─────────────────────────────────────────────────────────────
function StackTicker({ stack }: { stack: StackItem[] }) {
  const items = [...stack, ...stack];
  return (
    <div className="relative overflow-hidden py-1">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 z-10 bg-linear-to-r from-[#fbfbfb] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 z-10 bg-linear-to-l from-[#fbfbfb] to-transparent" />
      <div
        className="flex gap-3 w-max"
        style={{ animation: "ticker 30s linear infinite" }}
      >
        {items.map((tech, i) => (
          <div
            key={`${tech.name}-${i}`}
            className="flex items-center px-3 py-1.5 rounded-lg bg-white border border-stone-200 shrink-0"
          >
            <span className="text-[11px] text-stone-500 whitespace-nowrap font-medium">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export function Template2({
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
      <main className="min-h-screen bg-[#fbfbfb] text-stone-700 antialiased">
        <div className="max-w-[800px] mx-auto px-6 py-16 sm:py-20">
          {/* QUOTE */}
          {quote && (
            <div className="mb-12 border-l-2 border-stone-300 pl-4">
              <p className="text-xs text-stone-500 italic leading-relaxed">
                {quote}
              </p>
            </div>
          )}

          {/* HERO */}
          <section className="mb-8">
            {hasHeroMedia && (
              <div className="relative mb-9">
                {banner && (
                  <div className="relative h-32 sm:h-55 rounded-xl overflow-hidden border border-stone-200 bg-white">
                    <Image
                      src={banner}
                      alt={name ? `${name} banner` : "Portfolio banner"}
                      fill
                      unoptimized
                      className="object-cover opacity-90"
                    />
                  </div>
                )}
                {avatar && (
                  <Image
                    src={avatar}
                    alt={name || "Profile avatar"}
                    width={80}
                    height={80}
                    unoptimized
                    className={
                      banner
                        ? "absolute left-4 -bottom-8 w-20 h-20 rounded-lg object-cover ring-1 ring-[#fbfbfb] border border-stone-200 bg-white"
                        : "w-20 h-20 rounded-lg object-cover border border-stone-200 bg-white"
                    }
                  />
                )}
              </div>
            )}
            {name && (
              <h1 className="text-xl font-bold text-stone-900 mb-1 tracking-tight">
                {name}
              </h1>
            )}
            {tagline && (
              <p className="text-xs text-stone-400 font-mono mb-5">
                {tagline}
              </p>
            )}
            {bio && <p className="text-sm text-stone-600 leading-[1.8]">{bio}</p>}
          </section>

          {/* QUICK LINKS — icon-only buttons */}
          {/* <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>*/}
          {hasQuickActions && (
            <div className="flex flex-wrap gap-2 mb-4">
              {links.map((link) => (
                <Tooltip key={link.id}>
                  <TooltipTrigger asChild>
                    <Link
                      href={link.href}
                      target={
                        shouldOpenInNewTab(link.href) ? "_blank" : undefined
                      }
                      rel="noopener noreferrer"
                      title={link.label}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md text-stone-500 border border-stone-200 bg-white/60 hover:border-stone-300 hover:text-stone-800 hover:bg-stone-50 transition-all duration-150"
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
                  target={
                    shouldOpenInNewTab(bookCallLink) ? "_blank" : undefined
                  }
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] text-stone-700 border border-stone-200 bg-stone-100 hover:bg-stone-200 transition-all duration-150 ml-auto font-medium"
                >
                  Book a call
                  <ArrowRight size={10} />
                </Link>
              )}
            </div>
          )}

          {experiences.length > 0 && (
            <>
              <Divider />
              <section>
                <SectionHeading>Professional Experience</SectionHeading>
                <div className="space-y-8">
                  {experiences.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          {exp.company &&
                            (exp.companyUrl && exp.companyUrl !== "#" ? (
                              <a
                                href={exp.companyUrl}
                                target={
                                  shouldOpenInNewTab(exp.companyUrl)
                                    ? "_blank"
                                    : undefined
                                }
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-1 text-sm font-semibold text-stone-900 hover:text-stone-700 transition-colors"
                              >
                                {exp.company}
                                <MoveUpRight
                                  size={10}
                                  className="text-stone-400 group-hover:text-stone-600 transition-colors"
                                />
                              </a>
                            ) : (
                              <span className="text-sm font-semibold text-stone-900">
                                {exp.company}
                              </span>
                            ))}
                          {exp.role && (
                            <p className="text-[11px] text-stone-500 mt-0.5">
                              {exp.role}
                            </p>
                          )}
                        </div>
                        {exp.period && (
                          <span className="text-[10px] font-mono text-stone-500 shrink-0 pt-0.5">
                            {exp.period}
                          </span>
                        )}
                      </div>
                      {exp.bullets.length > 0 && (
                        <ul className="space-y-1.5">
                          {exp.bullets.map((bullet, i) => (
                            <li
                              key={`${exp.id}-${i}`}
                              className="flex gap-2.5 text-[13px] text-stone-600 leading-relaxed"
                            >
                              <span className="text-stone-300 shrink-0 select-none mt-0.5">
                                •
                              </span>
                              {bullet}
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

          {projects.length > 0 && (
            <>
              <Divider />
              <section>
                <SectionHeading>Proof of Work</SectionHeading>
                <div className="space-y-0.5">
                  {visibleProjects.map((project) => (
                    <div
                      key={project.id}
                      className="group flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-all duration-150"
                    >
                      {project.name && (
                        <div className="w-7 h-7 rounded-md bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[10px] font-bold text-stone-400 select-none">
                            {project.name[0]}
                          </span>
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        {(project.name || project.status) && (
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            {project.name && (
                              <span className="text-[13px] font-medium text-stone-800">
                                {project.name}
                              </span>
                            )}
                            {project.status && (
                              <span
                                className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${statusStyle[project.status] ?? fallbackStatusStyle}`}
                              >
                                {project.status}
                              </span>
                            )}
                          </div>
                        )}
                        {project.description && (
                          <p className="text-[12px] text-stone-500 leading-relaxed mb-1.5">
                            {project.description}
                          </p>
                        )}
                        {project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-500"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {(project.github || project.demo) && (
                        <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 mt-0.5">
                          {project.github && (
                            <a
                              href={project.github}
                              target={
                                shouldOpenInNewTab(project.github)
                                  ? "_blank"
                                  : undefined
                              }
                              rel="noopener noreferrer"
                              className="text-stone-400 hover:text-stone-600 transition-colors"
                              aria-label={
                                project.name
                                  ? `${project.name} source`
                                  : "Project source"
                              }
                            >
                              <Github size={12} />
                            </a>
                          )}
                          {project.demo && (
                            <Link
                              href={project.demo}
                              target={
                                shouldOpenInNewTab(project.demo)
                                  ? "_blank"
                                  : undefined
                              }
                              rel="noopener noreferrer"
                              className="text-stone-400 hover:text-stone-600 transition-colors"
                              aria-label={
                                project.name
                                  ? `${project.name} live link`
                                  : "Project live link"
                              }
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
                    onClick={() => setShowAll((value) => !value)}
                    className="mt-3 ml-3 text-[11px] text-stone-500 hover:text-stone-700 transition-colors cursor-pointer"
                  >
                    {showAll ? "Show less" : "View All →"}
                  </button>
                )}
              </section>
            </>
          )}

          {blogs.length > 0 && (
            <>
              <Divider />
              <section>
                <SectionHeading>Thoughts</SectionHeading>
                <div className="space-y-0.5">
                  {blogs.map((blog) => {
                    const content = (
                      <>
                        <div className="min-w-0 pr-4">
                          {blog.title && (
                            <p className="text-[13px] text-stone-600 group-hover:text-stone-900 transition-colors leading-snug">
                              {blog.title}
                            </p>
                          )}
                          {blog.description && (
                            <p className="text-[11px] text-stone-400 leading-relaxed mt-1 line-clamp-2">
                              {blog.description}
                            </p>
                          )}
                        </div>
                        {(blog.readTime || blog.url) && (
                          <div className="flex items-center gap-2 shrink-0">
                            {blog.readTime && (
                              <span className="text-[10px] font-mono text-stone-400">
                                {blog.readTime}
                              </span>
                            )}
                            {blog.url && (
                              <ArrowRight
                                size={10}
                                className="text-stone-300 group-hover:text-stone-500 group-hover:translate-x-0.5 transition-all"
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
                        target={
                          shouldOpenInNewTab(blog.url) ? "_blank" : undefined
                        }
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between px-3 py-3 rounded-lg hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-all duration-150"
                      >
                        {content}
                      </Link>
                    ) : (
                      <div
                        key={blog.id}
                        className="group flex items-center justify-between px-3 py-3 rounded-lg border border-transparent"
                      >
                        {content}
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          )}

          {stack.length > 0 && (
            <>
              <Divider />
              <section>
                <SectionHeading>Stack I use</SectionHeading>
                <StackTicker stack={stack} />
              </section>
            </>
          )}

          {bookCallLink && (
            <>
              <Divider />
              <section className="mb-2">
                <Link
                  href={bookCallLink}
                  target={
                    shouldOpenInNewTab(bookCallLink) ? "_blank" : undefined
                  }
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 transition-all duration-200"
                >
                  {avatar && (
                    <Image
                      src={avatar}
                      alt={name || "Profile avatar"}
                      width={24}
                      height={24}
                      unoptimized
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-stone-200"
                    />
                  )}
                  <span className="text-[13px] text-stone-600 group-hover:text-stone-900 transition-colors">
                    Book a Free Call
                  </span>
                  <ArrowRight
                    size={11}
                    className="text-stone-400 group-hover:text-stone-600 group-hover:translate-x-0.5 transition-all"
                  />
                </Link>
              </section>
            </>
          )}

          {contactLinks.length > 0 && (
            <>
              <Divider />
              <section>
                <SectionHeading>Let&apos;s connect</SectionHeading>
                <div className="space-y-0.5">
                  {contactLinks.map((link) => (
                    <Link
                      key={link.id}
                      href={link.href}
                      target={
                        shouldOpenInNewTab(link.href) ? "_blank" : undefined
                      }
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-all duration-150"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-stone-500 group-hover:text-stone-800 transition-colors">
                          {getLinkIcon(link.label, link.href)}
                        </span>
                        <span className="text-[13px] text-stone-600 group-hover:text-stone-900 transition-colors">
                          {link.label}
                        </span>
                      </div>
                      <MoveUpRight
                        size={11}
                        className="text-stone-300 group-hover:text-stone-500 transition-colors"
                      />
                    </Link>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* FOOTER */}
          <div className="mt-14 pt-6 border-t border-stone-200 flex items-center justify-between">
            <p className="text-[11px] text-stone-400 font-mono">
              © {new Date().getFullYear()}
              {name ? ` ${name}` : ""}
            </p>
            <p className="text-[11px] text-stone-300">
              built with{" "}
              <span className="text-stone-500 font-medium">lazyfolio</span>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
