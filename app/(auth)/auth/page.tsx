"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  Moon,
  Sun,
  KeyRound,
  Sparkles,
} from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";
import { useThemeStore } from "@/lib/utils/theme-store";
import { Button } from "@/components/ui/button";

type AuthMode =
  | "signin"
  | "signup"
  | "forgot-password"
  | "forgot-password-verify"
  | "otp-signin"
  | "otp-signin-verify";

function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function GitHubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const isDark = theme === "dark";

  // State
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(null);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  const otpInputRef = useRef<HTMLInputElement>(null);

  const isDevMode =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_ENABLE_DEV_LOGIN === "true";

  // Sync theme
  useEffect(() => {
    if (typeof document === "undefined") return;
    setTheme(
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    );
  }, [setTheme]);

  // Already signed in? Skip auth screen
  useEffect(() => {
    if (session && !sessionLoading) {
      router.replace("/dashboard");
    }
  }, [session, sessionLoading, router]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Fetch Dev OTP helper if in dev mode
  const checkDevOtp = async (targetEmail: string) => {
    if (!isDevMode) return;
    try {
      const res = await fetch(
        `/api/auth/dev-otp?email=${encodeURIComponent(targetEmail.trim().toLowerCase())}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.otp) {
          setDevOtpHint(data.otp);
        }
      }
    } catch {
      // ignore
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      setSocialLoading("google");
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google sign-in failed";
      toast.error(msg);
      setSocialLoading(null);
    }
  };

  // GitHub Login
  const handleGitHubLogin = async () => {
    try {
      setSocialLoading("github");
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "GitHub sign-in failed";
      toast.error(msg);
      setSocialLoading(null);
    }
  };

  // Quick 1-Click Dev Demo Login
  const handleDevDemoLogin = async () => {
    try {
      setLoading(true);
      const demoEmail = "demo@lazyfolio.dev";
      const demoPassword = "password123";

      const signInResult = await authClient.signIn.email({
        email: demoEmail,
        password: demoPassword,
      });

      if (signInResult.error) {
        const signUpResult = await authClient.signUp.email({
          email: demoEmail,
          password: demoPassword,
          name: "Demo Contributor",
        });

        if (signUpResult.error) {
          toast.error(signUpResult.error.message || "Failed to sign in as demo");
          setLoading(false);
          return;
        }
      }

      toast.success("Signed in as Demo Contributor!");
      router.replace("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Dev login failed";
      toast.error(msg);
      setLoading(false);
    }
  };

  // Form submit dispatcher
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      toast.error("Please enter your email address");
      return;
    }

    // 1. SIGN IN with Email & Password
    if (mode === "signin") {
      if (!password) {
        toast.error("Please enter your password");
        return;
      }
      try {
        setLoading(true);
        const result = await authClient.signIn.email({
          email: cleanEmail,
          password,
        });

        if (result.error) {
          toast.error(result.error.message || "Invalid email or password");
          setLoading(false);
          return;
        }

        toast.success("Welcome back!");
        router.replace("/dashboard");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Sign in failed";
        toast.error(msg);
        setLoading(false);
      }
    }

    // 2. SIGN UP with Email & Password
    else if (mode === "signup") {
      if (!password) {
        toast.error("Please enter a password");
        return;
      }
      if (password.length < 8) {
        toast.error("Password must be at least 8 characters long");
        return;
      }
      try {
        setLoading(true);
        const displayName = cleanEmail.split("@")[0];
        const result = await authClient.signUp.email({
          email: cleanEmail,
          password,
          name: displayName,
        });

        if (result.error) {
          toast.error(result.error.message || "Registration failed");
          setLoading(false);
          return;
        }

        toast.success("Account created successfully!");
        router.replace("/dashboard");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Sign up failed";
        toast.error(msg);
        setLoading(false);
      }
    }

    // 3. FORGOT PASSWORD: Send OTP
    else if (mode === "forgot-password") {
      try {
        setLoading(true);
        const res = await authClient.emailOtp.sendVerificationOtp({
          email: cleanEmail,
          type: "forget-password",
        });

        if (res?.error) {
          toast.error(res.error.message || "Failed to send reset code");
          setLoading(false);
          return;
        }

        toast.success("Verification code sent to your email!");
        setCountdown(60);
        setMode("forgot-password-verify");
        setLoading(false);

        setTimeout(() => checkDevOtp(cleanEmail), 600);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to send OTP";
        toast.error(msg);
        setLoading(false);
      }
    }

    // 4. FORGOT PASSWORD: Verify OTP & Reset Password
    else if (mode === "forgot-password-verify") {
      const cleanOtp = otp.trim();
      if (!cleanOtp) {
        toast.error("Please enter the 6-digit verification code");
        return;
      }
      if (!password) {
        toast.error("Please enter your new password");
        return;
      }
      if (password.length < 8) {
        toast.error("Password must be at least 8 characters long");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      try {
        setLoading(true);
        const resetRes = await authClient.emailOtp.resetPassword({
          email: cleanEmail,
          otp: cleanOtp,
          password,
        });

        if (resetRes?.error) {
          toast.error(resetRes.error.message || "Invalid or expired verification code");
          setLoading(false);
          return;
        }

        toast.success("Password reset successfully! Signing you in...");

        const signInResult = await authClient.signIn.email({
          email: cleanEmail,
          password,
        });

        if (signInResult.error) {
          setMode("signin");
          setLoading(false);
          return;
        }

        router.replace("/dashboard");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Password reset failed";
        toast.error(msg);
        setLoading(false);
      }
    }

    // 5. OTP SIGN-IN: Send Code
    else if (mode === "otp-signin") {
      try {
        setLoading(true);
        const res = await authClient.emailOtp.sendVerificationOtp({
          email: cleanEmail,
          type: "sign-in",
        });

        if (res?.error) {
          toast.error(res.error.message || "Failed to send sign-in code");
          setLoading(false);
          return;
        }

        toast.success("Sign-in code sent to your email!");
        setCountdown(60);
        setMode("otp-signin-verify");
        setLoading(false);

        setTimeout(() => checkDevOtp(cleanEmail), 600);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to send code";
        toast.error(msg);
        setLoading(false);
      }
    }

    // 6. OTP SIGN-IN: Verify Code & Sign In
    else if (mode === "otp-signin-verify") {
      const cleanOtp = otp.trim();
      if (!cleanOtp) {
        toast.error("Please enter the verification code");
        return;
      }

      try {
        setLoading(true);
        const res = await authClient.signIn.emailOtp({
          email: cleanEmail,
          otp: cleanOtp,
        });

        if (res?.error) {
          toast.error(res.error.message || "Invalid or expired verification code");
          setLoading(false);
          return;
        }

        toast.success("Welcome back!");
        router.replace("/dashboard");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Verification failed";
        toast.error(msg);
        setLoading(false);
      }
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (countdown > 0 || loading) return;
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      toast.error("Email address missing");
      return;
    }

    try {
      setLoading(true);
      const otpType =
        mode === "forgot-password-verify" ? "forget-password" : "sign-in";

      const res = await authClient.emailOtp.sendVerificationOtp({
        email: cleanEmail,
        type: otpType,
      });

      if (res?.error) {
        toast.error(res.error.message || "Failed to resend code");
        setLoading(false);
        return;
      }

      toast.success("A new verification code has been sent!");
      setCountdown(60);
      setLoading(false);
      setTimeout(() => checkDevOtp(cleanEmail), 600);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to resend code";
      toast.error(msg);
      setLoading(false);
    }
  };

  // Editorial headings in Lazyfolio style
  const renderHeader = () => {
    switch (mode) {
      case "signup":
        return (
          <>
            <p className="mb-7 text-[0.85rem] text-(--lf-muted) font-light leading-relaxed text-center">
              Create an account to build and showcase your portfolio.
            </p>
          </>
        );
      case "forgot-password":
        return (
          <>
            <h1 className="font-serif-display text-[2.1rem] sm:text-[2.4rem] font-normal tracking-tight text-(--lf-ink) leading-[1.1] text-center">
              Reset your
              <span className="italic text-(--lf-accent-text)"> password.</span>
            </h1>
            <p className="mt-2.5 mb-7 text-[0.85rem] text-(--lf-muted) font-light leading-relaxed text-center">
              Enter your email to receive a 6-digit verification code.
            </p>
          </>
        );
      case "forgot-password-verify":
        return (
          <>
            <h1 className="font-serif-display text-[2.1rem] sm:text-[2.4rem] font-normal tracking-tight text-(--lf-ink) leading-[1.1] text-center text-balance">
              Verify your <br />
              <span className="italic text-(--lf-accent-text)">code.</span>
            </h1>
            <p className="mt-2.5 mb-7 text-[0.85rem] text-(--lf-muted) font-light leading-relaxed text-center">
              We sent a 6-digit code to{" "}
              <strong className="font-normal text-(--lf-ink)">{email}</strong>
            </p>
          </>
        );
      case "otp-signin":
        return (
          <>
            <h1 className="font-serif-display text-[2.1rem] sm:text-[2.4rem] font-normal tracking-tight text-(--lf-ink) leading-[1.1] text-center text-balance">
              Sign in with <br />
              one-time <span className="italic text-(--lf-accent-text)">code.</span>
            </h1>
            <p className="mt-2.5 mb-7 text-[0.85rem] text-(--lf-muted) font-light leading-relaxed text-center">
              Enter your email and we&apos;ll send you a passwordless sign-in code.
            </p>
          </>
        );
      case "otp-signin-verify":
        return (
          <>
            <h1 className="font-serif-display text-[2.1rem] sm:text-[2.4rem] font-normal tracking-tight text-(--lf-ink) leading-[1.1] text-center text-balance">
              Check your <br />
              <span className="italic text-(--lf-accent-text)">inbox.</span>
            </h1>
            <p className="mt-2.5 mb-7 text-[0.85rem] text-(--lf-muted) font-light leading-relaxed text-center">
              Enter the 6-digit sign-in code sent to{" "}
              <strong className="font-normal text-(--lf-ink)">{email}</strong>
            </p>
          </>
        );
      case "signin":
      default:
        return (
          <>
            <p className="mb-7 text-[0.85rem] text-(--lf-muted) font-light leading-relaxed text-center">
              Sign in to build and manage your portfolio.
            </p>
          </>
        );
    }
  };

  return (
    <div className="min-h-dvh w-full bg-(--lf-bg) text-(--lf-ink) flex flex-col justify-between px-5 py-5 sm:px-8 sm:py-8 transition-colors duration-300">
      {/* Top Header matching Lazyfolio layout */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="font-serif-display text-xl sm:text-2xl font-medium tracking-tight text-(--lf-ink) hover:opacity-75 transition-opacity"
        >
          Lazyfolio
        </Link>

        <div className="flex items-center gap-2">
          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-(--lf-border) bg-(--lf-surface) text-(--lf-muted) cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all"
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* Back to Home Button */}
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            aria-label="Back to home"
            className="text-(--lf-muted) hover:text-(--lf-ink) hover:bg-(--lf-surface) text-xs font-normal h-9 w-9 sm:w-auto p-0 sm:px-3 rounded-full cursor-pointer transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 sm:mr-1.5" />
            <span className="hidden sm:inline">Back to home</span>
          </Button>
        </div>
      </header>

      {/* Main Centered Column matching Lazyfolio style */}
      <main className="flex-1 flex flex-col items-center justify-center pb-8 sm:pb-12 my-auto">
        <div className="w-full max-w-85 flex flex-col items-center">
          {/* Iconic Lazyfolio Logo Tile */}
          <Link
            href="/"
            className="group inline-flex mb-6"
            title="Lazyfolio Home"
          >
            <div className="w-12 h-12 rounded-[14px] dark:bg-transparent bg-black flex items-center justify-center">
              <Image
                src="/lflogo-removebg.png"
                alt="Lazyfolio Logo"
                width={28}
                height={28}
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Editorial Heading & Subtitle */}
          {renderHeader()}

          {/* Dev OTP Helper Banner */}
          {devOtpHint && (
            <div className="w-full mb-4 px-3 py-2 rounded-xl bg-(--lf-surface) border border-(--lf-border) flex items-center justify-between text-xs text-(--lf-ink) shadow-xs animate-in fade-in">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-(--lf-accent-text)" />
                Dev OTP:{" "}
                <strong className="font-mono font-bold tracking-wider text-(--lf-accent-text)">
                  {devOtpHint}
                </strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  setOtp(devOtpHint);
                  toast.success("Dev OTP filled!");
                }}
                className="text-[11px] font-semibold text-(--lf-accent-text) hover:underline cursor-pointer"
              >
                Auto-fill
              </button>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
            {/* Email Address */}
            {mode !== "forgot-password-verify" && mode !== "otp-signin-verify" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-normal text-(--lf-muted)">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="h-11 w-full rounded-full bg-(--lf-surface) border border-(--lf-border) px-4 text-sm text-(--lf-ink) placeholder:text-(--lf-sub) focus:outline-none focus:border-(--lf-accent) focus:ring-2 focus:ring-(--lf-accent-soft) transition-all"
                />
              </div>
            )}

            {/* Password Field (Sign In & Sign Up) */}
            {(mode === "signin" || mode === "signup") && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-normal text-(--lf-muted)">
                    Password
                  </label>
                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot-password");
                        setOtp("");
                        setDevOtpHint(null);
                      }}
                      className="text-xs font-normal text-(--lf-muted) hover:text-(--lf-accent-text) transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    className="h-11 w-full rounded-full bg-(--lf-surface) border border-(--lf-border) px-4 pr-11 text-sm text-(--lf-ink) placeholder:text-(--lf-sub) focus:outline-none focus:border-(--lf-accent) focus:ring-2 focus:ring-(--lf-accent-soft) transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-(--lf-muted) hover:text-(--lf-ink) transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            )}

            {/* OTP Code Input */}
            {(mode === "forgot-password-verify" || mode === "otp-signin-verify") && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-normal text-(--lf-muted)">
                    6-digit verification code
                  </label>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={countdown > 0 || loading}
                    className="text-xs font-medium text-(--lf-accent-text) hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
                  </button>
                </div>
                <input
                  ref={otpInputRef}
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                  disabled={loading}
                  required
                  autoFocus
                  className="h-12 w-full rounded-full bg-(--lf-surface) border border-(--lf-border) px-4 text-center font-mono text-lg font-bold tracking-[0.3em] text-(--lf-ink) placeholder:tracking-normal placeholder:font-sans placeholder:font-normal placeholder:text-sm placeholder:text-(--lf-sub) focus:outline-none focus:border-(--lf-accent) focus:ring-2 focus:ring-(--lf-accent-soft) transition-all"
                />
              </div>
            )}

            {/* New Password & Confirm Password (Forgot Password Verify) */}
            {mode === "forgot-password-verify" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-normal text-(--lf-muted)">
                    New password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                      className="h-11 w-full rounded-full bg-(--lf-surface) border border-(--lf-border) px-4 pr-11 text-sm text-(--lf-ink) placeholder:text-(--lf-sub) focus:outline-none focus:border-(--lf-accent) focus:ring-2 focus:ring-(--lf-accent-soft) transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-(--lf-muted) hover:text-(--lf-ink) transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-normal text-(--lf-muted)">
                    Confirm new password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      required
                      className="h-11 w-full rounded-full bg-(--lf-surface) border border-(--lf-border) px-4 pr-11 text-sm text-(--lf-ink) placeholder:text-(--lf-sub) focus:outline-none focus:border-(--lf-accent) focus:ring-2 focus:ring-(--lf-accent-soft) transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-(--lf-muted) hover:text-(--lf-ink) transition-colors cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Primary Action Button (Lazyfolio Signature Style) */}
            <button
              type="submit"
              disabled={loading || !!socialLoading}
              className="mt-1 h-11 w-full rounded-full bg-(--lf-accent) hover:bg-(--lf-accent-hover) active:scale-[0.99] text-white font-medium text-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Processing...</span>
                </>
              ) : mode === "signin" ? (
                "Continue"
              ) : mode === "signup" ? (
                "Continue"
              ) : mode === "forgot-password" ? (
                "Send verification code"
              ) : mode === "forgot-password-verify" ? (
                "Reset password & sign in"
              ) : mode === "otp-signin" ? (
                "Send sign-in code"
              ) : (
                "Verify & sign in"
              )}
            </button>

            {/* Divider */}
            {(mode === "signin" || mode === "signup" || mode === "otp-signin") && (
              <div className="relative flex items-center justify-center my-1">
                <div className="border-t border-(--lf-border) w-full" />
                <span className="bg-(--lf-bg) px-3 text-[11px] text-(--lf-muted) uppercase tracking-wider font-light">
                  or
                </span>
                <div className="border-t border-(--lf-border) w-full" />
              </div>
            )}

            {/* Social Logins (Google & GitHub) */}
            {(mode === "signin" || mode === "signup" || mode === "otp-signin") && (
              <div className="flex flex-col gap-2">
                {/* Google Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading || !!socialLoading}
                  className="h-11 w-full rounded-full bg-(--lf-surface) border border-(--lf-border) hover:bg-(--lf-bg) text-(--lf-ink) font-medium text-sm transition-all duration-150 flex items-center justify-center gap-2.5 cursor-pointer shadow-xs disabled:opacity-60"
                >
                  {socialLoading === "google" ? (
                    <Loader2 className="w-4 h-4 animate-spin text-current" />
                  ) : (
                    <GoogleIcon className="w-4 h-4" />
                  )}
                  <span>Continue with Google</span>
                </button>

                {/* GitHub Button */}
                <button
                  type="button"
                  onClick={handleGitHubLogin}
                  disabled={loading || !!socialLoading}
                  className="h-11 w-full rounded-full bg-(--lf-surface) border border-(--lf-border) hover:bg-(--lf-bg) text-(--lf-ink) font-medium text-sm transition-all duration-150 flex items-center justify-center gap-2.5 cursor-pointer shadow-xs disabled:opacity-60"
                >
                  {socialLoading === "github" ? (
                    <Loader2 className="w-4 h-4 animate-spin text-current" />
                  ) : (
                    <GitHubIcon className="w-4 h-4" />
                  )}
                  <span>Continue with GitHub</span>
                </button>
              </div>
            )}

            {/* Alternate One-Time Code / Password Toggle */}
            {mode === "signin" && (
              <div className="text-center mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode("otp-signin");
                    setOtp("");
                  }}
                  className="text-xs text-(--lf-muted) hover:text-(--lf-ink) transition-colors cursor-pointer"
                >
                  Or sign in with a one-time code
                </button>
              </div>
            )}

            {mode === "otp-signin" && (
              <div className="text-center mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setOtp("");
                  }}
                  className="text-xs text-(--lf-muted) hover:text-(--lf-ink) transition-colors cursor-pointer"
                >
                  Or sign in with password
                </button>
              </div>
            )}

            {/* Back to Sign In (for Forgot Password & OTP flows) */}
            {(mode === "forgot-password" ||
              mode === "forgot-password-verify" ||
              mode === "otp-signin-verify") && (
              <div className="text-center mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setOtp("");
                    setDevOtpHint(null);
                  }}
                  className="text-xs text-(--lf-muted) hover:text-(--lf-ink) transition-colors cursor-pointer"
                >
                  ← Back to sign in
                </button>
              </div>
            )}
          </form>

          {/* Mode Switcher: Sign Up vs Sign In */}
          {(mode === "signin" || mode === "signup" || mode === "otp-signin") && (
            <div className="mt-5 text-center text-xs text-(--lf-muted)">
              {mode === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setPassword("");
                    }}
                    className="text-(--lf-accent-text) font-medium hover:underline cursor-pointer"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setPassword("");
                    }}
                    className="text-(--lf-accent-text) font-medium hover:underline cursor-pointer"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          )}

          {/* Quick Dev Demo Login (Development Only) */}
          {isDevMode && (
            <div className="mt-5 pt-4 border-t border-(--lf-border) w-full flex items-center justify-center">
              <button
                type="button"
                onClick={handleDevDemoLogin}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-(--lf-surface) border border-(--lf-border) text-(--lf-muted) hover:text-(--lf-ink) text-[11px] font-medium transition-colors cursor-pointer shadow-xs"
              >
                <KeyRound className="w-3 h-3 text-(--lf-accent-text)" />
                <span>1-Click Dev Login (Demo User)</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Terms & Privacy Footer matching Lazyfolio Pages */}
      <footer className="w-full max-w-85 mx-auto pb-[max(0.25rem,env(safe-area-inset-bottom))]">
        <p className="text-[0.72rem] text-center text-(--lf-muted) leading-relaxed">
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            className="text-(--lf-ink) underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-(--lf-ink) underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </footer>
    </div>
  );
}
