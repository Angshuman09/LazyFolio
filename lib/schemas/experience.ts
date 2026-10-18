import { z } from "zod";
import { stringOrEmpty } from "./helpers";

const singleExperienceSchema = z.object({
  id: z.string().optional(),
  companyName: stringOrEmpty({ min: 2, max: 120 }).optional(),
  role: stringOrEmpty({ min: 2, max: 120 }).optional(),
  startdate: stringOrEmpty({ min: 1, max: 50 }).optional(),
  enddate: stringOrEmpty({ min: 1, max: 50 }).optional(),
  description: stringOrEmpty({ min: 10, max: 800 }).optional(),
  isenable: z.boolean().optional(),
});

export const experienceSchema = z.object({
  experiences: z.array(singleExperienceSchema).optional(),
});

export type SingleExperience = z.infer<typeof singleExperienceSchema>;
export type ExperienceSchema = z.infer<typeof experienceSchema>;
