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
    <div className="flex min-h-screen w-full bg-(--lf-bg) text-(--lf-ink)">

      {/* LEFT — full bleed image panel */}
      <div className="relative hidden md:flex w-[52%] min-h-screen shrink-0 overflow-hidden">
        <Image
          src="/peace.jpg"
          alt="wheat field"
          fill
          className="object-cover object-bottom"
          priority
          quality={60}
        />
        {/* gradient overlay — dark at top and bottom, clear in middle */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-black/55" />

        {/* content pinned top and bottom */}
        <div className="relative z-10 flex flex-col justify-between p-10 h-full w-full">
          <h1
            onClick={() => router.push("/")}
            className="font-serif-display text-[1.75rem] tracking-tight text-[#F5EFE4] cursor-pointer select-none"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.25)" }}
          >
            Lazy<span className="font-bold text-[#E8C98A]">folio</span>
          </h1>

          <div className="flex flex-col gap-2">
            <p
              className="font-serif-display text-[1.9rem] font-normal leading-[1.25] text-[#F5EFE4] max-w-[300px]"
              style={{ textShadow: "0 1px 12px rgba(0,0,0,0.3)" }}
            >
              Your work,{" "}
              <em className="italic text-[#E8C98A]">beautifully</em> shared.
            </p>
            <p className="text-[0.8rem] font-light text-[#F5EFE4]/65 tracking-wide">
              No deployment. No setup. Just a link.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT — clean form */}
      <div className="flex flex-col flex-1 items-center justify-center px-8 py-16 relative bg-(--lf-bg)">

        {/* back link top-right */}
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="absolute top-6 right-6 text-(--lf-muted) hover:text-(--lf-ink) text-xs font-normal px-3"
        >
          <ArrowLeft className="h-3 w-3 mr-1.5" />
          Back to home
        </Button>

        <div className="w-full max-w-[340px]">
          <div className="mb-10">
            <p className="text-[0.68rem] font-medium tracking-[0.14em] uppercase text-[#C6A87B] mb-3">
              Welcome back
            </p>
            <h2 className="font-serif-display text-[2.4rem] font-normal tracking-tight text-(--lf-ink) leading-[1.15] mb-2">
              Hello,{" "}
              <em className="italic text-[#8C6B3E]">Senpai.</em>
            </h2>
            <p className="text-[0.84rem] text-(--lf-muted) font-light leading-relaxed">
              Sign in to manage your portfolio and settings.
            </p>
          </div>

          {/* subtle divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-(--lf-border)" />
            <span className="text-[0.7rem] text-(--lf-muted) tracking-wide font-light">continue with</span>
            <div className="flex-1 h-px bg-(--lf-border)" />
          </div>

          <div className="flex flex-col gap-3">
            <GoogleAuth disable={disable} setDisable={setDisable} />
            <GithubAuth disable={disable} setDisable={setDisable} />
          </div>

          <p className="mt-8 text-center text-[0.7rem] text-(--lf-muted) font-light leading-relaxed">
            By signing in you agree to our{" "}
            <span className="text-[#C6A87B] cursor-pointer hover:text-[#8C6B3E]">Terms</span>{" "}
            and{" "}
            <span className="text-[#C6A87B] cursor-pointer hover:text-[#8C6B3E]">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}