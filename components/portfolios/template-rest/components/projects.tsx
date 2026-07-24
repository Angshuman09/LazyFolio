import { useState } from "react";
import { normalizeProjects } from "../../shared/normalize";
import { ProfileData, TemplateThemeConfig } from "../../shared/types";
import { Divider } from "../../shared/components/divider";
import { SectionHeading } from "../../shared/components/section-heading";
import Link from "next/link";
import { shouldOpenInNewTab } from "../../shared/utils";
import { ArrowRight, ExternalLink, Github } from "lucide-react";

const Projects = ({profile, config, iconStrokeWidth}:{profile: ProfileData, config: TemplateThemeConfig, iconStrokeWidth: number}) => {
  const [showAll, setShowAll] = useState(false);
  const projects = normalizeProjects(profile?.projects);
  const visibleProjects = showAll ? projects : projects.slice(0, 4);

  return (
    <>
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
                          {project.date && (
                            <span className="text-[11px] font-mono text-zinc-500">
                              {project.date}
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

    </>
  )
}

export default Projects