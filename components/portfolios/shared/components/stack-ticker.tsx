"use client";

// ─── Shared StackTicker Component ─────────────────────────────────────────────
// Horizontally scrolling ticker of tech-stack items, themed via config.

import type { StackItem } from "../types";
import type { TemplateThemeConfig } from "../../template-themed";

type StackTickerProps = {
  stack: StackItem[];
  config: TemplateThemeConfig;
};

export function StackTicker({ stack, config }: StackTickerProps) {
  // Duplicate items so the CSS animation loops seamlessly
  const items = [...stack, ...stack];

  return (
    <div className={config.stackShellClass}>
      <div className={config.stackFadeLeftClass} />
      <div className={config.stackFadeRightClass} />
      <div className={config.stackTrackClass}>
        {items.map((tech, index) => (
          <div key={`${tech.name}-${index}`} className={config.stackItemClass}>
            <span className={config.stackTextClass}>{tech.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
