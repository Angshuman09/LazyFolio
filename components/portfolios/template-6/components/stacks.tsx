
import { normalizeStack } from '../../shared/normalize';
import { ProfileData } from '../../shared/types';
import { Divider, SectionLabel } from './utils';

const Stacks = ({profile}:{profile: ProfileData}) => {
  const stack = normalizeStack(profile?.skills);
  return (
    <>
              {stack.length > 0 && (
            <>
              <Divider />
              <section>
                <SectionLabel>Skills</SectionLabel>
                {stack.length <= 8 ? (
                  <div className="flex flex-wrap gap-2">
                    {stack.map((tech, i) => (
                      <div
                        key={`${tech.name}-${i}`}
                        className="rounded-lg border-[1.5px] border-[#D5E5DA] bg-[#EEF4F0] px-[14px] py-[6px]"
                      >
                        <span className="text-xs font-semibold text-[#3D5247]">{tech.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="relative overflow-hidden rounded-xl border-[1.5px] border-[#D5E5DA] bg-[#EEF4F0] py-[10px]">
                    <div className="pointer-events-none absolute top-0 left-0 bottom-0 w-12 z-10 bg-gradient-to-r from-[#EEF4F0] to-transparent" />
                    <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-12 z-10 bg-gradient-to-l from-[#EEF4F0] to-transparent" />
                    <div className="t6-ticker flex w-max gap-2">
                      {[...stack, ...stack].map((tech, i) => (
                        <div
                          key={i}
                          className="flex-shrink-0 rounded-[7px] border-[1.5px] border-[#D5E5DA] bg-[#F3F8F5] px-[14px] py-[5px]"
                        >
                          <span className="text-[11px] font-semibold text-[#3D5247]">{tech.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            </>
          )}
    </>
  )
}

export default Stacks