"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { Zap, Loader2, KeyRound } from "lucide-react";
import toast from "react-hot-toast";

interface DevLoginProps {
  disable: boolean;
  setDisable: (disable: boolean) => void;
}

export function DevLogin({ disable, setDisable }: DevLoginProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  // In production, this component doesn't render unless explicitly enabled
  const isDevMode =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_ENABLE_DEV_LOGIN === "true";

  if (!isDevMode) return null;

  const handleQuickLogin = async () => {
    try {
      setLoading(true);
      setDisable(true);

      const demoEmail = "demo@lazyfolio.dev";
      const demoPassword = "password123";

      // 1. Try signing in with the seeded demo account
      const signInResult = await authClient.signIn.email({
        email: demoEmail,
        password: demoPassword,
      });

      if (signInResult.error) {
        // If demo user wasn't seeded yet, auto-register it
        const signUpResult = await authClient.signUp.email({
          email: demoEmail,
          password: demoPassword,
          name: "Demo Contributor",
        });

        if (signUpResult.error) {
          toast.error(signUpResult.error.message || "Failed to sign in as demo user");
          setLoading(false);
          setDisable(false);
          return;
        }
      }

      toast.success("Signed in as Demo Contributor!");
      router.replace("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Quick login failed";
      toast.error(message);
      setLoading(false);
      setDisable(false);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      setDisable(true);

      if (mode === "signin") {
        const result = await authClient.signIn.email({ email, password });
        if (result.error) {
          toast.error(result.error.message || "Invalid credentials");
          setLoading(false);
          setDisable(false);
          return;
        }
      } else {
        const result = await authClient.signUp.email({
          email,
          password,
          name: email.split("@")[0],
        });
        if (result.error) {
          toast.error(result.error.message || "Registration failed");
          setLoading(false);
          setDisable(false);
          return;
        }
      }

      toast.success("Authentication successful!");
      router.replace("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      toast.error(message);
      setLoading(false);
      setDisable(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-3 mt-1">
      {/* Visual divider */}
      <div className="relative flex items-center py-2">
        <div className="grow border-t border-(--lf-border)" />
        <span className="shrink-0 mx-3 text-[11px] font-mono tracking-wider text-(--lf-muted)">
          Local Dev Mode
        </span>
        <div className="grow border-t border-(--lf-border)" />
      </div>

      {/* One-Click Demo Button */}
      <button
        type="button"
        onClick={handleQuickLogin}
        disabled={loading || disable}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/15 text-amber-600 dark:text-amber-400 font-sans text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-2xs"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
        )}
        <span>{loading ? "Authenticating..." : "One-Click Dev Login (demo@lazyfolio.dev)"}</span>
      </button>

      {/* Toggle custom credentials */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => setShowCustomForm(!showCustomForm)}
          className="text-[12px] text-(--lf-muted) hover:text-(--lf-ink) underline underline-offset-4 transition-colors cursor-pointer"
        >
          {showCustomForm ? "Hide custom login form" : "Or use custom email & password"}
        </button>
      </div>

      {showCustomForm && (
        <form
          onSubmit={handleCustomSubmit}
          className="w-full flex flex-col gap-2.5 p-3.5 rounded-xl border border-(--lf-border) bg-(--lf-surface) transition-all mt-1"
        >
          <div className="flex items-center gap-2 text-xs font-medium text-(--lf-ink) mb-1">
            <KeyRound size={13} className="text-(--lf-muted)" />
            <span>{mode === "signin" ? "Local Sign In" : "Local Register"}</span>
          </div>

          <input
            type="email"
            placeholder="test@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || disable}
            className="w-full px-3 py-2 text-xs rounded-lg border border-(--lf-border) bg-(--lf-bg) text-(--lf-ink) outline-hidden focus:border-(--lf-ink) transition-colors"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || disable}
            className="w-full px-3 py-2 text-xs rounded-lg border border-(--lf-border) bg-(--lf-bg) text-(--lf-ink) outline-hidden focus:border-(--lf-ink) transition-colors"
          />

          <button
            type="submit"
            disabled={loading || disable}
            className="w-full py-2 text-xs font-medium rounded-lg bg-(--lf-ink) text-(--lf-bg) hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
          >
            {loading ? "Processing..." : mode === "signin" ? "Sign In" : "Register Account"}
          </button>

          <div className="text-center text-[11px] text-(--lf-muted) pt-1">
            {mode === "signin" ? (
              <span>
                Need a new test account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-(--lf-ink) underline"
                >
                  Register
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="text-(--lf-ink) underline"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
