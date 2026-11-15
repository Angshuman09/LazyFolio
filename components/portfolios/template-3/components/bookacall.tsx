import Link from "next/link";
import Image from "next/image";
import { shouldOpenInNewTab } from "../../shared/utils";
import { ArrowRight, Calendar } from "lucide-react";

interface BookACallProps {
  avatar?: string;
  bookCallLink?: string;
  name?: string;
}

export default function BookACall({
  avatar,
  bookCallLink,
  name,
}: BookACallProps) {
  if (!bookCallLink) return null;

  return (
    <section className="mt-16 sm:mt-20">
      <Link
        href={bookCallLink}
        target={shouldOpenInNewTab(bookCallLink) ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="group flex items-center gap-4 p-5 rounded-xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/80 hover:border-neutral-700 transition-all duration-150"
      >
        {avatar ? (
          <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-neutral-700">
            <Image
              src={avatar}
              alt={name || "Profile avatar"}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center shrink-0 text-neutral-400 border border-neutral-700">
            <Calendar size={16} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-normal text-neutral-100">
            Let&apos;s build together
          </p>
          <p className="text-[13px] text-neutral-400 mt-0.5">
            Book a slot on my calendar to talk.
          </p>
        </div>
        <ArrowRight
          size={14}
          className="text-neutral-500 group-hover:text-neutral-300 group-hover:translate-x-0.5 transition-all duration-150 shrink-0"
        />
      </Link>
    </section>
  );
}
