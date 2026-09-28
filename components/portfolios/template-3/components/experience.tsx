
import { normalizeExperiences } from '../../shared/normalize';
import { ProfileData } from '../../shared/types';
import { Divider, SectionHeading } from './utils';
import { shouldOpenInNewTab } from '../../shared/utils';
import Link from 'next/link';
import { MoveUpRight, ArrowRight } from 'lucide-react';
import { getPortfolioSectionUrl } from '@/lib/utils/public-url';

const Experience = ({profile}:{profile:ProfileData}) => {
  const experiences = normalizeExperiences(profile?.experiences);
  const visibleExperiences = experiences.slice(0, 3);
  return (
    <>
              {experiences.length > 0 && (
            <>
              <Divider />
              <section>
                <SectionHeading>Experience</SectionHeading>
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

                {experiences.length > 3 && (
                  <Link
                    href={getPortfolioSectionUrl(profile?.username, "experience")}
                    className="mt-6 text-[11px] font-medium text-slate-400 hover:text-slate-700 transition-colors cursor-pointer inline-flex items-center gap-1 tracking-wide"
                  >
                    <span>View all {experiences.length} experience</span>
                    <ArrowRight size={11} />
                  </Link>
                )}
              </section>
            </>
          )}
    </>
  )
}

export default Experience