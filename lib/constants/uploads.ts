export const ALLOWED_IMAGE_TYPES: readonly string[] = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export const ALLOWED_IMAGE_TYPES_SET = new Set<string>(ALLOWED_IMAGE_TYPES);

export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const IMAGE_ACCEPT_ATTRIBUTE = ALLOWED_IMAGE_TYPES.join(",");
