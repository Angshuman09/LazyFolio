import React from 'react'
import { Divider } from '../../shared/components/divider'
import { SectionHeading } from '../../shared/components/section-heading'
import { normalizeExperiences } from '../../shared/normalize';
import { ProfileData, TemplateThemeConfig } from '../../shared/types';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { usePortfolioSection } from '../../shared/context/portfolio-section-context';

const Experience = ({
  profile,
  config,
  showAll = false,
  basePath = "",
}: {
  profile: ProfileData;
  config: TemplateThemeConfig;
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
      <Divider config={config} />
      <section>
        <SectionHeading config={config}>Experience</SectionHeading>
        {experiences.length === 0 ? (
          <p className="text-sm italic py-6 opacity-60">No work experience listed yet.</p>
        ) : (
          <div className={config.experienceListClass}>
            {visibleExperiences.map((experience) => (
              <div key={experience.id} className={config.experienceItemClass}>
                <div className="lf-themed-experience-meta flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    {experience.company && (
                      <p className={config.companyClass}>
                        {experience.company}
                      </p>
                    )}
                    {experience.role && (
                      <p className={config.roleClass}>{experience.role}</p>
                    )}
                  </div>
                  {experience.period && (
                    <span className={config.periodClass}>
                      {experience.period}
                    </span>
                  )}
                </div>

                {experience.bullets.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {experience.bullets.map((bullet, index) => (
                      <li
                        key={`${experience.id}-${index}`}
                        className={config.bulletClass}
                      >
                        <span className={config.bulletMarkerClass} />
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
            className={config.showMoreClass}
          >
            <span>View all {experiences.length} experience</span>
            <ArrowRight size={11} strokeWidth={(config.iconStrokeWidth ?? 1.8) + 0.4} />
          </Link>
        )}
      </section>
    </>
  )
}

export default Experience