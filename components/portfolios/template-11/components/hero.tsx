import Image from "next/image";
import Link from "next/link";
import { NormalizedLink, ProfileData } from "../../shared/types";
import { getLinkIcon } from "../../shared/link-icon";
import { shouldOpenInNewTab, textValue } from "../../shared/utils";
import { trackClick } from "@/lib/utils/track-click";

const Hero = ({
  profile,
  avatar,
  name,
  links,
  bookCallLink,
}: {
  profile: ProfileData;
  avatar: string;
  name: string;
  links: NormalizedLink[];
  bookCallLink: string;
}) => {
  const email = textValue(profile?.email);
  const location = textValue(profile?.location);
  const bio = textValue(profile?.bio);

  return (
    <div>
      {/* Resume header — name left, contact details right (like reference) */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          {avatar && (
            <Image
              src={avatar}
              alt={name || "Profile"}
              width={40}
              height={40}
              unoptimized
              className="rounded-sm object-cover shrink-0"
              style={{ border: "1px solid #E2E8F0" }}
            />
          )}
          <h1
            className="text-[20px] font-bold tracking-tight leading-tight"
            style={{ color: "#1A1A1A", fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            {name}
          </h1>
        </div>

        {/* Inline contact row — like Tony Z. Chen: website · email · location */}
        <div
          className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px]"
          style={{ color: "#64748B", fontFamily: "'Courier New', Courier, monospace" }}
        >
          {email && (
            <a
              href={`mailto:${email}`}
              className="hover:text-[#1A1A1A] transition-colors"
            >
              {email}
            </a>
          )}
          {location && (
            <span>{location}</span>
          )}
        </div>
      </div>

      {/* Bio */}
      {bio && (
        <p
          className="text-[13px] leading-relaxed mt-3 max-w-2xl"
          style={{ color: "#475569", fontFamily: "system-ui, -apple-system, sans-serif" }}
        >
          {bio}
        </p>
      )}

      {/* Social links — flat row */}
      {links.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3">
          {links.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              target={shouldOpenInNewTab(link.href) ? "_blank" : undefined}
              rel="noopener noreferrer"
              onClick={() => trackClick(profile?.id ?? undefined, link.label)}
              className="inline-flex items-center gap-1.5 text-[11.5px] transition-colors hover:text-[#1A1A1A] group"
              style={{
                color: "#64748B",
                fontFamily: "'Courier New', Courier, monospace",
              }}
            >
              <span className="opacity-60 group-hover:opacity-100">
                {getLinkIcon(link.label, link.href, 11, 1.6)}
              </span>
              {link.label}
            </Link>
          ))}
          {bookCallLink && (
            <Link
              href={bookCallLink}
              target={shouldOpenInNewTab(bookCallLink) ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="text-[11.5px] transition-colors hover:text-[#1A1A1A]"
              style={{
                color: "#64748B",
                fontFamily: "'Courier New', Courier, monospace",
              }}
            >
              schedule a call →
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Hero;
