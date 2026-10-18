import { cache } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { publicProfileSelect } from "@/lib/constants/sections";
import { parseSkill } from "@/lib/utils/skills";
import {
  getProfileFromMemoryCache,
  setProfileInMemoryCache,
} from "@/lib/cache/username-filter";

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

export type PublicProfile = NonNullable<Awaited<ReturnType<typeof fetchFromDb>>>;

// Cached, in-memory-first lookup of a public profile by username. Wrapped in
// React cache() so multiple calls in one request (generateMetadata + page)
// share a single result.
export const getProfileByUsername = cache(async (username: string) => {
  "use cache";
  cacheLife("days");
  cacheTag("profile", `profile-${username}`);

  const cached = getProfileFromMemoryCache<PublicProfile>(username);
  if (cached) return cached;

  return fetchFromDb(username);
});

export interface UsernamePageProps {
  params: Promise<{ username: string }> | { username: string };
}

// Splits a raw profile into the { user, profile } shapes the portfolio
// templates expect, and reduces stored skill JSON entries to visible strings.
export function toTemplateProps(profile: PublicProfile) {
  const { user, ...profileData } = profile;

  const skills = (profileData.skills || [])
    .map(parseSkill)
    .filter((skill) => skill.isenable && skill.value)
    .map((skill) => skill.value);

  return { user, profile: { ...profileData, skills } };
}
