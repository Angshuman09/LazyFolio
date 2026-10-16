import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TemplateRenderer } from "@/components/portfolios/template-renderer";
import { parseSkill } from "@/lib/utils/utils";
import { cacheLife, cacheTag } from "next/cache";
import { publicProfileSelect } from "@/lib/constants/sections";
import type { Metadata } from "next";

import { cache } from "react";
import {
  getProfileFromMemoryCache,
  setProfileInMemoryCache,
} from "@/lib/cache/username-filter";

const getProfileByUsername = cache(async (username: string) => {
  "use cache";
  cacheLife("days");
  cacheTag("profile", `profile-${username}`);

  const cached = getProfileFromMemoryCache<Awaited<ReturnType<typeof fetchFromDb>>>(username);
  if (cached) return cached;

  return fetchFromDb(username);
});

async function fetchFromDb(username: string) {
  const profile = await prisma.profile.findUnique({
    where: { username },
    select: publicProfileSelect,
  });

  if (profile) {
    setProfileInMemoryCache(username, profile);
  }

  return profile;
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
    title: `Projects | ${name}`,
    description: `Projects and work by ${name} on Lazyfolio.`,
  };
}

export default async function PublicProjectsPage(props: PageProps) {
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
      section="projects"
      basePath=""
    />
  );
}
