import { BlogsSchema } from "../schemas/blogs";
import { BlogsProfile, ProfileBlog } from "../types/blogs";
import { readDashboardDraft } from "../cache/dashboard-drafts";
import crypto from "crypto";

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

export function slugify(text: string) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "") 
      .replace(/\-\-+/g, "-") 
      .replace(/^-+/, "") 
      .replace(/-+$/, ""); 
  }
  
export function generateSlug(title: string) {
    const baseSlug = slugify(title || "untitled");
    const randomHash = crypto.randomBytes(4).toString("hex");
    return `${baseSlug}-${randomHash}`;
  }

export function parseOptionalDate(value: string | null | undefined) {
    if (!value?.trim()) {
      return null;
    }
  
    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

