import React from "react";
import { ProfileData } from "../../shared/types";
import { normalizeStack } from "../../shared/normalize";
import { SectionHeading, StackTicker } from "./utils";

export default function Stack({ profile }: { profile: ProfileData }) {
  const stack = normalizeStack(profile?.skills);

  if (stack.length === 0) return null;

  return (
    <section className="mt-16 sm:mt-20">
      <SectionHeading>Stack</SectionHeading>
      {stack.length <= 8 ? (
        <div className="flex flex-wrap gap-2">
          {stack.map((tech, i) => (
            <div
              key={`${tech.name}-${i}`}
              className="flex items-center px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800/80 shrink-0"
            >
              <span className="text-[11px] text-neutral-400 font-mono tracking-wider uppercase">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <StackTicker stack={stack} />
      )}
    </section>
  );
}
