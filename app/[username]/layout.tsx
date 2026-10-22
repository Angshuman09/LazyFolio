import { notFound } from "next/navigation";
import { getProfileByUsername } from "./_data/get-profile";

interface PortfolioLayoutProps {
  children: React.ReactNode;
  params: Promise<{ username: string }> | { username: string };
}

export default async function PortfolioLayout({ children, params }: PortfolioLayoutProps) {
  const { username } = await params;

  if (!username) {
    notFound();
  }

  const profile = await getProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  return children;
}
