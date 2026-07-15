import { useState } from 'react'
import { normalizeProjects } from '../../shared/normalize';
import { ProfileData } from '../../shared/types';
import { Divider, fallbackStatusStyle, SectionHeading, statusColors } from './utils';
import { shouldOpenInNewTab } from '../../shared/utils';
import Link from 'next/link';
import { ExternalLink, Github } from 'lucide-react';

const Projects = ({profile}:{profile: ProfileData}) => {
  const [showAll, setShowAll] = useState(false);
  const projects = normalizeProjects(profile?.projects);
  const visibleProjects = showAll ? projects : projects.slice(0, 4);
  return (
    <>
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
    </>
  )
}

export default Projects