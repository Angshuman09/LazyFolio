import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TemplateRenderer } from "@/components/portfolios/template-renderer";
import { PortfolioTracker } from "@/components/portfolios/shared/portfolio-tracker";
import { parseSkill } from "@/lib/utils/utils";
import { cacheLife, cacheTag } from "next/cache";
import { publicProfileSelect } from "@/lib/constants/sections";
import { Metadata } from "next";
import { cache } from "react";
import {
  getProfileFromMemoryCache,
  setProfileInMemoryCache,
} from "@/lib/cache/username-filter";

// ISR: re-generate this page in the background at most once every 60 seconds.
// On-demand revalidation via revalidateProfile() keeps it fresh after saves.
export const revalidate = 60;

const getProfileByUsername = cache(async (username: string) => {
  "use cache";
  cacheLife("days");
  cacheTag("profile", `profile-${username}`);

  // 1. Fast path: check in-memory cache (<1ms)
  const cached = getProfileFromMemoryCache<Awaited<ReturnType<typeof fetchFromDb>>>(username);
  if (cached) return cached;

  // 2. Query database
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

export async function generateMetadata(
  props: PageProps
): Promise<Metadata> {
  const params = await props.params;
  const username = params.username;

  const profile = await getProfileByUsername(username);

  if (!profile) {
    return {
      title: "Profile Not Found | Lazyfolio",
    };
  }

  const name = profile.user?.name || username;
  const description = profile.bio || `${name}'s portfolio on Lazyfolio`;

  return {
    title: `${name}`,
    description,
    icons: { icon: profile.avatar || "" },
    openGraph: {
      title: `${name}`,
      description,
      images: [
        {
          url: profile.banner || "",
          width: 1200,
          height: 630,
        },
      ],
      url: `https://lazyfolio.in/${username}`,
      type: "profile",
    },
  };
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
    <>
      <PortfolioTracker profileId={profile.id} />
      <TemplateRenderer
        user={user}
        profile={visibleProfileData}
      />
    </>
  );
}

