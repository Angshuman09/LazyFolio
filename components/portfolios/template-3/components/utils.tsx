import Link from "next/link";
import { useRouter } from "next/navigation";
  
export const Divider = () => (
    <div className="w-full h-px bg-slate-100 my-12" />
  );
  
export const SectionHeading = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-6">
      {children}
    </h2>
  );
  
export function StackTicker({ stack }: { stack: { name: string }[] }) {
    const items = [...stack, ...stack];
    return (
      <div className="relative overflow-hidden py-2 bg-white rounded-xl border border-slate-100">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10 bg-linear-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10 bg-linear-to-l from-white to-transparent" />
        <div className="flex gap-2 w-max" style={{ animation: "ticker 40s linear infinite" }}>
          {items.map((tech, i) => (
            <div
              key={`${tech.name}-${i}`}
              className="flex items-center px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 shrink-0"
            >
              <span className="text-[10.5px] text-slate-500 font-medium tracking-wider uppercase">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
export function Footer() {
  const router = useRouter();
    return (
      <footer className="pb-5">
        <div className="flex items-center justify-center gap-2 select-none">
          <span className="text-[10px] font-medium text-slate-300 tracking-wide">
            Built with
          </span>
          <span
            onClick={()=> router.push('/')}
            className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wide text-slate-400 hover:text-slate-700 transition-colors duration-200"
          >
            Lazyfolio
          </span>
        </div>
      </footer>
    );
  }
  