
import Hero from "./components/hero";
import Links from "./components/links";
import Experience from "./components/experience";
import Projects from "./components/projects";
import Blogs from "./components/blogs";
import Stack from "./components/stack";
import BookACall from "./components/bookacall";
import ContactInfo from "./components/contactinfo";
import { ProfileData, UserData } from "../shared/types";
import { addProfileContactLinks, cleanUrl, getBookCallLink, textValue } from "../shared/utils";
import { normalizeBlogs, normalizeExperiences, normalizeLinks, normalizeProjects, normalizeStack } from "../shared/normalize";

export function Template1({
  user,
  profile,
}: {
  user: UserData;
  profile: ProfileData;
}) {
  const name = textValue(profile?.name) || textValue(user?.name);
  const quote = textValue(profile?.quote);
  const links = normalizeLinks(profile?.links);
  const contactLinks = addProfileContactLinks(links, profile);
  const experiences = normalizeExperiences(profile?.experiences);
  const projects = normalizeProjects(profile?.projects);
  const blogs = normalizeBlogs(profile?.blogs);
  const stack = normalizeStack(profile?.skills);
  const bookCallLink = getBookCallLink(profile);
  const avatar = cleanUrl(profile?.avatar) || cleanUrl(user?.image);
  const hasQuickActions = links.length > 0 || Boolean(bookCallLink);

  return (
    <>
      <main className="min-h-screen bg-[#0e0e0e] text-zinc-300 antialiased">
        <div className="max-w-160 mx-auto px-5 py-16 sm:py-20">
          {quote && (
            <div className="mb-12 border-l-2 border-zinc-700 pl-4">
              <p className="text-xs text-zinc-500 italic leading-relaxed">
                {quote}
              </p>
            </div>
          )}

          <Hero profile={profile} user={user} avatar={avatar} name={name}/>

          {hasQuickActions && (
          <Links profile={profile} links={links} bookCallLink={bookCallLink}/>
          )}
          {experiences.length > 0 && (
            <Experience experiences={experiences}/>
          )}

          {projects.length > 0 && (
            <Projects projects={projects}/>
          )}

          {blogs.length > 0 && (
            <Blogs blogs={blogs}/>
          )}

          {stack.length > 0 && (
            <Stack stack={stack}/>
          )}

          {bookCallLink && (
            <BookACall name={name} avatar={avatar} bookCallLink={bookCallLink}/>
          )}

          {contactLinks.length > 0 && (
            <ContactInfo profile={profile} contactLinks={contactLinks}/>
          )}

          <div className="mt-14 pt-6 border-t border-zinc-800/60 flex items-center justify-between">
            <p className="text-[11px] text-zinc-800">
              built with <span className="text-zinc-600">lazyfolio</span>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
