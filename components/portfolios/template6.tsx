"use client";

import { useState } from "react";
import type { ComponentType, ReactNode } from "react";
import {
  ArrowRight,
  ExternalLink,
  Github,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

import {
  cleanUrl,
  shouldOpenInNewTab,
  normalizeLinks,
  normalizeExperiences,
  normalizeProjects,
  normalizeBlogs,
  normalizeStack,
  getBookCallLink,
  getLinkIcon,
  addProfileContactLinks,
  textValue,
  type ThemedPortfolioProps,
  type TemplateThemeConfig,
} from "./template-themed";

type IconComponent = ComponentType<{
  size?: number;
  className?: string;
  strokeWidth?: number;
}>;

const config: TemplateThemeConfig = {
  key: "template6",
  pageClass:
    "min-h-screen text-[#102a43] antialiased selection:bg-[#0f766e]/15 selection:text-[#0f766e]",
  pageStyle: {
    background:
      "linear-gradient(135deg, #effaf8 0%, #f8fbff 46%, #eef4ff 100%)",
    fontFamily: "var(--font-sans), 'DM Sans', system-ui, sans-serif",
  },
  containerClass: "mx-auto max-w-[960px] px-5 py-10 sm:px-8 sm:py-16",
  quoteClass:
    "mb-8 rounded-lg border border-white/80 bg-white/55 px-4 py-3 text-[13px] leading-6 text-[#486581] shadow-sm backdrop-blur",
  heroClass:
    "mb-8 grid gap-6 rounded-lg border border-white/80 bg-white/60 p-4 shadow-[0_18px_60px_rgba(15,118,110,0.12)] backdrop-blur-xl sm:grid-cols-[auto_1fr] sm:items-center sm:p-6",
  heroMediaClass: "relative shrink-0",
  bannerClass:
    "relative h-48 overflow-hidden rounded-lg border border-white/80 bg-white/70 sm:h-64",
  bannerOverlayClass:
    "absolute inset-0 bg-[linear-gradient(180deg,rgba(15,118,110,0.02),rgba(16,42,67,0.18))]",
  avatarWithBannerClass:
    "absolute -bottom-6 left-5 h-[84px] w-[84px] rounded-lg border border-white/90 bg-white object-cover shadow-lg ring-4 ring-[#effaf8]",
  avatarSoloClass:
    "template6-avatar border-1 rounded-lg border border-white/90 bg-white object-cover shadow-lg",
  nameClass:
    "text-[36px] font-bold leading-[1.02] text-[#102a43] sm:text-[56px]",
  taglineClass:
    "mt-4 text-[12px] font-bold uppercase tracking-[0.18em] text-[#0f766e]",
  bioClass: "mt-5 max-w-xl text-[14px] leading-7 text-[#486581] sm:text-[15px]",
  quickLinksClass: "mb-2 flex flex-wrap items-center gap-2",
  quickLinkClass:
    "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/80 bg-white/65 text-[#486581] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:text-[#0f766e]",
  quickCtaClass:
    "ml-auto inline-flex h-9 items-center gap-2 rounded-lg bg-[#0f766e] px-4 text-[12px] font-bold text-white shadow-sm transition hover:bg-[#115e59]",
  dividerClass: "my-11 h-px w-full bg-white/80",
  sectionHeadingClass: "mb-5 flex items-center gap-3",
  sectionTitleClass:
    "text-[11px] font-bold uppercase tracking-[0.2em] text-[#486581]",
  experienceListClass: "grid gap-3",
  experienceItemClass:
    "rounded-lg border border-white/80 bg-white/62 p-5 shadow-sm backdrop-blur transition hover:bg-white/80",
  companyClass: "text-[15px] font-bold text-[#102a43]",
  roleClass: "mt-1 text-[12px] font-semibold text-[#0f766e]",
  periodClass: "text-[11px] font-semibold text-[#829ab1]",
  bulletClass: "flex gap-3 text-[13px] leading-6 text-[#486581]",
  bulletMarkerClass:
    "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#38bdf8]",
  projectListClass: "grid gap-3 sm:grid-cols-2",
  projectItemClass:
    "group flex items-start gap-4 rounded-lg border border-white/80 bg-white/62 p-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/85",
  projectInitialClass:
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e0f2fe] text-[#0369a1]",
  projectInitialTextClass: "text-[13px] font-black uppercase",
  projectNameClass: "text-[14px] font-bold text-[#102a43]",
  projectDescriptionClass: "mt-2 text-[12px] leading-6 text-[#486581]",
  projectTagClass:
    "rounded-md bg-[#ecfeff] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#0f766e]",
  projectActionClass:
    "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white bg-white/70 text-[#486581] transition hover:text-[#0f766e]",
  statusClass: {
    Live: "rounded-md border border-[#0f766e]/15 bg-[#0f766e]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0f766e]",
    WIP: "rounded-md border border-[#f59e0b]/20 bg-[#f59e0b]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#b45309]",
    "Open Source":
      "rounded-md border border-[#0284c7]/20 bg-[#0284c7]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0369a1]",
  },
  fallbackStatusClass:
    "rounded-md border border-white bg-white/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#486581]",
  showMoreClass:
    "mt-4 inline-flex items-center gap-1 text-[12px] font-bold text-[#0f766e] transition hover:text-[#102a43]",
  blogListClass: "grid gap-2",
  blogItemClass:
    "group flex items-center justify-between gap-4 rounded-lg border border-white/80 bg-white/62 p-4 text-[#486581] shadow-sm backdrop-blur transition hover:bg-white/85",
  blogTitleClass: "text-[14px] font-bold text-[#102a43]",
  blogDescriptionClass: "mt-1 text-[12px] leading-5 text-[#627d98] line-clamp-2",
  blogMetaClass: "text-[10px] font-bold uppercase tracking-[0.12em] text-[#829ab1]",
  stackShellClass:
    "relative overflow-hidden rounded-lg border border-white/80 bg-white/62 py-3 shadow-sm backdrop-blur",
  stackFadeLeftClass:
    "pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-white/90 to-transparent",
  stackFadeRightClass:
    "pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-white/90 to-transparent",
  stackTrackClass: "template6-ticker-track flex w-max gap-2",
  stackItemClass:
    "shrink-0 rounded-md border border-white/90 bg-white/72 px-3 py-1.5",
  stackTextClass: "text-[11px] font-bold text-[#486581]",
  footerCtaClass:
    "group flex items-center gap-4 rounded-lg border border-white/80 bg-[#102a43] p-4 text-white shadow-lg transition hover:bg-[#0f766e]",
  footerAvatarClass:
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/25 object-cover text-white",
  footerCtaTitleClass: "block text-[13px] font-bold",
  footerCtaTextClass: "mt-0.5 block text-[12px] leading-5 text-white/72",
  contactListClass: "grid gap-2 sm:grid-cols-3",
  contactItemClass:
    "group flex items-center gap-3 rounded-lg border border-white/80 bg-white/62 px-3 py-2.5 text-[#486581] shadow-sm backdrop-blur transition hover:bg-white hover:text-[#0f766e]",
  contactIconClass: "text-[#0f766e]",
  contactTextClass: "text-[12px] font-bold",
  footerClass:
    "mt-12 flex flex-col gap-2 border-t border-white/80 pt-6 sm:flex-row sm:items-center sm:justify-between",
  footerTextClass: "text-[11px] font-bold tracking-[0.12em] text-[#829ab1]",
  footerBrandClass: "text-[11px] font-bold tracking-[0.12em] text-[#0f766e]",
  iconSize: 14,
  iconStrokeWidth: 1.9,
};

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
      <h2 className={config.sectionTitleClass}>{children}</h2>
    </div>
  );
}

