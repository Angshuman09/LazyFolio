"use client";
import { authClient } from "@/lib/auth-client";
import { Highlighter } from "../ui/highlighter";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetUserProfile } from "@/hooks/profile";
import toast from "react-hot-toast";
import Image from "next/image";
const Hero = () => {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const [username, setUsername] = useState("");
  const router = useRouter();
  const { data: profile, isPending: isProfileLoading } = useGetUserProfile(
    session?.user.id,
  );
  const [isClaiming, setisClaiming] = useState(false);

  const isLoading =
    isSessionLoading || (!!session && isProfileLoading) || isClaiming;

  useEffect(() => {
    if (profile?.username) {
      setUsername(profile.username);
    }
  }, [profile?.username]);

  const handleSubmitUsername = async () => {
    setisClaiming(true);
    if (!session) {
      router.push("/auth");
      return;
    }

    try {
      const response = await fetch("/api/dashboard/username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, userId: session.user.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error("Error claiming username:", errorData.error);
        return;
      }

      const data = await response.json();
      console.log("Username claimed successfully:", data);
      toast.success("Username claimed successfully!");
      setisClaiming(false);
    } catch (error) {
      console.error("Error claiming username:", error);
      toast.error("An error occurred while claiming the username.");
      setisClaiming(false);
    } finally {
      setisClaiming(false);
    }
  };
  return (
    <section className="home-hero max-w-5xl mx-auto px-5 sm:px-8 text-center mt-24 mb-10">
      <h1 className="fade-up fade-up-2 home-hero-title font-serif-display font-normal mb-10 text-(--lf-ink)">
        <span className="block">Make the internet</span>

        <span className="block mt-2">
          know{" "}
          <Highlighter action="underline" color="#B08D57">
            <span className="text-[#c6a87b]">You Exist.</span>
          </Highlighter>
        </span>
      </h1>

      <p className="tracking-wider font-serif-display">
        Build your portfolio in{" "}
        <span className="text-(--lf-tan-text) font-bold">
          <em>minutes</em>
        </span>
        , not after hours of tweaking layouts and writing everything from{" "}
        <span className="text-(--lf-tan-text) font-bold">
          <em>scratch </em>
        </span>
        &gt;◡&lt;
      </p>

      <div className="fade-up fade-up-3 flex flex-col sm:flex-row items-stretch justify-center gap-4 sm:gap-3 w-full px-4 sm:px-0 max-w-[460px] mx-auto mb-10 mt-17">
        <label className="flex items-center flex-1 min-w-0 rounded-[14px] border border-(--lf-border) bg-(--lf-surface) px-6 sm:px-4 min-h-[56px] sm:min-h-[52px] gap-2 sm:gap-1 transition-colors duration-150 focus-within:border-(--lf-tan) cursor-text">
          <span className="font-mono text-[0.8125rem] text-(--lf-muted) whitespace-nowrap select-none shrink-0">
            lazyfolio.com/
          </span>
          <input
            type="text"
            placeholder="yourname"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-transparent border-none outline-none font-mono text-[0.8125rem] font-medium text-(--lf-ink) w-full min-w-0 placeholder:text-(--lf-dimmed)"
          />
        </label>
        <button
          disabled={isLoading}
          onClick={handleSubmitUsername}
          className="group inline-flex disabled:cursor-not-allowed disabled:opacity-40 items-center justify-center gap-2 bg-(--lf-ink) text-(--lf-bg) text-[0.875rem] font-semibold min-h-[42px] sm:min-h-[42px] px-4 rounded-[6px] hover:opacity-85 active:scale-[0.97] transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0"
        >
          {isClaiming ? "Claiming..." : "Claim username"}
          <span className="btn-arrow w-5 h-5 rounded-full bg-(--lf-bg) text-(--lf-ink) inline-flex items-center justify-center text-[10px] font-bold leading-none shrink-0">
            ↗
          </span>
        </button>
      </div>

      <div className="mt-15">
        <h2 className="text-xl sm:text-3xl font-normal leading-tight flex flex-col tracking-tight mb-4 text-center text-(--lf-ink)">
          <span className="block font-semibold tracking-wide text-[#8b7d72] font-serif-display">
            Everything you need.
          </span>
          <span className="italic tracking-wide text-[#d0bea3] font-semibold font-serif-display">
            Nothing extra.
          </span>
        </h2>

        <div className="relative">
          <Image
            src="/show.png"
            alt="this image"
            width={1000}
            height={1000}
            className="rounded-md w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
