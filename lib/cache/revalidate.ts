import { revalidateTag, revalidatePath } from "next/cache";
import { invalidateProfileMemoryCache, registerUsernameInFilter } from "./username-filter";

export function revalidateProfile(username?: string | null) {
  if (!username) return;
  try {
    invalidateProfileMemoryCache(username);
    registerUsernameInFilter(username);
    revalidateTag("profile", "max");
    revalidateTag(`profile-${username}`, "max");
    revalidatePath(`/${username}`, "page");
  } catch (error) {
    console.error("Error revalidating profile:", error);
  }
}
