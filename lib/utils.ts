import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { FieldErrors } from "react-hook-form"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function hasFieldArrayErrors(
  errors: FieldErrors,
  arrayName: string,
  index: number,
): boolean {
  const arrayErrors = errors[arrayName]
  if (!arrayErrors || !Array.isArray(arrayErrors)) {
    return false
  }

  const itemErrors = arrayErrors[index]
  if (!itemErrors || typeof itemErrors !== "object") {
    return false
  }

  return Object.values(itemErrors).some((error) => {
    if (!error || typeof error !== "object") {
      return false
    }

    return "message" in error && Boolean((error as { message?: string }).message)
  })
}
