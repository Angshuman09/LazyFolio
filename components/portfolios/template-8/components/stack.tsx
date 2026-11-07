import { normalizeStack } from "../../shared/normalize";
import type { ProfileData } from "../../shared/types";
import { Section } from "./section";

export default function Stack({ profile }: { profile: ProfileData }) {
  const skills = normalizeStack(profile?.skills);

  if (skills.length === 0) return null;

  return (
    <Section title="Stack">
      <div className="flex flex-wrap gap-[7px]">
        {skills.map((skill) => (
          <span
            key={skill.name}
            className="font-mono rounded border border-[#e2e3e7] px-2 py-[5px] text-[11px] leading-[1.3] text-[#61636b]"
          >
            {skill.name}
          </span>
        ))}
      </div>
    </Section>
  );
}
