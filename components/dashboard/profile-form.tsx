"use client";

import { useForm } from "react-hook-form";
import { RefObject, useEffect } from "react";
import { useUpdateUserProfile } from "@/hooks/profile";
import { useGetUserProfile } from "@/hooks/profile";
import { authClient } from "@/lib/auth-client";
import { profile } from "console";

type ProfileFormValues = {
  name: string;
  username: string;
  tagline?: string;
  location?: string;
  age?: number;
  email?: string;
  bio?: string;
  avatar?: FileList;
  banner?: FileList;
};

type Props = {
  formRef: RefObject<HTMLFormElement | null>;
};

export default function ProfileForm({ formRef }: Props) {

    const {data: user} = authClient.useSession();

  const updateProfile = useUpdateUserProfile();

  const { data: profileData } = useGetUserProfile( user?.user?.id || "dkfldfkldajfdkjl");
  console.log("profile data", profileData)

  const { register, handleSubmit, reset } = useForm<ProfileFormValues>({
    defaultValues: {
      name: profileData && profileData?.name || "your name",
      username: profileData && profileData?.username || "your username",
      tagline: profileData && profileData?.tagline || "Full Stack Developer · Open to work",
      location: profileData && profileData?.location || "Assam, India",
      age: profileData && profileData?.age || 20,
      email: profileData && profileData?.email || "",
      bio: profileData && profileData?.bio || "I build things for the web. Passionate about developer tooling, open source, and shipping fast.",
    },
  });

  useEffect(() => {
  if (profileData) {
    reset(profileData);
  }
}, [profileData, reset]);



  const onSubmit = (data: ProfileFormValues) => {
    console.log("profile", data);
    const response = updateProfile.mutate({
      userId: user?.user?.id || undefined,
      name: data.name,
      username: data.username,
      tagline: data.tagline,
      location: data.location,
      age: data?.age,
      email: data.email,
      bio: data.bio,
    });
    // console.log("update response", response);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
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
            <div className="w-[62px] h-[62px] rounded-full bg-(--lf-border) flex items-center justify-center font-serif text-[1.5rem] text-(--lf-muted) shrink-0 border-2 border-(--lf-border)">
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
              // defaultValue={profileData && profileData?.name || "your name"}
              className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
            />
          </div>
          <div className="flex flex-col gap-1.25 mb-3.5">
            <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
              Username
            </label>
            <input
              {...register("username")}
              // defaultValue={ profileData && profileData?.username || "your username"}
              className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
            />
          </div>
          <div className="flex flex-col gap-1.25 mb-3.5">
            <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
              Tagline
            </label>
            <input
              {...register("tagline")}
              // defaultValue={ profileData && profileData?.tagline || "your tagline"}
              className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
            />
          </div>
          <div className="flex flex-col gap-1.25 mb-3.5">
            <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
              Location
            </label>
            <input
              {...register("location")}
              // defaultValue={ profileData && profileData?.location || "your location"}
              className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
            />
          </div>
          <div className="flex flex-col gap-1.25 mb-3.5">
            <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
              Age
            </label>
            <input
              type="number"
              {...register("age", { valueAsNumber: true })}
              // defaultValue={ profileData && profileData?.age || undefined}
              className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
            />
          </div>
          <div className="flex flex-col gap-1.25 mb-3.5">
            <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
              Email
            </label>
            <input
              {...register("email")}
              // defaultValue={ profileData && profileData?.email || "your email"}
              className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
              placeholder="enter your email address"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.25 mb-3.5">
          <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
            Bio
          </label>
          <textarea
            {...register("bio")}
            // defaultValue={ profileData && profileData?.bio || "your bio"}
            className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted) min-h-[90px] resize-vertical"
          />
        </div>
      </div>
    </form>
  );
}
