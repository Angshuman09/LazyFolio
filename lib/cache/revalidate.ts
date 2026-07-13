import { revalidateTag, revalidatePath } from "next/cache";

export function revalidateProfile(username?: string | null) {
  if (!username) return;
  try {
    revalidateTag("profile", "max");
    revalidateTag(`profile-${username}`, "max");
    revalidatePath(`/${username}`, "page");
  } catch (error) {
    console.error("Error revalidating profile:", error);
  }
}
