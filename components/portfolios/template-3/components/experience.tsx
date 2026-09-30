
import { normalizeExperiences } from '../../shared/normalize';
import { ProfileData } from '../../shared/types';
import { Divider, SectionHeading } from './utils';
import { shouldOpenInNewTab } from '../../shared/utils';
import Link from 'next/link';
import { MoveUpRight, ArrowRight } from 'lucide-react';
import { usePortfolioSection } from '../../shared/context/portfolio-section-context';

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
          <p className="text-sm text-slate-400 italic py-6">No work experience listed yet.</p>
        ) : (
          <div className="space-y-9">
            {visibleExperiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 mb-3">
                  <div>
                    {exp.company &&
                      (exp.companyUrl && exp.companyUrl !== "#" ? (
                        <Link
                          href={exp.companyUrl}
                          target={shouldOpenInNewTab(exp.companyUrl) ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[14px] font-semibold text-slate-900 hover:text-slate-600 transition-colors"
                        >
                          {exp.company}
                          <MoveUpRight size={11} className="text-slate-300" />
                        </Link>
                      ) : (
                        <span className="text-[14px] font-semibold text-slate-900">
                          {exp.company}
                        </span>
                      ))}
                    {exp.role && (
                      <p className="text-[12.5px] text-slate-400 mt-0.5">
                        {exp.role}
                      </p>
                    )}
                  </div>
                  {exp.period && (
                    <span className="text-[11px] text-slate-400 font-mono shrink-0">
                      {exp.period}
                    </span>
                  )}
                </div>

                {exp.bullets.length > 0 && (
                  <ul className="space-y-2">
                    {exp.bullets.map((bullet, i) => (
                      <li
                        key={`${exp.id}-${i}`}
                        className="flex gap-2.5 text-[13px] text-slate-500 leading-relaxed"
                      >
                        <span className="text-slate-300 shrink-0 select-none mt-[4px] text-[10px]">
                          —
                        </span>
                        <span>{bullet}</span>
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
            className="mt-6 text-[11px] font-medium text-slate-400 hover:text-slate-700 transition-colors cursor-pointer inline-flex items-center gap-1 tracking-wide"
          >
            <span>View all {experiences.length} experience</span>
            <ArrowRight size={11} />
          </Link>
        )}
      </section>
    </>
  )
}

export default Experience