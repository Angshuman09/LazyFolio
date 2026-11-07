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
    <div className="mt-[29px] flex justify-center">
      <Link
        href={href}
        onClick={(event) => {
          if (portfolio?.onSectionChange) {
            event.preventDefault();
            portfolio.onSectionChange(section);
          }
        }}
        className="inline-flex min-h-[34px] items-center gap-[7px] rounded-[9px] border border-[#e1e1e4] px-3 py-1.5 text-[14px] text-[#2f2f34] transition-colors duration-150 hover:border-[#c9c9cf] hover:bg-[#fafafa]"
      >
        {children}
        <ArrowRight size={14} aria-hidden="true" />
      </Link>
    </div>
  );
}

export function toParagraphs(value?: string): string[] {
  return (value || "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
