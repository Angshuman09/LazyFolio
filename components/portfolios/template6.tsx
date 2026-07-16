"use client";

import { useState } from "react";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ThemedPortfolioProps } from "./shared/types";
import {
  cleanUrl,
  getBookCallLink,
  shouldOpenInNewTab,
  textValue,
} from "./shared/utils";
import {
  normalizeBlogs,
  normalizeExperiences,
  normalizeLinks,
  normalizeProjects,
  normalizeStack,
} from "./shared/normalize";
import { getLinkIcon } from "./shared/link-icon";

const STATUS_BADGE: Record<string, string> = {
  Live: "bg-[#D6F0E0] text-[#1A6638]",
  WIP: "bg-[#FDEFD7] text-[#92400E]",
  "Open Source": "bg-[#FAE8DC] text-[#C4622D]",
};
const FALLBACK_BADGE = "bg-[#D5E5DA] text-[#3D5247]";

/* ── Shared micro-components ── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-[18px]">
      <span className="text-[13px] font-bold tracking-widest text-[#7A9585] whitespace-nowrap">
        {children}
      </span>
      <span className="flex-1 h-[1.5px] bg-[#D5E5DA] rounded-[1px]" />
    </div>
  );
}

function Divider() {
  return <div className="my-10 h-[1.5px] bg-[#D5E5DA] rounded-[1px]" />;
}

function ActionBtn({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex items-center justify-center w-[30px] h-[30px] rounded-lg border-[1.5px] border-[#D5E5DA] bg-[#F3F8F5] text-[#7A9585] transition-colors duration-150 no-underline hover:border-[#C4622D] hover:text-[#C4622D]"
    >
      {children}
    </Link>
  );
}

/* ══════════════════════════════════════════════════════════════════
   TEMPLATE 6
══════════════════════════════════════════════════════════════════ */
export function Template6(props: ThemedPortfolioProps) {
  const { user, profile } = props;
  const [showAll, setShowAll] = useState(false);

  const name         = textValue(profile?.name)   || textValue(user?.name);
  const quote        = textValue(profile?.quote);
  const tagline      = textValue(profile?.tagline);
  const bio          = textValue(profile?.bio);
  const avatar       = cleanUrl(profile?.avatar)  || cleanUrl(user?.image);
  const banner       = cleanUrl(profile?.banner);
  const links        = normalizeLinks(profile?.links);
  const experiences  = normalizeExperiences(profile?.experiences);
  const projects     = normalizeProjects(profile?.projects);
  const blogs        = normalizeBlogs(profile?.blogs);
  const stack        = normalizeStack(profile?.skills);
  const bookCallLink = getBookCallLink(profile);
  const visible      = showAll ? projects : projects.slice(0, 4);

  return (
    <>


      <main
        className="min-h-screen bg-[#FDF6EC] text-[#1A3D2B]"
        style={{ fontFamily: "'DM Sans', system-ui, sans-serif", containerType: "inline-size" }}
      >
        <div className="max-w-[700px] mx-auto px-[22px] pt-10 pb-20">

          {/* ── Quote bar ── */}
          {quote && (
            <p className="mb-6 py-[13px] pl-5 pr-[18px] border-l-[3px] border-[#C4622D] bg-[#FAE8DC] rounded-r-[10px] text-[13px] leading-[1.75] text-[#7A4020] italic">
              &ldquo;{quote}&rdquo;
            </p>
          )}

          {/* ══════════════════════════════════════
              HERO — banner at top, avatar overlaps
          ══════════════════════════════════════ */}
          <section className="mb-5 rounded-[20px] border-[1.5px] border-[#D5E5DA] bg-[#EEF4F0] overflow-hidden shadow-[0_4px_24px_rgba(26,61,43,0.07)]">

            {/* Banner */}
            {banner ? (
              <div className="relative h-[180px] overflow-hidden">
                <Image
                  src={banner}
                  alt={name ? `${name} banner` : "Banner"}
                  fill unoptimized
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[45%] to-[rgba(26,61,43,0.28)]" />
              </div>
            ) : (
              /* Fallback decorative strip */
              <div className="h-[158px] bg-[#1A3D2B] relative overflow-hidden">
                <div className="absolute -top-[50px] -right-[50px] w-[220px] h-[220px] rounded-full bg-[rgba(196,98,45,0.22)]" />
                <div className="absolute -bottom-10 left-[50px] w-[140px] h-[140px] rounded-full bg-[rgba(196,98,45,0.13)]" />
                <div className="absolute top-[30px] -left-[25px] w-[90px] h-[90px] rounded-full bg-[rgba(238,244,240,0.07)]" />
              </div>
            )}

            {/* Avatar + text body */}
            <div className="px-[26px] pb-7 relative z-40">
              {avatar ? (
                <div className="mt-[-38px] mb-[14px]">
                  <Image
                    src={avatar}
                    alt={name || "Avatar"}
                    width={82} height={82}
                    unoptimized
                    className="rounded-[14px] border-[3px] border-[#C4622D] object-cover block shadow-[0_4px_18px_rgba(196,98,45,0.22)]"
                  />
                </div>
              ) : (
                <div className="h-[18px]" />
              )}

              {name && (
                <h1 className="text-[40px] max-[580px]:text-[26px] font-extrabold tracking-[-0.025em] leading-[1.05] text-[#1A3D2B] m-0">
                  {name}
                </h1>
              )}

              {tagline && (
                <p className="mt-2 mb-0 text-[11px] font-bold tracking-[0.18em] uppercase text-[#C4622D]">
                  {tagline}
                </p>
              )}

              {bio && (
                <p className="mt-[14px] mb-0 text-sm leading-[1.85] text-[#3D5247] max-w-[520px]">
                  {bio}
                </p>
              )}
            </div>
          </section>

          {/* ── Quick links + CTA ── */}
          {(links.length > 0 || bookCallLink) && (
            <div className="flex flex-wrap items-center gap-2 mb-11">
              {links.map((link) => (
                <Tooltip key={link.id}>
                  <TooltipTrigger asChild>
                    <Link
                      href={link.href}
                      target={shouldOpenInNewTab(link.href) ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-[38px] h-[38px] rounded-[10px] border-[1.5px] border-[#D5E5DA] bg-[#EEF4F0] text-[#3D5247] transition-colors duration-150 no-underline hover:bg-[#D5E5DA] hover:text-[#1A3D2B]"
                    >
                      {getLinkIcon(link.label, link.href, 14, 1.8)}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent><p>{link.label}</p></TooltipContent>
                </Tooltip>
              ))}

              {bookCallLink && (
                <Link
                  href={bookCallLink}
                  target={shouldOpenInNewTab(bookCallLink) ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center gap-[6px] h-[38px] px-[18px] rounded-[10px] bg-[#1A3D2B] text-[#FDF6EC] text-xs font-bold transition-colors duration-150 no-underline hover:bg-[#C4622D]"
                >
                  Book a call
                  <ArrowRight size={12} strokeWidth={2.2} />
                </Link>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════
              EXPERIENCE
          ══════════════════════════════════════ */}
          {experiences.length > 0 && (
            <>
              <Divider />
              <section>
                <SectionLabel>Experience</SectionLabel>
                <div className="grid gap-[10px]">
                  {experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="rounded-[14px] border-[1.5px] border-[#D5E5DA] bg-[#EEF4F0] px-[22px] py-5 transition-shadow duration-150 hover:shadow-[0_6px_20px_rgba(26,61,43,0.10)]"
                    >
                      <div className="flex items-start justify-between gap-3 max-[580px]:flex-col max-[580px]:items-start">
                        <div>
                          {exp.company && (
                            <p className="text-[15px] font-bold text-[#1A3D2B] m-0">
                              {exp.company}
                            </p>
                          )}
                          {exp.role && (
                            <p className="mt-[3px] mb-0 text-xs font-semibold text-[#C4622D]">
                              {exp.role}
                            </p>
                          )}
                        </div>
                        {exp.period && (
                          <span className="flex-shrink-0 text-[11px] font-semibold text-[#7A9585] bg-[#D5E5DA] rounded-md px-[10px] py-[3px]">
                            {exp.period}
                          </span>
                        )}
                      </div>

                      {exp.bullets.length > 0 && (
                        <ul className="mt-[14px] mb-0 list-none p-0 flex flex-col gap-2">
                          {exp.bullets.map((b, i) => (
                            <li key={i} className="flex gap-[10px] text-[13px] leading-[1.7] text-[#3D5247]">
                              <span className="mt-[9px] w-[5px] h-[5px] flex-shrink-0 rounded-full bg-[#C4622D] block" />
                              <span>{b}</span>
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

          {/* ══════════════════════════════════════
              PROJECTS
          ══════════════════════════════════════ */}
          {projects.length > 0 && (
            <>
              <Divider />
              <section>
                <SectionLabel>Proof of work</SectionLabel>
                <div className="grid grid-cols-2 max-[580px]:grid-cols-1 gap-[10px]">
                  {visible.map((project) => (
                    <article
                      key={project.id}
                      className="rounded-[14px] border-[1.5px] border-[#D5E5DA] bg-[#EEF4F0] px-[18px] py-4 flex flex-col gap-[10px] transition-all duration-150 hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(26,61,43,0.11)]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-[6px]">
                            {project.name && (
                              <h3 className="text-sm font-bold text-[#1A3D2B] m-0">
                                {project.name}
                              </h3>
                            )}
                            {/* {project.status && (
                              <span
                                className={`rounded-[20px] px-[9px] py-[2px] text-[10px] font-bold tracking-[0.06em] uppercase ${
                                  STATUS_BADGE[project.status] ?? FALLBACK_BADGE
                                }`}
                              >
                                {project.status}
                              </span>
                            )} */}

                            {/* <div>{project.enddate as string}</div> */}
                          </div>
                        </div>

                        {(project.github || project.demo) && (
                          <div className="flex gap-1 flex-shrink-0">
                            {project.github && (
                              <ActionBtn href={project.github} label={`${project.name ?? "Project"} source`}>
                                <Github size={13} strokeWidth={1.8} />
                              </ActionBtn>
                            )}
                            {project.demo && (
                              <ActionBtn href={project.demo} label={`${project.name ?? "Project"} live`}>
                                <ExternalLink size={13} strokeWidth={1.8} />
                              </ActionBtn>
                            )}
                          </div>
                        )}
                      </div>

                      {project.description && (
                        <p className="text-xs leading-[1.75] text-[#3D5247] m-0">
                          {project.description}
                        </p>
                      )}

                      {project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-[5px] mt-auto">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md border border-[#C9DFCF] bg-[#DFF0E5] px-2 py-[2px] text-[10px] font-semibold tracking-[0.05em] uppercase text-[#2D6644]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </div>

                {projects.length > 4 && (
                  <button
                    onClick={() => setShowAll((v) => !v)}
                    className="mt-[14px] inline-flex items-center gap-[5px] text-xs font-bold text-[#C4622D] bg-transparent border-none cursor-pointer p-0 transition-colors duration-150 hover:text-[#1A3D2B]"
                  >
                    {showAll ? "Show less" : `View all ${projects.length}`}
                    <ArrowRight size={11} strokeWidth={2.2} />
                  </button>
                )}
              </section>
            </>
          )}

          {/* ══════════════════════════════════════
              BLOG
          ══════════════════════════════════════ */}
          {blogs.length > 0 && (
            <>
              <Divider />
              <section>
                <SectionLabel>Thoughts &amp; writings</SectionLabel>
                <div className="grid gap-2">
                  {blogs.map((blog) => {
                    const rowClass =
                      "flex items-center justify-between gap-3 rounded-xl border-[1.5px] border-[#D5E5DA] bg-[#EEF4F0] px-4 py-[14px] no-underline text-inherit transition-colors duration-150 hover:bg-[#E3EDE7]";

                    const inner = (
                      <>
                        <div className="min-w-0 flex-1">
                          {blog.title && (
                            <p className="text-sm font-semibold text-[#1A3D2B] m-0">
                              {blog.title}
                            </p>
                          )}
                          {blog.description && (
                            <p className="mt-[3px] mb-0 text-xs leading-[1.65] text-[#3D5247] line-clamp-2">
                              {blog.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 pl-3 flex-shrink-0">
                          {blog.readTime && (
                            <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#7A9585]">
                              {blog.readTime}
                            </span>
                          )}
                          {blog.url && <ArrowRight size={12} strokeWidth={1.8} color="#C4622D" />}
                        </div>
                      </>
                    );

                    return blog.url ? (
                      <Link
                        key={blog.id}
                        href={blog.url}
                        target={shouldOpenInNewTab(blog.url) ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className={rowClass}
                      >
                        {inner}
                      </Link>
                    ) : (
                      <div key={blog.id} className={rowClass}>{inner}</div>
                    );
                  })}
                </div>
              </section>
            </>
          )}

          {/* ══════════════════════════════════════
              STACK / SKILLS
          ══════════════════════════════════════ */}
          {stack.length > 0 && (
            <>
              <Divider />
              <section>
                <SectionLabel>Skills</SectionLabel>
                {stack.length <= 8 ? (
                  <div className="flex flex-wrap gap-2">
                    {stack.map((tech, i) => (
                      <div
                        key={`${tech.name}-${i}`}
                        className="rounded-lg border-[1.5px] border-[#D5E5DA] bg-[#EEF4F0] px-[14px] py-[6px]"
                      >
                        <span className="text-xs font-semibold text-[#3D5247]">{tech.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="relative overflow-hidden rounded-xl border-[1.5px] border-[#D5E5DA] bg-[#EEF4F0] py-[10px]">
                    <div className="pointer-events-none absolute top-0 left-0 bottom-0 w-12 z-10 bg-gradient-to-r from-[#EEF4F0] to-transparent" />
                    <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-12 z-10 bg-gradient-to-l from-[#EEF4F0] to-transparent" />
                    <div className="t6-ticker flex w-max gap-2">
                      {[...stack, ...stack].map((tech, i) => (
                        <div
                          key={i}
                          className="flex-shrink-0 rounded-[7px] border-[1.5px] border-[#D5E5DA] bg-[#F3F8F5] px-[14px] py-[5px]"
                        >
                          <span className="text-[11px] font-semibold text-[#3D5247]">{tech.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            </>
          )}

          {bookCallLink && (
            <>
              <Divider />
              <section>
                <Link
                  href={bookCallLink}
                  target={shouldOpenInNewTab(bookCallLink) ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-2xl bg-[#1A3D2B] px-6 py-5 no-underline text-[#FDF6EC] transition-colors duration-150 hover:bg-[#C4622D]"
                >
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={name || "Avatar"}
                      width={46} height={46}
                      unoptimized
                      className="rounded-[10px] border-2 border-[rgba(196,98,45,0.55)] object-cover shrink-0"
                    />
                  ) : (
                    <span className="w-[46px] h-[46px] rounded-[10px] flex-shrink-0 border-2 border-[rgba(253,246,236,0.2)] block" />
                  )}
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-bold text-[#FDF6EC]">
                      Let&apos;s talk
                    </span>
                    <span className="block mt-1 text-xs leading-[1.55] text-[rgba(253,246,236,0.62)]">
                      Book a slot to discuss a project or collaboration.
                    </span>
                  </span>
                  <ArrowRight size={16} strokeWidth={2} color="#FAE8DC" className="flex-shrink-0" />
                </Link>
              </section>
            </>
          )}

          {/* ── Footer ── */}
          <footer className="mt-14 pt-6 border-t-[1.5px] border-[#D5E5DA] flex items-center justify-between gap-3 max-[580px]:flex-col max-[580px]:items-start">
            <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#7A9585] m-0">
              Built with Lazyfolio
            </p>
          </footer>

        </div>
      </main>
    </>
  );
}