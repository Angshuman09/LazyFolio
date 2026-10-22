import { notFound } from "next/navigation";
import { TemplateRenderer } from "@/components/portfolios/template-renderer";
import { PortfolioTracker } from "@/components/portfolios/shared/portfolio-tracker";
import { Metadata } from "next";
import {
  getProfileByUsername,
  toTemplateProps,
  type UsernamePageProps,
} from "../_data/get-profile";

export const revalidate = 60;

export async function generateMetadata(props: UsernamePageProps): Promise<Metadata> {
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
      url: `${process.env.NEXT_PUBLIC_APP_URL}/${username}`,
      type: "profile",
    },
  };
}

export default async function UserPortfolioPage(props: UsernamePageProps) {
  const params = await props.params;
  const username = params?.username;

  if (!username) {
    notFound();
  }

  const profile = await getProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  const { user, profile: visibleProfileData } = toTemplateProps(profile);

  return (
    <>
      <PortfolioTracker profileId={profile.id} />
      <TemplateRenderer user={user} profile={visibleProfileData} />
    </>
  );
}
