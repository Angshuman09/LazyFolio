import { z } from "zod";

const stringOrEmpty = (max?: number) => {
  const base = max ? z.string().max(max) : z.string();
  return z.union([z.literal(""), base]);
};

export const blogsSchema = z.object({
  blogs: z
    .array(
      z.object({
        id: z.string().optional(),
        title: stringOrEmpty(160).optional(),
        description: stringOrEmpty(800).optional(),
        blogLink: stringOrEmpty().optional(),
        enddate: stringOrEmpty(50).optional(),
        content: z.string().optional().nullable(),
        isPublished: z.boolean().optional(),
        slug: z.string().optional().nullable(),
      }),
    )
    .optional(),
});

export type BlogsSchema = z.infer<typeof blogsSchema>;
