import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  quote: z.string().min(3),
  username: z.string().min(3).max(20),
  tagline: z.string().max(100).optional(),
  location: z.string().optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional().or(z.literal("")),
  banner: z.string().url().optional().or(z.literal("")),
});

export type ProfileSchema = z.infer<typeof profileSchema>;