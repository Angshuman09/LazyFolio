import { normalizeExperiences } from "../../shared/normalize";
import { ProfileData } from "../../shared/types";
import { SectionHeading } from "./utils";
import { shouldOpenInNewTab } from "../../shared/utils";
import Link from "next/link";
import { MoveUpRight, ArrowRight } from "lucide-react";
import { usePortfolioSection } from "../../shared/context/portfolio-section-context";

interface ExperienceProps {
  profile: ProfileData;
  showAll?: boolean;
  basePath?: string;
}

export default function Experience({
  profile,
  showAll = false,
  basePath = "",
}: ExperienceProps) {
  const sectionCtx = usePortfolioSection();
  const experiences = normalizeExperiences(profile?.experiences);
  const visibleExperiences = showAll ? experiences : experiences.slice(0, 4);
  const experienceHref = `${basePath}/experience`;

  if (!showAll && experiences.length === 0) return null;

  return (
    <section className="mt-16 sm:mt-20">
      <SectionHeading>Experience</SectionHeading>

      {experiences.length === 0 ? (
        <p className="text-sm text-neutral-500 italic py-4">No work experience listed yet.</p>
      ) : (
        <div className="-mx-4 space-y-1">
          {visibleExperiences.map((exp) => (
            <div
              key={exp.id}
              className="rounded-xl px-4 py-[14px] leading-relaxed transition-colors hover:bg-neutral-800/40"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  {exp.company &&
                    (exp.companyUrl && exp.companyUrl !== "#" ? (
                      <Link
                        href={exp.companyUrl}
                        target={shouldOpenInNewTab(exp.companyUrl) ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[15px] sm:text-[16px] font-normal text-neutral-100 hover:text-white underline underline-offset-4 decoration-neutral-700 hover:decoration-neutral-400 transition-colors"
                      >
                        {exp.company}
                        <MoveUpRight size={11} className="text-neutral-500" />
                      </Link>
                    ) : (
                      <span className="text-[15px] sm:text-[16px] font-normal text-neutral-100">
                        {exp.company}
                      </span>
                    ))}
                  {exp.role && (
                    <span className="text-[14px] text-neutral-400">
                      · {exp.role}
                    </span>
                  )}
                </div>
                {exp.period && (
                  <span className="text-[12px] text-neutral-500 font-mono shrink-0">
                    {exp.period}
                  </span>
                )}
              </div>

              {exp.bullets.length > 0 && (
                <ul className="mt-2 space-y-1.5">
                  {exp.bullets.map((bullet, i) => (
                    <li
                      key={`${exp.id}-${i}`}
                      className="flex items-start gap-2.5 text-[13.5px] text-neutral-400 leading-relaxed"
                    >
                      <span className="text-neutral-600 shrink-0 select-none mt-1 text-[10px]">
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
      )}

      {!showAll && experiences.length > 4 && (
        <Link
          href={experienceHref}
          onClick={(e) => {
            if (sectionCtx?.onSectionChange) {
              e.preventDefault();
              sectionCtx.onSectionChange("experience");
            }
          }}
          className="mt-4 text-[13px] text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer inline-flex items-center gap-1.5 px-4 tracking-wide"
        >
          <span>View all {experiences.length} experiences</span>
          <ArrowRight size={12} />
        </Link>
      )}
    </section>
  );
}
