import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import { normalizeProjects } from "../../shared/normalize";
import type { ProfileData } from "../../shared/types";
import { shouldOpenInNewTab } from "../../shared/utils";
import { Empty, Section } from "./section";
import { MoreLink } from "./utils";

const actionClass =
  "inline-flex h-7 w-7 items-center justify-center rounded border border-[#e1e3e7] text-[#70727a] transition-colors duration-150 hover:border-[#9eb5e6] hover:text-[#255ac2]";

export default function Projects({
  profile,
  showAll = false,
  basePath = "",
}: {
  profile: ProfileData;
  showAll?: boolean;
  basePath?: string;
}) {
  const projects = normalizeProjects(profile?.projects);
  const visible = showAll ? projects : projects.slice(0, 4);

  if (!showAll && projects.length === 0) return null;

  return (
    <Section title="Projects">
      {projects.length === 0 ? (
        <Empty>Projects will appear here.</Empty>
      ) : (
        <div className="border-t border-[#e8e9ec]">
          {visible.map((project) => (
            <article
              key={project.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-[#e8e9ec] py-4.5 max-[620px]:gap-2.5"
            >
              <div className="min-w-0">
                <h3 className="m-0 text-[16px] font-semibold leading-[1.35] tracking-[-0.026em] text-[#22242a]">
                  {project.name || "Untitled project"}
                </h3>

                {project.description && (
                  <p className="mt-[5px] line-clamp-2 text-[14px] leading-[1.55] text-[#666870]">
                    {project.description}
                  </p>
                )}

                {project.tags.length > 0 && (
                  <div className="mt-[11px] flex flex-wrap gap-[5px]">
                    {project.tags.slice(0, 5).map((tag) => (
                      <span
                        key={tag}
                        className="font-mono rounded-[3px] border border-[#e1e3e7] px-1.5 py-[3px] text-[10px] leading-[1.25] text-[#777a83]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {(project.github || project.demo) && (
                <div className="flex gap-[7px] pt-px">
                  {project.github && (
                    <Link
                      href={project.github}
                      target={
                        shouldOpenInNewTab(project.github) ? "_blank" : undefined
                      }
                      rel="noopener noreferrer"
                      className={actionClass}
                      aria-label={`${project.name || "Project"} on GitHub`}
                    >
                      <Github size={14} strokeWidth={1.7} aria-hidden="true" />
                    </Link>
                  )}
                  {project.demo && (
                    <Link
                      href={project.demo}
                      target={
                        shouldOpenInNewTab(project.demo) ? "_blank" : undefined
                      }
                      rel="noopener noreferrer"
                      className={actionClass}
                      aria-label={`Open ${project.name || "project"} live`}
                    >
                      <ArrowUpRight size={13} strokeWidth={1.7} aria-hidden="true" />
                    </Link>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {!showAll && projects.length > visible.length && (
        <MoreLink href={basePath + "/projects"} section="projects">
          Browse all projects
        </MoreLink>
      )}
    </Section>
  );
}
