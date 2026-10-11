import { Metadata } from "next";
import TemplatesView from "@/components/templates/templates-view";

export const metadata: Metadata = {
  title: "Templates | Lazyfolio",
  description:
    "Every template is crafted to present your work beautifully. Pick one, fill in your story, and go live in minutes.",
};

export default function TemplatesPage() {
  return <TemplatesView />;
}