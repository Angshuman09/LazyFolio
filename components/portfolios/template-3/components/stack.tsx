import React from 'react'
import { ProfileData } from '../../shared/types';
import { normalizeStack } from '../../shared/normalize';
import { Divider, SectionHeading, StackTicker } from './utils';

const Stack = ({profile}:{profile: ProfileData}) => {
  const stack = normalizeStack(profile?.skills);
  return (
    <>
    {stack.length > 0 && (
        <>
          <Divider />
          <section>
            <SectionHeading>Stack</SectionHeading>
            {stack.length <= 8 ? (
              <div className="relative overflow-hidden py-2 bg-white rounded-xl border border-slate-100 flex justify-start flex-wrap gap-2 px-3">
                {stack.map((tech, i) => (
                  <div
                    key={`${tech.name}-${i}`}
                    className="flex items-center px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 shrink-0"
                  >
                    <span className="text-[10.5px] text-slate-500 font-medium tracking-wider uppercase">
                      {tech.name}
                    </span>
                  </div>
                ))}
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