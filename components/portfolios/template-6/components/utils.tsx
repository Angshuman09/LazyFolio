import Link from "next/link";

export function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex items-center gap-3 mb-[18px]">
        <span className="text-[13px] font-bold tracking-widest text-[#7A9585] whitespace-nowrap">
          {children}
        </span>
        <span className="flex-1 h-[1.5px] bg-[#D5E5DA] rounded-[1px]" />
      </div>
    );
  }
  
export function Divider() {
    return <div className="my-10 h-[1.5px] bg-[#D5E5DA] rounded-[1px]" />;
  }
  
export function ActionBtn({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
    return (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="inline-flex items-center justify-center w-[30px] h-[30px] rounded-lg border-[1.5px] border-[#D5E5DA] bg-[#F3F8F5] text-[#7A9585] transition-colors duration-150 no-underline hover:border-[#C4622D] hover:text-[#C4622D]"
      >
        {children}
      </Link>
    );
  }
  