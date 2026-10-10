"use client";

/**
 * Text mask, based on https://reactbits.dev/text-animations/masked-heading
 *
 * The text itself is rendered transparent (it only lays out the box), while an
 * SVG <clipPath> built from the very same glyphs clips an absolutely positioned
 * fill layer. Anything you pass as `children` becomes that fill — an image, a
 * video, or, as we use it in the footer, the <CloudShader /> canvas.
 *
 * The entrance reveal is driven by CSS transitions instead of gsap so we do not
 * have to ship another animation runtime.
 */

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type ComponentType,
  type ElementType,
  type ReactNode,
  type Ref,
} from "react";

import { cn } from "@/lib/utils/utils";

/** Layout must happen before paint, but never warn while rendering on the server. */
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const clamp = (v: number, a: number, b: number) =>
  v < a ? a : v > b ? b : v;

type Reveal = "rise" | "wipe" | "fade" | "none";
type Trigger = "view" | "mount";

/** Props we pass to the root element; extra props are forwarded as-is. */
type RootProps = {
  ref?: Ref<HTMLElement>;
  className?: string;
  style?: CSSProperties;
  [key: string]: unknown;
};

export interface MaskedHeadingProps {
  /** Text that opens the window onto the fill. */
  text?: string;
  /** Element used as the root box (use a heading tag when it is real copy). */
  tag?: ElementType;
  /** The fill revealed inside the glyphs. Should fill its box (w/h-full). */
  children?: ReactNode;
  /** How far the fill overflows the mask box, so parallax never shows gaps. */
  fillScale?: number;
  /** Pointer parallax in px. 0 disables it. */
  parallax?: number;
  /** Idle movement of the fill in px. 0 disables it. */
  drift?: number;
  /** Entrance animation. */
  reveal?: Reveal;
  /** When the entrance animation runs. */
  trigger?: Trigger;
  duration?: number;
  stagger?: number;
  align?: "left" | "center" | "right";
  weight?: number;
  tracking?: number;
  lineHeight?: number;
  /** font-size = box width * textScale, clamped to [minTextSize, maxTextSize]. */
  textScale?: number;
  minTextSize?: number;
  maxTextSize?: number;
  className?: string;
  /** Root styles. Note: fontSize is owned by the component. */
  style?: CSSProperties;
  [key: string]: unknown;
}

