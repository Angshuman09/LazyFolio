'use client'

import { useState } from 'react'
import { Divider, SectionHeading } from './divider-sectionheading'
import { ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';
import { PortfolioProject } from '../../shared/types';
import { shouldOpenInNewTab } from '../../shared/utils';
import { fallbackStatusStyle, statusStyle } from '../utils/template.utils';

const Projects = ({projects}:{projects:PortfolioProject[]}) => {
  const [showAll, setShowAll] = useState(false);
  const visibleProjects = showAll ? projects : projects.slice(0, 4);
  return (
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
  )
}

export default Projects