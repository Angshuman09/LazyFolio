import { z } from "zod";

const stringOrEmpty = (min = 1, max?: number) => {
  const base = max
    ? z.string().min(min).max(max)
    : z.string().min(min);

  return z.union([z.literal(""), base]);
};

const singleExperienceSchema = z.object({
  companyName: stringOrEmpty(2, 120).optional(),
  role: stringOrEmpty(2, 120).optional(),
  startdate: stringOrEmpty(1, 50).optional(),
  enddate: stringOrEmpty(1, 50).optional(),
  description: stringOrEmpty(10, 800).optional(),
});

export const experienceSchema = z.object({
  experiences: z.array(singleExperienceSchema).optional(),
});

export type SingleExperience = z.infer<typeof singleExperienceSchema>;
export type ExperienceSchema = z.infer<typeof experienceSchema>;