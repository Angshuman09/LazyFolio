import { ReactNode } from "react";

export const Divider = () => (
  <div className="my-6" style={{ borderTop: "1px solid #D8D0C5" }} />
);

/* Small ALL-CAPS label — pure typographic, no decorations */
export const SectionHeading = ({ children }: { children: ReactNode }) => (
  <h2
    className="text-[10px] tracking-[0.25em] mb-4"
    style={{ color: "#A0907E", fontFamily: "system-ui, -apple-system, sans-serif" }}
  >
    {children}
  </h2>
);
