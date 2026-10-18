import { z } from "zod";
import { stringOrEmpty } from "./helpers";

export const blogsSchema = z.object({
  blogs: z
    .array(
      z.object({
        id: z.string().optional(),
        type: z.enum(["INTERNAL", "EXTERNAL"]).optional(),
        title: stringOrEmpty({ max: 160 }).optional(),
        description: stringOrEmpty({ max: 800 }).optional(),
        blogLink: stringOrEmpty({}).optional(),
        content: z.string().optional().nullable(),
        isPublished: z.boolean().optional(),
        isEnabled: z.boolean().optional(),
        slug: z.string().optional().nullable(),
      }),
    )
    .optional(),
});

export type BlogsSchema = z.infer<typeof blogsSchema>;
