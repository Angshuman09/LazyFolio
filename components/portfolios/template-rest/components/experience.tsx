import React from 'react'
import { Divider } from '../../shared/components/divider'
import { SectionHeading } from '../../shared/components/section-heading'
import { normalizeExperiences } from '../../shared/normalize';
import { ProfileData, TemplateThemeConfig } from '../../shared/types';

const Experience = ({profile, config}:{profile: ProfileData, config: TemplateThemeConfig}) => {
  const experiences = normalizeExperiences(profile?.experiences);
  return (
    <>
              {experiences.length > 0 && (
            <>
              <Divider config={config} />
              <section>
                <SectionHeading config={config}>Experience</SectionHeading>
                <div className={config.experienceListClass}>
                  {experiences.map((experience) => (
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
              </section>
            </>
          )}
    </>
  )
}

export default Experience