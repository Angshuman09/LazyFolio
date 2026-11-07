import { normalizeStack } from "../../shared/normalize";
import type { ProfileData } from "../../shared/types";
import { Section } from "./section";

export default function Stack({ profile }: { profile: ProfileData }) {
  const skills = normalizeStack(profile?.skills);

  if (skills.length === 0) return null;

  return (
    <Section id="lf-t4-skills-title" title="Tools I enjoy">
      <div className="flex flex-wrap gap-[7px]">
        {skills.map((skill) => (
          <span
            key={skill.name}
            className="rounded-full border border-[#e9e9eb] px-[9px] py-[5px] text-[12px] text-[#67676f]"
          >
            {skill.name}
          </span>
        ))}
      </div>
    </Section>
  );
}
