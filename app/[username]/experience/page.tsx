import { notFound } from "next/navigation";
import { TemplateRenderer } from "@/components/portfolios/template-renderer";
import type { Metadata } from "next";
import {
  getProfileByUsername,
  toTemplateProps,
  type UsernamePageProps,
} from "../_data/get-profile";

export async function generateMetadata(props: UsernamePageProps): Promise<Metadata> {
  const params = await props.params;
  const username = params?.username;
  if (!username) return {};

  const profile = await getProfileByUsername(username);
  const name = profile?.name || username;

  return {
    title: `Experience | ${name}`,
    description: `Professional work history and career background of ${name} on Lazyfolio.`,
  };
}

export default async function PublicExperiencePage(props: UsernamePageProps) {
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
    <TemplateRenderer
      user={user}
      profile={visibleProfileData}
      section="experience"
      basePath=""
    />
  );
}
