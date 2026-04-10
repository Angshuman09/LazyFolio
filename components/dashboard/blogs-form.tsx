"use client";

import { RefObject, useState } from "react";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Pencil, Check, BookOpen } from "lucide-react";
import { blogsSchema, BlogsSchema } from "@/schemas/blogs";

type ProfileBlog = {
  title?: string | null;
  description?: string | null;
  blogLink?: string | null;
  enddate?: string | Date | null;
};

type Props = {
  profile?: {
    blogs?: ProfileBlog[];
  };
  formRef: RefObject<HTMLFormElement | null>;
};

function BlogCard({
  index,
  control,
  register,
  errors,
  remove,
}: {
  index: number;
  control: any;
  register: any;
  errors: any;
  remove: (i: number) => void;
}) {
  const [confirmed, setConfirmed] = useState(false);
  const values = useWatch({ control, name: `blogs.${index}` });

  if (confirmed) {
    return (
      <div className="group flex items-start justify-between gap-3 border border-(--lf-border) rounded-xl px-4 py-3.5 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted)">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="w-7 h-7 rounded-lg bg-(--lf-border) flex items-center justify-center shrink-0 mt-0.5">
            <BookOpen size={12} className="text-(--lf-muted)" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[0.82rem] font-medium text-(--lf-ink) font-sans">
              {values?.title || <span className="text-(--lf-muted) italic">Untitled Post</span>}
            </div>
            {values?.description && (
              <div className="text-[0.72rem] text-(--lf-muted) mt-0.5 line-clamp-2 leading-relaxed">
                {values.description}
              </div>
            )}
            {values?.blogLink && (
              <div className="text-[0.68rem] text-(--lf-muted) font-mono mt-1 truncate">
                {values.blogLink}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            type="button"
            onClick={() => setConfirmed(false)}
            className="inline-flex items-center gap-1 px-2.5 h-[28px] rounded-lg border border-(--lf-border) bg-transparent text-(--lf-muted) text-[0.72rem] cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans"
          >
            <Pencil size={10} />
            Edit
          </button>
          <button
            type="button"
            onClick={() => remove(index)}
            className="inline-flex items-center justify-center w-[28px] h-[28px] rounded-lg border border-transparent text-(--lf-muted) cursor-pointer hover:text-[#b91c1c] hover:bg-[#b91c1c]/5 hover:border-[#b91c1c]/15 dark:hover:text-[#f87171] dark:hover:bg-[#f87171]/8 dark:hover:border-[#f87171]/20 transition-all duration-150"
            aria-label="Remove blog post"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted)">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4.5 gap-y-3.5">
        <div className="flex flex-col gap-1.25 sm:col-span-2 mb-1.5">
          <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
            Title
          </label>
          <input
            {...register(`blogs.${index}.title`)}
            className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
            placeholder="My latest article"
          />
          {errors.blogs?.[index]?.title?.message && (
            <div className="text-[0.72rem] text-[#b91c1c]">
              {errors.blogs[index]?.title?.message as string}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.25 mb-1.5">
          <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
            URL
          </label>
          <input
            {...register(`blogs.${index}.blogLink`)}
            className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
            placeholder="https://dev.to/you/article"
          />
        </div>

        <div className="flex flex-col gap-1.25 mb-1.5">
          <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
            End date
          </label>
          <input
            {...register(`blogs.${index}.enddate`)}
            className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
            placeholder="e.g. 2026-03-01"
          />
        </div>

        <div className="flex flex-col gap-1.25 sm:col-span-2">
          <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
            Description
          </label>
          <textarea
            {...register(`blogs.${index}.description`)}
            className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted) min-h-[90px] resize-vertical"
            placeholder="What is this post about?"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          type="button"
          onClick={() => remove(index)}
          className="inline-flex items-center gap-[5px] px-2.5 h-[28px] rounded-lg bg-transparent border border-transparent text-(--lf-muted) text-[0.72rem] cursor-pointer hover:text-[#b91c1c] hover:bg-[#b91c1c]/5 hover:border-[#b91c1c]/15 dark:hover:text-[#f87171] dark:hover:bg-[#f87171]/8 dark:hover:border-[#f87171]/20 transition-all duration-150"
        >
          <Trash2 size={11} />
          Delete
        </button>
        <button
          type="button"
          onClick={() => setConfirmed(true)}
          className="inline-flex items-center gap-1.5 px-3 h-[28px] rounded-lg bg-(--lf-ink) text-(--lf-bg) text-[0.72rem] font-semibold cursor-pointer hover:opacity-82 transition-opacity duration-150 font-sans border-none"
        >
          <Check size={11} strokeWidth={2.5} />
          Done
        </button>
      </div>
    </div>
  );
}

export default function BlogsForm({ profile, formRef }: Props) {
  const defaultValues = useMemo<BlogsSchema>(() => {
    return {
      blogs: (profile?.blogs ?? []).map((b) => ({
        title: b.title ?? "",
        description: b.description ?? "",
        blogLink: b.blogLink ?? "",
        enddate: b.enddate ? String(b.enddate) : "",
      })),
    };
  }, [profile]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<BlogsSchema>({
    resolver: zodResolver(blogsSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "blogs",
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = (data: BlogsSchema) => {
    console.log("blogs", data);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
      <h1 className="font-serif-display text-[1.4rem] font-medium tracking-tight text-(--lf-ink) mb-1">
        Blogs
      </h1>
      <p className="text-[0.78rem] text-(--lf-muted) mb-7">
        Articles and posts you have written
      </p>

      <div className="mb-4">
        {fields.length === 0 && (
          <div className="text-[0.78rem] text-(--lf-muted) mb-2.5">
            No blog posts yet. Add one below.
          </div>
        )}

        {fields.map((f, index) => (
          <BlogCard
            key={f.id}
            index={index}
            control={control}
            register={register}
            errors={errors}
            remove={remove}
          />
        ))}
      </div>

      <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted) border-dashed">
        <div className="text-[0.68rem] font-semibold tracking-widest uppercase text-(--lf-muted) font-mono mb-3.5">
          New Post
        </div>
        <button
          type="button"
          onClick={() =>
            append({
              title: "",
              description: "",
              blogLink: "",
              enddate: "",
            })
          }
          className="inline-flex items-center gap-1.5 px-[18px] h-[34px] rounded-[20px] bg-(--lf-ink) text-(--lf-bg) text-[0.78rem] font-semibold border-none cursor-pointer hover:opacity-82 transition-opacity duration-150 font-sans-body whitespace-nowrap"
        >
          <Plus size={12} />
          Add post
        </button>
      </div>
    </form>
  );
}
