import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TemplateRenderer } from "@/components/portfolios/template-renderer";
import { parseSkill } from "@/lib/utils";
import { cacheLife, cacheTag } from "next/cache";
import { after } from "next/server";
import { headers } from "next/headers";
import { trackPageView } from "@/lib/analytics";

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
  createdAt: true,
  updatedAt: true,
  user: true,
  experiences: { where: { isenable: true } },
  projects: { where: { isenable: true } },
  blogs: { where: { isenable: true, isPublished: true } },
  links: { where: { isenable: true } },
};

async function getProfileByUsername(username: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("profile", `profile-${username}`);

  return prisma.profile.findUnique({
    where: { username },
    select: publicProfileSelect,
  });
}

interface PageProps {
  params: Promise<{ username: string }> | { username: string };
}

export default async function UserPortfolioPage(props: PageProps) {
  const params = await props.params;
  const username = params?.username;

  if (!username) {
    notFound();
  }

  const profile = await getProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  const headersList = await headers();

  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip");

  const country = headersList.get("x-vercel-ip-country");
  const userAgent = headersList.get("user-agent");

  after(async () => {
    await trackPageView({
      profileId: profile.id,
      country,
      userAgent,
      ip,
    });
  });

  const { user, ...profileData } = profile;

  const parsedSkills = (profileData.skills || [])
    .map(parseSkill)
    .filter((s) => s.isenable && s.value)
    .map((s) => s.value);

  const visibleProfileData = {
    ...profileData,
    skills: parsedSkills,
  };

  return (
    <TemplateRenderer
      user={user}
      profile={visibleProfileData}
    />
  );
}
