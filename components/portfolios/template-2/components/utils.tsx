
export const Divider = () => <div className="w-full h-px bg-stone-200/80 my-10" />;

export const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-md font-semibold text-stone-900 mb-6 tracking-tight">
    {children}
  </h2>
);

export function StackTicker({ stack }: { stack: { name: string }[] }) {
  const items = [...stack, ...stack];
  return (
    <div className="relative overflow-hidden py-1">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 z-10 bg-linear-to-r from-[#fbfbfb] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 z-10 bg-linear-to-l from-[#fbfbfb] to-transparent" />
      <div
        className="flex gap-3 w-max"
        style={{ animation: "ticker 30s linear infinite" }}
      >
        {items.map((tech, i) => (
          <div
            key={`${tech.name}-${i}`}
            className="flex items-center px-3 py-1.5 rounded-lg bg-white border border-stone-200 shrink-0"
          >
            <span className="text-[11px] text-stone-500 whitespace-nowrap font-medium">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}