import { z } from "zod";

export const profileSchema = z.object({
  userId: z.string(),
  name: z.string().min(1),
  email: z.union([z.literal(""), z.string().email()]).optional(),
  quote: z.string().min(1).optional().or(z.literal("")),
  username: z.string().min(3).max(20),
  tagline: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  avatar: z.any().optional(),
  banner: z.any().optional(),
  bookAcall: z.union([z.url(), z.literal("")]).optional(),
  themeId: z.string().optional(),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
