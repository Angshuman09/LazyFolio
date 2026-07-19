
import { normalizeExperiences } from '../../shared/normalize';
import { ProfileData } from '../../shared/types';
import { Divider, SectionLabel } from './utils';

const Experience = ({profile}:{profile: ProfileData}) => {
  const experiences  = normalizeExperiences(profile?.experiences);
  return (
    <>
              {experiences.length > 0 && (
            <>
              <Divider />
              <section>
                <SectionLabel>Experience</SectionLabel>
                <div className="grid gap-[10px]">
                  {experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="rounded-[14px] border-[1.5px] border-[#D5E5DA] bg-[#EEF4F0] px-[22px] py-5 transition-shadow duration-150 hover:shadow-[0_6px_20px_rgba(26,61,43,0.10)]"
                    >
                      <div className="flex items-start justify-between gap-3 max-[580px]:flex-col max-[580px]:items-start">
                        <div>
                          {exp.company && (
                            <p className="text-[15px] font-bold text-[#1A3D2B] m-0">
                              {exp.company}
                            </p>
                          )}
                          {exp.role && (
                            <p className="mt-[3px] mb-0 text-xs font-semibold text-[#C4622D]">
                              {exp.role}
                            </p>
                          )}
                        </div>
                        {exp.period && (
                          <span className="flex-shrink-0 text-[11px] font-semibold text-[#7A9585] bg-[#D5E5DA] rounded-md px-[10px] py-[3px]">
                            {exp.period}
                          </span>
                        )}
                      </div>

                      {exp.bullets.length > 0 && (
                        <ul className="mt-[14px] mb-0 list-none p-0 flex flex-col gap-2">
                          {exp.bullets.map((b, i) => (
                            <li key={i} className="flex gap-[10px] text-[13px] leading-[1.7] text-[#3D5247]">
                              <span className="mt-[9px] w-[5px] h-[5px] flex-shrink-0 rounded-full bg-[#C4622D] block" />
                              <span>{b}</span>
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