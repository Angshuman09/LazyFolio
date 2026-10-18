import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="bg-(--lf-bg) flex flex-col justify-center items-center gap-5 w-full h-screen">
      <h1 className="font-bold text-9xl">404</h1>
      <h1 className="font-semibold text-4xl">Page Not Found</h1>
      <Button asChild className="rounded-full py-7 px-6 cursor-pointer">
        <Link href="/">Go home</Link>
      </Button>
    </div>
  );
}
