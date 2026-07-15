import { StackItem } from '../../shared/types'
import { Divider, SectionHeading } from './divider-sectionheading'
import { StackTicker } from './stack-ticker'

const Stack = ({stack}:{stack:StackItem[]}) => {
  return (
    <>
    <Divider />
    <section>
      <SectionHeading>Skills</SectionHeading>
      {stack.length <= 8 ? (
        <div className="relative overflow-hidden py-1 flex justify-start flex-wrap gap-3">
          {stack.map((tech, i) => (
            <div
              key={`${tech.name}-${i}`}
              className="flex items-center px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0"
            >
              <span className="text-[11px] text-zinc-500 whitespace-nowrap">
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
  )
}

export default Stack