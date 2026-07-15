import { normalizeStack } from '../../shared/normalize';
import { ProfileData } from '../../shared/types'
import { Divider, SectionHeading, StackTicker } from './utils'

const Stack = ({profile}:{profile: ProfileData}) => {
  const stack = normalizeStack(profile?.skills);
  return (
    <>
    {stack.length > 0 && (
            <>
              <Divider />
              <section>
                <SectionHeading>Skills</SectionHeading>
                {stack.length <= 8 ? (
                  <div className="relative overflow-hidden py-1 flex justify-start flex-wrap">
                    <div className="flex gap-3 w-max">
                      {stack.map((tech, i) => (
                        <div
                          key={`${tech.name}-${i}`}
                          className="flex items-center px-3 py-1.5 rounded-lg bg-white border border-stone-200 shrink-0"
                        >
                          <span className="text-[11px] text-stone-500 whitespace-nowrap font-medium">
                            {tech.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <StackTicker stack={stack} />
                )}
              </section>
            </>
          )}
    </>
  )
}

export default Stack