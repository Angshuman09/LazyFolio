import Link from 'next/link'
import { Github, ExternalLink, ArrowRight } from 'lucide-react'
import { Divider, SectionHeading } from './utils'
import { normalizeProjects } from '../../shared/normalize'
import { ProfileData } from '../../shared/types'
import { shouldOpenInNewTab } from '../../shared/utils'
import { usePortfolioSection } from '../../shared/context/portfolio-section-context'

const Projects = ({
  profile,
  showAll = false,
  basePath = "",
}: {
  profile: ProfileData;
  showAll?: boolean;
  basePath?: string;
}) => {
  const sectionCtx = usePortfolioSection();
  const projects = normalizeProjects(profile?.projects)
  const visibleProjects = showAll ? projects : projects.slice(0, 3)
  const projectsHref = `${basePath}/projects`;

  if (!showAll && projects.length === 0) return null;

  return (
    <>
      <Divider />
      <section>
        <SectionHeading>Projects</SectionHeading>
        {projects.length === 0 ? (
          <p className="text-xs text-stone-400 italic py-6">No projects added yet.</p>
        ) : (
          <div className="space-y-0.5">
              {visibleProjects.map((project) => (
                <div
                  key={project.id}
                  className="group flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-all duration-150"
                >

                  <div className="flex-1 min-w-0">
                    {(project.name || project.status || project.date) && (
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        {project.name && (
                          <span className="text-[13px] font-medium text-stone-800">
                            {project.name}
                          </span>
                        )}
                        {project.date && (
                          <span className="text-[11px] text-stone-400 font-mono">
                            {project.date}
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
                          target={
                            shouldOpenInNewTab(project.github)
                              ? "_blank"
                              : undefined
                          }
                          rel="noopener noreferrer"
                          className="text-stone-400 hover:text-stone-600 transition-colors"
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
                          className="text-stone-400 hover:text-stone-600 transition-colors"
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
          )}

            {!showAll && projects.length > 3 && (
              <Link
                href={projectsHref}
                onClick={(e) => {
                  if (sectionCtx?.onSectionChange) {
                    e.preventDefault();
                    sectionCtx.onSectionChange("projects");
                  }
                }}
                className="inline-flex items-center gap-1.5 mt-3 ml-3 text-[11px] text-stone-500 hover:text-stone-700 transition-colors font-mono cursor-pointer"
              >
                <span>See all projects ({projects.length})</span>
                <ArrowRight size={11} />
              </Link>
            )}
          </section>
    </>
  )
}

export default Projects