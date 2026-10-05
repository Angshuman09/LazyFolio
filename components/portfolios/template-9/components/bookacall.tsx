import Link from "next/link";
import { shouldOpenInNewTab } from "../../shared/utils";
import { Divider } from "./utils";

const BookACall = ({
  bookCallLink,
  name,
}: {
  avatar: string;
  bookCallLink: string;
  name: string;
}) => {
  return (
    <>
      <Divider />
      <section>
        <Link
          href={bookCallLink}
          target={shouldOpenInNewTab(bookCallLink) ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 text-[13px] transition-colors"
          style={{ color: "#5C5044" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full transition-all group-hover:scale-125"
            style={{ background: "#B25C2A" }}
          />
          <span
            className="group-hover:text-[#184E42] transition-colors"
            style={{
              textDecoration: "underline",
              textDecorationColor: "#D8D0C5",
              textUnderlineOffset: "3px",
            }}
          >
            Book a free call with {name || "me"}
          </span>
          <span style={{ color: "#B25C2A" }} className="group-hover:translate-x-0.5 transition-transform inline-block">
            →
          </span>
        </Link>
      </section>
    </>
  );
};

export default BookACall;
