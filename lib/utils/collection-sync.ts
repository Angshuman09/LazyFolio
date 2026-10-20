import { ApiError } from "@/lib/errors/api";

type Identifiable = { id?: string | null };

export type CollectionDiff<TIncoming extends Identifiable> = {
  /** Rows that do not exist in the database yet. */
  creates: TIncoming[];
  /** Existing rows whose content actually changed. */
  updates: TIncoming[];
  /** Existing rows that already match the incoming content. */
  unchanged: TIncoming[];
  /** Stored row ids that are no longer present in the incoming collection. */
  removedIds: string[];
};

/**
 * Diffs an incoming collection against the rows already stored for a profile.
 *
 * Bulk saves used to delete every row and recreate them, which regenerated ids
 * and made a one-item change write the whole collection. Diffing keeps existing
 * rows in place so a save only touches what the user actually changed.
 *
 * Incoming ids are validated against the stored ids, so a caller can never
 * update or delete a row belonging to another profile.
 */
export function diffCollection<
  TIncoming extends Identifiable,
  TExisting extends { id: string },
>(
  existing: TExisting[],
  incoming: TIncoming[],
  isEqual: (existing: TExisting, incoming: TIncoming) => boolean,
): CollectionDiff<TIncoming> {
  const existingById = new Map(existing.map((item) => [item.id, item]));
  const keptIds = new Set<string>();
  const creates: TIncoming[] = [];
  const updates: TIncoming[] = [];
  const unchanged: TIncoming[] = [];

  for (const item of incoming) {
    const id = item.id?.trim();

    if (!id) {
      creates.push(item);
      continue;
    }

    const current = existingById.get(id);

    if (!current) {
      throw new ApiError(
        "One or more items no longer exist or do not belong to this profile.",
        403,
      );
    }

    // A duplicated id would otherwise be written twice.
    if (keptIds.has(id)) continue;

    keptIds.add(id);

    if (isEqual(current, item)) {
      unchanged.push(item);
    } else {
      updates.push(item);
    }
  }

  const removedIds = existing
    .filter((item) => !keptIds.has(item.id))
    .map((item) => item.id);

  return { creates, updates, unchanged, removedIds };
}
