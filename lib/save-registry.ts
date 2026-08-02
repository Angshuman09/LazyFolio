import type { DashboardSection } from "./save-store";
import { useSaveStore } from "./save-store";
import { clearDashboardDraft } from "./cache/dashboard-drafts";

const saveRegistry = new Map<DashboardSection, () => Promise<void>>();
const discardRegistry = new Map<DashboardSection, () => void>();

export function registerSave(section: DashboardSection, saveFn: () => Promise<void>) {
  saveRegistry.set(section, saveFn);
}

export function unregisterSave(section: DashboardSection) {
  saveRegistry.delete(section);
}

export function registerDiscard(section: DashboardSection, discardFn: () => void) {
  discardRegistry.set(section, discardFn);
}

export function unregisterDiscard(section: DashboardSection) {
  discardRegistry.delete(section);
}

export function getSaveFn(section: DashboardSection): (() => Promise<void>) | undefined {
  return saveRegistry.get(section);
}

export function getRegisteredSections(): DashboardSection[] {
  return Array.from(saveRegistry.keys());
}

export function hasSaveFn(section: DashboardSection): boolean {
  return saveRegistry.has(section);
}

export function discardSection(section: DashboardSection, profileId?: string) {
  clearDashboardDraft(section, profileId);
  const discardFn = discardRegistry.get(section);
  if (discardFn) {
    discardFn();
  }
  useSaveStore.getState().markClean(section);
}

export async function saveAllSections(
  sections: DashboardSection[],
): Promise<{ succeeded: DashboardSection[]; failed: { section: DashboardSection; error: string }[] }> {
  const succeeded: DashboardSection[] = [];
  const failed: { section: DashboardSection; error: string }[] = [];

  const promises = sections.map(async (section) => {
    const fn = saveRegistry.get(section);
    if (!fn) {
      failed.push({ section, error: "Save function not registered" });
      return;
    }

    try {
      await fn();
      succeeded.push(section);
    } catch (err) {
      failed.push({
        section,
        error: err instanceof Error ? err.message : "Save failed",
      });
    }
  });

  await Promise.allSettled(promises);

  return { succeeded, failed };
}

