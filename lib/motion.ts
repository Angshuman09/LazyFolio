export const lightEase = [0.22, 1, 0.36, 1] as const;

export const softSpring = {
  type: "spring",
  stiffness: 260,
  damping: 24,
} as const;

export const gentleBounce = {
  type: "spring",
  stiffness: 300,
  damping: 22,
} as const;

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.45, ease: lightEase },
  },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: lightEase },
  },
};

export const fadeInScale = {
  hidden: { opacity: 0, scale: 0.98, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, ease: lightEase },
  },
};

export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const viewportConfig = {
  once: true,
  margin: "-40px",
} as const;
