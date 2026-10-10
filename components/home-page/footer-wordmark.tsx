"use client";

import { useEffect } from "react";

import { CloudShader } from "@/components/ui/cloud-shader";
import { MaskedHeading } from "@/components/ui/masked-heading";
import { useThemeStore } from "@/lib/utils/theme-store";

/** Sky the footer wordmark is filled with, tuned per theme. */
const SKY = {
  light: {
    skyTopColor: "#3f86c9",
    skyBottomColor: "#a8d4f2",
    cloudColor: "#ffffff",
  },
  dark: {
    skyTopColor: "#16324f",
    skyBottomColor: "#2f6ba3",
    cloudColor: "#dce9f5",
  },
} as const;

const FooterWordmark = () => {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const sky = theme === "dark" ? SKY.dark : SKY.light;

  // The theme class lives on <html>, so pick it up on mount as well.
  useEffect(() => {
    if (typeof document === "undefined") return;
    setTheme(
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    );
  }, [setTheme]);

  return (
    <MaskedHeading
      text="Lazyfolio"
      align="left"
      weight={800}
      tracking={0}
      lineHeight={0.85}
      // same sizing as the old clamp(80px, 18vw, 220px)
      textScale={0.18}
      minTextSize={80}
      maxTextSize={220}
      reveal="rise"
      trigger="view"
      duration={1.2}
      parallax={18}
      drift={14}
      aria-hidden="true"
      className="mt-2 select-none"
      style={{
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        maxHeight: "0.70em",
        overflow: "hidden",
        paddingLeft: "0.03em",
      }}
    >
      <CloudShader
        className="min-h-0"
        speed={0.75}
        count={4}
        skyTopColor={sky.skyTopColor}
        skyBottomColor={sky.skyBottomColor}
        cloudColor={sky.cloudColor}
      />
    </MaskedHeading>
  );
};

export default FooterWordmark;
