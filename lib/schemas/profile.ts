import { z } from "zod";
import {
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_PATTERN,
} from "@/lib/utils/username";

export const profileSchema = z.object({
  userId: z.string(),
  name: z.string().min(1),
  email: z.union([z.literal(""), z.string().email()]).optional(),
  quote: z.string().min(1).optional().or(z.literal("")),
  username: z
    .string()
    .min(USERNAME_MIN_LENGTH)
    .max(USERNAME_MAX_LENGTH)
    .regex(USERNAME_PATTERN, {
      message:
        "Use 3-30 characters: lowercase letters, numbers, and hyphens (not at the start or end).",
    }),
  tagline: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  avatar: z.any().optional(),
  banner: z.any().optional(),
  bookAcall: z.union([z.url(), z.literal("")]).optional(),
  themeId: z.string().optional(),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
