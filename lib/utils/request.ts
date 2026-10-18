// Shared fetch layer for dashboard mutations. Every mutation hook follows the
// same contract: parse JSON (tolerating an empty body), throw the server's
// `error` field on non-OK, and return the payload on success.
export async function requestJson<T = unknown>(
  url: string,
  fallbackMessage: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(url, init);
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      (payload as { error?: string } | null)?.error || fallbackMessage,
    );
  }

  return payload as T;
}

export function postJson<T = unknown>(
  url: string,
  body: unknown,
  fallbackMessage: string,
) {
  return requestJson<T>(url, fallbackMessage, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function patchJson<T = unknown>(
  url: string,
  body: unknown,
  fallbackMessage: string,
) {
  return requestJson<T>(url, fallbackMessage, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function deleteJson<T = unknown>(url: string, fallbackMessage: string) {
  return requestJson<T>(url, fallbackMessage, { method: "DELETE" });
}
