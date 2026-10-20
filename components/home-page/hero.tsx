"use client";
import { authClient } from "@/lib/auth/auth-client";
import { Highlighter } from "../ui/highlighter";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGetUserProfile } from "@/hooks/profile";
import toast from "react-hot-toast";
import Image from "next/image";
import { isReservedUsername } from "@/lib/utils/username";
import { motion } from "motion/react";

const Hero = () => {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const [username, setUsername] = useState("");
  const router = useRouter();
  const { data: profile, isPending: isProfileLoading } = useGetUserProfile(
    session?.user.id,
  );
  const [isClaiming, setisClaiming] = useState(false);
  const [hasEditedUsername, setHasEditedUsername] = useState(false);
  const usernameValue = hasEditedUsername ? username : profile?.username || "";

  const isLoading =
    isSessionLoading || (!!session && isProfileLoading) || isClaiming;

  const handleSubmitUsername = async () => {
    setisClaiming(true);
    if (!session) {
      router.push("/auth");
      return;
    }
    const uname = usernameValue.trim().toLowerCase();

    if (!uname) {
      toast.error("Username cannot be empty");
      setisClaiming(false);
      return;
    }

    if (isReservedUsername(uname)) {
      toast(`${uname} can't be a username!`, {
        style: {
          borderRadius: '10px',
          background: '#fff3cd',
          color: '#856404',
        },
      });
      setisClaiming(false)
      return;
    }

    try {
      const response = await fetch("/api/dashboard/username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: uname, userId: session.user.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error);
        return;
      }

      const data = await response.json();
      console.log("Username claimed successfully:", data);
      toast.success("Username claimed successfully!");
      setisClaiming(false);
    } catch (error) {
      console.error("Error claiming username. ", error);
      toast.error("An error occurred while claiming the username.");
      setisClaiming(false);
    } finally {
      setisClaiming(false);
    }
  };

  return (
    <section className="home-hero max-w-5xl mx-auto px-5 sm:px-8 text-center mt-24 mb-10">
      <h1 className="home-hero-title font-serif-display font-normal mb-6 text-(--lf-ink)">
        <span className="block">
          Make the internet
        </span>

        <span className="block">
          know{" "}
          <Highlighter
            action="underline"
            color="var(--lf-accent)"
            strokeWidth={2}
            iterations={2}
            padding={3}
            animationDuration={900}
          >
            <span className="italic text-(--lf-accent-text)">you exist.</span>
          </Highlighter>
        </span>
      </h1>

      <p className="mx-auto max-w-2xl font-serif-display text-[0.98rem] sm:text-[1.05rem] leading-[1.7] text-balance text-(--lf-muted)">
        Build your portfolio in{" "}
        <em className="text-(--lf-accent-text)">minutes</em>, not after hours of
        tweaking layouts and writing everything from{" "}
        <em className="text-(--lf-accent-text)">scratch</em>.
      </p>

      <div
        className="w-full max-w-100 mx-auto mb-10 mt-10 px-4 sm:px-0"
      >
        <div className="flex items-center w-full h-14 rounded-full border border-(--lf-border) bg-(--lf-surface) pr-1.5 sm:pr-2 focus-within:border-(--lf-accent)">
          <span className="hidden sm:inline pl-5 text-[0.75rem] text-(--lf-dimmed)">
            https://
          </span>

          <input
            type="text"
            placeholder="yourname"
            aria-label="Choose your lazyfolio username"
            value={usernameValue}
            onChange={(e) => {
              setHasEditedUsername(true);
              setUsername(e.target.value);
            }}
            className="bg-transparent border-none outline-none font-mono text-[0.8125rem] font-medium text-(--lf-ink) w-full min-w-0 px-2 sm:px-1 placeholder:text-(--lf-dimmed)"
          />

          <button
            disabled={isLoading}
            onClick={handleSubmitUsername}
            className="group shrink-0 h-10 sm:h-11 inline-flex items-center gap-2 rounded-full bg-(--lf-ink) text-(--lf-bg) text-[0.75rem] sm:text-[0.8125rem] font-semibold pl-5 pr-2 sm:pr-2.5 hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
          >
            {isClaiming ? "Claiming..." : "claim username"}

            <span
              aria-hidden="true"
              className="btn-arrow w-5 h-5 bg-(--lf-bg) text-(--lf-ink) rounded-full inline-flex items-center justify-center text-[10px] font-bold leading-none"
            >
              ↗
            </span>
          </button>
        </div>
        <p className="mt-3 text-[0.72rem] text-(--lf-muted)">Claim your username before it&apos;s too late!</p>
      </div>

      <div className="mt-12">
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif-display text-3xl sm:text-4xl font-normal leading-tight text-(--lf-ink) flex justify-center pb-7"
        >
          <span className="block w-fit tracking-wide">
            Everything you need to get things <span className="text-(--lf-accent-text)">done.</span>
          </span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 26, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[1.5rem] border border-(--lf-border) bg-(--lf-surface) p-2 sm:p-2.5 shadow-[0_25px_60px_-25px_rgba(0,0,0,0.2)] dark:shadow-[0_25px_60px_-25px_rgba(0,0,0,0.6)]"
        >
          <Image
            src="/apppreview.png"
            alt="Lazyfolio dashboard preview"
            width={1000}
            height={1000}
            loading="eager"
            className="rounded-xl w-full"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
