import type { ReactNode } from "react";
import { TemplateThemeConfig } from "../types";

type SectionHeadingProps = {
  children: ReactNode;
  config: TemplateThemeConfig;
};

export function SectionHeading({
  children,
  config,
}: SectionHeadingProps) {
  return (
    <div className={config.sectionHeadingClass}>
      <h2 className={config.sectionTitleClass}>{children}</h2>
    </div>
  );
}
