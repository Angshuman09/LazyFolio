/**
 * Detects whether reordering happened, ignoring pure additions/removals
 * (those are caught by the field-level dirty checks in each form).
 *
 * Compares the relative order of the ids that are present in both the current
 * form state and the saved server state. If that sequence differs, the items
 * were reordered.
 */
export function hasOrderChanged(
  current: ReadonlyArray<string | null | undefined>,
  saved: ReadonlyArray<string | null | undefined>,
): boolean {
  const currentSeq = current.filter((id): id is string => Boolean(id));
  const savedSeq = saved.filter((id): id is string => Boolean(id));

  const savedSet = new Set(savedSeq);
  const currentSet = new Set(currentSeq);

  const filteredCurrent = currentSeq.filter((id) => savedSet.has(id));
  const filteredSaved = savedSeq.filter((id) => currentSet.has(id));

  if (filteredCurrent.length !== filteredSaved.length) {
    return true;
  }

  for (let index = 0; index < filteredCurrent.length; index += 1) {
    if (filteredCurrent[index] !== filteredSaved[index]) {
      return true;
    }
  }

  return false;
}
