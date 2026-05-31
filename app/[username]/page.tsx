import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TemplateRenderer } from "@/components/portfolios/template-renderer";

const publicProfileSelect = {
  id: true,
  avatar: true,
  banner: true,
  name: true,
  email: true,
  quote: true,
  userId: true,
  username: true,
  bio: true,
  skills: true,
  themeId: true,
  resume: true,
  tagline: true,
  bookAcall: true,
  views: true,
  createdAt: true,
  updatedAt: true,
  user: true,
  experiences: true,
  projects: true,
  blogs: true,
  links: true,
};

interface PageProps {
  params: Promise<{ username: string }> | { username: string };
}

export default async function UserPortfolioPage(props: PageProps) {
  // Await params to support both Next.js 14 and 15
  const params = await props.params;
  const username = params?.username;

  if (!username) {
    notFound();
  }

  const profile = await prisma.profile.findUnique({
    where: { username },
    select: publicProfileSelect,
  });

  if (!profile) {
    notFound();
  }

  const { user, ...profileData } = profile;

  return (
    <TemplateRenderer 
      // slug={params} 
      user={user} 
      profile={profileData} 
    />
  );
}
