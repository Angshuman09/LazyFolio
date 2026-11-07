import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";
import { normalizeProjects } from "../../shared/normalize";
import type { ProfileData } from "../../shared/types";
import { shouldOpenInNewTab } from "../../shared/utils";
import { Empty, Section } from "./section";
import { MoreLink } from "./utils";

const actionClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-md text-[#92929a] transition-colors duration-150 hover:bg-[#f5f5f6] hover:text-[#1b1bff]";

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
    <Section id="lf-t4-projects-title" title="Projects">
      {projects.length === 0 ? (
        <Empty>Projects will appear here.</Empty>
      ) : (
        <div className="border-t border-[#ececef]">
          {visible.map((project) => (
            <article
              key={project.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 border-b border-[#ececef] py-4"
            >
              <div className="min-w-0">
                <h3 className="m-0 text-[16px] font-medium leading-[1.35] tracking-[-0.025em] text-[#19191b]">
                  {project.name || "Untitled project"}
                </h3>

                {project.description && (
                  <p className="mt-1.5 line-clamp-2 text-[14px] leading-[1.52] text-[#6d6d75]">
                    {project.description}
                  </p>
                )}

                {project.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#8a8a92]">
                    {project.tags.slice(0, 5).map((tag, index) => (
                      <span key={tag} className="inline-flex items-center gap-2">
                        {index > 0 && (
                          <span className="text-[#c1c1c6]" aria-hidden="true">
                            ·
                          </span>
                        )}
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {(project.github || project.demo) && (
                <div className="flex items-center gap-1">
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
                      <Github size={16} strokeWidth={1.7} aria-hidden="true" />
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
                      <ExternalLink size={15} strokeWidth={1.7} aria-hidden="true" />
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
          See more
        </MoreLink>
      )}
    </Section>
  );
}
