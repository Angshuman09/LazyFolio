import { z } from "zod";

const stringOrEmpty = (max?: number) => {
  const base = max ? z.string().max(max) : z.string();
  return z.union([z.literal(""), base]);
};

export const projectsSchema = z.object({
  projects: z
    .array(
      z.object({
        title: stringOrEmpty(160).optional(),
        description: stringOrEmpty(800).optional(),
        githubLink: z.union([z.literal(""), z.string().url()]).optional(),
        projectLink: z.union([z.literal(""), z.string().url()]).optional(),
        // Stored as a comma-separated string in the form for simpler editing.
        techstack: stringOrEmpty(300).optional(),
        enddate: stringOrEmpty(50).optional(),
      }),
    )
    .optional(),
});

export type ProjectsSchema = z.infer<typeof projectsSchema>;