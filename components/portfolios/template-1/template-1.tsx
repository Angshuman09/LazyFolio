"use client";

import { useState } from "react";
import {
  ExternalLink,
  ArrowRight,
  MoveUpRight,
  Github,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { trackClick } from "@/lib/utils/track-click";
import { ProfileData, UserData } from "./types/template.types";
import { addProfileContactLinks, cleanUrl, fallbackStatusStyle, getBookCallLink, shouldOpenInNewTab, statusStyle, textValue } from "./utils/template.utils";
import { normalizeBlogs, normalizeExperiences, normalizeLinks, normalizeProjects, normalizeStack } from "./utils/template.normalize";
import { getLinkIcon } from "./components/github-links";
import { Divider, SectionHeading } from "./components/divider-sectionheading";
import { StackTicker } from "./components/stack-ticker";

export function Template1({
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
      <main className="min-h-screen bg-[#0e0e0e] text-zinc-300 antialiased">
        <div className="max-w-160 mx-auto px-5 py-16 sm:py-20">
          {/* QUOTE */}
          {quote && (
            <div className="mb-12 border-l-2 border-zinc-700 pl-4">
              <p className="text-xs text-zinc-500 italic leading-relaxed">
                {quote}
              </p>
            </div>
          )}

          {/* HERO */}
          <section className="mb-8">
            {hasHeroMedia && (
              <div className="relative mb-14">
                {banner && (
                  <div className="relative h-38 sm:h-44 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
                    <Image
                      src={banner}
                      alt={name ? `${name} banner` : "Portfolio banner"}
                      fill
                      unoptimized
                      className="object-cover opacity-85"
                    />
                  </div>
                )}
                {avatar && (
                  <Image
                    src={avatar}
                    alt={name || "Profile avatar"}
                    width={46}
                    height={46}
                    unoptimized
                    className={
                      banner
                        ? "absolute left-3 -bottom-9 w-25 h-25 rounded-full object-cover "
                        : "w-14 h-14 rounded-2xl object-cover ring-1 ring-zinc-700"
                    }
                  />
                )}
              </div>
            )}
            {name && (
              <h1 className="text-xl font-bold text-white mb-1 tracking-tight">
                {name}
              </h1>
            )}
            {tagline && (
              <p className="text-xs text-zinc-600 font-mono mb-5">
                {tagline}
              </p>
            )}
            {bio && <p className="text-sm text-zinc-400 leading-[1.8]">{bio}</p>}
          </section>

          {/* QUICK LINKS */}
          {hasQuickActions && (
            <div className="flex flex-wrap gap-2 mb-4">
              {links.map((link) => (
                <Tooltip key={link.id}>
                  <TooltipTrigger asChild>
                    <Link
                      href={link.href}
                      onClick={() => trackClick(profile?.id ?? undefined, link.label)}
                      target={
                        shouldOpenInNewTab(link.href) ? "_blank" : undefined
                      }
                      rel="noopener noreferrer"
                      title={link.label}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md text-zinc-500 border border-zinc-800 bg-zinc-900/60 hover:border-zinc-600 hover:text-zinc-200 transition-all duration-150"
                    >
                      {getLinkIcon(link.label, link.href)}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white text-zinc-950 border border-zinc-200 [&_.bg-foreground]:bg-white [&_.fill-foreground]:fill-white">
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
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] text-zinc-300 border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 transition-all duration-150 ml-auto"
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
                              <Link
                                href={exp.companyUrl}
                                target={
                                  shouldOpenInNewTab(exp.companyUrl)
                                    ? "_blank"
                                    : undefined
                                }
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-1 text-sm font-semibold text-white hover:text-zinc-300 transition-colors"
                              >
                                {exp.company}
                                <MoveUpRight
                                  size={10}
                                  className="text-zinc-600 group-hover:text-zinc-400 transition-colors"
                                />
                              </Link>
                            ) : (
                              <span className="text-sm font-semibold text-white">
                                {exp.company}
                              </span>
                            ))}
                          {exp.role && (
                            <p className="text-[11px] text-zinc-600 mt-0.5">
                              {exp.role}
                            </p>
                          )}
                        </div>
                        {exp.period && (
                          <span className="text-[10px] font-mono text-zinc-600 shrink-0 pt-0.5">
                            {exp.period}
                          </span>
                        )}
                      </div>
                      {exp.bullets.length > 0 && (
                        <ul className="space-y-1.5">
                          {exp.bullets.map((bullet, i) => (
                            <li
                              key={`${exp.id}-${i}`}
                              className="flex gap-2.5 text-[13px] text-zinc-400 leading-relaxed"
                            >
                              <span className="text-zinc-700 shrink-0 select-none mt-0.5">
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
                      className="group flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800/60 transition-all duration-150"
                    >
                      {project.name && (
                        <div className="w-7 h-7 rounded-md bg-zinc-800 border border-zinc-700/60 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[10px] font-bold text-zinc-500 select-none">
                            {project.name[0]}
                          </span>
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        {(project.name || project.status) && (
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            {project.name && (
                              <span className="text-[13px] font-medium text-zinc-200">
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
                          <p className="text-[12px] text-zinc-500 leading-relaxed mb-1.5">
                            {project.description}
                          </p>
                        )}
                        {project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-600"
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
                              target={
                                shouldOpenInNewTab(project.github)
                                  ? "_blank"
                                  : undefined
                              }
                              rel="noopener noreferrer"
                              className="text-zinc-600 hover:text-zinc-300 transition-colors"
                              aria-label={
                                project.name
                                  ? `${project.name} source`
                                  : "Project source"
                              }
                            >
                              <Github size={12} />
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
                              className="text-zinc-600 hover:text-zinc-300 transition-colors"
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
                    className="mt-3 ml-3 text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer"
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
                            <p className="text-[13px] text-zinc-400 group-hover:text-zinc-200 transition-colors leading-snug">
                              {blog.title}
                            </p>
                          )}
                          {blog.description && (
                            <p className="text-[11px] text-zinc-600 leading-relaxed mt-1 line-clamp-2">
                              {blog.description}
                            </p>
                          )}
                        </div>
                        {(blog.readTime || blog.url) && (
                          <div className="flex items-center gap-2 shrink-0">
                            {blog.readTime && (
                              <span className="text-[10px] font-mono text-zinc-700">
                                {blog.readTime}
                              </span>
                            )}
                            {blog.url && (
                              <ArrowRight
                                size={10}
                                className="text-zinc-700 group-hover:text-zinc-500 group-hover:translate-x-0.5 transition-all"
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
                        className="group flex items-center justify-between px-3 py-3 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800/60 transition-all duration-150"
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
                <SectionHeading>Skills</SectionHeading>
                {stack.length <= 8 ? (
                  <div className="relative overflow-hidden py-1 flex justify-start flex-wrap gap-3">
                    {stack.map((tech, i) => (
                      <div
                        key={`${tech.name}-${i}`}
                        className="flex items-center px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0"
                      >
                        <span className="text-[11px] text-zinc-500 whitespace-nowrap">
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
                  className="group inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all duration-200"
                >
                  {avatar && (
                    <Image
                      src={avatar}
                      alt={name || "Profile avatar"}
                      width={24}
                      height={24}
                      unoptimized
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-zinc-700"
                    />
                  )}
                  <span className="text-[13px] text-zinc-400 group-hover:text-white transition-colors">
                    Book a Free Call
                  </span>
                  <ArrowRight
                    size={11}
                    className="text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all"
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
                      onClick={() => trackClick(profile?.id ?? undefined, link.label)}
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800/60 transition-all duration-150"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-zinc-500 group-hover:text-zinc-200 transition-colors">
                          {getLinkIcon(link.label, link.href)}
                        </span>
                        <span className="text-[13px] text-zinc-400 group-hover:text-zinc-200 transition-colors">
                          {link.label}
                        </span>
                      </div>
                      <MoveUpRight
                        size={11}
                        className="text-zinc-700 group-hover:text-zinc-500 transition-colors"
                      />
                    </Link>
                  ))}
                </div>
              </section>
            </>
          )}


          <div className="mt-14 pt-6 border-t border-zinc-800/60 flex items-center justify-between">
            <p className="text-[11px] text-zinc-700 font-mono">
              © {new Date().getFullYear()}
              {name ? ` ${name}` : ""}
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
