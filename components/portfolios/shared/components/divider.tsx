"use client";

// ─── Shared Divider Component ─────────────────────────────────────────────────
// A themed horizontal rule between sections.

import type { TemplateThemeConfig } from "../../template-themed";

type DividerProps = {
  config: TemplateThemeConfig;
};

export function Divider({ config }: DividerProps) {
  return <div className={config.dividerClass} />;
}
