"use client";

import type { StackItem, TemplateThemeConfig } from "../types";

type StackTickerProps = {
  stack: StackItem[];
  config: TemplateThemeConfig;
};

export function StackTicker({ stack, config }: StackTickerProps) {
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
