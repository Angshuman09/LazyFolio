import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { type PointerEvent, type ReactNode } from "react";


export function GlowCard({
  className,
  children,
  glowColor = "rgba(255,255,255,0.22)",
}: {
  className: string;
  children: ReactNode;
  glowColor?: string;
}) {
  const mx = useMotionValue(110);
  const my = useMotionValue(110);
  const glowOpacity = useMotionValue(0);

  const sx = useSpring(mx, { stiffness: 420, damping: 42, mass: 0.35 });
  const sy = useSpring(my, { stiffness: 420, damping: 42, mass: 0.35 });
  const so = useSpring(glowOpacity, { stiffness: 260, damping: 30, mass: 0.4 });

  const glowBackground = useMotionTemplate`radial-gradient(260px circle at ${sx}px ${sy}px, ${glowColor}, rgba(255,255,255,0.04) 32%, transparent 72%)`;

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
    glowOpacity.set(1);
  };

  return (
    <motion.div
      className={`relative isolate overflow-hidden ${className}`}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerMove}
      onPointerLeave={() => glowOpacity.set(0)}
      whileHover={{ scale: 1.015 }}
      transition={{ type: "spring", stiffness: 280, damping: 24, mass: 0.8 }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
        style={{
          opacity: so,
          backgroundImage: glowBackground,
          filter: "blur(16px)",
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}