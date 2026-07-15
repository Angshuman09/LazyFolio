import { StackItem } from "../../shared/types";
import { ReactNode } from "react";

export const Divider = () => <div className="w-full h-px bg-zinc-800/80 my-10" />;
  
export const SectionHeading = ({ children }: { children: ReactNode }) => (
  <h2 className="text-sm font-semibold text-white mb-6 tracking-tight">
    {children}
  </h2>
);

export function StackTicker({ stack }: { stack: StackItem[] }) {
    const items = [...stack, ...stack];
    return (
      <div className="relative overflow-hidden py-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 z-10 bg-linear-to-r from-[#0e0e0e] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 z-10 bg-linear-to-l from-[#0e0e0e] to-transparent" />
        <div
          className="flex gap-3 w-max"
          style={{ animation: "ticker 30s linear infinite" }}
        >
          {items.map((tech, i) => (
            <div
              key={`${tech.name}-${i}`}
              className="flex items-center px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0"
            >
              <span className="text-[11px] text-zinc-500 whitespace-nowrap">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }



export const statusStyle: Record<string, string> = {
    Live: "text-emerald-400 bg-emerald-400/8 border-emerald-400/20",
    WIP: "text-amber-400 bg-amber-400/8 border-amber-400/20",
    "Open Source": "text-sky-400 bg-sky-400/8 border-sky-400/20",
  };
  
export const fallbackStatusStyle = "text-zinc-400 bg-zinc-400/8 border-zinc-400/20";