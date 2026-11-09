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
    <div className="mt-7.25 flex justify-center">
      <Link
        href={href}
        onClick={(event) => {
          if (portfolio?.onSectionChange) {
            event.preventDefault();
            portfolio.onSectionChange(section);
          }
        }}
        className="inline-flex min-h-6.5 items-center gap-1.75 text-gray-600 hover:underline hover:text-black"
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
