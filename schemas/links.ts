import { z } from "zod";

const stringOrEmpty = (max?: number) => {
  const base = max ? z.string().max(max) : z.string();
  return z.union([z.literal(""), base]);
};

export const linksSchema = z.object({
  links: z
    .array(
      z.object({
        id: z.string().optional(),
        label: stringOrEmpty(120).optional(),
        url: z.union([z.literal(""), z.string().url()]).optional(),
      }),
    )
    .optional(),
});

export type LinksSchema = z.infer<typeof linksSchema>;

