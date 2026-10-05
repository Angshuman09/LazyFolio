import Link from "next/link";
import { MoveUpRight } from "lucide-react";
import { normalizeExperiences } from "../../shared/normalize";
import { ProfileData } from "../../shared/types";
import { shouldOpenInNewTab } from "../../shared/utils";
import { SectionLabel, MobileSectionLabel, SectionGap } from "./utils";
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
  const visible = showAll ? experiences : experiences.slice(0, 5);
  const experienceHref = `${basePath}/experience`;

  if (!showAll && experiences.length === 0) return null;

  const MONO: React.CSSProperties = {
    fontFamily: "'Courier New', Courier, monospace",
  };
  const BODY: React.CSSProperties = {
    fontFamily: "system-ui, -apple-system, sans-serif",
  };

  return (
    <>
      {/* Label + content row */}
      <div className="flex flex-col sm:flex-row gap-0 sm:gap-8">
        <SectionLabel>Experience</SectionLabel>
        <div className="flex-1 min-w-0">
          <MobileSectionLabel>Experience</MobileSectionLabel>
          {experiences.length === 0 ? (
            <p className="text-[12px] italic" style={{ color: "#94A3B8", ...BODY }}>
              No experience listed yet.
            </p>
          ) : (
            <div className="space-y-6">
              {visible.map((exp) => (
                <div key={exp.id}>
                  {/* Company bold + role mono — exactly like the reference */}
                  <div className="flex items-baseline justify-between gap-3 mb-1">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      {exp.company && (
                        exp.companyUrl && exp.companyUrl !== "#" ? (
                          <Link
                            href={exp.companyUrl}
                            target={shouldOpenInNewTab(exp.companyUrl) ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 font-bold text-[13.5px] hover:text-[#475569] transition-colors"
                            style={{ color: "#1A1A1A", ...BODY }}
                          >
                            {exp.company}
                            <MoveUpRight size={9} style={{ color: "#94A3B8" }} />
                          </Link>
                        ) : (
                          <span className="font-bold text-[13.5px]" style={{ color: "#1A1A1A", ...BODY }}>
                            {exp.company}
                          </span>
                        )
                      )}
                      {exp.role && (
                        <span className="text-[12.5px]" style={{ color: "#475569", ...MONO }}>
                          {exp.role}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description bullets */}
                  {exp.bullets.length > 0 && (
                    <p
                      className="text-[12.5px] leading-relaxed mb-1.5"
                      style={{ color: "#374151", ...BODY }}
                    >
                      {exp.bullets.join(" ")}
                    </p>
                  )}

                  {/* Date mono — muted, like reference */}
                  {exp.period && (
                    <p
                      className="text-[11px]"
                      style={{ color: "#94A3B8", ...MONO }}
                    >
                      {exp.period}
                    </p>
                  )}
                </div>
              ))}

              {!showAll && experiences.length > 5 && (
                <Link
                  href={experienceHref}
                  onClick={(e) => {
                    if (sectionCtx?.onSectionChange) {
                      e.preventDefault();
                      sectionCtx.onSectionChange("experience");
                    }
                  }}
                  className="text-[11px] cursor-pointer hover:text-[#1A1A1A] transition-colors"
                  style={{ color: "#94A3B8", ...MONO }}
                >
                  + {experiences.length - 5} more positions
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
      <SectionGap />
    </>
  );
};

export default Experience;
