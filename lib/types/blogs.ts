import { RefObject } from "react";
import { BlogsSchema } from "../schemas/blogs";

export type ProfileBlog = {
    id?: string | null;
    title?: string | null;
    description?: string | null;
    blogLink?: string | null;
    enddate?: string | Date | null;
    content?: string | null;
    isPublished?: boolean | null;
    slug?: string | null;
  };
  
export type Props = {
    profile?: BlogsProfile;
    formRef: RefObject<HTMLFormElement | null>;
    onSubmit?: (data: BlogsSchema) => void | Promise<void>;
  };

export type BlogsProfile = {
    id?: string;
    blogs?: ProfileBlog[];
  };