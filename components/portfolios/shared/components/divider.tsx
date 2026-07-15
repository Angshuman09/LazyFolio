"use client";

import type { TemplateThemeConfig } from "../types";

type DividerProps = {
  config: TemplateThemeConfig;
};

export function Divider({ config }: DividerProps) {
  return <div className={config.dividerClass} />;
}
