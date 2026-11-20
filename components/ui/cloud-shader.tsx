"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type TwilightCloudShaderProps = {
  className?: string;
  children?: React.ReactNode;
  /** Animation speed multiplier. 1 = default drift. */
  speed?: number;
  /** Number of clouds (1-6). */
  count?: number;
  /** Warm lit cloud tint color (hex or rgb string). */
  cloudColor?: string;
  /** Deep zenith sky color at the top (hex or rgb string). */
  skyTopColor?: string;
  /** Dusky mid-sky twilight color (hex or rgb string). */
  skyMidColor?: string;
  /** Warm horizon sky color at the bottom (hex or rgb string). */
  skyBottomColor?: string;
  /** Sunset afterglow & rim-light color near the horizon (hex or rgb string). */
  horizonGlowColor?: string;
};

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

// Twilight cloud shader:
// Uses a 3-stop zenith-to-horizon twilight gradient, low-angle horizon afterglow,
// subtle emerging zenith stars, and under-lit cloud self-shadowing where cloud
// bases catch warm sunset light while upper domes fall into cool indigo shadow.
const FRAG = `
precision highp float;

varying vec2 v_uv;

uniform vec2 u_res;
uniform float u_time;
uniform float u_count;
uniform vec3 u_cloud;
uniform vec3 u_skyTop;
uniform vec3 u_skyMid;
uniform vec3 u_skyBottom;
uniform vec3 u_glow;

const mat2 R = mat2(0.80, 0.60, -0.60, 0.80);

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(41.31, 289.17))) * 26737.367);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    sum += amp * vnoise(p);
    p = R * p * 2.03 + 19.19;
    amp *= 0.5;
  }
  return sum;
}

// billow noise: sharp puffy ridges, like cauliflower cloud tops
float billow(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    sum += amp * (1.0 - abs(2.0 * vnoise(p) - 1.0));
    p = R * p * 2.11 + 13.37;
    amp *= 0.5;
  }
  return sum;
}

// raw density for one cloud at point p
float cloudDensity(vec2 p, vec2 c, vec2 r, float seed, float t) {
  vec2 q = p - c;

  // envelope: dome above the center, flat base below
  float ry = q.y > 0.0 ? r.y : r.y * 0.42;
  float env = 1.0 - length(vec2(q.x / r.x, q.y / ry));
  if (env < -0.35) return 0.0;

  // domain-warped billow detail, moves with the cloud, evolves slowly
  vec2 dp = q * (2.4 / r.x) + seed;
  dp += 0.6 * vec2(
    fbm(dp * 1.4 + t * 0.04),
    fbm(dp * 1.4 + 7.7 - t * 0.03)
  );
  float detail = billow(dp * 1.6);

  return env + (detail - 0.62) * 0.62;
}

// shades one twilight cloud (warm under-lit base + cool indigo upper shadow)
vec3 shadeCloud(vec3 color, vec3 sky, vec2 p, vec2 c, vec2 r, float seed, float t, float dist, vec2 sunPos) {
  float d = cloudDensity(p, c, r, seed, t);
  if (d < 0.02) return color;

  // sample toward the low twilight horizon/sun for under-lit self-shadowing
  vec2 toSun = normalize(sunPos - p + vec2(0.0001));
  vec2 sampleOffset = vec2(toSun.x * r.x * 0.25, -r.y * 0.42);
  float dSun = cloudDensity(p + sampleOffset, c, r, seed, t);
  float occl = clamp((dSun - d) * 1.15 + d * 0.52, 0.0, 1.0);

  // lower clouds catch warmer afterglow; higher clouds shift cooler & duskier
  float heightFactor = clamp(c.y, 0.0, 1.0);
  vec3 warmLit = mix(u_cloud, u_glow * 1.12, (1.0 - heightFactor) * 0.55);
  vec3 deepShadow = mix(u_skyMid * 0.65, u_skyTop * 0.85, 0.55);
  vec3 cloudCol = mix(warmLit, deepShadow, occl * 0.88);

  float alpha = smoothstep(0.02, 0.38, d);

  // golden-rose rim light along thin cloud edges
  float rim = smoothstep(0.02, 0.14, d) * (1.0 - smoothstep(0.14, 0.40, d));
  cloudCol += u_glow * rim * mix(0.28, 0.10, heightFactor);

  // atmospheric perspective: far clouds fade into the twilight sky
  cloudCol = mix(cloudCol, sky, dist * 0.40);
  alpha *= mix(1.0, 0.82, dist);

  return mix(color, cloudCol, alpha);
}

// one drifting cloud: horizontal wrap + gentle vertical bob
vec3 cloudPass(vec3 color, vec3 sky, vec2 p, float aspect, float t,
               float spd, float phase, float y, vec2 r, float seed, float dist, vec2 sunPos) {
  float cx = mix(-r.x - 0.25, aspect + r.x + 0.25, fract(t * spd + phase));
  float cy = y + sin(t * 0.05 + phase * 6.2831) * 0.012;
  return shadeCloud(color, sky, p, vec2(cx, cy), r, seed, t, dist, sunPos);
}

void main() {
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(v_uv.x * aspect, v_uv.y);
  float t = u_time;

  // 3-stop vertical twilight gradient: warm horizon -> dusky violet -> midnight indigo
  vec3 lowerSky = mix(u_skyBottom, u_skyMid, smoothstep(0.0, 0.42, v_uv.y));
  vec3 sky = mix(lowerSky, u_skyTop, smoothstep(0.32, 0.95, v_uv.y));
  vec3 color = sky;

  // wide sunset afterglow seated low on the horizon
  vec2 sunPos = vec2(aspect * 0.65, 0.03);
  vec2 sunDelta = (p - sunPos) * vec2(0.55, 1.8);
  float sunGlow = exp(-dot(sunDelta, sunDelta) * 3.2);
  float horizonBand = smoothstep(0.32, 0.0, v_uv.y);
  color += u_glow * (sunGlow * 0.45 + horizonBand * 0.22);

  // subtle stars emerging in the deep upper twilight sky (occluded by clouds below)
  float starZone = smoothstep(0.52, 0.90, v_uv.y);
  if (starZone > 0.01) {
    vec2 starGrid = floor(p * 140.0);
    vec2 starUv = fract(p * 140.0) - 0.5;
    float rnd = hash(starGrid);
    if (rnd > 0.992) {
      float twinkle = 0.65 + 0.35 * sin(t * (1.5 + rnd * 4.0) + rnd * 62.8);
      float dStar = length(starUv);
      float star = smoothstep(0.28, 0.02, dStar) * twinkle * starZone;
      color += vec3(0.88, 0.90, 1.0) * star * 0.75;
    }
  }

  // high cirrus wisps catching the last warm rays of twilight
  float cirrusBand = smoothstep(0.48, 0.76, v_uv.y) * (1.0 - smoothstep(0.88, 1.0, v_uv.y));
  if (cirrusBand > 0.01) {
    float streak = fbm(vec2(p.x * 1.6 - t * 0.006, p.y * 12.0));
    float wisp = smoothstep(0.52, 0.78, streak) * cirrusBand;
    vec3 cirrusCol = mix(u_cloud, u_glow, 0.45);
    color = mix(color, cirrusCol, wisp * 0.32);
  }

  // far layer: small, high, slow
  if (u_count > 5.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.006, 0.10, 0.84, vec2(0.20, 0.10), 43.7, 1.0, sunPos);
  }
  if (u_count > 4.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.008, 0.62, 0.73, vec2(0.24, 0.12), 71.3, 0.85, sunPos);
  }

  // middle layer
  if (u_count > 3.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.011, 0.33, 0.60, vec2(0.34, 0.16), 17.3, 0.55, sunPos);
  }
  if (u_count > 2.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.013, 0.80, 0.47, vec2(0.30, 0.15), 29.9, 0.45, sunPos);
  }

  // near layer: big, low, fast
  if (u_count > 1.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.016, 0.05, 0.35, vec2(0.46, 0.20), 91.1, 0.15, sunPos);
  }
  color = cloudPass(color, sky, p, aspect, t, 0.020, 0.48, 0.20, vec2(0.56, 0.24), 57.2, 0.0, sunPos);

  gl_FragColor = vec4(color, 1.0);
}
`;

