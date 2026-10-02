import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TemplateRenderer } from "@/components/portfolios/template-renderer";
import { parseSkill } from "@/lib/utils/utils";
import { cacheLife, cacheTag } from "next/cache";
import { after } from "next/server";
import { headers } from "next/headers";
import { publicProfileSelect } from "@/lib/constants/sections";
import { Metadata } from "next";


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
    icons:{icon: profile.avatar || ""},
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

  const headersList = await headers();

  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || headersList.get("x-real-ip");

  const country = headersList.get("x-vercel-ip-country");
  const userAgent = headersList.get("user-agent");

  after(async () => {
    const rawUrl = process.env.INSIGHTS_SERVICE_URL?.replace(/\/+$/, "");
    if (!rawUrl) return;

    const endpoint = rawUrl.endsWith("/api/v1") ? `${rawUrl}/track` : `${rawUrl}/api/v1/track`;

    try {
      await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(ip ? { "x-real-ip": ip } : {}),
          ...(userAgent ? { "user-agent": userAgent } : {}),
          ...(country ? { "x-vercel-ip-country": country } : {}),
        },
        body: JSON.stringify({
          profileId: profile.id,
          eventType: "pageview",
        }),
      })
    } catch (error) {
      console.error("pageview tracking error:", error);
    }
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
