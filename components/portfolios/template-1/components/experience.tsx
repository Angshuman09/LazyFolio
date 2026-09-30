import Link from "next/link"
import { MoveUpRight, ArrowRight } from "lucide-react"
import { PortfolioExperience } from "../../shared/types"
import { shouldOpenInNewTab } from "../../shared/utils"
import { Divider, SectionHeading } from "./utils"
import { getPortfolioSectionUrl } from "@/lib/utils/public-url"
import { usePortfolioSection } from "../../shared/context/portfolio-section-context"

const Experience = ({
  experiences,
  username,
  showAll = false,
  basePath = "",
}: {
  experiences: PortfolioExperience[];
  username?: string | null;
  showAll?: boolean;
  basePath?: string;
}) => {
  const sectionCtx = usePortfolioSection();
  const visibleExperiences = showAll ? experiences : experiences.slice(0, 3);
  const experienceHref = `${basePath}/experience`;

  if (!showAll && experiences.length === 0) return null;

  return (
    <>
    <Divider />
    <section>
      <SectionHeading>Professional Experience</SectionHeading>
      {experiences.length === 0 ? (
        <p className="text-xs text-zinc-500 italic py-6">No work experience listed yet.</p>
      ) : (
        <div className="space-y-8">
        {visibleExperiences.map((exp) => (
          <div key={exp.id}>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                {exp.company &&
                  (exp.companyUrl && exp.companyUrl !== "#" ? (
                    <Link
                      href={exp.companyUrl}
                      target={
                        shouldOpenInNewTab(exp.companyUrl)
                          ? "_blank"
                          : undefined
                      }
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1 text-sm font-semibold text-white hover:text-zinc-300 transition-colors"
                    >
                      {exp.company}
                      <MoveUpRight
                        size={10}
                        className="text-zinc-600 group-hover:text-zinc-400 transition-colors"
                      />
                    </Link>
                  ) : (
                    <span className="text-sm font-semibold text-white">
                      {exp.company}
                    </span>
                  ))}
                {exp.role && (
                  <p className="text-[11px] text-zinc-600 mt-0.5">
                    {exp.role}
                  </p>
                )}
              </div>
              {exp.period && (
                <span className="text-[10px] font-mono text-zinc-600 shrink-0 pt-0.5">
                  {exp.period}
                </span>
              )}
            </div>
            {exp.bullets.length > 0 && (
              <ul className="space-y-1.5">
                {exp.bullets.map((bullet, i) => (
                  <li
                    key={`${exp.id}-${i}`}
                    className="flex gap-2.5 text-[13px] text-zinc-400 leading-relaxed"
                  >
                    <span className="text-zinc-700 shrink-0 select-none mt-0.5">
                      •
                    </span>
                    {bullet}
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
          className="inline-flex items-center gap-1.5 mt-6 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors font-mono cursor-pointer"
        >
          <span>See all experience ({experiences.length})</span>
          <ArrowRight size={11} />
        </Link>
      )}
    </section>
  </>
  )
}

export default Experience