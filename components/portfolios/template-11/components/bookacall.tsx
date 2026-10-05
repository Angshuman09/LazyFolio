import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { shouldOpenInNewTab } from "../../shared/utils";

const BookACall = ({
  bookCallLink,
  name,
}: {
  bookCallLink: string;
  name: string;
  avatar?: string;
}) => {
  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <Link
        href={bookCallLink}
        target={shouldOpenInNewTab(bookCallLink) ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 hover:text-slate-900 border border-slate-200 rounded-md px-2.5 py-1.5 hover:border-slate-400 transition-all"
      >
        Schedule a call
        <ArrowRight size={10} />
      </Link>
    </div>
  );
};

export default BookACall;
