import { z } from "zod";
import { stringOrEmpty } from "./helpers";

export const linksSchema = z.object({
  links: z
    .array(
      z.object({
        id: z.string().optional(),
        label: stringOrEmpty({ max: 120 }).optional(),
        url: z.union([z.literal(""), z.string().url()]).optional(),
        type: z.enum(["GITHUB", "LINKEDIN", "X", "INSTAGRAM", "CUSTOM"]).optional(),
        isenable: z.boolean().optional(),
      }),
    )
    .optional(),
});

export type LinksSchema = z.infer<typeof linksSchema>;
