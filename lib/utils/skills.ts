import type { FieldErrors } from "react-hook-form";

export interface ParsedSkill {
  value: string;
  isenable: boolean;
}

export function parseSkill(s: string): ParsedSkill {
  try {
    const parsed = JSON.parse(s);
    if (parsed && typeof parsed === "object" && "value" in parsed) {
      return {
        value: parsed.value || "",
        isenable: typeof parsed.isenable === "boolean" ? parsed.isenable : true,
      };
    }
  } catch {
    console.error("Error parsing skill JSON");
  }
  return {
    value: s || "",
    isenable: true,
  };
}

export function hasFieldArrayErrors(
  errors: FieldErrors,
  arrayName: string,
  index: number,
): boolean {
  const arrayErrors = errors[arrayName];
  if (!arrayErrors || !Array.isArray(arrayErrors)) {
    return false;
  }

  const itemErrors = arrayErrors[index];
  if (!itemErrors || typeof itemErrors !== "object") {
    return false;
  }

  return Object.values(itemErrors).some((error) => {
    if (!error || typeof error !== "object") {
      return false;
    }

    return "message" in error && Boolean((error as { message?: string }).message);
  });
}