function StackTicker({
  stack,
  config,
}: {
  stack: { name: string }[];
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

export function Template6(props: ThemedPortfolioProps) {
  const { user, profile } = props;
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

  const hasQuickActions = links.length > 0 || Boolean(bookCallLink);
  const iconSize = config.iconSize ?? 14;
  const iconStrokeWidth = config.iconStrokeWidth ?? 1.8;

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
        
        .${config.key}-portfolio .template6-avatar {
          width: 210px !important;
          height: 210px !important;
        }
        
        @container (max-width: 920px) {
          .${config.key}-portfolio .lf-themed-hero {
            grid-template-columns: minmax(0, 1fr) !important;
            align-items: center !important;
            justify-items: center !important;
            text-align: center !important;
          }
          .${config.key}-portfolio .template6-avatar {
            width: 94px !important;
            height: 94px !important;
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

          {/* Hero Section: Avatar on Left, details on Right */}
          <section className={`lf-themed-hero ${config.heroClass}`}>
            {avatar && (
              <Image
                src={avatar}
                alt={name || "Profile avatar"}
                width={210}
                height={210}
                unoptimized
                className={config.avatarSoloClass}
              />
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
                <SectionHeading config={config}>Experience</SectionHeading>
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
                <SectionHeading config={config}>Proof of work</SectionHeading>
                <div className={`lf-themed-project-list ${config.projectListClass}`}>
                  {visibleProjects.map((project) => (
                    <article key={project.id} className={config.projectItemClass}>
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
                <SectionHeading config={config}>Thoughts and writings</SectionHeading>
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
                <SectionHeading config={config}>Skills</SectionHeading>
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
                    <span className={config.footerAvatarClass}></span>
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

          {/* Banner rendered in the footer instead of the hero, only for Template 6 */}
          {banner && (
            <div className={`lf-themed-banner ${config.bannerClass} mt-12 mb-6 w-full`}>
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

          <footer className={`lf-themed-footer ${config.footerClass}`}>
            <p className={config.footerBrandClass}>Built with lazyfolio</p>
          </footer>
        </div>
      </main>
    </>
  );
}
