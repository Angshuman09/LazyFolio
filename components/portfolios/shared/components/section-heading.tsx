"use client";

import type { ReactNode, ComponentType } from "react";
import { Sparkles } from "lucide-react";
import { TemplateThemeConfig } from "../types";

type IconComponent = ComponentType<{
  size?: number;
  className?: string;
  strokeWidth?: number;
}>;

type SectionHeadingProps = {
  children: ReactNode;
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
