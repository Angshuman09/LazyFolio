"use client";

import { useState } from "react";
import {
  ArrowRight,
  ExternalLink,
  Github,
  MoveUpRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

import type { ProfileData, UserData } from "./shared/types";
import {
  textValue,
  cleanUrl,
  shouldOpenInNewTab,
  addProfileContactLinks,
  getBookCallLink,
} from "./shared/utils";
import {
  normalizeLinks,
  normalizeExperiences,
  normalizeProjects,
  normalizeBlogs,
  normalizeStack,
} from "./shared/normalize";
import { getLinkIcon } from "./shared/link-icon";

// ─── Template-local styles (slate/minimal palette specific to Template3) ──────

const statusColors: Record<string, string> = {
  Live:          "text-slate-500 bg-slate-100 border-slate-200",
  WIP:           "text-slate-500 bg-slate-100 border-slate-200",
  "Open Source": "text-slate-500 bg-slate-100 border-slate-200",
};
const fallbackStatusStyle = "text-slate-400 bg-slate-50 border-slate-150";

// ─── Local sub-components (template-specific styling) ────────────────────────

const Divider = () => (
  <div className="w-full h-px bg-slate-100 my-12" />
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-6">
    {children}
  </h2>
);

function StackTicker({ stack }: { stack: { name: string }[] }) {
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

function Footer() {
  return (
    <footer className="pb-5">
      <div className="flex items-center justify-center gap-2 select-none">
        <span className="text-[10px] font-medium text-slate-300 tracking-wide">
          Built with
        </span>
        <Link
          href={`http://${process.env.NEXT_PUBLIC_SITE_URL}`}
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

// ─── Template3 ────────────────────────────────────────────────────────────────

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

          {/* ── HERO ── */}
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

          {/* ── QUICK LINKS ── */}
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

          {/* ── EXPERIENCE ── */}
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
                        <ul className="space-y-2">
                          {exp.bullets.map((bullet, i) => (
                            <li
                              key={`${exp.id}-${i}`}
                              className="flex gap-2.5 text-[13px] text-slate-500 leading-relaxed"
                            >
                              <span className="text-slate-300 shrink-0 select-none mt-[4px] text-[10px]">
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

          {/* ── PROJECTS ── */}
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

          {/* ── BLOGS ── */}
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
                            <ArrowRight
                              size={11}
                              className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all duration-150"
                            />
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
                      <div
                        key={blog.id}
                        className="group flex items-center justify-between py-3.5 border-b border-slate-100 last:border-b-0"
                      >
                        {inner}
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          )}

          {/* ── STACK ── */}
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

          {/* ── BOOK A CALL ── */}
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
                      Let&apos;s build together
                    </p>
                    <p className="text-[12px] text-slate-400 mt-0.5">
                      Book a slot on my calendar to talk.
                    </p>
                  </div>
                  <ArrowRight
                    size={13}
                    className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all duration-150 shrink-0"
                  />
                </Link>
              </section>
            </>
          )}

          {/* ── QUOTE ── */}
          {quote && (
            <div className="mt-16 flex flex-col items-start gap-3">
              <p className="text-[14px] md:whitespace-nowrap text-slate-400 italic leading-relaxed max-w-sm border-l-2 border-slate-100 pl-4">
                {quote}
              </p>
            </div>
          )}
        </div>
        <Footer />
      </main>
    </>
  );
}