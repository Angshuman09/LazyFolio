import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TemplateRenderer } from "@/components/portfolios/template-renderer";
import { parseSkill } from "@/lib/utils/utils";
import { cacheLife, cacheTag } from "next/cache";
import { publicProfileSelect } from "@/lib/constants/sections";
import type { Metadata } from "next";

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

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const username = params?.username;
  if (!username) return {};

  const profile = await getProfileByUsername(username);
  const name = profile?.name || username;

  return {
    title: `Blogs — ${name}`,
    description: `Articles and writings by ${name} on Lazyfolio.`,
  };
}

export default async function PublicBlogsPage(props: PageProps) {
  const params = await props.params;
  const username = params?.username;

  if (!username) {
    notFound();
  }

  const profile = await getProfileByUsername(username);

  if (!profile) {
    notFound();
  }

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
      section="blogs"
      basePath=""
    />
  );
}
