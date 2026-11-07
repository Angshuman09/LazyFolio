import Link from "next/link";
import { MoveUpRight } from "lucide-react";
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
    <Section title="Experience">
      {experiences.length === 0 ? (
        <Empty>No experience added yet.</Empty>
      ) : (
        <div className="border-t border-[#e8e9ec]">
          {visible.map((experience) => (
            <article
              key={experience.id}
              className="grid grid-cols-[108px_minmax(0,1fr)] gap-4 border-b border-[#e8e9ec] py-[17px] max-[620px]:grid-cols-1 max-[620px]:gap-1.5"
            >
              <span className="font-mono pt-0.5 text-[10px] leading-[1.5] text-[#999ba4]">
                {experience.period || "—"}
              </span>
              <div>
                <h3 className="m-0 text-[16px] font-semibold leading-[1.35] tracking-[-0.026em] text-[#22242a]">
                  {experience.company && experience.companyUrl ? (
                    <Link
                      href={experience.companyUrl}
                      target={
                        shouldOpenInNewTab(experience.companyUrl)
                          ? "_blank"
                          : undefined
                      }
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-[5px] transition-colors duration-150 hover:text-[#285cc2]"
                    >
                      {experience.company}
                      <MoveUpRight size={13} strokeWidth={1.6} aria-hidden="true" />
                    </Link>
                  ) : (
                    experience.company || "Independent"
                  )}
                </h3>

                {experience.role && (
                  <p className="mt-[3px] text-[13px] leading-[1.5] text-[#777982]">
                    {experience.role}
                  </p>
                )}

                {experience.bullets.length > 0 && (
                  <ul className="mt-2.5 grid list-none gap-[5px] p-0">
                    {experience.bullets.slice(0, 3).map((bullet, index) => (
                      <li
                        key={experience.id + "-" + index}
                        className="text-[13px] leading-[1.58] text-[#5f6068] before:mr-[7px] before:text-[#afb1b7] before:content-['•']"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {!showAll && experiences.length > visible.length && (
        <MoreLink href={basePath + "/experience"} section="experience">
          View all experience
        </MoreLink>
      )}
    </Section>
  );
}
