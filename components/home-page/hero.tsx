"use client";
import { authClient } from "@/lib/auth-client";
import { Highlighter } from "../ui/highlighter";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetUserProfile } from "@/hooks/profile";
import toast from "react-hot-toast";
const Hero = () => {
  const { data: session, isPending } = authClient.useSession();
  const [username, setUsername] = useState("");
  const router = useRouter();
  const { data: profile } = useGetUserProfile(session?.user.id);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile?.username) {
      setUsername(profile.username);
    }
  }, [profile?.username]);

  const handleSubmitUsername = async () => {
    setLoading(true);
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
      setLoading(false);
    } catch (error) {
      console.error("Error claiming username:", error);
      toast.error("An error occurred while claiming the username.");
      setLoading(false);
    }
  };
  return (
    // Stop building your portfolio. Start showing it.
    // Yes, you still need a portfolio.
    <section className="home-hero max-w-5xl mx-auto px-5 sm:px-8 text-center mt-15">
      <h1 className="fade-up fade-up-2 home-hero-title font-serif-display font-normal mb-10 text-(--lf-ink)">
        <span className="block">
          Make the internet {" "}
         
            know <Highlighter action="underline" color="#B08D57"> <span className="text-[#c6a87b]">You Exist</span>
          </Highlighter>
        </span>
        {/* <span className="block mt-4"> Start showing it.</span> */}
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
          disabled={loading}
          onClick={handleSubmitUsername}
          className="group inline-flex items-center justify-center gap-2 bg-(--lf-ink) text-(--lf-bg) text-[0.875rem] font-semibold min-h-[56px] sm:min-h-[52px] px-6 rounded-[14px] hover:opacity-85 active:scale-[0.97] transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0"
        >
          {loading ? "Claiming..." : "Claim username"}
          <span className="btn-arrow w-5 h-5 rounded-full bg-(--lf-bg) text-(--lf-ink) inline-flex items-center justify-center text-[10px] font-bold leading-none shrink-0">
            ↗
          </span>
        </button>
      </div>

      <div>
        <h1 className="text-5xl font-normal pt-12 font-serif-display">
          How to use?
        </h1>
        <p>video will be attached after deployment :)</p>
      </div>
    </section>
  );
};

export default Hero;
