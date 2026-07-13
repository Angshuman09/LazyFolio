"use client";

// ─── Shared SectionHeading Component ─────────────────────────────────────────
// Renders a section heading using the active template's theme config.

import type { ReactNode, ComponentType } from "react";
import { Sparkles } from "lucide-react";
import type { TemplateThemeConfig } from "../../template-themed";

type IconComponent = ComponentType<{
  size?: number;
  className?: string;
  strokeWidth?: number;
}>;

type SectionHeadingProps = {
  children: ReactNode;
  /** Override the default Sparkles icon */
  icon?: IconComponent;
  config: TemplateThemeConfig;
};

export function SectionHeading({
  children,
  icon: Icon = Sparkles,
  config,
}: SectionHeadingProps) {
  return (
    <div className={config.sectionHeadingClass}>
      <h2 className={config.sectionTitleClass}>{children}</h2>
    </div>
  );
}
