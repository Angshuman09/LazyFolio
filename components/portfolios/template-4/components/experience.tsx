import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { normalizeExperiences } from "../../shared/normalize";
import type { ProfileData } from "../../shared/types";
import { shouldOpenInNewTab } from "../../shared/utils";
import { Empty, Section } from "./section";
import { MoreLink } from "./utils";

export default function Experience({
  profile,
  showAll = false,
  basePath = "",
}: {
  profile: ProfileData;
  showAll?: boolean;
  basePath?: string;
}) {
  const experiences = normalizeExperiences(profile?.experiences);
  const visible = showAll ? experiences : experiences.slice(0, 3);

  if (!showAll && experiences.length === 0) return null;

  return (
    <Section id="lf-t4-experience-title" title="Experience">
      {experiences.length === 0 ? (
        <Empty>Experience will appear here.</Empty>
      ) : (
        <div className="border-t border-[#ececef]">
          {visible.map((experience) => (
            <article
              key={experience.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] gap-5 border-b border-[#ececef] py-4 max-[430px]:grid-cols-1 max-[430px]:gap-1.5"
            >
              <div className="min-w-0">
                <h3 className="m-0 inline-flex items-center gap-1 text-[16px] font-medium leading-[1.35] tracking-[-0.025em] text-[#19191b]">
                  {experience.company && experience.companyUrl ? (
                    <Link
                      href={experience.companyUrl}
                      target={
                        shouldOpenInNewTab(experience.companyUrl)
                          ? "_blank"
                          : undefined
                      }
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 transition-colors duration-150 hover:text-[#1b1bff]"
                    >
                      {experience.company}
                      <ArrowUpRight size={13} strokeWidth={1.7} aria-hidden="true" />
                    </Link>
                  ) : (
                    experience.company || "Independent"
                  )}
                </h3>

                {experience.role && (
                  <p className="mt-[3px] text-[14px] leading-[1.45] text-[#72727a]">
                    {experience.role}
                  </p>
                )}

                {experience.bullets.length > 0 && (
                  <ul className="mt-2 grid list-none gap-[5px] p-0">
                    {experience.bullets.slice(0, 2).map((bullet, index) => (
                      <li
                        key={experience.id + "-" + index}
                        className="text-[14px] leading-[1.5] text-[#6d6d75] before:mr-[7px] before:text-[#adadb4] before:content-['—']"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <span className="pt-0.5 text-right text-[12px] text-[#919199] whitespace-nowrap max-[430px]:p-0 max-[430px]:text-left">
                {experience.period || ""}
              </span>
            </article>
          ))}
        </div>
      )}

      {!showAll && experiences.length > visible.length && (
        <MoreLink href={basePath + "/experience"} section="experience">
          View experience
        </MoreLink>
      )}
    </Section>
  );
}
