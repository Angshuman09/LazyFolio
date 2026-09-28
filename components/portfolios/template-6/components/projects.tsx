import { normalizeProjects } from '../../shared/normalize';
import { ProfileData } from '../../shared/types';
import { ActionBtn, Divider, SectionLabel } from './utils';
import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';
import { getPortfolioSectionUrl } from '@/lib/utils/public-url';

const Projects = ({profile}: {profile:ProfileData}) => {
  const projects     = normalizeProjects(profile?.projects);
  const visible      = projects.slice(0, 3);

  return (
   <>
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
                            {project.date && (
                              <span className="text-[11px] font-mono text-[#3D5247]/70">
                                {project.date}
                              </span>
                            )}
                          </div>
                        </div>

                        {(project.github || project.demo) && (
                          <div className="flex gap-1 shrink-0">
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

                {projects.length > 3 && (
                  <Link
                    href={getPortfolioSectionUrl(profile?.username, "projects")}
                    className="mt-[14px] inline-flex items-center gap-[5px] text-xs font-bold text-[#C4622D] hover:text-[#1A3D2B] transition-colors duration-150"
                  >
                    <span>View all {projects.length} projects</span>
                    <ArrowRight size={11} strokeWidth={2.2} />
                  </Link>
                )}
              </section>
            </>
          )}

   </>
  )
}

export default Projects