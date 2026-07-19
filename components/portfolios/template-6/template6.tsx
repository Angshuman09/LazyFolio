
import { ThemedPortfolioProps } from "../shared/types";
import {
  cleanUrl,
  getBookCallLink,
  textValue,
} from "../shared/utils";
import Hero from "./components/hero";
import Links from "./components/links";
import Projects from "./components/projects";
import Blogs from "./components/blogs";
import Stacks from "./components/stacks";
import Experience from "./components/experience";
import BookACall from "./components/bookacall";

export function Template6(props: ThemedPortfolioProps) {
  const { user, profile } = props;

  const name         = textValue(profile?.name)   || textValue(user?.name);
  const avatar       = cleanUrl(profile?.avatar)  || cleanUrl(user?.image);
  const bookCallLink = getBookCallLink(profile);

  return (
    <>
      <main
        className="min-h-screen bg-[#FDF6EC] text-[#1A3D2B]"
        style={{ fontFamily: "'DM Sans', system-ui, sans-serif", containerType: "inline-size" }}
      >
        <div className="max-w-[700px] mx-auto px-[22px] pt-10 pb-20">
          <Hero profile={profile} avatar={avatar} name={name}/>
          <Links profile={profile} bookCallLink={bookCallLink}/>
          <Experience profile={profile} />
          <Projects profile={profile}/>
          <Blogs profile={profile}/>
          <Stacks profile={profile}/>
          <BookACall avatar={avatar} name={name} bookCallLink={bookCallLink}/>
          <footer className="mt-14 pt-6 border-t-[1.5px] border-[#D5E5DA] flex items-center justify-between gap-3 max-[580px]:flex-col max-[580px]:items-start">
            <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#7A9585] m-0">
              Built with Lazyfolio
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}