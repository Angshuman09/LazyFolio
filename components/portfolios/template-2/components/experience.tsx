import { normalizeExperiences } from '../../shared/normalize';
import { ProfileData } from '../../shared/types'
import { Divider, SectionHeading } from './utils'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { usePortfolioSection } from '../../shared/context/portfolio-section-context'

const Experience = ({
  profile,
  showAll = false,
  basePath = "",
}: {
  profile: ProfileData;
  showAll?: boolean;
  basePath?: string;
}) => {
    const sectionCtx = usePortfolioSection();
    const experiences = normalizeExperiences(profile?.experiences);
    const visibleExperiences = showAll ? experiences : experiences.slice(0, 3);
    const experienceHref = `${basePath}/experience`;

    if (!showAll && experiences.length === 0) return null;

    return (
        <>
            <Divider />
            <section>
                <SectionHeading>Experience</SectionHeading>
                {experiences.length === 0 ? (
                    <p className="text-xs text-stone-400 italic py-6">No work experience listed yet.</p>
                ) : (
                    <div className="space-y-8">
                                {visibleExperiences.map((exp) => (
                                    <div key={exp.id}>
                                        <div className="flex items-start justify-between gap-2 mb-3">
                                            <div>
                                                {exp.company && (
                                                    <span className="text-sm font-semibold text-stone-900">
                                                        {exp.company}
                                                    </span>
                                                )}
                                                {exp.role && (
                                                    <p className="text-[11px] text-stone-500 mt-0.5">
                                                        {exp.role}
                                                    </p>
                                                )}
                                            </div>
                                            {exp.period && (
                                                <span className="text-[10px] font-mono text-stone-500 shrink-0 pt-0.5">
                                                    {exp.period}
                                                </span>
                                            )}
                                        </div>
                                        {exp.bullets.length > 0 && (
                                            <ul className="space-y-1.5">
                                                {exp.bullets.map((bullet, i) => (
                                                    <li
                                                        key={`${exp.id}-${i}`}
                                                        className="flex gap-2.5 text-[13px] text-stone-600 leading-relaxed"
                                                    >
                                                        <span className="text-stone-300 shrink-0 select-none mt-0.5">•</span>
                                                        {bullet}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {!showAll && experiences.length > 3 && (
                          <Link
                            href={experienceHref}
                            onClick={(e) => {
                              if (sectionCtx?.onSectionChange) {
                                e.preventDefault();
                                sectionCtx.onSectionChange("experience");
                              }
                            }}
                            className="inline-flex items-center gap-1.5 mt-6 text-[11px] text-stone-500 hover:text-stone-700 transition-colors font-mono cursor-pointer"
                          >
                            <span>See all experience ({experiences.length})</span>
                            <ArrowRight size={11} />
                          </Link>
                        )}
                    </section>
        </>
    )
}

export default Experience