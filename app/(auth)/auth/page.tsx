"use client";

import { GoogleAuth } from "@/components/auth/google-auth";
import { GithubAuth } from "@/components/auth/github-auth";
import {
  GitMerge,
  Scissors,
  FileDown,
  ScanText,
  FileSearch,
  RotateCw,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

const features = [
  { icon: GitMerge, label: "Merge PDFs" },
  { icon: Scissors, label: "Split PDFs" },
  { icon: FileDown, label: "Compress" },
  { icon: ScanText, label: "OCR" },
  { icon: FileSearch, label: "Extract Text" },
  { icon: RotateCw, label: "Rotate" },
];

export default function Auth() {
  const router = useRouter();
  const [disable, setDisable] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-white">
      {/* Left Panel — Branding */}
      <div className="relative flex flex-col justify-between px-8 py-10 md:w-1/2 md:min-h-screen md:px-16 md:py-20 min-h-[300px] bg-rose-50">
        {/* Subtle decorative grid background for the left panel */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="auth-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#auth-grid)" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            We<span className="text-red-600">Love</span>PDF
          </h1>
          <p className="mt-1.5 text-slate-500 text-sm font-medium">
            Free & open source PDF tools
          </p>
        </div>

        {/* Tagline */}
        <div className="hidden md:block relative z-10">
          <p className="text-4xl font-bold text-slate-900 leading-[1.1] tracking-tight">
            All the PDF tools
            <br />
            you'll ever need.
          </p>
          <p className="mt-4 text-slate-500 text-base leading-relaxed max-w-sm">
            Merge, split, compress, and convert — right in your browser. No
            uploads, no servers, no nonsense.
          </p>
        </div>

        {/* Features grid — desktop */}
        <div className="hidden md:block relative z-10">
          <div className="grid grid-cols-2 gap-3">
            {features.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200/60 bg-white/60 backdrop-blur-sm"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 ring-1 ring-red-100/50 shrink-0">
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </div>
                <span className="text-slate-700 text-sm font-semibold">
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 shrink-0"></span>
            <p className="text-xs font-medium text-slate-500">
              Private by design. Your files never leave your device.
            </p>
          </div>
        </div>

        {/* Features — mobile compact pills */}
        <div className="flex flex-wrap gap-2 md:hidden mt-6 relative z-10">
          {features.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm"
            >
              <Icon
                className="h-3.5 w-3.5 text-red-600 shrink-0"
                strokeWidth={2}
              />
              <span className="text-slate-700 text-xs font-semibold">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel — Auth */}
      <div className="flex flex-col justify-center flex-1 px-8 py-12 md:px-16 md:py-20 relative bg-white">
        <div className="w-full max-w-sm mx-auto relative z-10">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Welcome back
            </h2>
            <p className="mt-2 text-base text-slate-500">
              Sign in to save your work and access history.
            </p>
          </div>

          <div className="flex flex-col gap-3">

              <GoogleAuth disable={disable} setDisable={setDisable} />
            <GithubAuth disable={disable} setDisable={setDisable} />


            <div className="mt-6 flex items-center justify-center">
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 text-sm font-medium transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to home
              </Button>
            </div>
          </div>

          <div className="mt-12 flex justify-center md:hidden">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              <p className="text-xs font-medium text-slate-500">
                Your files stay on your device
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}