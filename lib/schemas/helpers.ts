import { z } from "zod";

// Dashboard forms store optional text fields as "" when untouched, so every
// optional input accepts either an empty literal or a bounded string.
export function stringOrEmpty({
  min,
  max,
}: { min?: number; max?: number } = {}) {
  let schema = z.string();
  if (min !== undefined) schema = schema.min(min);
  if (max !== undefined) schema = schema.max(max);
  return z.union([z.literal(""), schema]);
}
