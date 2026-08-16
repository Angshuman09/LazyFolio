import { RefObject } from "react";
import { BlogsSchema } from "../schemas/blogs";
import type { Control, UseFormRegister, UseFormSetValue } from "react-hook-form";

export type ProfileBlog = {
    id?: string | null;
    type?: "INTERNAL" | "EXTERNAL" | null;
    title?: string | null;
    description?: string | null;
    blogLink?: string | null;
    content?: string | null;
    isPublished?: boolean | null;
    isEnabled?: boolean | null;
    isenable?: boolean | null;
    slug?: string | null;
  };
  
export type Props = {
    profile?: BlogsProfile;
    formRef: RefObject<HTMLFormElement | null>;
    onSubmit?: (data: BlogsSchema) => void | Promise<void>;
    mode?: "EXTERNAL" | "INTERNAL";
  };

export type BlogsProfile = {
    id?: string;
    blogs?: ProfileBlog[];
  };


export type MarkdownEditorProps = {
    index: number;
    control: Control<BlogsSchema>;
    register: UseFormRegister<BlogsSchema>;
    setValue: UseFormSetValue<BlogsSchema>;
    onClose: () => void;
  };
