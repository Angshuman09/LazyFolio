import type { ReactNode } from "react";

export function Section({
  title,
  flush = false,
  children,
}: {
  title: string;
  /** Lets the section body bleed to the frame edges instead of sitting inset. */
  flush?: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <div
        className="h-[26px] border-b border-[#e6e7e9]"
        style={{
          background:
            "repeating-linear-gradient(-45deg, transparent 0 5px, #f1f1f3 5px 6px)",
        }}
        aria-hidden="true"
      />
      <section className={flush ? "" : "border-b border-[#e6e7e9]"}>
        <header className="flex min-h-[63px] items-center justify-between gap-[18px] border-b border-[#e6e7e9] px-[27px] py-3 max-[620px]:min-h-[56px] max-[620px]:px-[18px] max-[620px]:py-[11px]">
          <h2 className="font-sans-body m-0 text-[29px] font-normal leading-none tracking-[-0.055em] text-[#363842] max-[620px]:text-[26px]">
            {title}
          </h2>
        </header>
        <div
          className={
            flush
              ? ""
              : "px-[27px] pb-[31px] pt-6 max-[620px]:px-[18px] max-[620px]:pb-[25px] max-[620px]:pt-5"
          }
        >
          {children}
        </div>
      </section>
    </>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="m-0 text-[14px] text-[#9698a0]">{children}</p>;
}
