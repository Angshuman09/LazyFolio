"use client";

import Link from "next/link";
import { PortfolioSection } from "../types";
import { usePortfolioSection } from "../context/portfolio-section-context";

export interface PortfolioNavbarProps {
  currentSection?: PortfolioSection;
  basePath?: string;
  className?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  inactiveItemClassName?: string;
  onSectionChange?: (section: PortfolioSection) => void;
}

export function PortfolioNavbar(props: PortfolioNavbarProps) {
  const ctx = usePortfolioSection();

  const currentSection = props.currentSection ?? ctx?.currentSection ?? "home";
  const basePath = props.basePath ?? ctx?.basePath ?? "";
  const onSectionChange = props.onSectionChange ?? ctx?.onSectionChange;

  const {
    className = "mb-10 sm:mb-12 flex items-center justify-center gap-6 sm:gap-8 text-xs sm:text-[13px]",
    itemClassName = "transition-all duration-150 lowercase cursor-pointer",
    activeItemClassName = "font-semibold text-stone-900",
    inactiveItemClassName = "text-stone-400 hover:text-stone-700",
  } = props;

  const homeHref = basePath ? `${basePath}` : "/";
  const experienceHref = `${basePath}/experience`;
  const blogsHref = `${basePath}/blogs`;
  const projectsHref = `${basePath}/projects`;

  const navItems: { id: PortfolioSection; label: string; href: string }[] = [
    { id: "home", label: "home", href: homeHref },
    { id: "experience", label: "experience", href: experienceHref },
    { id: "blogs", label: "blogs", href: blogsHref },
    { id: "projects", label: "projects", href: projectsHref },
  ];

  return (
    <nav className={className} aria-label="Portfolio sections">
      {navItems.map((item) => {
        const isActive = currentSection === item.id;
        const classes = `${itemClassName} ${isActive ? activeItemClassName : inactiveItemClassName}`;

        if (onSectionChange) {
          return (
            <button
              key={item.id}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSectionChange(item.id);
              }}
              className={`${classes} bg-transparent border-0 p-0`}
            >
              {item.label}
            </button>
          );
        }

        return (
          <Link
            key={item.id}
            href={item.href}
            className={classes}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
