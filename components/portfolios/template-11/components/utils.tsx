import { ReactNode } from "react";

export const SectionLabel = ({ children }: { children: ReactNode }) => (
  <div
    className="text-right text-[11.5px] pt-0.5 shrink-0 hidden sm:block text-gray-900"
    style={{
      width: "100px",
      fontFamily: "'Courier New', Courier, monospace",
      letterSpacing: "0.03em",
    }}
  >
    {children}
  </div>
);

/* Mobile fallback — inline above content */
export const MobileSectionLabel = ({ children }: { children: ReactNode }) => (
  <div
    className="text-[10px] tracking-widest uppercase mb-3 sm:hidden"
    style={{ color: "#94A3B8", fontFamily: "'Courier New', Courier, monospace" }}
  >
    {children}
  </div>
);

/* Spacer between sections */
export const SectionGap = () => <div className="h-7" />;
