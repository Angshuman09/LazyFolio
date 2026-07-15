import type { ProfileData, UserData } from "../shared/types";
import {
  textValue,
  cleanUrl,
  getBookCallLink,
} from "../shared/utils";
import {
  normalizeLinks,
} from "../shared/normalize";
import Hero from "./components/hero";
import Links from "./components/links";
import Experience from "./components/experience";
import Projects from "./components/projects";
import Blogs from "./components/blogs";
import Stack from "./components/stack";
import BookACall from "./components/bookACall";
import ContactLinks from "./components/contact-links";

export function Template2({
  user,
  profile,
}: {
  user: UserData;
  profile: ProfileData;
}) {
  const name = textValue(profile?.name) || textValue(user?.name);
  const quote = textValue(profile?.quote);
  const avatar = cleanUrl(profile?.avatar) || cleanUrl(user?.image);
  const banner = cleanUrl(profile?.banner);
  const links = normalizeLinks(profile?.links);
  const bookCallLink = getBookCallLink(profile);
  return (
    <>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <main className="min-h-screen bg-[#fbfbfb] text-stone-700 antialiased">
        <div className="max-w-[800px] mx-auto px-6 py-16 sm:py-20">
          {quote && (
            <div className="mb-12 border-l-2 border-stone-300 pl-4">
              <p className="text-xs text-stone-500 italic leading-relaxed">
                {quote}
              </p>
            </div>
          )}

          <Hero avatar={avatar} banner={banner} profile={profile} name={name} />

          <Links links={links} profile={profile} bookCallLink={bookCallLink} />

          <Experience profile={profile} />

          <Projects profile={profile} />

          <Blogs profile={profile} />

          <Stack profile={profile} />

          <BookACall bookCallLink={bookCallLink} avatar={avatar} name={name} />

          <ContactLinks profile={profile} links={links} />

          <div className="mt-14 pt-6 border-t border-stone-200 flex items-center justify-between">
            <p className="text-[11px] text-stone-300">
              built with{" "}
              <span className="text-stone-500 font-medium">lazyfolio</span>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
