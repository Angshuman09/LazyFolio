import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TemplateRenderer } from "@/components/portfolios/template-renderer";

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
    include: {
      user: true,
      experiences: true,
      projects: true,
      blogs: true,
      links: true,
    },
  });

  if (!profile) {
    notFound();
  }

  const { user, ...profileData } = profile;

  return (
    <TemplateRenderer 
      slug={params} 
      user={user} 
      profile={profileData} 
    />
  );
}