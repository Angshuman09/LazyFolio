import { BlogsSchema } from "../schemas/blogs";
import { BlogsProfile, ProfileBlog } from "../types/blogs";
import { readDashboardDraft } from "../cache/dashboard-drafts";

export function blogsFromProfile(blogs: ProfileBlog[] = []): BlogsSchema {
    return {
      blogs: blogs.map((blog) => ({
        id: blog.id || undefined,
        title: blog.title ?? "",
        description: blog.description ?? "",
        blogLink: blog.blogLink ?? "",
        enddate: blog.enddate ? String(blog.enddate) : "",
        content: blog.content ?? null,
        isPublished: blog.isPublished ?? false,
        isenable: blog.isenable ?? true,
        slug: blog.slug ?? null,
      })),
    };
  }
  
export function getInitialBlogs(profile?: BlogsProfile): BlogsSchema {
    return (
      readDashboardDraft<BlogsSchema>("blogs", profile?.id) ||
      blogsFromProfile(profile?.blogs || [])
    );
  }
