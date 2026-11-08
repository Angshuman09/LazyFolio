import type { ProfileData } from "../../shared/types";
import { textValue } from "../../shared/utils";
import { Section } from "./section";
import { toParagraphs } from "./utils";

export default function About({ profile }: { profile: ProfileData }) {
  const bio = textValue(profile?.bio);
  const tagline = textValue(profile?.tagline) || textValue(profile?.headline);
  const quote = textValue(profile?.quote);
  const paragraphs = toParagraphs(bio || tagline);

  if (paragraphs.length === 0 && !quote) return null;

  return (
    <Section title="About">
      <div className="grid max-w-[650px] gap-[13px]">
        {paragraphs.map((paragraph) => (
          <p
            key={paragraph}
            className="font-mono m-0 text-[15px] leading-[1.78] tracking-[-0.035em] text-[#3c3d42] max-[620px]:text-[13px] max-[620px]:leading-[1.72]"
          >
            {paragraph}
          </p>
        ))}
      </div>

      {quote && (
        <blockquote className="mt-[22px] flex gap-2.5  border border-[#e3e4e7] bg-[#fcfcfc] px-3.5 py-[13px] text-[13px] leading-[1.6] text-[#666870] before:text-[20px] before:leading-[0.95] before:text-[#4f79ce]">
          {quote}
        </blockquote>
      )}
    </Section>
  );
}