export const MaskedHeading = ({
  text = "Masked heading",
  tag = "div",
  children,
  fillScale = 1.25,
  parallax = 26,
  drift = 18,
  reveal = "rise",
  trigger = "view",
  duration = 1.1,
  stagger = 0.09,
  align = "left",
  weight = 700,
  tracking = -0.03,
  lineHeight = 1.06,
  textScale = 0.115,
  minTextSize = 20,
  maxTextSize = 200,
  className,
  style,
  ...rest
}: MaskedHeadingProps) => {
  const rootRef = useRef<HTMLElement | null>(null);
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const revealRef = useRef<HTMLSpanElement | null>(null);
  const mediaRef = useRef<HTMLSpanElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const baseRefs = useRef<(HTMLElement | null)[]>([]);
  const glyphRefs = useRef<(SVGTextElement | null)[]>([]);
  const offsetRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  const clipId = `mh-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const words = useMemo(
    () => String(text).split(/\s+/).filter(Boolean),
    [text],
  );

  const settingsRef = useRef({
    fillScale,
    parallax,
    drift,
    textScale,
    minTextSize,
    maxTextSize,
  });

  /** Push the latest props into the ref before anything reads it. */
  useIsoLayoutEffect(() => {
    settingsRef.current = {
      fillScale,
      parallax,
      drift,
      textScale,
      minTextSize,
      maxTextSize,
    };
  });

  /** Keep the fill covering the box while it drifts/parallaxes. */
  const place = useCallback(() => {
    const root = rootRef.current;
    const media = mediaRef.current;
    if (!root || !media) return;
    const s = settingsRef.current;
    const off = offsetRef.current;
    const maxX = Math.max(0, ((s.fillScale - 1) / 2) * root.clientWidth);
    const maxY = Math.max(0, ((s.fillScale - 1) / 2) * root.clientHeight);
    media.style.transform = `translate3d(${clamp(off.x, -maxX, maxX).toFixed(2)}px, ${clamp(off.y, -maxY, maxY).toFixed(2)}px, 0) scale(${s.fillScale})`;
  }, []);

  /** Size the text and copy its font onto the glyphs that build the mask. */
  const sync = useCallback(() => {
    const root = rootRef.current;
    const measure = measureRef.current;
    if (!root || !measure) return;
    const s = settingsRef.current;

    root.style.fontSize = `${clamp(
      root.clientWidth * s.textScale,
      s.minTextSize,
      s.maxTextSize,
    ).toFixed(1)}px`;

    const cs = window.getComputedStyle(measure);
    for (let i = 0; i < wordRefs.current.length; i += 1) {
      const box = wordRefs.current[i];
      const base = baseRefs.current[i];
      const glyph = glyphRefs.current[i];
      if (!box || !base || !glyph) continue;
      glyph.setAttribute("x", `${box.offsetLeft}`);
      glyph.setAttribute("y", `${base.offsetTop}`);
      glyph.style.fontFamily = cs.fontFamily;
      glyph.style.fontSize = cs.fontSize;
      glyph.style.fontWeight = cs.fontWeight;
      glyph.style.fontStyle = cs.fontStyle;
      glyph.style.letterSpacing = cs.letterSpacing;
    }
    place();
  }, [place]);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(root);
    if (document.fonts?.ready) {
      document.fonts.ready.then(sync).catch(() => {});
    }

    let raf = 0;
    let last = performance.now();
    let clock = 0;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock += dt;
      const s = settingsRef.current;
      const off = offsetRef.current;

      const dx = Math.sin(clock * 0.21) * s.drift;
      const dy = Math.cos(clock * 0.17) * s.drift * 0.6;
      const ease = 1 - Math.exp(-dt / 0.18);
      off.x += (off.tx + dx - off.x) * ease;
      off.y += (off.ty + dy - off.y) * ease;

      place();
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const s = settingsRef.current;
      if (s.parallax <= 0) return;
      const r = root.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / (r.width || 1)) * 2 - 1;
      const ny = ((e.clientY - r.top) / (r.height || 1)) * 2 - 1;
      offsetRef.current.tx = clamp(nx, -1, 1) * -s.parallax;
      offsetRef.current.ty = clamp(ny, -1, 1) * -s.parallax;
    };

    const onLeave = () => {
      offsetRef.current.tx = 0;
      offsetRef.current.ty = 0;
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [sync]);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    const layer = revealRef.current;
    if (!root || !layer) return;

    const glyphs = glyphRefs.current.filter(Boolean) as SVGTextElement[];
    if (!glyphs.length) return;

    const ease =
      reveal === "wipe"
        ? "cubic-bezier(0.65, 0, 0.35, 1)"
        : "cubic-bezier(0.22, 1, 0.36, 1)";

    const setTransition = (on: boolean) => {
      layer.style.transition = on
        ? `clip-path ${duration}s ${ease}, opacity ${duration}s ease-out, transform ${duration}s ${ease}`
        : "none";
      for (let i = 0; i < glyphs.length; i += 1) {
        glyphs[i].style.transition = on
          ? `transform ${duration}s ${ease} ${i * stagger}s`
          : "none";
      }
    };

    const riseDistance = () =>
      (parseFloat(window.getComputedStyle(root).fontSize) || 48) * 1.15;

    /** Hidden starting point of the entrance. */
    const rest = () => {
      for (const glyph of glyphs) {
        glyph.style.transform =
          reveal === "rise" ? `translateY(${riseDistance()}px)` : "translateY(0px)";
      }
      layer.style.opacity = reveal === "fade" ? "0" : "1";
      layer.style.transform = reveal === "fade" ? "scale(1.08)" : "scale(1)";
      layer.style.clipPath =
        reveal === "wipe" ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 0%)";
    };

    /** Fully revealed end state. */
    const settle = () => {
      for (const glyph of glyphs) glyph.style.transform = "translateY(0px)";
      layer.style.opacity = "1";
      layer.style.transform = "scale(1)";
      layer.style.clipPath = "inset(0% 0% 0% 0%)";
    };

    const play = () => {
      setTransition(false);
      rest();
      void layer.offsetWidth; // flush the resting state before animating
      setTransition(true);
      settle();
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reveal === "none" || reduce) {
      setTransition(false);
      settle();
      return;
    }

    setTransition(false);
    rest();

    if (trigger === "view") {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io.disconnect();
            play();
          }
        },
        { threshold: 0.25 },
      );
      io.observe(root);
      return () => io.disconnect();
    }

    play();
  }, [reveal, trigger, duration, stagger, words]);

  const Root = tag as unknown as ComponentType<RootProps>;

  return (
    <Root
      ref={rootRef}
      className={cn("relative m-0 w-full", className)}
      style={{
        textAlign: align,
        fontWeight: weight,
        letterSpacing: `${tracking}em`,
        lineHeight,
        ...style,
      }}
      {...rest}
    >
      <span ref={measureRef} className="text-transparent">
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            ref={(el) => {
              wordRefs.current[i] = el;
            }}
            className="inline-block whitespace-pre"
          >
            {word}
            {i < words.length - 1 ? " " : ""}
            <i
              ref={(el) => {
                baseRefs.current[i] = el;
              }}
              className="inline-block h-0 w-0"
            />
          </span>
        ))}
      </span>

      <svg
        className="absolute h-0 w-0 overflow-hidden"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            {words.map((word, i) => (
              <text
                key={`${word}-${i}`}
                ref={(el) => {
                  glyphRefs.current[i] = el;
                }}
              >
                {word}
              </text>
            ))}
          </clipPath>
        </defs>
      </svg>

      <span ref={revealRef} className="pointer-events-none absolute inset-0 block">
        <span
          className="absolute inset-0 block"
          style={{ clipPath: `url(#${clipId})` }}
        >
          <span ref={mediaRef} className="absolute inset-0 block will-change-transform">
            {children}
          </span>
        </span>
      </span>
    </Root>
  );
};

export default MaskedHeading;
