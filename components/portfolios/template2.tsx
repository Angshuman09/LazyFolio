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
import { trackClick } from "@/lib/utils/track-click";

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


const statusStyle: Record<string, string> = {
  Live: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
  WIP: "text-amber-600 bg-amber-500/10 border-amber-500/20",
  "Open Source": "text-sky-600 bg-sky-500/10 border-sky-500/20",
};

const fallbackStatusStyle = "text-stone-500 bg-stone-500/10 border-stone-500/20";


const Divider = () => <div className="w-full h-px bg-stone-200/80 my-10" />;

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-md font-semibold text-stone-900 mb-6 tracking-tight">
    {children}
  </h2>
);

function StackTicker({ stack }: { stack: { name: string }[] }) {
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

          {/* ── QUOTE ── */}
          {quote && (
            <div className="mb-12 border-l-2 border-stone-300 pl-4">
              <p className="text-xs text-stone-500 italic leading-relaxed">
                {quote}
              </p>
            </div>
          )}

          {/* ── HERO ── */}
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
              <p className="text-xs text-stone-400 font-mono mb-5">{tagline}</p>
            )}
            {bio && (
              <p className="text-sm text-stone-600 leading-[1.8]">{bio}</p>
            )}
          </section>

          {/* ── QUICK LINKS ── */}
          {hasQuickActions && (
            <div className="flex flex-wrap gap-2 mb-4">
              {links.map((link) => (
                <Tooltip key={link.id}>
                  <TooltipTrigger asChild>
                    <Link
                      href={link.href}
                      target={shouldOpenInNewTab(link.href) ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      onClick={() => trackClick(profile?.id ?? undefined, link.label)}
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
                  target={shouldOpenInNewTab(bookCallLink) ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] text-stone-700 border border-stone-200 bg-stone-100 hover:bg-stone-200 transition-all duration-150 ml-auto font-medium"
                >
                  Book a call
                  <ArrowRight size={10} />
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
                <div className="space-y-8">
                  {experiences.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          {exp.company && (
                            <span className="text-sm font-semibold text-stone-900">
                              {exp.company}
                            </span>
                          )}
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
                              <span className="text-stone-300 shrink-0 select-none mt-0.5">•</span>
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

          {/* ── PROJECTS ── */}
          {projects.length > 0 && (
            <>
              <Divider />
              <section>
                <SectionHeading>Projects</SectionHeading>
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
                            <Link
                              href={project.github}
                              target={shouldOpenInNewTab(project.github) ? "_blank" : undefined}
                              rel="noopener noreferrer"
                              className="text-stone-400 hover:text-stone-600 transition-colors"
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
                              className="text-stone-400 hover:text-stone-600 transition-colors"
                              aria-label={project.name ? `${project.name} live link` : "Project live link"}
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

          {/* ── BLOGS ── */}
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
                        target={shouldOpenInNewTab(blog.url) ? "_blank" : undefined}
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

          {/* ── STACK ── */}
          {stack.length > 0 && (
            <>
              <Divider />
              <section>
                <SectionHeading>Skills</SectionHeading>
                {stack.length <= 8 ? (
                  <div className="relative overflow-hidden py-1 flex justify-start flex-wrap">
                    <div className="flex gap-3 w-max">
                      {stack.map((tech, i) => (
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
              <section className="mb-2">
                <Link
                  href={bookCallLink}
                  target={shouldOpenInNewTab(bookCallLink) ? "_blank" : undefined}
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

          {/* ── CONTACT LINKS ── */}
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
                      target={shouldOpenInNewTab(link.href) ? "_blank" : undefined}
                      onClick={() => trackClick(profile?.id ?? undefined, link.label)}
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

          {/* ── FOOTER ── */}
          <div className="mt-14 pt-6 border-t border-stone-200 flex items-center justify-between">
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
