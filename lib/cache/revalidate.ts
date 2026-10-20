import { revalidateTag, revalidatePath } from "next/cache";
import { invalidateProfileMemoryCache, registerUsernameInFilter } from "./username-filter";

export function revalidateProfile(username?: string | null) {
  if (!username) return;
  try {
    invalidateProfileMemoryCache(username);
    registerUsernameInFilter(username);
    revalidateTag("profile", "max");
    revalidateTag(`profile-${username}`, "max");
    // Public blog pages are cached under the "blog" tag (see
    // app/[username]/blogs/[slug]/page.tsx) and embed profile data, so they
    // must be purged together with the profile.
    revalidateTag("blog", "max");
    revalidatePath(`/${username}`, "page");
  } catch (error) {
    console.error("Error revalidating profile:", error);
  }
}
