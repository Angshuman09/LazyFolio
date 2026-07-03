import { RefObject } from "react";
import { BlogsSchema } from "../schemas/blogs";
import type { Control, UseFormRegister, UseFormSetValue } from "react-hook-form";

export type ProfileBlog = {
    id?: string | null;
    title?: string | null;
    description?: string | null;
    blogLink?: string | null;
    enddate?: string | Date | null;
    content?: string | null;
    isPublished?: boolean | null;
    isenable?: boolean | null;
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


export type MarkdownEditorProps = {
    index: number;
    control: Control<BlogsSchema>;
    register: UseFormRegister<BlogsSchema>;
    setValue: UseFormSetValue<BlogsSchema>;
    onClose: () => void;
  };
