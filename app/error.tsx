"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="bg-(--lf-bg) flex flex-col justify-center items-center gap-5 w-full h-screen">
      <h1 className="font-bold text-9xl">500</h1>
      <h1 className="font-semibold text-4xl">Something went wrong</h1>
      <Button
        onClick={reset}
        className="rounded-full py-7 px-6 cursor-pointer"
      >
        Try again
      </Button>
    </div>
  );
}
