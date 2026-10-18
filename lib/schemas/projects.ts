import { z } from "zod";
import { stringOrEmpty } from "./helpers";

export const projectsSchema = z.object({
  projects: z
    .array(
      z.object({
        id: z.string().optional(),
        title: stringOrEmpty({ max: 160 }).optional(),
        description: stringOrEmpty({ max: 800 }).optional(),
        githubLink: z.union([z.literal(""), z.string().url()]).optional(),
        projectLink: z.union([z.literal(""), z.string().url()]).optional(),
        techstack: stringOrEmpty({ max: 300 }).optional(),
        enddate: stringOrEmpty({ max: 50 }).optional(),
        isenable: z.boolean().optional(),
      }),
    )
    .optional(),
});

export type ProjectsSchema = z.infer<typeof projectsSchema>;
