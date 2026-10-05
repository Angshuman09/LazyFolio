import Link from "next/link";
import { ArrowRight, MoveUpRight } from "lucide-react";
import { normalizeExperiences } from "../../shared/normalize";
import { ProfileData } from "../../shared/types";
import { shouldOpenInNewTab } from "../../shared/utils";
import { Divider, SectionHeading } from "./utils";
import { usePortfolioSection } from "../../shared/context/portfolio-section-context";

const Experience = ({
  profile,
  showAll = false,
  basePath = "",
}: {
  profile: ProfileData;
  showAll?: boolean;
  basePath?: string;
}) => {
  const sectionCtx = usePortfolioSection();
  const experiences = normalizeExperiences(profile?.experiences);
  const visible = showAll ? experiences : experiences.slice(0, 3);
  const experienceHref = `${basePath}/experience`;

  if (!showAll && experiences.length === 0) return null;

  return (
    <>
      <Divider />
      <section>
        <SectionHeading>Experience</SectionHeading>
        {experiences.length === 0 ? (
          <p className="text-[13px] italic" style={{ color: "#9A8C7C" }}>
            No work experience listed yet.
          </p>
        ) : (
          <div className="space-y-8">
            {visible.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between gap-4 mb-2">
                  <div>
                    {exp.company && (
                      exp.companyUrl && exp.companyUrl !== "#" ? (
                        <Link
                          href={exp.companyUrl}
                          target={shouldOpenInNewTab(exp.companyUrl) ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[14.5px] font-medium transition-colors hover:text-[#184E42]"
                          style={{ color: "#1C1814" }}
                        >
                          {exp.company}
                          <MoveUpRight size={10} style={{ color: "#A0907E" }} />
                        </Link>
                      ) : (
                        <span className="text-[14.5px] font-medium" style={{ color: "#1C1814" }}>
                          {exp.company}
                        </span>
                      )
                    )}
                    {exp.role && (
                      <p className="text-[12px] mt-0.5" style={{ color: "#7A6C5D" }}>
                        {exp.role}
                      </p>
                    )}
                  </div>
                  {exp.period && (
                    <span
                      className="text-[11px] font-mono shrink-0 pt-0.5"
                      style={{ color: "#9E9080" }}
                    >
                      {exp.period}
                    </span>
                  )}
                </div>
                {exp.bullets.length > 0 && (
                  <ul className="space-y-1.5 mt-2">
                    {exp.bullets.map((bullet, i) => (
                      <li
                        key={`${exp.id}-${i}`}
                        className="flex gap-2.5 text-[13px] leading-relaxed"
                        style={{ color: "#5C5044" }}
                      >
                        <span
                          className="shrink-0 select-none mt-[3px] text-[10px]"
                          style={{ color: "#B5A898" }}
                        >
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

        {!showAll && experiences.length > 3 && (
          <Link
            href={experienceHref}
            onClick={(e) => {
              if (sectionCtx?.onSectionChange) {
                e.preventDefault();
                sectionCtx.onSectionChange("experience");
              }
            }}
            className="inline-flex items-center gap-1.5 mt-7 text-[11px] font-mono transition-colors cursor-pointer hover:underline"
            style={{ color: "#184E42" }}
          >
            <span>All experience ({experiences.length})</span>
            <ArrowRight size={11} />
          </Link>
        )}
      </section>
    </>
  );
};

export default Experience;
