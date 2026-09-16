"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { profileSchema, ProfileSchema } from "@/lib/schemas/profile";
import { useQueryClient } from "@tanstack/react-query";
import { Props } from "@/lib/types/profile";
import { useSectionSave } from "@/hooks/use-section-save";
import {
  Camera,
  Image as ImageIcon,
  User,
  Mail,
  Zap,
  Quote,
  Phone,
  X,
  Check,
  Loader2,
  AtSign,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { getPortfolioDomainSuffix } from "@/lib/utils/public-url";
import { isReservedUsername } from "@/lib/utils/username";
import Image from "next/image";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-[0.72rem] text-red-500 mt-1 pl-1">{message}</p>;
}

interface FieldRowProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  error?: string;
  noBorder?: boolean;
}

function FieldRow({ label, children, action, error, noBorder }: FieldRowProps) {
  return (
    <div>
      <div
        className={`flex items-center gap-3.5 px-4 min-h-15.5 hover:bg-(--lf-accent-soft) transition-colors group ${!noBorder ? "border-b border-(--lf-border)" : ""}`}
      >
       
        <div className="flex-1 min-w-0 py-3">
          <p className="text-[0.6rem] font-semibold tracking-widest uppercase text-(--lf-muted) font-mono mb-0.5">
            {label}
          </p>
          {children}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {error && <div className="px-4"><FieldError message={error} /></div>}
    </div>
  );
}

