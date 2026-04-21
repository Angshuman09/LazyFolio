"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { RefObject, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { profileSchema, ProfileSchema } from "@/schemas/profile";

type ProfileData = Partial<
  Pick<
    ProfileSchema,
    "name" | "username" | "tagline" | "location" | "quote" | "email" | "bio"
  >
> | null;

type Props = {
  profile?: ProfileData;
  formRef: RefObject<HTMLFormElement | null>;
  onSubmit: (data: ProfileSchema) => void;
};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-[0.72rem] text-[#b91c1c]">{message}</p>;
}

export default function ProfileForm({ profile, formRef, onSubmit }: Props) {
  const defaultValues = useMemo<ProfileSchema>(
    () => ({
      name: profile?.name || "your name",
      username: profile?.username || "your username",
      tagline: profile?.tagline || "Full Stack Developer · Open to work",
      location: profile?.location || "Assam, India",
      quote: profile?.quote || "your quote",
      email: profile?.email || "",
      bio:
        profile?.bio ||
        "I build things for the web. Passionate about developer tooling, open source, and shipping fast.",
      avatar: undefined,
      banner: undefined,
    }),
    [profile],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileSchema>({
    defaultValues,
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form
      id="dashboard-form"
      ref={formRef}
      onSubmit={handleSubmit(onSubmit, () => {
        toast.error("Please fix the highlighted fields before saving.");
      })}
    >
      <h1 className="font-serif-display text-[1.4rem] font-medium tracking-tight text-(--lf-ink) mb-1">
        Profile
      </h1>
      <p className="text-[0.78rem] text-(--lf-muted) mb-7">
        How you appear on your public portfolio page
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
        <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted)">
          <div className="text-[0.68rem] font-semibold tracking-widest uppercase text-(--lf-muted) font-mono mb-3.5">
            Avatar
          </div>
          <div className="flex items-center gap-3.5">
            <div className="w-15.5 h-15.5 rounded-full bg-(--lf-border) flex items-center justify-center font-serif text-[1.5rem] text-(--lf-muted) shrink-0 border-2 border-(--lf-border)">
              A
            </div>
            <div className="flex-1">
              <input
                id="avatar-upload"
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                {...register("avatar")}
              />
              <label
                htmlFor="avatar-upload"
                className="inline-flex items-center gap-1.5 px-3 h-[30px] rounded-lg bg-transparent border border-(--lf-border) text-(--lf-muted) text-[0.75rem] font-medium cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans whitespace-nowrap w-full justify-center mb-1.5"
              >
                Upload photo
              </label>
              <div className="text-[0.68rem] text-(--lf-muted) font-mono text-center">
                PNG · JPG · max 2MB
              </div>
            </div>
          </div>
        </div>
        <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted)">
          <div className="text-[0.68rem] font-semibold tracking-widest uppercase text-(--lf-muted) font-mono mb-3.5">
            Banner
          </div>
          <input
            id="banner-upload"
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            {...register("banner")}
          />
          <label
            htmlFor="banner-upload"
            className="h-[66px] rounded-lg cursor-pointer bg-(--lf-border) flex items-center justify-center text-[0.75rem] text-(--lf-muted) border-2 border-dashed border-(--lf-border)"
          >
            Click to upload banner
          </label>
        </div>
      </div>

      <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) transition-colors duration-150 hover:border-(--lf-muted) mb-7">
        <div className="text-[0.68rem] font-semibold tracking-widest uppercase text-(--lf-muted) font-mono mb-4">
          Basic Info
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4.5">
          <div className="flex flex-col gap-1.25 mb-3.5">
            <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
              Full Name
            </label>
            <input
              {...register("name")}
              className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
            />
            <FieldError message={errors.name?.message} />
          </div>
          <div className="flex flex-col gap-1.25 mb-3.5">
            <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
              Username
            </label>
            <input
              {...register("username")}
              className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
            />
            <FieldError message={errors.username?.message} />
          </div>
          <div className="flex flex-col gap-1.25 mb-3.5">
            <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
              Tagline
            </label>
            <input
              {...register("tagline")}
              className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
            />
            <FieldError message={errors.tagline?.message} />
          </div>
          <div className="flex flex-col gap-1.25 mb-3.5">
            <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
              Location
            </label>
            <input
              {...register("location")}
              className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
            />
            <FieldError message={errors.location?.message} />
          </div>
          <div className="flex flex-col gap-1.25 mb-3.5">
            <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
              Quote
            </label>
            <input
              type="text"
              {...register("quote")}
              className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
            />
            <FieldError message={errors.quote?.message} />
          </div>
          <div className="flex flex-col gap-1.25 mb-3.5">
            <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
              Email
            </label>
            <input
              {...register("email")}
              className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
              placeholder="enter your email address"
            />
            <FieldError message={errors.email?.message} />
          </div>
        </div>
        <div className="flex flex-col gap-1.25 mb-3.5">
          <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
            Bio
          </label>
          <textarea
            {...register("bio")}
            className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted) min-h-[90px] resize-vertical"
          />
          <FieldError message={errors.bio?.message} />
        </div>
      </div>
    </form>
  );
}
