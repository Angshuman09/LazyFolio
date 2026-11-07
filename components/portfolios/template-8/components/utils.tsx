import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { usePortfolioSection } from "../../shared/context/portfolio-section-context";
import type { PortfolioSection } from "../../shared/types";

export function MoreLink({
  href,
  section,
  children,
}: {
  href: string;
  section: PortfolioSection;
  children: React.ReactNode;
}) {
  const portfolio = usePortfolioSection();

  return (
    <Link
      href={href}
      onClick={(event) => {
        if (portfolio?.onSectionChange) {
          event.preventDefault();
          portfolio.onSectionChange(section);
        }
      }}
      className="mt-[18px] inline-flex items-center gap-[7px] text-[13px] text-[#4d6fae] transition-colors duration-150 hover:text-[#255ac2]"
    >
      {children}
      <ArrowRight size={13} aria-hidden="true" />
    </Link>
  );
}

export function toParagraphs(value?: string): string[] {
  return (value || "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function initialsOf(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("") || "LF"
  );
}
