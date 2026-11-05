export const DashedFrame = () => (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-[1.5px] size-[calc(100%-3px)] overflow-visible text-(--lf-muted) opacity-40 transition-opacity duration-300 group-hover:opacity-60"
    >
      <rect
        width="100%"
        height="100%"
        rx="10.5"
        ry="10.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="5 5"
      />
    </svg>
  );