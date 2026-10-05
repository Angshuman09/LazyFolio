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
      <div
        className="px-4 py-3 rounded-lg text-[12.5px] bg-fuchsia-50 border border-fuchsia-200 hover:border-fuchsia-400"
      >
        <span style={{ color: "#4B5563" }}>
          Want to chat? {" "}
        </span>
        <Link
          href={bookCallLink}
          target={shouldOpenInNewTab(bookCallLink) ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="font-medium transition-colors hover:text-fuchsia-600"
          style={{ color: "#FF00FF", textDecoration: "underline", textUnderlineOffset: "2px" }}
        >
          Book a free call with {name || "me"} →
        </Link>
      </div>
    </>
  );
};

export default BookACall;
