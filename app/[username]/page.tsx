import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TemplateRenderer } from "@/components/portfolios/template-renderer";
import { parseSkill } from "@/lib/utils/utils";
import { cacheLife, cacheTag } from "next/cache";
import { after } from "next/server";
import { headers } from "next/headers";
import { publicProfileSelect } from "@/lib/constants/sections";


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

  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || headersList.get("x-real-ip");

  const country = headersList.get("x-vercel-ip-country");
  const userAgent = headersList.get("user-agent");

  after(async () => {
    const insightsUrl = process.env.INSIGHTS_SERVICE_URL;
    if (!insightsUrl) return;

    try {
      await fetch(`${insightsUrl}/api/v1/track`,{
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
