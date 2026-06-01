"use client";

import { useState } from "react";
import type { ComponentType, CSSProperties, ReactNode } from "react";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Code2,
  ExternalLink,
  FileText,
  Github,
  Globe,
  Instagram,
  Layers3,
  Linkedin,
  Mail,
  MoveUpRight,
  Phone,
  Send,
  Sparkles,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useRouter } from "next/navigation";

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

type IconComponent = ComponentType<{
  size?: number;
  className?: string;
  strokeWidth?: number;
}>;

export type ThemedPortfolioProps = {
  user: UserData;
  profile: ProfileData;
};

export type TemplateThemeConfig = {
  key: string;
  pageClass: string;
  pageStyle?: CSSProperties;
  containerClass: string;
  quoteClass: string;
  heroClass: string;
  heroMediaClass: string;
  bannerClass: string;
  bannerOverlayClass: string;
  avatarWithBannerClass: string;
  avatarSoloClass: string;
  nameClass: string;
  taglineClass: string;
  bioClass: string;
  quickLinksClass: string;
  quickLinkClass: string;
  quickCtaClass: string;
  dividerClass: string;
  sectionHeadingClass: string;
  // sectionIconClass: string;
  sectionTitleClass: string;
  experienceListClass: string;
  experienceItemClass: string;
  companyClass: string;
  roleClass: string;
  periodClass: string;
  bulletClass: string;
  bulletMarkerClass: string;
  projectListClass: string;
  projectItemClass: string;
  projectInitialClass: string;
  projectInitialTextClass: string;
  projectNameClass: string;
  projectDescriptionClass: string;
  projectTagClass: string;
  projectActionClass: string;
  statusClass: Record<string, string>;
  fallbackStatusClass: string;
  showMoreClass: string;
  blogListClass: string;
  blogItemClass: string;
  blogTitleClass: string;
  blogDescriptionClass: string;
  blogMetaClass: string;
  stackShellClass: string;
  stackFadeLeftClass: string;
  stackFadeRightClass: string;
  stackTrackClass: string;
  stackItemClass: string;
  stackTextClass: string;
  footerCtaClass: string;
  footerAvatarClass: string;
  footerCtaTitleClass: string;
  footerCtaTextClass: string;
  contactListClass: string;
  contactItemClass: string;
  contactIconClass: string;
  contactTextClass: string;
  footerClass: string;
  footerTextClass: string;
  footerBrandClass: string;
  iconSize?: number;
  iconStrokeWidth?: number;
  // sectionIcons?: {
  //   experience?: IconComponent;
  //   projects?: IconComponent;
  //   writing?: IconComponent;
  //   stack?: IconComponent;
  //   contact?: IconComponent;
  //   call?: IconComponent;
  // };
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

export function textValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function cleanUrl(value?: string | null) {
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

export function shouldOpenInNewTab(href?: string) {
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

export function normalizeLinks(links?: ProfileLink[] | null) {
  return (links || [])
    .map((link, index) => normalizeLink(link, index))
    .filter(Boolean) as NormalizedLink[];
}

export function addProfileContactLinks(
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

export function normalizeExperiences(
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

export function normalizeProjects(
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

      if (!name && !description && !github && !demo && tags.length === 0) {
        return null;
      }

      const status =
        textValue(project.status) ||
        (project.live || demo ? "Live" : github ? "" : "");

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

export function normalizeBlogs(blogs?: ProfileBlog[] | null): PortfolioBlog[] {
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

export function normalizeStack(skills?: string[] | null): StackItem[] {
  return (skills || [])
    .map(textValue)
    .filter(Boolean)
    .map((skill) => ({ name: skill }));
}

export function getBookCallLink(profile?: ProfileData) {
  return cleanUrl(profile?.bookAcall);
}

export function getLinkIcon(
  label: string,
  href: string,
  iconSize = 14,
  strokeWidth = 1.8,
): ReactNode {
  const domain = getDomain(href);
  const lowerLabel = label.toLowerCase();
  const lowerDomain = domain.toLowerCase();
  const iconProps = { size: iconSize, strokeWidth };

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
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
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
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
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

function SectionHeading({
  children,
  icon: Icon = Sparkles,
  config,
}: {
  children: ReactNode;
  icon?: IconComponent;
  config: TemplateThemeConfig;
}) {
  return (
    <div className={config.sectionHeadingClass}>
      {/* <span className={config.sectionIconClass}>
        <Icon size={13} strokeWidth={config.iconStrokeWidth ?? 1.8} />
      </span> */}
      <h2 className={config.sectionTitleClass}>{children}</h2>
    </div>
  );
}

function StackTicker({
  stack,
  config,
}: {
  stack: StackItem[];
  config: TemplateThemeConfig;
}) {
  const items = [...stack, ...stack];

  return (
    <div className={config.stackShellClass}>
      <div className={config.stackFadeLeftClass} />
      <div className={config.stackFadeRightClass} />
      <div className={config.stackTrackClass}>
        {items.map((tech, index) => (
          <div key={`${tech.name}-${index}`} className={config.stackItemClass}>
            <span className={config.stackTextClass}>{tech.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Divider({ config }: { config: TemplateThemeConfig }) {
  return <div className={config.dividerClass} />;
}

export function ThemedPortfolioTemplate({
  user,
  profile,
  config,
}: ThemedPortfolioProps & { config: TemplateThemeConfig }) {
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
  const iconSize = config.iconSize ?? 14;
  const iconStrokeWidth = config.iconStrokeWidth ?? 1.8;
  // const CallIcon = config.sectionIcons?.call ?? CalendarDays;

  const router = useRouter();

  return (
    <>
      <style>{`
        @keyframes ${config.key}-ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .${config.key}-ticker-track {
          animation: ${config.key}-ticker 34s linear infinite;
        }
        @container (max-width: 920px) {
          .${config.key}-portfolio .lf-themed-hero {
            grid-template-columns: minmax(0, 1fr) !important;
            align-items: stretch !important;
          }
          .${config.key}-portfolio .lf-themed-project-list,
          .${config.key}-portfolio .lf-themed-contact-list {
            grid-template-columns: minmax(0, 1fr) !important;
          }
          .${config.key}-portfolio .lf-themed-name {
            font-size: 42px !important;
          }
          .${config.key}-portfolio .lf-themed-banner {
            height: 13rem !important;
          }
        }
        @container (max-width: 560px) {
          .${config.key}-portfolio .lf-themed-name {
            font-size: 34px !important;
          }
          .${config.key}-portfolio .lf-themed-banner {
            height: 11rem !important;
          }
          .${config.key}-portfolio .lf-themed-experience-meta,
          .${config.key}-portfolio .lf-themed-footer {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
      `}</style>
      <main
        className={`${config.key}-portfolio ${config.pageClass}`}
        style={{ ...config.pageStyle, containerType: "inline-size" }}
      >
        <div className={config.containerClass}>
          {quote && <p className={config.quoteClass}>{quote}</p>}

          <section className={`lf-themed-hero ${config.heroClass}`}>
            {hasHeroMedia && (
              <div className={config.heroMediaClass}>
                {banner && (
                  <div className={`lf-themed-banner ${config.bannerClass}`}>
                    <Image
                      src={banner}
                      alt={name ? `${name} banner` : "Portfolio banner"}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <div className={config.bannerOverlayClass} />
                  </div>
                )}
                {avatar && (
                  <Image
                    src={avatar}
                    alt={name || "Profile avatar"}
                    width={92}
                    height={92}
                    unoptimized
                    className={
                      banner
                        ? config.avatarWithBannerClass
                        : config.avatarSoloClass
                    }
                  />
                )}
              </div>
            )}

            <div>
              {name && (
                <h1 className={`lf-themed-name ${config.nameClass}`}>
                  {name}
                </h1>
              )}
              {tagline && <p className={config.taglineClass}>{tagline}</p>}
              {bio && <p className={config.bioClass}>{bio}</p>}
            </div>
          </section>

          {hasQuickActions && (
            <div className={config.quickLinksClass}>
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
                      className={config.quickLinkClass}
                    >
                      {getLinkIcon(
                        link.label,
                        link.href,
                        iconSize,
                        iconStrokeWidth,
                      )}
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
                  className={config.quickCtaClass}
                >
                  Book a call
                  <ArrowRight size={12} strokeWidth={iconStrokeWidth + 0.4} />
                </Link>
              )}
            </div>
          )}

          {experiences.length > 0 && (
            <>
              <Divider config={config} />
              <section>
                <SectionHeading
                  config={config}
                  // icon={config.sectionIcons?.experience ?? BriefcaseBusiness}
                >
                  Experience
                </SectionHeading>
                <div className={config.experienceListClass}>
                  {experiences.map((experience) => (
                    <div key={experience.id} className={config.experienceItemClass}>
                      <div className="lf-themed-experience-meta flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          {experience.company && (
                            <p className={config.companyClass}>
                              {experience.company}
                            </p>
                          )}
                          {experience.role && (
                            <p className={config.roleClass}>{experience.role}</p>
                          )}
                        </div>
                        {experience.period && (
                          <span className={config.periodClass}>
                            {experience.period}
                          </span>
                        )}
                      </div>

                      {experience.bullets.length > 0 && (
                        <ul className="mt-4 space-y-2">
                          {experience.bullets.map((bullet, index) => (
                            <li
                              key={`${experience.id}-${index}`}
                              className={config.bulletClass}
                            >
                              <span className={config.bulletMarkerClass} />
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

          {projects.length > 0 && (
            <>
              <Divider config={config} />
              <section>
                <SectionHeading
                  config={config}
                  // icon={config.sectionIcons?.projects ?? Layers3}
                >
                  Proof of work
                </SectionHeading>
                <div className={`lf-themed-project-list ${config.projectListClass}`}>
                  {visibleProjects.map((project) => (
                    <article key={project.id} className={config.projectItemClass}>
                      {/* <div className={config.projectInitialClass}>
                        <span className={config.projectInitialTextClass}>
                          {project.name?.[0] ?? "#"}
                        </span>
                      </div> */}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {project.name && (
                            <h3 className={config.projectNameClass}>
                              {project.name}
                            </h3>
                          )}
                          {project.status && (
                            <span
                              className={
                                config.statusClass[project.status] ??
                                config.fallbackStatusClass
                              }
                            >
                              {project.status}
                            </span>
                          )}
                        </div>
                        {project.description && (
                          <p className={config.projectDescriptionClass}>
                            {project.description}
                          </p>
                        )}
                        {project.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {project.tags.map((tag) => (
                              <span key={tag} className={config.projectTagClass}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {(project.github || project.demo) && (
                        <div className="flex shrink-0 gap-1.5">
                          {project.github && (
                            <a
                              href={project.github}
                              target={
                                shouldOpenInNewTab(project.github)
                                  ? "_blank"
                                  : undefined
                              }
                              rel="noopener noreferrer"
                              className={config.projectActionClass}
                              aria-label={
                                project.name
                                  ? `${project.name} source`
                                  : "Project source"
                              }
                            >
                              <Github size={13} strokeWidth={iconStrokeWidth} />
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
                              className={config.projectActionClass}
                              aria-label={
                                project.name
                                  ? `${project.name} live link`
                                  : "Project live link"
                              }
                            >
                              <ExternalLink
                                size={13}
                                strokeWidth={iconStrokeWidth}
                              />
                            </Link>
                          )}
                        </div>
                      )}
                    </article>
                  ))}
                </div>

                {projects.length > 4 && (
                  <button
                    onClick={() => setShowAll((value) => !value)}
                    className={config.showMoreClass}
                  >
                    {showAll ? "Show less" : `View all ${projects.length}`}
                    <ArrowRight size={11} strokeWidth={iconStrokeWidth + 0.4} />
                  </button>
                )}
              </section>
            </>
          )}

          {blogs.length > 0 && (
            <>
              <Divider config={config} />
              <section>
                <SectionHeading
                  config={config}
                  // icon={config.sectionIcons?.writing ?? BookOpen}
                >
                  Thoughts and writings
                </SectionHeading>
                <div className={config.blogListClass}>
                  {blogs.map((blog) => {
                    const content = (
                      <>
                        <div className="min-w-0 flex-1">
                          {blog.title && (
                            <p className={config.blogTitleClass}>{blog.title}</p>
                          )}
                          {blog.description && (
                            <p className={config.blogDescriptionClass}>
                              {blog.description}
                            </p>
                          )}
                        </div>
                        <div className="flex shrink-0 items-center gap-2 pl-3">
                          {blog.readTime && (
                            <span className={config.blogMetaClass}>
                              {blog.readTime}
                            </span>
                          )}
                          {blog.url && (
                            <ArrowRight
                              size={12}
                              strokeWidth={iconStrokeWidth}
                              className="transition-transform group-hover:translate-x-0.5"
                            />
                          )}
                        </div>
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
                        className={config.blogItemClass}
                      >
                        {content}
                      </Link>
                    ) : (
                      <div key={blog.id} className={config.blogItemClass}>
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
              <Divider config={config} />
              <section>
                <SectionHeading
                  config={config}
                  // icon={config.sectionIcons?.stack ?? Code2}
                >
                  Skills
                </SectionHeading>
                <StackTicker stack={stack} config={config} />
              </section>
            </>
          )}

          {bookCallLink && (
            <>
              <Divider config={config} />
              <section>
                <Link
                  href={bookCallLink}
                  target={
                    shouldOpenInNewTab(bookCallLink) ? "_blank" : undefined
                  }
                  rel="noopener noreferrer"
                  className={config.footerCtaClass}
                >
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={name || "Profile avatar"}
                      width={44}
                      height={44}
                      unoptimized
                      className={config.footerAvatarClass}
                    />
                  ) : (
                    <span className={config.footerAvatarClass}>
                      {/* <CallIcon size={17} strokeWidth={iconStrokeWidth} /> */}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className={config.footerCtaTitleClass}>
                      Let&apos;s talk
                    </span>
                    <span className={config.footerCtaTextClass}>
                      Book a slot to discuss a project or collaboration.
                    </span>
                  </span>
                  <ArrowRight
                    size={14}
                    strokeWidth={iconStrokeWidth + 0.3}
                    className="shrink-0 transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </section>
            </>
          )}

          {/* {contactLinks.length > 0 && (
            <>
              <Divider config={config} />
              <section>
                <SectionHeading
                  config={config}
                  // icon={config.sectionIcons?.contact ?? Send}
                >
                  Connect
                </SectionHeading>
                <div className={`lf-themed-contact-list ${config.contactListClass}`}>
                  {contactLinks.map((link) => (
                    <Link
                      key={link.id}
                      href={link.href}
                      target={
                        shouldOpenInNewTab(link.href) ? "_blank" : undefined
                      }
                      rel="noopener noreferrer"
                      className={config.contactItemClass}
                    >
                      <span className={config.contactIconClass}>
                        {getLinkIcon(
                          link.label,
                          link.href,
                          iconSize,
                          iconStrokeWidth,
                        )}
                      </span>
                      <span className={config.contactTextClass}>
                        {link.label}
                      </span>
                      <MoveUpRight
                        size={12}
                        strokeWidth={iconStrokeWidth}
                        className="ml-auto shrink-0"
                      />
                    </Link>
                  ))}
                </div>
              </section>
            </>
          )} */}

          <footer className={`lf-themed-footer flex justify-center items-center ${config.footerClass}`}>
            <p onClick={()=>router.push('/')} className={config.footerBrandClass}>Built with lazyfolio</p>
          </footer>
        </div>
      </main>
    </>
  );
}
