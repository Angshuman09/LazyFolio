"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { RefObject, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { profileSchema, ProfileSchema } from "@/schemas/profile";
import { useQueryClient } from "@tanstack/react-query";

type ProfileData = Partial<
  Pick<
    ProfileSchema,
    "name" | "username" | "tagline" | "location" | "quote" | "email" | "bio" | "bookAcall"
  >
> | null;

type Props = {
  profile?: ProfileData;
  session?: any; 
  formRef: RefObject<HTMLFormElement | null>;
  onSubmit: (data: ProfileSchema) => void;
};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-[0.72rem] text-[#b91c1c]">{message}</p>;
}

export default function ProfileForm({ profile, formRef, onSubmit, session }: Props) {
  const defaultValues = useMemo<ProfileSchema>(
    () => ({
      name: profile?.name || "",
      username: profile?.username || "",
      tagline: profile?.tagline || "",
      location: profile?.location || "",
      quote: profile?.quote || "",
      email: profile?.email || "",
      bio: profile?.bio || "",
      avatar: undefined,
      banner: undefined,
      bookAcall: profile?.bookAcall || "",
    }),
    [profile],
  );

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<ProfileSchema>({
    defaultValues,
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const queryClient = useQueryClient();

  console.log(session?.user?.id);

  const handleSubmitUsername = async ()=>{
    setLoading(true);
    const username = getValues("username");

    if(!username){
      toast.error("Username cannot be empty");
      return;
    }

    const response = await fetch("/api/username", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        userId: await session?.user?.id as string
      })
    })

    const data = await response.json();

    if(response.ok){
      toast.success("Username updated successfully");
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
    } else {
      toast.error(data.error || "Failed to update username");
    }
    setLoading(false);
  }

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

      <div className="flex flex-col gap-1.25 mb-5">
        <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
          Username
        </label>
        <div className="flex items-stretch">
          <div className="flex items-center flex-1 rounded-l-xl border border-r-0 border-(--lf-border) bg-(--lf-bg) px-3 py-2 gap-1.5 transition-colors duration-150 focus-within:border-(--lf-muted)">
            <span className="text-[0.78rem] text-(--lf-muted) font-mono whitespace-nowrap select-none">
              lazyfolio.com/
            </span>
            <input
              {...register("username")}
              placeholder="username"
              className="bg-transparent border-none outline-none text-[0.85rem] text-(--lf-ink) font-medium w-full placeholder:text-(--lf-dimmed) font-sans-body"
            />
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-4 rounded-r-xl border border-(--lf-ink) bg-(--lf-ink) text-(--lf-bg) text-[0.75rem] font-semibold cursor-pointer hover:opacity-85 transition-opacity duration-150 font-sans-body whitespace-nowrap"
            onClick={handleSubmitUsername}
            disabled={loading}
          >
            {loading ? "Updating..." : "Change"}
          </button>
        </div>
        <FieldError message={errors.username?.message} />
      </div>

      {!profile?.username ? (
        <div className="p-8 border border-(--lf-border) rounded-xl bg-(--lf-surface) text-center mb-7 flex flex-col items-center">
           <div className="text-[1.1rem] font-serif-display text-(--lf-ink) mb-1.5">Set your username first</div>
           <div className="text-[0.82rem] text-(--lf-muted) max-w-md leading-relaxed">
             You need to claim a username before you can update your profile avatar, banner, and basic information. Your username will also be your public portfolio link!
           </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
            <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted)">
              <div className="text-[0.68rem] font-semibold tracking-widest uppercase text-(--lf-muted) font-mono mb-3.5">
                Avatar
              </div>
              <div className="flex items-center gap-3.5">
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
                    {/* PNG · JPG · max 2MB */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4.5 gap-y-3.5">
              <div className="flex flex-col gap-1.25">
                <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                  Full Name
                </label>
                <input
                  {...register("name")}
                  placeholder="Enter your name"
                  className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
                />
                <FieldError message={errors.name?.message} />
              </div>

              <div className="flex flex-col gap-1.25">
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

              <div className=" flex flex-col gap-1.25">
                <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                  Tagline
                </label>
                <input
                  {...register("tagline")}
                  placeholder="e.g. Full Stack Developer · Open to work"
                  className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
                />
                <FieldError message={errors.tagline?.message} />
              </div>

               <div className=" flex flex-col gap-1.25">
                <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                  Book a Call Link
                </label>
                <input
                  {...register("bookAcall")}
                  placeholder="e.g. https://cal.com/angshuman-kashyap-qmfpnk/let-s-talk"
                  className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
                />
                <FieldError message={errors.tagline?.message} />
              </div>

              <div className="flex flex-col gap-1.25">
                <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                  Location
                </label>
                <input
                  {...register("location")}
                  placeholder="e.g. Assam, India"
                  className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
                />
                <FieldError message={errors.location?.message} />
              </div>

              <div className="flex flex-col gap-1.25">
                <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                  Quote
                </label>
                <input
                  type="text"
                  {...register("quote")}
                  placeholder="e.g. Art is never finished, only abandoned. ~ Leonardo da Vinci"
                  className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
                />
                <FieldError message={errors.quote?.message} />
              </div>
            </div>
            <div className="flex flex-col gap-1.25 mt-3.5">
              <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                Bio
              </label>
              <textarea
                {...register("bio")}
                placeholder="Tell us about yourself"
                className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted) min-h-[90px] resize-vertical"
              />
              <FieldError message={errors.bio?.message} />
            </div>
          </div>
        </>
      )}
    </form>
  );
}