export default function ProfileForm({ profile, formRef, onSubmit, session }: Props) {
  const portfolioDomain = getPortfolioDomainSuffix();
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
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [removeBanner, setRemoveBanner] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageSaved, setImageSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    control,
    formState: { errors, dirtyFields },
  } = useForm<ProfileSchema>({
    defaultValues,
    resolver: zodResolver(profileSchema),
  });

  const watchedValues = useWatch({ control });

  const isProfileDirty = useMemo(() => {
    const dirtyKeys = Object.keys(dirtyFields) as (keyof ProfileSchema)[];
    const nonUsernameDirty = dirtyKeys.some(
      (key) => key !== "username" && key !== "avatar" && key !== "banner"
    );
    if (!nonUsernameDirty) return false;

    const nameDirty = ((watchedValues as any)?.name ?? "") !== (defaultValues.name ?? "");
    const taglineDirty = ((watchedValues as any)?.tagline ?? "") !== (defaultValues.tagline ?? "");
    const quoteDirty = ((watchedValues as any)?.quote ?? "") !== (defaultValues.quote ?? "");
    const emailDirty = ((watchedValues as any)?.email ?? "") !== (defaultValues.email ?? "");
    const bioDirty = ((watchedValues as any)?.bio ?? "") !== (defaultValues.bio ?? "");
    const bookCallDirty = ((watchedValues as any)?.bookAcall ?? "") !== (defaultValues.bookAcall ?? "");

    return nameDirty || taglineDirty || quoteDirty || emailDirty || bioDirty || bookCallDirty;
  }, [dirtyFields, watchedValues, defaultValues]);

  const { error: sectionError } = useSectionSave("profile", {
    isDirty: isProfileDirty,
    onSave: async () => {
      await handleSubmit(async (data) => {
        await onSubmit(data);
      })();
    },
    onDiscard: () => {
      reset(defaultValues);
    },
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    };
  }, [avatarPreview, bannerPreview]);

  const queryClient = useQueryClient();
  const emailValue = useWatch({ control, name: "email" });
  const taglineValue = useWatch({ control, name: "tagline" });
  const bookCallValue = useWatch({ control, name: "bookAcall" });
  const quoteValue = useWatch({ control, name: "quote" });
  const bioValue = useWatch({ control, name: "bio" });

  const handleSubmitUsername = async () => {
    setLoading(true);
    const username = getValues("username").trim().toLowerCase();
    if (!username) {
      toast.error("Username cannot be empty");
      setLoading(false);
      return;
    }

    if (isReservedUsername(username)) {
      toast(`${username} can't be a username!`, {
        style: {
          borderRadius: '10px',
          background: '#fff3cd',
          color: '#856404',      
        },
      });
      setLoading(false)
      return;
    }

    const response = await fetch("/api/dashboard/username", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, userId: session?.user?.id as string }),
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

  const handleSubmitImages = async () => {
    if (!avatarFile && !bannerFile && !removeAvatar && !removeBanner) return;
    setImageLoading(true);
    try {
      let avatarUrl: string | null | undefined = removeAvatar ? null : undefined;
      let avatarPublicId: string | null | undefined = removeAvatar ? null : undefined;
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        const res = await fetch("/api/dashboard/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to upload avatar");
        avatarUrl = data.url;
        avatarPublicId = data.publicId;
      }

      let bannerUrl: string | null | undefined = removeBanner ? null : undefined;
      let bannerPublicId: string | null | undefined = removeBanner ? null : undefined;
      if (bannerFile) {
        const formData = new FormData();
        formData.append("file", bannerFile);
        const res = await fetch("/api/dashboard/upload", { method: "POST", body: formData });
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
          avatarPublicId,
          banner: bannerUrl,
          bannerPublicId,
          userId: profile?.userId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save images");

      toast.success("Photos updated successfully");
      setImageSaved(true);
      setTimeout(() => setImageSaved(false), 2500);
      await queryClient.invalidateQueries({ queryKey: ["profile"] });

      setAvatarFile(null);
      setBannerFile(null);
      setRemoveAvatar(false);
      setRemoveBanner(false);
      setValue("avatar", undefined);
      setValue("banner", undefined);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setImageLoading(false);
    }
  };

  const currentBanner = removeBanner ? null : (bannerPreview || profile?.banner);
  const currentAvatar = removeAvatar ? null : (avatarPreview || profile?.avatar);

  const hasPendingImages = !!(avatarFile || bannerFile || removeAvatar || removeBanner);
  const showSaveButton = hasPendingImages || imageLoading;

  return (
    <form
      id="dashboard-form"
      ref={formRef}
      onSubmit={handleSubmit(onSubmit, () => {
        toast.error("Please fix the highlighted fields before saving.");
      })}
    >
      <div className="mb-7">
        <h1 className="font-serif-display text-[1.4rem] font-medium tracking-tight text-(--lf-ink)">
          Profile
        </h1>
        <p className="text-[0.78rem] text-(--lf-muted)">
          How you appear on your public portfolio page
        </p>
      </div>

      {sectionError && (
        <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[0.8rem] flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0" />
          <span>{sectionError}</span>
        </div>
      )}

      <section className="mb-6 rounded-xl border border-(--lf-border) bg-(--lf-surface) p-3 sm:p-3.5 transition-colors">
        <div className="flex h-10 w-full items-center overflow-hidden rounded-lg border border-(--lf-border) bg-(--lf-bg) pl-3 pr-1.5 transition-all focus-within:border-(--lf-ink) focus-within:ring-1 focus-within:ring-(--lf-ink)/20">
          <span className="font-mono text-[0.75rem] text-(--lf-dimmed) select-none shrink-0 font-medium">
            https://{portfolioDomain || "lazyfolio.in"}/
          </span>
          <input
            id="username-input"
            {...register("username")}
            placeholder="yourname"
            aria-label="Portfolio username"
            className="min-w-0 flex-1 bg-transparent px-1.5 font-mono text-[0.8rem] font-medium text-(--lf-ink) outline-none placeholder:text-(--lf-dimmed)"
          />
          <button
            type="button"
            disabled={loading || !dirtyFields.username}
            onClick={handleSubmitUsername}
            aria-label="Save handle"
            className="group inline-flex h-7.5 px-3 shrink-0 items-center justify-center gap-1 rounded-md bg-(--lf-ink) text-(--lf-surface) text-[0.72rem] font-medium cursor-pointer hover:opacity-90 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-35 transition-all font-sans"
          >
            {loading ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <>
                <span>Save</span>
                <ArrowRight
                  size={13}
                  className="transition-transform duration-150 group-hover:translate-x-0.5"
                />
              </>
            )}
          </button>
        </div>

        <p className="mt-2 text-[0.68rem] text-(--lf-muted)">
          Use 3-30 letters, numbers, or underscores.
        </p>
        <FieldError message={errors.username?.message} />
      </section>

      {!profile?.username ? (
        <div className="p-10 border border-(--lf-border) rounded-2xl bg-(--lf-surface) text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-(--lf-accent-soft) flex items-center justify-center text-(--lf-muted)">
            <AtSign size={22} />
          </div>
          <div>
            <p className="text-[1rem] font-serif-display text-(--lf-ink) mb-1">
              Set your username first
            </p>
            <p className="text-[0.82rem] text-(--lf-muted) max-w-xs leading-relaxed">
              Claim a username to unlock avatar, banner, and all profile fields.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-(--lf-border) overflow-hidden mb-5 bg-(--lf-surface) relative">
            <div className="relative h-36 sm:h-44 bg-(--lf-border) overflow-hidden group/banner">
              {currentBanner ? (
                <img
                  src={currentBanner}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
              ) : removeBanner ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-(--lf-border) to-(--lf-tan)/20 text-center px-4">
                  <span className="text-[0.75rem] font-medium text-amber-600 dark:text-amber-400 mb-1">
                    Banner will be removed upon saving
                  </span>
                  <button
                    type="button"
                    onClick={() => setRemoveBanner(false)}
                    className="text-[0.7rem] text-(--lf-muted) hover:text-(--lf-ink) underline cursor-pointer"
                  >
                    Undo removal
                  </button>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-(--lf-border) to-(--lf-tan)/40">
                  <div className="flex flex-col items-center gap-1.5 text-(--lf-muted) opacity-50">
                    <ImageIcon size={24} />
                    <span className="text-[0.65rem] font-mono">no banner</span>
                  </div>
                </div>
              )}

              {/* Hover Overlay Controls - ONLY visible on hover */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 group-hover/banner:bg-black/30 transition-all duration-200 pointer-events-none group-hover/banner:pointer-events-auto">
                <label
                  htmlFor="banner-upload"
                  className="flex items-center gap-1.5 px-3 h-8 rounded-full bg-black/75 hover:bg-black/90 text-white text-[0.72rem] font-medium opacity-0 group-hover/banner:opacity-100 transition-all duration-200 backdrop-blur-sm cursor-pointer shadow-sm"
                >
                  <ImageIcon size={12} />
                  <span>{currentBanner ? "Change banner" : "Upload banner"}</span>
                </label>

                {currentBanner && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setBannerFile(null);
                      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
                      setBannerPreview(null);
                      setRemoveBanner(true);
                      setValue("banner", undefined);
                    }}
                    className="flex items-center gap-1.5 px-3 h-8 rounded-full bg-black/75 hover:bg-red-600 text-white text-[0.72rem] font-medium opacity-0 group-hover/banner:opacity-100 transition-all duration-200 backdrop-blur-sm cursor-pointer shadow-sm"
                  >
                    <X size={12} />
                    <span>Remove</span>
                  </button>
                )}
              </div>

              <input
                id="banner-upload"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                {...register("banner")}
                onChange={(e) => {
                  register("banner").onChange(e);
                  const file = e.target.files?.[0] ?? null;
                  setBannerFile(file);
                  setRemoveBanner(false);
                  if (file) {
                    if (bannerPreview) URL.revokeObjectURL(bannerPreview);
                    setBannerPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </div>

            <div className="px-5 pb-5 pt-0">
              <div className="group/avatar-box relative -mt-10 mb-3 w-fit">
                <label
                  htmlFor="avatar-upload"
                  className="block w-20 h-20 rounded-full border-3 border-(--lf-surface) bg-(--lf-border) cursor-pointer overflow-hidden relative group/avatar shadow-sm"
                >
                  {currentAvatar ? (
                    <img
                      src={currentAvatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-(--lf-border) text-(--lf-muted)">
                      <User size={22} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover/avatar:bg-black/40 transition-colors duration-200 flex items-center justify-center">
                    <Camera
                      size={16}
                      className="text-white opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200"
                    />
                  </div>
                </label>

                {/* Avatar Remove Cross Button - ONLY visible on hover */}
                {currentAvatar && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setAvatarFile(null);
                      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
                      setAvatarPreview(null);
                      setRemoveAvatar(true);
                      setValue("avatar", undefined);
                    }}
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-(--lf-surface) border border-(--lf-border) text-(--lf-muted) hover:text-red-600 dark:hover:text-red-400 hover:border-red-500/40 flex items-center justify-center opacity-0 group-hover/avatar-box:opacity-100 transition-opacity duration-150 z-20 shadow-sm cursor-pointer"
                    title="Remove profile photo"
                    aria-label="Remove profile photo"
                  >
                    <X size={12} />
                  </button>
                )}

                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  {...register("avatar")}
                  onChange={(e) => {
                    register("avatar").onChange(e);
                    const file = e.target.files?.[0] ?? null;
                    setAvatarFile(file);
                    setRemoveAvatar(false);
                    if (file) {
                      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
                      setAvatarPreview(URL.createObjectURL(file));
                    }
                  }}
                />

                {removeAvatar && (
                  <div className="mt-1 flex items-center gap-1 text-[0.68rem] text-amber-600 dark:text-amber-400 font-mono">
                    <span>Photo removed</span>
                    <button
                      type="button"
                      onClick={() => setRemoveAvatar(false)}
                      className="text-(--lf-muted) hover:text-(--lf-ink) underline cursor-pointer ml-1 font-sans"
                    >
                      Undo
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[1rem] font-semibold text-(--lf-ink) leading-tight">
                    {profile?.name || (
                      <span className="text-(--lf-dimmed) font-normal text-[0.9rem]">Your Name</span>
                    )}
                  </p>
                  {profile?.tagline && (
                    <p className="text-[0.78rem] text-(--lf-muted) mt-0.5">{profile.tagline}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSubmitImages}
                  disabled={!hasPendingImages || imageLoading}
                  className={`inline-flex items-center gap-1.5 px-4 h-9 rounded-full border text-[0.75rem] font-semibold transition-all duration-200 font-sans-body shrink-0
                    border-(--lf-ink) bg-(--lf-ink) text-(--lf-bg) cursor-pointer hover:opacity-85
                    disabled:opacity-60 disabled:cursor-not-allowed
                    ${showSaveButton ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
                  `}
                >
                  {imageLoading ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : imageSaved ? (
                    <Check size={12} />
                  ) : null}
                  {imageLoading ? "Saving…" : imageSaved ? "Saved!" : "Save photos"}
                </button>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-[0.72rem] font-semibold tracking-widest text-(--lf-muted) font-sans mb-2 pl-0.5">
              Identity
            </p>
            <div className="rounded-2xl border border-(--lf-border) overflow-hidden bg-(--lf-surface)">
              <FieldRow
                icon={<User size={14} />}
                label="Full name"
                error={errors.name?.message}
              >
                <input
                  {...register("name")}
                  placeholder="Your full name"
                  className="bg-transparent border-none outline-none w-full text-[0.85rem] text-(--lf-ink) placeholder:text-(--lf-dimmed)"
                />
              </FieldRow>

              <FieldRow
                icon={<Mail size={14} />}
                label="Email"
                error={errors.email?.message}
                action={
                  emailValue ? (
                    <button
                      type="button"
                      onClick={() => setValue("email", "", { shouldDirty: true, shouldValidate: true })}
                      className="text-[0.68rem] text-(--lf-muted) hover:text-(--lf-ink) px-2 py-1 rounded-md hover:bg-(--lf-border) transition-colors"
                    >
                      Clear
                    </button>
                  ) : undefined
                }
              >
                <input
                  {...register("email")}
                  placeholder="you@example.com"
                  className="bg-transparent border-none outline-none w-full text-[0.85rem] text-(--lf-ink) placeholder:text-(--lf-dimmed)"
                />
              </FieldRow>

              <FieldRow
                icon={<Zap size={14} />}
                label="Tagline"
                error={errors.tagline?.message}
                noBorder
                action={
                  taglineValue ? (
                    <button
                      type="button"
                      onClick={() => setValue("tagline", "", { shouldDirty: true, shouldValidate: true })}
                      className="text-[0.68rem] text-(--lf-muted) hover:text-(--lf-ink) px-2 py-1 rounded-md hover:bg-(--lf-border) transition-colors"
                    >
                      Clear
                    </button>
                  ) : undefined
                }
              >
                <input
                  {...register("tagline")}
                  placeholder="Full Stack Developer · Open to work"
                  className="bg-transparent border-none outline-none w-full text-[0.85rem] text-(--lf-ink) placeholder:text-(--lf-dimmed)"
                />
              </FieldRow>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-[0.72rem] font-semibold tracking-widest text-(--lf-muted) font-sans mb-2 pl-0.5">
              Presence
            </p>
            <div className="rounded-2xl border border-(--lf-border) overflow-hidden bg-(--lf-surface)">
              <FieldRow
                icon={<Quote size={14} />}
                label="Quote"
                error={errors.quote?.message}
                action={
                  quoteValue ? (
                    <button
                      type="button"
                      onClick={() => setValue("quote", "", { shouldDirty: true, shouldValidate: true })}
                      className="text-[0.68rem] text-(--lf-muted) hover:text-(--lf-ink) px-2 py-1 rounded-md hover:bg-(--lf-border) transition-colors"
                    >
                      Clear
                    </button>
                  ) : undefined
                }
              >
                <input
                  {...register("quote")}
                  placeholder="Art is never finished, only abandoned."
                  className="bg-transparent border-none outline-none w-full text-[0.85rem] text-(--lf-ink) placeholder:text-(--lf-dimmed)"
                />
              </FieldRow>

              <FieldRow
                icon={<Phone size={14} />}
                label="Book a call"
                error={errors.bookAcall?.message}
                action={
                  bookCallValue ? (
                    <button
                      type="button"
                      onClick={() => setValue("bookAcall", "", { shouldDirty: true, shouldValidate: true })}
                      className="text-[0.68rem] text-(--lf-muted) hover:text-(--lf-ink) px-2 py-1 rounded-md hover:bg-(--lf-border) transition-colors"
                    >
                      Clear
                    </button>
                  ) : undefined
                }
              >
                <input
                  {...register("bookAcall")}
                  placeholder="https://cal.com/your-link"
                  className="bg-transparent border-none outline-none w-full text-[0.85rem] text-(--lf-ink) placeholder:text-(--lf-dimmed)"
                />
              </FieldRow>

              <div className="hover:bg-(--lf-accent-soft) transition-colors group">
                <div className="flex items-start gap-3.5 px-4 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.6rem] font-semibold tracking-widest uppercase text-(--lf-muted) font-mono mb-1">
                      Bio
                    </p>
                    <textarea
                      {...register("bio")}
                      placeholder="Tell visitors a bit about yourself…"
                      rows={4}
                      className="bg-transparent border-none outline-none w-full text-[0.85rem] text-(--lf-ink) placeholder:text-(--lf-dimmed) resize-none leading-relaxed"
                    />
                  </div>
                  {bioValue && (
                    <button
                      type="button"
                      onClick={() => setValue("bio", "", { shouldDirty: true, shouldValidate: true })}
                      className="text-[0.68rem] text-(--lf-muted) hover:text-(--lf-ink) px-2 py-1 rounded-md hover:bg-(--lf-border) transition-colors shrink-0 mt-0.5"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <FieldError message={errors.bio?.message} />
              </div>
            </div>
          </div>
        </>
      )}
    </form>
  );
}
