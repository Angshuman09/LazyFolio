import { prisma } from "@/lib/prisma";

// When a username changes, internal blog posts store their URL as
// `/{username}/blogs/{slug}`. Rewrite those prefixes so existing posts stay
// reachable under the new username. Non-critical: failures are logged, not thrown.
export async function rewriteBlogLinksOnUsernameChange(
  profileId: string,
  oldUsername: string | null,
  newUsername: string | null,
) {
  if (!oldUsername || !newUsername || oldUsername === newUsername) {
    return;
  }

  try {
    const blogsToUpdate = await prisma.blog.findMany({
      where: {
        profileId,
        blogLink: { startsWith: `/${oldUsername}/blogs/` },
      },
      select: { id: true, blogLink: true },
    });

    await Promise.all(
      blogsToUpdate.map((blog) =>
        prisma.blog.update({
          where: { id: blog.id },
          data: {
            blogLink: blog.blogLink!.replace(
              `/${oldUsername}/blogs/`,
              `/${newUsername}/blogs/`,
            ),
          },
        }),
      ),
    );
  } catch (error) {
    console.error("Failed to update blog links after username change", error);
  }
}
