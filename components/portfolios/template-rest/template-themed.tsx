"use client";

import { useState } from "react";
import {
  ArrowRight,
  ExternalLink,
  Github,
} from "lucide-react";
import Image from "next/image"; 
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

import type { TemplateThemeConfig, ThemedPortfolioProps } from "../shared/types";
import {
  textValue,
  cleanUrl,
  shouldOpenInNewTab,
  getBookCallLink,
} from "../shared/utils";
import {
  normalizeLinks,
  normalizeExperiences,
  normalizeProjects,
  normalizeBlogs,
  normalizeStack,
} from "../shared/normalize";
import { getLinkIcon } from "../shared/link-icon";
import { SectionHeading } from "../shared/components/section-heading";
import { StackTicker } from "../shared/components/stack-ticker";
import { Divider } from "../shared/components/divider";

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

          {/* ── Hero ── */}
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

          {/* ── Quick links / Book a call ── */}
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
                      {getLinkIcon(link.label, link.href, iconSize, iconStrokeWidth)}
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

          {/* ── Experience ── */}
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

          {/* ── Projects ── */}
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
                            <Link
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
                            </Link>
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
                              <ExternalLink size={13} strokeWidth={iconStrokeWidth} />
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

          {/* ── Blogs ── */}
          {blogs.length > 0 && (
            <>
              <Divider config={config} />
              <section>
                <SectionHeading config={config}>
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

          {/* ── Skills / Stack ── */}
          {stack.length > 0 && (
            <>
              <Divider config={config} />
              <section>
                <SectionHeading config={config}>Skills</SectionHeading>
                {stack.length <= 8 ? (
                  <div className="flex flex-wrap gap-2 py-1">
                    {stack.map((tech, i) => (
                      <div key={`${tech.name}-${i}`} className={config.stackItemClass}>
                        <span className={config.stackTextClass}>{tech.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <StackTicker stack={stack} config={config} />
                )}
              </section>
            </>
          )}

          {/* ── Book a call CTA ── */}
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
                    <span className={config.footerAvatarClass} />
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

          <footer
            className={`lf-themed-footer flex justify-center items-center ${config.footerClass}`}
          >
            <p
              onClick={() => router.push("/")}
              className={config.footerBrandClass}
            >
              Built with lazyfolio
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
