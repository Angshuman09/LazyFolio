'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Github, ExternalLink } from 'lucide-react'
import { Divider, SectionHeading } from './utils'
import { normalizeProjects } from '../../shared/normalize'
import { ProfileData } from '../../shared/types'
import { shouldOpenInNewTab } from '../../shared/utils'

const Projects = ({ profile }: { profile: ProfileData }) => {
  const [showAll, setShowAll] = useState(false)

  const projects = normalizeProjects(profile?.projects)
  const visibleProjects = showAll ? projects : projects.slice(0, 4)

  return (
    <>
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
    </>
  )
}

export default Projects