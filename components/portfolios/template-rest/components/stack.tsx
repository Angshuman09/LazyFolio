
import { Divider } from '../../shared/components/divider'
import { SectionHeading } from '../../shared/components/section-heading'
import { StackTicker } from '../../shared/components/stack-ticker';
import { normalizeStack } from '../../shared/normalize';
import { ProfileData, TemplateThemeConfig } from '../../shared/types';

const Stack = ({profile, config}:{profile: ProfileData, config: TemplateThemeConfig}) => {
  const stack = normalizeStack(profile?.skills);
  return (
    <>
              {stack.length > 0 && (
            <>
              <Divider config={config} />
              <section>
                <SectionHeading config={config}>Skills</SectionHeading>
                {stack.length <= 8 ? (
                  <div className="flex flex-wrap gap-2 py-1">
                    {stack.map((tech, i) => (
                      <div key={`${tech.name}-${i}`} className={config.stackItemClass}>
                        <span className={config.stackTextClass}>{tech.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <StackTicker stack={stack} config={config} />
                )}
              </section>
            </>
          )}
    </>
  )
}

export default Stack