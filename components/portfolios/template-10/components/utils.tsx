import { ReactNode } from "react";

export const Divider = () => (
  <div className="my-10" style={{ borderTop: "1px solid #F0EBE5" }} />
);

export const SectionHeading = ({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) => (
  <div className="flex items-center justify-between mb-5">
    <h2
      className="text-[20px] font-semibold tracking-wider font-serif-display"
      style={{ color: "#0F0F0F" }}
    >
      {children}
    </h2>
    {action && (
      <span className="text-[12px]" style={{ color: "#1D4ED8" }}>
        {action}
      </span>
    )}
  </div>
);
