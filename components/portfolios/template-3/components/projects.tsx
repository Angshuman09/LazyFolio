import { normalizeProjects } from "../../shared/normalize";
import { ProfileData } from "../../shared/types";
import { SectionHeading } from "./utils";
import { shouldOpenInNewTab } from "../../shared/utils";
import Link from "next/link";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import { usePortfolioSection } from "../../shared/context/portfolio-section-context";

interface ProjectsProps {
  profile: ProfileData;
  showAll?: boolean;
  basePath?: string;
}

export default function Projects({
  profile,
  showAll = false,
  basePath = "",
}: ProjectsProps) {
  const sectionCtx = usePortfolioSection();
  const projects = normalizeProjects(profile?.projects);
  const visibleProjects = showAll ? projects : projects.slice(0, 4);
  const projectsHref = `${basePath}/projects`;

  if (!showAll && projects.length === 0) return null;

  return (
    <section className="mt-16 sm:mt-20">
      <SectionHeading>Projects</SectionHeading>

      {projects.length === 0 ? (
        <p className="text-sm text-neutral-500 italic py-4">No projects listed yet.</p>
      ) : (
        <div className="-mx-4 space-y-1">
          {visibleProjects.map((project) => {
            const mainLink = project.demo || project.github;

            const content = (
              <div className="group block rounded-xl px-4 py-[14px] leading-relaxed transition-colors hover:bg-neutral-800/40">
                <div className="flex items-center justify-between gap-3">
                  <span className="block text-[15px] sm:text-[16px] text-neutral-100 group-hover:text-white transition-colors">
                    {project.name}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    {project.date && (
                      <span className="text-[12px] text-neutral-500 font-mono">
                        {project.date}
                      </span>
                    )}
                    {(project.github || project.demo) && (
                      <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        {project.github && (
                          <span
                            className="text-neutral-400 hover:text-neutral-100 transition-colors p-0.5"
                            aria-label="GitHub repository"
                          >
                            <Github size={13} />
                          </span>
                        )}
                        {project.demo && (
                          <span
                            className="text-neutral-400 hover:text-neutral-100 transition-colors p-0.5"
                            aria-label="Live preview"
                          >
                            <ExternalLink size={13} />
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {project.description && (
                  <span className="block text-[14px] sm:text-[14.5px] text-neutral-400 leading-relaxed mt-1">
                    {project.description}
                  </span>
                )}

                {project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );

            return mainLink ? (
              <Link
                key={project.id}
                href={mainLink}
                target={shouldOpenInNewTab(mainLink) ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="block"
              >
                {content}
              </Link>
            ) : (
              <div key={project.id}>{content}</div>
            );
          })}
        </div>
      )}

      {!showAll && projects.length > 4 && (
        <Link
          href={projectsHref}
          onClick={(e) => {
            if (sectionCtx?.onSectionChange) {
              e.preventDefault();
              sectionCtx.onSectionChange("projects");
            }
          }}
          className="mt-4 text-[13px] text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer inline-flex items-center gap-1.5 px-4 tracking-wide"
        >
          <span>View all {projects.length} projects</span>
          <ArrowRight size={12} />
        </Link>
      )}
    </section>
  );
}
