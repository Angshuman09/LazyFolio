import React from "react";
import { getMainSiteUrl } from "@/lib/utils/public-url";

export const Divider = () => (
  <div className="w-full h-px bg-neutral-800/60 my-12 sm:my-14" />
);

export const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-6">
    <h2 className="font-editorial-serif text-[24px] font-normal tracking-[-0.01rem] text-neutral-100">
      {children}
    </h2>
    <div className="w-12 h-px bg-neutral-700 my-6 rounded-[1px]" />
  </div>
);

export function toParagraphs(value?: string | null): string[] {
  if (!value) return [];
  return value
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function FormattedText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const tokens: React.ReactNode[] = [];
  const regex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(
        <span key={`text-${key++}`}>
          {text.slice(lastIndex, match.index)}
        </span>
      );
    }
    if (match[2] && match[3]) {
      // markdown link [label](url)
      tokens.push(
        <a
          key={`link-${key++}`}
          href={match[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-100 hover:opacity-60 underline underline-offset-4 decoration-neutral-700 transition-opacity"
        >
          {match[2]}
        </a>
      );
    } else if (match[4]) {
      // **bold**
      tokens.push(
        <strong key={`bold-${key++}`} className="font-medium text-neutral-100">
          {match[4]}
        </strong>
      );
    } else if (match[5]) {
      // *italic*
      tokens.push(
        <em key={`italic-${key++}`} className="italic text-neutral-300">
          {match[5]}
        </em>
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    tokens.push(
      <span key={`text-${key++}`}>{text.slice(lastIndex)}</span>
    );
  }

  return <span className={className}>{tokens.length > 0 ? tokens : text}</span>;
}

export function StackTicker({ stack }: { stack: { name: string }[] }) {
  const items = [...stack, ...stack];
  return (
    <div className="relative overflow-hidden py-2 bg-neutral-900/40 rounded-xl border border-neutral-800">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10 bg-linear-to-r from-[#0a0a0a] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10 bg-linear-to-l from-[#0a0a0a] to-transparent" />
      <div className="flex gap-2 w-max" style={{ animation: "ticker 40s linear infinite" }}>
        {items.map((tech, i) => (
          <div
            key={`${tech.name}-${i}`}
            className="flex items-center px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800/80 shrink-0"
          >
            <span className="text-[10.5px] text-neutral-400 font-mono tracking-wider uppercase">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="pb-8 pt-14">
      <div className="flex items-center justify-center gap-2 select-none">
        <span className="text-[11px] font-normal text-neutral-600 tracking-wide">
          Built with
        </span>
        <a
          href={getMainSiteUrl()}
          className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-neutral-400 hover:text-neutral-200 transition-colors duration-200 cursor-pointer"
        >
          Lazyfolio
        </a>
      </div>
    </footer>
  );
}
