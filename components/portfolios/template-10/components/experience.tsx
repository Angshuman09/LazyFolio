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

  const seeAll = !showAll && experiences.length > 3 && (
    <Link
      href={experienceHref}
      onClick={(e) => {
        if (sectionCtx?.onSectionChange) {
          e.preventDefault();
          sectionCtx.onSectionChange("experience");
        }
      }}
      className="text-[12px] cursor-pointer transition-colors hover:text-[#1e3a8a]"
      style={{ color: "#1D4ED8" }}
    >
      See all →
    </Link>
  );

  return (
    <>
      <Divider />
      <section>
        <SectionHeading action={seeAll}>Experience</SectionHeading>
        {experiences.length === 0 ? (
          <p className="text-[13px]" style={{ color: "#9CA3AF" }}>
            No experience listed yet.
          </p>
        ) : (
          <div className="space-y-7">
            {visible.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    {exp.company && (
                      exp.companyUrl && exp.companyUrl !== "#" ? (
                        <Link
                          href={exp.companyUrl}
                          target={shouldOpenInNewTab(exp.companyUrl) ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[14px] font-semibold transition-colors hover:text-[#1D4ED8]"
                          style={{ color: "#0F0F0F" }}
                        >
                          {exp.company}
                          <MoveUpRight size={10} style={{ color: "#9CA3AF" }} />
                        </Link>
                      ) : (
                        <span className="text-[14px] font-semibold" style={{ color: "#0F0F0F" }}>
                          {exp.company}
                        </span>
                      )
                    )}
                    {exp.role && (
                      <span className="text-[12.5px]" style={{ color: "#9CA3AF" }}>
                        {exp.role}
                      </span>
                    )}
                  </div>
                  {exp.period && (
                    <span
                      className="text-[11px] font-mono shrink-0"
                      style={{ color: "#C4B8AC" }}
                    >
                      {exp.period}
                    </span>
                  )}
                </div>

                {exp.bullets.length > 0 && (
                  <ul className="space-y-1.5 mt-2.5 font-mono">
                    {exp.bullets.map((bullet, i) => (
                      <li
                        key={`${exp.id}-${i}`}
                        className="flex gap-2.5 text-[13px] leading-relaxed"
                        style={{ color: "#4B5563" }}
                      >
                        <span
                          className="shrink-0 select-none mt-[3px]"
                          style={{ color: "#D1C4B8" }}
                        >
                          ·
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
      </section>
    </>
  );
};

export default Experience;
