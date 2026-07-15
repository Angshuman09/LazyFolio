
import type { ProfileData, UserData } from "../shared/types";
import {
  textValue,
  cleanUrl,
  getBookCallLink,
} from "../shared/utils";
import { Footer } from "./components/utils";
import Hero from "./components/hero";
import Links from "./components/links";
import Experience from "./components/experience";
import Projects from "./components/projects";
import Blogs from "./components/blogs";
import Stack from "./components/stack";
import BookACall from "./components/bookacall";

export function Template3({
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
  const bookCallLink = getBookCallLink(profile);
  return (
      <main className="relative min-h-screen bg-white text-slate-700 antialiased selection:bg-slate-100 selection:text-slate-900">
        <div className="max-w-[680px] mx-auto px-6 py-10 sm:py-15">

          <Hero profile={profile} avatar={avatar} banner={banner} name={name}/>

          <Links profile={profile} bookCallLink={bookCallLink}/>

          <Experience profile={profile}/>

          <Projects profile={profile}/>

          <Blogs profile={profile}/>

          <Stack profile={profile}/>

          <BookACall bookCallLink={bookCallLink} name={name} avatar={avatar}/>

          {quote && (
            <div className="mt-16 flex flex-col items-start gap-3">
              <p className="text-[14px] md:whitespace-nowrap text-slate-400 italic leading-relaxed max-w-sm border-l-2 border-slate-100 pl-4">
                {quote}
              </p>
            </div>
          )}
        </div>
        <Footer />
      </main>
  );
}