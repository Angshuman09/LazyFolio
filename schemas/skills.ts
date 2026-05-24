import { z } from "zod";

export const skillsSchema = z.object({
  skills: z
    .array(
      z.object({
        value: z.string().max(80).optional().or(z.literal("")),
      }),
    )
    .optional(),
});

export type SkillsSchema = z.infer<typeof skillsSchema>;