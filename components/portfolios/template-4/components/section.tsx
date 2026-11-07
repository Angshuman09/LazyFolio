import type { ReactNode } from "react";

export function Section({
  id,
  title,
  action,
  children,
}: {
  id: string;
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      className="mt-[62px] max-[620px]:mt-[52px]"
      aria-labelledby={id}
    >
      <div className="mb-[18px] flex items-center justify-between gap-4">
        <h2
          id={id}
          className="m-0 text-[16px] font-normal leading-[1.4] tracking-[-0.018em] text-[#76767f]"
        >
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="m-0 text-[14px] text-[#8b8b93]">{children}</p>;
}
