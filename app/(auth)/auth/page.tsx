"use client";

import { GoogleAuth } from "@/components/auth/google-auth";
import { GithubAuth } from "@/components/auth/github-auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from 'next/image';
import { ArrowLeft } from "lucide-react";

export default function Auth() {
  const router = useRouter();
  const [disable, setDisable] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-(--lf-bg) text-(--lf-ink)">
      <div className="relative flex flex-col justify-between px-8 py-10 md:w-1/2 md:min-h-screen md:px-16 md:py-20 border-b md:border-b-0 md:border-r border-(--lf-border-alpha) bg-(--lf-surface) overflow-hidden shrink-0">

        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#c6a87b]/8 dark:bg-[#c6a87b]/4 blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex items-center">
          <h1
            onClick={() => router.push("/")}
            className="font-serif-display text-4xl md:text-5xl tracking-tight text-(--lf-ink) cursor-pointer select-none group"
          >
            Lazy<span className="font-bold text-[#c6a87b] transition-all duration-300 group-hover:text-[#dbbd8e]">folio</span>
          </h1>
        </div>

        <div className="hidden md:flex flex-col relative z-10 my-auto pt-10">
          <div className="relative group max-w-[460px] w-full p-2.5 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/5 backdrop-blur-md transition-all duration-500">
            <div className="relative overflow-hidden rounded-xl">
              <Image
                src="/auth.png"
                alt="auth-image"
                width={500}
                height={500}
                quality={100}
                className="w-full h-auto object-cover transform scale-100 hover:scale-[1.015] transition-all duration-700 ease-out"
                priority
              />
              <div
                className="absolute inset-0 pointer-events-none rounded-xl"
                style={{
                  boxShadow: "inset 0 0 60px 40px var(--lf-surface)",
                }}
              />
            </div>
          </div>
          <p className="mt-8 text-(--lf-muted) font-serif-display text-lg leading-relaxed max-w-sm">
            No <span className="font-bold italic">deployment</span>. No <span className="font-bold italic">setup</span>. Just create and share. Show off your work
            effortlessly.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center flex-1 px-8 py-16 md:px-16 md:py-20 relative bg-(--lf-bg) overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 rounded-full bg-[#c6a87b]/4 blur-[140px] pointer-events-none" />

        <div className="w-full max-w-sm mx-auto relative z-10">
          <div className="mb-10 text-center md:text-left">
            <h2 className="font-serif-display text-4xl font-normal tracking-tight text-(--lf-ink) sm:text-5xl leading-tight">
              Welcome back Senpai
            </h2>
            <p className="mt-3 text-[0.88rem] text-(--lf-muted) font-sans-body">
              Sign in to manage your portfolio and settings.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <GoogleAuth disable={disable} setDisable={setDisable} />
            <GithubAuth disable={disable} setDisable={setDisable} />

            <div className="mt-8 flex items-center justify-center">
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="text-(--lf-muted) hover:text-(--lf-ink) hover:bg-(--lf-surface) text-sm font-medium transition-colors font-sans-body rounded-2xl px-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
