import { z } from "zod";

const stringOrEmpty = (max?: number) => {
  const base = max ? z.string().max(max) : z.string();
  return z.union([z.literal(""), base]);
};

export const experienceSchema = z.object({
  experiences: z
    .array(
      z.object({
        companyName: stringOrEmpty(120).optional(),
        role: stringOrEmpty(120).optional(),
        startdate: stringOrEmpty(50).optional(),
        enddate: stringOrEmpty(50).optional(),
        description: stringOrEmpty(800).optional(),
      }),
    )
    .optional(),
});

export type ExperienceSchema = z.infer<typeof experienceSchema>;