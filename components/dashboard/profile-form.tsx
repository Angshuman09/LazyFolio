"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { profileSchema, ProfileSchema } from "@/lib/schemas/profile";
import { useQueryClient } from "@tanstack/react-query";
import { Props } from "@/lib/types/profile";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-[0.72rem] text-[#b91c1c]">{message}</p>;
}

export default function ProfileForm({
  profile,
  formRef,
  onSubmit,
  session,
}: Props) {
  const defaultValues = useMemo<ProfileSchema>(
    () => ({
      userId: session?.user?.id || "",
      name: profile?.name || "",
      username: profile?.username || "",
      tagline: profile?.tagline || "",
      quote: profile?.quote || "",
      email: profile?.email || "",
      bio: profile?.bio || "",
      avatar: undefined,
      banner: undefined,
      bookAcall: profile?.bookAcall || "",
    }),
    [profile, session?.user?.id],
  );

  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProfileSchema>({
    defaultValues,
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const queryClient = useQueryClient();
  const emailValue = useWatch({ control, name: "email" });
  const taglineValue = useWatch({ control, name: "tagline" });
  const bookCallValue = useWatch({ control, name: "bookAcall" });
  const quoteValue = useWatch({ control, name: "quote" });
  const bioValue = useWatch({ control, name: "bio" });

  console.log(session?.user?.id);

  const handleSubmitUsername = async () => {
    setLoading(true);
    const username = getValues("username");

    if (!username) {
      toast.error("Username cannot be empty");
      return;
    }

    const response = await fetch("/api/dashboard/username", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        userId: (await session?.user?.id) as string,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success("Username updated successfully");
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
    } else {
      toast.error(data.error || "Failed to update username");
    }
    setLoading(false);
  };

  const [imageLoading, setImageLoading] = useState(false);

  const handleSubmitImages = async () => {
    if (!avatarFile && !bannerFile) return;

    setImageLoading(true);

    try {
      let avatarUrl: string | undefined;
      let avatarPublicId: string | undefined;
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);

        const res = await fetch("/api/dashboard/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to upload avatar");
        avatarUrl = data.url;
        avatarPublicId = data.publicId;
      }

      let bannerUrl: string | undefined;
      let bannerPublicId: string | undefined;
      if (bannerFile) {
        const formData = new FormData();
        formData.append("file", bannerFile);

        const res = await fetch("/api/dashboard/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to upload banner");
        bannerUrl = data.url;
        bannerPublicId = data.publicId;
      }

      const res = await fetch("/api/dashboard/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          avatar: avatarUrl,
          avatarPublicId: avatarPublicId,
          banner: bannerUrl,
          bannerPublicId: bannerPublicId,
          userId: profile?.userId,
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to save images");

      toast.success("Images saved successfully");
      await queryClient.invalidateQueries({ queryKey: ["profile"] });

      setAvatarFile(null);
      setBannerFile(null);
      setValue("avatar", undefined);
      setValue("banner", undefined);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <form
      id="dashboard-form"
      ref={formRef}
      onSubmit={handleSubmit(onSubmit, () => {
        toast.error("Please fix the highlighted fields before saving.");
      })}
    >
      <h1 className="font-serif-display text-[1.4rem] font-medium tracking-tight text-(--lf-ink)">
        Profile
      </h1>
      <p className="text-[0.78rem] text-(--lf-muted) mb-3">
        How you appear on your public portfolio page
      </p>

      <div className="flex flex-col gap-1.25 mb-5">
        <label className="text-[0.7rem] font-semibold text-(--lf-muted) font-mono tracking-wider">
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
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 rounded-r-md border border-(--lf-ink) disabled:cursor-not-allowed disabled:opacity-30 bg-(--lf-ink) text-(--lf-bg) text-[0.75rem] font-semibold cursor-pointer hover:opacity-85 transition-opacity duration-150 font-sans-body whitespace-nowrap"
            onClick={handleSubmitUsername}
          >
            {loading ? "Updating..." : "Change"}
          </button>
        </div>
        <FieldError message={errors.username?.message} />
      </div>

      {!profile?.username ? (
        <div className="p-8 border border-(--lf-border) rounded-xl bg-(--lf-surface) text-center mb-7 flex flex-col items-center">
          <div className="text-[1.1rem] font-serif-display text-(--lf-ink) mb-1.5">
            Set your username first
          </div>
          <div className="text-[0.82rem] text-(--lf-muted) max-w-md leading-relaxed">
            You need to claim a username before you can update your profile
            avatar, banner, and basic information. Your username will also be
            your public portfolio link!
          </div>
        </div>
      ) : (
        <>
          {/* image section */}
          <div className="bg-(--lf-bg) p-4 rounded-xl border border-(--lf-border) mb-4">
          {/* Save button — disabled until something is selected */}
            <div className="flex justify-between items-center pb-3">
              <p className="text-[0.7rem] font-semibold text-(--lf-muted) font-mono tracking-wider">
                Avatar and Banner
              </p>
              <button
                type="button"
                onClick={handleSubmitImages}
                disabled={!avatarFile && !bannerFile || imageLoading}
                className="inline-flex items-center gap-1.5 px-4 h-8 rounded-[6px] border border-(--lf-ink) bg-(--lf-ink) text-(--lf-bg) text-[0.75rem] font-semibold transition-opacity duration-150 font-sans-body
        disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {imageLoading ? "Saving..." : "Save changes"}
              </button>
            </div>
            {/* Preview / Upload area */}
            <div className="flex items-center gap-2 mb-4">
              {/* Avatar — circle */}
              <div className="relative shrink-0">
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  {...register("avatar")}
                  onChange={(e) => {
                    register("avatar").onChange(e);
                    setAvatarFile(e.target.files?.[0] ?? null);
                  }}
                />
                <label
                  htmlFor="avatar-upload"
                  className="block w-29.5 h-29.5 rounded-full border-2 border-dashed border-(--lf-border) bg-(--lf-surface) cursor-pointer overflow-hidden relative group"
                >
                  {avatarFile || profile?.avatar ? (
                    <img
                      src={avatarFile ? URL.createObjectURL(avatarFile) : profile.avatar}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-(--lf-muted) group-hover:text-(--lf-ink) transition-colors">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                      </svg>
                      <span className="text-[0.65rem] font-mono text-center leading-tight px-2">
                        upload avatar
                      </span>
                    </div>
                  )}
                </label>
                {avatarFile && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarFile(null);
                      setValue("avatar", undefined);
                    }}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-(--lf-ink) text-(--lf-bg) flex items-center justify-center text-[0.7rem] font-bold hover:opacity-80 transition-opacity shadow-sm z-10"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Banner — rounded rect */}
              <div className="relative flex-1">
                <input
                  id="banner-upload"
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  {...register("banner")}
                  onChange={(e) => {
                    register("banner").onChange(e);
                    setBannerFile(e.target.files?.[0] ?? null);
                  }}
                />
                <label
                  htmlFor="banner-upload"
                  className="block w-full h-29.5 rounded-xl border-2 border-dashed border-(--lf-border) bg-(--lf-surface) cursor-pointer overflow-hidden relative group"
                >
                  {bannerFile || profile?.banner ? (
                    <img
                      src={bannerFile ? URL.createObjectURL(bannerFile) : profile.banner}
                      alt="Banner preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-(--lf-muted) group-hover:text-(--lf-ink) transition-colors">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="m3 15 4-4 4 4 4-5 4 5" />
                      </svg>
                      <span className="text-[0.65rem] font-mono">
                        upload banner
                      </span>
                    </div>
                  )}
                </label>
                {bannerFile && (
                  <button
                    type="button"
                    onClick={() => {
                      setBannerFile(null);
                      setValue("banner", undefined);
                    }}
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-(--lf-ink) text-(--lf-bg) flex items-center justify-center text-[0.7rem] font-bold hover:opacity-80 transition-opacity shadow-sm z-10"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) transition-colors duration-150 hover:border-(--lf-muted) mb-7">
            <div className="text-[0.68rem] font-semibold tracking-widest text-(--lf-muted) font-mono mb-4">
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
                <div className="flex items-center justify-between gap-2">
                  <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                    Email
                  </label>
                  {emailValue && (
                    <button
                      type="button"
                      className="text-[0.68rem] font-medium text-(--lf-muted) hover:text-(--lf-ink) transition-colors"
                      onClick={() =>
                        setValue("email", "", {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                    >
                      Clear
                    </button>
                  )}
                </div>
                <input
                  {...register("email")}
                  className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
                  placeholder="enter your email address"
                />
                <FieldError message={errors.email?.message} />
              </div>

              <div className=" flex flex-col gap-1.25">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                    Tagline
                  </label>
                  {taglineValue && (
                    <button
                      type="button"
                      className="text-[0.68rem] font-medium text-(--lf-muted) hover:text-(--lf-ink) transition-colors"
                      onClick={() =>
                        setValue("tagline", "", {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                    >
                      Clear
                    </button>
                  )}
                </div>
                <input
                  {...register("tagline")}
                  placeholder="e.g. Full Stack Developer · Open to work"
                  className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
                />
                <FieldError message={errors.tagline?.message} />
              </div>

              <div className=" flex flex-col gap-1.25">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                    Book a Call Link
                  </label>
                  {bookCallValue && (
                    <button
                      type="button"
                      className="text-[0.68rem] font-medium text-(--lf-muted) hover:text-(--lf-ink) transition-colors"
                      onClick={() =>
                        setValue("bookAcall", "", {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                    >
                      Clear
                    </button>
                  )}
                </div>
                <input
                  {...register("bookAcall")}
                  placeholder="e.g. https://cal.com/angshuman-kashyap-qmfpnk/let-s-talk"
                  className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
                />
                <FieldError message={errors.bookAcall?.message} />
              </div>

              <div className="flex flex-col gap-1.25 sm:col-span-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                    Quote
                  </label>
                  {quoteValue && (
                    <button
                      type="button"
                      className="text-[0.68rem] font-medium text-(--lf-muted) hover:text-(--lf-ink) transition-colors"
                      onClick={() =>
                        setValue("quote", "", {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                    >
                      Clear
                    </button>
                  )}
                </div>
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
              <div className="flex items-center justify-between gap-2">
                <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                  Bio
                </label>
                {bioValue && (
                  <button
                    type="button"
                    className="text-[0.68rem] font-medium text-(--lf-muted) hover:text-(--lf-ink) transition-colors"
                    onClick={() =>
                      setValue("bio", "", {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    Clear
                  </button>
                )}
              </div>
              <textarea
                {...register("bio")}
                placeholder="Tell us about yourself"
                className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted) min-h-22.5 resize-vertical"
              />
              <FieldError message={errors.bio?.message} />
            </div>
          </div>
        </>
      )}
    </form>
  );
}
