import { getBookCallLink, shouldOpenInNewTab, textValue } from "../../shared/utils";
import type { ProfileData } from "../../shared/types";
import { toParagraphs } from "./utils";

const bodyText =
  "m-0 max-w-[564px] text-[18px] leading-[1.54] tracking-[-0.022em] max-[620px]:text-[17px]";

export default function Hero({ profile }: { profile: ProfileData }) {
  const bio = textValue(profile?.bio);
  const tagline = textValue(profile?.tagline) || textValue(profile?.headline);
  const quote = textValue(profile?.quote);
  const email = textValue(profile?.email);
  const bookCallLink = getBookCallLink(profile);
  const intro = toParagraphs(bio || tagline);

  if (intro.length === 0) return null;

  return (
    <section
      className="mt-[54px] max-[620px]:mt-[42px]"
      aria-label="Introduction"
    >
      <div className="grid gap-3">
        {intro.map((paragraph) => (
          <p key={paragraph} className={bodyText}>
            {paragraph}
          </p>
        ))}
      </div>

      {quote && <p className={`${bodyText} mt-4 text-[#55555d]`}>{quote}</p>}

      {(bookCallLink || email) && (
        <p className={`${bodyText} mt-4`}>
          Want to work together?{" "}
          {bookCallLink && (
            <a
              className="text-[#1b1bff] transition-opacity duration-150 hover:opacity-70"
              href={bookCallLink}
              target={shouldOpenInNewTab(bookCallLink) ? "_blank" : undefined}
              rel="noopener noreferrer"
            >
              Book a call
            </a>
          )}
          {bookCallLink && email && " or "}
          {email && (
            <a
              className="text-[#1b1bff] transition-opacity duration-150 hover:opacity-70"
              href={"mailto:" + email}
            >
              send an email
            </a>
          )}
          .
        </p>
      )}
    </section>
  );
}