function parseHex(color: string): [number, number, number] {
  const value = color.trim();
  if (value.startsWith("#")) {
    const hex = value.slice(1);
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16) / 255,
        parseInt(hex[1] + hex[1], 16) / 255,
        parseInt(hex[2] + hex[2], 16) / 255,
      ];
    }
    return [
      parseInt(hex.slice(0, 2), 16) / 255,
      parseInt(hex.slice(2, 4), 16) / 255,
      parseInt(hex.slice(4, 6), 16) / 255,
    ];
  }
  const rgb = value.match(/[\d.]+/g);
  if (rgb && rgb.length >= 3) {
    return [Number(rgb[0]) / 255, Number(rgb[1]) / 255, Number(rgb[2]) / 255];
  }
  return [0.95, 0.65, 0.55];
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export const TwilightCloudShader = ({
  className,
  children,
  speed = 1,
  count = 6,
  cloudColor = "#f4a28c",
  skyTopColor = "#0f162e",
  skyMidColor = "#382f5c",
  skyBottomColor = "#c95b4b",
  horizonGlowColor = "#ff9e5e",
}: TwilightCloudShaderProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paramsRef = useRef({
    speed,
    count,
    cloudColor,
    skyTopColor,
    skyMidColor,
    skyBottomColor,
    horizonGlowColor,
  });

  useEffect(() => {
    paramsRef.current = {
      speed,
      count,
      cloudColor,
      skyTopColor,
      skyMidColor,
      skyBottomColor,
      horizonGlowColor,
    };
  }, [
    speed,
    count,
    cloudColor,
    skyTopColor,
    skyMidColor,
    skyBottomColor,
    horizonGlowColor,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
    });
    if (!gl) return;

    const vert = compile(gl, gl.VERTEX_SHADER, VERT);
    const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.bindAttribLocation(program, 0, "a_pos");
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const loc = {
      res: gl.getUniformLocation(program, "u_res"),
      time: gl.getUniformLocation(program, "u_time"),
      count: gl.getUniformLocation(program, "u_count"),
      cloud: gl.getUniformLocation(program, "u_cloud"),
      skyTop: gl.getUniformLocation(program, "u_skyTop"),
      skyMid: gl.getUniformLocation(program, "u_skyMid"),
      skyBottom: gl.getUniformLocation(program, "u_skyBottom"),
      glow: gl.getUniformLocation(program, "u_glow"),
    };

    let frame = 0;
    let running = true;
    let visible = true;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const w = Math.max(1, Math.floor(width * dpr));
      const h = Math.max(1, Math.floor(height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(loc.res, w, h);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const start = performance.now();
    const draw = (now: number) => {
      frame = 0;
      if (!running || !visible) return;
      const p = paramsRef.current;
      const elapsed = reduceMotion ? 0 : ((now - start) / 1000) * p.speed;
      const cloud = parseHex(p.cloudColor);
      const skyTop = parseHex(p.skyTopColor);
      const skyMid = parseHex(p.skyMidColor);
      const skyBottom = parseHex(p.skyBottomColor);
      const glow = parseHex(p.horizonGlowColor);

      gl.uniform1f(loc.time, elapsed);
      gl.uniform1f(loc.count, Math.min(6, Math.max(1, p.count)));
      gl.uniform3f(loc.cloud, cloud[0], cloud[1], cloud[2]);
      gl.uniform3f(loc.skyTop, skyTop[0], skyTop[1], skyTop[2]);
      gl.uniform3f(loc.skyMid, skyMid[0], skyMid[1], skyMid[2]);
      gl.uniform3f(loc.skyBottom, skyBottom[0], skyBottom[1], skyBottom[2]);
      gl.uniform3f(loc.glow, glow[0], glow[1], glow[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      frame = requestAnimationFrame(draw);
    };

    const schedule = () => {
      if (running && visible && frame === 0) {
        frame = requestAnimationFrame(draw);
      }
    };

    schedule();

    // Only burn GPU cycles while the canvas is actually on screen.
    const visibility = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      if (visible) {
        schedule();
      } else if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    visibility.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      visibility.disconnect();
      observer.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
    };
  }, []);

  return (
    <div
      className={cn(
        "relative h-full min-h-80 w-full overflow-hidden",
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
      {children ? (
        <div className="relative z-10 flex h-full w-full items-center justify-center">
          {children}
        </div>
      ) : null}
    </div>
  );
};