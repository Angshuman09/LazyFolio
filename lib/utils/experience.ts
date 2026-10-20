import { readDashboardDraft } from "../cache/dashboard-drafts";
import { ExperienceSchema, SingleExperience } from "../schemas/experience";


export type ExperienceProfile = {
    id?: string;
    experiences?: SingleExperience[];
};

function normalizeDate(value: string | Date | null | undefined) {
    if (!value) return "";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : date.toISOString().slice(0, 10);
}

export function experiencesFromProfile(experiences: SingleExperience[] = []): ExperienceSchema {
    return {
      experiences: experiences.map((experience) => ({
        id: experience.id || undefined,
        role: experience.role || "",
        companyName: experience.companyName || "",
        description: experience.description || "",
        startdate: normalizeDate(experience.startdate),
        enddate: normalizeDate(experience.enddate),
        isenable: experience.isenable ?? true,
      })),
    };
  }

export function getInitialExperiences(profile?: ExperienceProfile): ExperienceSchema {
    const saved = experiencesFromProfile(profile?.experiences || []);
    const draft = readDashboardDraft<ExperienceSchema>("experience", profile?.id);
    if (!draft) return saved;

    const normalizeRows = (rows: ExperienceSchema["experiences"]) =>
      (rows || [])
        .map((row) => ({
          role: row.role?.trim() || "",
          companyName: row.companyName?.trim() || "",
          description: row.description?.trim() || "",
          startdate: normalizeDate(row.startdate),
          enddate: normalizeDate(row.enddate),
          isenable: row.isenable ?? true,
        }))
        .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));

    // Drafts created before incremental saves can contain empty IDs.
    // If their content already matches the server, discard that stale draft.
    if (JSON.stringify(normalizeRows(draft.experiences)) === JSON.stringify(normalizeRows(saved.experiences))) {
      return saved;
    }
    return draft;
  }

